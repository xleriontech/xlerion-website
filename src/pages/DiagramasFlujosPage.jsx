import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TrendingUp, Workflow, GitBranch } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function DiagramasFlujosPage() {
    const { t } = useLanguage();
    useAnalytics('Diagramas de Flujos', 'documentation');
    const [diagramas, setDiagramas] = useState([]);
    const location = useLocation();
    useEffect(() => {
        fetch('/api/diagramas-flujo.php')
            .then(res => res.json())
            .then(setDiagramas)
            .catch(() => setDiagramas([]));
    }, []);

    // Robust scroll: prefer a scroll target passed in location.state (set by
    // the caller). This avoids the browser's automatic anchor jump which can
    // mis-position the viewport when layout shifts occur. We still accept
    // location.hash as a fallback.
    useEffect(() => {
        const stateHash = location && location.state && location.state.scrollTo;
        const fallbackHash = (location && location.hash) ? location.hash.replace('#', '') : null;
        const hash = stateHash || fallbackHash;
        if (!hash) return;

        let attempts = 0;
        const maxAttempts = 6;
        const delays = [120, 260, 500, 900, 1500, 3000];

        const tryScroll = () => {
            attempts += 1;
            const el = document.getElementById(hash);
            console.log('[Diagramas] tryScroll attempt', attempts, 'hash=', hash, 'el=', !!el);
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                // Use the original native scrollTo if the instrumentation is active
                // to avoid the debug wrapper blocking our controlled scroll.
                const nativeScrollTo = (window.__XLERION_ORIG_SCROLL_TO) ? window.__XLERION_ORIG_SCROLL_TO : window.scrollTo;
                try {
                    nativeScrollTo({ top, behavior: 'smooth' });
                } catch (e) {
                    // some environments expect numeric args
                    try { nativeScrollTo(0, top); } catch (e2) { /* ignore */ }
                }
                const rect = el.getBoundingClientRect();
                console.log('[Diagramas] element rect.top', rect.top, 'window.innerHeight', window.innerHeight);
                if (rect.top >= -80 && rect.top <= window.innerHeight / 2) {
                    return true;
                }
            }
            return false;
        };

        // Prevent browser auto-jump while we attempt controlled scrolls
        const prevOverflow = document.body.style.overflow;
        // Block external callers from changing scroll while we control it
        try { window.__XLERION_BLOCK_SCROLL = true; } catch (e) { }
        const prevScrollRestoration = (history && history.scrollRestoration) ? history.scrollRestoration : null;
        try { document.body.style.overflow = 'hidden'; } catch (e) { }
        try { if (history && history.scrollRestoration) history.scrollRestoration = 'manual'; } catch (e) { }

        const timers = [];
        for (let i = 0; i < maxAttempts; i++) {
            const id = setTimeout(() => {
                tryScroll();
            }, delays[i] || 500 * (i + 1));
            timers.push(id);
        }

        // While blocked, repeatedly re-apply the controlled scroll to fight
        // against any late-arriving scrolls from other scripts or layout shifts.
        let enforceInterval = null;
        try {
            enforceInterval = setInterval(() => {
                const el = document.getElementById(hash);
                if (!el) return;
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                const nativeScrollTo = (window.__XLERION_ORIG_SCROLL_TO) ? window.__XLERION_ORIG_SCROLL_TO : window.scrollTo;
                try { nativeScrollTo({ top, behavior: 'auto' }); } catch (e) { try { nativeScrollTo(0, top); } catch (e2) { } }
            }, 120);
        } catch (e) {
            // ignore if anything fails
        }

        const onLoad = () => tryScroll();
        window.addEventListener('load', onLoad);

        // After final attempt, restore overflow, scrollRestoration and unblock scroll
        const finalTimer = setTimeout(() => {
            try { document.body.style.overflow = prevOverflow || ''; } catch (e) { }
            try { if (history && history.scrollRestoration && prevScrollRestoration) history.scrollRestoration = prevScrollRestoration; } catch (e) { }
            // NOTE: keep window.__XLERION_BLOCK_SCROLL true until unmount to
            // prevent late scripts from overriding our controlled scroll.
            try { if (enforceInterval) clearInterval(enforceInterval); } catch (e) { }
        }, delays[delays.length - 1] + 500);
        timers.push(finalTimer);

        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('load', onLoad);
            try { document.body.style.overflow = prevOverflow || ''; } catch (e) { }
            try { if (history && history.scrollRestoration && prevScrollRestoration) history.scrollRestoration = prevScrollRestoration; } catch (e) { }
            try { window.__XLERION_BLOCK_SCROLL = false; } catch (e) { }
            try { if (enforceInterval) clearInterval(enforceInterval); } catch (e) { }
        };
    }, [diagramas, location && location.hash, location && location.state]);

    // Debug UI state for visual inspection when reproducing the issue
    const [debugVisible, setDebugVisible] = useState(true);
    const [scrollY, setScrollY] = useState(typeof window !== 'undefined' ? window.scrollY : 0);
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Temporary instrumentation: wrap native scroll functions to log stack traces
    // so we can detect what triggers unexpected scrolling to the footer.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const origScrollTo = window.scrollTo;
        const origScrollIntoView = Element.prototype.scrollIntoView;
        const origFocus = Element.prototype.focus;

        // Expose the original native scrollTo so other code in this file can
        // call it directly (bypassing the debug wrapper) while we block
        // external scrolls during controlled attempts.
        try { window.__XLERION_ORIG_SCROLL_TO = origScrollTo; } catch (e) { }

        window.scrollTo = function (...args) {
            try {
                // If the page has requested to block external scrolls, don't
                // execute this call; log the stack to help find the caller.
                if (window.__XLERION_BLOCK_SCROLL) {
                    try { console.log('[DEBUG] BLOCKED window.scrollTo while __XLERION_BLOCK_SCROLL=true', args); } catch (e) { }
                    try { console.log(new Error().stack); } catch (e) { }
                    return;
                }
                console.log('[DEBUG] window.scrollTo called with', args);
                console.log(new Error().stack);
            } catch (e) { /* ignore */ }
            return origScrollTo.apply(this, args);
        };

        Element.prototype.scrollIntoView = function (...args) {
            try {
                if (window.__XLERION_BLOCK_SCROLL) {
                    try { console.log('[DEBUG] BLOCKED element.scrollIntoView while __XLERION_BLOCK_SCROLL=true', this, args); } catch (e) { }
                    try { console.log(new Error().stack); } catch (e) { }
                    return;
                }
                console.log('[DEBUG] element.scrollIntoView called on', this, 'args=', args);
                console.log(new Error().stack);
            } catch (e) { /* ignore */ }
            return origScrollIntoView.apply(this, args);
        };

        Element.prototype.focus = function (...args) {
            try {
                if (window.__XLERION_BLOCK_SCROLL) {
                    try { console.log('[DEBUG] BLOCKED element.focus while __XLERION_BLOCK_SCROLL=true', this); } catch (e) { }
                    try { console.log(new Error().stack); } catch (e) { }
                    return;
                }
                console.log('[DEBUG] element.focus called on', this);
                console.log(new Error().stack);
            } catch (e) { }
            return origFocus.apply(this, args);
        };

        return () => {
            try { window.scrollTo = origScrollTo; } catch (e) { }
            try { Element.prototype.scrollIntoView = origScrollIntoView; } catch (e) { }
            try { Element.prototype.focus = origFocus; } catch (e) { }
            try { delete window.__XLERION_ORIG_SCROLL_TO; } catch (e) { }
        };
    }, []);
    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/documentacion-recursos-parallax.jpg"
                    alt="Diagramas Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <TrendingUp className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('diagramas_page_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('diagramas_page_title')}</h1>
                    </div>
                </div>
            </div>
            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{t('diagramas_page_desc')}</p>
                </header>

                <div className="grid md:grid-cols-2 gap-10 mb-16">
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Workflow size={18} className="text-[#00e9fa]" /> {t('diagramas_types')}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            <li>{t('diagramas_types_1')}</li>
                            <li>{t('diagramas_types_2')}</li>
                            <li>{t('diagramas_types_3')}</li>
                        </ul>
                    </div>
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><GitBranch size={18} className="text-[#00e9fa]" /> {t('diagramas_maintenance')}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            <li>{t('diagramas_maintenance_1')}</li>
                            <li>{t('diagramas_maintenance_2')}</li>
                            <li>{t('diagramas_maintenance_3')}</li>
                        </ul>
                    </div>
                </div>

                <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                    <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4">{t('diagramas_purpose')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('diagramas_purpose_desc')}</p>
                </div>

                {/* Lista de diagramas dinámicos */}
                <div id="diagramas-list" className="mt-16">
                    <h2 className="text-2xl font-bold text-[#00e9fa] mb-6">{t('diagramas_listado') || 'Diagramas disponibles'}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {diagramas.length === 0 && (
                            <div className="text-gray-400 italic">{t('diagramas_no_data') || 'No hay diagramas disponibles.'}</div>
                        )}
                        {diagramas.map(d => (
                            <div key={d.id} className="block p-6 border border-white/10 bg-white/5 rounded-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Workflow className="text-[#00e9fa]" size={20} />
                                    <span className="font-mono text-white font-bold text-lg">{d.nombre}</span>
                                </div>
                                <div className="text-gray-300 text-sm mb-1">{d.descripcion}</div>
                                <div className="text-xs text-gray-400 mb-2">{t('diagramas_actualizado') || 'Actualizado'}: {d.fecha_actualizacion}</div>
                                <img src={d.imagen} alt={d.nombre} className="w-full max-h-64 object-contain rounded mt-2 bg-black/30" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
