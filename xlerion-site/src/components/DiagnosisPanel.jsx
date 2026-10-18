import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Thermometer, Droplets, Mountain, Calendar } from 'lucide-react';
import { analyzeDetectionsWithSeverity } from '../utils/severityAnalysis';
import { COFFEE_PESTS, getTreatmentsByPestAndSeverity } from '../utils/coffeePestDatabase';

/**
 * Enhanced Diagnosis Panel with Agronomic Context
 * Displays severity analysis, risk factors, and detailed treatment recommendations
 */
export default function DiagnosisPanel({ detections = [], contextData = {} }) {
    const [analysis, setAnalysis] = useState(null);
    const [expandedPest, setExpandedPest] = useState(null);
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    useEffect(() => {
        if (!detections.length) return;
        const result = analyzeDetectionsWithSeverity(detections, {
            ...contextData,
            date: new Date()
        });
        setAnalysis(result);
    }, [detections, contextData]);

    if (!analysis) {
        return (
            <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-cyan-500/30">
                <p className="text-gray-400 text-center">Cargando diagnóstico...</p>
            </div>
        );
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'SEVERA':
                return 'from-red-900 to-red-800 border-red-500';
            case 'MODERADA':
                return 'from-orange-900 to-orange-800 border-orange-500';
            case 'LEVE':
                return 'from-yellow-900 to-yellow-800 border-yellow-500';
            default:
                return 'from-green-900 to-green-800 border-green-500';
        }
    };

    const getUrgencyBadge = (urgency) => {
        const styles = {
            'CRITICA': 'bg-red-600 text-white animate-pulse',
            'ALTA': 'bg-red-500 text-white',
            'MEDIA': 'bg-orange-500 text-white',
            'MONITOREO': 'bg-blue-500 text-white'
        };
        return styles[urgency] || 'bg-gray-500 text-white';
    };

    return (
        <div className="space-y-4">
            {/* Overall Severity Header */}
            <div className={`gradient-to-r ${getSeverityColor(analysis.overallSeverity)} p-6 rounded-lg border`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Estado General del Cultivo</h3>
                        <p className="text-gray-300 text-sm mt-1">
                            {analysis.totalDetections === 0
                                ? 'Cultivo sano - No se detectaron plagas'
                                : `${analysis.totalDetections} plaga(s) detectada(s)`}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-white">{analysis.overallSeverity}</div>
                        <div className="text-sm text-gray-300">Severidad general</div>
                    </div>
                </div>

                {/* Severity Score Bar */}
                {analysis.overallSeverityScore !== undefined && (
                    <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${analysis.overallSeverityScore > 0.65
                                ? 'bg-red-500'
                                : analysis.overallSeverityScore > 0.40
                                    ? 'bg-orange-500'
                                    : 'bg-green-500'
                                }`}
                            style={{ width: `${analysis.overallSeverityScore * 100}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Context Analysis */}
            {analysis.contextAnalysis && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                    <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                        <AlertCircle size={18} />
                        Análisis Contextual
                    </h4>

                    {/* Environmental Factors */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {contextData.temperature && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Thermometer size={16} className="text-orange-400" />
                                <span>{contextData.temperature}°C</span>
                            </div>
                        )}
                        {contextData.humidity && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Droplets size={16} className="text-blue-400" />
                                <span>{contextData.humidity}% HR</span>
                            </div>
                        )}
                        {contextData.altitude && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Mountain size={16} className="text-gray-400" />
                                <span>{contextData.altitude}m</span>
                            </div>
                        )}
                        {contextData.variety && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Calendar size={16} className="text-green-400" />
                                <span>{contextData.variety}</span>
                            </div>
                        )}
                    </div>

                    {/* Seasonal Context */}
                    {analysis.contextAnalysis.seasonalContext && (
                        <p className="text-xs text-gray-400 italic border-t border-gray-700 pt-2">
                            📅 {analysis.contextAnalysis.seasonalContext}
                        </p>
                    )}

                    {/* Environmental Warnings */}
                    {analysis.contextAnalysis.environmentalFactors.length > 0 && (
                        <div className="mt-3 space-y-1">
                            {analysis.contextAnalysis.environmentalFactors.map((factor, idx) => (
                                <p key={idx} className="text-xs text-yellow-400">{factor}</p>
                            ))}
                        </div>
                    )}

                    {/* Climate Risk Alerts */}
                    {analysis.contextAnalysis.climateRisk.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-xs font-semibold text-cyan-400 mb-2">Plagas de riesgo climático:</p>
                            {analysis.contextAnalysis.climateRisk.map((risk, idx) => (
                                <div key={idx} className="text-xs text-gray-300 mb-1">
                                    <span className="text-yellow-400 font-semibold">{risk.pest}</span>
                                    <span className="ml-2">Riesgo: <span className="text-orange-400">{risk.risk}</span></span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Individual Detections */}
            {analysis.detections.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-cyan-400">Plagas Detectadas ({analysis.totalDetections})</h4>

                    {analysis.detections.map((detection) => (
                        <div
                            key={detection.id}
                            className={`bg-slate-800/50 border rounded-lg overflow-hidden transition-all cursor-pointer`}
                            onClick={() => setExpandedPest(expandedPest === detection.id ? null : detection.id)}
                        >
                            {/* Header */}
                            <div className={`gradient-to-r ${getSeverityColor(detection.severity)} p-3 border-b border-gray-700`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h5 className="font-bold text-white">{detection.class}</h5>
                                            <span className={`text-xs px-2 py-1 rounded ${getUrgencyBadge(detection.urgency)}`}>
                                                {detection.urgency}
                                            </span>
                                            <span className="text-xs text-gray-300">
                                                Confianza: {Math.round(detection.confidence * 100)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-300 mt-1">
                                            *{detection.pestInfo.scientificName}*
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">{detection.severity}</div>
                                        <div className="text-xs text-gray-400">Severidad</div>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Details */}
                            {expandedPest === detection.id && (
                                <div className="p-4 space-y-4 bg-black/30">
                                    {/* Explanation */}
                                    <div className="border-l-2 border-cyan-500 pl-3">
                                        <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {detection.explanation}
                                        </p>
                                    </div>

                                    {/* Risk Factors */}
                                    {detection.riskFactors.length > 0 && (
                                        <div>
                                            <h6 className="text-xs font-semibold text-yellow-400 mb-2">
                                                🎯 Factores de Riesgo en tu Parcela:
                                            </h6>
                                            <ul className="space-y-1">
                                                {detection.riskFactors.map((factor, idx) => (
                                                    <li key={idx} className="text-xs text-gray-400">✓ {factor}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Treatment Options */}
                                    <TreatmentRecommendations
                                        pestName={detection.class}
                                        severity={detection.severity}
                                        onSelectTreatment={setSelectedTreatment}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Recommendations Summary */}
            {analysis.recommendations.length > 0 && (
                <div className="bg-gradient-to-b from-green-900/30 to-blue-900/30 p-4 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-400 mb-3">📋 Plan de Acción Recomendado</h4>
                    {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="mb-3 pb-3 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                            <p className="text-sm font-semibold text-cyan-300">{rec.pest}</p>
                            <ul className="text-xs text-gray-300 mt-2 space-y-1">
                                {rec.immediateActions.map((action, aidx) => (
                                    <li key={aidx}>{action}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Treatment Details */}
            {selectedTreatment && (
                <TreatmentDetailModal
                    treatment={selectedTreatment}
                    onClose={() => setSelectedTreatment(null)}
                />
            )}
        </div>
    );
}

/**
 * Treatment Recommendations Component
 */
function TreatmentRecommendations({ pestName, severity, onSelectTreatment }) {
    const pestInfo = COFFEE_PESTS[pestName];
    if (!pestInfo) return null;

    const treatments = getTreatmentsByPestAndSeverity(pestName, severity);

    return (
        <div>
            <h6 className="text-xs font-semibold text-green-400 mb-2">💊 Opciones de Tratamiento:</h6>

            <div className="space-y-2">
                {/* Biological treatments */}
                <div>
                    <p className="text-xs text-cyan-400 font-semibold mb-1">🦋 Biológicos:</p>
                    <div className="space-y-1">
                        {treatments.biological.slice(0, 2).map((t, idx) => (
                            <TreatmentButton key={idx} treatment={t} onClick={() => onSelectTreatment(t)} />
                        ))}
                    </div>
                </div>

                {/* Cultural treatments */}
                <div>
                    <p className="text-xs text-green-400 font-semibold mb-1">🌱 Culturales:</p>
                    <div className="space-y-1">
                        {treatments.cultural.slice(0, 2).map((t, idx) => (
                            <TreatmentButton key={idx} treatment={t} onClick={() => onSelectTreatment(t)} />
                        ))}
                    </div>
                </div>

                {/* Organic treatments */}
                <div>
                    <p className="text-xs text-orange-400 font-semibold mb-1">🍃 Orgánicos:</p>
                    <div className="space-y-1">
                        {treatments.organic.slice(0, 1).map((t, idx) => (
                            <TreatmentButton key={idx} treatment={t} onClick={() => onSelectTreatment(t)} />
                        ))}
                    </div>
                </div>

                {severity === 'SEVERA' && (
                    <div>
                        <p className="text-xs text-red-400 font-semibold mb-1">⚠️ Químicos (último recurso):</p>
                        <div className="space-y-1">
                            {treatments.chemical.slice(0, 1).map((t, idx) => (
                                <TreatmentButton key={idx} treatment={t} onClick={() => onSelectTreatment(t)} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Individual Treatment Button
 */
function TreatmentButton({ treatment, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-2 bg-slate-700/50 hover:bg-slate-600/70 rounded text-xs transition-colors border border-slate-600/50"
        >
            <div className="font-semibold text-cyan-300">{treatment.name}</div>
            <div className="text-gray-400 text-xs mt-1">{treatment.description}</div>
            <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-green-400">📊 Efectividad: {treatment.effectiveness}</span>
                <span className="text-yellow-400">💰 Costo: {treatment.cost}</span>
            </div>
        </button>
    );
}

/**
 * Detailed Treatment Information Modal
 */
function TreatmentDetailModal({ treatment, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto border border-cyan-500/50 p-6">
                <div className="flex justify-between items-start mb-4">
                    <h5 className="text-xl font-bold text-cyan-400">{treatment.name}</h5>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                    <div>
                        <p className="font-semibold text-cyan-300 mb-1">Descripción:</p>
                        <p>{treatment.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold text-green-400">Efectividad:</p>
                            <p>{treatment.effectiveness}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-yellow-400">Costo:</p>
                            <p>{treatment.cost}</p>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-blue-400">Timing:</p>
                        <p>{treatment.timing}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-orange-400">Preparación:</p>
                        <p>{treatment.preparation}</p>
                    </div>

                    {treatment.restrictions && (
                        <div className="bg-red-900/30 p-3 rounded border border-red-500/50">
                            <p className="font-semibold text-red-400">⚠️ Restricciones:</p>
                            <p>{treatment.restrictions}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
