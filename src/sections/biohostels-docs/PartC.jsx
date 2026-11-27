import React from 'react';
import { BIO, Bar, Bullets, Card, Chip, DataTable, DocSection, Field, Kpi, Note, Sub } from './ui';
import { XIBadge } from './icons';

export function ModeloInversion() {
  const estructura = [
    ['building', '1 Biohostel', 'Casa principal con recursos compartidos: paneles solares, captación de agua, huerta orgánica, biodigestor', '~400 m² construidos'],
    ['home', '2 Microhostales', 'Unidades independientes para alquiler a extranjeros, autosuficientes pero conectadas a recursos del Biohostel', '~200 m² c/u'],
    ['tree', 'Áreas Comunes', 'Senderos, zonas verdes, huerta comunitaria, espacio de coworking, área de fogata', '~200 m² libres'],
  ];
  const comparativo = [
    ['Naturaleza', 'Propiedad real registral', 'Derechos económicos'],
    ['ROI Principal', 'Plusvalía + renta', 'Dividendos periódicos'],
    ['Liquidez', 'Baja (venta individual)', 'Alta (mercado secundario)'],
    ['Uso Personal', 'Sí (6 semanas/año)', 'No'],
    ['Gestión', 'Copropietaria', 'Profesional externalizada'],
    ['Regulación', 'Ley 675/2001 (PH)', 'SFC + Decreto 1357/2018'],
  ];
  return (
    <DocSection id="inversion" cap="Capítulo 09" title="Modelo de Inversión" lead="Dos caminos para la inversión en bio-villas autosostenibles en Colombia: Propiedad Fraccionada y Fideicomiso Inmobiliario.">
      <Sub iconName="building" title="Estructura de un Lote de 800 m²">
        <div className="grid md:grid-cols-3 gap-4">
          {estructura.map(([icon, t, d, m]) => (
            <Card key={t}><XIBadge name={icon} /><h4 className="mt-3 font-semibold text-white">{t}</h4><p className="mt-2 text-sm text-gray-400 leading-relaxed">{d}</p><div className="mt-3 text-xs font-mono" style={{ color: BIO.teal }}>{m}</div></Card>
          ))}
        </div>
      </Sub>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card tone="teal">
          <div className="flex items-center justify-between gap-2 flex-wrap"><div><div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00C9A7]">Opción A</div><h3 className="text-xl font-semibold text-white mt-1">Propiedad Fraccionada</h3><p className="text-xs text-gray-400">Recomendado para uso personal + inversión</p></div><Chip>Escritura individual</Chip></div>
          <div className="grid grid-cols-2 gap-2 mt-4"><Field label="Inversión Inicial" value="$80-120M COP" color={BIO.teal} /><Field label="Retorno Mensual" value="$2.400-3.600 USD" /><Field label="Plusvalía Anual" value="8-12%" /><Field label="Payback" value="3-4 años" /></div>
          <p className="text-[11px] text-gray-500 mt-2">Por Biohostel completo (800 m²) · Alquiler de 2 Microhostales</p>
          <div className="mt-4"><Bullets items={['✓ Escritura pública individual', '✓ Uso personal rotativo (6 semanas/año)', '✓ Márgenes 35-40% vs 10-15% tradicional', '✓ Retorno rápido (6-12 meses)', '⚠ Liquidez limitada', '⚠ Costos compartidos de mantenimiento']} /></div>
        </Card>
        <Card tone="accent">
          <div className="flex items-center justify-between gap-2 flex-wrap"><div><div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4A373]">Opción B</div><h3 className="text-xl font-semibold text-white mt-1">Fideicomiso Inmobiliario</h3><p className="text-xs text-gray-400">Recomendado para inversionistas pasivos</p></div><Chip color={BIO.accent}>Supervisado SFC</Chip></div>
          <div className="grid grid-cols-2 gap-2 mt-4"><Field label="Inversión Mínima" value="$5-10M COP" color={BIO.accent} /><Field label="Dividendos Anuales" value="10-13%" /><Field label="Liquidez" value="Alta" /><Field label="Gestión" value="Profesional" /></div>
          <p className="text-[11px] text-gray-500 mt-2">Participaciones fraccionadas · Fiduciaria supervisada por SFC</p>
          <div className="mt-4"><Bullets items={['✓ Entrada baja (cientos de miles de pesos)', '✓ Sin responsabilidad operativa', '✓ Supervisión SFC', '✓ Diversificación posible', '⚠ No hay propiedad directa', '⚠ Capital fiduciario: $3.417M COP']} /></div>
        </Card>
      </div>
      <Sub iconName="chart" title="Comparativo Directo">
        <DataTable head={['Aspecto', 'Propiedad Fraccionada', 'Fideicomiso']} rows={comparativo} />
      </Sub>
    </DocSection>
  );
}

export function RetornosProyecciones() {
  const proyeccion = [['Año 1', '$230M', '$150M', '$450M'], ['Año 2', '$380M', '$260M', '$620M'], ['Año 3', '$580M', '$420M', '$850M'], ['Año 4', '$820M', '$620M', '$1.100M'], ['Año 5', '$1.200M', '$950M', '$1.500M']];
  const lotes = [
    ['EN PROCESO', BIO.teal, '#5', 'Salento, Quindío', '800 m² · 2 Microhostales planificados', 65, '$8.940.000 COP'],
    ['PLANIFICADO', BIO.info, '#6', 'Tayrona, Magdalena', '800 m² · 2 Microhostales planificados', 25, '$3.450.000 COP'],
    ['APROBADO', BIO.accent, '#7', 'Mesa de los Santos', '800 m² · 2 Microhostales planificados', 10, '$1.200.000 COP'],
  ];
  const impuestos = [
    ['Impuesto de Industria y Comercio', 'Q4 2026', '$1.245.000', 'Pagado'],
    ['Impuesto Predial Unificado', '2026', '$3.890.000', 'Pagado'],
    ['Retención en la Fuente (alquileres)', 'Nov 2026', '$892.000', 'Pagado'],
    ['IVA Plataforma Digital (Biohostels)', 'Q4 2026', '$567.000', 'Pendiente'],
    ['Impuesto de Renta (BioCoin gains)', '2026', '$2.100.000', 'Pagado'],
  ];
  return (
    <DocSection id="retornos" cap="Capítulo 10" title="Retornos y Proyecciones Financieras" lead="Proyección financiera basada en 4 Biohostels piloto, con distribución transparente de ingresos, reinversión en nuevos lotes e impuestos verificados.">
      <Sub iconName="chart" title="Proyección Financiera (4 Biohostels Piloto)">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3"><Kpi label="Inversión Total" value="$400M" hint="COP" /><Kpi label="Ingresos Año 1" value="$230M" hint="COP" /><Kpi label="Utilidad Neta A1" value="$150M" hint="COP" /><Kpi label="ROI Año 1" value="37.5%" color={BIO.accent} /><Kpi label="Valor Año 5" value="$750M" hint="COP" /></div>
      </Sub>
      <Sub iconName="chart" title="Proyección de Ingresos a 5 Años" hint="M COP">
        <DataTable head={['Periodo', 'Ingresos', 'Utilidad Neta', 'Valor del Proyecto']} rows={proyeccion} />
        <div className="mt-4 grid gap-3"><Bar label="Ingresos Año 5" pct={100} right="$1.200M" color={BIO.green} /><Bar label="Utilidad Neta Año 5" pct={79} right="$950M" color={BIO.teal} /><Bar label="Valor del Proyecto Año 5" pct={100} right="$1.500M" color={BIO.accent} /></div>
      </Sub>
      <div className="grid md:grid-cols-2 gap-4">
        <Sub iconName="money" title="Distribución de Ingresos Mensuales">
          <Card><div className="space-y-4"><Bar label="Reinversión en lotes" pct={40} color={BIO.green} /><Bar label="Dividendos inversionistas" pct={35} color={BIO.teal} /><Bar label="Impuestos y legal" pct={15} color={BIO.accent} /><Bar label="Mantenimiento" pct={10} color={BIO.warning} /></div></Card>
        </Sub>
        <Sub iconName="money" title="Ingresos Comunitarios (Mes Actual)" hint="Ejemplo dashboard público">
          <Card><div className="space-y-2 text-sm">
            {[['Alquiler Microhostales', '$18.400.000 COP', '8 unidades · 7 ocupadas'], ['Venta Energía Excedente', '$2.100.000 COP', 'Red eléctrica local'], ['Comisiones El Flecho', '$1.850.000 COP', 'Marketplace proveedores · 5%']].map(([l, v, h]) => (
              <div key={l} className="flex justify-between gap-3 border-b border-white/[0.06] pb-2 last:border-0 last:pb-0"><div><div className="text-gray-200">{l}</div><div className="text-[11px] text-gray-500">{h}</div></div><div className="font-mono text-white shrink-0">{v}</div></div>
            ))}
            <div className="flex justify-between gap-3 pt-1 font-semibold"><span className="text-white">TOTAL INGRESOS</span><span style={{ color: BIO.teal }}>$22.350.000 COP</span></div>
          </div></Card>
        </Sub>
      </div>
      <Sub iconName="building" title="Expansión de Lotes Financiados" hint="Pagados con ganancias comunitarias">
        <div className="grid md:grid-cols-3 gap-3">
          {lotes.map(([st, c, id, lugar, desc, pct, monto]) => (
            <Card key={id}><div className="flex items-center justify-between"><Chip color={c}>{st}</Chip><span className="text-xs font-mono text-gray-500">Lote {id}</span></div><div className="mt-3 font-semibold text-white">{lugar}</div><div className="text-xs text-gray-500">{desc}</div><div className="mt-4"><Bar label="Progreso" pct={pct} color={c} /></div><div className="mt-3 pt-3 border-t border-white/[0.06] text-xs"><div className="text-gray-500">Financiado con</div><div className="font-mono font-semibold" style={{ color: c }}>{monto}</div><div className="text-gray-500">de ganancias comunitarias</div></div></Card>
          ))}
        </div>
      </Sub>
      <Sub iconName="shield" title="Impuestos Pagados (Transparencia Total)">
        <DataTable head={['Concepto', 'Periodo', 'Monto', 'Estado']} rows={impuestos} foot={['TOTAL PAGADO 2026', '', '$8.694.000', '100% Transparente']} />
        <div className="mt-3"><Note>Todos los pagos fiscales visibles para la comunidad · Verificado DIAN.</Note></div>
      </Sub>
    </DocSection>
  );
}

export function ElFlecho() {
  const cats = [
    ['cafe', 'Alimentación Local', 'Restaurantes, panaderías, productores agrícolas, cafés de especialidad'],
    ['tool', 'Oficios y Servicios', 'Electricistas, plomeros, constructores, jardineros certificados'],
    ['star', 'Artesanías y Productos', 'Tejidos, cerámica, productos naturales, cosmética orgánica'],
    ['map', 'Experiencias', 'Guías locales, talleres, actividades culturales, turismo vivencial'],
    ['send', 'Transporte', 'Conductores locales, bicicletas, transporte comunitario'],
    ['shield', 'Salud y Bienestar', 'Terapeutas, masajes, medicina tradicional, yoga'],
  ];
  return (
    <DocSection id="flecho" cap="Capítulo 11" title="El Flecho · Marketplace Comunitario" lead="Marketplace de proveedores locales del ecosistema Biohostels. Conecta huéspedes e inversionistas con la economía circular local.">
      <Sub iconName="map" title="Estructura Jerárquica de Comunidad">
        <Card><div className="flex flex-wrap gap-2 items-center text-sm">{['Biohostels (Plataforma Madre)', 'Departamentos (32)', 'Municipios/Pueblos', 'Veredas', 'Biohostels / El Flecho'].map((s, i, a) => (<React.Fragment key={s}><span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-gray-200">{s}</span>{i < a.length - 1 && <span className="text-gray-600">→</span>}</React.Fragment>))}</div></Card>
      </Sub>
      <Sub iconName="box" title="Categorías de Proveedores">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{cats.map(([icon, t, d]) => (<Card key={t}><XIBadge name={icon} /><h4 className="mt-3 font-semibold text-white">{t}</h4><p className="mt-1 text-sm text-gray-400 leading-relaxed">{d}</p></Card>))}</div>
      </Sub>
      <Sub iconName="tool" title="Modelo de Operación">
        <div className="grid md:grid-cols-2 gap-4">
          <Card tone="teal"><h4 className="font-semibold text-white">Para el Huésped / Inversionista</h4><div className="mt-3"><Bullets items={['• Al reservar Microhostal, ve proveedores "El Flecho" cercanos', '• Contrata servicios directamente (comida, experiencias, transporte)', '• Sistema de recomendaciones basado en ubicación', '• Pagos integrados en BioCoin o fiat']} /></div></Card>
          <Card tone="accent"><h4 className="font-semibold text-white">Para el Proveedor Local</h4><div className="mt-3"><Bullets items={['• Registro y validación por vereda/municipio', '• Sistema de reputación con reseñas de huéspedes', '• Comisión baja (5-8%) vs 15-30% de plataformas tradicionales', '• Certificación "Flecho Verificado" para proveedores confiables']} /></div></Card>
        </div>
      </Sub>
    </DocSection>
  );
}
