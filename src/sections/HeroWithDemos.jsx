import React, { lazy, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const HeroScene = lazy(() => import('../components/HeroScene'));
const EASE = [0.16, 1, 0.3, 1];

const HERO_COPY = {
  es: {
    badge: 'Gemelos digitales · IoT · Visualización 3D',
    line1: 'Datos que se',
    line2a: 'vuelven',
    line2b: 'visibles.',
    subtitle:
      'Xlerion integra modelado 3D, IoT (MQTT) y visualización web para que tu equipo vea qué pasa en la planta, la mina o el municipio, y actúe a tiempo.',
    ctaPrimary: 'Agenda 20 minutos para evaluar tu caso',
    scroll: 'Explorar soluciones',
    proofs: [
      'Plataforma de gestión para 12+ municipios',
      'Dashboards en tiempo real con WebSockets y MQTT',
      'Entregas con pruebas automatizadas y CI/CD',
    ],
  },
  en: {
    badge: 'Digital twins · IoT · 3D visualization',
    line1: 'Data that',
    line2a: 'becomes',
    line2b: 'visible.',
    subtitle:
      'Xlerion integrates 3D modeling, IoT (MQTT) and web visualization so your team can see what is happening in the plant, mine or municipality, and act in time.',
    ctaPrimary: 'Book a 20-minute case review',
    scroll: 'Explore solutions',
    proofs: [
      'Management platform for 12+ municipalities',
      'Real-time dashboards with WebSockets and MQTT',
      'Deliveries with automated tests and CI/CD',
    ],
  },
};

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '112%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroWithDemos({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = HERO_COPY[lang] || HERO_COPY.es;

  const handleExplore = () => {
    const target = document.getElementById('soluciones');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-black" data-reveal>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_65%_55%_at_50%_45%,transparent_25%,rgba(0,0,0,0.62)_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 z-[1] bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 md:px-10 lg:px-14 pt-28 md:pt-32 pb-8 md:pb-10 max-w-[100rem] mx-auto">
        <motion.div
          className="flex items-center justify-between font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#00e9fa] animate-pulse-dot" />{c.badge}</span>
          <span className="hidden md:block">Xlerion / Colombia</span>
        </motion.div>

        <div className="flex flex-col gap-8 md:gap-10">
          <div>
            <Reveal delay={0.2}>
              <span className="text-[clamp(3.2rem,11vw,10rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
                {c.line1}
              </span>
            </Reveal>
            <Reveal delay={0.32}>
              <span className="text-[clamp(3.2rem,11vw,10rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em]">
                <span className="text-stroke">{c.line2a}</span>{' '}
                <span className="text-[#00e9fa]">{c.line2b}</span>
              </span>
            </Reveal>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.p
              className="max-w-xl text-base md:text-lg text-gray-400 leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.65 }}
            >
              {c.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <button
                type="button"
                onClick={onOpenPoC}
                data-hover
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#00e9fa] text-black font-semibold text-sm tracking-wide hover:bg-white transition-colors duration-300"
              >
                {c.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleExplore}
                className="hidden md:flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-[#00e9fa] transition-colors"
              >
                <span>{c.scroll}</span>
                <span className="block h-12 w-px animate-scroll-line bg-white/50" />
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="pt-6 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.05 }}
        >
          {(c.proofs || []).map((proof, i) => (
            <span key={proof} className="inline-flex items-center gap-3 text-sm text-gray-400">
              <span className="font-mono text-[10px] text-[#00e9fa]/70">0{i + 1}</span>
              {proof}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
