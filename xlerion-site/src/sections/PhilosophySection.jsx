import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

export default function PhilosophySection() {
  const { t } = useLanguage();

  return (
    <section id="filosofia" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <SectionHeader title={t('philosophy_title')} subtitle={t('philosophy_subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <p>{t('philosophy_intro')}</p>
          <div>
            <h5 className="font-semibold text-white text-xs mb-2 uppercase tracking-wider">
              {t('philosophy_mission')}
            </h5>
            <p>{t('philosophy_mission_desc')}</p>
          </div>
          <div>
            <h5 className="font-semibold text-white text-xs mb-2 uppercase tracking-wider">
              {t('philosophy_vision')}
            </h5>
            <p>{t('philosophy_vision_desc')}</p>
          </div>
        </div>

        <div className="bg-[#0a0a12]/80 border border-white/[0.08] p-6 md:p-8 rounded-lg backdrop-blur-sm">
          <h5 className="font-semibold text-white text-xs mb-4 uppercase tracking-wider">
            {t('philosophy_values')}
          </h5>
          <ul className="space-y-2 text-[12px] text-gray-400 font-mono uppercase tracking-widest">
            <li>{t('philosophy_value_1')}</li>
            <li>{t('philosophy_value_2')}</li>
            <li>{t('philosophy_value_3')}</li>
            <li>Modularidad estructural</li>
            <li>Impacto cultural territorial</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
