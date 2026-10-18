import React from 'react';
import { Shield, Info, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader, LinkCard } from '../components/ui';

export default function LegalSection() {
  const { t } = useLanguage();

  return (
    <section id="legal" className="py-20 md:py-28 bg-[#050508]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader title={t('legal_title')} subtitle={t('legal_subtitle')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <LinkCard title={t('legal_privacy_title')} icon={Shield} to="/legal/privacidad">
            {t('legal_privacy_desc')}
          </LinkCard>
          <LinkCard title={t('legal_terms_title')} icon={Info} to="/legal/terminos">
            {t('legal_terms_desc')}
          </LinkCard>
          <LinkCard title={t('legal_licenses_title')} icon={Database} to="/legal/licencias">
            {t('legal_licenses_desc')}
          </LinkCard>
        </div>

        <div className="mt-12 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
          {t('legal_consumer_rights')}
        </div>
      </div>
    </section>
  )
}
