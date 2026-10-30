import React, { useEffect } from 'react';
import { AlertTriangle, ArrowRight, Cpu, ShieldCheck, TrendingUp, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  es: {
    closeAria: 'Cerrar ficha técnica',
    close: 'Cerrar',
    roi: 'Amortización',
    challengeTitle: 'El Reto Operativo',
    solutionTitle: 'La Solución de Ingeniería Xlerion',
    impactTitle: 'El Impacto de Negocio & ROI',
    stack: 'Tecnologías y protocolos implementados',
    nda: 'Métricas auditables bajo acuerdos de confidencialidad (NDA).',
    cta: 'Agendar PoC similar',
  },
  en: {
    closeAria: 'Close technical brief',
    close: 'Close',
    roi: 'Payback',
    challengeTitle: 'The Operational Challenge',
    solutionTitle: 'The Xlerion Engineering Solution',
    impactTitle: 'Business Impact & ROI',
    stack: 'Technologies and protocols implemented',
    nda: 'Auditable metrics under non-disclosure agreements (NDA).',
    cta: 'Schedule a similar PoC',
  },
};

export default function CaseStudyModal({ caseStudy, onClose }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!caseStudy) return null;

  const blocks = [
    {
      id: 'challenge',
      number: '1',
      title: c.challengeTitle,
      body: caseStudy.challenge,
      icon: AlertTriangle,
      box: 'bg-red-500/[0.05] border-red-500/20',
      label: 'text-red-500',
    },
    {
      id: 'solution',
      number: '2',
      title: c.solutionTitle,
      body: caseStudy.solution,
      icon: Cpu,
      box: 'bg-[#00e9fa]/[0.04] border-[#00e9fa]/20',
      label: 'text-[#00e9fa]',
    },
    {
      id: 'impact',
      number: '3',
      title: c.impactTitle,
      body: caseStudy.impact,
      icon: TrendingUp,
      box: 'bg-emerald-500/[0.05] border-emerald-400/20',
      label: 'text-emerald-400',
    },
  ];

  const handleCta = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-[#0a0a12] border border-[#00e9fa]/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 md:p-7 border-b border-white/[0.08]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded bg-[#00e9fa]/10 border border-[#00e9fa]/20 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00e9fa]">
                {caseStudy.industryLabel}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                {caseStudy.clientCategory}
              </span>
            </div>
            <h3 className="text-lg md:text-2xl font-semibold text-white leading-snug">
              {caseStudy.title}
            </h3>
            <p className="mt-2 text-xs md:text-sm text-gray-400 leading-relaxed">{caseStudy.tagline}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={c.closeAria}
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors duration-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 md:p-7 space-y-6">
          {/* Hero image */}
          <div className="relative h-52 md:h-64 rounded-lg overflow-hidden border border-white/[0.08]">
            <img
              src={caseStudy.image}
              alt={caseStudy.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-3 left-4 px-3 py-1 rounded bg-black/70 border border-emerald-400/20 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 backdrop-blur-sm">
              {c.roi}: {caseStudy.roiTimeline}
            </span>
          </div>

          {/* Numbered narrative blocks */}
          {blocks.map((block) => {
            const Icon = block.icon;
            return (
              <div key={block.id} className={`p-4 md:p-5 rounded-lg border ${block.box}`}>
                <span
                  className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] ${block.label}`}
                >
                  <Icon size={14} />
                  {block.number}. {block.title}
                </span>
                <p className="mt-2 text-xs md:text-sm text-gray-300 leading-relaxed">{block.body}</p>
              </div>
            );
          })}

          {/* Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {caseStudy.metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center"
              >
                <span className="block text-base md:text-lg font-mono font-bold text-[#00e9fa]">
                  {metric.value}
                </span>
                <span className="block mt-1 text-[10px] font-mono uppercase tracking-widest text-gray-500 leading-tight">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div>
            <span className="block mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
              {'// '}
              {c.stack}
            </span>
            <div className="flex flex-wrap gap-2">
              {caseStudy.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.08] text-[11px] font-mono text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
            <span className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <ShieldCheck size={15} className="text-[#00e9fa] shrink-0" />
              {c.nda}
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-lg font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors duration-300"
              >
                {c.close}
              </button>
              <a
                href="#contacto"
                onClick={handleCta}
                className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#00e9fa] text-black font-mono text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-[#00b8c9] transition-colors duration-300"
              >
                {c.cta}
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
