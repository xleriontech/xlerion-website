import React, { useState, useCallback } from 'react';

import Footer from './components/Footer';
import SiteNav from './components/SiteNav';
import ParticlesBackground from './components/ParticlesBackground';
import PrivacyModal from './components/PrivacyModal';
import ExecutiveBriefModal from './components/ExecutiveBriefModal';
import { useAnalytics } from './hooks/useAnalytics';
import useScrollAnimation from './hooks/useScrollAnimation';
import useSectionTransition from './hooks/useSectionTransition';

import HeroSection from './sections/HeroSection';
import SolucionesSection from './sections/SolucionesSection';
import CasosExitoSection from './sections/CasosExitoSection';
import ImpactRoiSection from './sections/ImpactRoiSection';
import TechStackSecuritySection from './sections/TechStackSecuritySection';
import FounderLeadershipSection from './sections/FounderLeadershipSection';
import ContactPoCSection from './sections/ContactPoCSection';

/**
 * XLERION CORPORATE WEB V7.0 — HOME UNIFICADO
 *
 * Orden del Home según especificaciones:
 *   hero -> soluciones -> impacto (ROI) -> tecnologia y seguridad -> fundador -> contacto (PoC)
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
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

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

  return (
    <div className="relative bg-black text-white selection:bg-primary selection:text-black min-h-screen overflow-x-hidden font-sans">
      <ParticlesBackground />

      <div className="relative z-10">
        <SiteNav onNavReady={handleNavReady} />

        <main>
          <HeroSection onOpenPoC={goToContact} />
          <SolucionesSection />
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