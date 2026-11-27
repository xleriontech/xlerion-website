import React from 'react';
import { BIO, Bar, Bullets, Card, Chip, DataTable, DocSection, Field, Kpi, Note, Step, Sub } from './ui';
import { XI, XIBadge } from './icons';

export function BioQuest() {
  const rarezas = [
    { name: 'COMÚN', icon: 'leaf', desc: 'Especies frecuentes en el área', reward: '5-10 BIO', color: '#9CA3AF' },
    { name: 'RARA', icon: 'spark', desc: 'Especies poco comunes o estacionales', reward: '20-50 BIO', color: '#3B82F6' },
    { name: 'ÉPICA', icon: 'search', desc: 'Especies endémicas o en peligro', reward: '100-200 BIO', color: '#8B5CF6' },
    { name: 'LEGENDARIA', icon: 'trophy', desc: 'Especies icónicas o muy escasas', reward: '500+ BIO', color: '#F59E0B' },
  ];

  const categorias = [
    { icon: 'leaf', title: 'Flora', total: '320 especies', color: BIO.green, items: ['✓ Orquídeas nativas', '✓ Palmas endémicas', '✓ Frailejones de páramo', '✓ Plantas medicinales'], example: 'Plot 1 (Guatapé): 12 especies de orquídeas' },
    { icon: 'sun', title: 'Aves', total: '320 especies', color: BIO.teal, items: ['✓ Colibríes endémicos', '✓ Tucanes tropicales', '✓ Tángaras coloridas', '✓ Aves rapaces'], example: 'Plot 2 (Salento): 8 especies de colibríes' },
    { icon: 'shield', title: 'Mamíferos', total: '320 especies', color: BIO.accent, items: ['✓ Jaguares (cámaras trampa)', '✓ Osos de anteojos', '✓ Delfines rosados', '✓ Monos aulladores'], example: 'Plot 3 (Tayrona): 5 especies de primates' },
    { icon: 'spark', title: 'Insectos', total: '320 especies', color: '#8B5CF6', items: ['✓ Mariposas morpho', '✓ Escarabajos rinoceronte', '✓ Abejas polinizadoras', '✓ Libélulas gigantes'], example: 'Plot 4 (Nocaima): 15 especies de mariposas' },
  ];

  const gameplay = [
    { time: '07:30 AM', title: 'Misión Diaria Completada', icon: 'sun', desc: '"Fotografía el amanecer desde el mirador del Biohostel"', rewards: ['+10 BIO', '+50 XP'], color: BIO.green },
    { time: '09:15 AM', title: 'Especie Descubierta', icon: 'search', desc: '"Colibrí Esmeralda (Chlorostilbon mellisugus) · Rara"', rewards: ['+20 BIO', '+100 XP', 'Nueva especie'], color: BIO.teal },
    { time: '11:00 AM', title: 'Logro Desbloqueado', icon: 'trophy', desc: '"Ornitólogo Novato · Identifica 5 aves diferentes en un día"', rewards: ['+50 BIO', '+200 XP', 'Medalla'], color: BIO.accent },
    { time: '02:30 PM', title: 'Especie Legendaria Encontrada', icon: 'leaf', desc: '"Orquídea Fantasma (Dendrophylax lindenii) · Legendaria"', rewards: ['+500 BIO', '+1000 XP', 'Primera en el servidor'], color: '#8B5CF6' },
  ];

  const tech = [
    { icon: 'mobile', title: 'App Móvil BioQuest', color: BIO.teal, items: ['✓ Escaneo de especies con IA (computer vision)', '✓ Geolocalización precisa dentro del Biohostel', '✓ BioDex personal con filtros y búsqueda', '✓ Notificaciones push de especies cercanas', '✓ Integración con wallet BioCoin'] },
    { icon: 'chain', title: 'Blockchain Polygon', color: BIO.info, items: ['✓ Smart contracts para distribución de BIO', '✓ NFTs de especies legendarias (ERC-721)', '✓ Registro inmutable de descubrimientos', '✓ Tablas de clasificación descentralizadas', '✓ Transacciones de bajo costo (<$0.01)'] },
    { icon: 'spark', title: 'IA de Identificación', color: BIO.accent, items: ['✓ Modelo entrenado con 1,280 especies colombianas', '✓ Reconocimiento por foto, sonido o descripción', '✓ Validación comunitaria (crowdsourcing)', '✓ Integración con iNaturalist y GBIF', '✓ Actualización continua con nuevos avistamientos'] },
    { icon: 'signal', title: 'IoT Biodiversidad', color: '#8B5CF6', items: ['✓ Cámaras trampa para mamíferos nocturnos', '✓ Sensores acústicos para aves e insectos', '✓ Estaciones meteorológicas micro-climáticas', '✓ Alertas automáticas de especies raras', '✓ Datos abiertos para investigación científica'] },
  ];

  const roadmap = [
    { n: '01', t: 'Fase Piloto', m: 'Mes 1-2', c: BIO.green, items: ['• Lanzamiento en 1 Biohostel piloto (Guatapé)', '• Catálogo inicial de 50 especies locales', '• App móvil básica con escaneo de fotos', '• Sistema de recompensas en BIO (testnet)', '• 100 usuarios beta testers'] },
    { n: '02', t: 'Fase Expansión', m: 'Mes 3-6', c: BIO.teal, items: ['• 4 Biohostels activos con BioQuest', '• Catálogo completo de 320 especies por categoría', '• IA de identificación avanzada', '• Smart contracts en Polygon mainnet', '• NFTs de especies legendarias', '• 1,000 usuarios activos'] },
    { n: '03', t: 'Fase Gamificación Avanzada', m: 'Mes 7-12', c: BIO.accent, items: ['• 10 Biohostels con BioQuest', '• Modo multijugador cooperativo', '• Eventos especiales (migraciones, floraciones)', '• Integración con El Flecho (recompensas físicas)', '• Competencias inter-Biohostel', '• 5,000 usuarios activos'] },
    { n: '04', t: 'Fase Ecosistema Completo', m: 'Año 2', c: '#8B5CF6', items: ['• 32 Biohostels (1 por departamento)', '• Realidad aumentada para identificación', '• Datos científicos ciudadanos abiertos', '• Alianzas con universidades y ONGs', '• Programa de conservación financiado por BIO', '• 50,000+ usuarios activos'] },
  ];

  const nextSteps = [
    'Validar catálogo de especies: revisar Libro Maestro y priorizar especies por Biohostel',
    'Diseñar UX/UI de la app: wireframes y prototipos de BioQuest mobile',
    'Desarrollar smart contracts: contratos de recompensas en Polygon testnet',
    'Instalar IoT en Plot 1: cámaras trampa y sensores acústicos en Guatapé',
    'Lanzar beta cerrada: 100 usuarios testers en el primer Biohostel',
    'Iterar y escalar: ajustar mecánicas según feedback y expandir',
  ];

  return (
    <DocSection
      id="bioquest"
      cap="Capítulo 14"
      title="BioQuest · Gamificación Ecológica"
      lead="Sistema de gamificación ecológica integrado en Biohostels que convierte la biodiversidad local de cada lote (800 m²) en una experiencia interactiva de descubrimiento, aprendizaje y recompensas con BioCoin."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi value="1,280" label="Especies catalogadas" color={BIO.teal} />
        <Kpi value="64" label="Logros desbloqueables" color={BIO.accent} />
        <Kpi value="500" unit="BIO" label="Recompensa máxima" color="#F59E0B" />
        <Kpi value="32" label="Departamentos activos" color={BIO.info} />
      </div>

      <Sub iconName="target" title="¿Qué es BioQuest?" hint="Concepto">
        <Card>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            <strong className="text-white">BioQuest</strong> es un sistema de gamificación ecológica integrado en la plataforma Biohostels que convierte la biodiversidad local de cada lote (800 m²) en una experiencia interactiva de descubrimiento, aprendizaje y recompensas. Los huéspedes, inversionistas y comunidad local pueden explorar, identificar y coleccionar especies nativas mientras contribuyen a la conservación y generan valor económico mediante BioCoin.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card tone="dark"><div className="mb-3 text-[#00C9A7]"><XI name="target" size={26} /></div><h4 className="font-semibold text-white mb-1">Objetivo Principal</h4><p className="text-sm text-gray-400">Fomentar la conexión emocional con la biodiversidad local, educar sobre especies nativas y recompensar comportamientos sostenibles.</p></Card>
            <Card tone="dark"><div className="mb-3 text-[#00C9A7]"><XI name="chain" size={26} /></div><h4 className="font-semibold text-white mb-1">Integración</h4><p className="text-sm text-gray-400">Conectado con IoT (sensores de biodiversidad), Blockchain (BioCoin rewards), El Flecho (proveedores locales) y el Libro Maestro (datos de especies).</p></Card>
            <Card tone="dark"><div className="mb-3 text-[#00C9A7]"><XI name="spark" size={26} /></div><h4 className="font-semibold text-white mb-1">Impacto</h4><p className="text-sm text-gray-400">Cada especie descubierta genera datos científicos ciudadanos, contribuye a la conservación y fortalece la economía local.</p></Card>
          </div>
        </Card>
      </Sub>

      <Sub iconName="game" title="Sistema de Juego" hint="Mecánicas">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{ i: 'search', t: 'Descubrimiento', d: 'Explora el Biohostel y sus alrededores para encontrar especies nativas. Usa la app para escanear, fotografiar e identificar flora y fauna.' }, { i: 'book', t: 'Colección', d: 'Cada especie descubierta se añade a tu "BioDex" personal. Completa colecciones por departamento, ecosistema o rareza para desbloquear logros.' }, { i: 'target', t: 'Misiones', d: 'Completa desafíos diarios, semanales y especiales: "Fotografía 5 orquídeas diferentes", "Identifica 3 aves endémicas", etc.' }, { i: 'trophy', t: 'Competencia', d: 'Tablas de clasificación por Biohostel, vereda y departamento. Compite con otros huéspedes y gana recompensas exclusivas.' }].map((m) => (
            <Card key={m.t}><div className="mb-3 text-[#00C9A7]"><XI name={m.i} size={26} /></div><h4 className="font-semibold text-white mb-2">{m.t}</h4><p className="text-sm text-gray-400 leading-relaxed">{m.d}</p></Card>
          ))}
        </div>
        <Card>
          <div className="flex items-center gap-2 mb-4 text-[#00C9A7]"><XI name="target" size={20} /><h4 className="font-semibold text-white">Sistema de Rareza de Especies</h4></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rarezas.map((r) => (
              <div key={r.name} className="text-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold mb-3 text-white" style={{ background: r.color + '33', border: `1px solid ${r.color}66`, color: r.color }}>{r.name}</div>
                <div className="mb-2 flex justify-center" style={{ color: r.color }}><XI name={r.icon} size={28} /></div>
                <div className="text-sm text-gray-400">{r.desc}</div>
                <div className="text-xs mt-2 font-mono" style={{ color: r.color }}>Recompensa: {r.reward}</div>
              </div>
            ))}
          </div>
        </Card>
      </Sub>

      <Sub iconName="leaf" title="Especies por Biohostel" hint="Biodiversidad">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {categorias.map((c) => (
            <Card key={c.title} className="h-full">
              <div className="text-center mb-4"><div className="mb-2 flex justify-center" style={{ color: c.color }}><XI name={c.icon} size={30} /></div><h4 className="font-semibold text-white">{c.title}</h4><div className="text-sm text-gray-500 mt-1">{c.total}</div></div>
              <Bullets items={c.items} />
              <div className="mt-4 pt-4 border-t border-white/[0.08] text-xs"><div className="text-gray-500">Ejemplo</div><div className="font-semibold mt-1" style={{ color: c.color }}>{c.example}</div></div>
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <Card>
            <div className="flex items-start gap-4">
              <div className="text-[#00C9A7]"><XI name="leaf" size={34} /></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white">Reptiles · 320 especies</h4>
                <p className="text-sm text-gray-400 mt-1">Iguanas verdes, boas constrictoras, caimanes de anteojos, geckos nocturnos y tortugas de río. Cada Biohostel tiene un promedio de 8-12 especies de reptiles nativos en sus 800 m².</p>
                <div className="text-xs text-gray-500 mt-2">Ejemplo Plot 1: <span className="text-[#00C9A7] font-semibold">6 especies de reptiles</span></div>
              </div>
            </div>
          </Card>
        </div>
      </Sub>

      <Sub iconName="coin" title="Sistema BioCoin Rewards" hint="Recompensas">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Card><div className="mb-3 text-[#00C9A7]"><XI name="camera" size={26} /></div><h4 className="font-semibold text-white mb-3">Fotografía de Especies</h4><Bullets items={['• Especie común: 5 BIO', '• Especie rara: 20 BIO', '• Especie épica: 100 BIO', '• Especie legendaria: 500 BIO']} /></Card>
          <Card><div className="mb-3 text-[#00C9A7]"><XI name="target" size={26} /></div><h4 className="font-semibold text-white mb-3">Misiones Completadas</h4><Bullets items={['• Misión diaria: 10 BIO', '• Misión semanal: 50 BIO', '• Colección completa: 200 BIO', '• Logro especial: 100-1000 BIO']} /></Card>
          <Card><div className="mb-3 text-[#00C9A7]"><XI name="star" size={26} /></div><h4 className="font-semibold text-white mb-3">Bonificaciones Especiales</h4><Bullets items={['• Primera especie del día: +5 BIO', '• Racha de 7 días: +50 BIO', '• Compartir en redes: +10 BIO', '• Referir amigo: +100 BIO']} /></Card>
        </div>
        <Card tone="teal">
          <div className="flex items-center gap-2 mb-4 text-[#00C9A7]"><XI name="coin" size={20} /><h4 className="font-semibold text-white">¿Qué puedes hacer con tus BIO?</h4></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[['building', 'Descuento en Reservas', '5% de descuento por cada 100 BIO usados'], ['box', 'El Flecho Marketplace', 'Compra productos locales con BIO'], ['tree', 'Plantar Árboles', '10 BIO = 1 árbol plantado en tu nombre'], ['star', 'NFTs Exclusivos', 'Colecciona arte digital de especies raras']].map(([i, t, d]) => (
              <div key={t} className="rounded-xl border border-white/[0.08] bg-black/20 p-4"><div className="mb-2 text-[#00C9A7]"><XI name={i} size={24} /></div><div className="font-semibold text-white text-sm">{t}</div><div className="text-xs text-gray-400 mt-1">{d}</div></div>
            ))}
          </div>
        </Card>
      </Sub>

      <Sub iconName="users" title="Ejemplo de Gameplay" hint="Experiencia">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-[#00C9A7]/10 border border-[#00C9A7]/20 flex items-center justify-center text-[#00C9A7]"><XI name="users" size={28} /></div>
            <div>
              <h4 className="font-semibold text-white">María García · Huésped Plot 1 (Guatapé)</h4>
              <p className="text-sm text-gray-400">Día 3 de su estancia · Nivel 5 Exploradora</p>
            </div>
          </div>
          <div className="space-y-3">
            {gameplay.map((g) => (
              <div key={g.time} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4" style={{ borderLeftColor: g.color, borderLeftWidth: 3 }}>
                <div className="flex items-start gap-3">
                  <span className="text-[#00C9A7] mt-0.5"><XI name={g.icon} size={22} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white text-sm">{g.time} · {g.title}</div>
                    <p className="text-sm text-gray-400 mt-1">{g.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-2">{g.rewards.map((r) => <Chip key={r} color={g.color}>{r}</Chip>)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4 flex-wrap">
            <div><div className="text-xs text-gray-500">Progreso del día</div><div className="text-2xl font-bold text-[#00C9A7]">580 BIO · 1,350 XP</div></div>
            <div className="text-right"><div className="text-xs text-gray-500">Nivel actual</div><div className="text-2xl font-bold text-white">Nivel 6</div></div>
          </div>
        </Card>
      </Sub>

      <Sub iconName="tool" title="Integración Técnica" hint="Tecnología">
        <div className="grid md:grid-cols-2 gap-4">
          {tech.map((t) => (
            <Card key={t.title}>
              <div className="flex items-center gap-3 mb-4"><div style={{ color: t.color }}><XI name={t.icon} size={26} /></div><h4 className="font-semibold text-white">{t.title}</h4></div>
              <Bullets items={t.items} />
            </Card>
          ))}
        </div>
      </Sub>

      <Sub iconName="map" title="Roadmap BioQuest" hint="Plan">
        <div className="grid md:grid-cols-2 gap-4">{roadmap.map((r) => <Step key={r.n} n={r.n} title={r.t} meta={r.m} color={r.c} items={r.items} />)}</div>
      </Sub>

      <Sub iconName="rocket" title="Próximos Pasos para Implementar BioQuest" hint="Acción">
        <Card tone="teal">
          <ol className="list-none p-0 m-0 space-y-2">
            {nextSteps.map((p, i) => (
              <li key={p} className="flex gap-3 text-sm text-gray-300">
                <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-[11px] font-mono font-bold" style={{ background: BIO.teal + '22', color: BIO.teal }}>{i + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </Card>
        <div className="mt-4">
          <Note title="Fuente:">Contenido integrado desde el anexo <span className="font-mono text-[#00C9A7]">biogamification.html</span> (BioQuest · Gamificación Ecológica, v1.0). Adaptado al diseño Xlerion.</Note>
        </div>
      </Sub>
    </DocSection>
  );
}
