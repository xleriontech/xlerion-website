import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';
import useScrollAnimation from '../hooks/useScrollAnimation';
import usePageSEO from '../hooks/usePageSEO';

/**
 * Hub /identidad — información legal y de contacto de Xlerion.
 */
export default function IdentityHubPage() {
  const { t, lang } = useLanguage();
  useAnalytics('Identidad', 'hub');
  usePageSEO({
    title: 'Identidad Empresarial',
    description: 'Misión, visión, valores, información legal y certificaciones de Xlerion S.A.S., empresa DeepTech en Colombia.',
    path: '/identidad',
  });
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
            ? 'Misión, visión, valores, información legal y certificaciones del fundador de Xlerion. El documento completo (estatutos, políticas y marco legal) está publicado en Información Corporativa.'
            : 'Mission, vision, values, legal information and founder certifications for Xlerion. The full document (bylaws, policies and legal framework) is published under Corporate Information.'}
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/" className="xl-btn-secondary">
            ← {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
          <Link to="/corporativo" className="xl-btn-secondary">
            {lang === 'es' ? 'Documento corporativo →' : 'Corporate document →'}
          </Link>
        </div>
      </header>

      <main className="px-6 md:px-8 max-w-7xl mx-auto py-16">
        {/* Mission / Vision / Values */}
        <section className="mb-16" data-reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#00e9fa] font-mono text-sm">01</span>
            {lang === 'es' ? 'Misión, Visión y Valores' : 'Mission, Vision and Values'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#0a0a12]/80 border border-white/[0.08] border-t-2 border-t-[#00e9fa] rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] mb-3">Misión</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'es'
                  ? 'Transformar datos industriales complejos en inteligencia visual 3D, plataformas de IA en tiempo real y experiencias interactivas gamificadas, proporcionando a las empresas colombianas y latinoamericanas soluciones tecnológicas de clase mundial que anticipen fallas, optimicen procesos, aceleren la toma de decisiones operativas y transformen el aprendizaje corporativo mediante simuladores y videojuegos serios, con arquitecturas robustas, seguras y alineadas con los más altos estándares internacionales de calidad y cumplimiento normativo.'
                  : 'We transform complex industrial data into 3D visual intelligence, real-time AI platforms and gamified interactive experiences, providing Colombian and Latin American companies with world-class technological solutions that anticipate failures, optimize processes, accelerate operational decision-making and transform corporate learning through simulators and serious games, with robust, secure architectures aligned with the highest international standards of quality and regulatory compliance.'}
              </p>
            </div>
            <div className="bg-[#0a0a12]/80 border border-white/[0.08] border-t-2 border-t-white/40 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-mono text-xs uppercase tracking-[0.2em] mb-3">Visión</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'es'
                  ? 'Para 2030, ser la empresa líder en Colombia y referente en Latinoamérica en el desarrollo de soluciones DeepTech industriales y videojuegos serios (Serious Games), reconocida por nuestra capacidad de implementar gemelos digitales 3D, sistemas de IA generativa controlada, redes IoT resilientes y simuladores de entrenamiento gamificados en sectores críticos como minería, manufactura, smart cities y educación corporativa, con presencia en al menos 5 países de la región y un portafolio de 50+ clientes empresariales activos.'
                  : 'By 2030, to be the leading company in Colombia and a reference in Latin America for the development of industrial DeepTech solutions and serious games, recognized for our ability to implement 3D digital twins, controlled generative AI systems, resilient IoT networks and gamified training simulators in critical sectors such as mining, manufacturing, smart cities and corporate education, with presence in at least 5 countries in the region and a portfolio of 50+ active enterprise clients.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {(lang === 'es'
              ? [
                  { t: 'Excelencia Técnica', d: 'Soluciones con los más altos estándares de ingeniería y mejores prácticas internacionales (ISO 27001, ISO 25010).' },
                  { t: 'Transparencia y Ética', d: 'Comunicaciones veraces y cumplimiento estricto de la normativa colombiana (Ley 1581 de 2012), sin publicidad engañosa.' },
                  { t: 'Innovación Responsable', d: 'Tecnología que resuelve problemas reales, con sostenibilidad e impacto social positivo.' },
                  { t: 'Orientación al Cliente', d: 'Soluciones adaptadas al ritmo de innovación de cada cliente: de 30-90 días a transformaciones de 6-18 meses.' },
                  { t: 'Seguridad y Confiabilidad', d: 'Cifrado AES-256, TLS 1.3 y despliegues on-premise o en nube privada, con estándares de seguridad bancaria.' },
                  { t: 'Colaboración y Aprendizaje', d: 'Aprendizaje continuo, equipos multidisciplinarios y alianzas con el ecosistema tecnológico colombiano e internacional.' },
                  { t: 'Creatividad Gamificada', d: 'Videojuegos serios, simuladores y gamificación que convierten procesos complejos en experiencias memorables.' },
                  { t: 'Propiedad Intelectual Protegida', d: 'Contratos claros de cesión de derechos, registro de obras ante la DNDA y respeto por la autoría original.' },
                ]
              : [
                  { t: 'Technical Excellence', d: 'Solutions built to the highest engineering standards and international best practices (ISO 27001, ISO 25010).' },
                  { t: 'Transparency & Ethics', d: 'Truthful communications and strict compliance with Colombian regulations (Law 1581 of 2012), with no misleading advertising.' },
                  { t: 'Responsible Innovation', d: 'Technology that solves real problems, with sustainability and positive social impact at its core.' },
                  { t: 'Customer Orientation', d: 'Solutions adapted to each client’s pace of innovation: from 30-90 days to 6-18 month transformations.' },
                  { t: 'Security & Reliability', d: 'AES-256 encryption, TLS 1.3 and on-premise or private-cloud deployments, meeting banking-grade security standards.' },
                  { t: 'Collaboration & Learning', d: 'Continuous learning, multidisciplinary teams and alliances with the Colombian and international tech ecosystem.' },
                  { t: 'Gamified Creativity', d: 'Serious games, simulators and gamification that turn complex processes into memorable experiences.' },
                  { t: 'Protected Intellectual Property', d: 'Clear assignment agreements, works registered with the DNDA and respect for original authorship.' },
                ]
            ).map((v) => (
              <div key={v.t} className="bg-[#0a0a12]/80 border border-white/[0.08] border-l-2 border-l-[#00e9fa] rounded-lg p-5 backdrop-blur-sm">
                <h4 className="text-white text-sm font-semibold mb-2">{v.t}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder Certifications */}
        <section className="mb-16" data-reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#00e9fa] font-mono text-sm">02</span>
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
            <span className="text-[#00e9fa] font-mono text-sm">03</span>
            {lang === 'es' ? 'Información Legal' : 'Legal Information'}
          </h2>
          <div className="bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-6 md:p-8 backdrop-blur-sm">
            <dl className="space-y-4 text-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-white/[0.05]">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'Razón Social' : 'Legal Name'}
                </dt>
                <dd className="text-white font-mono">XLERION S.A.S.</dd>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-white/[0.05]">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'NIT' : 'Tax ID'}
                </dt>
                <dd className="text-white font-mono">817.201.64</dd>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-white/[0.05]">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'Naturaleza Jurídica' : 'Legal Nature'}
                </dt>
                <dd className="text-white font-mono">
                  {lang === 'es' ? 'Sociedad por Acciones Simplificada (S.A.S.)' : 'Simplified Joint-Stock Company (S.A.S.)'}
                </dd>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 border-b border-white/[0.05]">
                <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                  {lang === 'es' ? 'Constitución' : 'Incorporated'}
                </dt>
                <dd className="text-white font-mono">2023</dd>
              </div>
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
                  {lang === 'es' ? 'División Especial' : 'Special Division'}
                </dt>
                <dd className="text-white font-mono">Xlerion Game Studio</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Data Protection */}
        <section data-reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#00e9fa] font-mono text-sm">04</span>
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