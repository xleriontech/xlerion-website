import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Target, Rocket, Linkedin, Briefcase, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <div data-reveal>
        <SectionHeader title={t('identity_title')} subtitle={t('identity_subtitle')} />
      </div>

      {/* Mission + Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10">
        <div data-reveal className="stagger-1">
          <Link
            to="/mision"
            className="group relative block bg-[#00e9fa]/[0.04] border border-[#00e9fa]/20 p-5 md:p-6 rounded-lg backdrop-blur-sm overflow-hidden card-hover"
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="text-[#00e9fa] group-hover:scale-110 transition-transform duration-300" size={20} />
              <h3 className="text-base font-semibold text-white group-hover:text-[#00e9fa] transition-colors duration-300">Misión</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t('identity_mision')}</p>
            <div className="absolute -bottom-3 -right-3 text-[#00e9fa]/[0.03] group-hover:text-[#00e9fa]/[0.06] transition-all duration-500 pointer-events-none">
              <Target size={80} />
            </div>
          </Link>
        </div>

        <div data-reveal className="stagger-2">
          <Link
            to="/vision"
            className="group relative block bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm overflow-hidden card-hover"
          >
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="text-[#00e9fa] group-hover:scale-110 transition-transform duration-300" size={20} />
              <h3 className="text-base font-semibold text-white group-hover:text-[#00e9fa] transition-colors duration-300">Visión</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t('identity_vision')}</p>
            <div className="absolute -bottom-3 -right-3 text-[#00e9fa]/[0.03] group-hover:text-[#00e9fa]/[0.06] transition-all duration-500 pointer-events-none">
              <Rocket size={80} />
            </div>
          </Link>
        </div>
      </div>

      {/* Company + Philosophy + Founder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <div data-reveal className="stagger-3 bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm glow-on-hover">
          <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {'// '}{t('identity_legal_info')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-white/[0.05] pb-2">
              <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">{t('identity_location')}</span>
              <span className="text-xs text-white">Bogotá, Cundinamarca</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.05] pb-2">
              <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">{t('identity_ciiu')}</span>
              <span className="text-xs text-white">6201, 7410, 7110</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.05] pb-2">
              <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">{t('identity_entrepreneurship')}</span>
              <span className="text-xs text-white">Digital / Social</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed mt-4">
            {t('identity_nit')}
          </p>
        </div>

        <div data-reveal className="stagger-4 bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm glow-on-hover">
          <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {'// '}{t('philosophy_subtitle')}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{t('philosophy_intro')}</p>
          <ul className="space-y-2 text-[11px] text-gray-400 font-mono uppercase tracking-widest">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#00e9fa] rounded-full" />
              {t('philosophy_value_1')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#00e9fa] rounded-full" />
              {t('philosophy_value_2')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#00e9fa] rounded-full" />
              {t('philosophy_value_3')}
            </li>
          </ul>
        </div>

        <div data-reveal className="stagger-5 bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm glow-on-hover">
          <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {'// '}{t('founder_subtitle')}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {t('founder_intro')}
          </p>
          <Link
            to="/fundador"
            className="inline-flex items-center gap-2 text-[#00e9fa] text-xs font-mono uppercase tracking-wider hover:underline mb-4 transition-all duration-200"
          >
            {t('founder_learn_more')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="pt-4 border-t border-white/[0.05] space-y-2">
            <a href="https://linkedin.com/in/mikerodriguez84" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#00e9fa] transition-colors duration-200 text-[11px] font-mono">
              <Linkedin size={12} /> LinkedIn
            </a>
            <a href="https://artstation.com/xlerion" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#00e9fa] transition-colors duration-200 text-[11px] font-mono">
              <Briefcase size={12} /> ArtStation
            </a>
            <a href="https://instagram.com/mike_hellawaits" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-[#00e9fa] transition-colors duration-200 text-[11px] font-mono">
              <Instagram size={12} /> Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
