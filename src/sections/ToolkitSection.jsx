import React from 'react';
import { Shield, BarChart2, Zap, Code2, FileText, Cpu, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const COPY = {
  es: {
    subtitle: 'Entorno Modular Propietario',
    title: 'Xlerion Core Toolkit',
    description: 'Entorno modular propietario para el diagnóstico y validación de sistemas técnicos. Incluye logging estructurado en JSON, comparadores de rendimiento, diagnóstico previo a tareas críticas y preservación de convenciones para garantizar la escalabilidad documental y operativa en pipelines empresariales.',
    modules: [
      {
        icon: Code2,
        title: 'Logging Estructurado JSON',
        description: 'Logging estructurado en formato JSON para trazabilidad completa y debugging automatizado en pipelines distribuidos.',
      },
      {
        icon: BarChart2,
        title: 'Comparadores de Rendimiento',
        description: 'Benchmarks automatizados con métricas de latencia, throughput y uso de recursos para validación de rendimiento.',
      },
      {
        icon: Zap,
        title: 'Diagnóstico Pre-tarea',
        description: 'Validación automática de precondiciones antes de ejecutar tareas críticas en pipelines de producción.',
      },
      {
        icon: FileText,
        title: 'Preservación de Convenciones',
        description: 'Enforcement automático de convenciones de código,命名 y arquitectura para escalabilidad documental.',
      },
      {
        icon: Cpu,
        title: 'Diagnóstico de Rendimiento',
        description: 'Profiling continuo y detección de cuellos de botella en tiempo real para pipelines críticos.',
      },
      {
        icon: Shield,
        title: 'Validación de Escalabilidad',
        description: 'Pruebas de carga y estrés automatizadas para garantizar escalabilidad documental y operativa.',
      },
    ],
    cta: 'Solicitar Acceso al Toolkit',
  },
  en: {
    subtitle: 'Proprietary Modular Environment',
    title: 'Xlerion Core Toolkit',
    description: 'Proprietary modular environment for technical system diagnosis and validation. Includes structured JSON logging, performance comparators, pre-task critical diagnostics, and convention preservation to ensure documentary and operational scalability in enterprise pipelines.',
    modules: [
      {
        icon: Code2,
        title: 'Structured JSON Logging',
        description: 'Structured JSON logging for full traceability and automated debugging in distributed pipelines.',
      },
      {
        icon: BarChart2,
        title: 'Performance Comparators',
        description: 'Automated benchmarks with latency, throughput, and resource usage metrics for performance validation.',
      },
      {
        icon: Zap,
        title: 'Pre-task Diagnostics',
        description: 'Automated pre-condition validation before executing critical tasks in production pipelines.',
      },
      {
        icon: FileText,
        title: 'Convention Preservation',
        description: 'Automated enforcement of code, naming, and architecture conventions for documentary scalability.',
      },
      {
        icon: Cpu,
        title: 'Performance Diagnostics',
        description: 'Continuous profiling and real-time bottleneck detection for critical pipelines.',
      },
      {
        icon: Shield,
        title: 'Scalability Validation',
        description: 'Automated load and stress testing to ensure documentary and operational scalability.',
      },
    ],
    cta: 'Request Toolkit Access',
  },
};

export default function ToolkitSection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  return (
    <section
      id="toolkit"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={c.title} subtitle={c.subtitle} />
      </div>

      <p data-reveal className="stagger-1 max-w-3xl -mt-6 mb-12 text-sm md:text-base text-gray-400 leading-relaxed font-sans">
        {c.description}
      </p>

      <div data-reveal className="stagger-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {c.modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <article
              key={module.title}
              data-reveal
              className={`stagger-${index + 1} bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-6 md:p-8 card-hover glow-on-hover transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-lg bg-[#00e9fa]/10 border border-[#00e9fa]/30 flex items-center justify-center mb-4">
                <Icon size={24} className="text-[#00e9fa]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{module.title}</h3>
              <p className="text-gray-400 leading-relaxed">{module.description}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-12 text-center" data-reveal>
        <button type="button" onClick={onOpenPoC} className="xl-btn-primary">
          <FileText size={16} />
          {c.cta}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}