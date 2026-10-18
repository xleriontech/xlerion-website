import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAnalytics } from '../hooks/useAnalytics';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { ToolkitSection, MethodologySection, CVXGeneratorSection } from '../sections';

/**
 * Hub /toolkit — conserva el contenido de las antiguas secciones del Home
 * (toolkit, methodology y cvx-generator) como subpágina propia.
 */
export default function ToolkitHubPage() {
  useAnalytics('Toolkit', 'hub');

  // Activa el reveal por scroll en los <section> de la página.
  useScrollAnimation({ enabled: true, selector: 'section' });

  return (
    <Layout>
      {/* Encabezado de página */}
      <header className="pt-32 pb-14 px-6 md:px-8 max-w-7xl mx-auto w-full border-b border-white/[0.08]">
        <Breadcrumbs items={[{ label: 'Toolkit' }]} />
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">
          // toolkit_modular
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Toolkit
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Producto principal de Xlerion: módulos de validación, logging, diagnóstico y
          performance, junto con nuestra metodología de entrega y el generador CVX.
        </p>
        <Link to="/" className="xl-btn-secondary mt-8">
          ← Volver al inicio
        </Link>
      </header>

      <ToolkitSection />
      <MethodologySection />
      <CVXGeneratorSection />
    </Layout>
  );
}
