import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAnalytics } from '../hooks/useAnalytics';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { BIO } from '../sections/biohostels-docs/ui';
import { IdentidadMarca, LibroMaestro, ModeloNegocio, OportunidadInversion, ResumenEjecutivo } from '../sections/biohostels-docs/PartA';
import { BlockchainTransparencia, DashboardIoT, EcosistemaIoT } from '../sections/biohostels-docs/PartB';
import { ElFlecho, ModeloInversion, RetornosProyecciones } from '../sections/biohostels-docs/PartC';
import { BioCoin, MarcoLegal, Roadmap } from '../sections/biohostels-docs/PartD';
import { BioQuest } from '../sections/biohostels-docs/PartBioQuest';

const DOCS = [
  {
    href: '/documents/biohostels/proyectoFinalBiohostels.html',
    name: 'Documento Maestro del Proyecto',
    file: 'proyectoFinalBiohostels.html',
    desc: 'Visión completa: marca, libro maestro, modelo de negocio, inversión, El Flecho, BioCoin, marco legal y roadmap.',
    tag: 'HTML',
    color: BIO.teal,
  },
  {
    href: '/documents/biohostels/BioBlockchainDocumento.html',
    name: 'Documento para Inversionistas · IoT + Blockchain',
    file: 'BioBlockchainDocumento.html',
    desc: 'Enfoque inversionista: IoT, blockchain, modelo de inversión, retornos, proyecciones, impuestos y roadmap.',
    tag: 'HTML',
    color: BIO.info,
  },
  {
    href: '/documents/biohostels/BioBlockchain.html',
    name: 'Dashboard IoT & Blockchain (Demo)',
    file: 'BioBlockchain.html',
    desc: 'Demo visual del dashboard privado/público: métricas IoT, alertas, producción comunitaria y trazabilidad blockchain.',
    tag: 'HTML',
    color: BIO.accent,
  },
  {
    href: '/documents/biohostels/Propiedad-Fraccionada-vs-Fideicomiso.pdf',
    name: 'Propiedad Fraccionada vs. Fideicomiso Inmobiliario',
    file: 'Propiedad-Fraccionada-vs-Fideicomiso.pdf',
    desc: 'Análisis comparativo de los dos caminos de inversión en bio-villas autosostenibles en Colombia.',
    tag: 'PDF',
    color: '#E8E8E8',
  },
  {
    href: '/documents/biohostels/biogamification.html',
    name: 'BioQuest · Gamificación Ecológica',
    file: 'biogamification.html',
    desc: 'Sistema de gamificación: BioQuest, rareza de especies, BioCoin rewards, gameplay, integración técnica y roadmap de implementación.',
    tag: 'HTML',
    color: BIO.teal,
  },
];

const INDEX = [
  { id: 'descargas', label: 'Descargas', cap: '00' },
  { id: 'resumen', label: 'Resumen Ejecutivo', cap: '01' },
  { id: 'oportunidad', label: 'Oportunidad de Inversión', cap: '02' },
  { id: 'marca', label: 'Identidad de Marca', cap: '03' },
  { id: 'libro', label: 'Libro Maestro', cap: '04' },
  { id: 'modelo', label: 'Modelo de Negocio', cap: '05' },
  { id: 'iot', label: 'Ecosistema IoT', cap: '06' },
  { id: 'dashboard', label: 'Dashboard IoT', cap: '07' },
  { id: 'blockchain', label: 'Blockchain y Transparencia', cap: '08' },
  { id: 'inversion', label: 'Modelo de Inversión', cap: '09' },
  { id: 'retornos', label: 'Retornos y Proyecciones', cap: '10' },
  { id: 'flecho', label: 'El Flecho', cap: '11' },
  { id: 'biocoin', label: 'BioCoin (BIO)', cap: '12' },
  { id: 'legal', label: 'Marco Legal', cap: '13' },
  { id: 'bioquest', label: 'BioQuest · Gamificación', cap: '14' },
  { id: 'roadmap', label: 'Roadmap y Próximos Pasos', cap: '15' },
];

function DownloadCard({ doc }) {
  return (
    <a
      href={doc.href}
      download
      className="group block min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00e9fa]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-mono tracking-wider" style={{ background: doc.color + '22', color: doc.color, border: `1px solid ${doc.color}44` }}>
          {doc.tag}
        </span>
        <span className="shrink-0 text-gray-500 group-hover:text-[#00e9fa] transition-colors" aria-hidden="true">↓</span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-white leading-snug">{doc.name}</h3>
      <p className="mt-2 text-xs text-gray-500 leading-relaxed">{doc.desc}</p>
      <div className="mt-3 font-mono text-[11px] text-gray-600 break-all">{doc.file}</div>
    </a>
  );
}

export default function BiohostelsDocPage() {
  useAnalytics('Biohostels Documentación', 'proyecto');
  useScrollAnimation({ enabled: true, selector: 'section' });
  const [active, setActive] = useState(INDEX[0].id);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Biohostels · Documentación Completa | Xlerion';
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    const ids = INDEX.map((i) => i.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: '-20% 0px -70% 0px', threshold: [0.1, 0.3, 0.6] });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const activeLabel = useMemo(() => INDEX.find((i) => i.id === active)?.label || '', [active]);

  return (
    <Layout>
      <header className="pt-32 pb-12 px-6 md:px-8 max-w-7xl mx-auto w-full border-b border-white/[0.08]">
        <Breadcrumbs items={[{ label: 'Proyectos', href: '/proyectos' }, { label: 'Biohostels · Documentación' }]} />
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">// proyecto_biohostels · documentación_completa</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Biohostels · Terravista</h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Documentación integral del ecosistema Biohostels: resumen ejecutivo, identidad de marca, libro maestro, modelo de negocio,
          IoT, dashboard, blockchain, inversión, retornos, El Flecho, BioCoin, marco legal y roadmap. Todo organizado en micro-secciones claras.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['15 micro-secciones', '5 documentos descargables', 'IoT + Blockchain', 'BioQuest Gamificación'].map((t) => (
            <span key={t} className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-mono border border-white/[0.1] text-gray-300 bg-white/[0.02]">{t}</span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/proyectos#biohostels" className="xl-btn-secondary">← Volver a Proyectos</Link>
          <a href="#descargas" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00e9fa]/30 text-[#00e9fa] text-sm font-medium hover:bg-[#00e9fa]/[0.08] transition-colors">Ir a descargas ↓</a>
        </div>
      </header>

      <div className="px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 py-8 pr-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-gray-500 mb-3">Índice</div>
              <nav aria-label="Índice de documentación Biohostels" className="space-y-1">
                {INDEX.map((item) => {
                  const on = active === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${on ? 'bg-[#00e9fa]/[0.1] text-[#00e9fa]' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}
                    >
                      <span className="font-mono text-[10px] w-5 shrink-0 opacity-70">{item.cap}</span>
                      <span className="truncate">{item.label}</span>
                    </a>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-white/[0.08] text-[11px] text-gray-500">
                Viendo: <span className="text-gray-300">{activeLabel}</span>
              </div>
            </div>
          </aside>

          <main className="min-w-0 pb-20">
            <section id="descargas" className="scroll-mt-28 py-14">
              <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">Capítulo 00</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Documentos Descargables</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
                Descarga los documentos fuente completos. Cada archivo contiene el detalle extendido del tema indicado; las micro-secciones de abajo resumen e integran todo el contenido.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {DOCS.map((doc) => <DownloadCard key={doc.href} doc={doc} />)}
              </div>
              <div className="mt-4 rounded-xl border border-[#00C9A7]/20 bg-[#00C9A7]/[0.04] p-4 text-sm text-gray-400">
                <strong className="text-[#00C9A7]">Uso:</strong> haz clic en cualquier tarjeta para descargar el documento. Los archivos HTML se pueden abrir en navegador; el PDF es el análisis comparativo de inversión.
              </div>
            </section>

            <ResumenEjecutivo />
            <OportunidadInversion />
            <IdentidadMarca />
            <LibroMaestro />
            <ModeloNegocio />
            <EcosistemaIoT />
            <DashboardIoT />
            <BlockchainTransparencia />
            <ModeloInversion />
            <RetornosProyecciones />
            <ElFlecho />
            <BioCoin />
            <MarcoLegal />
            <BioQuest />
            <Roadmap />

            <section className="scroll-mt-28 py-14 border-t border-white/[0.08]">
              <div className="rounded-2xl border border-[#00C9A7]/25 bg-gradient-to-br from-[#0b1712] to-[#081018] p-6 md:p-8">
                <p className="text-[#00C9A7] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">// cierre_documentación</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Toda la documentación, en un solo lugar</h2>
                <p className="text-gray-400 mt-3 max-w-3xl text-sm leading-relaxed">
                  Esta página integra los contenidos de los documentos Biohostels en micro-secciones navegables. Para el detalle original completo, descarga los archivos fuente.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {DOCS.map((d) => (
                    <a key={d.href} href={d.href} download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.12] text-sm text-gray-200 hover:text-white hover:border-[#00e9fa]/40 transition-colors">
                      <span aria-hidden="true">↓</span> {d.tag} · {d.name.length > 42 ? d.name.slice(0, 42) + '…' : d.name}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </Layout>
  );
}
