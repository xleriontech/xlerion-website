import React, { useState } from 'react';
import { Box, CheckCircle2, Cpu, Layers, ShieldCheck, Terminal, Wifi } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const ICONS = {
  'digital-twins': Box,
  'rag-platforms': Cpu,
  'resilient-iot': Wifi,
};

const COPY = {
  es: {
    subtitle: 'Capacidades de ingeniería B2B',
    title: 'Soluciones deeptech para la operación crítica',
    intro: 'Combinamos renderizado gráfico de alto rendimiento, modelos de lenguaje con verificación estricta y arquitectura de borde resiliente para eliminar cuellos de botella industriales.',
    ficha: 'Ver ficha de arquitectura',
    selected: 'Solución seleccionada',
    inspect: 'Ver ficha de arquitectura',
    blueprint: 'Especificación técnica // Blueprint',
    specProtocol: 'Protocolo',
    specThroughput: 'Throughput',
    specLatency: 'Latencia',
    specDeployment: 'Despliegue',
    capabilitiesTitle: 'Capacidades de implementación',
    deliverablesTitle: 'Entregables de la solución',
    stackTitle: 'Stack tecnológico',
    note: 'Código 100% entregado • Sin vendor lock-in',
    solutions: [
      {
        id: 'digital-twins',
        badge: 'Three.js / WebGL 2.0',
        title: 'Gemelos Digitales & Visualización 3D',
        subtitle: 'Simulación industrial, mantenimiento predictivo y dashboards 3D en el navegador',
        description: 'Transformamos modelos CAD/BIM y telemetría SCADA en réplicas tridimensionales de alto rendimiento sobre WebGL. Los equipos de ingeniería inspeccionan maquinaria pesada, evalúan flujos térmicos y detectan anomalías en tiempo real sin instalar software pesado.',
        technologies: ['Three.js', 'WebGL 2.0', 'Draco glTF', 'WebSockets', 'React'],
        deliverables: [
          'Modelo 3D optimizado para web (<15 MB)',
          'Dashboard de telemetría reactiva en tiempo real',
          'Módulo de alertas predictivas de mantenimiento',
          'API de integración con SCADA / OPC-UA',
        ],
        capabilities: [
          'Mapeo espacial de líneas de producción con mallas optimizadas y LOD dinámico a 60 FPS.',
          'Mapas de calor térmicos y cinemáticos superpuestos sobre el activo físico.',
          'Sincronización bidireccional con SCADA, PLCs y protocolos industriales (OPC-UA, Modbus).',
        ],
        architectureHighlight: 'Pipeline: sensores → MQTT → Edge → WebGL 60 FPS',
        architectureSnippet: {
          protocol: 'WebSockets binario / WSS',
          throughput: '60 FPS continuos',
          latency: '< 25 ms de renderizado',
          deployment: 'Web SPA / PWA industrial',
        },
      },
      {
        id: 'rag-platforms',
        badge: 'Enterprise RAG / GenAI',
        title: 'Plataformas de Inteligencia de Datos (RAG)',
        subtitle: 'Asistentes corporativos con IA para bases de conocimiento no estructuradas',
        description: 'Convertimos manuales operativos, planos P&ID, bitácoras de turno y normativas en un motor de consulta semántica de alta precisión. Los guardrails determinísticos garantizan cero alucinaciones mediante citación exacta y control de acceso basado en roles (RBAC).',
        technologies: ['FastAPI', 'Python', 'pgvector', 'LangChain', 'LLM on-premise'],
        deliverables: [
          'Pipeline automatizado de ingesta documental',
          'Motor de búsqueda semántica con trazabilidad',
          'Interfaz corporativa con control RBAC',
          'Contenedores Docker listos para on-premise',
        ],
        capabilities: [
          'Ingesta y parseo inteligente de documentos no estructurados (PDFs, planos, normativas).',
          'Búsqueda híbrida: vectorial densa combinada con indexación léxica de palabras clave (BM25).',
          'Despliegues en VPC privada u on-premise con aislamiento total de datos confidenciales.',
        ],
        architectureHighlight: 'Pipeline: documentos → chunking → embeddings → pgvector → LLM on-premise',
        architectureSnippet: {
          protocol: 'REST / gRPC / JSON-RPC',
          throughput: '100+ consultas simultáneas',
          latency: '< 1.4 s tiempo total RAG',
          deployment: 'On-premise / VPC aislada',
        },
      },
      {
        id: 'resilient-iot',
        badge: 'Edge Computing / MQTT',
        title: 'Telemetría IoT Resiliente',
        subtitle: 'Ingesta de sensores con persistencia local para conectividad intermitente',
        description: 'Arquitectura diseñada para minería subterránea, faenas remotas y plantas con conectividad inestable. Los gateways en el borde retienen lecturas en búferes circulares de alta velocidad y reconcilian transaccionalmente los datos al restablecerse el enlace.',
        technologies: ['MQTT', 'Edge Computing', 'TimescaleDB', 'Docker', 'Arm64'],
        deliverables: [
          'Software para gateway Edge (Linux / Arm64)',
          'Pipeline de reconciliación transaccional',
          'Broker MQTT con soporte QoS 1/2',
          'Dashboard de monitoreo de latencia y pérdida',
        ],
        capabilities: [
          'Búfer circular en borde con SQLite/DuckDB empotrado: cero pérdida de lecturas.',
          'Sincronización atómica con compresión delta al restablecer enlace satelital o celular.',
          'Alertas tempranas de umbrales operacionales ejecutadas en el propio gateway de borde.',
        ],
        architectureHighlight: 'Pipeline: sensores → MQTT QoS 1 → Edge (SQLite) → TimescaleDB → dashboard',
        architectureSnippet: {
          protocol: 'MQTT v5 / WebSockets / gRPC',
          throughput: 'Hasta 50,000 msg/s',
          latency: '< 15 ms en red local',
          deployment: 'Edge gateway + Cloud time-series',
        },
      },
    ],
  },
  en: {
    subtitle: 'B2B engineering capabilities',
    title: 'DeepTech solutions for critical operations',
    intro: 'We combine high-performance graphics rendering, strictly verified language models and resilient edge architecture to remove industrial bottlenecks.',
    ficha: 'View architecture sheet',
    selected: 'Selected solution',
    inspect: 'View architecture sheet',
    blueprint: 'Technical specification // Blueprint',
    specProtocol: 'Protocol',
    specThroughput: 'Throughput',
    specLatency: 'Latency',
    specDeployment: 'Deployment',
    capabilitiesTitle: 'Implementation capabilities',
    deliverablesTitle: 'Solution deliverables',
    stackTitle: 'Technology stack',
    note: '100% delivered source code • No vendor lock-in',
    solutions: [
      {
        id: 'digital-twins',
        badge: 'Three.js / WebGL 2.0',
        title: 'Digital Twins & 3D Visualization',
        subtitle: 'Industrial simulation, predictive maintenance and in-browser 3D dashboards',
        description: 'We turn CAD/BIM models and SCADA telemetry into high-performance three-dimensional replicas on WebGL. Engineering teams inspect heavy machinery, evaluate thermal flows and detect anomalies in real time without installing heavy software.',
        technologies: ['Three.js', 'WebGL 2.0', 'Draco glTF', 'WebSockets', 'React'],
        deliverables: [
          'Web-optimized 3D model (<15 MB)',
          'Real-time reactive telemetry dashboard',
          'Predictive maintenance alert module',
          'Integration API with SCADA / OPC-UA',
        ],
        capabilities: [
          'Spatial mapping of production lines with optimized meshes and dynamic LOD at 60 FPS.',
          'Thermal and kinematic heat maps overlaid on the physical asset.',
          'Bidirectional synchronization with SCADA, PLCs and industrial protocols (OPC-UA, Modbus).',
        ],
        architectureHighlight: 'Pipeline: sensors → MQTT → Edge → WebGL 60 FPS',
        architectureSnippet: {
          protocol: 'Binary WebSockets / WSS',
          throughput: '60 continuous FPS',
          latency: '< 25 ms render time',
          deployment: 'Web SPA / industrial PWA',
        },
      },
      {
        id: 'rag-platforms',
        badge: 'Enterprise RAG / GenAI',
        title: 'Data Intelligence Platforms (RAG)',
        subtitle: 'Corporate AI assistants for unstructured knowledge bases',
        description: 'We turn operational manuals, P&ID diagrams, shift logs and regulations into a high-precision semantic query engine. Deterministic guardrails guarantee zero hallucinations through exact citation and role-based access control (RBAC).',
        technologies: ['FastAPI', 'Python', 'pgvector', 'LangChain', 'On-premise LLM'],
        deliverables: [
          'Automated document ingestion pipeline',
          'Semantic search engine with traceability',
          'Corporate interface with RBAC control',
          'Docker containers ready for on-premise',
        ],
        capabilities: [
          'Intelligent ingestion and parsing of unstructured documents (PDFs, drawings, regulations).',
          'Hybrid search: dense vector combined with lexical keyword indexing (BM25).',
          'Deployments in private VPC or on-premise with full isolation of confidential data.',
        ],
        architectureHighlight: 'Pipeline: documents → chunking → embeddings → pgvector → on-premise LLM',
        architectureSnippet: {
          protocol: 'REST / gRPC / JSON-RPC',
          throughput: '100+ concurrent queries',
          latency: '< 1.4 s total RAG time',
          deployment: 'On-premise / isolated VPC',
        },
      },
      {
        id: 'resilient-iot',
        badge: 'Edge Computing / MQTT',
        title: 'Resilient IoT Telemetry',
        subtitle: 'Sensor ingestion with local persistence for intermittent connectivity',
        description: 'Architecture designed for underground mining, remote sites and plants with unstable connectivity. Edge gateways retain readings in high-speed circular buffers and transactionally reconcile data once the link is restored.',
        technologies: ['MQTT', 'Edge Computing', 'TimescaleDB', 'Docker', 'Arm64'],
        deliverables: [
          'Edge Gateway software (Linux / Arm64)',
          'Transactional reconciliation pipeline',
          'MQTT broker with QoS 1/2 support',
          'Latency and packet-loss monitoring dashboard',
        ],
        capabilities: [
          'Edge circular buffer with embedded SQLite/DuckDB: zero reading loss.',
          'Atomic synchronization with delta compression when the satellite or cellular link returns.',
          'Early operational threshold alerts executed directly on the edge gateway.',
        ],
        architectureHighlight: 'Pipeline: sensors → MQTT QoS 1 → Edge (SQLite) → TimescaleDB → dashboard',
        architectureSnippet: {
          protocol: 'MQTT v5 / WebSockets / gRPC',
          throughput: 'Up to 50,000 msg/s',
          latency: '< 15 ms on local network',
          deployment: 'Edge gateway + Cloud time-series',
        },
      },
    ],
  },
};

export default function SolutionsSection({ onOpenSolution }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  const solutions = c.solutions.map((solution) => ({
    ...solution,
    icon: ICONS[solution.id] || Box,
  }));

  const [activeId, setActiveId] = useState(solutions[0].id);
  const current = solutions.find((solution) => solution.id === activeId) || solutions[0];

  const handleOpen = (event, solution) => {
    event.stopPropagation();
    setActiveId(solution.id);
    onOpenSolution?.(solution);
  };

  return (
    <section
      id="soluciones"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <SectionHeader title={c.title} subtitle={c.subtitle} />

      <p className="text-sm md:text-base text-gray-400 max-w-3xl -mt-6 md:-mt-10 mb-10" data-reveal>
        {c.intro}
      </p>

      {/* Solution selector cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {solutions.map((solution, index) => {
          const Icon = solution.icon;
          const isActive = solution.id === activeId;
          return (
            <div
              key={solution.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveId(solution.id)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setActiveId(solution.id);
                }
              }}
              className={`stagger-${index + 1} relative overflow-hidden flex flex-col justify-between rounded-lg p-6 md:p-7 cursor-pointer transition-all duration-300 border ${
                isActive
                  ? 'bg-[#0a0a12]/80 border-[#00e9fa]/40 shadow-[0_0_30px_rgba(0,233,250,0.12)]'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-[#00e9fa]/30'
              }`}
              data-reveal
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center border transition-colors ${
                      isActive
                        ? 'bg-[#00e9fa]/10 border-[#00e9fa]/30 text-[#00e9fa]'
                        : 'bg-white/[0.02] border-white/[0.08] text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 rounded bg-[#050508] border border-white/[0.08] text-gray-400">
                    {solution.badge}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white leading-snug">{solution.title}</h3>
                <p className="text-xs font-mono text-[#00e9fa]/80 mt-2 leading-snug">{solution.subtitle}</p>
                <p className="text-xs text-gray-400 leading-relaxed mt-4 line-clamp-4">{solution.description}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08]">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {solution.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050508] border border-white/[0.08] text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(event) => handleOpen(event, solution)}
                  className={isActive ? 'xl-btn-primary w-full !py-2.5 !px-4 !text-xs' : 'xl-btn-secondary w-full !py-2.5 !px-4 !text-xs'}
                >
                  <span>{isActive ? c.ficha : c.inspect}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blueprint panel */}
      <div className="mt-8 md:mt-10 bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00e9fa]/10 border border-[#00e9fa]/20 flex items-center justify-center text-[#00e9fa]">
              <current.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#00e9fa]/80">
                {c.blueprint}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-1">{current.title}</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <div className="bg-[#050508] px-3 py-1.5 rounded border border-white/[0.08]">
              <span className="text-gray-500">{c.specProtocol}: </span>
              <span className="text-gray-300">{current.architectureSnippet.protocol}</span>
            </div>
            <div className="bg-[#050508] px-3 py-1.5 rounded border border-white/[0.08]">
              <span className="text-gray-500">{c.specThroughput}: </span>
              <span className="text-gray-300">{current.architectureSnippet.throughput}</span>
            </div>
            <div className="bg-[#050508] px-3 py-1.5 rounded border border-white/[0.08]">
              <span className="text-gray-500">{c.specLatency}: </span>
              <span className="text-emerald-400">{current.architectureSnippet.latency}</span>
            </div>
            <div className="bg-[#050508] px-3 py-1.5 rounded border border-white/[0.08]">
              <span className="text-gray-500">{c.specDeployment}: </span>
              <span className="text-gray-300">{current.architectureSnippet.deployment}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">
          {/* Capabilities */}
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-4">
              <Cpu className="w-4 h-4 text-[#00e9fa]" />
              <span>{c.capabilitiesTitle}</span>
            </div>
            <ul className="space-y-3">
              {current.capabilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-xs md:text-sm text-gray-400 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#00e9fa] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables + stack */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-3">
                <Layers className="w-4 h-4 text-[#00e9fa]" />
                <span>{c.deliverablesTitle}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current.deliverables.map((item) => (
                  <div
                    key={item}
                    className="p-3 rounded bg-[#050508] border border-white/[0.08] text-xs text-gray-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e9fa] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-3">
                <Terminal className="w-4 h-4 text-[#00e9fa]" />
                <span>{c.stackTitle}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {current.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded bg-[#00e9fa]/[0.04] border border-[#00e9fa]/20 text-[#00e9fa]/90 font-mono text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-gray-500 border-t border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{c.note}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
