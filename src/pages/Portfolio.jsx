import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAnalytics } from '../hooks/useAnalytics';

const projects = [
    {
        title: 'Redemthor',
        type: 'Sitio web',
        problem: 'Necesitaba una presencia web clara para presentar propuesta visual y narrativa del proyecto.',
        stack: ['HTML', 'CSS', 'JavaScript', 'Vite Proxy'],
        details: [
            'Se integró como sub-app estática montada sobre el sitio principal.',
            'Se aseguró compatibilidad de rutas y carga directa en `/redemthor`.',
            'Optimización para carga inicial y navegación simple para usuarios no técnicos.',
        ],
        demo: '/redemthor',
    },
    {
        title: 'Turismo Incluyente',
        type: 'Plataforma',
        problem: 'El cliente necesitaba comunicar oferta turística accesible con foco en confianza y claridad.',
        stack: ['React', 'Tailwind CSS', 'React Router'],
        details: [
            'Se diseñó flujo de contenido orientado a servicios y decisión rápida.',
            'Se estructuró información de valor en bloques escaneables para móvil.',
            'Se dejó base para escalar con reservas, formularios y métricas de conversión.',
        ],
        demo: '/servicios/turismo-incluyente',
    },
    {
        title: 'Portafolio 3D Interactivo',
        type: 'Experiencia interactiva',
        problem: 'Se buscaba demostrar capacidades técnicas avanzadas con interacción visual en web.',
        stack: ['Three.js', 'React', 'WebGL'],
        details: [
            'Escenas 3D navegables integradas al frontend sin sacrificar identidad de marca.',
            'Uso de componentes modulares para mantener mantenibilidad del código.',
            'Preparado para demos comerciales, marketing técnico y presentaciones B2B.',
        ],
        demo: '/portfolio/renders-3d',
    },
];

export default function Portfolio() {
    useAnalytics('Portfolio Comercial', 'project');

    return (
        <Layout>
            <div className="bg-black text-white pt-24">
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <p className="text-[#00e9fa] uppercase tracking-[0.2em] text-xs mb-3">Portafolio</p>
                    <h1 className="text-4xl md:text-5xl font-semibold mb-4">Casos de estudio técnicos con foco comercial</h1>
                    <p className="text-gray-300 max-w-3xl">
                        Cada proyecto aquí muestra cómo resolvemos problemas reales con tecnología moderna y entregables listos para negocio.
                    </p>
                </section>

                <section className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6">
                    {projects.map(project => (
                        <article key={project.title} className="rounded-2xl border border-white/10 p-6 bg-black/50">
                            <h2 className="text-2xl font-semibold">{project.title}</h2>
                            <p className="text-sm text-[#00e9fa] mt-1">Tipo: {project.type}</p>
                            <p className="text-gray-300 mt-4">{project.problem}</p>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {project.stack.map(tech => (
                                    <span key={tech} className="text-xs border border-white/20 rounded-full px-3 py-1 text-gray-200">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <ul className="mt-4 text-sm text-gray-300 space-y-2">
                                {project.details.map(detail => (
                                    <li key={detail}>• {detail}</li>
                                ))}
                            </ul>

                            <Link
                                to={project.demo}
                                className="inline-flex mt-5 rounded-lg border border-[#00e9fa] px-4 py-2 text-[#00e9fa] hover:bg-[#00e9fa] hover:text-black transition-colors"
                            >
                                Ver proyecto →
                            </Link>
                        </article>
                    ))}

                    <article className="rounded-2xl border border-dashed border-[#00e9fa]/60 p-6 bg-[#00e9fa]/5 flex flex-col justify-center">
                        <h2 className="text-2xl font-semibold mb-3">Tu proyecto aquí</h2>
                        <p className="text-gray-300 mb-5">
                            ¿Buscas lanzar una web, app o solución interna? Diseñamos y desarrollamos a medida para tu etapa.
                        </p>
                        <Link
                            to="/contacto"
                            className="inline-flex rounded-lg bg-[#00e9fa] px-4 py-2 text-black font-medium hover:opacity-90 transition-opacity"
                        >
                            Tu proyecto aquí — cotiza el tuyo →
                        </Link>
                    </article>
                </section>
            </div>
        </Layout>
    );
}
