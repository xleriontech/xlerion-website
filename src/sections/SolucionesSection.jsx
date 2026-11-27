import React from 'react';
import { Monitor, Database, Activity, Gamepad2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';
import { FadeUp } from '../components/TextReveal';

const SOLUTIONS_ES = [
  {
    id: 'smartfactory',
    number: '01',
    icon: Monitor,
    title: 'Gemelos Digitales 3D',
    subtitle: 'SmartFactory',
    desc: 'Una réplica digital de su máquina, planta o proceso que se ve en el navegador y se actualiza con datos reales.',
    idealFor: 'Manufactura, minería, energía, operaciones con activos críticos.',
    benefits: [
      'Ver el estado de equipos y procesos en tiempo real, sin estar en sitio.',
      'Detectar anomalías antes de que se vuelvan paradas costosas.',
      'Entrenar personal y simular cambios sin riesgo operativo.',
    ],
    deliverables: 'Modelo 3D navegable, conexión a datos/sensores, panel de alertas y entrenamiento inicial.',
    metrics: [
      { label: 'Actualización de datos', value: 'Tiempo real' },
      { label: 'Visualización 3D', value: 'En navegador' },
      { label: 'Detección temprana', value: 'Alertas' },
    ],
    cta: 'Solicitar PoC',
  },
  {
    id: 'enterprise-rag',
    number: '02',
    icon: Database,
    title: 'Asistentes IA Empresariales',
    subtitle: 'RAG / Knowledge AI',
    desc: 'Un asistente que responde preguntas usando los documentos internos de su empresa, con trazabilidad de la fuente.',
    idealFor: 'Equipos legales, operaciones, soporte técnico, cumplimiento y gestión documental.',
    benefits: [
      'Encontrar respuestas en manuales, políticas y contratos en segundos.',
      'Reducir errores por información desactualizada o dispersa.',
      'Controlar acceso por roles y saber de qué documento salió cada respuesta.',
    ],
    deliverables: 'Asistente privado, ingestión de documentos, permisos por rol y panel de uso.',
    metrics: [
      { label: 'Respuestas con fuente', value: 'Trazables' },
      { label: 'Búsqueda', value: 'Lenguaje natural' },
      { label: 'Despliegue', value: 'Privado/Cloud' },
    ],
    cta: 'Solicitar diagnóstico',
  },
  {
    id: 'iot-resilient',
    number: '03',
    icon: Activity,
    title: 'Telemetría IoT Resiliente',
    subtitle: 'Operación en campo',
    desc: 'Captura y resguarda datos de sensores incluso cuando la conectividad es inestable, para que la operación no pierda información.',
    idealFor: 'Campo, agroindustria, logística, plantas remotas y monitoreo ambiental.',
    benefits: [
      'No perder datos cuando falla internet o la red móvil.',
      'Sincronizar automáticamente cuando vuelve la conectividad.',
      'Tener información confiable para mantenimiento y decisiones operativas.',
    ],
    deliverables: 'Gateway/edge, buffering local, sincronización segura y tablero de estado.',
    metrics: [
      { label: 'Continuidad', value: 'Sin pérdida' },
      { label: 'Conectividad', value: 'Intermitente OK' },
      { label: 'Sincronización', value: 'Automática' },
    ],
    cta: 'Evaluar mi operación',
  },
  {
    id: 'advisory',
    number: '04',
    icon: Briefcase,
    title: 'Xlerion Advisory',
    subtitle: 'Estructuración Corporativa Integral',
    desc: 'Acompañamiento para convertir una idea en una empresa formal, operable y tecnológicamente competitiva.',
    idealFor: 'Emprendedores, empresas nuevas, PyMEs y equipos que necesitan formalizar y lanzar con orden.',
    benefits: [
      'Salir con empresa, marca y base tecnológica listas para operar.',
      'Reducir riesgos legales y técnicos desde el inicio.',
      'Tomar decisiones con acompañamiento directo de los fundadores de Xlerion.',
    ],
    deliverables: 'Ruta legal, identidad corporativa, MVP/plataforma y plan de cumplimiento.',
    phases: [
      { title: 'Estructuración Legal', detail: 'Constitución S.A.S., estatutos, Cámara de Comercio, RUT y marca ante la SIC.' },
      { title: 'Arquitectura de Identidad', detail: 'Naming, identidad visual, manual de marca y posicionamiento B2B.' },
      { title: 'Habilitación Tecnológica', detail: 'MVP, plataforma web, cloud, ISO 27001 y Ley 1581.' },
    ],
    timeline: 'Programa de 60 a 90 días',
    cta: 'Solicitar Xlerion Advisory',
  },
];

const SOLUTIONS_EN = [
  {
    id: 'smartfactory',
    number: '01',
    icon: Monitor,
    title: '3D Digital Twins',
    subtitle: 'SmartFactory',
    desc: 'A digital replica of your machine, plant, or process that runs in the browser and updates with real data.',
    idealFor: 'Manufacturing, mining, energy, and critical-asset operations.',
    benefits: [
      'See equipment and process status in real time, without being on site.',
      'Detect anomalies before they become costly downtime.',
      'Train staff and simulate changes with no operational risk.',
    ],
    deliverables: 'Navigable 3D model, data/sensor connection, alert panel, and onboarding.',
    metrics: [
      { label: 'Data updates', value: 'Real time' },
      { label: '3D visualization', value: 'In browser' },
      { label: 'Early detection', value: 'Alerts' },
    ],
    cta: 'Request a PoC',
  },
  {
    id: 'enterprise-rag',
    number: '02',
    icon: Database,
    title: 'Enterprise AI Assistants',
    subtitle: 'RAG / Knowledge AI',
    desc: 'An assistant that answers questions using your company’s internal documents, with source traceability.',
    idealFor: 'Legal, operations, technical support, compliance, and document-heavy teams.',
    benefits: [
      'Find answers in manuals, policies, and contracts in seconds.',
      'Reduce errors caused by outdated or scattered information.',
      'Control access by role and see which document each answer came from.',
    ],
    deliverables: 'Private assistant, document ingestion, role permissions, and usage dashboard.',
    metrics: [
      { label: 'Source-backed answers', value: 'Traceable' },
      { label: 'Search', value: 'Natural language' },
      { label: 'Deployment', value: 'Private/Cloud' },
    ],
    cta: 'Request assessment',
  },
  {
    id: 'iot-resilient',
    number: '03',
    icon: Activity,
    title: 'Resilient IoT Telemetry',
    subtitle: 'Field operations',
    desc: 'Captures and preserves sensor data even when connectivity is unstable, so operations don’t lose information.',
    idealFor: 'Field operations, agribusiness, logistics, remote plants, and environmental monitoring.',
    benefits: [
      'Avoid data loss when internet or mobile networks fail.',
      'Sync automatically when connectivity returns.',
      'Get reliable data for maintenance and operational decisions.',
    ],
    deliverables: 'Edge gateway, local buffering, secure sync, and status dashboard.',
    metrics: [
      { label: 'Continuity', value: 'No data loss' },
      { label: 'Connectivity', value: 'Intermittent OK' },
      { label: 'Sync', value: 'Automatic' },
    ],
    cta: 'Evaluate my operation',
  },
  {
    id: 'advisory',
    number: '04',
    icon: Briefcase,
    title: 'Xlerion Advisory',
    subtitle: 'Corporate Structuring Program',
    desc: 'Support to turn an idea into a formal, operational, and technologically competitive company.',
    idealFor: 'Entrepreneurs, new companies, SMBs, and teams that need to formalize and launch with structure.',
    benefits: [
      'Leave with company, brand, and technology foundation ready to operate.',
      'Reduce legal and technical risks from day one.',
      'Make decisions with direct guidance from Xlerion founders.',
    ],
    deliverables: 'Legal roadmap, corporate identity, MVP/platform, and compliance plan.',
    phases: [
      { title: 'Legal Structuring', detail: 'S.A.S. incorporation, bylaws, Chamber of Commerce, RUT, trademark before SIC.' },
      { title: 'Identity Architecture', detail: 'Naming, visual identity, brand manual, and B2B positioning.' },
      { title: 'Technology Enablement', detail: 'MVP, web platform, cloud, ISO 27001 and Law 1581 compliance.' },
    ],
    timeline: '60 to 90 day program',
    cta: 'Request Xlerion Advisory',
  },
];

export default function SolucionesSection() {
  const { lang } = useLanguage();
  const solutions = lang === 'en' ? SOLUTIONS_EN : SOLUTIONS_ES;

  const titles = {
    es: {
      title: 'Soluciones DeepTech de Punta a Punta',
      subtitle: 'Gemelos digitales, asistentes RAG, telemetría IoT y Xlerion Advisory para estructuración corporativa integral. Disponibles a medida (6 a 18 meses) o empaquetados para validación rápida (30 a 90 días), más la división Xlerion Game Studio.',
    },
    en: {
      title: 'End-to-End DeepTech Solutions',
      subtitle: 'Digital twins, RAG assistants, IoT telemetry, and Xlerion Advisory for corporate structuring. Available tailored (6 to 18 months) or packaged for rapid validation (30 to 90 days), plus the Xlerion Game Studio division.',
    },
  };

  const t = titles[lang] || titles.es;

  return (
    <section
      id="soluciones"
      className="relative py-24 md:py-32 lg:py-36 px-6 md:px-10 lg:px-14 max-w-[90rem] mx-auto overflow-hidden"
    >
      <FadeUp>
        <SectionHeader title={t.title} subtitle={t.subtitle} />
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-12">
        {solutions.map((sol, index) => {
          const Icon = sol.icon;
          return (
            <FadeUp key={sol.id} delay={index * 0.08}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.35 } }}
                className="group relative h-full flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl p-7 md:p-8 hover:border-[#00e9fa]/35 hover:bg-white/[0.03] transition-colors duration-400"
              >
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#00e9fa]" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00e9fa]">
                  {sol.number}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">{sol.title}</h3>
              {sol.subtitle && <p className="text-xs font-mono uppercase tracking-[0.15em] text-[#00e9fa]/80 mb-3">{sol.subtitle}</p>}
              <p className="text-sm text-gray-300 leading-relaxed mb-4">{sol.desc}</p>

              {sol.idealFor && (
                <div className="mb-4 rounded-md bg-white/[0.03] border border-white/[0.06] p-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#00e9fa] block mb-1">{lang === 'es' ? 'Ideal para' : 'Ideal for'}</span>
                  <p className="text-xs text-gray-400 leading-relaxed">{sol.idealFor}</p>
                </div>
              )}

              {sol.benefits && (
                <div className="mb-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 block mb-2">{lang === 'es' ? 'Qué obtienes' : 'What you get'}</span>
                  <ul className="space-y-2">
                    {sol.benefits.map((b) => (
                      <li key={b} className="flex gap-2 text-xs text-gray-400 leading-relaxed">
                        <span className="text-[#00e9fa] mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sol.phases ? (
                <div className="space-y-3 mb-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">{lang === 'es' ? 'Programa en 3 fases' : '3-phase program'}</h4>
                  {sol.phases.map((p, i) => (
                    <div key={p.title} className="py-2 border-b border-white/[0.05] last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#00e9fa]">0{i + 1}</span>
                        <span className="text-sm text-white font-medium">{p.title}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{p.detail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 mb-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">{lang === 'es' ? 'En resumen' : 'At a glance'}</h4>
                  {sol.metrics?.map((m) => (
                    <div key={m.label} className="flex justify-between items-center gap-3 py-1.5 border-b border-white/[0.05] last:border-0">
                      <span className="text-xs text-gray-400">{m.label}</span>
                      <span className="text-xs font-semibold text-[#00e9fa] font-mono text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-5 border-t border-white/10 mt-auto">
                {sol.deliverables && (
                  <div className="mb-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#00e9fa] block mb-1">{lang === 'es' ? 'Entregables' : 'Deliverables'}</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{sol.deliverables}</p>
                  </div>
                )}
                {sol.timeline && (
                  <p className="text-xs text-gray-400 mb-3"><span className="text-[#00e9fa] font-mono text-[9px] uppercase tracking-[0.15em] mr-2">{lang === 'es' ? 'Duración' : 'Timeline'}</span>{sol.timeline}</p>
                )}
                <a href="#contacto" className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#00e9fa] hover:text-white transition-colors">{sol.cta || (lang === 'es' ? 'Hablar con un experto' : 'Talk to an expert')} →</a>
              </div>
            </motion.div>
            </FadeUp>
          );
        })}
      </div>

      {/* División Xlerion Game Studio */}
      <FadeUp delay={0.1}>
      <div className="mt-6 lg:mt-8 relative bg-white/[0.02] border border-white/10 rounded-2xl p-7 md:p-8 hover:border-[#00e9fa]/30 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#00e9fa]/[0.06] border border-[#00e9fa]/20 flex items-center justify-center shrink-0">
                <Gamepad2 size={18} className="text-[#00e9fa]" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {lang === 'es' ? 'Xlerion Game Studio' : 'Xlerion Game Studio'}
              </h3>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00e9fa] border border-[#00e9fa]/30 rounded px-2 py-1">
                {lang === 'es' ? 'División' : 'Division'}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {lang === 'es'
                ? 'Nuestra división de videojuegos serios y simuladores: formación de operarios en minería, manufactura y seguridad industrial (SST) sin riesgos reales, con la misma tecnología de los gemelos digitales, más experiencias interactivas 3D que demuestran nuestras capacidades de motor.'
                : 'Our serious games and simulators division: training for operators in mining, manufacturing and industrial safety (OSH) with no real-world risk, built on the same digital-twin technology, plus interactive 3D experiences that showcase our engine capabilities.'}
            </p>
            <Link
              to="/corporativo#game-studio"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] hover:text-white transition-colors"
            >
              {lang === 'es' ? 'Ver el pipeline y el modelo de negocio →' : 'See the pipeline and business model →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-[46%] shrink-0">
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#00e9fa] block mb-2">
                {lang === 'es' ? 'Línea B2B · Alto margen' : 'B2B line · High margin'}
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                {lang === 'es'
                  ? 'Simuladores de entrenamiento y gamificación de procesos: licencia anual por usuario, pago por proyecto o suscripción SaaS (ciclos de venta de 1 a 6 meses).'
                  : 'Training simulators and process gamification: annual license per user, project-based payment or SaaS subscription (sales cycles of 1 to 6 months).'}
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#00e9fa] block mb-2">
                {lang === 'es' ? 'Línea B2C · Marca y portafolio' : 'B2C line · Brand & portfolio'}
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                {lang === 'es'
                  ? 'Juegos indie y experiencias interactivas 3D (walking simulator, VR/AR) como demostración de capacidades gráficas y de motor.'
                  : 'Indie games and interactive 3D experiences (walking simulator, VR/AR) as a demonstration of graphics and engine capabilities.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      </FadeUp>
    </section>
  );
}