import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

export default function StrategySection() {
  const { t } = useLanguage();

  return (
    <section id="estrategia" className="py-20 md:py-28 bg-[#050508]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader title={t('strategy_title')} subtitle={t('strategy_subtitle')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <div>
              <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] mb-4">
                {t('strategy_target')}
              </h3>
              <p className="text-gray-400 text-sm">{t('strategy_target_desc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm">
                <h5 className="font-semibold text-white text-sm mb-2">
                  {t('strategy_timeline')}
                </h5>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed font-mono">
                  {t('strategy_timeline_desc')}
                </p>
              </div>
              <div className="bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm">
                <h5 className="font-semibold text-white text-sm mb-2">
                  {t('strategy_goals')}
                </h5>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed font-mono">
                  {t('strategy_goals_desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {t('strategy_risks')}
            </h3>
            <div className="space-y-4 text-xs font-mono">
              <div className="flex gap-4 items-start p-4 bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg backdrop-blur-sm">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-white uppercase">{t('risk_technical')}</span>
                  <p className="text-gray-500 mt-1 uppercase tracking-tighter">
                    {t('risk_technical_desc')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg backdrop-blur-sm">
                <TrendingUp className="text-[#00e9fa] shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-white uppercase">{t('risk_commercial')}</span>
                  <p className="text-gray-500 mt-1 uppercase tracking-tighter">
                    {t('risk_commercial_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
