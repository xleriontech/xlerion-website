import React from 'react';
import { Award, ArrowUpRight, Briefcase, CheckCircle2, Code, GraduationCap, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const COPY = {
  es: {
    subtitle: 'Liderazgo Técnico & Founder-Market Fit',
    title: 'Ingeniería Dirigida por Experiencia y Rigor',
    intro:
      'En Xlerion no delegamos la arquitectura en intermediarios comerciales. Cada proyecto es diseñado y supervisado directamente por liderazgo técnico senior con experiencia comprobada en sistemas distribuidos críticos.',
    name: 'Miguel E. Rodríguez',
    role: 'Founder & Principal Systems Architect',
    meta: 'Bogotá, Colombia · +10 años de experiencia',
    portraitAlt:
      'Retrato de Miguel E. Rodríguez, Fundador y Arquitecto Principal de Sistemas en Xlerion',
    portraitCaption: 'Bogotá, Colombia · Liderazgo Full-Stack',
    quote:
      'Xlerion es liderada por Miguel E. Rodríguez, Ingeniero Full-Stack Senior con más de 10 años de experiencia. Certificado PMP® (PMI) y Especialista en IA/GenAI por UC Irvine. Nuestra metodología combina rigor en gestión de proyectos con arquitectura de software de vanguardia.',
    certsLabel: 'Credenciales y Certificaciones',
    certs: [
      {
        id: 'pmp',
        icon: Award,
        title: 'PMP® — Project Management Professional',
        issuer: 'Project Management Institute (PMI®)',
        code: 'Credential ID #291048',
        description: 'Gobernanza rigurosa de proyectos: previsibilidad de cronogramas y mitigación de riesgos.',
        tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
      },
      {
        id: 'uci',
        icon: GraduationCap,
        title: 'Especialista en IA & GenAI',
        issuer: 'University of California, Irvine',
        code: 'Postgraduate Specialization',
        description: 'Arquitecturas RAG avanzadas, modelos generativos y optimización de latencia de inferencia.',
        tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
      },
      {
        id: 'ibm',
        icon: Shield,
        title: 'Enterprise AI Architecture',
        issuer: 'IBM Cloud & Cognitive',
        code: 'Professional Credential',
        description: 'Pipelines de datos masivos, gobierno de modelos y despliegues de alta criticidad.',
        tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
      },
    ],
    pillarsLabel: 'Compromisos de Entrega con Directores de TI',
    pillars: [
      {
        title: 'Gobernanza PMP®',
        description:
          'Hitos medibles, presupuesto cerrado y trazabilidad de requerimientos. Sin sorpresas de sobrecostos ni entregas diferidas.',
      },
      {
        title: 'PoC en 3 a 4 semanas',
        description:
          'Antes de comprometer a escala completa, entregamos una Prueba de Concepto funcional integrada con datos reales de planta.',
      },
      {
        title: 'IP y Código 100% del Cliente',
        description:
          'Entregamos repositorios limpios y documentados, sin tarifas ocultas de licenciamiento recurrente por nodo o dispositivo.',
      },
    ],
    cta: 'Agendar llamada de arquitectura',
  },
  en: {
    subtitle: 'Technical Leadership & Founder-Market Fit',
    title: 'Engineering Driven by Experience and Rigor',
    intro:
      'At Xlerion we do not delegate architecture to commercial intermediaries. Every project is designed and supervised directly by senior technical leadership with proven experience in critical distributed systems.',
    name: 'Miguel E. Rodríguez',
    role: 'Founder & Principal Systems Architect',
    meta: 'Bogotá, Colombia · 10+ years of experience',
    portraitAlt:
      'Portrait of Miguel E. Rodríguez, Founder and Principal Systems Architect at Xlerion',
    portraitCaption: 'Bogotá, Colombia · Full-Stack Leadership',
    quote:
      'Xlerion is led by Miguel E. Rodríguez, a Senior Full-Stack Engineer with more than 10 years of experience. PMP® certified (PMI) and AI/GenAI Specialist from UC Irvine. Our methodology combines project management rigor with state-of-the-art software architecture.',
    certsLabel: 'Credentials and Certifications',
    certs: [
      {
        id: 'pmp',
        icon: Award,
        title: 'PMP® — Project Management Professional',
        issuer: 'Project Management Institute (PMI®)',
        code: 'Credential ID #291048',
        description: 'Rigorous project governance: schedule predictability and risk mitigation.',
        tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
      },
      {
        id: 'uci',
        icon: GraduationCap,
        title: 'AI & GenAI Specialist',
        issuer: 'University of California, Irvine',
        code: 'Postgraduate Specialization',
        description: 'Advanced RAG architectures, generative models and inference latency optimization.',
        tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
      },
      {
        id: 'ibm',
        icon: Shield,
        title: 'Enterprise AI Architecture',
        issuer: 'IBM Cloud & Cognitive',
        code: 'Professional Credential',
        description: 'Massive data pipelines, model governance and high-criticality deployments.',
        tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
      },
    ],
    pillarsLabel: 'Delivery Commitments to IT Directors',
    pillars: [
      {
        title: 'PMP® Governance',
        description:
          'Measurable milestones, closed budget and requirement traceability. No cost-overrun surprises or deferred deliveries.',
      },
      {
        title: 'PoC in 3 to 4 weeks',
        description:
          'Before committing at full scale, we deliver a working Proof of Concept integrated with real plant data.',
      },
      {
        title: 'IP & Code 100% Yours',
        description:
          'We hand over clean, documented repositories with no hidden recurring per-node or per-device licensing fees.',
      },
    ],
    cta: 'Schedule an architecture call',
  },
};

export default function FounderLeadershipSection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  return (
    <section
      id="liderazgo"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={c.title} subtitle={c.subtitle} />
      </div>

      <p
        data-reveal
        className="stagger-1 max-w-3xl -mt-6 mb-12 text-sm md:text-base text-gray-400 leading-relaxed font-sans"
      >
        {c.intro}
      </p>

      <div
        data-reveal
        className="stagger-2 bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-6 md:p-10 backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-lg overflow-hidden border border-[#00e9fa]/40 shadow-[0_0_30px_rgba(0,233,250,0.18)] glow-on-hover">
              <img
                src="/images/deeptech/founder.jpg"
                alt={c.portraitAlt}
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/85 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded bg-black/70 border border-[#00e9fa]/20 font-mono text-[9px] uppercase tracking-[0.2em] text-[#00e9fa] backdrop-blur-sm">
                {c.portraitCaption}
              </span>
            </div>

            <h3 className="mt-6 text-xl md:text-2xl font-semibold text-white">{c.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-[#00e9fa]">{c.role}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-mono text-gray-500">
              <MapPin size={13} className="text-[#00e9fa]" />
              {c.meta}
            </p>
          </div>

          {/* Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-lg bg-white/[0.02] border border-[#00e9fa]/20">
              <p className="text-sm md:text-base italic text-gray-300 leading-relaxed">&ldquo;{c.quote}&rdquo;</p>
            </div>

            {/* Certifications */}
            <div>
              <span className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <Award size={14} className="text-[#00e9fa]" />
                {c.certsLabel}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {c.certs.map((cert) => {
                  const Icon = cert.icon;
                  return (
                    <div
                      key={cert.id}
                      className={`flex flex-col justify-between p-4 rounded-lg border ${cert.tone}`}
                    >
                      <div>
                        <span className="flex items-center gap-2 mb-2">
                          <Icon size={16} className="shrink-0" />
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] leading-tight">
                            {cert.issuer}
                          </span>
                        </span>
                        <span className="block text-xs font-semibold text-white leading-snug">
                          {cert.title}
                        </span>
                      </div>
                      <span className="block mt-3 font-mono text-[9px] uppercase tracking-widest opacity-80">
                        {cert.code}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery pillars */}
            <div>
              <span className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <Code size={14} className="text-[#00e9fa]" />
                {c.pillarsLabel}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {c.pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08]"
                  >
                    <span className="flex items-center gap-2 mb-2 text-xs font-semibold text-white">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      {pillar.title}
                    </span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button type="button" onClick={onOpenPoC} className="xl-btn-primary">
                <Briefcase size={16} />
                {c.cta}
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
