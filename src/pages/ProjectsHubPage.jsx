import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAnalytics } from '../hooks/useAnalytics';
import useScrollAnimation from '../hooks/useScrollAnimation';
import usePageSEO from '../hooks/usePageSEO';
import { CaseStudiesDeepSection } from '../sections';
import BiohostelsSection from '../sections/BiohostelsSection';
import BiohostelsBusinessModelSection from '../sections/BiohostelsBusinessModelSection';
import ProjectDetailsSection from '../sections/ProjectDetailsSection';

/**
 * Hub /proyectos — muestra los proyectos destacados como subpágina propia.
 */
export default function ProjectsHubPage() {
  useAnalytics('Proyectos', 'hub');
  usePageSEO({
    title: 'Proyectos Destacados',
    description: 'Casos y proyectos DeepTech de Xlerion: gemelos digitales, IoT, visualización 3D, Biohostels y plataformas operativas en producción.',
    path: '/proyectos',
  });

  // Activa el reveal por scroll en los <section> de la página.
  useScrollAnimation({ enabled: true, selector: 'section' });

  return (
    <Layout>
      {/* Encabezado de página */}
      <header className="pt-32 pb-14 px-6 md:px-8 max-w-7xl mx-auto w-full border-b border-white/[0.08]">
        <Breadcrumbs items={[{ label: 'Proyectos' }]} />
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">
          // portfolio_operativo
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Proyectos Destacados
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Arquitecturas y productos digitales con enfoque operativo, visualización de datos y resultados medibles. Incluye Biohostels y casos DeepTech industriales.
        </p>
        <Link to="/" className="xl-btn-secondary mt-8">
          ← Volver al inicio
        </Link>
      </header>

      <BiohostelsSection />
      <BiohostelsBusinessModelSection />
      <CaseStudiesDeepSection />
      <ProjectDetailsSection />
    </Layout>
  );
}