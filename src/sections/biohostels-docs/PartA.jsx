import React from 'react';
import { BIO, Bar, Bullets, Card, Chip, DocSection, Kpi, Note, Sub } from './ui';
import { XI, XIBadge } from './icons';

export function ResumenEjecutivo() {
  const pilares = [
    { t: 'Sincronización Confiable', d: 'Cero overbooking. Transparencia total. Nuestra IA verifica disponibilidad en Booking, Airbnb e iCal antes de cobrar.', i: 'shield' },
    { t: 'Regeneración', d: '1 reserva = 1 árbol. Cada transacción genera impacto ambiental positivo medible y verificable.', i: 'leaf' },
    { t: 'Innovación Pragmática', d: 'Tecnología compleja (Edge Computing / IA) con una experiencia de usuario simple e intuitiva.', i: 'rocket' },
  ];
  return (
    <DocSection id="resumen" cap="Capítulo 01" title="Resumen Ejecutivo" lead="Visión, misión y valores del ecosistema Biohostels. Documento Maestro consolidado · Noviembre 2026.">
      <div className="grid sm:grid-cols-3 gap-4">
        {pilares.map((p) => (
          <Card key={p.t}>
            <XIBadge name={p.i} />
            <h4 className="font-semibold text-white mt-3">{p.t}</h4>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">{p.d}</p>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card tone="teal">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00C9A7]">Misión</div>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">Democratizar el acceso a alojamientos sostenibles en Colombia y el mundo, eliminando la fricción del overbooking mediante inteligencia artificial y garantizando un impacto ambiental positivo por cada transacción.</p>
        </Card>
        <Card tone="accent">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4A373]">Visión</div>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">Ser la plataforma líder de ecoturismo regenerativo en Latinoamérica, integrando inversión inmobiliaria fraccionada, economía circular local y una criptomoneda ecosistémica (BioCoin) respaldada por activos reales.</p>
        </Card>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi value="32" label="Departamentos" />
        <Kpi value="12" label="Pestañas Maestras" />
        <Kpi value="3,840" label="Registros Totales" />
        <Kpi value="4" label="Biohostels Piloto" />
      </div>
    </DocSection>
  );
}

export function OportunidadInversion() {
  const diferenciadores = [
    '✓ Cero overbooking: IA verifica disponibilidad en Booking/Airbnb antes de cobrar',
    '✓ 1 reserva = 1 árbol: Impacto ambiental medible y verificable',
    '✓ IoT privado: Cada inversionista controla su Biohostel desde app móvil',
    '✓ Blockchain público: Impuestos, dividendos e inversiones 100% transparentes',
    '✓ BioCoin: Criptomoneda ecosistémica con respaldo en activos reales',
  ];
  const tags = [
    { i: 'leaf', t: 'Ecoturismo Regenerativo' },
    { i: 'energy', t: 'IoT Inteligente' },
    { i: 'chain', t: 'Blockchain Transparente' },
    { i: 'coin', t: 'BioCoin Ecosystem' },
    { i: 'box', t: 'El Flecho Marketplace' },
  ];
  return (
    <DocSection id="oportunidad" cap="Capítulo 02" title="Oportunidad de Inversión" lead="Oportunidad de inversión · Noviembre 2026. Plataforma integral de ecoturismo que combina inversión inmobiliaria fraccionada en lotes de 800 m², gestión inteligente IoT de recursos naturales, transparencia blockchain y un marketplace comunitario.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi value="$400M" label="Inversión inicial" hint="COP · 4 Biohostels piloto" />
        <Kpi value="37.5%" label="ROI Año 1" color={BIO.accent} />
        <Kpi value="3-4" label="Años payback" color={BIO.accent} />
        <Kpi value="10-13%" label="Dividendo anual" />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t.t} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium border border-[#00C9A7]/30 bg-[#00C9A7]/[0.08] text-[#00C9A7]">
            <XI name={t.i} size={14} /> {t.t}
          </span>
        ))}
      </div>
      <Sub iconName="xlerion" title="La Oportunidad">
        <p className="text-sm text-gray-300 leading-relaxed">Cada Biohostel (casa principal) contiene 2 Microhostales (unidades de alquiler para extranjeros), generando ingresos recurrentes mientras se mantiene autosuficiencia energética, hídrica y alimentaria.</p>
      </Sub>
      <Sub iconName="star" title="Diferenciadores Clave">
        <Card><Bullets items={diferenciadores} /></Card>
      </Sub>
      <Sub iconName="globe" title="Visión ampliada">
        <Note>Ser la plataforma líder de ecoturismo regenerativo en Latinoamérica, con <strong className="text-white">32 Biohostels (uno por departamento)</strong>, integrando inversión inmobiliaria, economía circular local y criptomoneda ecosistémica respaldada por activos reales.</Note>
      </Sub>
    </DocSection>
  );
}

export function IdentidadMarca() {
  const colores = [
    { n: 'Bio Green', h: '#1B4D3E', u: 'Primario · Logos, headers' },
    { n: 'Bio Dark', h: '#0F3328', u: 'Footer, contraste' },
    { n: 'Sync Teal', h: '#00C9A7', u: 'Acentos · IA · Nodos' },
    { n: 'Tierra Andina', h: '#D4A373', u: 'Acento cálido · 1 árbol' },
    { n: 'Bio Cream', h: '#FAFAF7', u: 'Fondo principal' },
  ];
  return (
    <DocSection id="marca" cap="Capítulo 03" title="Identidad de Marca" lead="Logotipo, sistema cromático, tipografía y elementos visuales del ecosistema Biohostels.">
      <Sub iconName="xlerion" title="Logotipo Principal">
        <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="shrink-0 rounded-2xl p-4" style={{ background: BIO.cream }}>
            <svg width="88" height="88" viewBox="0 0 100 100" role="img" aria-label="Logotipo Biohostels">
              <path d="M50 8 C32 8 18 22 18 40 C18 58 35 78 50 92 C65 78 82 58 82 40 C82 22 68 8 50 8 Z" fill="#1B4D3E" />
              <path d="M50 20 C38 20 28 30 28 42 C28 54 40 66 50 76 C60 66 72 54 72 42 C72 30 62 20 50 20 Z" fill="#FAFAF7" opacity="0.15" />
              <line x1="50" y1="30" x2="50" y2="68" stroke="#FAFAF7" strokeWidth="1.5" opacity="0.6" />
              <line x1="50" y1="42" x2="40" y2="36" stroke="#FAFAF7" strokeWidth="1.2" opacity="0.6" />
              <line x1="50" y1="52" x2="60" y2="46" stroke="#FAFAF7" strokeWidth="1.2" opacity="0.6" />
              <circle cx="40" cy="36" r="2.5" fill="#00C9A7" /><circle cx="60" cy="46" r="2.5" fill="#00C9A7" /><circle cx="50" cy="30" r="2.5" fill="#00C9A7" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">Concepto: fusión de tres elementos semánticos — <strong className="text-white">pin de ubicación</strong> (hospitality), <strong className="text-white">hoja estilizada</strong> (sostenibilidad) y <strong className="text-white">nodos de conexión</strong> (IA y red tecnológica).</p>
        </Card>
      </Sub>
      <Sub iconName="star" title="Sistema Cromático">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {colores.map((c) => (
            <div key={c.h} className="rounded-xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
              <div className="h-16 w-full" style={{ background: c.h }} />
              <div className="p-3">
                <div className="text-sm font-semibold text-white">{c.n}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: BIO.teal }}>{c.h}</div>
                <div className="text-[11px] text-gray-500 mt-1 leading-snug">{c.u}</div>
              </div>
            </div>
          ))}
        </div>
      </Sub>
      <div className="grid md:grid-cols-2 gap-4">
        <Sub iconName="doc" title="Montserrat" hint="Tipografía Principal · Headings">
          <Card><div className="space-y-4">
            {[['H1 · 48px · Bold 700', 'Título Principal', 'text-3xl font-bold'], ['H2 · 36px · Bold 700', 'Subtítulo', 'text-2xl font-bold'], ['H3 · 24px · SemiBold 600', 'Sección', 'text-xl font-semibold']].map(([spec, sample, cls]) => (
              <div key={spec} className="border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                <div className={`text-white ${cls}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>{sample}</div>
                <div className="text-[11px] font-mono text-gray-500 mt-1">{spec}</div>
              </div>
            ))}
          </div></Card>
        </Sub>
        <Sub iconName="doc" title="Inter" hint="Tipografía Secundaria · Cuerpo y UI">
          <Card><div className="space-y-4">
            <div className="border-b border-white/[0.06] pb-3">
              <p className="text-sm text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
              <div className="text-[11px] font-mono text-gray-500 mt-1">Body · 16px · Regular 400</div>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 rounded-lg text-sm font-medium text-black" style={{ background: BIO.teal }}>Botón Principal</span>
              <span className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-gray-300">Secundario</span>
            </div>
            <div className="text-[11px] font-mono text-gray-500">Button · 14px · Medium 500</div>
          </div></Card>
        </Sub>
      </div>
    </DocSection>
  );
}

export function LibroMaestro() {
  const tabs = [
    ['home', 'Hospedajes', 'Alojamientos eco-amigables con datos de contacto y WhatsApp', true, 'Ecolodges_Colombia_320_Actividades.xlsx'],
    ['cafe', 'Restaurantes', 'Propuestas gastronómicas saludables de la huerta a la mesa', true, 'Restaurantes_EcoSaludables_Colombia_320.xlsx'],
    ['tree', 'Parques Naturales', 'Santuarios oficiales con protocolos de reserva y entrada', true, 'Parques_Naturales_Colombia_Reservas_320.xlsx'],
    ['map', 'Experiencias', 'Aventuras al aire libre segmentadas por temáticas', true, 'Experiencias_Colombia_320_Actividades.xlsx'],
    ['box', 'Tiendas & Mercados', 'Puntos locales de comercio justo y artesanías', true, 'Tiendas_Mercados_Ecologicos_Colombia_320.xlsx'],
    ['star', 'Ocio Nocturno', 'Establecimientos de esparcimiento nocturno seguro', true, 'Ocio_Nocturno_Seguro_Colombia_320.xlsx'],
    ['cafe', 'Cafés & Panaderías', 'Cafés de especialidad y panaderías artesanales', true, 'Cafes_Panaderias_Cercanos_Colombia_320.xlsx'],
    ['leaf', 'Flora', '320 especies botánicas: orquídeas, palmas, frailejones', true, 'Flora_Significativa_Colombia_320.xlsx'],
    ['shield', 'Mamíferos', '320 especies: jaguares, osos de anteojos, delfines', false, 'Mamiferos_Colombia_320.xlsx'],
    ['sun', 'Aves', '320 especies: colibríes, tucanes, tángaras', false, 'Aves_Colombia_320.xlsx'],
    ['globe', 'Reptiles', '320 especies: iguanas, boas, caimanes', false, 'Reptiles_Colombia_320.xlsx'],
    ['star', 'Insectos', '320 especies: mariposas, escarabajos, abejas', false, 'Insectos_Colombia_320.xlsx'],
  ];
  const hechas = tabs.filter((t) => t[3]).length;
  const pct = Math.round((hechas / tabs.length) * 100);
  const pendientes = tabs.filter((t) => !t[3]);
  return (
    <DocSection id="libro" cap="Capítulo 04" title="Libro Maestro de Ecoturismo" lead="12 pestañas maestras · 320 registros cada una · 32 departamentos de Colombia.">
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h4 className="font-semibold text-white">Progreso de Organización</h4>
          <span className="font-mono text-sm" style={{ color: BIO.teal }}>{hechas} de {tabs.length} pestañas · {pct}%</span>
        </div>
        <Bar label="Registros organizados" pct={pct} right={`${hechas * 320} / 3.840`} />
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: BIO.green }} /> {hechas} pestañas completas ({(hechas * 320).toLocaleString('es-CO')} registros)</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: BIO.accent }} /> {pendientes.length} pestañas pendientes (fauna)</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: BIO.teal }} /> Meta: 3.840 registros totales</div>
        </div>
      </Card>
      <Sub iconName="book" title="Pestañas Maestras">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tabs.map(([icon, name, desc, ok, file]) => (
            <Card key={name} className={ok ? '' : 'border-[#D4A373]/30'}>
              <div className="flex items-start gap-3">
                <XIBadge name={icon} color={ok ? BIO.teal : BIO.accent} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-white">{name}</h4>
                    <Chip color={ok ? BIO.teal : BIO.accent}>{ok ? 'Completa' : 'Pendiente'}</Chip>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{desc}</p>
                  <code className="block mt-2 text-[11px] font-mono break-all px-2 py-1 rounded bg-black/40" style={{ color: BIO.teal }}>{file}</code>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Sub>
      <Sub iconName="doc" title="Archivos Pendientes de Subir">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pendientes.map(([icon, name, desc, , file]) => (
            <Card key={name} tone="accent">
              <XIBadge name={icon} color={BIO.accent} />
              <h4 className="text-sm font-semibold text-white mt-2">{name}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{desc}</p>
              <code className="block mt-2 text-[11px] font-mono break-all px-2 py-1 rounded bg-black/40" style={{ color: BIO.accent }}>{file}</code>
            </Card>
          ))}
        </div>
      </Sub>
    </DocSection>
  );
}

export function ModeloNegocio() {
  const plots = [1, 2, 3, 4];
  const recursos = [
    { icon: 'water', t: 'Recursos Naturales', d: 'Agua de lluvia (50.000 L/año), energía solar (15 kW), alimentos orgánicos (huerta 500 m²), compostaje.', c: BIO.info },
    { icon: 'money', t: 'Recursos Monetarios', d: 'Alquiler Microhostales ($2.400-3.600 USD/mes), plusvalía (8-12% anual), comisiones El Flecho (5-8%).', c: BIO.accent },
    { icon: 'leaf', t: 'Recursos de Impacto', d: '1 reserva = 1 árbol, reducción CO₂ 48.5%, economía circular local, empleo comunitario.', c: BIO.teal },
  ];
  return (
    <DocSection id="modelo" cap="Capítulo 05" title="Modelo de Negocio" lead="Biohostels + Microhostales · 4 plots de 800 m² cada uno.">
      <Sub iconName="building" title="Arquitectura del Ecosistema">
        <Card>
          <div className="text-center mb-5">
            <span className="inline-block px-5 py-2 rounded-xl font-semibold text-sm" style={{ background: BIO.green, color: BIO.cream }}>LOTE COMPLETO (3.200 m²)</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {plots.map((p) => (
              <div key={p} className="rounded-xl border border-white/[0.08] bg-black/30 p-3">
                <div className="flex items-baseline justify-between"><span className="text-[10px] font-mono tracking-wider text-gray-500">PLOT {p}</span><span className="text-[10px] font-mono" style={{ color: BIO.teal }}>800 m²</span></div>
                <div className="mt-2 text-sm font-bold text-white">BIOHOSTEL</div>
                <div className="text-[11px] text-gray-500">Casa Principal</div>
                <div className="mt-3 space-y-1.5">
                  <div className="rounded-md px-2 py-1.5 text-[11px] flex items-center gap-2" style={{ background: BIO.teal + '1a', color: BIO.teal }}><XI name="home" size={14} /> Micro 1</div>
                  <div className="rounded-md px-2 py-1.5 text-[11px] flex items-center gap-2" style={{ background: BIO.teal + '1a', color: BIO.teal }}><XI name="home" size={14} /> Micro 2</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Sub>
      <div className="grid md:grid-cols-2 gap-4">
        <Sub iconName="building" title="Biohostel (Casa Principal)" hint="Centro de operaciones">
          <Card tone="teal">
            <p className="text-sm text-gray-400 mb-3">Centro de operaciones, administración y recursos compartidos.</p>
            <Bullets items={['✓ Sistemas de captación de agua centralizados', '✓ Paneles solares comunitarios (15 kW)', '✓ Huerta orgánica principal (500 m²)', '✓ Biodigestor central', '✓ Áreas comunes (cocina, lavandería, recepción)']} />
          </Card>
        </Sub>
        <Sub iconName="home" title="Microhostales (Unidades de Alquiler)" hint="Generación de ingresos">
          <Card tone="accent">
            <p className="text-sm text-gray-400 mb-3">Generación de ingresos por alquiler a extranjeros.</p>
            <Bullets items={['✓ 2 unidades por Biohostel (8 total)', '✓ Autosuficientes pero conectadas a recursos', '✓ Diseñadas para turismo de larga/media estancia', '✓ Operación bajo propiedad fraccionada o fideicomiso', '✓ Ingresos: $1.200-1.800 USD/mes c/u']} />
          </Card>
        </Sub>
      </div>
      <Sub iconName="recycle" title="Flujo de Recursos y Monetización">
        <div className="grid md:grid-cols-3 gap-3">
          {recursos.map((r) => (
            <Card key={r.t}>
              <div className="flex items-center gap-2"><XIBadge name={r.icon} size={16} box={30} color={r.c} /><h4 className="text-sm font-semibold" style={{ color: r.c }}>{r.t}</h4></div>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{r.d}</p>
            </Card>
          ))}
        </div>
      </Sub>
    </DocSection>
  );
}
