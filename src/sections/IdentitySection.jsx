import React from 'react';
import { Target, Rocket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader, LinkCard } from '../components/ui';

export default function IdentitySection() {
  const { t } = useLanguage();

  return (
    <section id="identidad" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <SectionHeader title={t('identity_title')} subtitle={t('identity_subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <LinkCard title="Misión" icon={Target} variant="primary" to="/mision">
            {t('identity_mision')}
          </LinkCard>
          <LinkCard title="Visión" icon={Rocket} to="/vision">
            {t('identity_vision')}
          </LinkCard>
        </div>

        <div className="bg-[#0a0a12]/80 border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between rounded-lg backdrop-blur-sm">
          <div className="space-y-6">
            <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em]">
              {'// '}{t('identity_legal_info')}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/[0.05] pb-2">
                <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {t('identity_location')}
                </span>
                <span className="text-xs text-white">Bogotá, Cundinamarca</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.05] pb-2">
                <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {t('identity_ciiu')}
                </span>
                <span className="text-xs text-white">6201, 7410, 7110</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.05] pb-2">
                <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {t('identity_entrepreneurship')}
                </span>
                <span className="text-xs text-white">Digital / Social</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#00e9fa]/20">
            <p className="text-[10px] font-mono text-gray-400 uppercase leading-relaxed">
              {t('identity_nit')} <br />
              {t('identity_company_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
