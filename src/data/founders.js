/**
 * Perfiles de los fundadores de Xlerion.
 *
 * Fuente de verdad para la sección "Sobre los Fundadores" del sitio.
 * Refleja public/cards/founders-data.js (tarjetas digitales): si cambian
 * nombre, cargo, ubicación o mensaje, se actualizan los dos archivos.
 *
 * REGLA: NO inventar copy. Todo el texto proviene del briefing del cliente
 * (ver public/cards/founders-data.js y las secciones de certificaciones
 * de src/pages/FounderPage.jsx).
 *
 * Cada campo de texto existe en dos idiomas: { es, en }.
 */

export const FOUNDER_SECTION = {
  es: {
    subtitle: 'Sobre los Fundadores',
    title: 'Liderazgo Técnico y de Negocio',
    intro:
      'Xlerion está liderada por dos co-fundadores. Miguel E. Rodriguez Martinez, Ingeniero Full-Stack Senior, diseña las arquitecturas donde los datos en tiempo real cobran vida y garantiza la resiliencia de los datos, la optimización de pipelines y la alineación técnica del proyecto con los objetivos de negocio. Juliette González, Co-Founder & Business Strategy, lidera la viabilidad comercial, el sourcing estratégico y la escalabilidad de los modelos, para que cada PoC llegue a producción de forma defendible en costos.',
    cta: 'Solicitar Evaluación Técnica y PoC',
    ctaHint: 'Evaluación técnica y comercial',
  },
  en: {
    subtitle: 'About the Founders',
    title: 'Technical and Business Leadership',
    intro:
      'Xlerion is led by two co-founders. Miguel E. Rodriguez Martinez, Senior Full-Stack Engineer, designs the architectures where real-time data comes alive and ensures data resilience, pipeline optimization, and technical alignment of the project with business objectives. Juliette González, Co-Founder & Business Strategy, leads commercial viability, strategic sourcing, and model scalability, so every PoC reaches production in a cost-defensible way.',
    cta: 'Request Technical Evaluation and PoC',
    ctaHint: 'Joint technical and commercial evaluation',
  },
};

/**
 * Los dos fundadores, en el orden en que aparecen en la sección.
 *
 * - focus: los 3 items de cada uno (credenciales / valor de negocio).
 * - links: acciones secundarias; las internas usan react-router Link.
 */
export const FOUNDERS = [
  {
    id: 'miguel',
    index: '01',
    name: 'Miguel E. Rodriguez Martinez',
    role: {
      es: 'Fundador & Lead Technical Architect',
      en: 'Founder & Lead Technical Architect',
    },
    tagline: {
      es: 'Arquitecturas 3D en tiempo real · IA Generativa RAG · IoT Industrial · Resiliencia de datos.',
      en: 'Real-time 3D architectures · Generative AI RAG · Industrial IoT · Data resilience.',
    },
    location: {
      es: 'Bogotá, Colombia',
      en: 'Bogotá, Colombia',
    },
    availability: {
      es: 'Disponible para despliegues nacionales y trabajo remoto global',
      en: 'Available for national deployments and global remote work',
    },
    status: {
      es: 'Disponible para proyectos',
      en: 'Available for projects',
    },
    photo: '/images/deeptech/founder.jpg',
    photoAlt: {
      es: 'Retrato de Miguel E. Rodriguez Martinez',
      en: 'Portrait of Miguel E. Rodriguez Martinez',
    },
    // Las fotos son cuadradas: el encuadre se hace con zoom, no con
    // object-position (que no tendría efecto sobre un recorte cuadrado).
    photoZoom: 1.5,
    photoOrigin: '58% 22%',
    focusLabel: {
      es: 'Credenciales Clave',
      en: 'Key Credentials',
    },
    focus: [
      {
        icon: 'award',
        title: 'PMP® Project Management Professional (PMI, 2020)',
        desc: {
          es: 'Project Management Professional certificado por PMI.',
          en: 'Project Management Professional certified by PMI.',
        },
      },
      {
        icon: 'graduation',
        title: 'AI/GenAI Specialization with Honors (UC Irvine, 2024)',
        desc: {
          es: 'Especialización en IA/GenAI con honores por UC Irvine.',
          en: 'AI/GenAI Specialization with Honors from UC Irvine.',
        },
      },
      {
        icon: 'shield',
        title: 'AI Developer Professional (IBM Watson, 2018)',
        desc: {
          es: 'Desarrollador Profesional de IA certificado por IBM Watson.',
          en: 'AI Developer Professional certified by IBM Watson.',
        },
      },
    ],
    links: [
      {
        icon: 'user',
        label: { es: 'Ver perfil', en: 'View profile' },
        href: '/fundador',
        internal: true,
      },
      {
        icon: 'card',
        label: { es: 'Tarjeta digital', en: 'Digital card' },
        href: '/mike',
        internal: true,
      },
      {
        icon: 'linkedin',
        label: { es: 'LinkedIn', en: 'LinkedIn' },
        href: 'https://www.linkedin.com/in/mikerodriguez84',
      },
    ],
  },
  {
    id: 'juliette',
    index: '02',
    name: 'Juliette González',
    role: {
      es: 'Co-Founder & Business Strategy',
      en: 'Co-Founder & Business Strategy',
    },
    tagline: {
      es: 'Viabilidad comercial · Alianzas estratégicas · Escalabilidad y confianza para ecosistemas DeepTech en LATAM.',
      en: 'Commercial viability · Strategic alliances · Scalability and trust for DeepTech ecosystems in LATAM.',
    },
    location: {
      es: 'Chía, Cundinamarca, Colombia',
      en: 'Chía, Cundinamarca, Colombia',
    },
    availability: {
      es: 'Alianzas y sourcing para ecosistemas DeepTech en LATAM',
      en: 'Alliances and sourcing for DeepTech ecosystems in LATAM',
    },
    status: {
      es: 'Alianzas abiertas',
      en: 'Open alliances',
    },
    photo: '/images/juliette-vcard.jpg',
    photoAlt: {
      es: 'Retrato de Juliette González',
      en: 'Portrait of Juliette González',
    },
    photoZoom: 1.12,
    photoOrigin: '58% 20%',
    focusLabel: {
      es: 'Valor de Negocio',
      en: 'Business Value',
    },
    focus: [
      {
        icon: 'coins',
        title: 'Optimización de Costos',
        titleEn: 'Cost Optimization',
        desc: {
          es: 'Eficiencia operativa en sourcing y contratación tecnológica.',
          en: 'Operational efficiency in sourcing and technology hiring.',
        },
      },
      {
        icon: 'users',
        title: 'Sourcing Estratégico',
        titleEn: 'Strategic Sourcing',
        desc: {
          es: 'Red de talento y partners de hardware/software en la región.',
          en: 'Talent network and hardware/software partners across the region.',
        },
      },
      {
        icon: 'rocket',
        title: 'Escalabilidad de Modelos',
        titleEn: 'Model Scalability',
        desc: {
          es: 'Del PoC a la producción empresarial defendible en costos.',
          en: 'From PoC to cost-defensible enterprise production.',
        },
      },
    ],
    links: [
      {
        icon: 'card',
        label: { es: 'Tarjeta digital', en: 'Digital card' },
        href: '/juliette',
        internal: true,
      },
      {
        icon: 'calendar',
        label: { es: 'Explorar alianzas', en: 'Explore alliances' },
        href: 'https://calendly.com/juliettexlerion',
      },
      {
        icon: 'linkedin',
        label: { es: 'LinkedIn', en: 'LinkedIn' },
        href: 'https://www.linkedin.com/in/juliette-gt/',
      },
    ],
  },
];
