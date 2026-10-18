import React, { useEffect, useState } from 'react';

export default function SectionLoader({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 800),
      setTimeout(() => setPhase(4), 1200),
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99998] pointer-events-none flex items-center justify-center bg-[#070710]">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,233,250,0.15) 0%, transparent 60%)',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Orbiting particles */}
      <div className="absolute w-64 h-64">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-${40 + i * 8}px)`,
              animation: `orbit ${1.5 + i * 0.2}s linear infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? '#00e9fa' : '#00f9b8',
                boxShadow: `0 0 ${6 + i * 2}px ${i % 2 === 0 ? '#00e9fa' : '#00f9b8'}`,
                opacity: phase >= 1 ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </div>
        ))}
      </div>

      {/* Logo container */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.8)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Glowing ring */}
        <div
          className="absolute w-32 h-32 rounded-full border-2 border-[#00e9fa]/30"
          style={{
            animation: phase >= 2 ? 'pulse-ring 1.5s ease-out infinite' : 'none',
            opacity: phase >= 2 ? 1 : 0,
          }}
        />

        {/* Logo */}
        <div
          className="relative"
          style={{
            animation: phase >= 2 ? 'float 2s ease-in-out infinite' : 'none',
          }}
        >
          <img
            src="/LogoX.png"
            alt="Xlerion"
            className="w-20 h-20 object-contain"
            style={{
              filter: phase >= 2
                ? 'drop-shadow(0 0 20px rgba(0,233,250,0.6)) drop-shadow(0 0 40px rgba(0,233,250,0.3))'
                : 'none',
              transition: 'filter 0.5s ease',
            }}
          />

          {/* Scan line effect */}
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              opacity: phase >= 3 ? 1 : 0,
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00e9fa]/20 to-transparent"
              style={{
                animation: phase >= 3 ? 'scan 1s ease-in-out infinite' : 'none',
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div
          className="mt-8 text-[10px] font-mono uppercase tracking-[0.4em] text-[#00e9fa]/70"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <span className="inline-block" style={{ animation: phase >= 3 ? 'blink 1s step-end infinite' : 'none' }}>
            CARGANDO
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: phase > i + 1 ? '#00e9fa' : 'rgba(0,233,250,0.2)',
                boxShadow: phase > i + 1 ? '0 0 8px #00e9fa' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Horizontal scan lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${30 + i * 20}%`,
              background: 'linear-gradient(90deg, transparent, rgba(0,233,250,0.1), transparent)',
              opacity: phase >= 2 ? 1 : 0,
              animation: phase >= 2 ? `scanline ${2 + i * 0.5}s linear infinite` : 'none',
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
