import React, { useEffect, useRef, useState, useCallback } from 'react';

const BOOT_LINES = [
  { at: 8, text: 'Iniciando núcleo visual...' },
  { at: 24, text: 'Montando escena 3D...' },
  { at: 42, text: 'Conectando módulos interactivos...' },
  { at: 62, text: 'Sincronizando interfaz...' },
  { at: 82, text: 'Preparando experiencia...' },
];

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), 900);
    const duration = 2400;
    const steps = 96;
    const increment = 100 / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(finish, 320);
      } else {
        setProgress(current);
      }
    }, duration / steps);
    return () => { clearTimeout(skipTimer); clearInterval(interval); };
  }, [finish]);

  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    if (!fine) return undefined;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const pct = Math.round(progress);
  const reveal = Math.max(0, Math.min(100, progress));
  const activeLines = BOOT_LINES.filter((l) => pct >= l.at);
  const phase = pct >= 85 ? 3 : pct >= 50 ? 2 : pct >= 15 ? 1 : 0;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#050508] text-white select-none">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,233,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,233,250,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(circle at 50% 45%, #000 0%, rgba(0,0,0,0.4) 45%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 45%, #000 0%, rgba(0,0,0,0.4) 45%, transparent 75%)',
          transform: `translate(${mouse.x * -8}px, ${mouse.y * -8}px)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${50 + mouse.x * 12}% ${45 + mouse.y * 12}%, rgba(0,233,250,0.14), transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${20 + i * 28}%`,
              background: 'linear-gradient(90deg, transparent, rgba(0,233,250,0.14), transparent)',
              animation: `scanline ${3.2 + i * 0.7}s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative h-full w-full max-w-[90rem] mx-auto px-6 md:px-10 lg:px-14 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
            <div
              className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] flex items-center justify-center"
              style={{ transform: `perspective(900px) rotateY(${mouse.x * 4}deg) rotateX(${mouse.y * -4}deg)` }}
            >
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00e9fa]/20" style={{ animation: 'spin 28s linear infinite reverse' }} />
              <div className="absolute inset-[28px] rounded-full border border-[#00e9fa]/25" style={{ animation: 'spin 18s linear infinite' }} />
              <div className="absolute inset-[58px] rounded-full border border-dotted border-[#00e9fa]/35" style={{ opacity: phase >= 1 ? 1 : 0.25, transition: 'opacity 0.6s ease', animation: 'spin 10s linear infinite reverse' }} />
              <div className="absolute inset-[18px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,233,250,0.14) 0%, transparent 68%)', animation: phase >= 1 ? 'pulse-ring 2.6s ease-out infinite' : 'none' }} />

              <div className="absolute w-[64%] h-[64%]">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      '--orbit-r': `${58 + (i % 3) * 10}px`,
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                      animation: `xlerion-orbit ${2.6 + (i % 4) * 0.35}s linear infinite`,
                      animationDelay: `${i * 0.07}s`,
                      opacity: phase >= 1 ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                    }}
                  >
                    <span
                      className="block rounded-full"
                      style={{
                        width: i % 3 === 0 ? 5 : 3,
                        height: i % 3 === 0 ? 5 : 3,
                        background: i % 2 === 0 ? '#00e9fa' : '#00f9b8',
                        boxShadow: `0 0 ${6 + (i % 3) * 3}px ${i % 2 === 0 ? '#00e9fa' : '#00f9b8'}`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="relative w-28 h-28 md:w-36 md:h-36">
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `inset(${100 - reveal}% 0 0 0)`,
                    transition: 'clip-path 0.25s linear',
                    filter: phase >= 2 ? 'drop-shadow(0 0 18px rgba(0,233,250,0.55)) drop-shadow(0 0 40px rgba(0,233,250,0.2))' : 'none',
                  }}
                >
                  <img src="/LogoX.svg" alt="Xlerion" className="w-full h-full object-contain" style={{ animation: phase >= 1 ? 'float 3.2s ease-in-out infinite' : 'none' }} />
                </div>
                <img src="/LogoX.svg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain opacity-[0.08] grayscale" />
                <div className="absolute inset-x-[-10%] h-[2px] pointer-events-none" style={{ top: `${100 - reveal}%`, opacity: pct < 100 ? 1 : 0, background: 'linear-gradient(90deg, transparent, #00e9fa 50%, transparent)', boxShadow: '0 0 16px rgba(0,233,250,0.9)', transition: 'top 0.25s linear, opacity 0.3s ease' }} />
              </div>

              <div className="absolute inset-0 pointer-events-none">
                {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'].map((c) => (
                  <span key={c} className={`absolute w-6 h-6 border-[#00e9fa]/45 ${c}`} />
                ))}
              </div>
            </div>

            <div className="mt-8 text-center lg:text-left">
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#00e9fa]/85">Xlerion System Boot</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-white">Construyendo experiencia</h1>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-5">
                <span>Ensamblaje</span>
                <span className="text-[#00e9fa] tabular-nums">{String(pct).padStart(3, '0')}%</span>
              </div>

              <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00e9fa] to-[#00b8c9] shadow-[0_0_18px_rgba(0,233,250,0.45)] transition-[width] duration-200 ease-linear" style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-6 space-y-3 font-mono text-[11px] md:text-xs">
                {BOOT_LINES.map((line) => {
                  const on = pct >= line.at;
                  const active = pct >= line.at && pct < line.at + 18;
                  return (
                    <div key={line.text} className="flex items-start gap-3 transition-all duration-500" style={{ opacity: on ? 1 : 0.18, transform: on ? 'translateY(0)' : 'translateY(6px)' }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: on ? '#00e9fa' : 'rgba(255,255,255,0.2)', boxShadow: on ? '0 0 8px #00e9fa' : 'none' }} />
                      <span className={on ? 'text-gray-300' : 'text-gray-600'}>{line.text}</span>
                      {active && <span className="text-[#00e9fa] animate-pulse">▍</span>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300" style={{ background: phase > i ? '#00e9fa' : 'rgba(0,233,250,0.2)', boxShadow: phase > i ? '0 0 8px #00e9fa' : 'none' }} />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  {pct < 100 ? 'Cargando módulos' : 'Listo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {canSkip && (
        <button
          onClick={finish}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 px-5 py-2.5 border border-[#00e9fa]/35 text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.2em] rounded-full bg-[#00e9fa]/[0.04] hover:bg-[#00e9fa]/[0.1] hover:border-[#00e9fa]/60 transition-colors"
        >
          Saltar
        </button>
      )}
    </div>
  );
}
