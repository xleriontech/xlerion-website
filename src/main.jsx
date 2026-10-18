import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import VideoIntro from './components/VideoIntro.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import MisionPage from './pages/MisionPage.jsx'
import VisionPage from './pages/VisionPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import LicensesPage from './pages/LicensesPage.jsx'
import ValidationPage from './pages/ValidationPage.jsx'
import LoggingPage from './pages/LoggingPage.jsx'
import DiagnosticoPage from './pages/DiagnosticoPage.jsx'
import PerformancePage from './pages/PerformancePage.jsx'
import TurismoPage from './pages/TurismoPage.jsx'
import AlojamientoPage from './pages/AlojamientoPage.jsx'
import IngenieriaPage from './pages/IngenieriaPage.jsx'
import TotalDarknessProjectPage from './pages/TotalDarknessProjectPage.jsx'
import XlerionToolkitProjectPage from './pages/XlerionToolkitProjectPage.jsx'
import TransitoMovilidadPage from './pages/TransitoMovilidadPage.jsx'
import TecnologiasComunidadPage from './pages/TecnologiasComunidadPage.jsx'
import ToolkitsPage from './pages/ToolkitsPage.jsx'
import DiagLogPerfPage from './pages/DiagLogPerfPage.jsx'
import BrandingPage from './pages/BrandingPage.jsx'
import DocsStructPage from './pages/DocsStructPage.jsx'
import Integracion3DPage from './pages/Integracion3DPage.jsx'
import ConsultoriaPage from './pages/ConsultoriaPage.jsx'
import CapacitacionPage from './pages/CapacitacionPage.jsx'
import SoportePage from './pages/SoportePage.jsx'
import SolucionesMedidaPage from './pages/SolucionesMedidaPage.jsx'
import ManualesPage from './pages/ManualesPage.jsx'
import DiagramasFlujosPage from './pages/DiagramasFlujosPage.jsx'
import GuiasInstalacionPage from './pages/GuiasInstalacionPage.jsx'
import FounderPage from './pages/FounderPage.jsx'
import PortfolioReelsPage from './pages/PortfolioReelsPage.jsx'
import XlerionGreenWavePage from './pages/XlerionGreenWavePage.jsx'
import ThreeJSIntersectionPage from './pages/ThreeJSIntersectionPage.jsx'
import SmartIntegrationPage from './pages/SmartIntegrationPage.jsx'
import AIIntegrationPage from './pages/AIIntegrationPage.jsx'
import BlockchainIntegrationPage from './pages/BlockchainIntegrationPage.jsx'
import IoTIntegrationPage from './pages/IoTIntegrationPage.jsx'
import AnalyticsIntegrationPage from './pages/AnalyticsIntegrationPage.jsx'
import APIIntegrationPage from './pages/APIIntegrationPage.jsx'
import SimulationIntegrationPage from './pages/SimulationIntegrationPage.jsx'
import TaxTrackerPage from './pages/TaxTrackerPage.jsx'
import Renders3DGalleryPage from './pages/Renders3DGalleryPage.jsx'
import CotizacionServiciosPage from './pages/CotizacionServiciosPage.jsx'
import RadioNocaimaPageFixed from './pages/RadioNocaimaPageFixed.jsx'
import TestRadio from './pages/TestRadio.jsx'
import ElRoperoPage from './pages/ElRoperoPage.jsx'
import AnalyticsAdminPage from './pages/AnalyticsAdminPage.jsx'
import VideoGamesPage from './pages/VideoGamesPage.jsx'
import PublicidadPage from './pages/PublicidadPage.jsx'
import Contacto from './pages/Contacto.jsx'
import Game from './pages/Game.jsx'
import ToolkitHubPage from './pages/ToolkitHubPage.jsx'
import ProjectsHubPage from './pages/ProjectsHubPage.jsx'
import IdentityHubPage from './pages/IdentityHubPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function Root() {
  // In development (localhost) skip the intro so the nav is accessible immediately.
  const seen = sessionStorage.getItem('xlerion_intro_seen') || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'true' : null);
  const [showIntro, setShowIntro] = useState(!seen);

  const handleIntroComplete = () => {
    sessionStorage.setItem('xlerion_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <VideoIntro onComplete={handleIntroComplete} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/mision" element={<MisionPage />} />
          <Route path="/vision" element={<VisionPage />} />
          <Route path="/legal/privacidad" element={<PrivacyPage />} />
          <Route path="/legal/terminos" element={<TermsPage />} />
          <Route path="/legal/licencias" element={<LicensesPage />} />
          <Route path="/toolkit/validacion" element={<ValidationPage />} />
          <Route path="/toolkit/logging" element={<LoggingPage />} />
          <Route path="/toolkit/diagnostico" element={<DiagnosticoPage />} />
          <Route path="/toolkit/performance" element={<PerformancePage />} />
          <Route path="/servicios/turismo-incluyente" element={<TurismoPage />} />
          <Route path="/servicios/alojamiento-adaptado" element={<AlojamientoPage />} />
          <Route path="/servicios/ingenieria-creativa" element={<IngenieriaPage />} />
          <Route path="/servicios/toolkits" element={<ToolkitsPage />} />
          <Route path="/servicios/diag-log-perf" element={<DiagLogPerfPage />} />
          <Route path="/servicios/branding" element={<BrandingPage />} />
          <Route path="/servicios/documentacion" element={<DocsStructPage />} />
          <Route path="/servicios/integracion-3d" element={<Integracion3DPage />} />
          <Route path="/servicios/consultoria-modular" element={<ConsultoriaPage />} />
          <Route path="/servicios/capacitacion" element={<CapacitacionPage />} />
          <Route path="/servicios/soporte-actualizacion" element={<SoportePage />} />
          <Route path="/servicios/soluciones-medida" element={<SolucionesMedidaPage />} />
          <Route path="/documentacion" element={<DocsStructPage />} />
          <Route path="/proyectos/total-darkness" element={<TotalDarknessProjectPage />} />
          <Route path="/proyectos/toolkit" element={<XlerionToolkitProjectPage />} />
          <Route path="/proyectos/smart-integration" element={<SmartIntegrationPage />} />
          <Route path="/proyectos/smart-integration/ai" element={<AIIntegrationPage />} />
          <Route path="/proyectos/smart-integration/blockchain" element={<BlockchainIntegrationPage />} />
          <Route path="/proyectos/smart-integration/tax-tracker" element={<TaxTrackerPage />} />
          <Route path="/proyectos/smart-integration/iot" element={<IoTIntegrationPage />} />
          <Route path="/proyectos/smart-integration/analytics" element={<AnalyticsIntegrationPage />} />
          <Route path="/proyectos/smart-integration/api" element={<APIIntegrationPage />} />
          <Route path="/proyectos/smart-integration/simulation" element={<SimulationIntegrationPage />} />
          <Route path="/proyectos/transito-movilidad" element={<TransitoMovilidadPage />} />
          <Route path="/proyectos/tecnologias-comunidad" element={<TecnologiasComunidadPage />} />
          <Route path="/proyectos/videojuegos" element={<VideoGamesPage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/projects/radio-nocaima-demo" element={<RadioNocaimaPageFixed />} />
          <Route path="/documentacion/manuales" element={<ManualesPage />} />
          <Route path="/documentacion/diagramas-flujos" element={<DiagramasFlujosPage />} />
          <Route path="/documentacion/guias-instalacion" element={<GuiasInstalacionPage />} />
          <Route path="/fundador" element={<FounderPage />} />
          <Route path="/portafolio" element={<PortfolioReelsPage />} />
          <Route path="/cotizacion" element={<CotizacionServiciosPage />} />
          <Route path="/cotizacion-servicios" element={<CotizacionServiciosPage />} />
          <Route path="/portfolio/renders-3d" element={<Renders3DGalleryPage />} />
          <Route path="/demo/greenwave" element={<XlerionGreenWavePage />} />
          <Route path="/demo/greenwave-3d" element={<ThreeJSIntersectionPage />} />
          <Route path="/el-ropero/*" element={<ElRoperoPage />} />
          <Route path="/recursos/analiticas" element={<AnalyticsAdminPage />} />
          <Route path="/recursos/publicidad" element={<PublicidadPage />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/toolkit" element={<ToolkitHubPage />} />
          <Route path="/proyectos" element={<ProjectsHubPage />} />
          <Route path="/identidad" element={<IdentityHubPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export function RootComponent() {
  return (
    <StrictMode>
      <LanguageProvider>
        <Root />
      </LanguageProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<RootComponent />);
