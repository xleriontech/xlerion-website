import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { generateComparisonReport } from '../utils/severityAnalysis';

/**
 * Monitoring & Metrics Panel
 * Tracks pest evolution, treatment effectiveness, and field metrics over time
 */
export default function MonitoringPanel({ analyses = [] }) {
    const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, season
    const [comparisonData, setComparisonData] = useState(null);

    useEffect(() => {
        if (analyses.length < 2) return;
        const prev = analyses[analyses.length - 2];
        const curr = analyses[analyses.length - 1];
        const comparison = generateComparisonReport(prev, curr);
        setComparisonData(comparison);
    }, [analyses]);

    if (analyses.length === 0) {
        return (
            <div className="p-6 bg-slate-800/50 rounded-lg border border-cyan-500/20 text-center">
                <p className="text-gray-400">No hay datos de monitoreo. Realiza el primer diagnóstico.</p>
            </div>
        );
    }

    const latestAnalysis = analyses[analyses.length - 1];
    const historicalTrend = analyses.slice(-5); // Last 5 analyses

    return (
        <div className="space-y-4">
            {/* Header with Period Selection */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-cyan-400">📊 Panel de Monitoreo</h3>
                <div className="flex gap-2">
                    {['week', 'month', 'season'].map(period => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-3 py-1 text-xs rounded transition-colors ${selectedPeriod === period
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                }`}
                        >
                            {period === 'week' ? '1 Sem' : period === 'month' ? '1 Mes' : 'Temporada'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comparison Report (if available) */}
            {comparisonData && <ComparisonReport data={comparisonData} />}

            {/* Key Metrics Grid */}
            <MetricsGrid analysis={latestAnalysis} />

            {/* Severity Trend Chart */}
            <SeverityTrendChart analyses={historicalTrend} />

            {/* Detection Trends by Pest */}
            <PestTrendChart analyses={historicalTrend} />

            {/* Field Statistics */}
            <FieldStatistics analysis={latestAnalysis} />

            {/* Alerts & Recommendations */}
            <AlertsPanel analysis={latestAnalysis} />
        </div>
    );
}

/**
 * Comparison Report Between Two Analyses
 */
function ComparisonReport({ data }) {
    const severityImprovement = data.severityTrend.trend.includes('MEJORÓ');
    const effectivenessGood = data.effectiveness.detectionReduction > 50;

    return (
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-lg border border-cyan-500/30">
            <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                Comparación de Periodo
            </h4>

            <div className="grid grid-cols-3 gap-3">
                {/* Severity Trend */}
                <div className="bg-black/30 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-2">Severidad General</p>
                    <div className="flex items-center gap-2">
                        <div className={`text-2xl ${severityImprovement ? 'text-green-400' : 'text-red-400'}`}>
                            {severityImprovement ? '↓' : '↑'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {data.severityTrend.previous} → {data.severityTrend.current}
                            </p>
                            <p className="text-xs text-gray-400">{data.severityTrend.trend}</p>
                        </div>
                    </div>
                </div>

                {/* Detection Change */}
                <div className="bg-black/30 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-2">Detecciones</p>
                    <div className="flex items-center gap-2">
                        <div className={`text-2xl ${data.detectionTrend.change < 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {data.detectionTrend.change < 0 ? '-' : '+'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {data.detectionTrend.previous} → {data.detectionTrend.current}
                            </p>
                            <p className="text-xs text-gray-400">
                                Cambio: {data.detectionTrend.change > 0 ? '+' : ''}{data.detectionTrend.change}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Treatment Effectiveness */}
                <div className="bg-black/30 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-2">Efectividad</p>
                    <div className="flex items-center gap-2">
                        <div className={`text-2xl ${effectivenessGood ? 'text-green-400' : 'text-yellow-400'}`}>
                            {data.effectiveness.detectionReduction}%
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Reducción</p>
                            <p className="text-xs text-gray-400">{data.effectiveness.status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Key Metrics Grid
 */
function MetricsGrid({ analysis }) {
    const metrics = [
        {
            label: 'Detecciones Total',
            value: analysis.totalDetections,
            icon: '🎯',
            color: 'text-blue-400'
        },
        {
            label: 'Severidad General',
            value: analysis.overallSeverity,
            icon: '⚠️',
            color: analysis.overallSeverity === 'SEVERA' ? 'text-red-400' : 'text-yellow-400'
        },
        {
            label: 'Plagas Identificadas',
            value: analysis.recommendations.length,
            icon: '🦠',
            color: 'text-orange-400'
        },
        {
            label: 'Acciones Recomendadas',
            value: analysis.recommendations.reduce((sum, r) => sum + r.immediateActions.length, 0),
            icon: '📋',
            color: 'text-green-400'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metrics.map((metric, idx) => (
                <div key={idx} className="bg-slate-800/50 p-3 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors">
                    <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{metric.icon}</span>
                        <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Severity Trend Chart (Line-like visualization)
 */
function SeverityTrendChart({ analyses }) {
    const severityOrder = { 'SANO': 0, 'LEVE': 1, 'MODERADA': 2, 'SEVERA': 3 };
    const data = analyses.map((a, idx) => ({
        index: idx,
        severity: a.overallSeverity,
        score: severityOrder[a.overallSeverity]
    }));

    const avgScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;
    const trend = data[data.length - 1].score - data[0].score;

    return (
        <div className="bg-slate-800/50 p-4 rounded border border-cyan-500/20">
            <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <BarChart3 size={18} />
                Tendencia de Severidad
            </h4>

            <div className="flex items-end justify-between h-24 gap-2 mb-3">
                {data.map((d, idx) => {
                    const heightMap = { 0: 'h-2', 1: 'h-6', 2: 'h-12', 3: 'h-20' };
                    const colorMap = { 0: 'bg-green-500', 1: 'bg-yellow-500', 2: 'bg-orange-500', 3: 'bg-red-500' };
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                            <div className={`w-full ${heightMap[d.score]} ${colorMap[d.score]} rounded-t transition-all duration-300 opacity-70 hover:opacity-100`} />
                            <span className="text-xs text-gray-400 mt-1">{d.severity}</span>
                        </div>
                    );
                })}
            </div>

            <div className="text-xs text-gray-400 space-y-1 border-t border-gray-700 pt-2">
                <p>📊 Promedio: <span className="text-cyan-400">{severityOrder[['SANO', 'LEVE', 'MODERADA', 'SEVERA'][Math.round(avgScore)]]}</span></p>
                <p>📈 Tendencia: <span className={trend > 0 ? 'text-red-400' : 'text-green-400'}>
                    {trend > 0 ? 'Empeorando ⬆️' : trend < 0 ? 'Mejorando ⬇️' : 'Estable →'}
                </span></p>
            </div>
        </div>
    );
}

/**
 * Detection Trends by Pest Type
 */
function PestTrendChart({ analyses }) {
    // Group detections by pest type across time
    const pestTrends = {};

    analyses.forEach(analysis => {
        analysis.detections.forEach(det => {
            if (!pestTrends[det.class]) {
                pestTrends[det.class] = [];
            }
            pestTrends[det.class].push(det.severity);
        });
    });

    return (
        <div className="bg-slate-800/50 p-4 rounded border border-cyan-500/20">
            <h4 className="font-semibold text-cyan-400 mb-3">🦠 Evolución por Plaga</h4>

            <div className="space-y-2">
                {Object.entries(pestTrends).slice(0, 5).map(([pestName, severities]) => {
                    const count = severities.length;
                    const severe = severities.filter(s => s === 'SEVERA').length;
                    const moderate = severities.filter(s => s === 'MODERADA').length;

                    return (
                        <div key={pestName} className="bg-black/30 p-2 rounded">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-semibold text-cyan-300">{pestName}</p>
                                <p className="text-xs text-gray-400">{count} detecciones</p>
                            </div>
                            <div className="flex gap-1 h-2">
                                {severe > 0 && (
                                    <div className="bg-red-500 h-full flex-shrink-0" style={{ width: `${(severe / count) * 100}%` }} title={`${severe} severas`} />
                                )}
                                {moderate > 0 && (
                                    <div className="bg-orange-500 h-full flex-shrink-0" style={{ width: `${(moderate / count) * 100}%` }} title={`${moderate} moderadas`} />
                                )}
                                {count - severe - moderate > 0 && (
                                    <div className="bg-yellow-500 h-full flex-1" title={`${count - severe - moderate} leves`} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Field Statistics
 */
function FieldStatistics({ analysis }) {
    const stats = [
        {
            label: 'Área Afectada Estimada',
            value: '15%',
            icon: '📍',
            detail: 'Del total muestreado'
        },
        {
            label: 'Nivel de Infestación',
            value: analysis.totalDetections > 0 ? 'Activa' : 'Bajo',
            icon: '📊',
            detail: `${analysis.totalDetections} focos detectados`
        },
        {
            label: 'Riesgo de Propagación',
            value: analysis.overallSeverity === 'SEVERA' ? 'Alto' : 'Medio',
            icon: '⚡',
            detail: 'Según severidad actual'
        },
        {
            label: 'Próximo Monitoreo',
            value: analysis.overallSeverity === 'SEVERA' ? '3 días' : '7 días',
            icon: '📅',
            detail: 'Recomendado'
        }
    ];

    return (
        <div className="bg-slate-800/50 p-4 rounded border border-cyan-500/20">
            <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <MapPin size={18} />
                Estadísticas de Parcela
            </h4>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-black/30 p-3 rounded">
                        <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-cyan-400">{stat.icon} {stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Critical Alerts & Action Items
 */
function AlertsPanel({ analysis }) {
    const alerts = [];

    // Generate alerts based on analysis
    if (analysis.overallSeverity === 'SEVERA') {
        alerts.push({
            level: 'CRITICA',
            message: 'Infestación severa detectada. Intervención URGENTE recomendada.',
            icon: '🚨'
        });
    }

    if (analysis.totalDetections > 5) {
        alerts.push({
            level: 'ALTA',
            message: `${analysis.totalDetections} focos de plagas detectados en campo.`,
            icon: '⚠️'
        });
    }

    analysis.contextAnalysis?.environmentalFactors?.forEach(factor => {
        if (factor.includes('muy alta') || factor.includes('muy seco')) {
            alerts.push({
                level: 'MEDIA',
                message: factor,
                icon: '⚡'
            });
        }
    });

    if (alerts.length === 0) {
        alerts.push({
            level: 'INFO',
            message: 'Cultivo en buen estado. Mantener monitoreo regular.',
            icon: '✅'
        });
    }

    return (
        <div className="bg-slate-800/50 p-4 rounded border border-cyan-500/20">
            <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} />
                Alertas y Acciones
            </h4>

            <div className="space-y-2">
                {alerts.map((alert, idx) => {
                    const bgColor = {
                        'CRITICA': 'bg-red-900/50 border-red-500/50 text-red-200',
                        'ALTA': 'bg-orange-900/50 border-orange-500/50 text-orange-200',
                        'MEDIA': 'bg-yellow-900/50 border-yellow-500/50 text-yellow-200',
                        'INFO': 'bg-green-900/50 border-green-500/50 text-green-200'
                    }[alert.level];

                    return (
                        <div key={idx} className={`p-3 rounded border ${bgColor}`}>
                            <p className="text-sm">
                                <span className="font-semibold">{alert.icon} [{alert.level}]</span>
                                <span className="ml-2">{alert.message}</span>
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
