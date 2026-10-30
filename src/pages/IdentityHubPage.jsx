import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';
import useScrollAnimation from '../hooks/useScrollAnimation';

/**
 * Hub /identidad — información legal y de contacto de Xlerion.
 */
export default function IdentityHubPage() {
  const { t, lang } = useLanguage();
  useAnalytics('Identidad', 'hub');
  useScrollAnimation({ enabled: true, selector: 'section' });

  return (
    <Layout>
      {/* Encabezado de página */}
      <header className="pt-32 pb-14 px-6 md:px-8 max-w-7xl mx-auto w-full border-b border-white/[0.08]">
        <Breadcrumbs items={[{ label: lang === 'es' ? 'Identidad' : 'Identity' }]} />
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">
          // identidad_empresarial
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          {lang === 'es' ? 'Identidad Empresarial' : 'Corporate Identity'}
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          {lang === 'es'
            ? 'Información legal, ubicación y certificaciones del fundador de Xlerion.'
            : 'Legal information, location, and founder certifications for Xlerion.'}
        </p>
        <Link to="/" className="xl-btn-secondary mt-8">
          ← {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
        </Link>
      </header>

      <main className="px-6 md:px-8 max-w-7xl mx-auto py-16">
        {/* Founder Certifications */}
        <section className="mb-16" data-reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#00e9fa] font-mono text-sm">01</span>
            {lang === 'es' ? 'Certificaciones del Fundador' : "Founder's Certifications"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: 'Award',
                title: lang === 'es' ? 'PMP® Project Management Professional' : 'PMP® Project Management Professional',
                issuer: 'PMI',
                year: '2020',
                tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
              },
              {
                icon: 'GraduationCap',
                title: lang === 'es' ? 'AI/GenAI Specialization (with Honors)' : 'AI/GenAI Specialization (with Honors)',
                issuer: 'UC Irvine',
                year: '2024',
                tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
              },
              {
                icon: 'Shield',
                title: lang === 'es' ? 'AI Developer Professional' : 'AI Developer Professional',
                issuer: 'IBM Watson',
                year: '2018',
                tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
              },
            ].map((cert, i) => (
              <div key={i} className={`p-6 rounded-lg border ${cert.tone}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] leading-tight">
                    {cert.issuer} ({cert.year})
                  </span>
                </div>
                <span className="block text-xs font-semibold text-white leading-snug">
                  {cert.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Info */}
        <section className="mb-16" data-reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#00e9fa] font-mono text-sm">02</span>
            {lang === 'es' ? 'Información Legal' : 'Legal Information'}
          </h2>
          <div className="bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-6 md:p-8 backdrop-blur-sm">
            <dl className="space-y-4 text-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-white/[0.05]">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'Ubicación' : 'Location'}
                </dt>
                <dd className="text-white font-mono">Bogotá / Nocaima, Cundinamarca, Colombia</dd>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-white/[0.05]">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'CIIU Sugerido' : 'Suggested CIIU'}
                </dt>
                <dd className="text-white font-mono">6201, 7410, 7110</dd>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-white/[0.05]">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'Tipo de Emprendimiento' : 'Entrepreneurship Type'}
                </dt>
                <dd className="text-white font-mono">Digital / Industrial DeepTech</dd>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'NIT' : 'Tax ID'}
                </dt>
                <dd className="text-white font-mono">[En Trámite]</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Data Protection */}
        <section data-reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#00e9fa] font-mono text-sm">03</span>
            {lang === 'es' ? 'Protección de Datos' : 'Data Protection'}
          </h2>
          <div className="bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-6 md:p-8 backdrop-blur-sm">
            <p className="text-gray-400 leading-relaxed mb-4">
              {lang === 'es'
                ? 'Xlerion cumple con la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013 para el tratamiento de datos personales en Colombia. Garantizamos el ejercicio de los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) y la anonimización de registros sensibles.'
                : 'Xlerion complies with Colombian Statutory Law 1581 of 2012 and Decree 1377 of 2013 for personal data processing. We guarantee the exercise of ARCO rights (Access, Rectification, Cancellation, and Opposition) and anonymization of sensitive records.'}
            </p>
            <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.2em]">
              {t('footer_rights')}
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}