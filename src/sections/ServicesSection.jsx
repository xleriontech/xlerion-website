import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';
import {
  Code, Activity, Target, BookOpen, Cpu, Briefcase, Users, Shield, Wrench,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicesThreeScene from '../components/ServicesThreeScene';

const SERVICE_CATEGORIES = [
  { icon: Code, titleKey: 'services_modular_title', descKey: 'services_modular_desc', to: '/servicios/toolkits' },
  { icon: Activity, titleKey: 'services_diag_title', descKey: 'services_diag_desc', to: '/servicios/diag-log-perf' },
  { icon: Target, titleKey: 'services_brand_title', descKey: 'services_brand_desc', to: '/servicios/branding' },
  { icon: BookOpen, titleKey: 'services_docs_title', descKey: 'services_docs_desc', to: '/servicios/documentacion' },
  { icon: Cpu, titleKey: 'services_3d_title', descKey: 'services_3d_desc', to: '/servicios/integracion-3d' },
  { icon: Briefcase, titleKey: 'services_consul_title', descKey: 'services_consul_desc', to: '/servicios/consultoria-modular' },
]

const ADDITIONAL_SERVICES = [
  { icon: Users, titleKey: 'services_training_title', to: '/servicios/capacitacion' },
  { icon: Shield, titleKey: 'services_support_title', to: '/servicios/soporte-actualizacion' },
  { icon: Wrench, titleKey: 'services_custom_title', to: '/servicios/soluciones-medida' },
]

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="servicios" className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <ServicesThreeScene />
      <div data-reveal>
        <SectionHeader title={t('services_title')} subtitle={t('services_subtitle')} />
      </div>

      <div data-reveal className="max-w-4xl mb-12">
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {t('services_intro')}
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#00e9fa]">
          {t('services_detailed')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
        {SERVICE_CATEGORIES.map((service, i) => (
          <div key={service.to} data-reveal className={`stagger-${i + 1}`}>
            <Link
              to={service.to}
              className="group relative block bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm overflow-hidden card-hover"
            >
              <div className="flex items-center gap-3 mb-3">
                <service.icon className="text-[#00e9fa] group-hover:scale-110 transition-transform duration-300" size={20} />
                <h3 className="text-base font-semibold text-white group-hover:text-[#00e9fa] transition-colors duration-300">
                  {t(service.titleKey)}
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {t(service.descKey)}
              </p>
              <div className="flex items-center gap-2 text-[#00e9fa] text-xs font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                Ver más <ChevronRight size={14} />
              </div>
              <div className="absolute -bottom-3 -right-3 text-[#00e9fa]/[0.03] group-hover:text-[#00e9fa]/[0.06] transition-all duration-500 pointer-events-none">
                <service.icon size={80} />
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div data-reveal className="flex flex-wrap gap-3">
        {ADDITIONAL_SERVICES.map((service) => (
          <Link
            key={service.to}
            to={service.to}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-gray-400 text-xs font-mono uppercase tracking-wider hover:border-[#00e9fa]/20 hover:text-[#00e9fa] hover:bg-[#00e9fa]/5 transition-all duration-300"
          >
            <service.icon size={14} />
            {t(service.titleKey)}
          </Link>
        ))}
      </div>
    </section>
  )
}
