import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useLanguage } from '../context/LanguageContext';
import SiteNav from './SiteNav';
// Note: randomized reveal hook is intentionally not imported here to avoid
// applying curriculum behavior site-wide. Keep the hook available for
// opt-in use in individual pages/components.

export default function Layout({
    children,
    navVariant = 'full',
    showFooter = true,
    onLogoClick
}) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [empresaOpen, setEmpresaOpen] = useState(false);
    const [recursosOpen, setRecursosOpen] = useState(false);
    const [herramientasOpen, setHerramientasOpen] = useState(false);
    const [navToFn, setNavToFn] = useState(() => (id) => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    });
    const navigate = useNavigate();
    const { lang, setLang, t } = useLanguage();

    // Scroll al inicio cuando se monta el componente (al cambiar de página)
    useEffect(() => {
        const native = (typeof window !== 'undefined' && window.__XLERION_ORIG_SCROLL_TO) ? window.__XLERION_ORIG_SCROLL_TO : (typeof window !== 'undefined' ? window.scrollTo : null);
        const doScroll = () => {
            if (!native) return;
            try { native(0, 0); } catch (e) { try { native({ top: 0 }); } catch (e2) { } }
        };
        if (typeof window !== 'undefined' && window.__XLERION_BLOCK_SCROLL) {
            // Defer initial scroll if another page is controlling it
            const t = setTimeout(() => doScroll(), 800);
            return () => clearTimeout(t);
        }
        doScroll();
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Prevenir scroll cuando el menú móvil está abierto
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    // randomized reveal intentionally not enabled here

    const navTo = (id) => {
        setMobileMenuOpen(false); // Cerrar menú móvil al navegar
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    const native = (window.__XLERION_ORIG_SCROLL_TO) ? window.__XLERION_ORIG_SCROLL_TO : window.scrollTo;
                    const safeScroll = (top, attempt = 0) => {
                        if (window.__XLERION_BLOCK_SCROLL && attempt < 8) {
                            setTimeout(() => safeScroll(top, attempt + 1), 300);
                            return;
                        }
                        try { native({ top, behavior: 'smooth' }); } catch (e) { try { native(0, top); } catch (e2) { } }
                    };
                    safeScroll(el.offsetTop - 80);
                }
            }, 100);
        } else {
            const el = document.getElementById(id);
            if (el) {
                const native = (window.__XLERION_ORIG_SCROLL_TO) ? window.__XLERION_ORIG_SCROLL_TO : window.scrollTo;
                const safeScroll = (top, attempt = 0) => {
                    if (window.__XLERION_BLOCK_SCROLL && attempt < 8) {
                        setTimeout(() => safeScroll(top, attempt + 1), 300);
                        return;
                    }
                    try { native({ top, behavior: 'smooth' }); } catch (e) { try { native(0, top); } catch (e2) { } }
                };
                safeScroll(el.offsetTop - 80);
            }
        }
    };

    // Stable handler to expose navigation function to SiteNav without
    // creating a new callback on every render (prevents render loops).
    const handleNavReady = useCallback((fn) => {
        // Store the provided nav function in state. Wrap in a function so
        // React doesn't treat it as an updater when the value is itself a function.
        setNavToFn(() => fn);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <SiteNav onNavReady={handleNavReady} variant={navVariant} onLogoClick={onLogoClick} />

            {/* Contenido */}
            <main className="flex-1">{children}</main>
            {showFooter && <Footer navTo={navToFn} />}
        </div>
    );
}
