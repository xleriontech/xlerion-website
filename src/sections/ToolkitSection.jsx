import React from 'react';
import { CheckCircle2, Terminal, Activity, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader, LinkCard } from '../components/ui';
import ToolkitThreeScene from '../components/ToolkitThreeScene';

export default function ToolkitSection() {
  const { t } = useLanguage();

  return (
    <section id="toolkit" className="relative py-20 md:py-28 bg-white/[0.02] border-y border-white/[0.05] overflow-hidden">
      <ToolkitThreeScene />
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div data-reveal>
          <SectionHeader title={t('toolkit_title')} subtitle={t('toolkit_subtitle')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {[CheckCircle2, Terminal, Activity, Zap].map((Icon, i) => {
            const keys = [
              { title: 'toolkit_validation_title', desc: 'toolkit_validation_desc', to: '/toolkit/validacion' },
              { title: 'toolkit_logging_title', desc: 'toolkit_logging_desc', to: '/toolkit/logging' },
              { title: 'toolkit_diagnostico_title', desc: 'toolkit_diagnostico_desc', to: '/toolkit/diagnostico' },
              { title: 'toolkit_performance_title', desc: 'toolkit_performance_desc', to: '/toolkit/performance' },
            ]
            return (
              <div key={keys[i].to} data-reveal className={`stagger-${i + 1}`}>
                <LinkCard title={t(keys[i].title)} icon={Icon} to={keys[i].to}>
                  {t(keys[i].desc)}
                </LinkCard>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div data-reveal className="space-y-6">
            <h3 className="text-2xl font-bold text-white">{t('toolkit_specs_title')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('toolkit_specs_desc')}
            </p>
            <ul className="space-y-3 font-mono text-xs text-[#00e9fa] uppercase tracking-widest">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00e9fa] rounded-full" />
                {t('toolkit_spec_1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00e9fa] rounded-full" />
                {t('toolkit_spec_2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00e9fa] rounded-full" />
                {t('toolkit_spec_3')}
              </li>
            </ul>
          </div>

          <div data-reveal className="bg-[#0a0a12]/80 p-6 md:p-8 border-l-4 border-[#00e9fa] rounded-lg font-mono text-[11px] leading-relaxed text-gray-500 backdrop-blur-sm glow-on-hover">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-gray-600">Terminal</span>
            </div>
            <span className="text-white">root@xlerion:~$</span> toolkit --status<br />
            <span className="text-green-500">System: Operational</span><br />
            <span className="text-[#00e9fa]">Modules: 4 Active</span><br />
            <span className="text-gray-600">Trace: Documenting dynamics...</span>
          </div>
        </div>
      </div>
    </section>
  )
}
