/**
 * Enhanced Pest Detection & Severity Analysis
 * Provides detailed classification with agronomic context
 */

import { COFFEE_PESTS, getPestInfo } from './coffeePestDatabase';
import { analyzePestRiskByClimate } from './phenologicalCalendar';

/**
 * Analyze detections and classify severity
 * @param {Array} detections - Predictions from model
 * @param {Object} contextData - {temperature, humidity, altitude, variety, date, etc}
 * @returns {Object} - Enhanced detection with severity and explanations
 */
export function analyzeDetectionsWithSeverity(detections, contextData = {}) {
    if (!detections || detections.length === 0) {
        return {
            totalDetections: 0,
            overallSeverity: 'SANO',
            overallSeverityScore: 0,
            detections: [],
            contextAnalysis: {
                climateRisk: [],
                environmentalFactors: [],
                seasonalContext: ''
            },
            recommendations: []
        };
    }

    const analyzedDetections = detections.map((det, idx) => {
        const pestInfo = getPestInfo(det.class);
        const severity = calculateSeverity(det, contextData);

        return {
            id: idx,
            class: det.class,
            confidence: det.score,
            bbox: det.bbox,
            severity: severity.level,
            severityScore: severity.score,
            explanation: generateExplanation(det, severity, pestInfo, contextData),
            riskFactors: identifyRiskFactors(det.class, contextData),
            urgency: calculateUrgency(severity.level, det.score),
            pestInfo: {
                scientificName: pestInfo?.scientificName,
                altitudeOptimal: pestInfo?.altitudeRange,
                temperatureOptimal: pestInfo?.temperatureRange
            }
        };
    });

    // Calculate overall field severity
    const overallSeverity = calculateOverallSeverity(analyzedDetections);

    return {
        totalDetections: detections.length,
        overallSeverity: overallSeverity.level,
        overallSeverityScore: overallSeverity.score,
        detections: analyzedDetections,
        contextAnalysis: analyzeContext(contextData, analyzedDetections),
        recommendations: generateRecommendations(analyzedDetections, contextData)
    };
}

/**
 * Classify severity of individual detection
 * Based on: confidence score, image region analysis, pest type
 */
function calculateSeverity(detection, contextData) {
    const { score } = detection;
    let severityScore = 0;
    let level = 'LEVE';

    // Confidence-based scoring
    if (score >= 0.85) severityScore += 0.4;
    else if (score >= 0.70) severityScore += 0.25;
    else if (score >= 0.55) severityScore += 0.10;

    // Increase severity if multiple detections of same pest (from context)
    if (contextData.detectionCount && contextData.detectionCount > 3) {
        severityScore += 0.3;
    }

    // Regional analysis (larger bbox = more damage)
    if (detection.bbox) {
        const bboxArea = calculateBboxArea(detection.bbox);
        if (bboxArea > 5000) severityScore += 0.2; // Large lesion
        else if (bboxArea > 2000) severityScore += 0.1;
    }

    // Classify
    if (severityScore >= 0.65) {
        level = 'SEVERA';
    } else if (severityScore >= 0.40) {
        level = 'MODERADA';
    } else {
        level = 'LEVE';
    }

    return { level, score: Math.min(1, severityScore) };
}

/**
 * Calculate bbox area in pixels
 */
function calculateBboxArea(bbox) {
    if (bbox.length === 4) {
        const [x1, y1, x2, y2] = bbox;
        return (x2 - x1) * (y2 - y1);
    }
    return 0;
}

/**
 * Calculate overall field severity from all detections
 */
function calculateOverallSeverity(analyzedDetections) {
    if (analyzedDetections.length === 0) {
        return { level: 'SANO', score: 0 };
    }

    const scores = analyzedDetections.map(d => d.severityScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);

    // Weight by count + average severity
    const weightedScore = (analyzedDetections.length * 0.1) + (maxScore * 0.6) + (avgScore * 0.3);

    let level = 'LEVE';
    if (weightedScore >= 0.65) {
        level = 'SEVERA';
    } else if (weightedScore >= 0.40) {
        level = 'MODERADA';
    }

    return { level, score: Math.min(1, weightedScore) };
}

/**
 * Generate detailed explanation for detection
 */
function generateExplanation(detection, severity, pestInfo, contextData) {
    const { class: pestClass, score } = detection;
    const { level: severityLevel } = severity;
    const { temperature, humidity, altitude } = contextData;

    let explanation = `**${pestClass}** detectada con ${Math.round(score * 100)}% de confianza.\n\n`;

    if (pestInfo) {
        explanation += `📋 **Información del insecto:**\n`;
        explanation += `- Nombre científico: *${pestInfo.scientificName}*\n`;
        explanation += `- Rango de altitud óptimo: ${pestInfo.altitudeRange.min}-${pestInfo.altitudeRange.max}m\n`;
        explanation += `- Temperatura óptima: ${pestInfo.temperatureRange.min}-${pestInfo.temperatureRange.max}°C\n\n`;
    }

    // Explain severity
    explanation += `🚨 **Severidad: ${severityLevel}**\n`;
    if (severityLevel === 'SEVERA') {
        explanation += `- Nivel crítico detectado\n- Intervención inmediata recomendada\n`;
    } else if (severityLevel === 'MODERADA') {
        explanation += `- Nivel intermedio\n- Control próximos 3-5 días\n`;
    } else {
        explanation += `- Nivel bajo\n- Monitoreo continuo\n`;
    }

    // Environmental factors
    if (temperature && humidity && altitude) {
        explanation += `\n🌡️ **Condiciones ambientales favorables:**\n`;
        if (temperature >= pestInfo?.temperatureRange.min && temperature <= pestInfo?.temperatureRange.max) {
            explanation += `✓ Temperatura (${temperature}°C) dentro rango óptimo\n`;
        }
        if (humidity >= pestInfo?.humidityOptimal?.min) {
            explanation += `✓ Humedad relativa (${humidity}%) favorable\n`;
        }
    }

    return explanation;
}

/**
 * Identify risk factors that favor this pest
 */
function identifyRiskFactors(pestClass, contextData) {
    const { temperature, humidity, altitude } = contextData;
    const pestInfo = getPestInfo(pestClass);
    const factors = [];

    if (!pestInfo) return factors;

    // Temperature
    if (temperature >= pestInfo.temperatureRange.min && temperature <= pestInfo.temperatureRange.max) {
        factors.push(`Temperatura óptima: ${temperature}°C (rango ${pestInfo.temperatureRange.min}-${pestInfo.temperatureRange.max}°C)`);
    }

    // Humidity
    if (humidity >= pestInfo.humidityOptimal.min && humidity <= pestInfo.humidityOptimal.max) {
        factors.push(`Humedad favorable: ${humidity}% (rango ${pestInfo.humidityOptimal.min}-${pestInfo.humidityOptimal.max}%)`);
    }

    // Altitude
    if (altitude >= pestInfo.altitudeRange.min && altitude <= pestInfo.altitudeRange.max) {
        factors.push(`Altitud dentro rango: ${altitude}m (${pestInfo.altitudeRange.min}-${pestInfo.altitudeRange.max}m)`);
    }

    return factors;
}

/**
 * Calculate urgency level for action
 */
function calculateUrgency(severityLevel, confidence) {
    let urgency = 'MONITOREO';

    if (severityLevel === 'SEVERA' && confidence > 0.80) {
        urgency = 'CRITICA';
    } else if (severityLevel === 'SEVERA' || (severityLevel === 'MODERADA' && confidence > 0.80)) {
        urgency = 'ALTA';
    } else if (severityLevel === 'MODERADA') {
        urgency = 'MEDIA';
    }

    return urgency;
}

/**
 * Analyze contextual factors affecting pest dynamics
 */
function analyzeContext(contextData) {
    const { temperature, humidity, altitude, date, hemisphere } = contextData;

    const analysis = {
        climateRisk: temperature && humidity ? analyzePestRiskByClimate({
            temperature,
            humidity,
            altitude: altitude || 1200,
            month: date ? date.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'JANUARY',
            hemisphere: hemisphere || 'NORTHERN_HEMISPHERE'
        }) : [],
        environmentalFactors: [],
        seasonalContext: ''
    };

    // Seasonal context
    if (date) {
        const month = date.getMonth();
        if ([10, 11, 0, 1, 2].includes(month)) { // Oct-Feb (dry season in Colombia)
            analysis.seasonalContext = 'Época seca - Menor presión de plagas fúngicas';
        } else { // Mar-Sep (rainy)
            analysis.seasonalContext = 'Época lluviosa - Mayor presión de enfermedades';
        }
    }

    // Environmental stress factors
    if (humidity > 90) {
        analysis.environmentalFactors.push('⚠️ Humedad muy alta (>90%) - Favorece hongos y algunos insectos');
    }
    if (humidity < 50) {
        analysis.environmentalFactors.push('⚠️ Ambiente muy seco (<50%) - Favorece ácaros (Arañita roja)');
    }
    if (temperature > 28) {
        analysis.environmentalFactors.push('⚠️ Temperatura alta (>28°C) - Acelera ciclos de plagas');
    }

    return analysis;
}

/**
 * Generate actionable recommendations based on detections
 */
function generateRecommendations(analyzedDetections, contextData) {
    const recommendations = [];

    // Group by pest class
    const pestGroups = {};
    analyzedDetections.forEach(det => {
        if (!pestGroups[det.class]) {
            pestGroups[det.class] = [];
        }
        pestGroups[det.class].push(det);
    });

    Object.entries(pestGroups).forEach(([pestClass, detections]) => {
        const pestInfo = getPestInfo(pestClass);
        if (!pestInfo) return;

        const avgSeverity = detections.reduce((sum, d) => sum + d.severityScore, 0) / detections.length;
        const severityLevel = avgSeverity >= 0.65 ? 'SEVERA' : avgSeverity >= 0.40 ? 'MODERADA' : 'LEVE';

        // Get treatments by severity
        const treatments = pestInfo.treatments;

        const recommendation = {
            pest: pestClass,
            severity: severityLevel,
            detectionCount: detections.length,
            affectedArea: calculateAffectedArea(detections),
            immediateActions: [],
            treatments: []
        };

        // Immediate actions
        if (severityLevel === 'SEVERA') {
            recommendation.immediateActions.push('✓ Inspección detallada de campo completo TODAY');
            recommendation.immediateActions.push('✓ Consultar técnico agrícola local ASAP');
            recommendation.immediateActions.push('✓ Preparar plan de intervención emergencia');
        } else if (severityLevel === 'MODERADA') {
            recommendation.immediateActions.push('✓ Inspección intensiva próximos 2-3 días');
            recommendation.immediateActions.push('✓ Preparar materiales para control');
        }

        // Add treatment recommendations (ordered by context)
        const { temperature } = contextData;

        if (temperature && temperature < 25) {
            // Cold climate - favor biological
            recommendation.treatments.push(...treatments.biological.slice(0, 2));
        }

        recommendation.treatments.push(...treatments.cultural.slice(0, 2));

        if (severityLevel === 'SEVERA') {
            // Include chemical options for severe cases
            recommendation.treatments.push(...treatments.chemical.slice(0, 1));
        } else {
            // For moderate/light: prioritize organic
            recommendation.treatments.push(...treatments.organic.slice(0, 1));
        }

        recommendations.push(recommendation);
    });

    return recommendations;
}

/**
 * Calculate total affected area
 */
function calculateAffectedArea(detections) {
    let totalArea = 0;
    detections.forEach(det => {
        if (det.bbox) {
            totalArea += calculateBboxArea(det.bbox);
        }
    });
    return Math.round(totalArea / 100) / 100; // Convert to cm² (approx)
}

/**
 * Generate comparison before/after for tracking
 */
export function generateComparisonReport(previousAnalysis, currentAnalysis) {
    return {
        period: {
            from: previousAnalysis.timestamp,
            to: currentAnalysis.timestamp
        },
        severityTrend: {
            previous: previousAnalysis.overallSeverity,
            current: currentAnalysis.overallSeverity,
            trend: compareSeverity(previousAnalysis.overallSeverity, currentAnalysis.overallSeverity)
        },
        detectionTrend: {
            previous: previousAnalysis.totalDetections,
            current: currentAnalysis.totalDetections,
            change: currentAnalysis.totalDetections - previousAnalysis.totalDetections
        },
        effectiveness: calculateTreatmentEffectiveness(previousAnalysis, currentAnalysis)
    };
}

function compareSeverity(prev, curr) {
    const order = { 'SANO': 0, 'LEVE': 1, 'MODERADA': 2, 'SEVERA': 3 };
    const diff = order[curr] - order[prev];
    if (diff > 0) return 'AUMENTÓ ⬆️ (Preocupante)';
    if (diff < 0) return 'MEJORÓ ⬇️ (Positivo)';
    return 'SIN CAMBIOS →';
}

function calculateTreatmentEffectiveness(prev, curr) {
    const reduction = ((prev.totalDetections - curr.totalDetections) / prev.totalDetections) * 100;
    return {
        detectionReduction: Math.round(reduction),
        status: reduction > 50 ? 'MUY EFECTIVO' : reduction > 20 ? 'EFECTIVO' : 'MONITOREO CONTINUO'
    };
}
