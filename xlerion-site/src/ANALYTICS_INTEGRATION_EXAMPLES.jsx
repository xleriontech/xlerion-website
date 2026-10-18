/**
 * GUÍA DE INTEGRACIÓN - Analytics en Páginas
 * 
 * Ejemplo de cómo usar el sistema de analytics en cualquier página del sitio
 */

// ============================================
// EJEMPLO 1: Uso Básico en una Página
// ============================================

import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

export default function MiPagina() {
    // El hook automáticamente rastrea:
    // - Tiempo que pasan en la página
    // - IP del visitante
    // - Dispositivo (User Agent)
    // - Resolución de pantalla
    // - Idioma del navegador
    const { trackEvent } = useAnalytics('Mi Página Especial', 'page');

    return (
        <div>
            <h1>Bienvenido a Mi Página</h1>
            <p>Aquí el usuario está siendo rastreado automáticamente</p>
        </div>
    );
}

// ============================================
// EJEMPLO 2: Con Eventos Personalizados
// ============================================

export default function PortfolioPage() {
    const { trackEvent } = useAnalytics('Portfolio', 'page');

    const handleProjectDownload = (projectName) => {
        // Rastrear evento personalizado
        trackEvent('project_downloaded', {
            project_name: projectName,
            timestamp: new Date().toISOString()
        });

        // Luego descargar el archivo...
    };

    const handleExternalLink = (url, platform) => {
        trackEvent('external_link_click', {
            url: url,
            platform: platform,
            referrer_page: 'Portfolio'
        });

        window.open(url, '_blank');
    };

    return (
        <div>
            <h1>Mi Portfolio</h1>

            <button onClick={() => handleProjectDownload('XlerionToolkit')}>
                Descargar XlerionToolkit
            </button>

            <a onClick={() => handleExternalLink('https://github.com/...', 'github')}>
                Ver en GitHub
            </a>
        </div>
    );
}

// ============================================
// EJEMPLO 3: En una Página de Servicios
// ============================================

export default function ServiciosPage() {
    const { trackEvent } = useAnalytics('Servicios', 'page');

    const handleRequestQuote = (serviceName) => {
        trackEvent('quote_request', {
            service: serviceName,
            page_section: 'Servicios'
        });
        // Abrir modal de cotización...
    };

    const handleViewDetails = (serviceName) => {
        trackEvent('service_view_details', {
            service: serviceName
        });
        // Navegar a detalles...
    };

    return (
        <div>
            <h1>Nuestros Servicios</h1>

            {['Consultoría', 'Desarrollo', 'Branding'].map(service => (
                <div key={service}>
                    <h3>{service}</h3>
                    <button onClick={() => handleViewDetails(service)}>
                        Ver Detalles
                    </button>
                    <button onClick={() => handleRequestQuote(service)}>
                        Solicitar Cotización
                    </button>
                </div>
            ))}
        </div>
    );
}

// ============================================
// EJEMPLO 4: En un Formulario
// ============================================

export default function ContactForm() {
    const { trackEvent } = useAnalytics('Contacto', 'page');
    const [formData, setFormData] = React.useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        trackEvent('form_submit', {
            form_type: 'contact',
            fields_filled: Object.keys(formData).length,
            timestamp: new Date().toISOString()
        });

        // Enviar formulario...
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Rastrear cuando comienzan a escribir
        if (!formData[name]) {
            trackEvent('form_field_started', {
                field_name: name,
                form_type: 'contact'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                onChange={handleInputChange}
                placeholder="Tu email"
            />
            <textarea
                name="message"
                onChange={handleInputChange}
                placeholder="Tu mensaje"
            />
            <button type="submit">Enviar</button>
        </form>
    );
}

// ============================================
// EJEMPLO 5: En una Página con Tabs/Secciones
// ============================================

export default function DocumentacionPage() {
    const [activeTab, setActiveTab] = React.useState('intro');
    const { trackEvent } = useAnalytics('Documentación', 'page');

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);

        trackEvent('documentation_tab_change', {
            from_tab: activeTab,
            to_tab: tabName
        });
    };

    return (
        <div>
            <h1>Documentación</h1>

            <div className="tabs">
                {['intro', 'install', 'usage', 'api'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={activeTab === tab ? 'active' : ''}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Contenido del tab */}
        </div>
    );
}

// ============================================
// EJEMPLO 6: En BlogPost / Artículo
// ============================================

export default function BlogPost() {
    const { trackEvent } = useAnalytics('Blog: Mi Artículo', 'post');

    const handlePrint = () => {
        trackEvent('content_print', {
            post_title: 'Mi Artículo',
            post_type: 'blog'
        });
        window.print();
    };

    const handleShare = (platform) => {
        trackEvent('content_share', {
            platform: platform,
            post_type: 'blog'
        });
        // Abrir diálogo de compartir...
    };

    return (
        <article>
            <h1>Mi Artículo</h1>

            <div className="article-actions">
                <button onClick={handlePrint}>📄 Imprimir</button>
                <button onClick={() => handleShare('twitter')}>🐦 Twitter</button>
                <button onClick={() => handleShare('linkedin')}>💼 LinkedIn</button>
            </div>

            {/* Contenido del artículo */}
        </article>
    );
}

// ============================================
// LISTA DE PÁGINAS QUE NECESITAN INTEGRACIÓN
// ============================================

/*
Copiar y pegar en TODAS estas páginas:

import { useAnalytics } from '../hooks/useAnalytics';

Luego en el componente:
const { trackEvent } = useAnalytics('Nombre de Página', 'tipo_pagina');

PÁGINAS PRIORITARIAS:
✅ App.jsx (Landing - YA INTEGRADO)
⏳ MisionPage.jsx
⏳ VisionPage.jsx
⏳ FounderPage.jsx
⏳ PortfolioReelsPage.jsx
⏳ XlerionGreenWavePage.jsx
⏳ XlerionToolkitProjectPage.jsx
⏳ TotalDarknessProjectPage.jsx
⏳ ConsultoriaPage.jsx
⏳ CapacitacionPage.jsx
⏳ SoportePage.jsx
⏳ SolucionesMedidaPage.jsx

Y todas las demás páginas en pages/

TIPOS DE PÁGINA RECOMENDADOS:
- 'page' → Página estática
- 'post' → Artículo/Blog
- 'product' → Producto/Servicio
- 'project' → Proyecto
- 'documentation' → Documentación

EVENTOS PERSONALIZADOS A RASTREAR:
- click en CTA (botones principales)
- descarga de archivos
- formularios enviados
- enlaces externos
- cambios de sección/tab
- búsquedas realizadas
- comentarios dejados
- valoraciones dadas
*/
