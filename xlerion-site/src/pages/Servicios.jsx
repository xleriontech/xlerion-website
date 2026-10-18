import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PricingSection from '../components/PricingSection';
import { useAnalytics } from '../hooks/useAnalytics';

const services = [
    {
        slug: 'sitios-web-landing-pages',
        title: 'Sitios web y landing pages',
        problem:
            'Para negocios que necesitan presencia online profesional o páginas de conversión para campañas con resultados medibles.',
        deliverables: [
            'Diseño responsive optimizado para móvil y desktop',
            'Formulario de contacto funcional',
            'SEO básico (meta tags y estructura)',
            'Dominio + hosting primer año',
            '1 ronda de revisiones',
        ],
        stack: ['React', 'Vite', 'Tailwind CSS', 'SEO Técnico'],
    },
    {
        slug: 'aplicaciones-web-react-django',
        title: 'Aplicaciones web a medida (React + Django)',
        problem:
            'Para startups y empresas que requieren un sistema interno, plataforma o producto digital escalable y fácil de operar.',
        deliverables: [
            'Frontend en React',
            'Backend Django con API REST',
            'Base de datos relacional',
            'Panel administrativo',
            'Deploy en producción',
        ],
        stack: ['React', 'Django', 'PostgreSQL', 'REST API'],
    },
    {
        slug: 'automatizacion-integracion-ia',
        title: 'Automatización e integración IA',
        problem:
            'Para equipos que pierden tiempo en tareas repetitivas y quieren automatizar procesos con flujos inteligentes.',
        deliverables: [
            'Análisis del proceso actual',
            'Flujo automatizado (n8n/Python)',
            'Integración con APIs externas',
            'Chatbot o asistente interno',
            'Documentación de operación',
        ],
        stack: ['Python', 'n8n', 'APIs', 'IA Aplicada'],
    },
    {
        slug: 'visualizacion-3d-interactivos',
        title: 'Visualización 3D e interactivos web',
        problem:
            'Para marcas y agencias que necesitan experiencias visuales de alto impacto para presentar productos, espacios o ideas.',
        deliverables: [
            'Escena 3D embebida en web',
            'Animaciones y transiciones interactivas',
            'Render navegable en navegador',
            'Exportable como iframe o componente React',
            'Optimización de rendimiento inicial',
        ],
        stack: ['Three.js', 'WebGL', 'React', 'Blender Pipeline'],
    },
];

export default function Servicios() {
    useAnalytics('Servicios', 'service');

    return (
        <Layout>
            <div className="bg-black text-white pt-24">
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <p className="text-[#00e9fa] uppercase tracking-[0.2em] text-xs mb-3">Servicios</p>
                    <h1 className="text-4xl md:text-5xl font-semibold mb-4">Servicios pensados para vender, operar y escalar</h1>
                    <p className="text-gray-300 max-w-3xl">
                        Elegimos tecnología según tu objetivo de negocio: más leads, procesos más rápidos o productos digitales listos para crecer.
                    </p>
                </section>

                <section className="max-w-7xl mx-auto px-6 pb-12 space-y-8">
                    {services.map(service => (
                        <article key={service.slug} className="border border-white/10 rounded-2xl p-6 bg-black/50">
                            <h2 className="text-2xl font-semibold mb-3">{service.title}</h2>
                            <p className="text-gray-300 mb-4">{service.problem}</p>

                            <h3 className="text-sm uppercase tracking-[0.16em] text-[#00e9fa] mb-2">Entregables</h3>
                            <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-300 mb-5">
                                {service.deliverables.map(item => (
                                    <li key={item}>• {item}</li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2 mb-5">
                                {service.stack.map(tech => (
                                    <span
                                        key={tech}
                                        className="text-xs border border-white/20 rounded-full px-3 py-1 text-gray-200"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <Link
                                to={`/contacto?servicio=${service.slug}`}
                                className="inline-flex rounded-lg border border-[#00e9fa] px-4 py-2 text-[#00e9fa] hover:bg-[#00e9fa] hover:text-black transition-colors"
                            >
                                Cotizar este servicio →
                            </Link>
                        </article>
                    ))}
                </section>

                <PricingSection />
            </div>
        </Layout>
    );
}
