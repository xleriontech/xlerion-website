import React from 'react';

export default function PageTransitionLoader() {
    return (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="mb-12 text-center">
                <div className="relative flex flex-col items-center">
                    <img
                        src="/LogoX.svg"
                        alt="Xlerion Logo"
                        className="w-24 h-24 md:w-32 md:h-32 animate-pulse"
                        style={{
                            filter: 'drop-shadow(0 0 20px rgba(0, 233, 250, 0.5))'
                        }}
                    />
                    <p className="text-[#00e9fa]/70 font-mono text-xs md:text-sm mt-6 tracking-widest uppercase">
                        Cargando...
                    </p>
                </div>
            </div>

            {/* Barra de progreso animada */}
            <div className="w-48 md:w-64 relative">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-white to-black relative animate-pulse">
                        {/* Efecto de shimmer infinito */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Animación de puntos */}
            <div className="mt-6 flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e9fa] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e9fa] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e9fa] animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
}
