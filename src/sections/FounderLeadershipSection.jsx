import React from 'react';
import { Award, ArrowUpRight, Briefcase, CheckCircle2, Code, GraduationCap, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const COPY = {
  es: {
    subtitle: 'Liderazgo Técnico & Founder-Market Fit',
    title: 'Sobre el Fundador',
    intro: 'Xlerion es liderada por Miguel E. Rodríguez, Ingeniero Full-Stack Senior con más de 10 años de experiencia construyendo arquitecturas escalables donde los datos en tiempo real cobran vida en visualización 3D interactiva (Three.js) e integración de IA (RAG/LangChain). Mi trabajo se define por resultados medibles en optimización de pipelines y resiliencia de datos.',
    name: 'Miguel E. Rodriguez Martinez',
    role: 'Senior Full-Stack Engineer & Fundador de Xlerion',
    meta: 'Bogotá, Colombia',
    portraitAlt: 'Retrato de Miguel E. Rodriguez Martinez, Fundador y Arquitecto Principal de Sistemas en Xlerion',
    portraitCaption: 'Bogotá, Colombia • Liderazgo Full-Stack',
    quote: 'Xlerion es liderada por Miguel E. Rodriguez Martinez, Ingeniero Full-Stack Senior con más de 10 años de experiencia construyendo arquitecturas escalables donde los datos en tiempo real cobran vida en visualización 3D interactiva (Three.js) e integración de IA (RAG/LangChain). Mi trabajo se define por resultados medibles en optimización de pipelines y resiliencia de datos.',
    certsLabel: 'Certificaciones',
    certs: [
      {
        id: 'pmp',
        icon: Award,
        title: 'PMP® Project Management Professional',
        issuer: 'PMI',
        year: '2020',
        description: 'Project Management Professional certificado por PMI.',
        tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
      },
      {
        id: 'uci',
        icon: GraduationCap,
        title: 'AI/GenAI Specialization (with Honors)',
        issuer: 'UC Irvine',
        year: '2024',
        description: 'Especialización en IA/GenAI con honores por UC Irvine.',
        tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
      },
      {
        id: 'ibm',
        icon: Shield,
        title: 'AI Developer Professional',
        issuer: 'IBM Watson',
        year: '2018',
        description: 'Desarrollador Profesional de IA certificado por IBM Watson.',
        tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
      },
    ],
    cta: 'Agendar llamada de arquitectura',
  },
  en: {
    subtitle: 'Technical Leadership & Founder-Market Fit',
    title: 'About the Founder',
    intro: 'Xlerion is led by Miguel E. Rodriguez Martinez, Senior Full-Stack Engineer with 10+ years of experience building scalable architectures where real-time data comes alive through interactive 3D visualization (Three.js) and AI integration (RAG/LangChain). My work is defined by measurable results in pipeline optimization and data resilience.',
    name: 'Miguel E. Rodriguez Martinez',
    role: 'Senior Full-Stack Engineer & Founder of Xlerion',
    meta: 'Bogotá, Colombia',
    portraitAlt: 'Portrait of Miguel E. Rodriguez Martinez, Founder and Principal Systems Architect at Xlerion',
    portraitCaption: 'Bogotá, Colombia • Full-Stack Leadership',
    quote: 'Xlerion is led by Miguel E. Rodriguez Martinez, Senior Full-Stack Engineer with 10+ years of experience building scalable architectures where real-time data comes alive through interactive 3D visualization (Three.js) and AI integration (RAG/LangChain). My work is defined by measurable results in pipeline optimization and data resilience.',
    certsLabel: 'Credentials & Certifications',
    certs: [
      {
        id: 'pmp',
        icon: Award,
        title: 'PMP® Project Management Professional',
        issuer: 'PMI',
        year: '2020',
        description: 'Project Management Professional certified by PMI.',
        tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
      },
      {
        id: 'uci',
        icon: GraduationCap,
        title: 'AI/GenAI Specialization (with Honors)',
        issuer: 'UC Irvine',
        year: '2024',
        description: 'AI/GenAI Specialization with Honors from UC Irvine.',
        tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
      },
      {
        id: 'ibm',
        icon: Shield,
        title: 'AI Developer Professional',
        issuer: 'IBM Watson',
        year: '2018',
        description: 'AI Developer Professional certified by IBM Watson.',
        tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
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

      <p data-reveal className="stagger-1 max-w-3xl -mt-6 mb-12 text-sm md:text-base text-gray-400 leading-relaxed font-sans">
        {c.intro}
      </p>

      <div data-reveal className="stagger-2 bg-[#1a1a12]/80 border border-[#2a2a2a] rounded-lg p-6 md:p-10 backdrop-blur-sm">
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

            <h3 className="mt-6 text-2xl font-bold text-white">{c.name}</h3>
            <p className="mt-1 font-semibold text-[#00e9fa]">{c.role}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-mono text-gray-400">
              <MapPin size={13} className="text-[#00e9fa]" />
              {c.meta}
            </p>
          </div>

          {/* Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-[#1a1a12]/80 border border-[#00e9fa]/20 rounded-lg">
              <h4 className="font-semibold text-[#00e9fa] mb-2">Certificaciones</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {c.certs.map((cert) => {
                  const Icon = cert.icon;
                  return (
                    <div key={cert.id} className={`p-4 rounded-lg border ${cert.tone}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className="shrink-0" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] leading-tight">
                          {cert.issuer} ({cert.year})
                        </span>
                      </div>
                      <span className="block text-xs font-semibold text-white leading-snug">
                        {cert.title}
                      </span>
                    </div>
                  );
                })}
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