import React from 'react';
import {
  Layers,
  Lock,
  ShieldCheck,
  Cloud,
  Server,
  Database,
  Cpu,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const COPY = {
  es: {
    subtitle: 'Sin dependencias experimentales. Cada componente se selecciona por su soporte a largo plazo (LTS), tolerancia a fallos y auditoría.',
    title: 'Ingeniería para la Confianza de CTOs y Auditores de TI',
    archTitle: 'Arquitectura por Capas',
    archItems: [
      {
        icon: Layers,
        title: 'Visualización',
        desc: 'React, Three.js, Compresión geométrica Draco (glTF).',
      },
      {
        icon: Server,
        title: 'Backend & Datos',
        desc: 'Python 3.11+, FastAPI, PostgreSQL, TimescaleDB.',
      },
      {
        icon: Database,
        title: 'IA & Vectores',
        desc: 'LangChain, Modelos locales o API segura, pgvector.',
      },
      {
        icon: Cloud,
        title: 'Infraestructura',
        desc: 'Docker, Kubernetes, Gateways Edge Linux.',
      },
    ],
    secTitle: 'Seguridad y Cumplimiento (Alineado a ISO/IEC 27001)',
    secItems: [
      {
        icon: Lock,
        title: 'Cifrado',
        desc: 'AES-256 en reposo y TLS 1.3 con Perfect Forward Secrecy en tránsito (HTTPS/WSS/MQTTS).',
      },
      {
        icon: ShieldCheck,
        title: 'Soberanía de Datos',
        desc: 'Despliegue On-Premise o VPC privada. Aislamiento de redes disponible.',
      },
      {
        icon: Cpu,
        title: 'Normativa Colombiana',
        desc: 'Cumplimiento estricto de la Ley 1581 de 2012 (Habeas Data) y el Decreto 1377 de 2013 en el tratamiento de cualquier dato personal o sensible en los sistemas.',
      },
      {
        icon: ShieldCheck,
        title: 'Calidad de Software',
        desc: 'Prácticas de CI/CD, tipado estricto y logging estructurado en JSON (trazabilidad completa, alineado a principios ISO/IEC 25010).',
      },
    ],
  },
  en: {
    subtitle: 'No experimental dependencies. Each component is selected for long-term support (LTS), fault tolerance and auditability.',
    title: 'Engineering for CTO and IT Auditor Trust',
    archTitle: 'Layered Architecture',
    archItems: [
      {
        icon: Layers,
        title: 'Visualization',
        desc: 'React, Three.js, Draco Geometric Compression (glTF).',
      },
      {
        icon: Server,
        title: 'Backend & Data',
        desc: 'Python 3.11+, FastAPI, PostgreSQL, TimescaleDB.',
      },
      {
        icon: Database,
        title: 'AI & Vectors',
        desc: 'LangChain, Local Models or Secure API, pgvector.',
      },
      {
        icon: Cloud,
        title: 'Infrastructure',
        desc: 'Docker, Kubernetes, Linux Edge Gateways.',
      },
    ],
    secTitle: 'Security and Compliance (Aligned to ISO/IEC 27001)',
    secItems: [
      {
        icon: Lock,
        title: 'Encryption',
        desc: 'AES-256 at rest and TLS 1.3 with Perfect Forward Secrecy in transit (HTTPS/WSS/MQTTS).',
      },
      {
        icon: ShieldCheck,
        title: 'Data Sovereignty',
        desc: 'On-Premise or Private VPC deployment. Network isolation available.',
      },
      {
        icon: Cpu,
        title: 'Colombian Regulation',
        desc: 'Strict compliance with Law 1581 of 2012 (Habeas Data) and Decree 1377 of 2013 in the processing of any personal or sensitive data in the systems.',
      },
      {
        icon: ShieldCheck,
        title: 'Software Quality',
        desc: 'CI/CD practices, strict typing and structured JSON logging (full traceability, aligned with ISO/IEC 25010 principles).',
      },
    ],
  },
};

export default function TechStackSecuritySection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  return (
    <section
      id="arquitectura"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={c.title} subtitle={c.subtitle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-12">
        {/* Columna 1: Arquitectura por Capas */}
        <div data-reveal className="stagger-1 relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center shrink-0">
              <Layers size={18} className="text-[#00e9fa]" />
            </span>
            <h3 className="text-lg font-semibold text-white">{c.archTitle}</h3>
          </div>

          <div className="space-y-4">
            {c.archItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#00e9fa]/30 transition-colors duration-300"
                >
                  <span className="w-8 h-8 rounded-md bg-[#0b1018] border border-[#00e9fa]/30 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#00e9fa]" />
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-white">{item.title}</span>
                    <span className="block text-xs text-gray-400 leading-relaxed mt-0.5">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna 2: Seguridad y Cumplimiento */}
        <div data-reveal className="stagger-2 relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="text-[#00e9fa]" />
            </span>
            <h3 className="text-lg font-semibold text-white">{c.secTitle}</h3>
          </div>

          <div className="space-y-4">
            {c.secItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#00e9fa]/30 transition-colors duration-300"
                >
                  <span className="w-8 h-8 rounded-md bg-[#0b1018] border border-[#00e9fa]/30 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#00e9fa]" />
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-white">{item.title}</span>
                    <span className="block text-xs text-gray-400 leading-relaxed mt-0.5">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}