import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Mail, ArrowLeft, Scale } from 'lucide-react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

/**
 * /corporativo — Documento Corporativo Integral de XLERION S.A.S.
 *
 * Fuente de verdad: "Estatutos_Xlerion.html" (Versión 2.0, noviembre 2026).
 * Se publican las secciones I a VI (identidad, estatutos, estructura,
 * políticas, marco legal y Game Studio). Los anexos (contratos modelo,
 * acta y checklist) son documentos internos y NO se publican.
 *
 * El cuerpo del documento se publica en español (idioma oficial del
 * documento, jurisdicción colombiana); el chrome de la página sí cambia
 * con el selector de idioma del sitio.
 */

const CH = {
  es: {
    kicker: '// documentos_corporativos',
    title: 'Documento Corporativo Integral',
    lead: 'Estatutos sociales, misión, visión, valores, políticas corporativas y marco legal de XLERION S.A.S. Esta página reproduce el documento interno Versión 2.0 (noviembre de 2026), la fuente de verdad de la información que ven clientes, aliados e inversionistas.',
    official: 'Versión oficial en español: el cuerpo del documento se publica en su idioma original, conforme a la jurisdicción colombiana.',
    annexes: 'Los anexos (modelos de contrato, acta de constitución y checklist de cumplimiento) son documentos internos y no se publican en línea. Solicítelos a contacto@xlerion.com.co.',
    tocTitle: 'Contenido',
    print: 'Imprimir / Guardar PDF',
    back: 'Volver al inicio',
    contactTitle: 'Contacto corporativo',
    contactDesc: 'Para solicitar los anexos, información de due diligence o cualquier consulta sobre estos estatutos:',
    legalNote: 'Nota legal',
    legalNoteText: 'Este documento es de carácter informativo y no constituye asesoría legal. Para la constitución formal de la sociedad y el registro ante las entidades competentes, se recomienda consultar con un abogado especializado en derecho comercial colombiano, propiedad intelectual y un contador público.',
    version: 'Versión 2.0 · Noviembre 2026',
  },
  en: {
    kicker: '// corporate_documents',
    title: 'Corporate Document',
    lead: 'Bylaws, mission, vision, values, corporate policies and legal framework of XLERION S.A.S. This page reproduces the internal Version 2.0 document (November 2026), the source of truth for the information seen by clients, partners and investors.',
    official: 'Official version in Spanish: the body of the document is published in its original language, under Colombian jurisdiction.',
    annexes: 'The annexes (model contracts, formation minutes and compliance checklist) are internal documents and are not published online. Request them at contacto@xlerion.com.co.',
    tocTitle: 'Contents',
    print: 'Print / Save as PDF',
    back: 'Back to home',
    contactTitle: 'Corporate contact',
    contactDesc: 'To request the annexes, due diligence information or any questions about these bylaws:',
    legalNote: 'Legal notice',
    legalNoteText: 'This document is for informational purposes and does not constitute legal advice. For the formal incorporation of the company and registration with the competent entities, please consult a lawyer specialized in Colombian commercial law and intellectual property, along with a public accountant.',
    version: 'Version 2.0 · November 2026',
  },
};

/* ---------- helpers de composición del documento ---------- */

function DocSection({ id, num, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <h2 className="flex items-baseline gap-3 text-2xl md:text-3xl font-bold text-white mb-8 pb-3 border-b border-[#00e9fa]/30">
        <span className="font-mono text-sm text-[#00e9fa]">{num}</span>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Chapter({ children }) {
  return (
    <h3 className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-[#00e9fa] mt-10 mb-4">
      {children}
    </h3>
  );
}

function Art({ n, title, children }) {
  return (
    <article className="corp-box bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-5 md:p-7 mb-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#00e9fa] mb-4">
        Artículo {n}. {title}
      </p>
      <div className="space-y-3 text-sm leading-relaxed text-gray-400">{children}</div>
    </article>
  );
}

function DocTable({ head, children }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className="w-full text-sm border-collapse min-w-[560px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                className="border-b border-white/[0.08] bg-[#00e9fa]/[0.07] text-[#00e9fa] font-mono text-[10px] md:text-[11px] uppercase tracking-wider p-3 text-left align-bottom"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children, strong, className = '' }) {
  return (
    <td className={`border-b border-white/[0.05] p-3 text-gray-400 align-top leading-relaxed ${className}`}>
      {strong ? <strong className="text-white font-semibold">{children}</strong> : children}
    </td>
  );
}

function Box({ title, children, tone = 'cyan' }) {
  const tones = {
    cyan: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05]',
    amber: 'border-amber-500/30 bg-amber-500/[0.05]',
    plain: 'border-white/[0.08] bg-white/[0.02]',
  };
  return (
    <div className={`corp-box rounded-lg border p-5 md:p-7 mb-6 ${tones[tone]}`}>
      {title && (
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">{title}</h3>
      )}
      <div className="space-y-3 text-sm leading-relaxed text-gray-400">{children}</div>
    </div>
  );
}

/* ---------- datos de portada ---------- */

const COVER = [
  { es: 'Razón Social', en: 'Legal Name', v: 'XLERION S.A.S.' },
  { es: 'NIT', en: 'Tax ID', v: '817.201.64' },
  { es: 'Domicilio', en: 'Domicile', v: 'Cundinamarca, Colombia' },
  { es: 'Naturaleza Jurídica', en: 'Legal Nature', v: 'Sociedad por Acciones Simplificada (S.A.S.)' },
  { es: 'Objeto Principal', en: 'Core Purpose', v: 'Soluciones DeepTech industriales y videojuegos serios (Serious Games)' },
  { es: 'Constitución', en: 'Incorporated', v: '2023' },
  { es: 'División Especial', en: 'Special Division', v: 'Xlerion Game Studio — Videojuegos y simuladores' },
];

const TOC = [
  { id: 'identidad', n: 'I', t: 'Identidad Corporativa (Misión, Visión, Valores)' },
  { id: 'estatutos', n: 'II', t: 'Estatutos Sociales' },
  { id: 'estructura', n: 'III', t: 'Estructura Organizacional' },
  { id: 'politicas', n: 'IV', t: 'Políticas Corporativas' },
  { id: 'marco-legal', n: 'V', t: 'Marco Legal y Normativo' },
  { id: 'game-studio', n: 'VI', t: 'División de Videojuegos: Pipeline y Roles' },
];

const VALORES = [
  { t: 'Excelencia Técnica', d: 'Desarrollamos soluciones con los más altos estándares de ingeniería, utilizando tecnologías de vanguardia y mejores prácticas internacionales (ISO 27001, ISO 25010).' },
  { t: 'Transparencia y Ética', d: 'Operamos con total transparencia en nuestras comunicaciones, cumpliendo estrictamente con la normativa colombiana (Ley 1581 de 2012) y evitando prácticas de publicidad engañosa.' },
  { t: 'Innovación Responsable', d: 'Desarrollamos tecnología que resuelve problemas reales, con enfoque en sostenibilidad, impacto social positivo y respeto por los saberes ancestrales y comunitarios.' },
  { t: 'Orientación al Cliente', d: 'Diseñamos soluciones adaptadas al ritmo de innovación de cada cliente, desde validaciones rápidas (30-90 días) hasta transformaciones enterprise (6-18 meses).' },
  { t: 'Seguridad y Confiabilidad', d: 'Garantizamos la protección de datos mediante cifrado AES-256, TLS 1.3 y despliegues on-premise o en nube privada, cumpliendo con estándares de seguridad bancaria.' },
  { t: 'Colaboración y Aprendizaje', d: 'Fomentamos una cultura de aprendizaje continuo, trabajo en equipo multidisciplinario y alianzas estratégicas con el ecosistema tecnológico colombiano e internacional.' },
  { t: 'Creatividad Gamificada', d: 'Transformamos procesos complejos en experiencias interactivas y memorables mediante el diseño de videojuegos serios, simuladores y mecánicas de gamificación que mejoran el aprendizaje y la retención.' },
  { t: 'Propiedad Intelectual Protegida', d: 'Valoramos y protegemos la creatividad de nuestro equipo y colaboradores mediante contratos claros de cesión de derechos, registro de obras ante la DNDA y respeto por la autoría original.' },
];

const ORGANIGRAMA = [
  ['CEO & Lead Technical Architect', 'Miguel E. Rodríguez Martinez', 'Dirección estratégica, arquitectura técnica, desarrollo de producto, representación legal'],
  ['Co-Founder & Business Strategy', 'Juliette González', 'Estrategia comercial, sourcing, alianzas, viabilidad financiera'],
  ['Desarrolladores Full-Stack', 'Por definir', 'Desarrollo de frontend (React, Three.js) y backend (Python, FastAPI)'],
  ['Ingeniero de IA/ML', 'Por definir', 'Desarrollo de modelos RAG, embeddings, fine-tuning de LLMs'],
  ['Ingeniero DevOps/Cloud', 'Por definir', 'Infraestructura, despliegues, CI/CD, monitoreo'],
  ['Diseñador UX/UI 3D', 'Por definir', 'Diseño de interfaces, modelado 3D, experiencia de usuario'],
  ['Comercial & Marketing', 'Por definir', 'Ventas B2B, marketing digital, relaciones públicas'],
  ['Game Designer / Productor (Xlerion Game Studio)', 'Por definir', 'Diseño de mecánicas de juego, narrativa, balanceo, gestión de proyectos de videojuegos'],
  ['Technical Artist (Xlerion Game Studio)', 'Por definir', 'Optimización de assets 3D, shaders, pipeline de renderizado, puente entre arte y programación'],
  ['Desarrollador de Gameplay (Unity/Unreal/WebGL)', 'Por definir', 'Programación de lógica de juego, físicas, IA de NPCs, integración con APIs'],
  ['Artista 3D / 2D (Xlerion Game Studio)', 'Por definir', 'Modelado, texturizado, animación, concept art, UI/UX de juegos'],
  ['QA Tester (Control de Calidad de Juegos)', 'Por definir', 'Pruebas de bugs, usabilidad, rendimiento, balanceo de juego'],
];

const PERFILES = [
  {
    role: 'CEO & Lead Technical Architect',
    req: [
      'Ingeniero de Sistemas, Software o afín con maestría o especialización.',
      'Mínimo 10 años de experiencia en desarrollo de software y arquitectura de sistemas.',
      'Experiencia comprobada en tecnologías: React, Three.js, Python, FastAPI, PostgreSQL, Docker, Kubernetes.',
      'Conocimiento en Inteligencia Artificial, Machine Learning y sistemas RAG.',
      'Experiencia en gestión de proyectos tecnológicos (PMP, Scrum Master).',
      'Capacidad de liderazgo y visión estratégica.',
    ],
    fn: [
      'Definir la visión técnica y estratégica de la empresa.',
      'Diseñar arquitecturas de software escalables y seguras.',
      'Liderar el equipo de desarrollo y garantizar la calidad técnica.',
      'Representar legalmente a la empresa.',
      'Relacionarse con clientes, aliados y entidades gubernamentales.',
      'Supervisar la integración tecnológica entre las líneas DeepTech y Xlerion Game Studio.',
    ],
  },
  {
    role: 'Co-Founder & Business Strategy',
    req: [
      'Administrador de Empresas, Economista o afín con MBA o maestría en gestión.',
      'Mínimo 8 años de experiencia en estrategia comercial, sourcing o procurement.',
      'Experiencia en el ecosistema tecnológico colombiano y latinoamericano.',
      'Conocimiento en modelos de negocio B2B y SaaS.',
      'Habilidades de negociación y construcción de alianzas.',
    ],
    fn: [
      'Definir la estrategia comercial y de crecimiento.',
      'Gestionar alianzas estratégicas y relaciones con clientes enterprise.',
      'Optimizar costos y asegurar la viabilidad financiera de los proyectos.',
      'Liderar procesos de fundraising y relación con inversionistas.',
      'Supervisar el área comercial y de marketing.',
      'Identificar oportunidades de mercado para Xlerion Game Studio (simuladores B2B, serious games).',
    ],
  },
  {
    role: 'Game Designer / Productor (Xlerion Game Studio)',
    req: [
      'Diseñador de Juegos, Comunicador Social, Psicólogo o afín con experiencia en gamificación.',
      'Mínimo 5 años de experiencia en diseño de videojuegos, serious games o gamificación corporativa.',
      'Conocimiento en motores de juego (Unity, Unreal Engine) y mecánicas de juego.',
      'Experiencia en diseño instruccional o capacitación corporativa (para serious games).',
      'Habilidades de gestión de proyectos (Scrum, Agile).',
    ],
    fn: [
      'Diseñar mecánicas de juego, narrativas y experiencias interactivas.',
      'Definir objetivos de aprendizaje o entrenamiento en simuladores B2B.',
      'Gestionar el pipeline de producción de videojuegos (pre-producción, producción, QA, lanzamiento).',
      'Coordinar el equipo de desarrollo de juegos (artistas, programadores, QA).',
      'Realizar pruebas de usabilidad y balanceo de juego.',
      'Documentar el Game Design Document (GDD) y mantenerlo actualizado.',
    ],
  },
  {
    role: 'Technical Artist (Xlerion Game Studio)',
    req: [
      'Artista Digital, Diseñador Gráfico o afín con especialización en Technical Art.',
      'Mínimo 5 años de experiencia en optimización de assets 3D para videojuegos.',
      'Conocimiento avanzado en modelado 3D (Blender, Maya, 3ds Max), texturizado (Substance Painter) y motores de juego.',
      'Experiencia en shaders, iluminación, renderizado y optimización de rendimiento.',
      'Conocimiento en pipeline de compresión de mallas (Draco, glTF).',
    ],
    fn: [
      'Optimizar modelos 3D para renderizado en tiempo real (60 FPS en navegador o dispositivo).',
      'Crear shaders personalizados y efectos visuales.',
      'Definir el pipeline de assets entre artistas y programadores.',
      'Garantizar la calidad visual y el rendimiento técnico de los juegos.',
      'Integrar assets 3D con tecnologías DeepTech (Gemelos Digitales, IoT).',
    ],
  },
];

const NORMATIVA = [
  ['Ley 1258 de 2008', 'Crea la figura de Sociedad por Acciones Simplificada (S.A.S.)', 'Constitución y funcionamiento de la empresa'],
  ['Código de Comercio (Decreto 410 de 1971)', 'Regula las actividades mercantiles en Colombia', 'Operaciones comerciales, obligaciones mercantiles'],
  ['Ley 1581 de 2012', 'Ley de Protección de Datos Personales', 'Tratamiento de datos de clientes, empleados, jugadores y terceros'],
  ['Decreto 1377 de 2013', 'Reglamenta la Ley 1581 de 2012', 'Procedimientos para ejercicio de derechos ARCO'],
  ['Ley 23 de 1982', 'Derechos de Autor', 'Protección de software, videojuegos y creaciones intelectuales'],
  ['Decisión 351 de la CAN', 'Régimen Común sobre Derecho de Autor', 'Protección de obras en países andinos'],
  ['Ley 1493 de 2011', 'Ley de Cinematografía Colombiana', 'Aplicable para contenido audiovisual de videojuegos (cutscenes, trailers)'],
  ['ISO/IEC 27001', 'Sistema de Gestión de Seguridad de la Información', 'Estándar de seguridad implementado'],
  ['ISO/IEC 25010', 'Calidad de Productos de Software', 'Estándar de calidad de software y videojuegos'],
  ['Ley 527 de 1999', 'Comercio Electrónico y Firma Digital', 'Validez de contratos y firmas electrónicas'],
  ['Estatuto Tributario', 'Normas tributarias colombianas', 'Obligaciones fiscales, IVA, renta'],
];

/* ---------- página ---------- */

export default function CorporatePage() {
  const { lang } = useLanguage();
  useAnalytics('Corporativo', 'page');
  const c = CH[lang] || CH.es;

  useEffect(() => {
    const prev = document.title;
    document.title = 'Documento Corporativo — XLERION S.A.S.';
    return () => { document.title = prev; };
  }, []);

  return (
    <Layout>
      <style>{`
        @media print {
          nav, .corp-no-print { display: none !important; }
          body, body > div { background: #fff !important; }
          .corp-doc { color: #111 !important; }
          .corp-doc h1, .corp-doc h2, .corp-doc h3, .corp-doc h4,
          .corp-doc strong, .corp-doc th, .corp-doc dt { color: #111 !important; }
          .corp-doc p, .corp-doc li, .corp-doc td, .corp-doc dd,
          .corp-doc span, .corp-doc div { color: #333 !important; }
          .corp-doc .text-white, .corp-doc .text-gray-400,
          .corp-doc .text-gray-300, .corp-doc .text-gray-500 { color: #333 !important; }
          .corp-doc .text-\\[\\#00e9fa\\] { color: #0069c2 !important; }
          .corp-box, .corp-doc section, .corp-doc article {
            background: #fff !important; border-color: #ccc !important;
          }
          .corp-doc table, .corp-doc th, .corp-doc td { border-color: #ccc !important; }
          .corp-doc thead th { background: #eef6ff !important; color: #004c73 !important; }
          .corp-doc a { color: #0069c2 !important; text-decoration: none; }
          .corp-doc section { break-inside: auto; }
          .corp-doc article, .corp-box { break-inside: avoid; }
        }
      `}</style>

      {/* Encabezado de página */}
      <div className="corp-no-print pt-32 pb-14 px-6 md:px-8 max-w-5xl mx-auto w-full border-b border-white/[0.08]">
        <Breadcrumbs items={[{ label: lang === 'es' ? 'Corporativo' : 'Corporate' }]} />
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">
          {c.kicker}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          {c.title}
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          {c.lead}
        </p>

        {/* Ficha de portada */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 mt-8 bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-5 md:p-7">
          {COVER.map((row) => (
            <div key={row.es} className="py-3 border-b border-white/[0.05] last:border-b-0 sm:[&:nth-last-child(-n+1)]:border-b-0">
              <dt className="text-gray-500 text-[10px] uppercase font-mono tracking-widest mb-1">
                {lang === 'en' ? row.en : row.es}
              </dt>
              <dd className="text-white text-sm font-mono">{row.v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Link to="/" className="xl-btn-secondary">
            <ArrowLeft size={14} /> {c.back}
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-white/[0.03] text-white font-mono text-[11px] uppercase tracking-widest hover:border-[#00e9fa]/50 hover:bg-[#00e9fa]/5 transition-all cursor-pointer"
          >
            <Printer size={14} className="text-[#00e9fa]" /> {c.print}
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
            {c.version}
          </span>
        </div>
      </div>

      <div className="corp-doc px-6 md:px-8 max-w-5xl mx-auto py-14 text-[15px]">
        {/* Avisos */}
        <div className="corp-no-print space-y-3 mb-10">
          <p className="flex items-start gap-3 text-xs md:text-sm text-gray-400 bg-white/[0.02] border border-white/[0.08] rounded-lg px-4 py-3">
            <Scale size={16} className="text-[#00e9fa] shrink-0 mt-0.5" />
            <span>{c.official}</span>
          </p>
          <p className="flex items-start gap-3 text-xs md:text-sm text-gray-400 bg-white/[0.02] border border-white/[0.08] rounded-lg px-4 py-3">
            <Mail size={16} className="text-[#00e9fa] shrink-0 mt-0.5" />
            <span>{c.annexes}</span>
          </p>
        </div>

        {/* Tabla de contenido */}
        <nav aria-label="toc" className="corp-no-print mb-14 bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-5 md:p-7">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            {c.tocTitle}
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {TOC.map((s) => (
              <li key={s.id} className="border-b border-dotted border-white/10 last:border-b-0">
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-3 py-2.5 text-sm text-gray-300 hover:text-[#00e9fa] transition-colors"
                >
                  <span className="font-mono text-[#00e9fa] text-xs w-6 shrink-0">{s.n}.</span>
                  <span>{s.t}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ===== I. IDENTIDAD CORPORATIVA ===== */}
        <DocSection id="identidad" num="I" title="Identidad Corporativa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="corp-box bg-[#0a0a12]/80 border-t-2 border-t-[#00e9fa] border border-white/[0.08] rounded-lg p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#00e9fa] mb-4">Misión</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Transformar datos industriales complejos en inteligencia visual 3D, plataformas de IA en tiempo real y experiencias interactivas gamificadas, proporcionando a las empresas colombianas y latinoamericanas soluciones tecnológicas de clase mundial que anticipen fallas, optimicen procesos, aceleren la toma de decisiones operativas y transformen el aprendizaje corporativo mediante simuladores y videojuegos serios, con arquitecturas robustas, seguras y alineadas con los más altos estándares internacionales de calidad y cumplimiento normativo.
              </p>
            </div>
            <div className="corp-box bg-[#0a0a12]/80 border-t-2 border-t-white/40 border border-white/[0.08] rounded-lg p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white mb-4">Visión</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Para 2030, ser la empresa líder en Colombia y referente en Latinoamérica en el desarrollo de soluciones DeepTech industriales y videojuegos serios (Serious Games), reconocida por nuestra capacidad de implementar gemelos digitales 3D, sistemas de IA generativa controlada, redes IoT resilientes y simuladores de entrenamiento gamificados en sectores críticos como minería, manufactura, smart cities y educación corporativa, con presencia en al menos 5 países de la región y un portafolio de 50+ clientes empresariales activos.
              </p>
            </div>
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Valores corporativos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {VALORES.map((v) => (
              <div key={v.t} className="corp-box bg-[#0a0a12]/80 border-l-2 border-l-[#00e9fa] border border-white/[0.08] rounded-lg p-5">
                <h4 className="text-white text-sm font-semibold mb-2">{v.t}</h4>
                <p className="text-xs leading-relaxed text-gray-400">{v.d}</p>
              </div>
            ))}
          </div>

          <Box title="¿Por qué existe Xlerion?">
            <p>
              Creemos que las empresas industriales latinoamericanas merecen acceso a tecnología de clase mundial que les permita competir globalmente. Existimos para democratizar el acceso a soluciones DeepTech (Gemelos Digitales, IA Generativa Controlada, IoT Resiliente) y experiencias interactivas gamificadas (Serious Games, Simuladores de Entrenamiento) que tradicionalmente solo estaban disponibles para grandes corporaciones multinacionales, adaptándolas al contexto, necesidades y realidad operativa de Colombia y Latinoamérica.
            </p>
          </Box>
        </DocSection>

        {/* ===== II. ESTATUTOS SOCIALES ===== */}
        <DocSection id="estatutos" num="II" title="Estatutos Sociales">
          <Box tone="amber" title="Marco Legal">
            <p>
              Estos estatutos se rigen por la Ley 1258 de 2008 (Sociedades por Acciones Simplificadas), el Código de Comercio colombiano (Decreto 410 de 1971), la Ley 23 de 1982 (Derechos de Autor), la Decisión 351 de la CAN, y las normas complementarias vigentes en Colombia.
            </p>
          </Box>

          <Chapter>Capítulo I: Denominación, Domicilio y Duración</Chapter>
          <Art n="1" title="Denominación Social">
            <p>
              La sociedad se denominará <strong className="text-white">XLERION S.A.S.</strong>, pudiendo utilizar en su actividad comercial la denominación abreviada <strong className="text-white">"XLERION"</strong>. La división de desarrollo de videojuegos operará bajo el nombre comercial <strong className="text-white">"Xlerion Game Studio"</strong>. En todos los documentos, correspondencia y publicaciones oficiales deberá indicarse la naturaleza jurídica de la sociedad mediante la expresión "Sociedad por Acciones Simplificada" o la abreviatura "S.A.S."
            </p>
          </Art>
          <Art n="2" title="Domicilio">
            <p>
              El domicilio principal de la sociedad será en el departamento de <strong className="text-white">Cundinamarca, República de Colombia</strong>. La sociedad podrá establecer sucursales, agencias u oficinas en cualquier lugar del territorio nacional o en el exterior, mediante decisión del representante legal o de la asamblea general de accionistas.
            </p>
          </Art>
          <Art n="3" title="Duración">
            <p>
              La duración de la sociedad será de <strong className="text-white">NOVENTA Y NUEVE (99) AÑOS</strong>, contados a partir de la fecha de su constitución, pudiendo prorrogarse por decisión de la Asamblea General de Accionistas, conforme a las formalidades legales establecidas.
            </p>
          </Art>

          <Chapter>Capítulo II: Objeto Social</Chapter>
          <Art n="4" title="Objeto Social Principal">
            <p>
              La sociedad tendrá como objeto principal el desarrollo, implementación y comercialización de soluciones tecnológicas de profunda especialización (DeepTech) para el sector industrial, incluyendo pero no limitándose a:
            </p>
            <ol className="list-decimal pl-5 space-y-3 marker:text-[#00e9fa]">
              <li><strong className="text-white">Gemelos Digitales 3D (SmartFactory):</strong> Diseño, desarrollo e implementación de réplicas digitales tridimensionales de activos, procesos y operaciones físicas, con sincronización de telemetría en tiempo real, renderizado acelerado por GPU y capacidades de mantenimiento predictivo.</li>
              <li><strong className="text-white">Asistentes Corporativos de IA (RAG):</strong> Desarrollo de sistemas de Inteligencia Artificial Generativa controlada, basados en arquitectura Retrieval-Augmented Generation (RAG), para búsqueda semántica en bases de conocimiento no estructuradas, con mecanismos anti-alucinación y trazabilidad de fuentes.</li>
              <li><strong className="text-white">Backend de Telemetría IoT Resiliente:</strong> Diseño e implementación de arquitecturas de ingesta de datos de sensores industriales, con capacidades de buffering local, reconciliación atómica y operación en entornos de conectividad intermitente o baja calidad.</li>
              <li><strong className="text-white">Configuradores 3D Interactivos:</strong> Desarrollo de visualizadores de productos en tiempo real para e-commerce y sectores industriales, con capacidades de personalización y renderizado WebGL.</li>
              <li><strong className="text-white">Consultoría y Auditoría Tecnológica:</strong> Servicios de consultoría en arquitectura de software, cumplimiento normativo (ISO 27001, Ley 1581 de 2012), y auditorías de sistemas de IA y protección de datos.</li>
              <li>
                <strong className="text-white">Desarrollo de Videojuegos Serios (Serious Games) y Simuladores:</strong> Diseño, desarrollo y comercialización de videojuegos con fines educativos, de entrenamiento corporativo, simulación industrial y gamificación de procesos, utilizando motores de juego (Unity, Unreal Engine) y tecnologías web (Three.js, WebGL), incluyendo pero no limitándose a:
                <ul className="list-disc pl-5 mt-2 space-y-2 marker:text-[#00e9fa]">
                  <li>Simuladores de entrenamiento para operación de maquinaria, seguridad industrial (SST) y protocolos de emergencia.</li>
                  <li>Experiencias interactivas 3D para marketing, turismo y educación (walking simulators, experiencias VR/AR).</li>
                  <li>Sistemas de gamificación para procesos corporativos (reporte de incidentes, cumplimiento de protocolos, capacitación).</li>
                  <li>Integración de IA generativa (RAG) para creación de NPCs inteligentes y diálogos dinámicos en simuladores.</li>
                  <li>Conexión de simuladores con datos IoT en tiempo real para crear entornos de entrenamiento híbridos (real-virtual).</li>
                </ul>
              </li>
            </ol>
          </Art>
          <Art n="5" title="Objeto Social Secundario y Complementario">
            <p>
              Para el desarrollo de su objeto social principal, la sociedad podrá realizar todas las actividades comerciales, industriales, tecnológicas y de servicios que sean necesarias o convenientes, incluyendo:
            </p>
            <ol className="list-decimal pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Desarrollo de software a medida, aplicaciones web, móviles y de escritorio.</li>
              <li>Provisión de servicios de computación en la nube, infraestructura como servicio (IaaS), plataforma como servicio (PaaS) y software como servicio (SaaS).</li>
              <li>Comercialización de hardware, software, licencias tecnológicas y videojuegos.</li>
              <li>Prestación de servicios de capacitación, formación y transferencia tecnológica.</li>
              <li>Realización de investigaciones y desarrollos (I+D) en tecnologías emergentes, incluyendo inteligencia artificial, realidad virtual/aumentada y motores de juego.</li>
              <li>Participación en licitaciones públicas y privadas, convocatorias y programas gubernamentales.</li>
              <li>Establecimiento de alianzas estratégicas, joint ventures y consorcios con empresas nacionales e internacionales.</li>
              <li>Adquisición, tenencia, administración y enajenación de bienes muebles e inmuebles necesarios para el desarrollo de su objeto social.</li>
              <li>Contratación de empréstitos, apertura de créditos y realización de todas las operaciones financieras necesarias para el cumplimiento de su objeto social.</li>
              <li>Registro y explotación de propiedad intelectual (software, videojuegos, modelos 3D, diseños, personajes, guiones, música) ante la Dirección Nacional de Derecho de Autor (DNDA) y entidades internacionales.</li>
              <li>Producción y comercialización de contenido audiovisual, animaciones 3D y experiencias interactivas.</li>
              <li>Cualquier otra actividad lícita que sea complementaria o conexa al objeto social principal.</li>
            </ol>
          </Art>

          <Chapter>Capítulo III: Capital Social y Acciones</Chapter>
          <Art n="6" title="Capital Social">
            <p>
              El capital social de la sociedad es el que figure suscrito y pagado en el registro mercantil. La cifra exacta, el número de acciones y su valor nominal constan en el documento de constitución y en las reformas estatutarias vigentes, depositados en la Cámara de Comercio de Cundinamarca.
            </p>
          </Art>
          <Art n="7" title="Clases de Acciones">
            <p>La sociedad podrá emitir diferentes clases de acciones, incluyendo:</p>
            <ol className="list-decimal pl-5 space-y-2 marker:text-[#00e9fa]">
              <li><strong className="text-white">Acciones Ordinarias:</strong> Otorgan derechos políticos y económicos plenos a sus titulares.</li>
              <li><strong className="text-white">Acciones Preferenciales:</strong> Pueden otorgar preferencias en el pago de dividendos o en la liquidación de la sociedad, conforme a lo establecido en el documento de constitución o reforma estatutaria.</li>
              <li><strong className="text-white">Acciones de Pago:</strong> Emitidas como contraprestación por aportes en especie (tecnología, propiedad intelectual, equipos, videojuegos registrados, etc.).</li>
            </ol>
            <p>La creación de nuevas clases de acciones requerirá reforma estatutaria aprobada por la Asamblea General de Accionistas.</p>
          </Art>
          <Art n="8" title="Derechos y Obligaciones de los Accionistas">
            <p><strong className="text-white">Derechos:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Participar y votar en las Asambleas Generales de Accionistas.</li>
              <li>Recibir dividendos decretados por la sociedad.</li>
              <li>Examinar los libros y documentos sociales en las oficinas de la sociedad.</li>
              <li>Ser informado periódicamente sobre la marcha de la sociedad.</li>
              <li>Derecho de preferencia en la suscripción de nuevas emisiones de acciones.</li>
              <li>Retirarse de la sociedad en los casos previstos por la ley.</li>
            </ul>
            <p><strong className="text-white">Obligaciones:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Pagar el valor de las acciones suscritas.</li>
              <li>Guardar reserva sobre las decisiones y documentos de la sociedad.</li>
              <li>Cumplir con los estatutos sociales y las decisiones de los órganos sociales.</li>
              <li>No competir deslealmente con la sociedad.</li>
            </ul>
          </Art>

          <Chapter>Capítulo IV: Órganos de Administración</Chapter>
          <Art n="9" title="Asamblea General de Accionistas">
            <p>
              La Asamblea General de Accionistas es el máximo órgano social y está conformada por todos los accionistas. Sus funciones principales incluyen:
            </p>
            <ol className="list-decimal pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Reformar los estatutos sociales.</li>
              <li>Designar y remover al Representante Legal y a los miembros de la Junta Directiva (si existe).</li>
              <li>Aprobar los estados financieros y la distribución de utilidades.</li>
              <li>Decidir sobre la transformación, fusión, escisión o disolución de la sociedad.</li>
              <li>Aprobar la emisión de nuevas clases de acciones.</li>
              <li>Ejercer las demás funciones establecidas en la Ley 1258 de 2008 y el Código de Comercio.</li>
            </ol>
            <p>
              La Asamblea General se reunirá ordinariamente una vez al año, dentro de los tres (3) primeros meses siguientes al cierre del ejercicio social, y extraordinariamente cuando sea convocada por el Representante Legal, la Junta Directiva o accionistas que representen al menos el 10% del capital social.
            </p>
          </Art>
          <Art n="10" title="Representante Legal">
            <p>
              La sociedad tendrá un Representante Legal, quien será el administrador principal y representante judicial y extrajudicial de la sociedad. El Representante Legal será designado por la Asamblea General de Accionistas, pudiendo ser reelegido.
            </p>
            <p><strong className="text-white">Funciones del Representante Legal:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Dirigir la gestión social y ejecutar las decisiones de la Asamblea General.</li>
              <li>Representar judicial y extrajudicialmente a la sociedad.</li>
              <li>Contratar y remover empleados y colaboradores.</li>
              <li>Abrir, mover y cerrar cuentas bancarias.</li>
              <li>Firmar contratos, convenios y documentos en nombre de la sociedad.</li>
              <li>Presentar los estados financieros a la Asamblea General.</li>
              <li>Cumplir con las obligaciones legales, tributarias y regulatorias de la sociedad.</li>
              <li>Supervisar las operaciones de la división Xlerion Game Studio.</li>
              <li>Ejercer las demás funciones establecidas en la ley y los estatutos.</li>
            </ul>
            <p>
              <strong className="text-white">Representante Legal Actual:</strong> Miguel E. Rodríguez Martinez, con domicilio en Bogotá, Colombia.
            </p>
          </Art>
          <Art n="11" title="Junta Directiva (Opcional)">
            <p>
              La sociedad podrá contar con una Junta Directiva conformada por un número impar de miembros (mínimo tres), designados por la Asamblea General de Accionistas. La Junta Directiva tendrá funciones de orientación estratégica, control de gestión y apoyo al Representante Legal.
            </p>
            <p>Las decisiones de la Junta Directiva se tomarán por mayoría absoluta de sus miembros.</p>
          </Art>
          <Art n="12" title="Revisor Fiscal">
            <p>
              La sociedad tendrá Revisor Fiscal cuando el capital social sea igual o superior a quinientos (500) salarios mínimos legales vigentes, o cuando lo exijan las normas especiales aplicables. El Revisor Fiscal será designado por la Asamblea General de Accionistas y deberá ser contador público titulado con tarjeta profesional vigente.
            </p>
          </Art>

          <Chapter>Capítulo V: Régimen Financiero y Utilidades</Chapter>
          <Art n="13" title="Ejercicio Social">
            <p>
              El ejercicio social de la sociedad comprenderá el período del <strong className="text-white">1 de enero al 31 de diciembre</strong> de cada año. Al cierre de cada ejercicio social se elaborarán los estados financieros de propósito general, conforme a las Normas Internacionales de Información Financiera (NIIF) adoptadas en Colombia.
            </p>
          </Art>
          <Art n="14" title="Distribución de Utilidades">
            <p>Las utilidades líquidas de cada ejercicio social se distribuirán en el siguiente orden:</p>
            <ol className="list-decimal pl-5 space-y-2 marker:text-[#00e9fa]">
              <li><strong className="text-white">Reserva Legal:</strong> El 10% de las utilidades líquidas se destinará a la reserva legal, hasta que esta alcance el 50% del capital social suscrito y pagado.</li>
              <li><strong className="text-white">Dividendos:</strong> El remanente podrá ser distribuido como dividendos entre los accionistas, en proporción a su participación accionaria, conforme a la decisión de la Asamblea General.</li>
              <li><strong className="text-white">Utilidades No Distribuidas:</strong> La Asamblea General podrá decidir reinvertir utilidades en la sociedad para su crecimiento y desarrollo.</li>
            </ol>
          </Art>

          <Chapter>Capítulo VI: Disolución y Liquidación</Chapter>
          <Art n="15" title="Causales de Disolución">
            <p>
              La sociedad se disolverá por las causales establecidas en el artículo 218 del Código de Comercio y la Ley 1258 de 2008, incluyendo:
            </p>
            <ol className="list-decimal pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Vencimiento del término de duración, salvo prórroga.</li>
              <li>Imposibilidad de desarrollar el objeto social o terminación de la actividad empresarial.</li>
              <li>Reducción del número de accionistas a menos de dos (2), si no se regulariza en seis (6) meses.</li>
              <li>Decisión de la Asamblea General de Accionistas.</li>
              <li>Declaratoria de insolvencia.</li>
              <li>Fusión, escisión o transformación de la sociedad.</li>
              <li>Las demás causales previstas en la ley.</li>
            </ol>
          </Art>
          <Art n="16" title="Liquidación">
            <p>
              Disuelta la sociedad, se procederá a su liquidación conforme a las normas legales vigentes. El producto de la liquidación se distribuirá en el siguiente orden:
            </p>
            <ol className="list-decimal pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Pago de pasivos externos e internos.</li>
              <li>Devolución de aportes a los accionistas.</li>
              <li>Distribución del remanente entre los accionistas, en proporción a su participación accionaria.</li>
            </ol>
          </Art>

          <Chapter>Capítulo VII: Disposiciones Especiales</Chapter>
          <Art n="17" title="Protección de Datos Personales">
            <p>
              La sociedad cumplirá estrictamente con la Ley 1581 de 2012 (Ley de Protección de Datos Personales) y el Decreto 1377 de 2013, implementando políticas y procedimientos para el tratamiento adecuado de datos personales de clientes, empleados, accionistas, jugadores y terceros. La sociedad designará un responsable de tratamiento de datos personales.
            </p>
          </Art>
          <Art n="18" title="Seguridad de la Información">
            <p>
              La sociedad implementará y mantendrá un Sistema de Gestión de Seguridad de la Información (SGSI) alineado con la norma ISO/IEC 27001, garantizando la confidencialidad, integridad y disponibilidad de la información de la sociedad y sus clientes.
            </p>
          </Art>
          <Art n="19" title="Propiedad Intelectual">
            <p>
              Todos los desarrollos tecnológicos, software, videojuegos, algoritmos, diseños, modelos 3D, personajes, guiones, música, documentación y demás creaciones intelectuales desarrolladas por los empleados, colaboradores o contratistas de la sociedad en el ejercicio de sus funciones o utilizando recursos de la sociedad, serán propiedad exclusiva de XLERION S.A.S., conforme a las normas colombianas de propiedad intelectual (Ley 23 de 1982, Decisión 351 de la CAN). La sociedad realizará el registro correspondiente ante la Dirección Nacional de Derecho de Autor (DNDA) cuando aplique.
            </p>
          </Art>
          <Art n="20" title="Conflicto de Intereses">
            <p>
              Los accionistas, administradores y empleados de la sociedad deberán actuar con lealtad y buena fe, evitando situaciones de conflicto de intereses. Cualquier conflicto de intereses deberá ser declarado inmediatamente y puesto en conocimiento del Representante Legal o la Asamblea General, según corresponda.
            </p>
          </Art>
          <Art n="21" title="División Xlerion Game Studio">
            <p>
              La sociedad podrá operar una división especializada denominada "Xlerion Game Studio" dedicada al desarrollo de videojuegos serios, simuladores industriales y experiencias interactivas gamificadas. Esta división operará bajo los mismos estatutos sociales y estará sujeta a las políticas de propiedad intelectual, cesión de derechos y registro de obras establecidas en estos estatutos y en la normativa colombiana aplicable.
            </p>
          </Art>
        </DocSection>

        {/* ===== III. ESTRUCTURA ORGANIZACIONAL ===== */}
        <DocSection id="estructura" num="III" title="Estructura Organizacional">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Organigrama inicial
          </h3>
          <div className="mb-10">
            <DocTable head={['Cargo', 'Responsable', 'Funciones principales']}>
              {ORGANIGRAMA.map((r) => (
                <tr key={r[0]} className="odd:bg-white/[0.015] hover:bg-white/[0.03] transition-colors">
                  <Td strong>{r[0]}</Td>
                  <Td className="whitespace-nowrap">{r[1]}</Td>
                  <Td>{r[2]}</Td>
                </tr>
              ))}
            </DocTable>
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Perfiles de cargo clave
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {PERFILES.map((p) => (
              <div key={p.role} className="corp-box bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-5 md:p-6">
                <h4 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/[0.08]">
                  {p.role}
                </h4>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa] mb-2">
                  Requisitos
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs leading-relaxed text-gray-400 mb-4 marker:text-[#00e9fa]">
                  {p.req.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa] mb-2">
                  Funciones
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs leading-relaxed text-gray-400 marker:text-[#00e9fa]">
                  {p.fn.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </DocSection>

        {/* ===== IV. POLÍTICAS CORPORATIVAS ===== */}
        <DocSection id="politicas" num="IV" title="Políticas Corporativas">
          <Box title="Política 001 — Tratamiento de datos personales">
            <p><strong className="text-white">Objetivo:</strong> Establecer los lineamientos para el tratamiento adecuado de datos personales de clientes, empleados, accionistas, jugadores y terceros, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013.</p>
            <p><strong className="text-white">Alcance:</strong> Aplica a todos los datos personales recolectados, almacenados, procesados o compartidos por XLERION S.A.S., incluyendo datos de jugadores en videojuegos y simuladores.</p>
            <p><strong className="text-white">Principios:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li><strong className="text-white">Legalidad:</strong> Todo tratamiento de datos se realizará conforme a la ley.</li>
              <li><strong className="text-white">Finalidad:</strong> Los datos se recolectarán con fines explícitos y legítimos.</li>
              <li><strong className="text-white">Libertad:</strong> El tratamiento solo se ejercerá con consentimiento previo, expreso e informado del titular.</li>
              <li><strong className="text-white">Verdad:</strong> La información debe ser veraz, completa, exacta y actualizada.</li>
              <li><strong className="text-white">Transparencia:</strong> El titular tiene derecho a conocer el uso de sus datos.</li>
              <li><strong className="text-white">Seguridad:</strong> Se implementarán medidas técnicas y administrativas para proteger los datos.</li>
            </ul>
            <p><strong className="text-white">Derechos del Titular:</strong> Acceso, rectificación, supresión, revocación del consentimiento y presentación de quejas ante la SIC.</p>
            <p><strong className="text-white">Responsable de Tratamiento:</strong> XLERION S.A.S., representada por su Representante Legal.</p>
            <p><strong className="text-white">Encargado de Tratamiento:</strong> Proveedores de servicios en la nube (AWS, Google Cloud, etc.) con contratos de procesamiento de datos.</p>
            <p><strong className="text-white">Canal de Atención:</strong> contacto@xlerion.com.co para ejercer derechos PQR.</p>
          </Box>

          <Box title="Política 002 — Seguridad de la Información">
            <p><strong className="text-white">Objetivo:</strong> Proteger la información de la sociedad contra accesos no autorizados, uso indebido, divulgación, interrupción, modificación o destrucción, alineado con ISO/IEC 27001.</p>
            <p><strong className="text-white">Controles implementados:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Cifrado AES-256 para datos en reposo.</li>
              <li>TLS 1.3 con Perfect Forward Secrecy para datos en tránsito.</li>
              <li>Autenticación multifactor (MFA) para accesos críticos.</li>
              <li>Segregación de ambientes (desarrollo, pruebas, producción).</li>
              <li>Backups automáticos con retención de 30 días.</li>
              <li>Monitoreo continuo de logs y alertas de seguridad.</li>
              <li>Capacitación anual en seguridad de la información para todo el personal.</li>
              <li>Protección especial para código fuente de videojuegos y assets no publicados.</li>
            </ul>
            <p><strong className="text-white">Clasificación de la información:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li><strong className="text-white">Pública:</strong> Información disponible para cualquier persona (sitio web, marketing, trailers de juegos).</li>
              <li><strong className="text-white">Interna:</strong> Información para uso exclusivo de empleados (documentos internos, procesos, GDDs).</li>
              <li><strong className="text-white">Confidencial:</strong> Información sensible que requiere protección especial (datos de clientes, código fuente, credenciales, builds de juegos no lanzados).</li>
              <li><strong className="text-white">Restringida:</strong> Información crítica con acceso limitado a personal autorizado (llaves criptográficas, datos financieros, secretos comerciales de videojuegos).</li>
            </ul>
          </Box>

          <Box title="Política 003 — Ética empresarial">
            <p><strong className="text-white">Objetivo:</strong> Establecer los principios éticos que guían el comportamiento de todos los miembros de XLERION S.A.S.</p>
            <p><strong className="text-white">Principios:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li><strong className="text-white">Integridad:</strong> Actuar con honestidad y transparencia en todas las operaciones.</li>
              <li><strong className="text-white">Respeto:</strong> Tratar a todos con dignidad, sin discriminación.</li>
              <li><strong className="text-white">Responsabilidad:</strong> Asumir las consecuencias de las decisiones y acciones.</li>
              <li><strong className="text-white">Confidencialidad:</strong> Proteger la información sensible de la empresa y sus clientes.</li>
              <li><strong className="text-white">Cumplimiento:</strong> Respetar todas las leyes y regulaciones aplicables.</li>
            </ul>
            <p><strong className="text-white">Prohibiciones:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Sobornos, corrupción o prácticas fraudulentas.</li>
              <li>Conflicto de intereses no declarado.</li>
              <li>Uso indebido de recursos de la empresa.</li>
              <li>Acoso laboral o discriminación.</li>
              <li>Divulgación no autorizada de información confidencial.</li>
              <li>Plagio de assets, código o diseños de videojuegos de terceros.</li>
              <li>Uso de software pirata o licencias no autorizadas en el desarrollo de juegos.</li>
            </ul>
          </Box>

          <Box title="Política 004 — Comunicación y marketing">
            <p><strong className="text-white">Objetivo:</strong> Garantizar que todas las comunicaciones externas de la empresa sean veraces, éticas y cumplan con la normativa colombiana.</p>
            <p><strong className="text-white">Lineamientos:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Toda comunicación sobre reconocimientos institucionales (ej. MinTIC) debe usar lenguaje factual y verificable.</li>
              <li>Está prohibido usar términos como "ganadora", "premiada", "avalada" o "beneficiaria" si no corresponden a la realidad documental.</li>
              <li>Las métricas y casos de éxito deben estar respaldados por evidencia verificable.</li>
              <li>El contenido técnico debe ser preciso y no exagerar capacidades.</li>
              <li>Todas las publicaciones deben ser aprobadas por el Representante Legal o la persona designada.</li>
              <li>Los trailers, screenshots y demos de videojuegos deben ser aprobados por el Game Designer y el Representante Legal antes de su publicación.</li>
            </ul>
          </Box>

          <Box title="Política 005 — Propiedad intelectual (específica para videojuegos)">
            <p><strong className="text-white">Objetivo:</strong> Proteger la propiedad intelectual de todos los desarrollos de software, videojuegos, assets 3D, diseños, código fuente y creaciones intelectuales de XLERION S.A.S.</p>
            <p><strong className="text-white">Lineamientos:</strong></p>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>
                <strong className="text-white">Registro de Obras:</strong> Todo videojuego, software, modelo 3D, personaje, guion, música o asset significativo desarrollado por la empresa debe ser registrado ante la Dirección Nacional de Derecho de Autor (DNDA) antes de su publicación o entrega a clientes.
              </li>
              <li>
                <strong className="text-white">Cesión de Derechos de Colaboradores:</strong> Todo empleado, freelancer o contratista que participe en el desarrollo de videojuegos debe firmar un Contrato de Cesión de Derechos Patrimoniales de Autor antes de iniciar su trabajo, que especifique:
                <ul className="list-disc pl-5 mt-2 space-y-1.5 marker:text-[#00e9fa]">
                  <li>Cesión total de derechos patrimoniales de explotación económica a XLERION S.A.S.</li>
                  <li>Reconocimiento de derechos morales (autoría) al creador original.</li>
                  <li>Alcance de la cesión (territorio mundial, duración máxima permitida por ley).</li>
                  <li>Compensación económica por la cesión (incluida en el pago del servicio o contrato laboral).</li>
                </ul>
              </li>
              <li>
                <strong className="text-white">Retención de Tecnología Base:</strong> En contratos de desarrollo de videojuegos para clientes, XLERION S.A.S. retendrá la propiedad intelectual del motor, herramientas, código base reutilizable, pipelines de desarrollo y assets genéricos creados previamente por la empresa. Solo se cederán al cliente los derechos de explotación del videojuego final entregado.
              </li>
              <li>
                <strong className="text-white">Uso de Assets de Terceros:</strong> Está prohibido utilizar assets, música, código o diseños de terceros sin la licencia correspondiente. Todo asset de terceros debe tener licencia comercial válida y documentada.
              </li>
              <li>
                <strong className="text-white">Confidencialidad de Proyectos:</strong> Los empleados y colaboradores no podrán divulgar información sobre videojuegos en desarrollo (screenshots, trailers, mecánicas) sin autorización expresa del Representante Legal.
              </li>
            </ul>
          </Box>
        </DocSection>

        {/* ===== V. MARCO LEGAL ===== */}
        <DocSection id="marco-legal" num="V" title="Marco Legal y Normativo">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Normatividad aplicable
          </h3>
          <div className="mb-10">
            <DocTable head={['Norma', 'Descripción', 'Aplicación en Xlerion']}>
              {NORMATIVA.map((r) => (
                <tr key={r[0]} className="odd:bg-white/[0.015] hover:bg-white/[0.03] transition-colors">
                  <Td strong>{r[0]}</Td>
                  <Td>{r[1]}</Td>
                  <Td>{r[2]}</Td>
                </tr>
              ))}
            </DocTable>
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Obligaciones legales principales
          </h3>

          <Box title="1. Registro y actualización mercantil">
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Inscripción en la Cámara de Comercio de Cundinamarca.</li>
              <li>Renovación anual de matrícula mercantil (enero de cada año).</li>
              <li>Actualización de información societaria cuando haya cambios (representante legal, domicilio, capital, objeto social, etc.).</li>
              <li>Registro del nombre comercial "Xlerion Game Studio" como nombre de fantasía.</li>
            </ul>
          </Box>
          <Box title="2. Obligaciones tributarias">
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Inscripción en el RUT (Registro Único Tributario) ante la DIAN.</li>
              <li>Declaración y pago de Impuesto sobre la Renta (anual).</li>
              <li>Declaración y pago de IVA (bimestral o cuatrimestral, según régimen).</li>
              <li>Retención en la fuente (mensual).</li>
              <li>Industria y Comercio (ICA) - municipal.</li>
              <li>Reporte de información exógena (anual, si aplica).</li>
            </ul>
          </Box>
          <Box title="3. Obligaciones laborales y parafiscales">
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Afiliación de empleados a seguridad social (salud, pensión, ARL).</li>
              <li>Pago de aportes parafiscales (SENA, ICBF, Cajas de Compensación).</li>
              <li>Cumplimiento del Código Sustantivo del Trabajo.</li>
              <li>Reglamento Interno de Trabajo (si tiene más de 10 empleados).</li>
              <li>Comité de Convivencia Laboral.</li>
            </ul>
          </Box>
          <Box title="4. Obligaciones contables y financieras">
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Llevar contabilidad conforme a NIIF.</li>
              <li>Elaborar estados financieros de propósito general al cierre de cada ejercicio.</li>
              <li>Presentar estados financieros en la Cámara de Comercio (si aplica por tamaño).</li>
              <li>Auditoría externa (si el capital supera 500 SMMLV o por decisión de accionistas).</li>
            </ul>
          </Box>
          <Box title="5. Obligaciones sectoriales (tecnología y videojuegos)">
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Registro de software y obras literarias (videojuegos, guiones, personajes) ante la DNDA (Dirección Nacional de Derecho de Autor).</li>
              <li>Cumplimiento de normas de ciberseguridad (si aplica por sector).</li>
              <li>Reporte de incidentes de seguridad de la información (si aplica).</li>
              <li>Cumplimiento de contratos con entidades gubernamentales (si aplica).</li>
              <li>Clasificación etaria de videojuegos (si se comercializan al público general, seguir lineamientos de la Ley 1753 de 2015 y normas de protección al consumidor).</li>
              <li>Registro de marcas comerciales ante la SIC (Superintendencia de Industria y Comercio) para "Xlerion" y "Xlerion Game Studio".</li>
            </ul>
          </Box>
        </DocSection>

        {/* ===== VI. GAME STUDIO ===== */}
        <DocSection id="game-studio" num="VI" title="División Xlerion Game Studio: Pipeline y Roles">
          <Box title="Estrategia de doble vía para videojuegos">
            <p>
              <strong className="text-white">Línea Principal (B2B - Alto Margen):</strong> Simuladores de entrenamiento para minería, manufactura y seguridad industrial (SST). Usan la misma tecnología de los Gemelos Digitales, pero con mecánicas de juego (gamificación) para entrenar operarios sin riesgos reales.
            </p>
            <p>
              <strong className="text-white">Línea Secundaria (B2C - Marca y Portafolio):</strong> Juegos indie o experiencias interactivas (ej. el "Cosmic Bungalow 3D" de Tropical Biohostel puede escalar a una experiencia narrativa tipo "walking simulator") que sirvan como demostración de capacidades gráficas y de motor.
            </p>
          </Box>

          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Integración con líneas DeepTech
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { t: 'Gemelos Digitales 3D → Motores de Juego', d: 'La tubería (pipeline) de optimización de mallas 3D (Draco/glTF) y renderizado WebGL (Three.js) es idéntica a la de desarrollo de juegos web o ligeros. Pueden migrar fácilmente a Unity o Unreal Engine para proyectos más pesados.' },
              { t: 'IA RAG → NPCs Inteligentes', d: 'La tecnología RAG que usan para manuales corporativos puede adaptarse para crear NPCs (personajes no jugables) en simuladores de entrenamiento que respondan preguntas de los operarios en lenguaje natural durante la simulación.' },
              { t: 'IoT Resiliente → Telemetría en Juego', d: 'Los datos reales de sensores IoT pueden alimentar el entorno del videojuego en tiempo real, creando un "Simulador Híbrido" donde el juego reacciona a las condiciones reales de la planta.' },
            ].map((card) => (
              <div key={card.t} className="corp-box bg-[#0a0a12]/80 border-l-2 border-l-[#00e9fa] border border-white/[0.08] rounded-lg p-5">
                <h4 className="text-white text-sm font-semibold mb-2">{card.t}</h4>
                <p className="text-xs leading-relaxed text-gray-400">{card.d}</p>
              </div>
            ))}
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Modelo de monetización
          </h3>
          <div className="mb-10">
            <DocTable head={['Tipo de proyecto', 'Modelo de ingresos', 'Ciclo de venta', 'Ejemplo para Xlerion']}>
              <tr className="odd:bg-white/[0.015]">
                <Td strong>Simuladores de Entrenamiento (B2B)</Td>
                <Td>Licencia anual por usuario o pago por proyecto (CAPEX)</Td>
                <Td>3 - 6 meses</Td>
                <Td>Simulador de operación de maquinaria para una minera, con evaluación de desempeño integrada</Td>
              </tr>
              <tr className="odd:bg-white/[0.015]">
                <Td strong>Gamificación de Procesos (B2B)</Td>
                <Td>Suscripción SaaS (Software as a Service)</Td>
                <Td>1 - 3 meses</Td>
                <Td>App de "misiones" para que los trabajadores reporten fallas o cumplan protocolos de seguridad a cambio de recompensas</Td>
              </tr>
              <tr className="odd:bg-white/[0.015]">
                <Td strong>Experiencias Interactivas 3D (B2C/B2B2C)</Td>
                <Td>Pago por desarrollo (Fee fijo) + mantenimiento</Td>
                <Td>30 - 90 días</Td>
                <Td>Ampliar el "Cosmic Bungalow" a una experiencia VR exploratoria para ferias de turismo</Td>
              </tr>
            </DocTable>
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Pipeline de producción de videojuegos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { f: 'Fase 1: Pre-Producción (2-4 semanas)', items: ['Definición del concepto y objetivos (Game Design Document - GDD).', 'Investigación de mercado y análisis de competencia.', 'Definición del stack tecnológico (Unity, Unreal, Three.js, etc.).', 'Estimación de costos y cronograma.', 'Firma de contratos de cesión de derechos con colaboradores.'] },
              { f: 'Fase 2: Producción (2-6 meses)', items: ['Desarrollo de prototipo jugable (Alpha).', 'Creación de assets 3D/2D, programación de mecánicas, integración de IA.', 'Iteraciones basadas en pruebas internas.', 'Integración con tecnologías DeepTech (RAG, IoT) si aplica.'] },
              { f: 'Fase 3: QA y Pulido (2-4 semanas)', items: ['Pruebas de bugs, usabilidad y rendimiento.', 'Balanceo de juego y optimización.', 'Pruebas con usuarios reales (beta cerrada).'] },
              { f: 'Fase 4: Lanzamiento y Post-Lanzamiento', items: ['Registro ante la DNDA.', 'Publicación en plataformas (Steam, itch.io, web, app stores) o entrega a cliente B2B.', 'Marketing y comunicación (trailers, screenshots, press kit).', 'Soporte técnico y actualizaciones.', 'Medición de KPIs (retención, engagement, ROI para B2B).'] },
            ].map((phase) => (
              <div key={phase.f} className="corp-box bg-[#0a0a12]/80 border border-white/[0.08] rounded-lg p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#00e9fa] mb-3">{phase.f}</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs leading-relaxed text-gray-400 marker:text-[#00e9fa]">
                  {phase.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
            Hoja de ruta de implementación (próximos 6 meses)
          </h3>
          <Box title="Mes 1-2: Estandarización legal y de pipeline">
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Redactar la plantilla de contrato de cesión de derechos de autor para colaboradores.</li>
              <li>Definir el stack tecnológico base (Unity para simuladores pesados, Three.js/React para experiencias web ligeras).</li>
              <li>Registrar la marca "Xlerion Game Studio" ante la SIC.</li>
            </ul>
          </Box>
          <Box title={'Mes 3-4: Proyecto piloto interno ("Dogfooding")'}>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Desarrollar un mini-simulador o experiencia interactiva propia (ej. un "juego" que enseñe a usar el propio Asistente RAG de Xlerion, o una versión gamificada del mantenimiento de la turbina del demo actual).</li>
              <li>Registrar el piloto ante la DNDA.</li>
            </ul>
          </Box>
          <Box title="Mes 5-6: Oferta comercial y primer cliente">
            <ul className="list-disc pl-5 space-y-2 marker:text-[#00e9fa]">
              <li>Empaquetar el piloto como un "Módulo de Entrenamiento Gamificado" y ofrecerlo a la red de contactos de Juliette (empresas de manufactura, agro o turismo) como un producto de validación rápida (30-90 días).</li>
              <li>Crear portafolio de Xlerion Game Studio con el piloto y casos de éxito.</li>
            </ul>
          </Box>
        </DocSection>

        {/* ===== CIERRE ===== */}
        <section className="scroll-mt-24 corp-no-print">
          <div className="corp-box bg-[#0a0a12]/80 border border-[#00e9fa]/25 rounded-lg p-6 md:p-8 mb-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
              {c.contactTitle}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{c.contactDesc}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="mailto:contacto@xlerion.com.co" className="inline-flex items-center gap-2 text-white hover:text-[#00e9fa] transition-colors font-mono">
                <Mail size={15} className="text-[#00e9fa]" /> contacto@xlerion.com.co
              </a>
              <span className="text-gray-500 font-mono">XLERION S.A.S. · NIT 817.201.64</span>
              <span className="text-gray-500 font-mono">Cundinamarca, Colombia</span>
            </div>
          </div>

          <div className="corp-box border border-amber-500/25 bg-amber-500/[0.04] rounded-lg p-6 md:p-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300 mb-3">
              {c.legalNote}
            </h2>
            <p className="text-xs leading-relaxed text-gray-400">{c.legalNoteText}</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
