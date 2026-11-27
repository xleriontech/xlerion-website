import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * DemoTabs — lista de tabs del hero con barra de progreso de rotación.
 * Accesible: role=tablist/tab, aria-selected, flechas del teclado, Home/End.
 */
export default function DemoTabs({ demos, activeIndex, onSelect, progress, paused, lang }) {
  const handleKeyDown = (event) => {
    const last = demos.length - 1;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        onSelect(activeIndex === last ? 0 : activeIndex + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        onSelect(activeIndex === 0 ? last : activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        onSelect(0);
        break;
      case 'End':
        event.preventDefault();
        onSelect(last);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-2">
      <div
        role="tablist"
        aria-label={lang === 'es' ? 'Demostraciones de servicios' : 'Service demos'}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="flex gap-1.5 overflow-x-auto pb-1 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {demos.map((demo, i) => {
          const Icon = demo.icon;
          const selected = i === activeIndex;
          return (
            <button
              key={demo.id}
              type="button"
              role="tab"
              id={`hero-demo-tab-${demo.id}`}
              aria-selected={selected}
              aria-controls="hero-demo-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(i)}
              className={`snap-start inline-flex shrink-0 items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] transition-all duration-300 ${
                selected
                  ? 'bg-[#00e9fa]/15 text-[#00e9fa] border-[#00e9fa]/50 shadow-[0_0_16px_rgba(0,233,250,0.15)]'
                  : 'bg-white/[0.02] text-gray-400 border-white/[0.08] hover:text-white hover:border-[#00e9fa]/30'
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              {demo.label[lang] || demo.label.es}
            </button>
          );
        })}
      </div>

      {/* Barra de progreso de la rotación automática */}
      <div
        className="relative h-0.5 rounded-full bg-white/[0.06] overflow-hidden"
        role="progressbar"
        aria-label={lang === 'es' ? 'Tiempo hasta la siguiente demostración' : 'Time until next demo'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={paused ? 0 : Math.round(progress * 100)}
      >
        <div
          className="absolute inset-y-0 left-0 bg-[#00e9fa]/70 transition-[width] duration-100 ease-linear"
          style={{ width: paused ? '0%' : `${progress * 100}%` }}
        />
      </div>

      <p className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.15em] text-gray-600">
        {paused ? (
          <>
            <ArrowRight size={10} aria-hidden="true" />
            {lang === 'es' ? 'Rotación en pausa — elige una demo' : 'Rotation paused — pick a demo'}
          </>
        ) : (
          <>
            <ArrowLeft size={10} aria-hidden="true" />
            {lang === 'es' ? 'Rotación automática activa' : 'Auto-rotation active'}
          </>
        )}
      </p>
    </div>
  );
}
