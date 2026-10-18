import React, { useState, useCallback } from 'react';

import Footer from './components/Footer';
import SiteNav from './components/SiteNav';
import ParticlesBackground from './components/ParticlesBackground';
import ArchitectureModal from './components/ArchitectureModal';
import CaseStudyModal from './components/CaseStudyModal';
import PrivacyModal from './components/PrivacyModal';
import ExecutiveBriefModal from './components/ExecutiveBriefModal';
import { useAnalytics } from './hooks/useAnalytics';
import useScrollAnimation from './hooks/useScrollAnimation';
import useSectionTransition from './hooks/useSectionTransition';

import HeroSection from './sections/HeroSection';
import MetricsSection from './sections/MetricsSection';
import SolutionsSection from './sections/SolutionsSection';
import CaseStudiesDeepSection from './sections/CaseStudiesDeepSection';
import TechStackSecuritySection from './sections/TechStackSecuritySection';
import FounderLeadershipSection from './sections/FounderLeadershipSection';
import ContactPoCSection from './sections/ContactPoCSection';

/**
 * XLERION CORPORATE WEB V6.0 — HOME UNIFICADO
 *
 * Fusión de los dos mockups de UX (gemelos digitales industriales, plataformas
 * RAG e ingesta de telemetría IoT) dentro del lenguaje visual existente del
 * sitio (Inter/Roboto Mono, acento #00e9fa, utilidades .xl-btn-* y data-reveal).
 *
 * Orden del Home:
 *   hero -> metricas (métricas + ROI) -> soluciones -> casos ->
 *   arquitectura (stack + seguridad) -> liderazgo -> contacto (PoC)
 */

/**
 * Desplaza suavemente hasta una sección respetando el bloqueo de scroll
 * global que usan otras páginas del sitio.
 */
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const native = window.__XLERION_ORIG_SCROLL_TO || window.scrollTo;
  const safeScroll = (top, attempt = 0) => {
    if (window.__XLERION_BLOCK_SCROLL && attempt < 8) {
      setTimeout(() => safeScroll(top, attempt + 1), 300);
      return;
    }
    try {
      native({ top, behavior: 'smooth' });
    } catch {
      try {
        native(0, top);
      } catch {
        /* fallback silencioso */
      }
    }
  };

  safeScroll(el.offsetTop - 80);
};

export default function App() {
  const [navToFn, setNavToFn] = useState(() => scrollToSection);

  // Modales del Home
  const [activeSolution, setActiveSolution] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  // Parámetros calculados en el ROI que precargan el formulario de PoC.
  // `roiNonce` fuerza el remontaje de la sección para que el formulario se
  // reinicialice con los nuevos valores (evita sincronizar props con efectos).
  const [roiPrefill, setRoiPrefill] = useState(null);
  const [roiNonce, setRoiNonce] = useState(0);

  // Analytics: rastrear la vista del Home
  useAnalytics('Home', 'page');

  // Animaciones de aparición y transiciones entre secciones
  useScrollAnimation({ enabled: true, selector: 'section' });
  useSectionTransition({ enabled: true, selector: 'section', transitionDuration: 800, staggerDelay: 100 });

  // Mantiene estable la identidad del callback expuesto al navbar
  const handleNavReady = useCallback((fn) => {
    setNavToFn(() => fn);
  }, []);

  const goToContact = useCallback(() => scrollToSection('contacto'), []);

  const handleApplyRoi = useCallback((params) => {
    // El ROI describe una operación genérica ("Operación industrial crítica"),
    // que no corresponde a ninguno de los sectores del formulario: se omite
    // para conservar el sector por defecto y solo se precarga el desafío.
    setRoiPrefill({
      challenge: params?.challenge,
      solutionType: 'Gemelos Digitales & 3D',
    });
    setRoiNonce((n) => n + 1);
    setTimeout(() => scrollToSection('contacto'), 60);
  }, []);

  return (
    <div className="relative bg-black text-white selection:bg-primary selection:text-black min-h-screen overflow-x-hidden font-sans">
      <ParticlesBackground />

      <div className="relative z-10">
        <SiteNav onNavReady={handleNavReady} />

        <main>
          <HeroSection onOpenPoC={goToContact} />
          <MetricsSection onApplyRoi={handleApplyRoi} onOpenPoC={goToContact} />
          <SolutionsSection onOpenSolution={setActiveSolution} />
          <CaseStudiesDeepSection onOpenCase={setActiveCase} />
          <TechStackSecuritySection onOpenPoC={goToContact} />
          <FounderLeadershipSection onOpenPoC={goToContact} />
          <ContactPoCSection
            key={`poc-${roiNonce}`}
            prefill={roiPrefill}
            onOpenPrivacy={() => setPrivacyOpen(true)}
            onOpenExecutiveBrief={() => setBriefOpen(true)}
          />
        </main>

        <Footer navTo={navToFn} />
      </div>

      <ArchitectureModal solution={activeSolution} onClose={() => setActiveSolution(null)} />
      <CaseStudyModal caseStudy={activeCase} onClose={() => setActiveCase(null)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <ExecutiveBriefModal
        isOpen={briefOpen}
        onClose={() => setBriefOpen(false)}
        onOpenPoC={goToContact}
      />
    </div>
  );
}
