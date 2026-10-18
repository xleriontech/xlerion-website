import React, { useState } from 'react';
import { Activity, ArrowUpRight, Brain, CheckCircle2, ChevronRight, Clock, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';
import RoiCalculator from '../components/RoiCalculator';

const COPY = {
  es: {
    subtitle: 'Resultados comprobados',
    title: 'Ingeniería validada por rendimiento y ROI tangible',
    intro: 'Cada implementación está auditada para generar reducciones medibles en latencia operativa, costos de inactividad y tiempo de análisis. Descartamos las métricas de vanidad.',
    architectureTitle: 'Arquitectura técnica aplicada',
    kpisTitle: 'KPIs auditados',
    expand: 'Detalles',
    collapse: 'Ocultar',
    caseLabel: 'Caso',
    bannerTitle: 'Garantía de resiliencia en planta y telemetría crítica',
    bannerText: 'Arquitecturas diseñadas para tolerar cortes intermitentes de red y sobrecargas de ingesta sin pérdida de datos.',
    bannerCta: 'Agendar PoC',
    metrics: [
      {
        id: 'fovis',
        icon: 'Clock',
        value: '-60%',
        label: 'Tiempo de toma de decisiones',
        caseStudy: 'Gestión Pública / FOVIS',
        architecture: [
          'Sustitución de reportes PDF semanales por streaming continuo con latencia inferior a 200 ms vía WebSockets.',
          'Indexación centralizada de más de 1,200 puntos de auditoría pública municipal con agregación en tiempo real.',
          'Panel ejecutivo con alertas tempranas automatizadas para incidentes de servicio crítico.',
        ],
        kpis: [
          { label: 'Latencia anterior', value: '72 horas' },
          { label: 'Latencia actual', value: '< 200 ms' },
          { label: 'Eficiencia de auditoría', value: '+3.5x' },
        ],
      },
      {
        id: 'aonc',
        icon: 'Brain',
        value: '-40%',
        label: 'Tiempo de análisis de datos complejos',
        caseStudy: 'Neurociencia / AONC',
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
        id: 'iot-edge',
        icon: 'Activity',
        value: '99.9%',
        label: 'Uptime en telemetría IoT / Edge SCADA',
        caseStudy: 'Arquitectura resiliente en borde',
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
    subtitle: 'Proven results',
    title: 'Engineering validated by performance and tangible ROI',
    intro: 'Every implementation is audited to deliver measurable reductions in operational latency, downtime cost and analysis time. We discard vanity metrics.',
    architectureTitle: 'Applied technical architecture',
    kpisTitle: 'Audited KPIs',
    expand: 'Details',
    collapse: 'Hide',
    caseLabel: 'Case',
    bannerTitle: 'Resilience guarantee for plant and critical telemetry',
    bannerText: 'Architectures designed to tolerate intermittent network outages and ingestion spikes without data loss.',
    bannerCta: 'Schedule PoC',
    metrics: [
      {
        id: 'fovis',
        icon: 'Clock',
        value: '-60%',
        label: 'Decision-making time',
        caseStudy: 'Public Management / FOVIS',
        architecture: [
          'Weekly PDF reports replaced by continuous streaming with sub-200 ms latency over WebSockets.',
          'Centralized indexing of more than 1,200 municipal public audit points with real-time aggregation.',
          'Executive dashboard with automated early alerts for critical service incidents.',
        ],
        kpis: [
          { label: 'Previous latency', value: '72 hours' },
          { label: 'Current latency', value: '< 200 ms' },
          { label: 'Audit efficiency', value: '+3.5x' },
        ],
      },
      {
        id: 'aonc',
        icon: 'Brain',
        value: '-40%',
        label: 'Complex data analysis time',
        caseStudy: 'Neuroscience / AONC',
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
        id: 'iot-edge',
        icon: 'Activity',
        value: '99.9%',
        label: 'IoT / Edge SCADA telemetry uptime',
        caseStudy: 'Resilient edge architecture',
        architecture: [
          'Edge circular buffer with SQLite/DuckDB persistence when satellite or fiber links drop.',
          'Reconciliation and synchronization with an atomic transactional queue once the link is restored.',
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
      <SectionHeader title={c.title} subtitle={c.subtitle} />

      <p className="text-sm md:text-base text-gray-400 max-w-3xl -mt-6 md:-mt-10 mb-10" data-reveal>
        {c.intro}
      </p>

      {/* Impact metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {c.metrics.map((metric, index) => {
          const isActive = activeMetric === metric.id;
          return (
            <div
              key={metric.id}
              role="button"
              tabIndex={0}
              onClick={() => toggleMetric(metric.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleMetric(metric.id);
                }
              }}
              className={`stagger-${index + 1} relative overflow-hidden bg-[#0a0a12]/80 border rounded-lg p-6 md:p-7 cursor-pointer card-hover glow-on-hover transition-colors ${
                isActive ? 'border-[#00e9fa]/40' : 'border-white/[0.08]'
              }`}
              data-reveal
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                  <MetricIcon name={metric.icon} />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#00e9fa]/80">
                  {isActive ? c.collapse : c.expand}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </span>
              </div>

              <div className="font-mono text-4xl md:text-5xl font-extrabold text-[#00e9fa] tracking-tight">
                {metric.value}
              </div>

              <h3 className="text-lg font-bold text-white mt-3 leading-snug">{metric.label}</h3>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e9fa]" />
                <span>{c.caseLabel}: {metric.caseStudy}</span>
              </div>

              {isActive && (
                <div className="mt-5 pt-5 border-t border-[#00e9fa]/20 space-y-4">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00e9fa]">
                    {c.architectureTitle}
                  </div>
                  <ul className="space-y-2">
                    {metric.architecture.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00e9fa] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">
                      {c.kpisTitle}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {metric.kpis.map((kpi) => (
                        <div key={kpi.label} className="p-2 rounded bg-[#050508] border border-white/[0.08] text-center">
                          <div className="text-[9px] font-mono text-gray-500 leading-tight">{kpi.label}</div>
                          <div className="text-[11px] font-mono font-bold text-white mt-1">{kpi.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Embedded ROI calculator */}
      <div className="mt-10 md:mt-12">
        <RoiCalculator onApply={onApplyRoi} />
      </div>

      {/* Final CTA banner */}
      <div className="mt-8 md:mt-10 rounded-lg bg-gradient-to-r from-[#00e9fa]/10 via-[#0a0a12]/80 to-[#00e9fa]/[0.04] border border-[#00e9fa]/20 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00e9fa]/10 border border-[#00e9fa]/20 flex items-center justify-center text-[#00e9fa] shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{c.bannerTitle}</div>
            <div className="text-xs font-mono text-gray-500 mt-1">{c.bannerText}</div>
          </div>
        </div>

        <button type="button" onClick={onOpenPoC} className="xl-btn-primary shrink-0">
          <span>{c.bannerCta}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
