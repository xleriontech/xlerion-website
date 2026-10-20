import React from 'react';
import { Clock, Brain, Server, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const METRICS_ES = [
  {
    icon: Clock,
    value: '−60%',
    label: 'Tiempo de toma de decisiones operativas',
    case: 'Plataforma de gestión municipal',
  },
  {
    icon: Brain,
    value: '−40%',
    label: 'Tiempo de análisis de datos complejos',
    case: 'Visualización 3D para estrategias neurocientíficas/industriales',
  },
  {
    icon: Server,
    value: '−80%',
    label: 'Tiempo de exportación de pipelines 3D',
    case: 'Automatización propietaria',
  },
  {
    icon: Activity,
    value: '99.9%',
    label: 'Uptime en ingesta de telemetría',
    case: 'Arquitectura de persistencia local',
  },
];

const METRICS_EN = [
  {
    icon: Clock,
    value: '−60%',
    label: 'Operational decision-making time',
    case: 'Municipal management platform',
  },
  {
    icon: Brain,
    value: '−40%',
    label: 'Complex data analysis time',
    case: '3D visualization for neuro-scientific/industrial strategies',
  },
  {
    icon: Server,
    value: '−80%',
    label: '3D pipeline export time',
    case: 'Proprietary automation',
  },
  {
    icon: Activity,
    value: '99.9%',
    label: 'Telemetry ingestion uptime',
    case: 'Local persistence architecture',
  },
];

export default function ImpactRoiSection() {
  const { lang } = useLanguage();
  const metrics = lang === 'en' ? METRICS_EN : METRICS_ES;

  const titles = {
    es: {
      title: 'Resultados Medibles, No Solo Promesas',
      subtitle: 'Basado en métricas auditadas de implementaciones reales en sectores industriales.',
      note: 'Ofrecemos una calculadora de ROI personalizada para su operación específica durante la fase de PoC.',
    },
    en: {
      title: 'Measurable Results, Not Just Promises',
      subtitle: 'Based on audited metrics from real implementations in industrial sectors.',
      note: 'We offer a customized ROI calculator for your specific operation during the PoC phase.',
    },
  };

  const t = titles[lang] || titles.es;

  return (
    <section
      id="impacto"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={t.title} subtitle={t.subtitle} />
      </div>

      {/* Métricas */}
      <div data-reveal className="stagger-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
        {metrics.map((m, index) => {
          const Icon = m.icon;
          return (
            <div key={m.value} data-reveal className={`stagger-${index + 1} relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 card-hover`}>
              <div className="w-10 h-10 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#00e9fa]" />
              </div>
              <span className="block text-3xl md:text-4xl font-bold font-mono text-[#00e9fa] leading-none">{m.value}</span>
              <span className="block mt-2 text-sm font-semibold text-white">{m.label}</span>
              <span className="block mt-1 text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">{m.case}</span>
            </div>
          );
        })}
      </div>

      {/* Nota ROI */}
      <div data-reveal className="stagger-2 mt-16 pt-8 border-t border-white/[0.08]">
        <div className="bg-[#050508] border border-[#00e9fa]/30 rounded-lg p-6 md:p-8">
          <p className="text-sm text-[#00e9fa] font-mono uppercase tracking-[0.2em] leading-relaxed">
            {t.note}
          </p>
        </div>
      </div>
    </section>
  );
}