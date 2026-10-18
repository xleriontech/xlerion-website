import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Terminal, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  es: {
    specTitle: 'Especificación de ingeniería y flujo de datos',
    topology: 'Topología de la arquitectura',
    deliverables: 'Entregables técnicos en producción',
    stack: 'Stack tecnológico implementado',
    security: 'Alineado a ISO 27001 · Cifrado TLS 1.3 / AES-256',
    close: 'Cerrar',
    cta: 'Solicitar PoC para este servicio',
    closeLabel: 'Cerrar modal',
  },
  en: {
    specTitle: 'Engineering specification and data flow',
    topology: 'Architecture topology',
    deliverables: 'Technical deliverables in production',
    stack: 'Implemented technology stack',
    security: 'Aligned to ISO 27001 · TLS 1.3 / AES-256 encryption',
    close: 'Close',
    cta: 'Request a PoC for this service',
    closeLabel: 'Close modal',
  },
};

export default function ArchitectureModal({ solution, onClose }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  useEffect(() => {
    if (!solution) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [solution, onClose]);

  if (!solution) return null;

  const deliverables = solution.deliverables || [];
  const technologies = solution.technologies || [];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-[#0a0a12] border border-[#00e9fa]/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#00e9fa]/10 border border-[#00e9fa]/20 text-[#00e9fa]">
              {solution.badge}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white mt-3">{solution.title}</h3>
            <p className="text-xs md:text-sm font-mono text-gray-500 mt-1">{solution.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.closeLabel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">
              <Terminal className="w-4 h-4" /> {c.specTitle}
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">{solution.description}</p>
          </div>

          {/* Architecture highlight box */}
          <div className="p-4 rounded-lg bg-[#050508] border border-[#00e9fa]/20">
            <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">
              {c.topology}
            </span>
            <p className="font-mono text-xs md:text-sm text-[#00e9fa] leading-relaxed">
              {solution.architectureHighlight}
            </p>
          </div>

          {/* Deliverables */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-gray-400 mb-3">
              <Layers className="w-4 h-4 text-[#00e9fa]" /> {c.deliverables}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {deliverables.map((item) => (
                <div
                  key={item}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-start gap-2.5 text-xs text-gray-400"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00e9fa] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 mb-2">{c.stack}</h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-md bg-white/[0.02] border border-white/[0.08] text-xs font-mono text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <ShieldCheck className="w-4 h-4 text-[#00e9fa]" />
            <span>{c.security}</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-gray-400 hover:bg-white/[0.06] transition-colors"
            >
              {c.close}
            </button>
            <a
              href="#contacto"
              onClick={onClose}
              className="w-1/2 sm:w-auto xl-btn-primary !py-2.5 !px-5 !text-xs"
            >
              <span>{c.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
