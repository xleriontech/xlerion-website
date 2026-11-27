import React, { useEffect, useRef, useState } from 'react';

const LINES = ['Sincronizando sección...', 'Ensamblando módulos...', 'Listo'];

export default function SectionLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const doneRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    if (!fine) return undefined;
    const onMove = (e) => setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const steps = 40;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      const p = Math.min(100, Math.round((i / steps) * 100));
      setProgress(p);
      if (i >= steps) {
        clearInterval(iv);
        setTimeout(() => { if (!doneRef.current) { doneRef.current = true; onComplete?.(); } }, 180);
      }
    }, 28);
    return () => clearInterval(iv);
  }, [onComplete]);

  const pct = progress;
  const phase = pct >= 80 ? 2 : pct >= 35 ? 1 : 0;

  return (
    <div className="fixed inset-0 z-[99998] bg-[#050508]/95 backdrop-blur-sm flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,233,250,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,233,250,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at 50% 50%, #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)',
          transform: `translate(${mouse.x * -6}px, ${mouse.y * -6}px)`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(420px circle at ${50 + mouse.x * 10}% ${50 + mouse.y * 10}%, rgba(0,233,250,0.12), transparent 65%)` }} />

      <div className="relative flex flex-col items-center px-6">
        <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center" style={{ transform: `perspective(700px) rotateY(${mouse.x * 3}deg) rotateX(${mouse.y * -3}deg)` }}>
          <div className="absolute inset-0 rounded-full border border-dashed border-[#00e9fa]/20" style={{ animation: 'spin 20s linear infinite reverse' }} />
          <div className="absolute inset-[22px] rounded-full border border-[#00e9fa]/25" style={{ animation: 'spin 14s linear infinite' }} />
          <div className="absolute inset-[44px] rounded-full border border-dotted border-[#00e9fa]/35" style={{ opacity: phase >= 1 ? 1 : 0.3, transition: 'opacity .4s ease' }} />
          <div className="absolute inset-[14px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,233,250,0.14) 0%, transparent 70%)', animation: phase >= 1 ? 'pulse-ring 2.2s ease-out infinite' : 'none' }} />

          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <div className="absolute inset-0" style={{ clipPath: `inset(${100 - pct}% 0 0 0)`, transition: 'clip-path .2s linear', filter: phase >= 1 ? 'drop-shadow(0 0 14px rgba(0,233,250,0.5))' : 'none' }}>
              <img src="/LogoX.svg" alt="Xlerion" className="w-full h-full object-contain" style={{ animation: phase >= 1 ? 'float 3s ease-in-out infinite' : 'none' }} />
            </div>
            <img src="/LogoX.svg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain opacity-[0.08] grayscale" />
            <div className="absolute inset-x-[-10%] h-[2px]" style={{ top: `${100 - pct}%`, opacity: pct < 100 ? 1 : 0, background: 'linear-gradient(90deg, transparent, #00e9fa 50%, transparent)', boxShadow: '0 0 12px rgba(0,233,250,0.8)', transition: 'top .2s linear' }} />
          </div>

          {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'].map((c) => (
            <span key={c} className={`absolute w-5 h-5 border-[#00e9fa]/45 ${c}`} />
          ))}
        </div>

        <div className="mt-6 w-[min(84vw,340px)]">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-gray-400 mb-3">
            <span>{LINES[phase]}</span>
            <span className="text-[#00e9fa] tabular-nums">{String(pct).padStart(3, '0')}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#00e9fa] to-[#00b8c9] shadow-[0_0_14px_rgba(0,233,250,0.45)] transition-[width] duration-150 linear" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
