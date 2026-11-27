import React from 'react';

/**
 * HeroContent — texto dinámico del hero según el demo activo:
 * título (beneficio), descripción, métricas técnicas y stack discreto.
 * Se re-monta con key={demo.id} para repetir la animación de entrada.
 */
export default function HeroContent({ demo, lang }) {
  const copy = demo.copy[lang] || demo.copy.es;

  return (
    <div key={demo.id} className="xl-slide-up space-y-3" role="tabpanel" id="hero-demo-panel" aria-labelledby={`hero-demo-tab-${demo.id}`}>
      <h3 className="text-lg md:text-xl font-semibold text-white leading-snug">{copy.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{copy.desc}</p>

      {/* Métricas clave (para el CTO) */}
      <div className="flex flex-wrap gap-1.5">
        {copy.metrics.map((metric) => (
          <span
            key={metric}
            className="inline-flex items-center px-2 py-1 rounded border border-[#00e9fa]/20 bg-[#00e9fa]/[0.06] font-mono text-[10px] uppercase tracking-[0.1em] text-[#00e9fa]"
          >
            {metric}
          </span>
        ))}
      </div>

      {/* Stack discreto */}
      <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-gray-600">
        {lang === 'es' ? 'Stack' : 'Stack'}: {copy.stack}
      </p>
    </div>
  );
}
