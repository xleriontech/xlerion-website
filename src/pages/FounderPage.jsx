import React from 'react';
import { User, Linkedin, Github, Globe, Award, GraduationCap, Shield, Briefcase } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function FounderPage() {
    const { t, lang } = useLanguage();
    useAnalytics('Fundador', 'page');

    const certs = [
        {
            id: 'pmp',
            icon: Award,
            title: 'PMP® Project Management Professional',
            issuer: 'PMI',
            year: '2020',
            description: lang === 'es'
                ? 'Project Management Professional certificado por PMI.'
                : 'Project Management Professional certified by PMI.',
            tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
        },
        {
            id: 'uci',
            icon: GraduationCap,
            title: 'AI/GenAI Specialization (with Honors)',
            issuer: 'UC Irvine',
            year: '2024',
            description: lang === 'es'
                ? 'Especialización en IA/GenAI con honores por UC Irvine.'
                : 'AI/GenAI Specialization with Honors from UC Irvine.',
            tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
        },
        {
            id: 'ibm',
            icon: Shield,
            title: 'AI Developer Professional',
            issuer: 'IBM Watson',
            year: '2018',
            description: lang === 'es'
                ? 'Desarrollador Profesional de IA certificado por IBM Watson.'
                : 'AI Developer Professional certified by IBM Watson.',
            tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
        },
    ];

    const bio = lang === 'es'
        ? 'Especializado en arquitecturas web escalables, visualización 3D en el navegador e integración de IA en el mundo real. Mi trabajo se define por resultados medibles en optimización de pipelines y resiliencia de datos.'
        : 'Specialized in scalable web architectures, browser-based 3D visualization, and real-world AI integration. My work is defined by measurable results in pipeline optimization and data resilience.';

    const experience = lang === 'es'
        ? [
            'Ingeniero Senior Full-Stack con más de 10 años de experiencia construyendo arquitecturas escalables donde los datos en tiempo real cobran vida en visualización 3D interactiva (Three.js) e integración de IA (RAG/LangChain).',
            'Como líder de proyectos, ha desarrollado infraestructuras tecnológicas completas, desde sistemas de gestión documental hasta experiencias 3D interactivas. Su experiencia abarca modelado 3D, desarrollo con JavaScript/Python, y arquitectura de sistemas resilientes.',
            'Su compromiso con la documentación rigurosa y la modularidad ha establecido nuevos estándares en la industria. Cada proyecto refleja su filosofía de autosuficiencia creativa e impacto técnico sostenible.',
        ]
        : [
            'Senior Full-Stack Engineer with 10+ years of experience building scalable architectures where real-time data comes alive through interactive 3D visualization (Three.js) and AI integration (RAG/LangChain).',
            'As a project lead, he has developed complete technological infrastructures, from document management systems to interactive 3D experiences. His expertise spans 3D modeling, JavaScript/Python development, and resilient systems architecture.',
            'His commitment to rigorous documentation and modularity has established new industry standards. Every project reflects his philosophy of creative self-sufficiency and sustainable technical impact.',
        ];

    const philosophy = lang === 'es'
        ? '"La tecnología debe empoderar, no limitar. Cada línea de código, cada modelo 3D, cada documento es una oportunidad para construir autonomía y preservar conocimiento. El verdadero impacto se mide en los sistemas que transformamos y el legado que dejamos."'
        : '"Technology must empower, not limit. Every line of code, every 3D model, every document is an opportunity to build autonomy and preserve knowledge. True impact is measured in the systems we transform and the legacy we leave."';

    return (
        <Layout>
            {/* Banner con foto */}
            <div className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
                <img
                    src="/images/MikeProfile.jpg"
                    alt="Miguel E. Rodriguez Martinez"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8 max-w-4xl">
                        <User className="text-[#00e9fa] mx-auto mb-6" size={80} />
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl mb-4">
                            {lang === 'es' ? 'Miguel E. Rodriguez Martinez' : 'Miguel E. Rodriguez Martinez'}
                        </h1>
                        <p className="text-xl text-[#00e9fa] font-mono">
                            {lang === 'es' ? 'Senior Full-Stack Engineer & Fundador de Xlerion' : 'Senior Full-Stack Engineer & Founder of Xlerion'}
                        </p>
                        <p className="text-gray-400 text-sm mt-2 font-mono uppercase tracking-wider">
                            Bogotá, Colombia
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="pt-20 pb-20 px-8 max-w-6xl mx-auto">
                {/* Bio */}
                <section className="mb-16" data-reveal>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[#00e9fa] font-mono text-sm">01</span>
                        <h2 className="text-3xl font-black italic uppercase text-white">
                            {lang === 'es' ? 'Perfil Profesional' : 'Professional Profile'}
                        </h2>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                        {bio}
                    </p>
                </section>

                {/* Experiencia */}
                <section className="mb-16" data-reveal>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[#00e9fa] font-mono text-sm">02</span>
                        <h2 className="text-3xl font-black italic uppercase text-white">
                            {lang === 'es' ? 'Experiencia y Trayectoria' : 'Experience & Track Record'}
                        </h2>
                    </div>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        {experience.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </section>

                {/* Certificaciones */}
                <section className="mb-16" data-reveal>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[#00e9fa] font-mono text-sm">03</span>
                        <h2 className="text-3xl font-black italic uppercase text-white flex items-center gap-3">
                            <Award className="text-[#00e9fa]" size={32} />
                            {lang === 'es' ? 'Certificaciones' : 'Certifications'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {certs.map((cert) => {
                            const Icon = cert.icon;
                            return (
                                <div key={cert.id} className={`p-6 rounded-lg border ${cert.tone}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon size={16} className="shrink-0" />
                                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] leading-tight">
                                            {cert.issuer} ({cert.year})
                                        </span>
                                    </div>
                                    <span className="block text-xs font-semibold text-white leading-snug mb-2">
                                        {cert.title}
                                    </span>
                                    <p className="text-xs text-gray-400">{cert.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Proyectos Destacados */}
                <section className="mb-16" data-reveal>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[#00e9fa] font-mono text-sm">04</span>
                        <h2 className="text-3xl font-black italic uppercase text-white">
                            {lang === 'es' ? 'Proyectos Destacados' : 'Featured Projects'}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: lang === 'es' ? 'SmartFactory 3D — Gemelo Digital Industrial' : 'SmartFactory 3D — Industrial Digital Twin',
                                desc: lang === 'es'
                                    ? 'Plataforma Full-Stack que sostiene >100 msg/s vía WebSockets manteniendo 60 FPS. Detección de anomalías Z-score (NumPy) y autenticación JWT RBAC. Stack: React 18, Three.js, FastAPI, Python 3.11, WebSockets, Docker Compose.'
                                    : 'Full-Stack platform sustaining >100 msg/s via WebSockets at 60 FPS. Z-score anomaly detection (NumPy) and JWT RBAC authentication. Stack: React 18, Three.js, FastAPI, Python 3.11, WebSockets, Docker Compose.',
                            },
                            {
                                title: 'Enterprise RAG Assistant',
                                desc: lang === 'es'
                                    ? 'Procesamiento asincrónico de PDFs, chunking semántico y búsqueda híbrida (vectorial + léxica) con re-ranking para prevenir alucinaciones de IA. Stack: Python, Django/DRF, LangChain, PostgreSQL (pgvector), Celery + Redis, Docker.'
                                    : 'Async PDF processing, semantic chunking, hybrid search (vector + lexical) with re-ranking to prevent AI hallucinations. Stack: Python, Django/DRF, LangChain, PostgreSQL (pgvector), Celery + Redis, Docker.',
                            },
                            {
                                title: lang === 'es' ? 'IoT Telemetry Resilient Backend' : 'IoT Telemetry Resilient Backend',
                                desc: lang === 'es'
                                    ? 'Diseño tolerante a fallos con persistencia local (buffering), garantizando 99% de uptime bajo tráfico concurrente simulado. Stack: Python (Asyncio), Node.js, WebSockets/MQTT, PostgreSQL, Linux SysAdmin, Docker.'
                                    : 'Fault-tolerant design with local persistence (buffering), guaranteeing 99% uptime under simulated concurrent traffic. Stack: Python (Asyncio), Node.js, WebSockets/MQTT, PostgreSQL, Linux SysAdmin, Docker.',
                            },
                        ].map((project, i) => (
                            <div key={i} className="p-6 border border-white/10 bg-white/5 rounded-sm">
                                <h4 className="text-[#00e9fa] font-mono text-sm uppercase tracking-[0.2em] mb-3">
                                    {project.title}
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {project.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Filosofía */}
                <section className="mb-16" data-reveal>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[#00e9fa] font-mono text-sm">05</span>
                        <h2 className="text-3xl font-black italic uppercase text-white">
                            {lang === 'es' ? 'Filosofía de Trabajo' : 'Work Philosophy'}
                        </h2>
                    </div>
                    <div className="bg-gradient-to-r from-[#00e9fa]/10 to-transparent border-l-4 border-[#00e9fa] p-8">
                        <p className="text-gray-300 text-lg leading-relaxed italic">
                            {philosophy}
                        </p>
                    </div>
                </section>

                {/* Enlaces sociales */}
                <section data-reveal>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[#00e9fa] font-mono text-sm">06</span>
                        <h2 className="text-3xl font-black italic uppercase text-white">
                            {lang === 'es' ? 'Conectar' : 'Connect'}
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="https://linkedin.com/in/miguelrodriguez-dataviz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-sm hover:border-[#00e9fa] transition-colors"
                        >
                            <Linkedin className="text-[#00e9fa]" size={24} />
                            <span className="text-white font-mono text-sm">LinkedIn</span>
                        </a>
                        <a
                            href="https://github.com/miguelxlerion"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-sm hover:border-[#00e9fa] transition-colors"
                        >
                            <Github className="text-[#00e9fa]" size={24} />
                            <span className="text-white font-mono text-sm">GitHub</span>
                        </a>
                        <a
                            href="https://miguelxlerion.github.io/Mike_portfolio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-sm hover:border-[#00e9fa] transition-colors"
                        >
                            <Globe className="text-[#00e9fa]" size={24} />
                            <span className="text-white font-mono text-sm">Portfolio</span>
                        </a>
                    </div>
                </section>
            </div>
        </Layout>
    );
}