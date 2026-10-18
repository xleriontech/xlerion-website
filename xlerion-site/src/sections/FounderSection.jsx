import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Linkedin, Briefcase, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

export default function FounderSection() {
  const { t } = useLanguage();

  return (
    <section id="fundador" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <SectionHeader title={t('founder_title')} subtitle={t('founder_subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <p>{t('founder_intro')}</p>
          <p>
            {t('founder_author')} <span className="text-white font-semibold">Total Darkness</span>, {t('founder_work_desc')}
          </p>
          <Link
            to="/fundador"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#00e9fa]/10 border border-[#00e9fa] text-[#00e9fa] hover:bg-[#00e9fa]/20 transition-all duration-300 font-mono text-xs uppercase tracking-wider rounded-lg"
          >
            {t('founder_learn_more')} <ChevronRight size={16} />
          </Link>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a0a12]/80 border border-white/[0.08] p-6 md:p-8 rounded-lg backdrop-blur-sm">
            <h3 className="font-semibold text-white text-sm mb-3">
              {t('founder_values')}
            </h3>
            <ul className="space-y-2 text-[12px] text-gray-400 font-mono uppercase tracking-widest">
              <li>{t('founder_value_1')}</li>
              <li>{t('founder_value_2')}</li>
              <li>{t('founder_value_3')}</li>
              <li>{t('founder_value_4')}</li>
            </ul>
          </div>

          <div className="bg-[#0a0a12]/80 border border-white/[0.08] p-6 md:p-8 rounded-lg backdrop-blur-sm">
            <h3 className="font-semibold text-white text-sm mb-4">CONNECT</h3>
            <div className="space-y-3">
              <a
                href="https://linkedin.com/in/mikerodriguez84"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-[#00e9fa] transition-colors text-xs font-mono"
              >
                <Linkedin size={16} />
                <span>LINKEDIN</span>
              </a>
              <a
                href="https://artstation.com/xlerion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-[#00e9fa] transition-colors text-xs font-mono"
              >
                <Briefcase size={16} />
                <span>ARTSTATION</span>
              </a>
              <a
                href="https://instagram.com/mike_hellawaits"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-[#00e9fa] transition-colors text-xs font-mono"
              >
                <Instagram size={16} />
                <span>INSTAGRAM</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
