import React from 'react';
import { BIO, Bar, Bullets, Card, Chip, DocSection, Field, Kpi, Note, Sub } from './ui';
import { XI, XIBadge } from './icons';

export function EcosistemaIoT() {
  const capas = [
    { icon: 'camera', t: 'Capa Dispositivos', items: ['• Sensores de energía (paneles solares)', '• Medidores de agua (lluvia + pozo)', '• Básculas de reciclaje inteligentes', '• Cámaras HD con IA', '• Sensores de clima interior', '• Controladores de luces Zigbee'] },
    { icon: 'globe', t: 'Capa Plataforma', items: ['• Cloudflare Workers (Edge Computing)', '• API REST segura', '• Base de datos PostgreSQL', '• Motor de reglas IoT', '• Integración con Polygon blockchain', '• Cifrado E2E AES-256'] },
    { icon: 'chart', t: 'Capa Visualización', items: ['• App móvil (iOS/Android)', '• Dashboard web privado', '• Panel público comunitario', '• Alertas push en tiempo real', '• Reportes PDF automáticos', '• Integración con BioCoin wallet'] },
  ];
  const flujo = [
    ['camera', 'Sensores capturan datos', 'Cada 5 minutos, sensores miden energía, agua, clima y movimiento.'],
    ['energy', 'Edge Computing procesa', 'Cloudflare Workers filtran y agregan datos en tiempo real.'],
    ['chain', 'Blockchain registra', 'Transacciones críticas se anotan en Polygon para transparencia.'],
    ['chart', 'App muestra resultados', 'Propietario ve datos privados; comunidad ve agregados.'],
  ];
  return (
    <DocSection id="iot" cap="Capítulo 06" title="Ecosistema IoT Inteligente" lead="Cada Biohostel y Microhostal está equipado con sensores IoT que monitorean recursos naturales en tiempo real, con dos niveles de visualización: privado (propietario) y público (comunidad).">
      <Sub iconName="building" title="Arquitectura del Sistema IoT" hint="3 capas">
        <div className="grid md:grid-cols-3 gap-4">
          {capas.map((c) => (
            <Card key={c.t}>
              <div className="flex items-center gap-2"><XIBadge name={c.icon} size={16} box={32} /><h4 className="font-semibold text-white">{c.t}</h4></div>
              <div className="mt-3"><Bullets items={c.items} /></div>
            </Card>
          ))}
        </div>
      </Sub>
      <div className="grid md:grid-cols-2 gap-4">
        <Sub iconName="lock" title="Vista Privada" hint="Solo para propietarios">
          <Card tone="teal">
            <p className="text-sm text-gray-400 mb-3">Cada inversionista accede desde su app móvil a datos detallados y en tiempo real de SU Biohostel:</p>
            <Bullets items={['• Consumo y generación de energía (kWh)', '• Agua captada, reciclada y consumida (litros)', '• Basura generada, reciclada y compostada (kg)', '• Control remoto de 8 puntos de iluminación', '• 4 cámaras HD con detección de movimiento', '• Temperatura, humedad y CO₂ interior', '• Saldo BioCoin y bonificaciones por reciclaje']} />
          </Card>
        </Sub>
        <Sub iconName="globe" title="Vista Pública" hint="Transparencia comunitaria">
          <Card tone="accent">
            <p className="text-sm text-gray-400 mb-3">La plataforma muestra datos agregados y anonimizados de TODOS los Biohostels, sin exponer información sensible individual:</p>
            <Bullets items={['• Producción total de energía del ecosistema', '• Agua reciclada comunitaria (litros/mes)', '• Tasa de reciclaje global (%)', '• Ingresos comunitarios mensuales', '• Nuevos lotes financiados con ganancias', '• Impuestos pagados (verificados DIAN)', '• Transacciones blockchain verificables']} />
          </Card>
        </Sub>
      </div>
      <Sub iconName="tool" title="¿Cómo Funciona el IoT en la Práctica?">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {flujo.map(([icon, t, d], i) => (
            <Card key={t}>
              <div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-mono text-gray-500">0{i + 1}</span><XI name={icon} size={16} className="text-[#00e9fa]" /></div>
              <h4 className="text-sm font-semibold text-white">{t}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{d}</p>
            </Card>
          ))}
        </div>
      </Sub>
    </DocSection>
  );
}

export function DashboardIoT() {
  const privada = [
    { icon: 'energy', t: 'Energía', badge: 'Auto-suficiente', b: BIO.teal, main: '3.2 kWh hoy', rows: [['Generada', '4.1 kWh'], ['Consumida', '3.2 kWh'], ['Excedente vendido a red', '+0.9 kWh · +12 BIO']] },
    { icon: 'water', t: 'Agua', badge: 'Reciclaje activo', b: BIO.info, main: '487 litros hoy', rows: [['Captada lluvia', '320 L'], ['Reciclada', '180 L'], ['Reserva en tanque', '2.450 L · 82%']] },
    { icon: 'recycle', t: 'Residuos', badge: '87% reciclado', b: BIO.teal, main: 'Meta basura cero', rows: [['Orgánico → Compost', '2.4 kg'], ['Reciclable', '1.8 kg'], ['No aprovechable', '0.3 kg'], ['Bonificación BioCoin', '+28 BIO este mes']] },
    { icon: 'light', t: 'Iluminación', badge: '5 activas', b: BIO.accent, main: '8 puntos IoT', rows: [['Sala Principal', '40% brillo · LED'], ['Dormitorio', 'Apagada'], ['Cocina', '100% brillo'], ['Jardín Exterior', 'Sensor movimiento']] },
    { icon: 'camera', t: 'Seguridad', badge: 'Grabando', b: '#E74C3C', main: '4 cámaras HD', rows: [['Cámaras', 'Entrada, Jardín, Cocina, Micro 1'], ['Último movimiento', 'Hace 12 min'], ['Almacenamiento cloud', '67% usado']] },
    { icon: 'climate', t: 'Ambiente', badge: 'Óptimo', b: BIO.info, main: 'Sensores interiores', rows: [['Temperatura interior', '22°C'], ['Humedad', '68%'], ['CO₂ interior', '420 ppm'], ['Clima exterior Guatapé', '18°C · Parcialmente nublado']] },
  ];
  const alertas = [
    ['check', 'Sistema solar operando al 100%', 'Hace 2 horas · Generación excedente vendida automáticamente', '14:32', BIO.teal],
    ['alert', 'Tanque de agua al 82%', 'Hace 5 horas · Se activó captación de lluvia automática', '11:15', BIO.warning],
    ['doc', 'Recolección de reciclaje programada', 'Mañana 8:00 AM · Ruta El Flecho · +15 BIO de bonificación', '09:00', BIO.info],
  ];
  const publica = [
    ['Biohostels Activos', '4', '↑ 100% operativos'],
    ['Microhostales', '8', '7/8 ocupados hoy'],
    ['Inversionistas', '47', '↑ 12 este mes'],
    ['Árboles Plantados', '1.284', '1 reserva = 1 árbol'],
  ];
  return (
    <DocSection id="dashboard" cap="Capítulo 07" title="Dashboard IoT · Vista Privada y Pública" lead="Demostración de la interfaz operativa: métricas privadas del propietario y datos públicos agregados de la comunidad Biohostels.">
      <Sub iconName="lock" title="Mi Biohostel (Privado)" hint="Ejemplo: Plot 1 · Bag End · Guatapé">
        <Card className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><div className="font-semibold text-white">Miguel E. Rodriguez Martinez</div><div className="text-xs text-gray-500">Biohostel Plot 1 · Bag End · Guatapé, Antioquia</div></div>
            <div className="flex gap-4 text-sm">
              <div><div className="text-[10px] text-gray-500 font-mono">SALDO BIOCOIN</div><div className="font-bold" style={{ color: BIO.teal }}>2.847 BIO</div></div>
              <div><div className="text-[10px] text-gray-500 font-mono">EFICIENCIA HOY</div><div className="font-bold text-white">94%</div></div>
            </div>
          </div>
        </Card>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {privada.map((p) => (
            <Card key={p.t}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2"><XIBadge name={p.icon} size={16} box={30} color={p.b} /><span className="font-semibold text-white">{p.t}</span></div>
                <Chip color={p.b}>{p.badge}</Chip>
              </div>
              <div className="mt-2 text-lg font-bold text-white">{p.main}</div>
              <div className="mt-3 space-y-1.5">
                {p.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-xs border-b border-white/[0.05] pb-1.5 last:border-0 last:pb-0">
                    <span className="text-gray-500">{k}</span><span className="text-gray-200 font-mono text-right">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Sub>
      <Sub iconName="alert" title="Alertas Recientes" hint="Vista privada">
        <div className="space-y-2">
          {alertas.map(([icon, t, d, h, c]) => (
            <div key={t} className="flex items-start gap-3 rounded-xl border p-3" style={{ borderColor: c + '44', background: c + '0d' }}>
              <span style={{ color: c }} className="mt-0.5"><XI name={icon} size={18} /></span>
              <div className="min-w-0 flex-1"><div className="text-sm font-medium text-white">{t}</div><div className="text-xs text-gray-500 mt-0.5">{d}</div></div>
              <span className="text-[11px] font-mono text-gray-500 shrink-0">{h}</span>
            </div>
          ))}
        </div>
      </Sub>
      <Sub iconName="globe" title="Comunidad Biohostels (Público)" hint="Datos agregados y anonimizados">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {publica.map(([l, v, h]) => <Kpi key={l} label={l} value={v} hint={h} />)}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Energía Generada (mes)" value="12.847" unit="kWh" hint="↑ 23% vs mes anterior" />
          <Kpi label="Agua Reciclada (mes)" value="48.320" unit="L" hint="↑ 18% eficiencia" color={BIO.info} />
          <Kpi label="Residuos Reciclados" value="892" unit="kg" hint="91% tasa de reciclaje" color={BIO.accent} />
          <Kpi label="CO₂ Compensado" value="8.4" unit="ton" hint="Equivalente 420 árboles" />
        </div>
        <div className="mt-4"><Note title="Nota de privacidad:">Los datos individuales de cada Biohostel se mantienen privados para sus propietarios. Esta vista muestra únicamente métricas agregadas y anonimizadas para transparencia comunitaria sin comprometer la privacidad.</Note></div>
      </Sub>
    </DocSection>
  );
}

export function BlockchainTransparencia() {
  const pilares = [
    ['money', 'Ingresos y Dividendos', 'Cada pago de alquiler, comisión de El Flecho y venta de energía excedente se registra en blockchain y se distribuye automáticamente vía smart contracts.'],
    ['shield', 'Impuestos Verificados', 'Todos los pagos fiscales (ICA, predial, retención, IVA, renta) se publican con comprobante DIAN, generando confianza total en la comunidad inversionista.'],
    ['building', 'Reinversión en Lotes', 'El 40% de las ganancias se reinvierte automáticamente en nuevos Biohostels, con trazabilidad completa desde la decisión hasta la escrituración.'],
  ];
  const txs = [
    ['01', 'Distribución Dividendos Q4', '47 inversionistas · 2.847 BIO c/u', '#847.293', 'Hace 2 horas', '0x7a8f...3c2d → 0x9b4e...7f1a · 133.809 BIO · Gas: 0.002 MATIC'],
    ['02', 'Pago Impuestos DIAN', 'Retención fuente · Noviembre 2026', '#847.291', 'Hace 5 horas', '0x7a8f...3c2d → 0xDIAN...gov · $892.000 COP · Verified ✓'],
    ['03', 'Inversión Lote #5 Salento', 'Compra terreno · 800 m²', '#847.285', 'Hace 1 día', '0x7a8f...3c2d → 0xNotary...col · $8.940.000 COP · Smart Contract Executed'],
    ['04', 'Quema de BioCoin (Deflación)', '2% de transacciones del mes', '#847.280', 'Hace 2 días', '0x7a8f...3c2d → 0x000...burn · 24.580 BIO · Supply reducido'],
  ];
  const beneficios = [
    ['Transparencia Total', 'Cada peso que entra y sale del ecosistema es verificable en blockchain. No hay "cajas negras" ni decisiones opacas.'],
    ['Dividendos Automáticos', 'Smart contracts distribuyen ganancias trimestralmente directo a la wallet BioCoin del inversionista, sin intermediarios.'],
    ['Gobernanza DAO', '1 BioCoin = 1 voto. Los inversionistas deciden sobre nuevos Biohostels, proveedores de El Flecho y uso del fondo de reserva.'],
    ['Liquidez Secundaria', 'Las participaciones se pueden vender en mercado secundario (exchange descentralizado) cuando el inversionista lo necesite.'],
  ];
  return (
    <DocSection id="blockchain" cap="Capítulo 08" title="Blockchain y Transparencia" lead="Transparencia inmutable en Polygon Network. Todas las transacciones comunitarias registradas y verificables por cualquier inversionista.">
      <div className="flex flex-wrap gap-2"><Chip>POLYGON NETWORK</Chip><Chip color={BIO.accent}>VERIFICABLE</Chip><Chip color={BIO.info}>Auditado por CertiK ✓</Chip></div>
      <div className="grid md:grid-cols-3 gap-4">
        {pilares.map(([icon, t, d]) => (
          <Card key={t}><XIBadge name={icon} /><h4 className="mt-3 font-semibold text-white">{t}</h4><p className="mt-2 text-sm text-gray-400 leading-relaxed">{d}</p></Card>
        ))}
      </div>
      <Sub iconName="chain" title="Ejemplo de Transacciones en Blockchain">
        <div className="space-y-3">
          {txs.map(([n, t, sub, block, ago, hash]) => (
            <div key={n} className="rounded-xl border border-[#00C9A7]/25 bg-black/30 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg grid place-items-center font-mono text-sm font-bold shrink-0" style={{ background: BIO.teal + '22', color: BIO.teal }}>{n}</span>
                  <div><div className="text-sm font-semibold text-white">{t}</div><div className="text-xs text-gray-500">{sub}</div></div>
                </div>
                <div className="text-right text-xs"><div className="text-gray-500">Block {block}</div><div style={{ color: BIO.teal }}>{ago}</div></div>
              </div>
              <div className="mt-2 font-mono text-[11px] text-gray-500 break-all">{hash}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
          <span>Total bloques: <strong className="text-white">847.293</strong></span>
          <span>Transacciones verificadas: <strong className="text-white">12.847</strong></span>
          <span>Auditado por: <strong style={{ color: BIO.teal }}>CertiK ✓</strong></span>
        </div>
      </Sub>
      <Sub iconName="star" title="Beneficios para el Inversionista">
        <div className="grid sm:grid-cols-2 gap-3">
          {beneficios.map(([t, d]) => (<Card key={t}><h4 className="font-semibold text-white">{t}</h4><p className="mt-2 text-sm text-gray-400 leading-relaxed">{d}</p></Card>))}
        </div>
      </Sub>
    </DocSection>
  );
}
