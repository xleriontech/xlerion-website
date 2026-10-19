import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import VideoIntro from './components/VideoIntro.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import ToolkitHubPage from './pages/ToolkitHubPage.jsx'
import ProjectsHubPage from './pages/ProjectsHubPage.jsx'
import IdentityHubPage from './pages/IdentityHubPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import FounderPage from './pages/FounderPage.jsx'

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
          <Route path="/legal/privacidad" element={<PrivacyPage />} />
          <Route path="/legal/terminos" element={<TermsPage />} />
          <Route path="/toolkit" element={<ToolkitHubPage />} />
          <Route path="/proyectos" element={<ProjectsHubPage />} />
          <Route path="/identidad" element={<IdentityHubPage />} />
          <Route path="/fundador" element={<FounderPage />} />
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