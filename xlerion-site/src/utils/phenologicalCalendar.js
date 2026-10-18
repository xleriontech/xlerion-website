/**
 * Coffee Phenological Calendar & Climate System
 * Tracks coffee plant development stages and pest risk windows
 */

export const PHENOLOGICAL_STAGES = {
    DORMANCY: {
        code: 0,
        name: 'Dormancia',
        description: 'Periodo de reposo, sin crecimiento visible',
        duration: '4-6 semanas post-cosecha',
        pestRisk: 'Bajo',
        interventions: ['Poda', 'Fertilización']
    },
    SPROUTING: {
        code: 1,
        name: 'Brotación',
        description: 'Emergencia de nuevos brotes y hojas',
        duration: '2-3 semanas',
        pestRisk: 'Medio-Alto (Minador)',
        interventions: ['Monitoreo', 'Control preventivo']
    },
    VEGETATIVE_GROWTH: {
        code: 2,
        name: 'Crecimiento vegetativo',
        description: 'Desarrollo de ramas y expansión foliar',
        duration: '6-8 semanas',
        pestRisk: 'Medio',
        interventions: ['Manejo agronómico', 'Fertilización']
    },
    PRE_FLOWERING: {
        code: 3,
        name: 'Pre-floración',
        description: 'Formación de botones florales',
        duration: '2-4 semanas',
        pestRisk: 'Bajo-Medio',
        interventions: ['Riego', 'Control de maleza']
    },
    FLOWERING: {
        code: 4,
        name: 'Floración',
        description: 'Flores abiertas (duran 3-5 días)',
        duration: '3-5 semanas (escalonada)',
        pestRisk: 'Bajo (no aplicar químicos)',
        interventions: ['Mantener riego', 'Proteger polinizadores']
    },
    FRUIT_SET: {
        code: 5,
        name: 'Cuaje de fruto',
        description: 'Inicio de desarrollo de fruto',
        duration: '1-2 semanas',
        pestRisk: 'Bajo',
        interventions: ['Nutrición balanceada']
    },
    FRUIT_DEVELOPMENT: {
        code: 6,
        name: 'Desarrollo de fruto',
        description: 'Crecimiento del fruto verde',
        duration: '6-8 semanas',
        pestRisk: 'Medio (Broca inicio)',
        interventions: ['Monitoreo de broca', 'Control preventivo']
    },
    MATURATION: {
        code: 7,
        name: 'Maduración',
        description: 'Fruto rojo/amarillo, listo cosecha',
        duration: '2-4 semanas',
        pestRisk: 'Alto (Broca activa)',
        interventions: ['Cosecha oportuna', 'Control de broca']
    },
    HARVESTING: {
        code: 8,
        name: 'Cosecha',
        description: 'Recolección de frutos maduros',
        duration: '4-6 semanas',
        pestRisk: 'Medio-Alto',
        interventions: ['Cosecha selectiva', 'Recolección de caídos']
    },
    POST_HARVEST: {
        code: 9,
        name: 'Post-cosecha',
        description: 'Recuperación y preparación para próximo ciclo',
        duration: '4-8 semanas',
        pestRisk: 'Bajo-Medio',
        interventions: ['Poda sanitaria', 'Fertilización']
    }
};

/**
 * Monthly phenological calendar by hemisphere
 * Returns likely stage for given month
 */
export const PHENOLOGICAL_CALENDAR = {
    NORTHERN_HEMISPHERE: {
        // Main crop: Oct-Dec (Northern Colombia, Nariño)
        JANUARY: { stage: PHENOLOGICAL_STAGES.DORMANCY, cropType: 'Post-cosecha 1', confidence: 'Alto' },
        FEBRUARY: { stage: PHENOLOGICAL_STAGES.POST_HARVEST, cropType: 'Recuperación 1', confidence: 'Medio-Alto' },
        MARCH: { stage: PHENOLOGICAL_STAGES.SPROUTING, cropType: 'Brotación cosecha 2', confidence: 'Alto' },
        APRIL: { stage: PHENOLOGICAL_STAGES.VEGETATIVE_GROWTH, cropType: 'Crecimiento 2', confidence: 'Medio-Alto' },
        MAY: { stage: PHENOLOGICAL_STAGES.PRE_FLOWERING, cropType: 'Pre-floración 2', confidence: 'Medio' },
        JUNE: { stage: PHENOLOGICAL_STAGES.FLOWERING, cropType: 'Floración 2', confidence: 'Alto' },
        JULY: { stage: PHENOLOGICAL_STAGES.FRUIT_SET, cropType: 'Frutos 2', confidence: 'Medio-Alto' },
        AUGUST: { stage: PHENOLOGICAL_STAGES.FRUIT_DEVELOPMENT, cropType: 'Desarrollo 2', confidence: 'Medio-Alto' },
        SEPTEMBER: { stage: PHENOLOGICAL_STAGES.FRUIT_DEVELOPMENT, cropType: 'Maduración inicio 2', confidence: 'Medio' },
        OCTOBER: { stage: PHENOLOGICAL_STAGES.MATURATION, cropType: 'Maduración 1', confidence: 'Medio-Alto' },
        NOVEMBER: { stage: PHENOLOGICAL_STAGES.HARVESTING, cropType: 'Cosecha 1', confidence: 'Alto' },
        DECEMBER: { stage: PHENOLOGICAL_STAGES.HARVESTING, cropType: 'Cosecha 1', confidence: 'Alto' }
    },
    SOUTHERN_HEMISPHERE: {
        // Main crop: May-Aug (Southern Brazil, Paraguay)
        JANUARY: { stage: PHENOLOGICAL_STAGES.HARVESTING, cropType: 'Cosecha 1', confidence: 'Alto' },
        FEBRUARY: { stage: PHENOLOGICAL_STAGES.HARVESTING, cropType: 'Cosecha 1 fin', confidence: 'Medio-Alto' },
        MARCH: { stage: PHENOLOGICAL_STAGES.POST_HARVEST, cropType: 'Post-cosecha 1', confidence: 'Medio-Alto' },
        APRIL: { stage: PHENOLOGICAL_STAGES.DORMANCY, cropType: 'Dormancia', confidence: 'Medio-Alto' },
        MAY: { stage: PHENOLOGICAL_STAGES.SPROUTING, cropType: 'Brotación', confidence: 'Medio-Alto' },
        JUNE: { stage: PHENOLOGICAL_STAGES.FLOWERING, cropType: 'Floración', confidence: 'Medio' },
        JULY: { stage: PHENOLOGICAL_STAGES.FRUIT_SET, cropType: 'Cuaje/Desarrollo', confidence: 'Medio' },
        AUGUST: { stage: PHENOLOGICAL_STAGES.FRUIT_DEVELOPMENT, cropType: 'Desarrollo', confidence: 'Medio-Alto' },
        SEPTEMBER: { stage: PHENOLOGICAL_STAGES.MATURATION, cropType: 'Maduración', confidence: 'Medio-Alto' },
        OCTOBER: { stage: PHENOLOGICAL_STAGES.MATURATION, cropType: 'Maduración', confidence: 'Medio-Alto' },
        NOVEMBER: { stage: PHENOLOGICAL_STAGES.HARVESTING, cropType: 'Cosecha inicio', confidence: 'Medio-Alto' },
        DECEMBER: { stage: PHENOLOGICAL_STAGES.HARVESTING, cropType: 'Cosecha', confidence: 'Alto' }
    }
};

// Backwards-compatible alias for previous typo
export const PHENOMENOLOGICAL_STAGES = PHENOLOGICAL_STAGES;
export const PHENOMENOLOGICAL_CALENDAR = PHENOLOGICAL_CALENDAR;

/**
 * Analyze pest risk based on climate conditions
 * @param {Object} climateData - {temperature, humidity, altitude, month, hemisphere}
 * @returns {Array} - Risk assessments by pest
 */
export function analyzePestRiskByClimate(climateData) {
    const { temperature, humidity, altitude } = climateData;

    const riskAssessments = [];

    // Broca risk: High temp (>22°C), altitude 800-2000m
    if (temperature > 22 && altitude >= 800 && altitude <= 2000) {
        riskAssessments.push({
            pest: 'Broca del café',
            risk: 'Alto',
            confidence: 0.85,
            factors: ['Temperatura óptima (>22°C)', 'Altitud favorable', 'Período activo según calendario']
        });
    } else if (temperature > 18 && altitude >= 800 && altitude <= 2000) {
        riskAssessments.push({
            pest: 'Broca del café',
            risk: 'Medio',
            confidence: 0.65,
            factors: ['Temperatura moderada', 'Altitud dentro rango']
        });
    }

    // Roya risk: High humidity (>85%), moderate temp (15-25°C)
    if (humidity > 85 && temperature >= 15 && temperature <= 25) {
        riskAssessments.push({
            pest: 'Roya del café',
            risk: 'Alto',
            confidence: 0.90,
            factors: ['HR muy alta (>85%)', 'Temperatura favorable', 'Condiciones ideales para infección']
        });
    } else if (humidity > 75 && temperature >= 15 && temperature <= 25) {
        riskAssessments.push({
            pest: 'Roya del café',
            risk: 'Medio',
            confidence: 0.70,
            factors: ['HR moderada', 'Temperatura favorable']
        });
    }

    // Minador risk: Warm, moderate humidity, especial en brotación
    if (temperature >= 18 && temperature <= 28 && humidity >= 60 && humidity <= 85) {
        riskAssessments.push({
            pest: 'Minador de hojas',
            risk: 'Medio',
            confidence: 0.75,
            factors: ['Temperatura óptima', 'Humedad favorable']
        });
    }

    // Arañita roja: Warm, low humidity (<70%)
    if (temperature >= 20 && temperature <= 28 && humidity < 70) {
        riskAssessments.push({
            pest: 'Arañita roja',
            risk: 'Medio-Alto',
            confidence: 0.80,
            factors: ['Ambiente seco', 'Temperatura favorable', 'Condiciones de estrés en plantas']
        });
    }

    // Cochinilla: Warm, humidity 70-85%, altitude 900-1800m
    if (temperature >= 20 && temperature <= 26 && humidity >= 70 && humidity <= 85 && altitude >= 900 && altitude <= 1800) {
        riskAssessments.push({
            pest: 'Cochinilla harinosa',
            risk: 'Medio',
            confidence: 0.70,
            factors: ['Temperatura óptima', 'HR favorable', 'Altitud dentro rango']
        });
    }

    return riskAssessments;
}

/**
 * Get phenological stage for given date and hemisphere
 */
export function getPhenologicalStage(date, hemisphere = 'NORTHERN_HEMISPHERE') {
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const calendar = PHENOLOGICAL_CALENDAR[hemisphere];
    return calendar[month] || null;
}

/**
 * Get monthly monitoring recommendations
 */
export function getMonthlyRecommendations(month, hemisphere = 'NORTHERN_HEMISPHERE') {
    const calendar = PHENOLOGICAL_CALENDAR[hemisphere];
    const monthData = calendar[month];

    if (!monthData) return null;

    const stage = monthData.stage;
    const recommendations = {
        month,
        stage: stage.name,
        cropType: monthData.cropType,
        monitoring: [],
        interventions: [],
        pestAlerts: []
    };

    // Add stage-specific recommendations
    if (stage.code === 1) { // SPROUTING - Minador risk
        recommendations.monitoring.push('Inspeccionar hojas nuevas 3x/semana');
        recommendations.pestAlerts.push('ALERTA: Alto riesgo de Minador en brotes nuevos');
    }
    if (stage.code === 3 || stage.code === 4) { // PRE_FLOWERING / FLOWERING
        recommendations.monitoring.push('Monitoreo general de sanidad');
        recommendations.interventions.push('Evitar aplicaciones químicas durante floración (floración = 3-5 días)');
    }
    if (stage.code === 6 || stage.code === 7 || stage.code === 8) { // FRUIT stages
        recommendations.monitoring.push('Monitoreo intensivo de broca (inspeccionar frutos)');
        recommendations.pestAlerts.push('ALERTA: Broca activa durante desarrollo y maduración de fruto');
    }

    return recommendations;
}
