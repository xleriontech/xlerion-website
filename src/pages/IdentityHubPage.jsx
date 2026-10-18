import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAnalytics } from '../hooks/useAnalytics';
import useScrollAnimation from '../hooks/useScrollAnimation';
import {
  AboutSection,
  TeamSection,
  CertificationsSection,
  TeamingSection,
} from '../sections';

/**
 * Hub /identidad — conserva el contenido de las antiguas secciones del Home
 * (about, team, certifications y teaming) como subpágina propia.
 */
export default function IdentityHubPage() {
  useAnalytics('Identidad', 'hub');

  // Activa el reveal por scroll en los <section> de la página.
  useScrollAnimation({ enabled: true, selector: 'section' });

  return (
    <Layout>
      {/* Encabezado de página */}
      <header className="pt-32 pb-14 px-6 md:px-8 max-w-7xl mx-auto w-full border-b border-white/[0.08]">
        <Breadcrumbs items={[{ label: 'Identidad' }]} />
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">
          // identidad_empresarial
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Identidad Empresarial
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Quiénes somos: misión y visión, equipo, certificaciones, vehículos de
          contratación y el programa de socios de Xlerion.
        </p>
        <Link to="/" className="xl-btn-secondary mt-8">
          ← Volver al inicio
        </Link>
      </header>

      <AboutSection />
      <TeamSection />
      <CertificationsSection />
      <TeamingSection />
    </Layout>
  );
}
