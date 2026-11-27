import React, { useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import Footer from './components/Footer';
import SiteNav from './components/SiteNav';
import ParticlesBackground from './components/ParticlesBackground';
import PrivacyModal from './components/PrivacyModal';
import ExecutiveBriefModal from './components/ExecutiveBriefModal';
import TechCursor from './components/TechCursor';
import { useAnalytics } from './hooks/useAnalytics';
import useScrollAnimation from './hooks/useScrollAnimation';
import useSectionTransition from './hooks/useSectionTransition';
import { initLenis, scrollToTarget } from './lib/scroll';

import HeroWithDemos from './sections/HeroWithDemos';
import Marquee from './components/Marquee';
import SolucionesSection from './sections/SolucionesSection';
import InstitutionalSection from './sections/InstitutionalSection';
import CasosExitoSection from './sections/CasosExitoSection';
import ImpactRoiSection from './sections/ImpactRoiSection';
import TechStackSecuritySection from './sections/TechStackSecuritySection';
import FounderLeadershipSection from './sections/FounderLeadershipSection';
import ContactPoCSection from './sections/ContactPoCSection';

/**
 * XLERION CORPORATE WEB V7.0 — HOME UNIFICADO
 *
 * Orden del Home según especificaciones:
 *   hero -> soluciones -> validacion institucional -> casos -> impacto (ROI) ->
 *   tecnologia y seguridad -> fundador -> contacto (PoC)
 */

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToTarget(el, { offset: -80 });
};

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return <motion.div className="fixed inset-x-0 top-0 z-[85] h-[2px] origin-left bg-[#00e9fa]" style={{ scaleX }} />;
}

export default function App() {
  const [navToFn, setNavToFn] = useState(() => scrollToSection);

  // Modales del Home
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  // Analytics: rastrear la vista del Home
  useAnalytics('Home', 'page');

  // Animaciones de aparición y transiciones entre secciones
  useScrollAnimation({ enabled: true, selector: 'section' });
  useSectionTransition({ enabled: true, selector: 'section', transitionDuration: 800, staggerDelay: 100 });

  useEffect(() => {
    const lenis = initLenis();
    return () => lenis.destroy();
  }, []);

  // Mantiene estable la identidad del callback expuesto al navbar
  const handleNavReady = useCallback((fn) => {
    setNavToFn(() => fn);
  }, []);

  const goToContact = useCallback(() => scrollToSection('contacto'), []);

  return (
    <div className="relative bg-black text-white selection:bg-[#00e9fa] selection:text-black min-h-screen overflow-x-hidden font-sans">
      <TechCursor />
      <ParticlesBackground />
      <ScrollProgress />
      <div className="grain-overlay" aria-hidden="true" />

      <div className="relative z-10">
        <SiteNav onNavReady={handleNavReady} />

        <main>
          <HeroWithDemos onOpenPoC={goToContact} />
          <Marquee />
          <SolucionesSection />
          <InstitutionalSection />
          <CasosExitoSection />
          <ImpactRoiSection />
          <TechStackSecuritySection onOpenPoC={goToContact} />
          <FounderLeadershipSection onOpenPoC={goToContact} />
          <ContactPoCSection />
        </main>

        <Footer navTo={navToFn} />
      </div>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <ExecutiveBriefModal
        isOpen={briefOpen}
        onClose={() => setBriefOpen(false)}
        onOpenPoC={goToContact}
      />
    </div>
  );
}