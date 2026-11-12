import React, { useState, useEffect, useCallback } from 'react';

/**
 * Loader principal del sitio (arranque).
 *
 * Sustituye al video intro. Es la pieza de entrada de la experiencia, asi que
 * es deliberadamente MAS RICA que los loaders de cambio de seccion:
 *   - 3 anillos concentricos que giran en sentidos y velocidades distintos
 *   - 12 particulas en orbita elipseada
 *   - logo con triple halo y barrido de escaneo
 *   - marco HUD con escuadras y marcas tecnicas
 *   - barra de progreso segmentada con shimmer y porcentaje real
 *   - lineas de escaneo sobre el fondo grid
 */
export default function Loader({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [canSkip, setCanSkip] = useState(false);

    const finish = useCallback(() => {
        if (onComplete) onComplete();
    }, [onComplete]);

    useEffect(() => {
        // Permite saltar a partir del segundo 1.
        const skipTimer = setTimeout(() => setCanSkip(true), 1000);

        // Progreso simulado: ~2,2 s hasta el 100%.
        const duration = 2200;
        const steps = 88;
        const increment = 100 / steps;
        let current = 0;

        const interval = setInterval(() => {
            current += increment;
            if (current >= 100) {
                setProgress(100);
                clearInterval(interval);
                setTimeout(finish, 260);
            } else {
                setProgress(current);
            }
        }, duration / steps);

        return () => {
            clearTimeout(skipTimer);
            clearInterval(interval);
        };
    }, [finish]);

    const pct = Math.round(progress);
    const phase = pct >= 85 ? 3 : pct >= 45 ? 2 : pct >= 12 ? 1 : 0;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#050508] flex flex-col items-center justify-center">
            {/* Fondo: grid tecnico 48px con mascara radial + halo */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(0,233,250,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,233,250,0.055) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    maskImage: 'radial-gradient(circle at 50% 45%, #000 0%, rgba(0,0,0,0.35) 42%, transparent 72%)',
                    WebkitMaskImage:
                        'radial-gradient(circle at 50% 45%, #000 0%, rgba(0,0,0,0.35) 42%, transparent 72%)',
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(circle at 50% 42%, rgba(0,233,250,0.13) 0%, transparent 58%)',
                }}
            />

            {/* Lineas de escaneo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="absolute left-0 right-0 h-px"
                        style={{
                            top: `${22 + i * 26}%`,
                            background:
                                'linear-gradient(90deg, transparent, rgba(0,233,250,0.16), transparent)',
                            animation: `scanline ${3 + i * 0.8}s linear infinite`,
                            animationDelay: `${i * 0.45}s`,
                        }}
                    />
                ))}
            </div>

            {/* Nucleo: anillos + particulas + logo */}
            <div className="relative flex flex-col items-center">
                <div className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] flex items-center justify-center">
                    {/* Anillo exterior: puntos, lento, antihorario */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            border: '1px dashed rgba(0,233,250,0.20)',
                            animation: 'spin 26s linear infinite reverse',
                            opacity: phase >= 1 ? 1 : 0,
                            transition: 'opacity 0.6s ease',
                        }}
                    />
                    {/* Anillo intermedio: solido, rapido, horario */}
                    <div
                        className="absolute inset-[26px] rounded-full"
                        style={{
                            border: '1px solid rgba(0,233,250,0.26)',
                            animation: 'spin 15s linear infinite',
                            opacity: phase >= 1 ? 1 : 0,
                            transition: 'opacity 0.6s ease',
                        }}
                    />
                    {/* Anillo interior: punteado, contrarrotacion */}
                    <div
                        className="absolute inset-[54px] rounded-full"
                        style={{
                            border: '1px dotted rgba(0,233,250,0.45)',
                            animation: 'spin 9s linear infinite reverse',
                            opacity: phase >= 2 ? 1 : 0,
                            transition: 'opacity 0.6s ease',
                        }}
                    />
                    {/* Halo pulsante */}
                    <div
                        className="absolute inset-[16px] rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(0,233,250,0.16) 0%, transparent 68%)',
                            animation: phase >= 2 ? 'pulse-ring 2.4s ease-out infinite' : 'none',
                        }}
                    />

                    {/* 12 particulas en orbita */}
                    <div className="absolute w-[62%] h-[62%]">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    '--orbit-r': 52 + (i % 3) * 9 + 'px',
                                    transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                                    animation: `xlerion-orbit ${2.4 + (i % 4) * 0.35}s linear infinite`,
                                    animationDelay: `${i * 0.08}s`,
                                    opacity: phase >= 1 ? 1 : 0,
                                    transition: 'opacity 0.5s ease',
                                }}
                            >
                                <div
                                    className="rounded-full"
                                    style={{
                                        width: i % 3 === 0 ? 5 : 3,
                                        height: i % 3 === 0 ? 5 : 3,
                                        background: i % 2 === 0 ? '#00e9fa' : '#00f9b8',
                                        boxShadow: `0 0 ${5 + (i % 3) * 3}px ${i % 2 === 0 ? '#00e9fa' : '#00f9b8'}`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Logo con linea de escaneo */}
                    <div className="relative">
                        {/* Linea de escaneo: una barra fina que baja, no un
                            relleno (el relleno pintaba un rectangulo sobre las
                            zonas transparentes del SVG). */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{
                                opacity: phase >= 2 ? 1 : 0,
                                transition: 'opacity 0.6s ease',
                            }}
                        >
                            <div
                                className="absolute left-0 right-0 h-[2px]"
                                style={{
                                    background:
                                        'linear-gradient(90deg, transparent, #00e9fa 50%, transparent)',
                                    boxShadow: '0 0 14px rgba(0,233,250,0.85)',
                                    animation: 'xlerion-scan-y 2.2s ease-in-out infinite',
                                }}
                            />
                        </div>
                        <img
                            src="/LogoX.svg"
                            alt="Xlerion"
                            className="relative w-24 h-24 md:w-32 md:h-32 object-contain"
                            style={{
                                animation: phase >= 1 ? 'float 3.2s ease-in-out infinite' : 'none',
                                filter:
                                    phase >= 2
                                        ? 'drop-shadow(0 0 18px rgba(0,233,250,0.65)) drop-shadow(0 0 46px rgba(0,233,250,0.28))'
                                        : 'none',
                                transition: 'filter 0.7s ease',
                            }}
                        />
                    </div>
                </div>

                {/* Marca */}
                <div
                    className="mt-6 text-center"
                    style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.5s ease' }}
                >
                    <p className="text-[#00e9fa] font-mono text-xs md:text-sm tracking-[0.42em] uppercase">
                        Tecnología Avanzada
                    </p>
                </div>
            </div>

            {/* Marco HUD con escuadras */}
            <div
                className="relative mt-10 w-[min(88vw,460px)]"
                style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s ease' }}
            >
                {/* Escuadras */}
                {[
                    'left-0 top-0 border-l border-t',
                    'right-0 top-0 border-r border-t',
                    'left-0 bottom-0 border-l border-b',
                    'right-0 bottom-0 border-r border-b',
                ].map((c) => (
                    <span
                        key={c}
                        className={`absolute w-5 h-5 border-[#00e9fa]/45 ${c}`}
                    />
                ))}

                {/* Barra segmentada */}
                <div className="relative h-3 w-full bg-white/[0.05] overflow-hidden flex gap-[2px] px-[2px] pt-[2px]">
                    {[...Array(28)].map((_, i) => {
                        const on = (i / 28) * 100 < progress;
                        return (
                            <span
                                key={i}
                                className="flex-1 h-full"
                                style={{
                                    background: on
                                        ? 'linear-gradient(180deg, #00e9fa, #00b8c9)'
                                        : 'rgba(255,255,255,0.07)',
                                    boxShadow: on ? '0 0 8px rgba(0,233,250,0.45)' : 'none',
                                    transition: 'background 0.18s ease, box-shadow 0.18s ease',
                                }}
                            />
                        );
                    })}

                    {/* Shimmer SOLO sobre la barra */}
                    <div
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s ease' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Porcentaje + estado */}
                <div className="mt-4 flex items-end justify-between">
                    <span className="text-[#00e9fa] font-mono text-sm md:text-base tabular-nums">
                        {String(pct).padStart(3, '0')}%
                    </span>
                    <span
                        className="text-gray-500 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em]"
                        style={{ opacity: phase >= 3 ? 1 : 0, transition: 'opacity 0.4s ease' }}
                    >
                        <span
                            className="inline-block"
                            style={{ animation: phase >= 3 ? 'blink 1s step-end infinite' : 'none' }}
                        >
                            Inicializando experiencia...
                        </span>
                    </span>
                </div>

                {/* Puntos de estado */}
                <div className="mt-4 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                background: phase > i ? '#00e9fa' : 'rgba(0,233,250,0.18)',
                                boxShadow: phase > i ? '0 0 8px #00e9fa' : 'none',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Saltar */}
            {canSkip && (
                <button
                    onClick={finish}
                    className="absolute bottom-6 right-6 md:bottom-10 md:right-10 px-4 py-2 md:px-5 md:py-2.5 bg-[#00e9fa]/10 hover:bg-[#00e9fa]/25 border border-[#00e9fa]/40 text-[#00e9fa] font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-sm backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,233,250,0.25)]"
                    aria-label="Saltar la animación de carga"
                >
                    Saltar
                </button>
            )}
        </div>
    );
}
