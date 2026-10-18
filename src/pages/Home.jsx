import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Rocket, Cpu, Sparkles, Globe, Bot, Cuboid, Search, Play } from 'lucide-react';
import Layout from '../components/Layout';
import { useAnalytics } from '../hooks/useAnalytics';

const whyXlerion = [
    {
        icon: Rocket,
        title: 'Entrega rápida',
        text: 'Proyectos web desde 1 semana. Sin burocracia, sin intermediarios.',
    },
    {
        icon: Cpu,
        title: 'Tecnología moderna',
        text: 'React, Django, Three.js, IA integrada. Stack de nivel enterprise.',
    },
    {
        icon: Sparkles,
        title: 'Precios reales para tu etapa',
        text: 'Sabemos lo que cuesta crecer. Por eso nuestros precios son honestos.',
    },
];

const serviceCards = [
    {
        icon: Globe,
        title: 'Sitios web y landing pages',
        description: 'Webs orientadas a confianza, posicionamiento y conversiones.',
        link: '/servicios',
    },
    {
        icon: Boxes,
        title: 'Aplicaciones web (React + Django)',
        description: 'Sistemas y plataformas a medida para operar y escalar.',
        link: '/servicios',
    },
    {
        icon: Bot,
        title: 'Automatización e integración IA',
        description: 'Menos tareas manuales, más velocidad en tu operación.',
        link: '/servicios',
    },
    {
        icon: Cuboid,
        title: 'Visualización 3D e interactividad',
        description: 'Experiencias web impactantes para diferenciar tu marca.',
        link: '/servicios',
    },
];

const projects = [
    {
        name: 'Redemthor',
        stack: 'HTML · CSS · JavaScript',
        problem: 'Presentar una propuesta visual sólida para comunicar un concepto creativo.',
        link: '/redemthor',
    },
    {
        name: 'Turismo Incluyente',
        stack: 'React · Tailwind · Router',
        problem: 'Convertir interés en solicitudes con una experiencia clara para el usuario.',
        link: '/servicios/turismo-incluyente',
    },
    {
        name: 'Portafolio 3D',
        stack: 'Three.js · WebGL · React',
        problem: 'Mostrar capacidades técnicas de alto impacto en formato web comercial.',
        link: '/portfolio/renders-3d',
    },
];

function ShowcaseSection({
    id,
    index,
    label,
    title,
    description,
    rightTitle,
    rightText,
    ctaTo,
    ctaText,
    children,
    withParallax = false,
    showTopBar = false,
}) {
    const frameClass = 'max-w-7xl mx-auto border border-[#00e9fa]/35 bg-black/40 backdrop-blur-[1px] rounded-sm overflow-hidden';
    const cardClass = 'border border-[#00e9fa]/30 bg-black/45 rounded-sm p-5 hover:border-[#00e9fa]/65 transition-colors';

    return (
        <section id={id} className="relative py-16 px-6 border-t border-[#00e9fa]/20 overflow-hidden">
            {withParallax && (
                <>
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: "url('/soluciones-parallax.jpg')",
                            backgroundAttachment: 'fixed',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            transform: 'scale(1.06)',
                        }}
                    />
                    <div className="absolute inset-0 z-[1] bg-black/40" />
                </>
            )}

            <div className={`relative z-10 ${frameClass}`}>
                <div className="grid lg:grid-cols-[1fr_280px] min-h-[62vh]">
                    <div className="p-8 md:p-10">
                        {showTopBar && (
                            <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#00e9fa]/20 pb-4">
                                <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
                                    <a href="#identidad" className="text-[#00e9fa]">Home</a>
                                    <a href="#filosofia" className="hover:text-[#00e9fa] transition-colors">About</a>
                                    <a href="#proyectos" className="hover:text-[#00e9fa] transition-colors">Gallery</a>
                                    <a href="#blog" className="hover:text-[#00e9fa] transition-colors">Blog</a>
                                    <a href="#contacto" className="hover:text-[#00e9fa] transition-colors">Contact</a>
                                </nav>
                                <div className="hidden md:flex items-center gap-2 border border-[#00e9fa]/30 px-3 py-2 min-w-52 text-sm text-white/70 rounded-sm">
                                    <Search size={14} className="text-[#00e9fa]" />
                                    <span>Buscar...</span>
                                </div>
                            </div>
                        )}

                        <p className="text-[#00e9fa] uppercase tracking-[0.24em] text-xs mb-4">// {label}</p>
                        <h2 className="text-4xl md:text-6xl font-semibold max-w-4xl leading-tight">{title}</h2>
                        <p className="text-gray-200 text-lg mt-6 max-w-3xl">{description}</p>

                        {children ? (
                            <div className="mt-8">{children}</div>
                        ) : (
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link to={ctaTo} className="rounded-lg bg-[#00e9fa] text-black font-medium px-6 py-3 hover:opacity-90 transition-opacity">
                                    {ctaText}
                                </Link>
                            </div>
                        )}

                        {id === 'identidad' && (
                            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <button className={`${cardClass} relative text-left`}>
                                    <img src="/soluciones-parallax.jpg" alt="Preview proyecto" className="h-20 w-full object-cover opacity-85" />
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="rounded-full border border-[#00e9fa] p-2 bg-black/70">
                                            <Play size={14} className="text-[#00e9fa]" />
                                        </span>
                                    </span>
                                </button>
                                <div className={cardClass}>
                                    <img src="/LogoX.png" alt="Marca Xlerion" className="h-20 w-full object-contain opacity-90" />
                                </div>
                                <div className={`${cardClass} hidden sm:block`}>
                                    <img src="/soluciones-parallax.jpg" alt="Vista previa" className="h-20 w-full object-cover opacity-75" />
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="border-l border-[#00e9fa]/20 bg-black/55 p-8 flex flex-col justify-between">
                        <div>
                            <p className="text-5xl text-[#00e9fa] font-light">{String(index).padStart(2, '0')}</p>
                            <h3 className="text-2xl font-semibold mt-6 leading-tight">{rightTitle}</h3>
                            <p className="text-white/75 mt-4 leading-relaxed">{rightText}</p>
                        </div>
                        <Link
                            to={ctaTo}
                            className="inline-flex items-center justify-center rounded-sm border border-[#00e9fa]/60 text-[#00e9fa] px-4 py-3 hover:bg-[#00e9fa] hover:text-black transition-colors"
                        >
                            {ctaText} →
                        </Link>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    useAnalytics('Home Comercial', 'page');

    const tileClass = 'border border-[#00e9fa]/30 bg-black/45 rounded-sm p-5 hover:border-[#00e9fa]/65 transition-colors';

    return (
        <Layout>
            <div className="bg-black text-white">
                <ShowcaseSection
                    id="identidad"
                    index={1}
                    label="Home"
                    title="Desarrollamos tu web, app o producto digital — moderno, rápido y a tu medida"
                    description="Somos Xlerion TechLab, un estudio tecnológico en Bogotá especializado en desarrollo web, aplicaciones React/Django, visualización 3D e integración de IA para negocios en crecimiento."
                    rightTitle="Desarrollo digital a medida"
                    rightText="Diseño, desarrollo e implementación con foco en resultados de negocio."
                    ctaTo="/contacto"
                    ctaText="Cotiza tu proyecto"
                    withParallax
                    showTopBar
                >
                    <div className="flex flex-wrap gap-4">
                        <Link to="/contacto" className="rounded-lg bg-[#00e9fa] text-black font-medium px-6 py-3 hover:opacity-90 transition-opacity">
                            Cotiza tu proyecto
                        </Link>
                        <Link to="/portfolio" className="rounded-lg border border-[#00e9fa] text-[#00e9fa] px-6 py-3 hover:bg-[#00e9fa] hover:text-black transition-colors">
                            Ver portafolio
                        </Link>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    id="filosofia"
                    index={2}
                    label="Filosofía"
                    title="Por qué Xlerion"
                    description="Un enfoque práctico para construir más rápido, con calidad técnica y visión de negocio."
                    rightTitle="Valor diferencial"
                    rightText="Velocidad, claridad y ejecución técnica para crecer sin fricción."
                    ctaTo="/servicios"
                    ctaText="Ver enfoque"
                >
                    <div className="grid md:grid-cols-3 gap-5">
                        {whyXlerion.map(item => {
                            const Icon = item.icon;
                            return (
                                <article key={item.title} className={tileClass}>
                                    <Icon className="text-[#00e9fa] mb-3" size={22} />
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-300">{item.text}</p>
                                </article>
                            );
                        })}
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    id="servicios"
                    index={3}
                    label="Servicios"
                    title="Servicios principales"
                    description="Bloques de servicio listos para combinarse según tu etapa de crecimiento."
                    rightTitle="Construcción modular"
                    rightText="Selecciona solo los bloques que necesitas hoy y escala mañana."
                    ctaTo="/servicios"
                    ctaText="Explorar"
                >
                    <div className="grid md:grid-cols-2 gap-5">
                        {serviceCards.map(item => {
                            const Icon = item.icon;
                            return (
                                <article key={item.title} className={tileClass}>
                                    <Icon className="text-[#00e9fa] mb-3" size={22} />
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-300 mb-4">{item.description}</p>
                                    <Link
                                        to={item.link}
                                        className="inline-flex items-center rounded-sm border border-[#00e9fa]/60 text-[#00e9fa] px-4 py-2 hover:bg-[#00e9fa] hover:text-black transition-colors"
                                    >
                                        Ver más →
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    id="proyectos"
                    index={4}
                    label="Proyectos"
                    title="Proyectos recientes"
                    description="Casos reales con foco en experiencia, conversión y robustez técnica."
                    rightTitle="Resultados"
                    rightText="Cada proyecto se diseña para resolver un objetivo de negocio claro."
                    ctaTo="/portfolio"
                    ctaText="Portafolio"
                >
                    <div className="grid md:grid-cols-3 gap-5">
                        {projects.map(project => (
                            <article key={project.name} className={tileClass}>
                                <h3 className="text-xl font-semibold">{project.name}</h3>
                                <p className="text-[#00e9fa] text-sm mt-2">{project.stack}</p>
                                <p className="text-gray-300 mt-3 mb-4">{project.problem}</p>
                                <Link
                                    to={project.link}
                                    className="inline-flex items-center rounded-sm border border-[#00e9fa]/60 text-[#00e9fa] px-4 py-2 hover:bg-[#00e9fa] hover:text-black transition-colors"
                                >
                                    Ver caso →
                                </Link>
                            </article>
                        ))}
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    id="toolkit"
                    index={5}
                    label="Toolkit"
                    title="Toolkit e integración técnica"
                    description="Frontend moderno, backend robusto y módulos de IA en una sola arquitectura por etapas."
                    rightTitle="Arquitectura sólida"
                    rightText="Módulos listos para integrarse con tu operación actual."
                    ctaTo="/servicios"
                    ctaText="Ver toolkit"
                />

                <ShowcaseSection
                    id="documentacion"
                    index={6}
                    label="Documentación"
                    title="Documentación y recursos"
                    description="Entregamos proyectos con guías claras para operar, escalar y mantener sin fricción."
                    rightTitle="Entrega mantenible"
                    rightText="Código entendible, guías claras y autonomía para tu equipo."
                    ctaTo="/documentacion"
                    ctaText="Ver documentación"
                />

                <ShowcaseSection
                    id="blog"
                    index={7}
                    label="Bitácora"
                    title="Bitácora técnica"
                    description="Aprendizajes, casos y decisiones técnicas para startups, PYMEs y agencias."
                    rightTitle="Aprendizaje continuo"
                    rightText="Contenido técnico útil para tomar mejores decisiones de producto."
                    ctaTo="/documentacion"
                    ctaText="Leer recursos"
                />

                <ShowcaseSection
                    id="fundador"
                    index={8}
                    label="Equipo"
                    title="Fundador"
                    description="Miguel Rodríguez Martínez lidera Xlerion con enfoque full stack y diseño interactivo."
                    rightTitle="Dirección técnica"
                    rightText="Visión de producto con ejecución práctica end-to-end."
                    ctaTo="/fundador"
                    ctaText="Ver perfil"
                />

                <ShowcaseSection
                    id="legal"
                    index={9}
                    label="Legal"
                    title="Legal y privacidad"
                    description="Políticas claras para operar con seguridad jurídica y transparencia técnica."
                    rightTitle="Confianza"
                    rightText="Compromiso con buenas prácticas de privacidad y uso de datos."
                    ctaTo="/legal/privacidad"
                    ctaText="Ver políticas"
                >
                    <div className="flex flex-wrap gap-4">
                        <Link to="/legal/privacidad" className="inline-flex items-center rounded-sm border border-[#00e9fa]/60 text-[#00e9fa] px-4 py-2 hover:bg-[#00e9fa] hover:text-black transition-colors">
                            Política de privacidad
                        </Link>
                        <Link to="/legal/terminos" className="inline-flex items-center rounded-sm border border-[#00e9fa]/60 text-[#00e9fa] px-4 py-2 hover:bg-[#00e9fa] hover:text-black transition-colors">
                            Términos de uso
                        </Link>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    id="contacto"
                    index={10}
                    label="Contacto"
                    title="¿Tienes un proyecto en mente?"
                    description="Construyamos una versión sólida, rápida y comercialmente efectiva de tu producto digital."
                    rightTitle="Siguiente paso"
                    rightText="Te respondemos con propuesta, tiempos y alcance inicial."
                    ctaTo="/contacto"
                    ctaText="Hablemos"
                />
            </div>
        </Layout>
    );
}
