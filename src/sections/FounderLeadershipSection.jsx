import React from 'react';
import { Award, GraduationCap, Shield, MapPin, Briefcase, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const FOUNDER_ES = {
  subtitle: 'Sobre el Fundador',
  title: 'Liderazgo Técnico y Founder-Market Fit',
  intro: 'Xlerion es liderada por Miguel E. Rodriguez Martinez, Ingeniero Full-Stack Senior con más de 10 años de experiencia diseñando arquitecturas donde los datos en tiempo real cobran vida. Mi enfoque no es solo entregar código, sino garantizar la resiliencia de los datos, la optimización de pipelines y la alineación estratégica del proyecto con los objetivos de negocio.',
  name: 'Miguel E. Rodriguez Martinez',
  role: 'Fundador & Lead Technical Architect',
  location: 'Bogotá, Colombia (Disponible para despliegues nacionales y trabajo remoto global)',
  certsLabel: 'Credenciales Clave',
  certs: [
    {
      icon: Award,
      title: 'PMP® Project Management Professional (PMI, 2020)',
      tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
    },
    {
      icon: GraduationCap,
      title: 'AI/GenAI Specialization with Honors (UC Irvine, 2024)',
      tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
    },
    {
      icon: Shield,
      title: 'AI Developer Professional (IBM Watson, 2018)',
      tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
    },
  ],
  cta: 'Solicitar Evaluación Técnica y PoC',
};

const FOUNDER_EN = {
  subtitle: 'About the Founder',
  title: 'Technical Leadership and Founder-Market Fit',
  intro: 'Xlerion is led by Miguel E. Rodriguez Martinez, Senior Full-Stack Engineer with over 10 years of experience designing architectures where real-time data comes alive. My focus is not just delivering code, but ensuring data resilience, pipeline optimization, and strategic alignment of the project with business objectives.',
  name: 'Miguel E. Rodriguez Martinez',
  role: 'Founder & Lead Technical Architect',
  location: 'Bogotá, Colombia (Available for national deployments and global remote work)',
  certsLabel: 'Key Credentials',
  certs: [
    {
      icon: Award,
      title: 'PMP® Project Management Professional (PMI, 2020)',
      tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
    },
    {
      icon: GraduationCap,
      title: 'AI/GenAI Specialization with Honors (UC Irvine, 2024)',
      tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
    },
    {
      icon: Shield,
      title: 'AI Developer Professional (IBM Watson, 2018)',
      tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
    },
  ],
  cta: 'Request Technical Evaluation and PoC',
};

export default function FounderLeadershipSection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const c = lang === 'en' ? FOUNDER_EN : FOUNDER_ES;

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
                alt="Retrato del fundador"
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/85 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded bg-black/70 border border-[#00e9fa]/20 font-mono text-[9px] uppercase tracking-[0.2em] text-[#00e9fa] backdrop-blur-sm">
                {c.location}
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">{c.name}</h3>
            <p className="mt-1 font-semibold text-[#00e9fa]">{c.role}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-mono text-gray-400">
              <MapPin size={13} className="text-[#00e9fa]" />
              {c.location}
            </p>
          </div>

          {/* Narrative + Credentials */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-[#1a1a12]/80 border border-[#00e9fa]/20 rounded-lg">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa] mb-3">{c.certsLabel}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {c.certs.map((cert, index) => {
                  const Icon = cert.icon;
                  return (
                    <div key={cert.title} className={`p-4 rounded-lg border ${cert.tone}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className="shrink-0" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] leading-tight">
                          {index + 1}
                        </span>
                      </div>
                      <span className="block text-xs font-semibold text-white leading-snug">{cert.title}</span>
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