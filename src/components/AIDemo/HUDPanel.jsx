import React from 'react';
import { Activity, Cpu, Zap, CheckCircle, Circle } from 'lucide-react';

export default function HUDPanel({ isProcessing, hasResults, telemetryData }) {
    const getStatusColor = () => {
        if (isProcessing) return 'yellow';
        if (hasResults) return 'green';
        return 'gray';
    };

    const statusColor = getStatusColor();
    const colorClasses = {
        green: 'text-green-400 border-green-500/50 bg-green-900/10',
        yellow: 'text-yellow-400 border-yellow-500/50 bg-yellow-900/10',
        gray: 'text-gray-400 border-gray-500/50 bg-gray-900/10',
    };

    const getStatusText = () => {
        if (isProcessing) return 'PROCESANDO';
        if (hasResults) return 'COMPLETADO';
        return 'EN ESPERA';
    };

    return (
        <div className={`border rounded-lg p-4 ${colorClasses[statusColor]}`}>
            <div className="grid md:grid-cols-4 gap-4">
                {/* Status Indicator */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {isProcessing ? (
                            <Activity size={24} className="animate-pulse" />
                        ) : hasResults ? (
                            <CheckCircle size={24} />
                        ) : (
                            <Circle size={24} />
                        )}
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-mono">Estado</div>
                        <div className="text-sm font-bold font-mono">{getStatusText()}</div>
                    </div>
                </div>

                {/* System Load */}
                <div className="flex items-center gap-3">
                    <Cpu size={24} />
                    <div>
                        <div className="text-xs text-gray-400 font-mono">Carga del Sistema</div>
                        <div className="text-sm font-bold font-mono">
                            {telemetryData?.cpuLoad || (isProcessing ? '85%' : '12%')}
                        </div>
                    </div>
                </div>

                {/* Processing Speed */}
                <div className="flex items-center gap-3">
                    <Zap size={24} />
                    <div>
                        <div className="text-xs text-gray-400 font-mono">Velocidad</div>
                        <div className="text-sm font-bold font-mono">
                            {telemetryData?.throughput || (isProcessing ? '1.2 img/s' : '0 img/s')}
                        </div>
                    </div>
                </div>

                {/* Queue */}
                <div className="flex items-center gap-3">
                    <Activity size={24} />
                    <div>
                        <div className="text-xs text-gray-400 font-mono">Cola</div>
                        <div className="text-sm font-bold font-mono">
                            {telemetryData?.queueSize || '0'} pendientes
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
                <div className="mt-4">
                    <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}
