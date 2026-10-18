import { useEffect } from 'react';
import ThreeJSIntersection from '../components/ThreeJSIntersection';
import { useAnalytics } from '../hooks/useAnalytics';

export default function ThreeJSIntersectionPage() {
    useAnalytics('Three.JS Intersection Demo', 'project');
    useEffect(() => {
        // Metadatos SEO
        const pageTitle = 'GreenWave 3D - Simulador Inteligente de Tráfico | Xlerion';
        const pageDescription = 'Simulador 3D interactivo de intersecciones viales con tecnología GreenWave. Optimiza el flujo de tráfico en tiempo real usando inteligencia artificial para ciudades colombianas.';
        const pageKeywords = 'GreenWave, simulador tráfico 3D, intersecciones viales, semáforos inteligentes, optimización tráfico, Three.js, WebGL, ciudades inteligentes, movilidad urbana, Bogotá, Medellín, Cali';
        const pageUrl = 'https://xlerion.com/demo/greenwave-3d';
        const pageImage = 'https://xlerion.com/images/greenwave-3d-preview.jpg';

        // Title
        document.title = pageTitle;

        // Meta tags básicos
        const updateOrCreateMeta = (name, content, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Meta tags estándar
        updateOrCreateMeta('description', pageDescription);
        updateOrCreateMeta('keywords', pageKeywords);
        updateOrCreateMeta('author', 'Xlerion - Ingeniería Creativa');
        updateOrCreateMeta('viewport', 'width=device-width, initial-scale=1.0');
        updateOrCreateMeta('robots', 'index, follow');
        updateOrCreateMeta('language', 'es-CO');
        updateOrCreateMeta('geo.region', 'CO');
        updateOrCreateMeta('geo.placename', 'Colombia');

        // Open Graph (Facebook, LinkedIn)
        updateOrCreateMeta('og:type', 'website', true);
        updateOrCreateMeta('og:title', pageTitle, true);
        updateOrCreateMeta('og:description', pageDescription, true);
        updateOrCreateMeta('og:url', pageUrl, true);
        updateOrCreateMeta('og:image', pageImage, true);
        updateOrCreateMeta('og:image:width', '1200', true);
        updateOrCreateMeta('og:image:height', '630', true);
        updateOrCreateMeta('og:site_name', 'Xlerion', true);
        updateOrCreateMeta('og:locale', 'es_CO', true);

        // Twitter Card
        updateOrCreateMeta('twitter:card', 'summary_large_image');
        updateOrCreateMeta('twitter:title', pageTitle);
        updateOrCreateMeta('twitter:description', pageDescription);
        updateOrCreateMeta('twitter:image', pageImage);
        updateOrCreateMeta('twitter:site', '@Xlerion');
        updateOrCreateMeta('twitter:creator', '@Xlerion');

        // Schema.org para Google
        const updateOrCreateJsonLd = () => {
            let script = document.querySelector('script[type="application/ld+json"]#greenwave-schema');
            if (!script) {
                script = document.createElement('script');
                script.type = 'application/ld+json';
                script.id = 'greenwave-schema';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "GreenWave 3D - Simulador Inteligente de Tráfico",
                "description": pageDescription,
                "url": pageUrl,
                "image": pageImage,
                "applicationCategory": "Simulation",
                "operatingSystem": "Web Browser",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "COP"
                },
                "author": {
                    "@type": "Organization",
                    "name": "Xlerion",
                    "url": "https://xlerion.com",
                    "logo": "https://xlerion.com/logo.png"
                },
                "keywords": pageKeywords,
                "inLanguage": "es-CO",
                "featureList": [
                    "Simulación 3D interactiva",
                    "Algoritmo GreenWave adaptativo",
                    "Análisis de múltiples ciudades colombianas",
                    "Optimización en tiempo real",
                    "Comparación de modos clásico vs inteligente",
                    "Visualización de flujos vehiculares"
                ]
            });
        };
        updateOrCreateJsonLd();

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = pageUrl;

        // Cleanup function para restaurar metadatos si se desmonta
        return () => {
            document.title = 'Xlerion - Ingeniería Creativa';
        };
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden">
            <ThreeJSIntersection />
        </div>
    );
}
