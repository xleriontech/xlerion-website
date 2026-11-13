import React from 'react';
import { Monitor, Database, ShieldCheck, Activity, Zap, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const SOLUTIONS_ES = [
  {
    id: 'smartfactory',
    number: '01',
    icon: Monitor,
    title: 'Gemelos Digitales 3D (SmartFactory)',
    desc: 'Anticipe fallas y optimice el mantenimiento de sus activos críticos. Replicamos sus operaciones físicas en un entorno 3D interactivo en el navegador, sincronizado con telemetría en tiempo real para decisiones predictivas.',
    metrics: [
      { label: 'Throughput WebSockets', value: '>100 msg/s' },
      { label: 'Renderizado 3D', value: '60 FPS' },
      { label: 'Detección anomalías', value: 'Z-score' },
    ],
    stack: 'React 18 · Three.js · FastAPI · Docker',
    // Productized option: PoC de 4 semanas para una máquina específica
    productized: 'PoC 4 semanas: monitoreo de una máquina crítica',
    productizedPrice: 'USD 3,000',
  },
  {
    id: 'enterprise-rag',
    number: '02',
    icon: Database,
    title: 'Asistentes Corporativos RAG (Enterprise AI)',
    desc: 'Centralice y haga consultable el conocimiento de su organización. Nuestros asistentes RAG permiten a sus equipos hallar respuestas precisas en segundos dentro de manuales técnicos, normativas legales y protocolos operativos, con trazabilidad y respuestas ancladas a sus fuentes.',
    metrics: [
      { label: 'Chunking semántico', value: 'Semántico' },
      { label: 'Búsqueda híbrida', value: 'Vectorial + Léxica' },
      { label: 'Re-ranking', value: 'Anti-alucinaciones' },
    ],
    stack: 'Python · LangChain · PostgreSQL (pgvector) · Celery + Redis',
    // Productized option: Audiencia específica
    productized: 'Auditoría de cumplimiento IA (Ley 1581) para firmas legales',
    productizedPrice: 'USD 5,000',
  },
  {
    id: 'iot-resilient',
    number: '03',
    icon: Activity,
    title: 'Backend de Telemetría Resiliente (IoT Industrial)',
    desc: 'Garantice la continuidad operativa en campo. Nuestro backend de telemetría asegura la ingesta, el almacenamiento local (buffering) y la reconciliación atómica de datos de sensores, incluso en zonas remotas con conectividad intermitente.',
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Persistencia local', value: 'Buffering' },
      { label: 'Reconciliación', value: 'Atómica' },
    ],
    stack: 'Python (Asyncio) · MQTT · TimescaleDB · Linux Edge (Arm64)',
    // Productized option: Configurador para palma en zonas sin cobertura
    productized: 'Configurador 3G/LoRaWAN para palma en Casanare',
    productizedPrice: 'USD 4,000',
  },
];

const SOLUTIONS_EN = [
  {
    id: 'smartfactory',
    number: '01',
    icon: Monitor,
    title: 'Digital Twins 3D (SmartFactory)',
    desc: 'Anticipate failures and optimize maintenance of your critical assets. We replicate your physical operations in an interactive 3D environment in the browser, synchronized with real-time telemetry for predictive decisions.',
    metrics: [
      { label: 'WebSocket Throughput', value: '>100 msg/s' },
      { label: '3D Rendering', value: '60 FPS' },
      { label: 'Anomaly Detection', value: 'Z-score' },
    ],
    stack: 'React 18 · Three.js · FastAPI · Docker',
    // Productized option: PoC for single machine
    productized: 'PoC 4 weeks: critical machine monitoring',
    productizedPrice: 'USD 3,000',
  },
  {
    id: 'enterprise-rag',
    number: '02',
    icon: Database,
    title: 'Enterprise RAG Assistants',
    desc: 'Centralize and make your organization\u2019s knowledge searchable. Our RAG assistants help your teams find precise answers in seconds across technical manuals, legal regulations and operating procedures, with traceability and answers anchored to your sources.',
    metrics: [
      { label: 'Semantic Chunking', value: 'Semantic' },
      { label: 'Hybrid Search', value: 'Vector + Lexical' },
      { label: 'Re-ranking', value: 'Anti-Hallucination' },
    ],
    stack: 'Python · LangChain · PostgreSQL (pgvector) · Celery + Redis',
    // Productized option: AI compliance audit (Law 1581)
    productized: 'IA compliance audit (Law 1581) for legal firms',
    productizedPrice: 'USD 5,000',
  },
  {
    id: 'iot-resilient',
    number: '03',
    icon: Activity,
    title: 'Resilient Telemetry Backend (Industrial IoT)',
    desc: 'Ensure operational continuity in the field. Our telemetry backend guarantees sensor data ingestion, local buffering and atomic reconciliation, even in remote areas with intermittent connectivity.',
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Local Persistence', value: 'Buffering' },
      { label: 'Reconciliation', value: 'Atomic' },
    ],
    stack: 'Python (Asyncio) · MQTT · TimescaleDB · Linux Edge (Arm64)',
    // Productized option: 3G/LoRaWAN configurator for palm oil in Casanare
    productized: '3G/LoRaWAN configurator for palm oil in Casanare',
    productizedPrice: 'USD 4,000',
  },
];

export default function SolucionesSection() {
  const { lang } = useLanguage();
  const solutions = lang === 'en' ? SOLUTIONS_EN : SOLUTIONS_ES;

  const titles = {
    es: {
      title: 'Soluciones DeepTech de Punta a Punta',
      subtitle: 'Gemelos digitales, asistentes RAG y telemetría IoT, disponibles a medida (ciclos de 6 a 18 meses) o empaquetados para validación rápida (30 a 90 días): PoC, configuradores 3D y auditorías de IA.',
    },
    en: {
      title: 'End-to-End DeepTech Solutions',
      subtitle: 'Digital twins, RAG assistants and IoT telemetry, available tailored (6 to 18 month cycles) or packaged for rapid validation (30 to 90 days): PoCs, 3D configurators and AI audits.',
    },
  };

  const t = titles[lang] || titles.es;

  return (
    <section
      id="soluciones"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={t.title} subtitle={t.subtitle} />
      </div>

      <div data-reveal className="stagger-1 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
        {solutions.map((sol, index) => {
          const Icon = sol.icon;
          return (
            <div
              key={sol.id}
              data-reveal
              className={`stagger-${index + 1} relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 card-hover`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#00e9fa]" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00e9fa]">
                  {sol.number}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{sol.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">{sol.desc}</p>

              {/* Métricas clave */}
              <div className="space-y-3 mb-6">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">Métricas clave</h4>
                {sol.metrics.map((m, i) => (
                  <div key={m.label} className="flex justify-between items-center gap-3 py-2 border-b border-white/[0.05] last:border-0">
                    <span className="text-sm text-gray-400 font-mono">{m.label}</span>
                    <span className="text-sm font-semibold text-[#00e9fa] font-mono text-right">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Stack */}
              <div className="pt-4 border-t border-white/[0.08]">
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#00e9fa] block mb-2">Stack Tecnológico</span>
                <span className="text-xs text-white font-sans">{sol.stack}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}