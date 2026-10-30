import React, { useState } from 'react';
import { Activity, ArrowUpRight, Brain, CheckCircle2, ChevronRight, Clock, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';
import RoiCalculator from '../components/RoiCalculator';

const COPY = {
  es: {
    subtitle: 'Métricas de Impacto',
    title: 'Barra de Confianza: Resultados Auditados',
    intro: 'Cuatro métricas clave de mi trayectoria, auditadas y verificadas en proyectos reales de DeepTech industrial.',
    kpisTitle: 'KPIs Auditados',
    expand: 'Detalles',
    collapse: 'Ocultar',
    caseLabel: 'Caso',
    metrics: [
      {
        id: 'decision-time',
        icon: 'Clock',
        value: '-60%',
        label: 'Tiempo de toma de decisiones',
        caseStudy: 'Para 12+ administradores municipales, Plataforma FOVIS',
        architecture: [
          'Sustitución de reportes PDF semanales por streaming continuo con latencia inferior a 200 ms vía WebSockets.',
          'Indexación centralizada de más de 1.200 puntos de auditoría pública municipal con agregación en tiempo real.',
          'Panel ejecutivo con alertas tempranas automatizadas para incidentes de servicio crítico.',
        ],
        kpis: [
          { label: 'Latencia anterior', value: '72 horas' },
          { label: 'Latencia actual', value: '< 200 ms' },
          { label: 'Eficiencia de auditoría', value: '+3.5x' },
        ],
      },
      {
        id: 'analysis-time',
        icon: 'Brain',
        value: '-40%',
        label: 'Tiempo de análisis de datos complejos',
        caseStudy: 'Visualización 3D para estrategias neurocientíficas, AONC',
        architecture: [
          'Ingesta y vectorización de miles de datasets clínicos y señales de telemetría de alta frecuencia.',
          'Búsqueda semántica híbrida (vectorial densa + BM25 léxico) con verificación de citas sin alucinaciones.',
          'Extracción automatizada de correlaciones estadísticas con modelos LLM especializados on-premise.',
        ],
        kpis: [
          { label: 'Consulta promedio', value: 'de 25 min a 90 s' },
          { label: 'Precisión de citación', value: '99.4%' },
          { label: 'Datasets procesados', value: '> 85,000 docs' },
        ],
      },
      {
        id: 'pipeline-export',
        icon: 'Server',
        value: '-80%',
        label: 'Tiempo de exportación de pipelines 3D',
        caseStudy: 'Mediante suite de automatización personalizada con MaxScript',
        architecture: [
          'Suite de automatización personalizada desarrollada en MaxScript para pipelines de exportación 3D.',
          'Procesamiento por lotes optimizado con paralelización de tareas y gestión inteligente de dependencias.',
          'Eliminación de pasos manuales repetitivos mediante scripting avanzado y validación automática.',
        ],
        kpis: [
          { label: 'Tiempo anterior', value: 'Horas' },
          { label: 'Tiempo actual', value: 'Minutos' },
          { label: 'Reducción errores', value: '95%' },
        ],
      },
      {
        id: 'telemetry-uptime',
        icon: 'Activity',
        value: '99%',
        label: 'Uptime en ingesta de telemetría',
        caseStudy: 'Arquitectura tolerante a fallos con persistencia local',
        architecture: [
          'Búfer circular en borde con persistencia SQLite/DuckDB ante caída de enlace satelital o de fibra.',
          'Reconciliación y sincronización con cola transaccional atómica al restablecerse el enlace.',
          'Cero pérdida de paquetes de sensores de alta criticidad (vibración, temperatura, flujo hidráulico).',
        ],
        kpis: [
          { label: 'Pérdida de paquetes', value: '0.00%' },
          { label: 'Autonomía offline', value: 'hasta 72 h' },
          { label: 'Throughput pico', value: '50,000 msg/s' },
        ],
      },
    ],
  },
  en: {
    subtitle: 'Impact Metrics',
    title: 'Trust Bar: Audited Results',
    intro: 'Four key metrics from my track record, audited and verified in real DeepTech industrial projects.',
    kpisTitle: 'Audited KPIs',
    expand: 'Details',
    collapse: 'Hide',
    caseLabel: 'Case',
    metrics: [
      {
        id: 'decision-time',
        icon: 'Clock',
        value: '-60%',
        label: 'Decision-making time',
        caseStudy: 'For 12+ municipal administrators, FOVIS Platform',
        architecture: [
          'Replacement of weekly PDF reports with continuous streaming at sub-200 ms latency over WebSockets.',
          'Centralized indexing of 1,200+ municipal public audit points with real-time aggregation.',
          'Executive dashboard with automated early alerts for critical service incidents.',
        ],
        kpis: [
          { label: 'Previous latency', value: '72 hours' },
          { label: 'Current latency', value: '< 200 ms' },
          { label: 'Audit efficiency', value: '+3.5x' },
        ],
      },
      {
        id: 'analysis-time',
        icon: 'Brain',
        value: '-40%',
        label: 'Complex data analysis time',
        caseStudy: '3D visualization for neuroscientific strategies, AONC',
        architecture: [
          'Ingestion and vectorization of thousands of clinical datasets and high-frequency telemetry signals.',
          'Hybrid semantic search (dense vector + lexical BM25) with citation verification and no hallucinations.',
          'Automated extraction of statistical correlations using on-premise specialized LLM models.',
        ],
        kpis: [
          { label: 'Average query', value: 'from 25 min to 90 s' },
          { label: 'Citation accuracy', value: '99.4%' },
          { label: 'Datasets processed', value: '> 85,000 docs' },
        ],
      },
      {
        id: 'pipeline-export',
        icon: 'Server',
        value: '-80%',
        label: '3D pipeline export time',
        caseStudy: 'Via custom MaxScript automation suite',
        architecture: [
          'Custom MaxScript automation suite for 3D export pipelines.',
          'Optimized batch processing with task parallelization and smart dependency management.',
          'Elimination of repetitive manual steps via advanced scripting and automated validation.',
        ],
        kpis: [
          { label: 'Previous time', value: 'Hours' },
          { label: 'Current time', value: 'Minutes' },
          { label: 'Error reduction', value: '95%' },
        ],
      },
      {
        id: 'telemetry-uptime',
        icon: 'Activity',
        value: '99%',
        label: 'Telemetry ingestion uptime',
        caseStudy: 'Fault-tolerant architecture with local persistence',
        architecture: [
          'Edge circular buffer with SQLite/DuckDB persistence during satellite or fiber link drops.',
          'Reconciliation and synchronization with atomic transactional queue upon link restoration.',
          'Zero packet loss from high-criticality sensors (vibration, temperature, hydraulic flow).',
        ],
        kpis: [
          { label: 'Packet loss', value: '0.00%' },
          { label: 'Offline autonomy', value: 'up to 72 h' },
          { label: 'Peak throughput', value: '50,000 msg/s' },
        ],
      },
    ],
  },
};

function MetricIcon({ name }) {
  if (name === 'Clock') return <Clock className="w-5 h-5 text-[#00e9fa]" />;
  if (name === 'Brain') return <Brain className="w-5 h-5 text-[#00e9fa]" />;
  if (name === 'Server') return <Server className="w-5 h-5 text-[#00e9fa]" />;
  return <Activity className="w-5 h-5 text-[#00e9fa]" />;
}

export default function MetricsSection({ onApplyRoi, onOpenPoC }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  const [activeMetric, setActiveMetric] = useState(null);

  const toggleMetric = (id) => setActiveMetric((prev) => (prev === id ? null : id));

  return (
    <section
      id="metricas"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {c.metrics.map((metric, index) => {
          return (
            <div
              key={metric.id}
              className={`stagger-${index + 1} relative overflow-hidden bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-6 md:p-7 card-hover glow-on-hover transition-colors`}
              data-reveal
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                  <MetricIcon name={metric.icon} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00e9fa]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e9fa]" />
                  <span>{c.caseLabel}: {metric.caseStudy}</span>
                </span>
              </div>

              <div className="font-mono text-4xl md:text-5xl font-extrabold text-[#00e9fa] tracking-tight mb-3">
                {metric.value}
              </div>

              <h3 className="text-lg font-bold text-white mb-3 leading-snug">{metric.label}</h3>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e9fa]" />
                <span>{c.caseLabel}: {metric.caseStudy}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded ROI calculator */}
      <div className="mt-10 md:mt-12">
        <RoiCalculator onApply={onApplyRoi} />
      </div>
    </section>
  );
}