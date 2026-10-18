import React from 'react';
import { ArrowRight, Building2, ChevronDown, Cpu, Factory, Pickaxe, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui';
import { DigitalTwinViewer3D } from '../components/DigitalTwinViewer3D';

const COPY = {
  es: {
    badge: 'DEEPTECH INDUSTRIAL: MINERÍA • MANUFACTURA • SMART CITIES',
    titleLead: 'Desarrollo de Gemelos Digitales Industriales y',
    titleHighlight: 'Simulación en Tiempo Real',
    titleTail: 'para operaciones críticas.',
    subtitle:
      'Construimos réplicas virtuales 3D de sus activos críticos, conectadas a telemetría IoT en vivo para anticipar fallas, reducir tiempos de decisión y optimizar cada ciclo operativo.',
    sectors: ['Minería', 'Manufactura', 'Smart Cities'],
    ctaPrimary: 'Agendar Prueba de Concepto',
    ctaSecondary: 'Ver Casos de Éxito',
    trust: ['-60% Latencia', 'WebGL 60 FPS', 'ISO 27001'],
    scroll: 'Explorar resultados y arquitecturas',
    cornerTop: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
    cornerBottom: "COORD_LATAM [04°42'N 74°04'W]",
  },
  en: {
    badge: 'DEEPTECH INDUSTRIAL: MINING • MANUFACTURING • SMART CITIES',
    titleLead: 'Industrial Digital Twin Development and',
    titleHighlight: 'Real-Time Simulation',
    titleTail: 'for mission-critical operations.',
    subtitle:
      'We build 3D virtual replicas of your critical assets, connected to live IoT telemetry to anticipate failures, shorten decision cycles and optimize every operational loop.',
    sectors: ['Mining', 'Manufacturing', 'Smart Cities'],
    ctaPrimary: 'Book a Proof of Concept',
    ctaSecondary: 'See Success Stories',
    trust: ['-60% Latency', 'WebGL 60 FPS', 'ISO 27001'],
    scroll: 'Explore results and architectures',
    cornerTop: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
    cornerBottom: "COORD_LATAM [04°42'N 74°04'W]",
  },
};

const SECTOR_ICONS = [Pickaxe, Factory, Building2];
const TRUST_ICONS = [Zap, Cpu, ShieldCheck];

export default function HeroSection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  const handleSeeCases = () => {
    const target = document.getElementById('casos');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden" data-reveal>
      {/* Grid técnico sutil (CSS inline con gradientes lineales) */}
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
            <div
              className="hero-fade-in inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0a12]/80 border border-[#00e9fa]/20 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#00e9fa]"
            >
              <span className="w-2 h-2 rounded-full bg-[#00e9fa] animate-pulse" />
              <span>{c.badge}</span>
            </div>

            <h1 className="hero-fade-in-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-white">
              {c.titleLead}{' '}
              <span className="text-gradient bg-clip-text text-transparent">{c.titleHighlight}</span>{' '}
              {c.titleTail}
            </h1>

            <p className="hero-fade-in-delay-2 text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
              {c.subtitle}
            </p>

            {/* Pills de sectores */}
            <div className="hero-fade-in-delay-2 flex flex-wrap items-center gap-2.5">
              {c.sectors.map((sector, index) => {
                const Icon = SECTOR_ICONS[index];
                return (
                  <span
                    key={sector}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#00e9fa]" />
                    {sector}
                  </span>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="hero-fade-in-delay-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button type="button" onClick={() => onOpenPoC?.()} className="xl-btn-primary">
                {c.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleSeeCases} className="xl-btn-secondary">
                {c.ctaSecondary}
              </button>
            </div>

            {/* Badges de confianza */}
            <div className="hero-fade-in-delay-4">
              <Card variant="primary" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {c.trust.map((item, index) => {
                  const Icon = TRUST_ICONS[index];
                  return (
                    <div key={item} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em]">
                      <Icon className="w-4 h-4 text-[#00e9fa] shrink-0" />
                      <span className="text-white">{item}</span>
                    </div>
                  );
                })}
              </Card>
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
        <div className="hero-fade-in-delay-4 mt-14 flex justify-center">
          <button
            type="button"
            onClick={handleSeeCases}
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
