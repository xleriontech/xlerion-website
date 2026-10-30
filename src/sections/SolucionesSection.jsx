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
    desc: 'Monitoreo de telemetría industrial y mantenimiento predictivo con renderizado acelerado por GPU en el navegador.',
    metrics: [
      { label: 'Throughput WebSockets', value: '>100 msg/s' },
      { label: 'Renderizado 3D', value: '60 FPS' },
      { label: 'Detección anomalías', value: 'Z-score' },
    ],
    stack: 'React 18 · Three.js · FastAPI · Docker',
  },
  {
    id: 'enterprise-rag',
    number: '02',
    icon: Database,
    title: 'Asistentes Corporativos RAG (Enterprise AI)',
    desc: 'Reducción del tiempo de búsqueda en bases de conocimiento no estructuradas (manuales técnicos, legales, operaciones) mediante IA generativa controlada.',
    metrics: [
      { label: 'Chunking semántico', value: 'Semántico' },
      { label: 'Búsqueda híbrida', value: 'Vectorial + Léxica' },
      { label: 'Re-ranking', value: 'Anti-alucinaciones' },
    ],
    stack: 'Python · LangChain · PostgreSQL (pgvector) · Celery + Redis',
  },
  {
    id: 'iot-resilient',
    number: '03',
    icon: Activity,
    title: 'Backend de Telemetría Resiliente (IoT Industrial)',
    desc: 'Ingesta de datos de sensores en entornos con conectividad intermitente o de baja calidad.',
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Persistencia local', value: 'Buffering' },
      { label: 'Reconciliación', value: 'Atómica' },
    ],
    stack: 'Python (Asyncio) · MQTT · TimescaleDB · Linux Edge (Arm64)',
  },
];

const SOLUTIONS_EN = [
  {
    id: 'smartfactory',
    number: '01',
    icon: Monitor,
    title: 'Digital Twins 3D (SmartFactory)',
    desc: 'Industrial telemetry monitoring and predictive maintenance with GPU-accelerated rendering in the browser.',
    metrics: [
      { label: 'WebSocket Throughput', value: '>100 msg/s' },
      { label: '3D Rendering', value: '60 FPS' },
      { label: 'Anomaly Detection', value: 'Z-score' },
    ],
    stack: 'React 18 · Three.js · FastAPI · Docker',
  },
  {
    id: 'enterprise-rag',
    number: '02',
    icon: Database,
    title: 'Enterprise RAG Assistants',
    desc: 'Reduced search time in unstructured knowledge bases (technical manuals, legal, operations) through controlled generative AI.',
    metrics: [
      { label: 'Semantic Chunking', value: 'Semantic' },
      { label: 'Hybrid Search', value: 'Vector + Lexical' },
      { label: 'Re-ranking', value: 'Anti-Hallucination' },
    ],
    stack: 'Python · LangChain · PostgreSQL (pgvector) · Celery + Redis',
  },
  {
    id: 'iot-resilient',
    number: '03',
    icon: Activity,
    title: 'Resilient Telemetry Backend (Industrial IoT)',
    desc: 'Sensor data ingestion in environments with intermittent or low-quality connectivity.',
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Local Persistence', value: 'Buffering' },
      { label: 'Reconciliation', value: 'Atomic' },
    ],
    stack: 'Python (Asyncio) · MQTT · TimescaleDB · Linux Edge (Arm64)',
  },
];

export default function SolucionesSection() {
  const { lang } = useLanguage();
  const solutions = lang === 'en' ? SOLUTIONS_EN : SOLUTIONS_ES;

  const titles = {
    es: {
      title: 'Arquitecturas de Nivel Empresarial para Entornos Críticos',
      subtitle: 'Tres líneas de solución validadas en producción, diseñadas para operar en nube privada, on-premise o entornos air-gapped.',
    },
    en: {
      title: 'Enterprise-Grade Architectures for Critical Environments',
      subtitle: 'Three production-validated solution lines, designed to operate in private cloud, on-premise, or air-gapped environments.',
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
                  <div key={m.label} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                    <span className="text-sm text-gray-400 font-mono">{m.label}</span>
                    <span className="text-sm font-semibold text-[#00e9fa] font-mono">{m.value}</span>
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