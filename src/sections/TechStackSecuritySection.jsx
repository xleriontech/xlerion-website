import React, { useState } from 'react';
import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Database,
  FileCheck2,
  Layers,
  Lock,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

export default function TechStackSecuritySection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = lang === 'en' ? 'en' : 'es';

  const COPY = {
    es: {
      subtitle: 'Ingeniería de Nivel Empresarial',
      title: 'Stack Tecnológico y Estándares de Seguridad',
      intro: 'No utilizamos librerías experimentales ni dependencias frágiles. Cada componente del stack fue seleccionado por su tolerancia a fallos, soporte a largo plazo y rendimiento a escala industrial.',
      stackHeading: 'Stack Tecnológico por Capas',
      stackIntro: 'Arquitecturas modulares que cubren la visualización, la ingesta de datos, la inteligencia y el despliegue en infraestructura crítica.',
      stackNote: 'Auditoría CI/CD, tipado estricto y versiones con soporte a largo plazo (LTS).',
      categories: [
        {
          icon: Box,
          title: 'Visualización 3D & Frontend',
          description: 'Renderizado web acelerado por GPU, sin instalación de ejecutables locales.',
          techs: [
            { name: 'React', role: 'Arquitectura UI / SPA reactiva', badge: 'Frontend' },
            { name: 'Three.js', role: 'Motor WebGL 2.0 y shaders', badge: 'Core 3D' },
            { name: 'Draco', role: 'Compresión geométrica glTF', badge: 'Rendimiento' },
          ],
        },
        {
          icon: Server,
          title: 'Backend, Ingesta & IoT',
          description: 'Servicios asíncronos de baja latencia y protocolos industriales.',
          techs: [
            { name: 'FastAPI', role: 'APIs asíncronas en Python', badge: 'Backend' },
            { name: 'Python', role: 'Pipelines de datos y lógica numérica', badge: 'Lenguaje' },
            { name: 'WebSockets', role: 'Streaming full-duplex bidireccional', badge: 'Streaming' },
            { name: 'MQTT', role: 'Telemetría ligera para IoT industrial', badge: 'Protocolo IoT' },
          ],
        },
        {
          icon: Database,
          title: 'Datos, Vectores & IA',
          description: 'Almacenamiento híbrido para series de tiempo y embeddings semánticos.',
          techs: [
            { name: 'pgvector', role: 'Embeddings vectoriales sobre PostgreSQL', badge: 'Vector DB' },
            { name: 'LangChain', role: 'Orquestación de agentes y RAG', badge: 'IA' },
            { name: 'TimescaleDB', role: 'Series de tiempo para telemetría', badge: 'Time-Series' },
          ],
        },
        {
          icon: Cloud,
          title: 'Infraestructura & Despliegue',
          description: 'Contenerización portable para nube privada, On-Premise o borde.',
          techs: [
            { name: 'Docker', role: 'Contenedores inmutables', badge: 'DevOps' },
            { name: 'Kubernetes', role: 'Orquestación y alta disponibilidad', badge: 'Cloud Native' },
            { name: 'Linux / Arm64', role: 'Gateways embebidos de planta', badge: 'Hardware Edge' },
          ],
        },
      ],
      securityHeading: 'Seguridad y Cumplimiento',
      securityIntro: 'Diseñamos arquitecturas para la confianza de CTOs y auditores de TI en infraestructura crítica.',
      badgeLey: 'LEY 1581 COLOMBIA',
      panelTag: 'Control de arquitectura verificado',
      controls: [
        {
          id: 'encryption',
          icon: Lock,
          title: 'Cifrado de datos en tránsito y reposo',
          badge: 'AES-256 & TLS 1.3',
          summary: 'Protección criptográfica de telemetría y conocimiento confidencial.',
          details: [
            'TLS 1.3 con Perfect Forward Secrecy en HTTPS / WSS / MQTTS',
            'Cifrado AES-256 en bases relacionales, vectoriales y de series',
            'Gestión de claves con Vault / KMS corporativos',
          ],
        },
        {
          id: 'habeasdata',
          icon: FileCheck2,
          title: 'Cumplimiento de la Ley 1581 (Habeas Data)',
          badge: 'Ley 1581 de 2012 (Colombia)',
          summary: 'Garantía legal y técnica para el tratamiento de datos personales.',
          details: [
            'Alineación con la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013',
            'Anonimización de registros y ejercicio de derechos ARCO',
            'Trazabilidad forense de cada operación',
          ],
        },
        {
          id: 'airgap',
          icon: Server,
          title: 'Aislamiento On-Premise y Redes Air-Gapped',
          badge: 'Air-Gap / Private VPC',
          summary: 'Operación autónoma sin dependencia de servicios públicos de terceros.',
          details: [
            'Despliegue íntegro en la red local del cliente o VPC privada',
            'Inferencia de IA y RAG sin APIs públicas externas',
            'Integración segura con DMZ y firewalls industriales (Purdue)',
          ],
        },
      ],
      sovereignty: 'Soberanía total de datos: despliegue On-Premise o VPC privada.',
      cta: 'Solicitar checklist de ciberseguridad',
    },
    en: {
      subtitle: 'Enterprise-Grade Engineering',
      title: 'Technology Stack and Security Standards',
      intro: 'We do not rely on experimental libraries or fragile dependencies. Every stack component was selected for fault tolerance, long-term support and industrial-scale performance.',
      stackHeading: 'Layered Technology Stack',
      stackIntro: 'Modular architectures covering visualization, data ingestion, intelligence and deployment on critical infrastructure.',
      stackNote: 'CI/CD auditing, strict typing and long-term support (LTS) versions.',
      categories: [
        {
          icon: Box,
          title: '3D Visualization & Frontend',
          description: 'GPU-accelerated web rendering with no local executables to install.',
          techs: [
            { name: 'React', role: 'Reactive UI / SPA architecture', badge: 'Frontend' },
            { name: 'Three.js', role: 'WebGL 2.0 engine and shaders', badge: 'Core 3D' },
            { name: 'Draco', role: 'glTF geometry compression', badge: 'Performance' },
          ],
        },
        {
          icon: Server,
          title: 'Backend, Ingestion & IoT',
          description: 'Low-latency asynchronous services and industrial protocols.',
          techs: [
            { name: 'FastAPI', role: 'Asynchronous Python APIs', badge: 'Backend' },
            { name: 'Python', role: 'Data pipelines and numeric logic', badge: 'Language' },
            { name: 'WebSockets', role: 'Full-duplex bidirectional streaming', badge: 'Streaming' },
            { name: 'MQTT', role: 'Lightweight industrial IoT telemetry', badge: 'IoT Protocol' },
          ],
        },
        {
          icon: Database,
          title: 'Data, Vectors & AI',
          description: 'Hybrid storage for time series and semantic embeddings.',
          techs: [
            { name: 'pgvector', role: 'Vector embeddings on PostgreSQL', badge: 'Vector DB' },
            { name: 'LangChain', role: 'Agent and RAG orchestration', badge: 'AI' },
            { name: 'TimescaleDB', role: 'Time series for telemetry', badge: 'Time-Series' },
          ],
        },
        {
          icon: Cloud,
          title: 'Infrastructure & Deployment',
          description: 'Portable containerization for private cloud, on-premise or edge.',
          techs: [
            { name: 'Docker', role: 'Immutable containers', badge: 'DevOps' },
            { name: 'Kubernetes', role: 'Orchestration and high availability', badge: 'Cloud Native' },
            { name: 'Linux / Arm64', role: 'Embedded plant gateways', badge: 'Edge Hardware' },
          ],
        },
      ],
      securityHeading: 'Security and Compliance',
      securityIntro: 'We design architectures for the trust of CTOs and IT auditors on critical infrastructure.',
      badgeLey: 'LAW 1581 COLOMBIA',
      panelTag: 'Verified architecture control',
      controls: [
        {
          id: 'encryption',
          icon: Lock,
          title: 'Data encryption in transit and at rest',
          badge: 'AES-256 & TLS 1.3',
          summary: 'Cryptographic protection of telemetry and confidential knowledge.',
          details: [
            'TLS 1.3 with Perfect Forward Secrecy on HTTPS / WSS / MQTTS',
            'AES-256 encryption across relational, vector and time-series stores',
            'Key management with corporate Vault / KMS',
          ],
        },
        {
          id: 'habeasdata',
          icon: FileCheck2,
          title: 'Compliance with Law 1581 (Habeas Data)',
          badge: 'Colombian Law 1581 of 2012',
          summary: 'Legal and technical assurance for personal data processing.',
          details: [
            'Alignment with Statutory Law 1581 of 2012 and Decree 1377 of 2013',
            'Record anonymization and ARCO data-subject rights',
            'Forensic traceability of every operation',
          ],
        },
        {
          id: 'airgap',
          icon: Server,
          title: 'On-Premise isolation and Air-Gapped networks',
          badge: 'Air-Gap / Private VPC',
          summary: 'Autonomous operation with no dependency on third-party public services.',
          details: [
            'Full deployment inside the client network or a private VPC',
            'AI and RAG inference without external public APIs',
            'Secure integration with DMZ and industrial firewalls (Purdue)',
          ],
        },
      ],
      sovereignty: 'Full data sovereignty: on-premise or private VPC deployment.',
      cta: 'Request the cybersecurity checklist',
    },
  };

  const copy = COPY[c] || COPY.es;
  const [selectedControl, setSelectedControl] = useState(0);
  const active = copy.controls[selectedControl];

  return (
    <section
      id="arquitectura"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={copy.title} subtitle={copy.subtitle} />
      </div>

      <p
        data-reveal
        className="stagger-1 max-w-3xl -mt-6 mb-12 text-sm md:text-base text-gray-400 leading-relaxed font-sans"
      >
        {copy.intro}
      </p>

      {/* Stack by layers */}
      <div data-reveal className="stagger-2 mb-16">
        <div className="flex items-center gap-3 mb-2">
          <Layers size={18} className="text-[#00e9fa]" />
          <h3 className="text-base md:text-lg font-semibold text-white">{copy.stackHeading}</h3>
        </div>
        <p className="mb-6 max-w-2xl text-xs md:text-sm text-gray-500 leading-relaxed">{copy.stackIntro}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {copy.categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                data-reveal
                className={`stagger-${index + 1} relative bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-5 md:p-6 backdrop-blur-sm card-hover`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-[#00e9fa]" />
                    </span>
                    <h4 className="text-sm md:text-base font-semibold text-white">{cat.title}</h4>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa]">
                    0{index + 1}
                  </span>
                </div>

                <p className="mb-4 text-xs text-gray-500 leading-relaxed">{cat.description}</p>

                <div className="flex flex-wrap gap-2">
                  {cat.techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#00e9fa]/30 transition-colors duration-300"
                    >
                      <div>
                        <span className="block font-mono text-xs font-semibold text-white">{tech.name}</span>
                        <span className="block text-[10px] text-gray-500 leading-tight">{tech.role}</span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#00e9fa] bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 rounded px-1.5 py-0.5">
                        {tech.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">{copy.stackNote}</p>
      </div>

      {/* Security & compliance */}
      <div
        data-reveal
        className="stagger-3 bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 backdrop-blur-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={18} className="text-[#00e9fa]" />
              <h3 className="text-base md:text-lg font-semibold text-white">{copy.securityHeading}</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{copy.securityIntro}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/30 text-[#00e9fa] font-mono text-[10px] uppercase tracking-[0.2em]">
              <Lock size={14} />
              {copy.badgeLey}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Selectable list */}
          <div className="lg:col-span-5 space-y-3">
            {copy.controls.map((control, index) => {
              const Icon = control.icon;
              const isSelected = selectedControl === index;
              return (
                <button
                  key={control.id}
                  type="button"
                  onClick={() => setSelectedControl(index)}
                  className={`w-full flex items-center justify-between gap-3 p-4 rounded-lg border text-left transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#00e9fa]/10 border-[#00e9fa]/40 shadow-[0_0_20px_rgba(0,233,250,0.1)]'
                      : 'bg-white/[0.02] border-white/[0.08] hover:border-[#00e9fa]/30'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors duration-300 ${
                        isSelected
                          ? 'bg-[#00e9fa] border-[#00e9fa] text-black'
                          : 'bg-white/[0.02] border-white/[0.08] text-gray-400'
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <span>
                      <span className="block text-xs md:text-sm font-semibold text-white leading-snug">
                        {control.title}
                      </span>
                      <span className="block mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa]">
                        {control.badge}
                      </span>
                    </span>
                  </span>
                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${
                      isSelected ? 'rotate-90 text-[#00e9fa]' : 'text-gray-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-black/40 border border-white/[0.08] rounded-lg p-5 md:p-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa]">
                  {active.badge}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  {copy.panelTag}
                </span>
              </div>

              <h4 className="text-lg md:text-xl font-semibold text-white mb-2">{active.title}</h4>
              <p className="text-sm text-gray-300 font-medium mb-5 leading-relaxed">{active.summary}</p>

              <div className="space-y-3">
                {active.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#00e9fa]" />
                    <span className="text-xs md:text-sm text-gray-400 leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="flex items-center gap-2 font-mono text-[11px] text-gray-500">
                <Server size={15} className="text-[#00e9fa] shrink-0" />
                {copy.sovereignty}
              </span>
              <button type="button" onClick={onOpenPoC} className="xl-btn-primary">
                {copy.cta}
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}