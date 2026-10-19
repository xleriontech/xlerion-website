import React, { useEffect } from 'react';
import {
  X,
  Printer,
  ArrowRight,
  ShieldCheck,
  Radio,
  Cpu,
  Database,
  Monitor,
  CalendarDays,
  PenLine,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LAYER_ICONS = [Radio, Cpu, Database, Monitor];

const COPY = {
  es: {
    badge: 'Ficha Técnica Ejecutiva',
    doc: 'Documento de Arquitectura B2B v4.2',
    title: 'Xlerion: Resumen de Capacidades de Ingeniería',
    subtitle: 'Gemelos Digitales 3D • Inteligencia RAG • Telemetría IoT Resiliente',
    print: 'Imprimir / PDF',
    kpis: [
      {
        value: '−60%',
        label: 'Tiempo de decisión',
        desc: 'Validado en sector público y minería.',
      },
      {
        value: '60 FPS / <4MB',
        label: 'Three.js + Draco',
        desc: 'Renderizado acelerado por GPU en el navegador.',
      },
      {
        value: '99.9% Uptime',
        label: 'Tolerancia en el borde',
        desc: 'Persistencia local sin pérdida de paquetes.',
      },
    ],
    topologyTitle: '1. Topología de la solución',
    topologyBody:
      'Xlerion desacopla la ingesta de telemetría de la capa de renderizado 3D mediante microservicios asíncronos y WebSockets bidireccionales asegurados (WSS). La búsqueda semántica en plataformas RAG usa embeddings densos y re-ranking sobre PostgreSQL con pgvector.',
    layers: [
      { name: 'Sensores / OT', desc: 'PLC, SCADA, MQTT, Modbus y OPC-UA.' },
      { name: 'Edge', desc: 'Buffer local resiliente y filtrado en el borde.' },
      { name: 'Backend / Telemetría', desc: 'FastAPI + Python, WSS y series de tiempo.' },
      { name: 'Visualización WebGL', desc: 'React + Three.js a 60 FPS en el navegador.' },
    ],
    roadmapTitle: '2. Roadmap de PoC (4 semanas)',
    roadmapBody:
      'Metodología por sprints con entregables medibles y auditoría de latencia al cierre.',
    weeks: [
      { week: 'Semana 1', title: 'Ingesta & mapeo', desc: 'Sensores, CAD y fuentes de datos.' },
      { week: 'Semana 2', title: 'Renderizado 3D / RAG', desc: 'Gemelo digital y pipeline semántico.' },
      { week: 'Semana 3', title: 'WebSockets & buffer Edge', desc: 'Telemetría en vivo y tolerancia a fallos.' },
      { week: 'Semana 4', title: 'Auditoría & ROI', desc: 'Latencia, métricas e informe ejecutivo.' },
    ],
    signatureName: 'Miguel E. Rodríguez',
    signatureRole: 'Fundador & Lead Technical Architect',
    signatureCompany: 'Xlerion S.A.S.',
    isoNote: 'Documento emitido bajo estándares ISO 27001',
    close: 'Cerrar',
    cta: 'Agendar PoC basado en este brief',
  },
  en: {
    badge: 'Executive Technical Brief',
    doc: 'B2B Architecture Document v4.2',
    title: 'Xlerion: Engineering Capabilities Summary',
    subtitle: '3D Digital Twins • RAG Intelligence • Resilient IoT Telemetry',
    print: 'Print / PDF',
    kpis: [
      {
        value: '−60%',
        label: 'Decision time',
        desc: 'Validated in the public sector and mining.',
      },
      {
        value: '60 FPS / <4MB',
        label: 'Three.js + Draco',
        desc: 'GPU-accelerated rendering in the browser.',
      },
      {
        value: '99.9% Uptime',
        label: 'Edge tolerance',
        desc: 'Local persistence with no packet loss.',
      },
    ],
    topologyTitle: '1. Solution topology',
    topologyBody:
      'Xlerion decouples telemetry ingestion from the 3D rendering layer using asynchronous microservices and secured bidirectional WebSockets (WSS). Semantic search in RAG platforms uses dense embeddings and re-ranking over PostgreSQL with pgvector.',
    layers: [
      { name: 'Sensors / OT', desc: 'PLC, SCADA, MQTT, Modbus and OPC-UA.' },
      { name: 'Edge', desc: 'Resilient local buffer and edge filtering.' },
      { name: 'Backend / Telemetry', desc: 'FastAPI + Python, WSS and time series.' },
      { name: 'WebGL Visualization', desc: 'React + Three.js at 60 FPS in the browser.' },
    ],
    roadmapTitle: '2. PoC Roadmap (4 weeks)',
    roadmapBody:
      'Sprint-based methodology with measurable deliverables and latency audit at close.',
    weeks: [
      { week: 'Week 1', title: 'Ingestion & mapping', desc: 'Sensors, CAD and data sources.' },
      { week: 'Week 2', title: '3D rendering / RAG', desc: 'Digital twin and semantic pipeline.' },
      { week: 'Week 3', title: 'WebSockets & Edge buffer', desc: 'Live telemetry and fault tolerance.' },
      { week: 'Week 4', title: 'Audit & ROI', desc: 'Latency, metrics and executive report.' },
    ],
    signatureName: 'Miguel E. Rodríguez',
    signatureRole: 'Founder & Lead Technical Architect',
    signatureCompany: 'Xlerion S.A.S.',
    isoNote: 'Document issued under ISO 27001 standards',
    close: 'Close',
    cta: 'Schedule PoC based on this brief',
  },
};

export default function ExecutiveBriefModal({ isOpen, onClose, onOpenPoC }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCta = () => {
    onClose();
    if (onOpenPoC) onOpenPoC();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 print:static print:block print:bg-white print:p-0 print:backdrop-blur-none"
      onClick={onClose}
      role="presentation"
    >
      {/* Print-only full document — hidden on screen, visible on print */}
      <div id="printable-sheet" className="printable-sheet executive-brief-print print:block hidden">
        <div className="executive-brief-print-inner">
          {/* Header */}
          <header className="executive-brief-header print-header">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="executive-brief-badge font-mono text-[9px] uppercase tracking-[0.2em] rounded px-2.5 py-1">
                {c.badge}
              </span>
              <span className="executive-brief-doc font-mono text-[9px] uppercase tracking-[0.2em]">
                {c.doc}
              </span>
            </div>
            <h1 className="executive-brief-title">{c.title}</h1>
            <p className="executive-brief-subtitle font-mono">{c.subtitle}</p>
          </header>

          {/* KPIs */}
          <section className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {c.kpis.map((kpi) => (
                <div key={kpi.label} className="executive-brief-kpi kpi-card">
                  <span className="kpi-value">{kpi.value}</span>
                  <span className="kpi-label">{kpi.label}</span>
                  <p className="kpi-desc">{kpi.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Topology */}
          <section className="mb-6">
            <h2 className="mb-3 pb-2 border-b border-gray-300">{c.topologyTitle}</h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-700">{c.topologyBody}</p>
            <div className="space-y-3">
              {c.layers.map((layer, index) => {
                const Icon = LAYER_ICONS[index] || Radio;
                return (
                  <div key={layer.name} className="topology-card layer-card">
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={16} className="layer-icon" />
                      <span className="font-mono text-[8px] text-gray-500">0{index + 1}</span>
                    </div>
                    <span className="layer-title">{layer.name}</span>
                    <p className="layer-desc">{layer.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Roadmap */}
          <section className="mb-6">
            <h2 className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
              <CalendarDays size={16} className="text-gray-700" />
              {c.roadmapTitle}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-700">{c.roadmapBody}</p>
            <div className="space-y-3">
              {c.weeks.map((week) => (
                <div key={week.week} className="roadmap-week">
                  <span className="roadmap-week-label">{week.week}</span>
                  <span className="roadmap-week-title">{week.title}</span>
                  <p className="roadmap-week-desc">{week.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Signature */}
          <section className="mb-6">
            <div className="signature-block flex items-center gap-4">
              <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0">
                <PenLine size={14} className="text-gray-700" />
              </div>
              <div className="flex-1">
                <span className="signature-name">{c.signatureName}</span>
                <span className="signature-role">{c.signatureRole}</span>
              </div>
              <span className="signature-company hidden sm:block">{c.signatureCompany}</span>
            </div>
          </section>

          {/* ISO Note */}
          <footer className="iso-note">
            <ShieldCheck size={14} className="inline" />
            {c.isoNote}
          </footer>
        </div>
      </div>

      {/* Screen modal */}
      <div
        className="relative bg-[#0a0a12] border border-[#00e9fa]/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:border-0 print:rounded-none print:bg-white print:shadow-none print:text-black"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-6 md:p-8 print:border-gray-300">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa] bg-[#00e9fa]/[0.06] border border-[#00e9fa]/30 rounded px-2.5 py-1 print:border-gray-400 print:text-gray-700">
                {c.badge}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 print:text-gray-600">
                {c.doc}
              </span>
            </div>
            <h3 className="text-white text-xl md:text-2xl font-semibold print:text-black">{c.title}</h3>
            <p className="text-[11px] font-mono text-gray-500 mt-1 print:text-gray-600">{c.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="xl-btn-secondary text-xs gap-2"
            >
              <Printer size={15} />
              {c.print}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {c.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="bg-[#050508] border border-white/[0.08] rounded-lg p-4 print:bg-white print:border-gray-300 executive-brief-kpi kpi-card"
              >
                <span className="block font-mono text-xl font-bold text-[#00e9fa] print:text-black kpi-value">
                  {kpi.value}
                </span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-white mt-2 print:text-black kpi-label">
                  {kpi.label}
                </span>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed print:text-gray-600 kpi-desc">
                  {kpi.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Topology */}
          <div>
            <h4 className="text-white text-base font-semibold mb-2 print:text-black">{c.topologyTitle}</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 print:text-gray-700">
              {c.topologyBody}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {c.layers.map((layer, index) => {
                const Icon = LAYER_ICONS[index] || Radio;
                return (
                  <div
                    key={layer.name}
                    className="relative bg-[#050508] border border-[#00e9fa]/20 rounded-lg p-4 print:bg-white print:border-gray-300 topology-card layer-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon size={18} className="text-[#00e9fa] print:text-gray-700 layer-icon" />
                      <span className="font-mono text-[10px] text-gray-500 print:text-gray-600">
                        0{index + 1}
                      </span>
                    </div>
                    <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-white print:text-black layer-title">
                      {layer.name}
                    </span>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed print:text-gray-600 layer-desc">
                      {layer.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roadmap */}
          <div>
            <h4 className="flex items-center gap-2 text-white text-base font-semibold mb-2 print:text-black">
              <CalendarDays size={18} className="text-[#00e9fa] print:text-gray-700" />
              {c.roadmapTitle}
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 print:text-gray-700">
              {c.roadmapBody}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {c.weeks.map((week) => (
                <div
                  key={week.week}
                  className="bg-[#050508] border border-white/[0.08] rounded-lg p-4 print:bg-white print:border-gray-300 roadmap-week"
                >
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#00e9fa] print:text-black roadmap-week-label">
                    {week.week}
                  </span>
                  <span className="block text-sm text-white mt-2 print:text-black roadmap-week-title">{week.title}</span>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed print:text-gray-600 roadmap-week-desc">
                    {week.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Founder signature */}
          <div className="flex items-center gap-4 bg-[#050508] border border-white/[0.08] rounded-lg p-4 print:bg-white print:border-gray-300 signature-block">
            <div className="w-10 h-10 rounded-md bg-[#00e9fa]/10 border border-[#00e9fa]/30 flex items-center justify-center shrink-0 print:border-gray-400">
              <PenLine size={18} className="text-[#00e9fa] print:text-gray-700" />
            </div>
            <div className="flex-1">
              <span className="block text-white text-sm font-semibold print:text-black signature-name">{c.signatureName}</span>
              <span className="text-[11px] font-mono text-gray-500 print:text-gray-600 signature-role">{c.signatureRole}</span>
            </div>
            <span className="font-mono text-[11px] text-[#00e9fa] print:text-gray-700 hidden sm:block signature-company">
              {c.signatureCompany}
            </span>
          </div>
        </div>

        {/* Footer - hidden on print */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] p-6 md:p-8 print:hidden">
          <span className="flex items-center gap-2 font-mono text-[11px] text-gray-500">
            <ShieldCheck size={15} className="text-[#00e9fa]" />
            {c.isoNote}
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={onClose} className="xl-btn-secondary text-xs w-full sm:w-auto">
              {c.close}
            </button>
            <button type="button" onClick={handleCta} className="xl-btn-primary text-xs gap-2 w-full sm:w-auto">
              {c.cta}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}