import React, { useState } from 'react';
import { Calendar, AlertCircle, Leaf, Droplet, Sun } from 'lucide-react';
import { PHENOMENOLOGICAL_STAGES, getMonthlyRecommendations, PHENOLOGICAL_CALENDAR } from '../utils/phenologicalCalendar';

/**
 * Interactive Phenological Calendar Component
 * Shows coffee plant development stages and pest risk windows
 */
export default function PhenologicalCalendar({ hemisphere = 'NORTHERN_HEMISPHERE', selectedMonth = null }) {
    const [activeMonth, setActiveMonth] = useState(selectedMonth || new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase());
    const [expandedStage, setExpandedStage] = useState(null);

    const monthsOrder = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    const calendar = PHENOLOGICAL_CALENDAR[hemisphere];
    const monthData = calendar[activeMonth];
    const monthRecs = getMonthlyRecommendations(activeMonth, hemisphere);

    const stageColor = (stageCode) => {
        const colors = {
            0: 'from-blue-900 to-blue-800 border-blue-500',
            1: 'from-green-900 to-green-800 border-green-500',
            2: 'from-emerald-900 to-emerald-800 border-emerald-500',
            3: 'from-yellow-900 to-yellow-800 border-yellow-500',
            4: 'from-amber-900 to-amber-800 border-amber-500',
            5: 'from-orange-900 to-orange-800 border-orange-500',
            6: 'from-orange-800 to-orange-700 border-orange-400',
            7: 'from-red-900 to-red-800 border-red-500',
            8: 'from-red-800 to-red-700 border-red-400',
            9: 'from-purple-900 to-purple-800 border-purple-500'
        };
        return colors[stageCode] || 'from-gray-900 to-gray-800 border-gray-500';
    };

    const getRiskLevel = (stage) => {
        const riskMap = {
            'Dormancia': 'Bajo',
            'Brotación': 'Medio-Alto',
            'Crecimiento vegetativo': 'Medio',
            'Pre-floración': 'Bajo-Medio',
            'Floración': 'Bajo',
            'Cuaje de fruto': 'Bajo',
            'Desarrollo de fruto': 'Medio',
            'Maduración': 'Alto',
            'Cosecha': 'Medio-Alto',
            'Post-cosecha': 'Bajo-Medio'
        };
        return riskMap[stage] || 'Desconocido';
    };

    const getRiskIcon = (risk) => {
        if (risk.includes('Alto')) return '🚨';
        if (risk.includes('Medio')) return '⚠️';
        return '✅';
    };

    return (
        <div className="space-y-4">
            {/* Month Selector - Calendar Grid */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Calendario Fenológico - {hemisphere === 'NORTHERN_HEMISPHERE' ? 'Hemisferio Norte' : 'Hemisferio Sur'}
                </h3>

                {/* Month Grid */}
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-6">
                    {monthsOrder.map((month) => (
                        <button
                            key={month}
                            onClick={() => setActiveMonth(month)}
                            className={`py-2 px-2 text-xs font-semibold rounded transition-all ${activeMonth === month
                                    ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                }`}
                        >
                            {month.slice(0, 3)}
                        </button>
                    ))}
                </div>

                {/* Stage Information Card */}
                {monthData && (
                    <div className={`gradient-to-r ${stageColor(monthData.stage.code)} border p-6 rounded-lg`}>
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Stage Details */}
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">
                                    {monthData.stage.name}
                                </h4>
                                <p className="text-gray-200 text-sm mb-3">
                                    {monthData.stage.description}
                                </p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-100">
                                        <Sun size={16} />
                                        <span>Duración: {monthData.stage.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        <span>
                                            Riesgo de Plagas:
                                            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${monthData.stage.pestRisk.includes('Bajo') ? 'bg-green-600' :
                                                    monthData.stage.pestRisk.includes('Alto') ? 'bg-red-600' :
                                                        'bg-yellow-600'
                                                }`}>
                                                {monthData.stage.pestRisk}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Interventions */}
                            <div>
                                <h5 className="font-semibold text-white mb-3">Intervenciones Recomendadas</h5>
                                <ul className="space-y-1">
                                    {monthData.stage.interventions.map((intervention, idx) => (
                                        <li key={idx} className="text-sm text-gray-100 flex items-start gap-2">
                                            <span className="text-base leading-5">→</span>
                                            <span>{intervention}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Monthly Recommendations */}
            {monthRecs && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                    <h4 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                        <Leaf size={18} />
                        Recomendaciones de {monthRecs.month}
                    </h4>

                    <div className="space-y-3">
                        {/* Crop Type */}
                        <div className="bg-black/30 p-3 rounded">
                            <p className="text-xs text-gray-400 mb-1">Tipo de Cosecha</p>
                            <p className="text-sm font-semibold text-cyan-300">{monthRecs.cropType}</p>
                        </div>

                        {/* Monitoring */}
                        {monthRecs.monitoring.length > 0 && (
                            <div className="bg-black/30 p-3 rounded border-l-2 border-blue-500">
                                <p className="text-xs font-semibold text-blue-400 mb-2">🔍 Monitoreo</p>
                                <ul className="space-y-1">
                                    {monthRecs.monitoring.map((item, idx) => (
                                        <li key={idx} className="text-xs text-gray-300">✓ {item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Interventions */}
                        {monthRecs.interventions.length > 0 && (
                            <div className="bg-black/30 p-3 rounded border-l-2 border-green-500">
                                <p className="text-xs font-semibold text-green-400 mb-2">🌱 Intervenciones</p>
                                <ul className="space-y-1">
                                    {monthRecs.interventions.map((item, idx) => (
                                        <li key={idx} className="text-xs text-gray-300">→ {item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Pest Alerts */}
                        {monthRecs.pestAlerts.length > 0 && (
                            <div className="bg-red-900/30 p-3 rounded border border-red-500/50">
                                <p className="text-xs font-semibold text-red-400 mb-2">⚠️ Alertas de Plagas</p>
                                <ul className="space-y-1">
                                    {monthRecs.pestAlerts.map((alert, idx) => (
                                        <li key={idx} className="text-xs text-red-300">{alert}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Complete Cycle Overview */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-400 mb-4">📅 Ciclo Completo del Café</h4>

                <div className="space-y-2">
                    {monthsOrder.map((month) => {
                        const data = calendar[month];
                        const stage = data.stage;
                        const risk = getRiskLevel(stage.name);
                        const riskIcon = getRiskIcon(risk);

                        return (
                            <button
                                key={month}
                                onClick={() => {
                                    setActiveMonth(month);
                                    setExpandedStage(expandedStage === month ? null : month);
                                }}
                                className={`w-full text-left p-3 rounded border-l-4 transition-all ${activeMonth === month
                                        ? `gradient-to-r ${stageColor(stage.code)} border-l-cyan-400`
                                        : 'bg-black/20 border-l-gray-600 hover:bg-black/40'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">{month.slice(0, 3)} - {stage.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{stage.description}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-base">{riskIcon}</p>
                                        <p className="text-xs text-gray-400 mt-1">{risk}</p>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {expandedStage === month && (
                                    <div className="mt-3 pt-3 border-t border-gray-600">
                                        <p className="text-xs text-gray-300 mb-2"><strong>Plagas Principales:</strong> {stage.pestRisk}</p>
                                        <p className="text-xs text-gray-300"><strong>Acciones:</strong> {stage.interventions.join(', ')}</p>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pest Risk Heat Map */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-400 mb-4">🔥 Mapa de Riesgo Anual de Plagas</h4>

                <div className="flex items-end justify-between h-24 gap-1">
                    {monthsOrder.map((month) => {
                        const data = calendar[month];
                        const risk = getRiskLevel(data.stage.name);
                        const heightMap = {
                            'Bajo': 'h-2',
                            'Bajo-Medio': 'h-4',
                            'Medio': 'h-6',
                            'Medio-Alto': 'h-12',
                            'Alto': 'h-20'
                        };
                        const colorMap = {
                            'Bajo': 'bg-green-500',
                            'Bajo-Medio': 'bg-yellow-500',
                            'Medio': 'bg-orange-500',
                            'Medio-Alto': 'bg-red-500',
                            'Alto': 'bg-red-700'
                        };

                        return (
                            <div key={month} className="flex-1 flex flex-col items-center group">
                                <div
                                    className={`w-full ${heightMap[risk]} ${colorMap[risk]} rounded-t transition-all opacity-70 hover:opacity-100 cursor-pointer`}
                                    title={`${month.slice(0, 3)}: ${risk}`}
                                />
                                <span className="text-xs text-gray-400 mt-1 group-hover:text-white">{month.slice(0, 3)}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-gray-400">Bajo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-gray-400">Bajo-Medio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-gray-400">Medio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-gray-400">Medio-Alto</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-700 rounded"></div>
                        <span className="text-gray-400">Alto</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
