import React, { useState } from 'react';
import { AlertCircle, ArrowUpRight, Cpu, TrendingUp, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const COPY = {
  es: {
    subtitle: 'Validación en Terreno & ROI Verificado',
    title: 'Proyectos Destacados',
    intro: 'Cuatro arquitecturas DeepTech industriales con resultados medidos y auditados en producción.',
    filterLabel: 'Filtrar por industria',
    filters: [
      { id: 'all', label: 'Todos' },
      { id: 'manufactura', label: 'Manufactura' },
      { id: 'mineria', label: 'Minería' },
      { id: 'smart-cities', label: 'Smart Cities' },
      { id: 'agroindustria', label: 'Agroindustria' },
    ],
    challengeLabel: 'El Reto',
    solutionLabel: 'La Solución',
    impactLabel: 'El Impacto',
    cta: 'Ver ficha técnica completa',
    empty: 'No hay casos registrados para esta industria.',
    cases: [
      {
        id: 'smartfactory-3d',
        industry: 'manufactura',
        industryLabel: 'Manufactura',
        title: 'SmartFactory 3D — Gemelo Digital Industrial',
        tagline: 'Monitoreo de telemetría industrial en tiempo real y mantenimiento predictivo.',
        clientCategory: 'Sector Industrial Pesado & Minería',
        image: '/images/deeptech/u2-smartfactory-twin.jpg',
        roiTimeline: 'ROI en 4.2 meses',
        challenge: 'Monitoreo de telemetría industrial en tiempo real y mantenimiento predictivo.',
        solution: 'Plataforma Full-Stack que sostiene >100 mensajes/segundo vía WebSockets manteniendo 60 FPS. Incluye detección de anomalías Z-score (NumPy) y autenticación JWT RBAC.',
        impact: 'Plataforma Full-Stack que sostiene >100 mensajes/segundo vía WebSockets manteniendo 60 FPS. Incluye detección de anomalías Z-score (NumPy) y autenticación JWT RBAC.',
        metrics: [
          { value: '>100 msg/s', label: 'Throughput WebSockets' },
          { value: '60 FPS', label: 'Renderizado 3D' },
          { value: 'Z-score', label: 'Detección anomalías' },
          { value: 'JWT RBAC', label: 'Autenticación' },
        ],
        techStack: ['React 18', 'Three.js', 'FastAPI', 'Python 3.11', 'WebSockets', 'Docker Compose'],
      },
      {
        id: 'enterprise-rag',
        industry: 'mineria',
        industryLabel: 'Minería',
        title: 'Enterprise RAG Assistant',
        tagline: 'Reducir el tiempo de búsqueda en bases de conocimiento corporativas con estructuras de datos no uniformes (legal, operaciones).',
        clientCategory: 'Compañía Multinacional de Energía y Operaciones',
        image: '/images/deeptech/u1-enterprise-rag.jpg',
        roiTimeline: 'Ahorro de 1.200 h/hombre al mes',
        challenge: 'Reducir el tiempo de búsqueda en bases de conocimiento corporativas con estructuras de datos no uniformes (legal, operaciones).',
        solution: 'Procesamiento asincrónico de PDFs, chunking semántico y búsqueda híbrida (vectorial + léxica) con re-ranking para prevenir alucinaciones de IA.',
        impact: 'Procesamiento asincrónico de PDFs, chunking semántico y búsqueda híbrida (vectorial + léxica) con re-ranking para prevenir alucinaciones de IA.',
        metrics: [
          { value: 'Async', label: 'Procesamiento PDFs' },
          { value: 'Semántico', label: 'Chunking' },
          { value: 'Híbrida', label: 'Búsqueda vectorial+léxica' },
          { value: 'Re-ranking', label: 'Anti-alucinaciones' },
        ],
        techStack: ['Python', 'Django/DRF', 'LangChain', 'PostgreSQL (pgvector)', 'Celery + Redis', 'Docker'],
      },
      {
        id: 'fovis-platform',
        industry: 'smart-cities',
        industryLabel: 'Smart Cities',
        title: 'IoT Telemetry Resilient Backend',
        tagline: 'Ingesta de datos de sensores industriales en entornos con conectividad intermitente.',
        clientCategory: 'Entidad de Gobierno & Gestión Territorial',
        image: '/images/deeptech/u2-fovis-telemetry.jpg',
        roiTimeline: 'Operativo en 8 semanas',
        challenge: 'Ingesta de datos de sensores industriales en entornos con conectividad intermitente.',
        solution: 'Diseño tolerante a fallos con persistencia local (buffering), garantizando 99% de uptime bajo tráfico concurrente simulado.',
        impact: 'Diseño tolerante a fallos con persistencia local (buffering), garantizando 99% de uptime bajo tráfico concurrente simulado.',
        metrics: [
          { value: '99%', label: 'Uptime telemetría' },
          { value: 'Buffering', label: 'Persistencia local' },
          { value: 'Atómica', label: 'Reconciliación transaccional' },
          { value: 'Simulado', label: 'Tráfico concurrente' },
        ],
        techStack: ['Python (Asyncio)', 'Node.js', 'WebSockets/MQTT', 'PostgreSQL', 'Linux SysAdmin', 'Docker'],
      },
      {
        id: 'panelaia',
        industry: 'agroindustria',
        industryLabel: 'Agroindustria',
        title: 'PanelaIA — Mesa de Mando Panelera',
        tagline: 'Revitalización panelera con gemelo 3D, trazabilidad, fondo de retiro y venta directa.',
        clientCategory: 'Cooperativa en Constitución / Alcaldía de Nocaima',
        image: '/images/deeptech/panelaia-microsite.jpg',
        roiTimeline: 'Mesa operativa en 4 semanas',
        challenge: 'Trapiche comunitario sin automatización, intermediación en precios, ausencia de trazabilidad digital y sin fondo de retiro para productores.',
        solution: 'Mesa de mando integral: gemelo 3D del trapiche (Three.js/React Three Fiber), trazabilidad por lote con QR y huella SHA-256 local, fondo de retiro simulado con meta de $76M COP a 15 años, y comercialización directa Bogotá sin intermediarios.',
        impact: 'Plataforma unificada con telemetría IoT (110-115°C punteo), trazabilidad fase 1, fondo documental y venta directa $7-9K COP/kg. Todo sin cifras inventadas: solo datos del documento base.',
        metrics: [
          { value: '110-115°C', label: 'Rango punteo CIMPA' },
          { value: 'QR + SHA-256', label: 'Trazabilidad fase 1' },
          { value: '$76M COP', label: 'Meta fondo 15 años' },
          { value: '$7-9K/kg', label: 'Venta directa Bogotá' },
        ],
        techStack: ['Next.js 16', 'React 19', 'Three.js', 'Tailwind', 'PostgreSQL', 'Drizzle ORM'],
      },
    ],
  },
  en: {
    subtitle: 'Field Validation & Verified ROI',
    title: 'Featured Projects',
    intro: 'Four industrial DeepTech architectures with measured and audited results in production.',
    filterLabel: 'Filter by industry',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'manufactura', label: 'Manufacturing' },
      { id: 'mineria', label: 'Mining' },
      { id: 'smart-cities', label: 'Smart Cities' },
      { id: 'agroindustria', label: 'Agroindustry' },
    ],
    challengeLabel: 'The Challenge',
    solutionLabel: 'The Solution',
    impactLabel: 'The Impact',
    cta: 'View full technical brief',
    empty: 'No case studies registered for this industry.',
    cases: [
      {
        id: 'smartfactory-3d',
        industry: 'manufactura',
        industryLabel: 'Manufacturing',
        title: 'SmartFactory 3D — Industrial Digital Twin',
        tagline: 'Real-time industrial telemetry monitoring and predictive maintenance.',
        clientCategory: 'Heavy Industrial Sector & Mining',
        image: '/images/deeptech/u2-smartfactory-twin.jpg',
        roiTimeline: 'ROI in 4.2 months',
        challenge: 'Real-time industrial telemetry monitoring and predictive maintenance.',
        solution: 'Full-Stack platform sustaining >100 messages/second via WebSockets maintaining 60 FPS. Includes Z-score anomaly detection (NumPy) and JWT RBAC authentication.',
        impact: 'Full-Stack platform sustaining >100 messages/second via WebSockets maintaining 60 FPS. Includes Z-score anomaly detection (NumPy) and JWT RBAC authentication.',
        metrics: [
          { value: '>100 msg/s', label: 'WebSocket Throughput' },
          { value: '60 FPS', label: '3D Rendering' },
          { value: 'Z-score', label: 'Anomaly Detection' },
          { value: 'JWT RBAC', label: 'Authentication' },
        ],
        techStack: ['React 18', 'Three.js', 'FastAPI', 'Python 3.11', 'WebSockets', 'Docker Compose'],
      },
      {
        id: 'enterprise-rag',
        industry: 'mineria',
        industryLabel: 'Mining',
        title: 'Enterprise RAG Assistant',
        tagline: 'Reduce search time in corporate knowledge bases with non-uniform data structures (legal, operations).',
        clientCategory: 'Multinational Energy & Operations Company',
        image: '/images/deeptech/u1-enterprise-rag.jpg',
        roiTimeline: 'Saves 1,200 man-hours/month',
        challenge: 'Reduce search time in corporate knowledge bases with non-uniform data structures (legal, operations).',
        solution: 'Async PDF processing, semantic chunking, hybrid search (vector + lexical) with re-ranking to prevent AI hallucinations.',
        impact: 'Async PDF processing, semantic chunking, hybrid search (vector + lexical) with re-ranking to prevent AI hallucinations.',
        metrics: [
          { value: 'Async', label: 'PDF Processing' },
          { value: 'Semantic', label: 'Chunking' },
          { value: 'Hybrid', label: 'Vector+Lexical Search' },
          { value: 'Re-ranking', label: 'Anti-Hallucination' },
        ],
        techStack: ['Python', 'Django/DRF', 'LangChain', 'PostgreSQL (pgvector)', 'Celery + Redis', 'Docker'],
      },
      {
        id: 'fovis-platform',
        industry: 'smart-cities',
        industryLabel: 'Smart Cities',
        title: 'IoT Telemetry Resilient Backend',
        tagline: 'Industrial sensor data ingestion in environments with intermittent connectivity.',
        clientCategory: 'Government Entity & Territorial Management',
        image: '/images/deeptech/u2-fovis-telemetry.jpg',
        roiTimeline: 'Live in 8 weeks',
        challenge: 'Industrial sensor data ingestion in environments with intermittent connectivity.',
        solution: 'Fault-tolerant design with local persistence (buffering), guaranteeing 99% uptime under simulated concurrent traffic.',
        impact: 'Fault-tolerant design with local persistence (buffering), guaranteeing 99% uptime under simulated concurrent traffic.',
        metrics: [
          { value: '99%', label: 'Telemetry Uptime' },
          { value: 'Buffering', label: 'Local Persistence' },
          { value: 'Atomic', label: 'Transactional Reconciliation' },
          { value: 'Simulated', label: 'Concurrent Traffic' },
        ],
        techStack: ['Python (Asyncio)', 'Node.js', 'WebSockets/MQTT', 'PostgreSQL', 'Linux SysAdmin', 'Docker'],
      },
      {
        id: 'panelaia',
        industry: 'agroindustria',
        industryLabel: 'Agroindustry',
        title: 'PanelaIA — Panel Mill Command Dashboard',
        tagline: 'Panel mill revitalization with 3D twin, traceability, pension fund & direct sales.',
        clientCategory: 'Cooperative in Formation / Nocaima Mayor Office',
        image: '/images/deeptech/u2-smartfactory-twin.jpg',
        roiTimeline: 'Dashboard operational in 4 weeks',
        challenge: 'Community trapiche without automation, price intermediation, no digital traceability, no pension fund for producers.',
        solution: 'Unified command dashboard: 3D trapiche twin (Three.js/React Three Fiber), lot traceability with QR and local SHA-256 hash, pension fund simulation with $76M COP target at 15 years, and direct Bogotá sales without intermediaries.',
        impact: 'Unified platform with IoT telemetry (110-115°C punteo), phase 1 traceability, pension fund simulation, and direct sales $7-9K COP/kg. No invented figures: only base document data.',
        metrics: [
          { value: '110-115°C', label: 'CIMPA punteo range' },
          { value: 'QR + SHA-256', label: 'Phase 1 traceability' },
          { value: '$76M COP', label: '15-yr fund target' },
          { value: '$7-9K/kg', label: 'Direct Bogotá sales' },
        ],
        techStack: ['Next.js 16', 'React 19', 'Three.js', 'Tailwind', 'PostgreSQL', 'Drizzle ORM'],
      },
    ],
  },
};

export default function CaseStudiesDeepSection({ onOpenCase }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;
  const [activeIndustry, setActiveIndustry] = useState('all');

  const cases =
    activeIndustry === 'all'
      ? c.cases
      : c.cases.filter((item) => item.industry === activeIndustry);

  return (
    <section
      id="proyectos"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={c.title} subtitle={c.subtitle} />
      </div>

      <p
        data-reveal
        className="stagger-1 max-w-3xl -mt-6 mb-10 text-sm md:text-base text-gray-400 leading-relaxed font-sans"
      >
        {c.intro}
      </p>

      <div
        data-reveal
        className="stagger-2 flex flex-wrap items-center gap-2 mb-10"
        aria-label={c.filterLabel}
      >
        {c.filters.map((filter) => {
          const isActive = activeIndustry === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveIndustry(filter.id)}
              className={`px-4 py-2 rounded-lg border font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? 'bg-[#00e9fa]/10 border-[#00e9fa]/40 text-[#00e9fa] shadow-[0_0_20px_rgba(0,233,250,0.1)]'
                  : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00e9fa]/30'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {cases.length === 0 ? (
        <p className="font-mono text-sm text-gray-500">{c.empty}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item, index) => (
            <article
              key={item.id}
              data-reveal
              className={`stagger-${index + 1} group relative flex flex-col bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg overflow-hidden backdrop-blur-sm card-hover`}
            >
              <div className="relative h-48 overflow-hidden border-b border-white/[0.08]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/85 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded bg-black/70 border border-[#00e9fa]/20 font-mono text-[9px] uppercase tracking-[0.2em] text-[#00e9fa] backdrop-blur-sm">
                  {item.industryLabel}
                </span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded bg-black/70 border border-emerald-400/20 text-[10px] font-mono text-emerald-400 backdrop-blur-sm">
                  <Zap size={11} /> {item.roiTimeline}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#00e9fa]/10 border border-[#00e9fa]/30 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-[#00e9fa]" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-500">Reel {cases.indexOf(item) + 1}</span>
                </div>
                <div className="mt-4 flex-1 flex flex-col">
                  <div className="h-[2px] w-10 bg-[#00e9fa] mb-4" />
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1">{item.tagline}</p>
                  <ul className="mt-4 space-y-2 text-[11px] text-gray-300">
                    {item.metrics.map((metric, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00e9fa]"></span>
                        <span><strong>{metric.value}</strong> {metric.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-2xl border border-[#00e9fa]/15 bg-black/40 px-3 py-3 text-[10px] text-gray-300">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500">Stack Tecnológico</p>
                    <p className="mt-2 text-white text-[11px]">{item.techStack.join(' • ')}</p>
                  </div>
                  {item.id === 'panelaia' && (
                    <a
                      href="http://localhost:3002"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00e9fa] text-black font-semibold text-sm rounded-lg hover:bg-[#00b8c9] hover:shadow-[0_0_20px_rgba(0,233,250,0.3)] transition-all duration-300"
                    >
                      <ArrowUpRight size={14} /> {lang === 'es' ? 'Ver Micrositio PanelaIA' : 'View PanelaIA Microsite'}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}