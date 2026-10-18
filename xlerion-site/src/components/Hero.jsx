import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-secondary/20 to-black" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <img
          src="/LogoX.png"
          alt="Xlerion"
          className="mx-auto mb-8 h-32 md:h-40 lg:h-56 object-contain"
          style={{ filter: 'drop-shadow(0 0 30px rgba(0, 233, 250, 0.6))' }}
        />

        <h1 className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          <span className="sr-only">Xlerion - Desarrollo de Gemelos Digitales Industriales y Simulación en Tiempo Real.&#160;</span>
          {t('hero_line1')} <br />
          <span className="text-white">{t('hero_line2')}</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pb-12">
          <button onClick={() => onNavigate?.('toolkit')} className="xl-btn-primary">
            {t('hero_cta_toolkit')}
          </button>
          <button
            onClick={() => onNavigate?.('servicios')}
            className="px-10 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            {t('hero_cta_services')}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm md:text-base text-primary font-mono uppercase tracking-[0.3em]">
            {t('hero_claim')}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-primary" />
      </div>
    </section>
  );
}
