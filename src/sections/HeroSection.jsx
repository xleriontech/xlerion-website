import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DigitalTwinViewer3D } from '../components/DigitalTwinViewer3D';

const COPY = {
  es: {
    badge: 'DEEPTECH INDUSTRIAL: MINERÍA • MANUFACTURA • SMART CITIES',
    title: 'Transforme sus datos industriales en Inteligencia Visual 3D y Plataformas de IA en Tiempo Real.',
    subtitle: 'Arquitecturas de software escalables y tolerantes a fallos. Más de 10 años de experiencia integrando visualización 3D interactiva (WebGL/Three.js) e Inteligencia Artificial (RAG/LangChain) para operaciones críticas.',
    ctaPrimary: 'Solicitar Prueba de Concepto (PoC)',
    ctaSecondary: 'Explorar Arquitectura Técnica',
    scroll: 'Explorar proyectos',
    cornerTop: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
    cornerBottom: "COORD_LATAM [04°42'N 74°04'W]",
  },
  en: {
    badge: 'INDUSTRIAL DEEPTECH: MINING • MANUFACTURING • SMART CITIES',
    title: 'Transform Your Industrial Data into 3D Visual Intelligence and Real-Time AI Platforms.',
    subtitle: 'Scalable and fault-tolerant software architectures. Over 10 years of experience integrating interactive 3D visualization (WebGL/Three.js) and Artificial Intelligence (RAG/LangChain) for critical operations.',
    ctaPrimary: 'Request Proof of Concept (PoC)',
    ctaSecondary: 'Explore Technical Architecture',
    scroll: 'Explore Projects',
    cornerTop: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
    cornerBottom: "COORD_LATAM [04°42'N 74°04'W]",
  },
};

export default function HeroSection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  const handleExploreArchitecture = () => {
    const target = document.getElementById('arquitectura');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSeeProjects = () => {
    const target = document.getElementById('proyectos');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden" data-reveal>
      {/* Grid técnico sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 233, 250, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 233, 250, 0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, #000 35%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 35%, transparent 78%)',
        }}
      />

      {/* Blobs radiales cian con blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[720px] max-w-full rounded-full bg-[#00e9fa]/10"
        style={{ filter: 'blur(80px)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-[#00e9fa]/[0.07]"
        style={{ filter: 'blur(80px)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#0055ff]/10"
        style={{ filter: 'blur(80px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* Columna izquierda: propuesta de valor */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0a12]/80 border border-[#00e9fa]/20 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#00e9fa]">
              <span className="w-2 h-2 rounded-full bg-[#00e9fa] animate-pulse" />
              <span>{c.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-white">
              {c.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
              {c.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button type="button" onClick={onOpenPoC} className="xl-btn-primary">
                {c.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleExploreArchitecture} className="xl-btn-secondary">
                {c.ctaSecondary}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Columna derecha: gemelo digital interactivo */}
          <div className="relative">
            <div className="pointer-events-none absolute -top-3 -left-3 hidden sm:block font-mono text-[9px] text-[#00e9fa]/60">
              {c.cornerTop}
            </div>
            <div className="pointer-events-none absolute -bottom-3 -right-3 hidden sm:block font-mono text-[9px] text-[#00e9fa]/60">
              {c.cornerBottom}
            </div>

            <div className="hero-fade-in-delay-2">
              <DigitalTwinViewer3D />
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={handleSeeProjects}
            className="flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-[#00e9fa] transition-colors"
          >
            <span>{c.scroll}</span>
            <ChevronDown className="w-4 h-4 text-[#00e9fa] animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}