import React from 'react';
import { Cpu, Terminal, Activity, Heart, Radio, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader, LinkCard } from '../components/ui';
import ProjectsThreeScene from '../components/ProjectsThreeScene';

const PROJECTS = [
  { icon: Cpu, titleKey: 'projects_total_darkness', descKey: 'projects_total_darkness_desc', href: '/total-darkness/historia.html' },
  { icon: Terminal, titleKey: 'projects_toolkit', descKey: 'projects_toolkit_desc', to: '/proyectos/toolkit' },
  { icon: Activity, titleKey: 'projects_transit', descKey: 'projects_transit_desc', to: '/proyectos/transito-movilidad' },
  { icon: Heart, titleKey: 'projects_technology', descKey: 'projects_technology_desc', to: '/proyectos/tecnologias-comunidad' },
  { icon: Radio, titleKey: 'projects_radio_nocaima', descKey: 'projects_radio_nocaima_desc', to: '/projects/radio-nocaima-demo' },
  { icon: ShoppingBag, titleKey: 'projects_el_ropero_title', descKey: 'projects_el_ropero_desc', to: '/el-ropero/' },
]

export default function ProjectsSection() {
  const { t } = useLanguage();

  return (
    <section id="proyectos" className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <ProjectsThreeScene />
      <div data-reveal>
        <SectionHeader title={t('projects_title')} subtitle={t('projects_subtitle')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {PROJECTS.map((project, i) => (
          <div key={project.to || project.href} data-reveal className={`stagger-${i + 1}`}>
            <LinkCard title={t(project.titleKey)} icon={project.icon} to={project.to} href={project.href}>
              {t(project.descKey)}
            </LinkCard>
          </div>
        ))}
      </div>
    </section>
  )
}
