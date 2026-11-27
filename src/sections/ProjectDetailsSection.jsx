import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PROJECTS = {
  es: [
    {
      id: 'detalle-smartfactory-3d',
      kicker: 'Manufactura · Gemelo Digital',
      title: 'SmartFactory 3D — Gemelo Digital Industrial',
      summary: 'Plataforma Full-Stack para monitoreo de telemetría industrial en tiempo real y mantenimiento predictivo, con visualización 3D y detección de anomalías.',
      problem: 'Las operaciones industriales necesitan visibilidad inmediata de variables críticas y señales tempranas de falla sin sacrificar rendimiento.',
      solution: ['Ingesta y streaming de telemetría por WebSockets con >100 msg/s.', 'Visualización 3D en React/Three.js manteniendo 60 FPS.', 'Detección de anomalías con Z-score (NumPy).', 'Autenticación y control de acceso con JWT RBAC.'],
      stack: ['React 18', 'Three.js', 'FastAPI', 'Python 3.11', 'WebSockets', 'Docker Compose'],
      image: '/images/deeptech/u2-smartfactory-twin.jpg',
    },
    {
      id: 'detalle-enterprise-rag',
      kicker: 'Minería / Enterprise · RAG',
      title: 'Enterprise RAG Assistant / Central RAG Platform',
      summary: 'Plataforma GovTech/enterprise para unificar conocimiento, ingestar fuentes web/PDF y responder con búsqueda híbrida + RAG con citas.',
      problem: 'Bases de conocimiento corporativas con documentos no uniformes (legal, operaciones) hacen lenta y riesgosa la búsqueda de información.',
      solution: ['Ingesta web/PDF visible en plataforma y creación de expedientes.', 'Chunking semántico, embeddings duales y búsqueda híbrida vectorial + léxica con re-ranking.', 'Chat RAG con citas y enlaces al expediente.', 'Reportes PDF/DOCX/CSV/GeoJSON y modo local sin DB para arranque rápido.'],
      stack: ['Next.js 14', 'TypeScript', 'Tailwind 4', 'Prisma/Postgres/pgvector', 'pdf-lib/docx', 'S3/MinIO'],
      image: '/images/deeptech/u1-enterprise-rag.jpg',
      repo: 'https://github.com/xleriontech/central_rag_platform.git',
    },
    {
      id: 'detalle-fovis-platform',
      kicker: 'Smart Cities · IoT',
      title: 'IoT Telemetry Resilient Backend',
      summary: 'Backend resiliente para ingesta de telemetría en entornos con conectividad intermitente, con buffering local y reconciliación transaccional.',
      problem: 'Los sensores en campo pierden datos cuando la conectividad es inestable, afectando la confiabilidad operativa y la trazabilidad.',
      solution: ['Persistencia local/buffering para tolerancia a fallos de red.', 'Reconciliación transaccional atómica al recuperar conectividad.', 'Diseño orientado a uptime (99% bajo tráfico concurrente simulado).', 'Arquitectura para ingesta continua y operación en campo.'],
      stack: ['Python (Asyncio)', 'Node.js', 'WebSockets/MQTT', 'PostgreSQL', 'Linux SysAdmin', 'Docker'],
      image: '/images/deeptech/u2-fovis-telemetry.jpg',
    },
    {
      id: 'detalle-panelaia',
      kicker: 'Agroindustria · GovTech',
      title: 'PanelaIA — Mesa de Mando Panelera',
      summary: 'Micrositio/mesa de mando para revitalización panelera: gemelo 3D, trazabilidad por lote, fondo de retiro y venta directa.',
      problem: 'El trapiche comunitario opera sin automatización, con intermediación, baja trazabilidad y sin mecanismo claro de fondo de retiro.',
      solution: ['Gemelo 3D del trapiche con Three.js / React Three Fiber.', 'Trazabilidad por lote con QR y huella SHA-256 local.', 'Simulación de fondo de retiro con meta de $76M COP a 15 años.', 'Comercialización directa Bogotá sin intermediarios; telemetría de punteo 110–115°C.'],
      stack: ['Next.js 16', 'React 19', 'Three.js', 'Tailwind', 'PostgreSQL', 'Drizzle ORM'],
      image: '/images/deeptech/panelaia-microsite.webp',
      demo: '/panelaia',
      repo: 'https://github.com/xleriontech/panelaia-microsite.git',
    },
  ],
  en: [
    {
      id: 'detalle-smartfactory-3d',
      kicker: 'Manufacturing · Digital Twin',
      title: 'SmartFactory 3D — Industrial Digital Twin',
      summary: 'Full-stack platform for real-time industrial telemetry monitoring and predictive maintenance with 3D visualization and anomaly detection.',
      problem: 'Industrial operations need immediate visibility into critical variables and early failure signals without sacrificing performance.',
      solution: ['Telemetry streaming over WebSockets sustaining >100 msg/s.', '3D visualization in React/Three.js maintaining 60 FPS.', 'Z-score anomaly detection (NumPy).', 'JWT RBAC authentication and access control.'],
      stack: ['React 18', 'Three.js', 'FastAPI', 'Python 3.11', 'WebSockets', 'Docker Compose'],
      image: '/images/deeptech/u2-smartfactory-twin.jpg',
    },
    {
      id: 'detalle-enterprise-rag',
      kicker: 'Mining / Enterprise · RAG',
      title: 'Enterprise RAG Assistant / Central RAG Platform',
      summary: 'GovTech/enterprise platform to unify knowledge, ingest web/PDF sources, and answer with hybrid search + RAG with citations.',
      problem: 'Corporate knowledge bases with non-uniform documents (legal, operations) make information search slow and risky.',
      solution: ['Visible web/PDF ingestion and case-file creation.', 'Semantic chunking, dual embeddings, and hybrid vector+lexical search with re-ranking.', 'RAG chat with citations and links to case files.', 'PDF/DOCX/CSV/GeoJSON reports and local no-DB quick start mode.'],
      stack: ['Next.js 14', 'TypeScript', 'Tailwind 4', 'Prisma/Postgres/pgvector', 'pdf-lib/docx', 'S3/MinIO'],
      image: '/images/deeptech/u1-enterprise-rag.jpg',
      repo: 'https://github.com/xleriontech/central_rag_platform.git',
    },
    {
      id: 'detalle-fovis-platform',
      kicker: 'Smart Cities · IoT',
      title: 'IoT Telemetry Resilient Backend',
      summary: 'Resilient backend for telemetry ingestion in intermittent-connectivity environments, with local buffering and transactional reconciliation.',
      problem: 'Field sensors lose data when connectivity is unstable, affecting operational reliability and traceability.',
      solution: ['Local persistence/buffering for network fault tolerance.', 'Atomic transactional reconciliation when connectivity returns.', 'Uptime-oriented design (99% under simulated concurrent traffic).', 'Architecture for continuous ingestion and field operation.'],
      stack: ['Python (Asyncio)', 'Node.js', 'WebSockets/MQTT', 'PostgreSQL', 'Linux SysAdmin', 'Docker'],
      image: '/images/deeptech/u2-fovis-telemetry.jpg',
    },
    {
      id: 'detalle-panelaia',
      kicker: 'Agroindustry · GovTech',
      title: 'PanelaIA — Panel Mill Command Dashboard',
      summary: 'Microsite/command dashboard for panel-mill revitalization: 3D twin, lot traceability, pension fund, and direct sales.',
      problem: 'The community trapiche operates without automation, with intermediation, low traceability, and no clear pension-fund mechanism.',
      solution: ['3D trapiche twin with Three.js / React Three Fiber.', 'Lot traceability with QR and local SHA-256 hash.', 'Pension fund simulation with $76M COP target at 15 years.', 'Direct Bogotá sales without intermediaries; punteo telemetry 110–115°C.'],
      stack: ['Next.js 16', 'React 19', 'Three.js', 'Tailwind', 'PostgreSQL', 'Drizzle ORM'],
      image: '/images/deeptech/panelaia-microsite.webp',
      demo: '/panelaia',
      repo: 'https://github.com/xleriontech/panelaia-microsite.git',
    },
  ],
};

export default function ProjectDetailsSection() {
  const { lang } = useLanguage();
  const items = PROJECTS[lang] || PROJECTS.es;
  return (
    <section id="detalle-proyectos" className="py-20 px-6 md:px-8 max-w-7xl mx-auto w-full border-t border-white/[0.06]">
      <div className="mb-10">
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">// detalle_proyectos</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{lang === 'es' ? 'Detalle de proyectos' : 'Project details'}</h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          {lang === 'es' ? 'Cada proyecto cuenta con su sección de contexto, solución, stack y enlaces de acceso.' : 'Each project has its own section with context, solution, stack, and access links.'}
        </p>
      </div>
      <div className="space-y-6">
        {items.map((p) => (
          <article key={p.id} id={p.id} className="scroll-mt-24 grid lg:grid-cols-[420px_minmax(0,1fr)] gap-0 rounded-xl border border-white/[0.08] bg-[#0a0a12]/80 overflow-hidden">
            <div className="min-h-[260px] border-b lg:border-b-0 lg:border-r border-white/[0.08]">
              <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-2">{p.kicker}</p>
              <h3 className="text-2xl font-semibold text-white mb-3">{p.title}</h3>
              <p className="text-gray-400 mb-5">{p.summary}</p>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-2">{lang === 'es' ? 'Problema' : 'Problem'}</h4>
                  <p className="text-sm text-gray-300">{p.problem}</p>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-gray-500 mt-4 mb-2">{lang === 'es' ? 'Solución' : 'Solution'}</h4>
                  <ul className="space-y-1 text-sm text-gray-300 list-none p-0 m-0">{p.solution.map((s) => <li key={s}>• {s}</li>)}</ul>
                </div>
                <div>
                  <h4 className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-2">Stack</h4>
                  <div className="flex flex-wrap gap-2 mb-5">{p.stack.map((s) => <span key={s} className="px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.02] text-xs text-gray-300">{s}</span>)}</div>
                  <div className="flex flex-wrap gap-2">
                    {p.demo && <a href={p.demo} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00e9fa] text-black text-sm font-semibold hover:bg-[#00b8c9] transition-colors"><ArrowUpRight size={14} /> {lang === 'es' ? 'Ver demo' : 'View demo'}</a>}
                    {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-gray-200 text-sm font-semibold hover:border-white/30 transition-colors"><Github size={14} /> GitHub</a>}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}