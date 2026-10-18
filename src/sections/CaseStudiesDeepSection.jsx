import React, { useState } from 'react';
import { AlertCircle, ArrowUpRight, Cpu, TrendingUp, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const COPY = {
  es: {
    subtitle: 'Validación en Terreno & ROI Verificado',
    title: 'Casos de Éxito de Ingeniería de Alto Impacto',
    intro:
      'Arquitecturas de Gemelos Digitales, RAG empresarial y telemetría IoT que reducen paradas no programadas y aceleran las decisiones estratégicas en industria, minería y ciudades inteligentes.',
    filterLabel: 'Filtrar por industria',
    filters: [
      { id: 'all', label: 'Todos' },
      { id: 'manufactura', label: 'Manufactura' },
      { id: 'mineria', label: 'Minería' },
      { id: 'smart-cities', label: 'Smart Cities' },
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
        tagline:
          'Supervisión termomecánica en tiempo real para planta de manufactura pesada y procesamiento minero.',
        clientCategory: 'Sector Industrial Pesado & Minería',
        image: '/images/deeptech/u2-smartfactory-twin.jpg',
        roiTimeline: 'ROI en 4.2 meses',
        challenge:
          'Una planta de manufactura con más de 450 sensores SCADA desarticulados dependía de inspecciones manuales y reportes PDF con 3.5 horas de retraso. Las microdesviaciones térmicas en rodamientos y turbinas generaban paradas no programadas con un costo superior a $45,000 USD por hora.',
        solution:
          'Xlerion desarrolló un Gemelo Digital 3D interactivo en Three.js y React conectado a un broker MQTT de baja latencia. El sistema renderiza la planta completa con modelos glTF optimizados y superpone mapas de calor dinámicos con umbrales de advertencia calculados en tiempo real.',
        impact:
          'Reducción del 55% en paradas no programadas durante los primeros 6 meses. El tiempo de diagnóstico de fallas bajó de 3.5 horas a 90 segundos y el comité operativo realiza inspecciones remotas desde cualquier navegador corporativo.',
        metrics: [
          { value: '-55%', label: 'Paradas no programadas' },
          { value: '90s', label: 'Tiempo de diagnóstico' },
          { value: '4.2 meses', label: 'Retorno de inversión' },
          { value: '60 FPS', label: 'Renderizado 3D' },
        ],
        techStack: ['Three.js', 'React', 'FastAPI', 'MQTT', 'WebSockets', 'TimescaleDB'],
      },
      {
        id: 'enterprise-rag',
        industry: 'mineria',
        industryLabel: 'Minería',
        title: 'Enterprise RAG Assistant — Inteligencia Operativa',
        tagline:
          'Asistente de ingeniería y cumplimiento sobre +85,000 páginas de manuales y normativas críticas.',
        clientCategory: 'Compañía Multinacional de Energía y Operaciones',
        image: '/images/deeptech/u1-enterprise-rag.jpg',
        roiTimeline: 'Ahorro de 1.200 h/hombre al mes',
        challenge:
          'Los equipos de mantenimiento e ingeniería de campo perdían 8 horas semanales por especialista localizando especificaciones de torque, protocolos de seguridad y normativas distribuidas en repositorios desorganizados y con versiones obsoletas.',
        solution:
          'Plataforma RAG enterprise con segmentación semántica de PDFs técnicos, embeddings vectoriales en PostgreSQL (pgvector) y re-ranking contextual. El asistente cita exactamente la sección, página y tabla del documento fuente para cumplir con auditorías de seguridad.',
        impact:
          'Disminución del 40% en el tiempo de investigación técnica para mantenimiento preventivo. Cero incidencias por aplicación de normativas obsoletas y adopción del 94% por la cuadrilla de ingenieros senior en las primeras 3 semanas.',
        metrics: [
          { value: '-40%', label: 'Tiempo de análisis' },
          { value: '99.4%', label: 'Precisión de citas' },
          { value: '<420ms', label: 'Latencia por consulta' },
          { value: '+85.000', label: 'Páginas indexadas' },
        ],
        techStack: ['Python', 'FastAPI', 'PostgreSQL (pgvector)', 'LangChain', 'Docker', 'OpenAI Enterprise'],
      },
      {
        id: 'fovis-platform',
        industry: 'smart-cities',
        industryLabel: 'Smart Cities',
        title: 'Plataforma FOVIS — Inteligencia Territorial en Tiempo Real',
        tagline:
          'Ecosistema de datos geoespaciales y decisión para infraestructura pública y ciudades inteligentes.',
        clientCategory: 'Entidad de Gobierno & Gestión Territorial',
        image: '/images/deeptech/u2-fovis-telemetry.jpg',
        roiTimeline: 'Operativo en 8 semanas',
        challenge:
          'Múltiples dependencias públicas reportaban datos de infraestructura, subsidios y obra en formatos heterogéneos y hojas de cálculo desconectadas. Los comités directivos tardaban hasta 14 días en consolidar métricas para autorizar intervenciones prioritarias.',
        solution:
          'Diseño y despliegue de la plataforma centralizada FOVIS con motor de ingesta geoespacial, visualización cartográfica vectorial en WebGL y tableros analíticos en tiempo real, con cumplimiento estricto de la Ley 1581 (Habeas Data).',
        impact:
          'Reducción del 60% en el tiempo de toma de decisiones para asignación presupuestal. Consolidación de 12 fuentes de datos heterogéneas en un único panel de control con auditoría continua y trazabilidad forense.',
        metrics: [
          { value: '-60%', label: 'Tiempo de decisión' },
          { value: '12', label: 'Sistemas integrados' },
          { value: '99.98%', label: 'Disponibilidad' },
          { value: '100%', label: 'Trazabilidad de auditoría' },
        ],
        techStack: ['React', 'FastAPI', 'PostGIS', 'PostgreSQL', 'WebSockets', 'Docker / K8s'],
      },
    ],
  },
  en: {
    subtitle: 'Field Validation & Verified ROI',
    title: 'High-Impact Engineering Success Stories',
    intro:
      'Digital Twin, enterprise RAG and IoT telemetry architectures that reduce unplanned downtime and accelerate strategic decisions across manufacturing, mining and smart cities.',
    filterLabel: 'Filter by industry',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'manufactura', label: 'Manufacturing' },
      { id: 'mineria', label: 'Mining' },
      { id: 'smart-cities', label: 'Smart Cities' },
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
        tagline:
          'Real-time thermomechanical supervision for heavy manufacturing and mineral processing plants.',
        clientCategory: 'Heavy Industrial Sector & Mining',
        image: '/images/deeptech/u2-smartfactory-twin.jpg',
        roiTimeline: 'ROI in 4.2 months',
        challenge:
          'A manufacturing plant with 450+ disconnected SCADA sensors relied on manual inspections and PDF reports delayed by 3.5 hours. Thermal micro-deviations in bearings and turbines caused unplanned stoppages costing more than $45,000 USD per hour.',
        solution:
          'Xlerion built an interactive 3D Digital Twin in Three.js and React connected to a low-latency MQTT broker. The system renders the full plant with optimized glTF models and overlays dynamic heat maps with real-time warning thresholds.',
        impact:
          '55% reduction in unplanned stoppages over the first 6 months. Failure diagnosis time dropped from 3.5 hours to 90 seconds, and the operations committee runs remote inspections from any corporate browser.',
        metrics: [
          { value: '-55%', label: 'Unplanned downtime' },
          { value: '90s', label: 'Diagnosis time' },
          { value: '4.2 months', label: 'Return on investment' },
          { value: '60 FPS', label: '3D rendering' },
        ],
        techStack: ['Three.js', 'React', 'FastAPI', 'MQTT', 'WebSockets', 'TimescaleDB'],
      },
      {
        id: 'enterprise-rag',
        industry: 'mineria',
        industryLabel: 'Mining',
        title: 'Enterprise RAG Assistant — Operational Intelligence',
        tagline:
          'Engineering and compliance assistant over 85,000+ pages of critical manuals and regulations.',
        clientCategory: 'Multinational Energy & Operations Company',
        image: '/images/deeptech/u1-enterprise-rag.jpg',
        roiTimeline: 'Saves 1,200 man-hours / month',
        challenge:
          'Field maintenance and engineering teams lost 8 hours per week per specialist locating torque specs, safety protocols and regulations scattered across disorganized repositories with outdated versions.',
        solution:
          'An enterprise RAG platform with semantic segmentation of technical PDFs, high-fidelity vector embeddings in PostgreSQL (pgvector) and contextual re-ranking. The assistant cites the exact section, page and table of the source document to satisfy safety audits.',
        impact:
          '40% reduction in technical research time for preventive maintenance. Zero incidents from applying outdated regulations and 94% adoption by the senior engineering crew within the first 3 weeks.',
        metrics: [
          { value: '-40%', label: 'Analysis time' },
          { value: '99.4%', label: 'Citation accuracy' },
          { value: '<420ms', label: 'Query latency' },
          { value: '85,000+', label: 'Indexed pages' },
        ],
        techStack: ['Python', 'FastAPI', 'PostgreSQL (pgvector)', 'LangChain', 'Docker', 'OpenAI Enterprise'],
      },
      {
        id: 'fovis-platform',
        industry: 'smart-cities',
        industryLabel: 'Smart Cities',
        title: 'FOVIS Platform — Real-Time Territorial Intelligence',
        tagline:
          'Geospatial data and decision ecosystem for public infrastructure and smart cities.',
        clientCategory: 'Government Entity & Territorial Management',
        image: '/images/deeptech/u2-fovis-telemetry.jpg',
        roiTimeline: 'Live in 8 weeks',
        challenge:
          'Multiple public agencies reported infrastructure, subsidy and public-works data in heterogeneous formats and disconnected spreadsheets. Steering committees took up to 14 days to consolidate metrics and authorize priority interventions.',
        solution:
          'Design and deployment of the centralized FOVIS platform with a high-throughput geospatial ingestion engine, vector cartographic visualization in WebGL and real-time analytical dashboards, in strict compliance with Colombian Law 1581 (Habeas Data).',
        impact:
          '60% reduction in decision-making time for budget allocation. 12 heterogeneous data sources consolidated into a single control panel with continuous auditing and forensic traceability.',
        metrics: [
          { value: '-60%', label: 'Decision time' },
          { value: '12', label: 'Integrated systems' },
          { value: '99.98%', label: 'Availability' },
          { value: '100%', label: 'Audit traceability' },
        ],
        techStack: ['React', 'FastAPI', 'PostGIS', 'PostgreSQL', 'WebSockets', 'Docker / K8s'],
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
      id="casos"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-black/20 to-transparent pointer-events-none" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded bg-black/70 border border-[#00e9fa]/20 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00e9fa] backdrop-blur-sm">
                  {item.industryLabel}
                </span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded bg-black/70 border border-emerald-400/20 text-[10px] font-mono text-emerald-400 backdrop-blur-sm">
                  <Zap size={11} /> {item.roiTimeline}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white leading-snug group-hover:text-[#00e9fa] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">{item.tagline}</p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-red-500/[0.05] border border-red-500/20">
                    <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">
                      <AlertCircle size={12} /> {c.challengeLabel}
                    </span>
                    <p className="mt-1.5 text-[11px] text-gray-400 leading-relaxed">{item.challenge}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#00e9fa]/[0.04] border border-[#00e9fa]/20">
                    <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00e9fa]">
                      <Cpu size={12} /> {c.solutionLabel}
                    </span>
                    <p className="mt-1.5 text-[11px] text-gray-400 leading-relaxed">{item.solution}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/[0.05] border border-emerald-400/20">
                    <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                      <TrendingUp size={12} /> {c.impactLabel}
                    </span>
                    <p className="mt-1.5 text-[11px] text-gray-400 leading-relaxed">{item.impact}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {item.metrics.slice(0, 2).map((metric) => (
                    <div
                      key={metric.label}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center"
                    >
                      <span className="block text-sm font-mono font-bold text-[#00e9fa]">{metric.value}</span>
                      <span className="block mt-0.5 text-[9px] font-mono uppercase tracking-widest text-gray-500">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCase(item)}
                  className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#00e9fa]/30 text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-[#00e9fa]/5 hover:border-[#00e9fa] transition-all duration-300"
                >
                  {c.cta} <ArrowUpRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
