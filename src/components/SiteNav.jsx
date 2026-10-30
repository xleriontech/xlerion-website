import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SectionLoader from './SectionLoader';

const NAV_ITEMS = [
  { id: 'home', key: 'nav_home', scrollTo: 'home' },
  { id: 'soluciones', key: 'nav_soluciones', scrollTo: 'soluciones' },
  { id: 'tecnologia', key: 'nav_tecnologia', scrollTo: 'arquitectura' },
  { id: 'impacto', key: 'nav_impacto', scrollTo: 'impacto' },
  { id: 'fundador', key: 'nav_fundador', scrollTo: 'liderazgo' },
  { id: 'contacto', key: 'nav_contacto', scrollTo: 'contacto' },
];

export default function SiteNav({ onNavReady, variant = 'full', onLogoClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navTo = (id) => {
    setMobileMenuOpen(false);
    setShowLoader(true);

    const safeScrollTo = (top, attempt = 0) => {
      const native = window.__XLERION_ORIG_SCROLL_TO || window.scrollTo;
      if (window.__XLERION_BLOCK_SCROLL && attempt < 8) {
        setTimeout(() => safeScrollTo(top, attempt + 1), 300);
        return;
      }
      try { native({ top, behavior: 'smooth' }); } catch { try { native(0, top); } catch { /* fallback */ } }
    };

    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) safeScrollTo(el.offsetTop - 80);
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) safeScrollTo(el.offsetTop - 80);
    }
  };

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  useEffect(() => {
    if (typeof onNavReady === 'function') onNavReady(navTo);
  }, [onNavReady]);

  const navBg = scrolled
    ? 'bg-black/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-white/[0.05]'
    : 'bg-black/60 backdrop-blur-md border-b border-transparent';

  return (
    <>
      {showLoader && <SectionLoader onComplete={handleLoaderComplete} />}
      
      <nav className={`fixed top-0 w-full z-50 h-16 transition-all duration-500 ${navBg}`}>
        <div className="w-full h-16 px-4 md:px-8 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer relative z-50 group"
            onClick={(e) => {
              if (variant === 'logo-only') {
                e.preventDefault();
                if (typeof onLogoClick === 'function') onLogoClick();
              }
            }}
          >
            <img
              src="/LogoX.png"
              alt="XLERION"
              className="h-9 md:h-10 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#00e9fa] hidden sm:block">
              XLERION
            </span>
          </Link>

          {/* Desktop Navigation */}
          {variant === 'full' && (
            <div className="hidden lg:flex items-center gap-0.5 text-[11px] font-work uppercase tracking-[0.15em] font-medium">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  data-transition="nav"
                  onClick={() => navTo(item.scrollTo)}
                  className="inline-flex items-center h-10 px-3 whitespace-nowrap leading-none text-gray-300 hover:text-[#00e9fa] transition-colors duration-200 rounded-lg hover:bg-[#00e9fa]/5"
                >
                  {t(item.key)}
                </button>
              ))}

              {/* Language Toggle */}
              <div className="flex items-center gap-0.5 border-l border-white/10 pl-3 ml-2">
                <button
                  onClick={() => setLang('es')}
                  className={`text-[10px] tracking-[0.2em] px-2 py-1 rounded-md transition-all duration-200 ${
                    lang === 'es' ? 'text-[#00e9fa] bg-[#00e9fa]/10' : 'text-gray-500 hover:text-[#00e9fa] hover:bg-[#00e9fa]/5'
                  }`}
                >
                  ES
                </button>
                <span className="text-gray-700 text-[10px]">/</span>
                <button
                  onClick={() => setLang('en')}
                  className={`text-[10px] tracking-[0.2em] px-2 py-1 rounded-md transition-all duration-200 ${
                    lang === 'en' ? 'text-[#00e9fa] bg-[#00e9fa]/10' : 'text-gray-500 hover:text-[#00e9fa] hover:bg-[#00e9fa]/5'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* CTA Button - Solicitar PoC */}
              <button
                onClick={() => navTo('contacto')}
                className="inline-flex items-center h-9 px-5 whitespace-nowrap leading-none bg-[#00e9fa] text-black font-semibold rounded-lg transition-all duration-300 hover:bg-[#00b8c9] hover:shadow-[0_0_20px_rgba(0,233,250,0.3)] hover:-translate-y-0.5 ml-3"
              >
                {t('nav_poc')}
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {variant === 'full' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 ${mobileMenuOpen ? 'hamburger-open' : ''}`}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line w-5 h-0.5 bg-[#00e9fa]" />
              <span className="hamburger-line w-5 h-0.5 bg-[#00e9fa]" />
              <span className="hamburger-line w-5 h-0.5 bg-[#00e9fa]" />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {variant === 'full' && (
        <div
          className={`mobile-menu fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl lg:hidden ${
            mobileMenuOpen ? 'open' : ''
          }`}
          style={{ pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}
        >
          <div className="h-full flex flex-col items-center justify-center px-8 pt-20 pb-8 overflow-y-auto">
            <div className="flex flex-col gap-6 text-center w-full max-w-sm">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  data-transition="nav"
                  onClick={() => navTo(item.scrollTo)}
                  className="mobile-menu-item text-2xl font-work uppercase tracking-[0.2em] font-light text-gray-300 hover:text-[#00e9fa] transition-colors duration-300"
                >
                  {t(item.key)}
                </button>
              ))}

              <div className="mobile-menu-item border-t border-white/[0.08] pt-6 mt-2">
                <button
                  data-transition="nav"
                  onClick={() => navTo('contacto')}
                  className="inline-flex items-center justify-center h-12 px-8 bg-[#00e9fa] text-black font-semibold rounded-lg text-lg uppercase tracking-wider transition-all duration-300 hover:bg-[#00b8c9]"
                >
                  {t('nav_poc')}
                </button>
              </div>

              {/* Language Toggle */}
              <div className="mobile-menu-item flex items-center justify-center gap-4 text-lg font-mono uppercase tracking-[0.2em] pt-4">
                <button
                  onClick={() => { setLang('es'); setMobileMenuOpen(false); }}
                  className={`transition-colors duration-200 px-3 py-1 rounded-lg ${lang === 'es' ? 'text-[#00e9fa] bg-[#00e9fa]/10' : 'text-gray-500 hover:text-[#00e9fa]'}`}
                >
                  ES
                </button>
                <span className="text-gray-700">/</span>
                <button
                  onClick={() => { setLang('en'); setMobileMenuOpen(false); }}
                  className={`transition-colors duration-200 px-3 py-1 rounded-lg ${lang === 'en' ? 'text-[#00e9fa] bg-[#00e9fa]/10' : 'text-gray-500 hover:text-[#00e9fa]'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}