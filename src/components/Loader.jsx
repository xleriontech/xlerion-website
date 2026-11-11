import React, { useState, useEffect } from 'react';

export default function Loader({ onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simular carga progresiva
        const duration = 2000; // 2 segundos
        const steps = 60;
        const increment = 100 / steps;
        let current = 0;

        const interval = setInterval(() => {
            current += increment;
            if (current >= 100) {
                setProgress(100);
                clearInterval(interval);
                setTimeout(() => {
                    onComplete();
                }, 300);
            } else {
                setProgress(current);
            }
        }, duration / steps);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
            {/* Logo y marca */}
            <div className="mb-12 text-center">
                <div className="relative flex flex-col items-center">
                    <img
                        src="/LogoX.svg"
                        alt="Xlerion Logo"
                        className="w-32 h-32 md:w-48 md:h-48 animate-pulse"
                        style={{
                            filter: 'drop-shadow(0 0 20px rgba(0, 233, 250, 0.5))'
                        }}
                    />
                    <p className="text-[#00e9fa]/70 font-mono text-sm md:text-base mt-6 tracking-widest uppercase">
                        Tecnología Avanzada
                    </p>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="w-64 md:w-96 relative">
                {/* Fondo */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    {/* Progreso */}
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-white to-black transition-all duration-100 ease-linear relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                </div>

                {/* Porcentaje */}
                <div className="mt-4 text-center">
                    <span className="text-[#00e9fa] font-mono text-sm md:text-base">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Animación de puntos */}
            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00e9fa] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#00e9fa] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#00e9fa] animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

            {/* Texto adicional */}
            <p className="mt-8 text-gray-400 font-mono text-xs md:text-sm">
                Inicializando experiencia...
            </p>
        </div>
    );
}
