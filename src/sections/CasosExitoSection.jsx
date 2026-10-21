import React from 'react';
import {
  ArrowUpRight,
  TreePine,
  Sprout,
  ShoppingBag,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const COPY = {
  es: {
    subtitle: 'Proyectos desplegados y operativos, construidos y entregados por Xlerion.',
    title: 'Casos de Éxito en Producción',
    intro: 'Tres plataformas reales, en línea y con usuarios, que validan la capacidad de Xlerion para diseñar, construir y poner en producción productos digitales completos.',
    liveLabel: 'Ver proyecto en vivo',
    locationLabel: 'Ubicación',
    stackLabel: 'Stack Tecnológico',
    impactLabel: 'Impacto',
  },
  en: {
    subtitle: 'Deployed and operational projects, built and delivered by Xlerion.',
    title: 'Production Case Studies',
    intro: 'Three real platforms, live and with users, that validate Xlerion’s capacity to design, build and ship complete digital products.',
    liveLabel: 'View live project',
    locationLabel: 'Location',
    stackLabel: 'Technology Stack',
    impactLabel: 'Impact',
  },
};

const CASES_ES = [
  {
    id: 'tropical-biohostel',
    icon: TreePine,
    category: 'Turismo & Agro',
    title: 'Tropical Biohostel',
    tagline: 'Plataforma de turismo experiencial y hospedaje rural con buscador inteligente y Cosmic Bungalow 3D.',
    description:
      'Sitio web de destino turístico y hospedaje rural en Nocaima, Cundinamarca. Incluye buscador inteligente (Zemisqua), catálogo por categorías (hostales, glamping, actividades, restaurantes, fincas), fichas de propiedad y experiencia de Cosmic Bungalow con visualización 3D.',
    url: 'https://tropicalbiohostel.pages.dev/',
    location: 'Nocaima, Cundinamarca',
    metrics: [
      { value: '30%', label: 'Bosque nativo' },
      { value: '~400', label: 'Plantas de café' },
      { value: '10 min', label: 'Del casco urbano' },
    ],
    techStack: 'React · Three.js · Búsqueda inteligente · Cloudflare Pages',
    impact:
      'Plataforma de turismo completa en producción: reserva de hospedaje, catálogo por categorías, gastronomía de la finca y bienestar (Yoga, Tai Chi, Chi Kung).',
  },
  {
    id: 'alma-semilla',
    icon: Sprout,
    category: 'ONG · Agro-TIC',
    title: 'Fundación Alma y Semilla',
    tagline: 'Etnotecnología y saberes ancestrales 5.0: RAG con IA, Realidad Virtual e IoT para el patrimonio inmaterial.',
    description:
      'Sitio institucional y repositorio vivo para una ESAL de Chía, Cundinamarca. Asistente etnográfico con IA (RAG sobre LangChain y pgvector), recorridos de Realidad Virtual y 360° (Three.js / WebXR) e IoT para biocultura (LoRaWAN). Vectorización ética con 3 niveles de acceso y trazabilidad de autoría conforme al Convenio 169 OIT.',
    url: 'https://alma-semilla.xlerionultimate.workers.dev/',
    location: 'Chía, Cundinamarca',
    metrics: [
      { value: '1.200+', label: 'Niños, niñas y jóvenes' },
      { value: '38', label: 'Huertas escolares' },
      { value: '140', label: 'Mujeres en emprendimientos' },
    ],
    techStack: 'LangChain · pgvector · Three.js / WebXR · LoRaWAN IoT · Cloudflare Workers',
    impact:
      'Puente tecnológico entre saberes ancestrales y la Cuarta Revolución Industrial: conocimiento documentado, trazable y respetuoso de las autoridades comunitarias.',
  },
  {
    id: 'el-ropero-magco',
    icon: ShoppingBag,
    category: 'E-commerce · Moda circular',
    title: 'El Ropero Mag&co',
    tagline: 'Tienda de moda circular con catálogo curado, drops, probador virtual 3D y pagos en línea.',
    description:
      'Plataforma e-commerce de ropa y accesorios de segunda mano, curados pieza por pieza en Bogotá. Catálogo, calendario de drops, probador virtual 3D, carrito y pasarela de pagos (Wompi / Bancolombia, PSE, Nequi, Daviplata, tarjeta y contra entrega).',
    url: 'https://elropero-magico-platform.xlerionultimate.workers.dev/',
    location: 'Chapinero, Bogotá',
    metrics: [
      { value: '+36M', label: 'Litros de agua ahorrados' },
      { value: '23', label: 'Puntos de revisión por prenda' },
      { value: 'Mismo día', label: 'Envío en Bogotá' },
    ],
    techStack: 'Three.js (probador virtual 3D) · E-commerce · Wompi / Bancolombia · Cloudflare Workers',
    impact:
      'Comercio electrónico de moda circular operando en producción: cada pieza única, revisada y medida, con venta y envío nacional.',
  },
];

const CASES_EN = [
  {
    id: 'tropical-biohostel',
    icon: TreePine,
    category: 'Tourism & Agro',
    title: 'Tropical Biohostel',
    tagline: 'Experiential tourism and rural lodging platform with smart search and Cosmic Bungalow 3D.',
    description:
      'Tourism destination and rural lodging website in Nocaima, Cundinamarca. Includes smart search (Zemisqua), category catalog (hostels, glamping, activities, restaurants, farms), property listings and a Cosmic Bungalow experience with 3D visualization.',
    url: 'https://tropicalbiohostel.pages.dev/',
    location: 'Nocaima, Cundinamarca',
    metrics: [
      { value: '30%', label: 'Native forest' },
      { value: '~400', label: 'Coffee plants' },
      { value: '10 min', label: 'From town center' },
    ],
    techStack: 'React · Three.js · Smart search · Cloudflare Pages',
    impact:
      'Complete tourism platform in production: lodging booking, category catalog, farm gastronomy and wellness (Yoga, Tai Chi, Chi Kung).',
  },
  {
    id: 'alma-semilla',
    icon: Sprout,
    category: 'NGO · Agro-TIC',
    title: 'Alma y Semilla Foundation',
    tagline: 'Ethnotechnology and ancestral knowledge 5.0: AI RAG, Virtual Reality and IoT for intangible heritage.',
    description:
      'Institutional website and living repository for an ESAL in Chía, Cundinamarca. Ethnographic assistant with AI (RAG over LangChain and pgvector), Virtual Reality and 360° tours (Three.js / WebXR) and IoT for bioculture (LoRaWAN). Ethical vectorization with 3 access levels and authorship traceability under ILO Convention 169.',
    url: 'https://alma-semilla.xlerionultimate.workers.dev/',
    location: 'Chía, Cundinamarca',
    metrics: [
      { value: '1,200+', label: 'Children and youth' },
      { value: '38', label: 'School gardens' },
      { value: '140', label: 'Women in solidarity ventures' },
    ],
    techStack: 'LangChain · pgvector · Three.js / WebXR · LoRaWAN IoT · Cloudflare Workers',
    impact:
      'Technological bridge between ancestral knowledge and the Fourth Industrial Revolution: documented, traceable knowledge respectful of community authorities.',
  },
  {
    id: 'el-ropero-magco',
    icon: ShoppingBag,
    category: 'E-commerce · Circular fashion',
    title: 'El Ropero Mag&co',
    tagline: 'Circular fashion store with curated catalog, drops, 3D virtual try-on and online payments.',
    description:
      'Second-hand clothing and accessories e-commerce platform, curated piece by piece in Bogotá. Catalog, drops calendar, 3D virtual try-on, cart and payment gateway (Wompi / Bancolombia, PSE, Nequi, Daviplata, card and cash on delivery).',
    url: 'https://elropero-magico-platform.xlerionultimate.workers.dev/',
    location: 'Chapinero, Bogotá',
    metrics: [
      { value: '+36M', label: 'Liters of water saved' },
      { value: '23', label: 'Review points per garment' },
      { value: 'Same day', label: 'Bogotá shipping' },
    ],
    techStack: 'Three.js (3D virtual try-on) · E-commerce · Wompi / Bancolombia · Cloudflare Workers',
    impact:
      'Circular fashion e-commerce operating in production: each unique piece reviewed and measured, with nationwide sales and shipping.',
  },
];

export default function CasosExitoSection() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;
  const cases = lang === 'en' ? CASES_EN : CASES_ES;

  return (
    <section
      id="casos"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[320px] bg-[#00e9fa]/[0.03] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative">
        <div data-reveal>
          <SectionHeader title={c.title} subtitle={c.subtitle} />
        </div>

        <p
          data-reveal
          className="stagger-1 max-w-3xl -mt-6 mb-12 text-sm md:text-base text-gray-400 leading-relaxed font-sans"
        >
          {c.intro}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cases.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                data-reveal
                className={`stagger-${index + 1} group relative flex flex-col bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-7 backdrop-blur-sm card-hover`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[#00e9fa]" />
                  </div>
                  <span className="px-3 py-1 rounded bg-black/60 border border-[#00e9fa]/20 font-mono text-[9px] uppercase tracking-[0.2em] text-[#00e9fa]">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#00e9fa] font-medium mb-3">{item.tagline}</p>
                <p className="text-sm text-gray-400 leading-relaxed mb-5">{item.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {item.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg bg-white/[0.02] border border-white/[0.08] p-2.5 text-center"
                    >
                      <span className="block font-mono text-sm font-bold text-[#00e9fa]">{m.value}</span>
                      <span className="block text-[9px] text-gray-500 uppercase tracking-[0.1em] mt-0.5">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stack */}
                <div className="rounded-lg border border-[#00e9fa]/15 bg-black/40 px-3 py-3 mb-5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1.5">
                    {c.stackLabel}
                  </p>
                  <p className="text-[11px] text-white leading-relaxed">{item.techStack}</p>
                </div>

                {/* Impact */}
                <p className="text-[11px] text-gray-400 leading-relaxed mb-6">
                  <span className="text-[#00e9fa] font-mono uppercase tracking-[0.15em] text-[9px] block mb-1">
                    {c.impactLabel}
                  </span>
                  {item.impact}
                </p>

                {/* Location + CTA */}
                <div className="mt-auto pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                    <MapPin size={12} className="text-[#00e9fa]/60" />
                    {item.location}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00e9fa] text-black font-semibold text-xs hover:bg-[#00b8c9] hover:shadow-[0_0_20px_rgba(0,233,250,0.3)] transition-all duration-300"
                  >
                    <ExternalLink size={13} />
                    {c.liveLabel}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}