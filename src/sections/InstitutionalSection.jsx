import React from 'react';
import { ExternalLink, FileCheck2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

// Documento oficial publicado por el MinTIC el 19 de agosto de 2025.
const DOC_URL = 'https://www.mintic.gov.co/portal/715/articles-403137_recurso_3.pdf';

const COPY = {
  es: {
    subtitle: 'Banco de Postulación de Empresas de la Industria Digital · MinTIC 2025',
    title: 'Compromiso con la Industria Digital Colombiana',
    heading:
      'Xlerion hace parte del Banco de Postulación de Empresas de la Industria Digital del MinTIC (2025)',
    body:
      'El 19 de agosto de 2025, el Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC) publicó el listado oficial de 476 empresas inscritas en el Banco de Postulación del Programa de Emprendimiento Digital. Xlerion (NIT 817.201.64, Cundinamarca) figura en ese listado. De este banco podrán seleccionarse 125 empresas para el componente de Fortalecimiento Empresas Digitales.',
    note:
      'La inclusión en el Banco de Postulación no otorga derecho a evaluación, selección, vinculación ni beneficio alguno.',
    badge: 'Documento público GDO-TIC-FM-025 V 9 · 19/08/2025',
    cta: 'Ver documento oficial',
  },
  en: {
    subtitle: 'Digital Industry Companies Application Bank · MinTIC 2025',
    title: 'Committed to the Colombian Digital Industry',
    heading:
      'Xlerion is part of the MinTIC Digital Industry Companies Application Bank (2025)',
    body:
      'On August 19, 2025, the Ministry of Information and Communications Technologies (MinTIC) published the official list of 476 companies registered in the Digital Entrepreneurship Program Application Bank. Xlerion (NIT 817.201.64, Cundinamarca) is included in that list. From this bank, 125 companies may be selected for the Digital Business Strengthening component.',
    note:
      'Inclusion in the Application Bank does not grant any right to evaluation, selection, engagement or benefit.',
    badge: 'Public document GDO-TIC-FM-025 V 9 · 08/19/2025',
    cta: 'View official document',
  },
};

export default function InstitutionalSection() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  return (
    <section
      id="validacion-institucional"
      className="relative py-24 md:py-32 lg:py-36 px-6 md:px-10 lg:px-14 max-w-[90rem] mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={c.title} subtitle={c.subtitle} />
      </div>

      <div
        data-reveal
        className="stagger-1 bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-10"
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 font-mono text-[10px] uppercase tracking-[0.15em] text-[#00e9fa]">
              <FileCheck2 size={13} aria-hidden="true" />
              <span>{c.badge}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-white leading-snug">
              {c.heading}
            </h3>

            <p className="text-sm text-gray-400 leading-relaxed">{c.body}</p>

            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-gray-500 border-l-2 border-[#00e9fa]/40 pl-3 leading-relaxed">
              {c.note}
            </p>
          </div>

          <div className="shrink-0 lg:pt-2">
            <a
              href={DOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="xl-btn-secondary"
            >
              {c.cta}
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
