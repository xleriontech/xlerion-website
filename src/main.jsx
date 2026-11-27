import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Loader from './components/Loader.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import ToolkitHubPage from './pages/ToolkitHubPage.jsx'
import ProjectsHubPage from './pages/ProjectsHubPage.jsx'
import BiohostelsDocPage from './pages/BiohostelsDocPage.jsx'
import IdentityHubPage from './pages/IdentityHubPage.jsx'
import CorporatePage from './pages/CorporatePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import FounderPage from './pages/FounderPage.jsx'
import PanelaIAPage from './pages/PanelaIA'
import DigitalCardRedirect from './pages/DigitalCardRedirect'
import HardRedirect from './components/HardRedirect'
import ContractsPage from './pages/ContractsPage.jsx'
import LegalIndexPage from './pages/LegalIndexPage.jsx'
import FunctionsManualPage from './pages/FunctionsManualPage.jsx'

function Root() {
  // Loader de arranque del sitio (sustituye al video intro).
  const [booting, setBooting] = useState(true);

  return (
    <>
      {booting && <Loader onComplete={() => setBooting(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/legal" element={<LegalIndexPage />} />
          <Route path="/legal/privacidad" element={<PrivacyPage />} />
          <Route path="/legal/terminos" element={<TermsPage />} />
          <Route path="/toolkit" element={<ToolkitHubPage />} />
          <Route path="/proyectos" element={<ProjectsHubPage />} />
          <Route path="/proyectos/biohostels" element={<BiohostelsDocPage />} />
          <Route path="/identidad" element={<IdentityHubPage />} />
          <Route path="/corporativo" element={<CorporatePage />} />
          <Route path="/legal/contratos" element={<ContractsPage />} />
          <Route path="/legal/manual-de-funciones" element={<FunctionsManualPage />} />
          <Route path="/fundador" element={<FounderPage />} />
          <Route path="/panelaia" element={<PanelaIAPage />} />
          {/* Tarjetas digitales: el .htaccess las sirve directamente; esta ruta
              es el respaldo si el hosting aun no tiene las reglas de reescritura. */}
          <Route path="/mike" element={<DigitalCardRedirect founder="mike" />} />
          <Route path="/juliette" element={<DigitalCardRedirect founder="juliette" />} />
          {/* Tarjetas digitales: /cards/ es una pagina estatica servida por
              el servidor (public/cards/index.html), no una ruta del router.
              La redireccion es DURA: con <Navigate> el router haria una
              navegacion client-side y la SPA caeria en su ruta 404. */}
          <Route path="/cards" element={<HardRedirect to="/cards/index.html" />} />
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