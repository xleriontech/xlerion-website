import React, { useMemo, useState } from 'react';

const fmtCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
const fmtPct = (n) => `${n.toFixed(1)}%`;

const MODELS = {
  fraccionada: {
    id: 'fraccionada',
    name: 'Propiedad Fraccionada',
    short: 'Fraccionada',
    color: '#00e9fa',
    tagline: 'Propiedad real y registral sobre una fracción del proyecto.',
    ideal: 'Inversionista que busca uso personal, posesión tangible, plusvalía y renta complementaria.',
    retorno: 'Plusvalía del activo + renta cuando no se usa la villa.',
    liquidez: 'Baja/Media: venta a comprador individual.',
    gestion: 'Copropiedad con gobernanza común (p. ej. SFH / administración compartida).',
    horizonte: '6–12 meses ciclo de estructuración/comercialización (referencia del modelo).',
    riesgos: ['Dependencia de la UAF/POT para subdivisión.', 'Costos comunes de administración y mantenimiento.', 'Liquidez limitada frente a instrumentos bursátiles.'],
    fortalezas: ['Título/propiedad real sobre la fracción.', 'Modelo auto-financiable por ventas iniciales.', 'Uso personal + potencial de renta.'],
  },
  fideicomiso: {
    id: 'fideicomiso',
    name: 'Fideicomiso Inmobiliario',
    short: 'Fideicomiso',
    color: '#a5cf62',
    tagline: 'Derechos económicos sobre flujos generados por el patrimonio administrado por fiduciaria.',
    ideal: 'Inversionista pasivo que busca flujo de caja, diversificación y mayor liquidez.',
    retorno: 'Dividendos periódicos según renta operativa y distribución del fideicomiso.',
    liquidez: 'Media/Alta: mayor si las participaciones se estructuran como instrumento negociable.',
    gestion: 'Gestión profesional por sociedad fiduciaria; inversionista sin operación directa.',
    horizonte: 'Abierto o definido según el vehículo; enfoque en ingresos recurrentes.',
    riesgos: ['No hay propiedad directa del inmueble físico.', 'Dependencia de la gestión fiduciaria.', 'Riesgos regulatorios y de mercado; no hay garantía de resultado.'],
    fortalezas: ['Flujo de caja potencialmente predecible.', 'Mayor liquidez en estructuras negociables.', 'Gestión profesional y escalabilidad.'],
  },
};

const COMPARE = [
  { k: 'Naturaleza', f: 'Propiedad real/registral de fracción.', t: 'Derechos económicos sobre flujos del patrimonio.' },
  { k: 'Rol del inversionista', f: 'Copropietario, con voz en decisiones comunes.', t: 'Pasivo, sin gestión operativa directa.' },
  { k: 'Retorno principal', f: 'Plusvalía + renta por uso no propio.', t: 'Dividendos/distribuciones periódicas.' },
  { k: 'Liquidez', f: 'Baja a media.', t: 'Media a alta (según estructura).' },
  { k: 'Gestión', f: 'Administración compartida / SFH.', t: 'Sociedad fiduciaria profesional.' },
  { k: 'Regulación clave', f: 'Normas civiles/inmobiliarias, POT, UAF, Ley 675/2001.', t: 'Marco fiduciario y supervisión SFC (según vehículo).' },
];

function Stat({ label, value, hint, color }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold" style={{ color: color || '#fff' }}>{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  );
}

export default function BiohostelsBusinessModelSection() {
  const [model, setModel] = useState('fraccionada');
  const [investment, setInvestment] = useState(180000000); // COP
  const [years, setYears] = useState(5);
  const [occupancy, setOccupancy] = useState(62);
  const [nightRate, setNightRate] = useState(280000); // COP
  const [appreciation, setAppreciation] = useState(8); // % anual
  const [dividendYield, setDividendYield] = useState(9); // % anual

  const active = MODELS[model];

  const sim = useMemo(() => {
    const nights = Math.round(365 * (occupancy / 100));
    const grossAnnual = nights * nightRate;
    const opex = grossAnnual * 0.35;
    const netAnnual = Math.max(0, grossAnnual - opex);
    if (model === 'fraccionada') {
      const rentShare = netAnnual * 0.45; // porción atribuible a la fracción (ilustrativa)
      const finalValue = investment * Math.pow(1 + appreciation / 100, years);
      const totalRent = rentShare * years;
      const total = finalValue + totalRent;
      const roi = ((total - investment) / investment) * 100;
      return { nights, grossAnnual, netAnnual, annualFlow: rentShare, finalValue, total, roi, label: 'Plusvalía + renta estimada' };
    }
    const annualFlow = investment * (dividendYield / 100);
    const total = investment + annualFlow * years;
    const roi = ((total - investment) / investment) * 100;
    return { nights, grossAnnual, netAnnual, annualFlow, finalValue: investment, total, roi, label: 'Dividendos estimados' };
  }, [model, investment, years, occupancy, nightRate, appreciation, dividendYield]);

  return (
    <section id="modelo-negocio-biohostels" className="py-20 px-6 md:px-8 max-w-7xl mx-auto w-full border-t border-white/[0.06]">
      <div className="mb-10">
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">// modelo_de_negocio</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Biohostels: Propiedad Fraccionada vs. Fideicomiso</h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Comparación interactiva de dos rutas para invertir en micro-pueblos de bio-villas autosostenibles en Colombia. Ajusta el escenario para entender cómo cambian flujo, retorno y perfil de riesgo. El simulador es ilustrativo y no constituye asesoría financiera ni promesa de rentabilidad.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 mb-6">
        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-[#0a0a12]/80 p-5">
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.values(MODELS).map((m) => (
              <button key={m.id} onClick={() => setModel(m.id)} className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${model === m.id ? 'text-black border-transparent' : 'text-gray-400 border-white/[0.1] hover:text-white'}`} style={model === m.id ? { background: m.color } : undefined}>
                {m.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="min-w-0 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: active.color }}>{active.name}</p>
              <p className="text-white font-medium mb-3">{active.tagline}</p>
              <dl className="space-y-2 text-sm">
                <div><dt className="text-gray-500">Perfil ideal</dt><dd className="text-gray-300">{active.ideal}</dd></div>
                <div><dt className="text-gray-500">Retorno</dt><dd className="text-gray-300">{active.retorno}</dd></div>
                <div><dt className="text-gray-500">Liquidez</dt><dd className="text-gray-300">{active.liquidez}</dd></div>
                <div><dt className="text-gray-500">Gestión</dt><dd className="text-gray-300">{active.gestion}</dd></div>
              </dl>
            </div>
            <div className="min-w-0 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-3">Fortalezas / Riesgos</p>
              <div className="mb-3">
                <div className="text-xs text-[#a5cf62] mb-2">Fortalezas</div>
                <ul className="space-y-1 text-sm text-gray-300 list-none p-0 m-0">{active.fortalezas.map((f) => <li key={f}>• {f}</li>)}</ul>
              </div>
              <div>
                <div className="text-xs text-[#f2b23e] mb-2">Riesgos / condiciones</div>
                <ul className="space-y-1 text-sm text-gray-300 list-none p-0 m-0">{active.riesgos.map((r) => <li key={r}>• {r}</li>)}</ul>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border border-white/[0.08]">
            <table className="w-full text-sm min-w-[700px] border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-[10px] font-mono uppercase tracking-wider text-[#00e9fa] bg-[#00e9fa]/[0.07] border-b border-white/[0.08]">Criterio</th>
                  <th className="p-3 text-left text-[10px] font-mono uppercase tracking-wider text-[#00e9fa] bg-[#00e9fa]/[0.07] border-b border-white/[0.08]">Propiedad Fraccionada</th>
                  <th className="p-3 text-left text-[10px] font-mono uppercase tracking-wider text-[#00e9fa] bg-[#00e9fa]/[0.07] border-b border-white/[0.08]">Fideicomiso Inmobiliario</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.k}>
                    <td className="p-3 border-b border-white/[0.05] text-white font-medium">{row.k}</td>
                    <td className={`p-3 border-b border-white/[0.05] ${model === 'fraccionada' ? 'text-gray-200 bg-[#00e9fa]/[0.04]' : 'text-gray-400'}`}>{row.f}</td>
                    <td className={`p-3 border-b border-white/[0.05] ${model === 'fideicomiso' ? 'text-gray-200 bg-[#a5cf62]/[0.04]' : 'text-gray-400'}`}>{row.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-[#0a0a12]/80 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">Simulador ilustrativo</p>
          <div className="space-y-4">
            <label className="block text-sm">
              <div className="flex justify-between text-gray-400 mb-1"><span>Inversión</span><span className="font-mono text-white">{fmtCOP(investment)}</span></div>
              <input type="range" min="50000000" max="600000000" step="10000000" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block text-sm">
              <div className="flex justify-between text-gray-400 mb-1"><span>Horizonte</span><span className="font-mono text-white">{years} años</span></div>
              <input type="range" min="1" max="15" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block text-sm">
              <div className="flex justify-between text-gray-400 mb-1"><span>Ocupación</span><span className="font-mono text-white">{occupancy}%</span></div>
              <input type="range" min="20" max="95" step="1" value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block text-sm">
              <div className="flex justify-between text-gray-400 mb-1"><span>Tarifa noche</span><span className="font-mono text-white">{fmtCOP(nightRate)}</span></div>
              <input type="range" min="120000" max="700000" step="10000" value={nightRate} onChange={(e) => setNightRate(Number(e.target.value))} className="w-full" />
            </label>
            {model === 'fraccionada' ? (
              <label className="block text-sm">
                <div className="flex justify-between text-gray-400 mb-1"><span>Plusvalía anual</span><span className="font-mono text-white">{fmtPct(appreciation)}</span></div>
                <input type="range" min="0" max="20" step="0.5" value={appreciation} onChange={(e) => setAppreciation(Number(e.target.value))} className="w-full" />
              </label>
            ) : (
              <label className="block text-sm">
                <div className="flex justify-between text-gray-400 mb-1"><span>Yield dividendos</span><span className="font-mono text-white">{fmtPct(dividendYield)}</span></div>
                <input type="range" min="2" max="18" step="0.5" value={dividendYield} onChange={(e) => setDividendYield(Number(e.target.value))} className="w-full" />
              </label>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Flujo anual" value={fmtCOP(sim.annualFlow)} hint={sim.label} color={active.color} />
            <Stat label="ROI estimado" value={fmtPct(sim.roi)} hint={`${years} años`} />
            <Stat label="Total estimado" value={fmtCOP(sim.total)} />
            <Stat label="Noches/año" value={`${sim.nights}`} hint={`Ocupación ${occupancy}%`} />
          </div>
          <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">Escenario educativo. No incluye impuestos, financiación, vacancia real, comisiones fiduciarias ni variaciones del mercado. Antes de invertir, validar UAF/POT, licencias, estructura legal y regulación aplicable.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#f2b23e]/20 bg-[#f2b23e]/[0.04] p-4 text-sm text-gray-300">
        <strong className="text-[#f2b23e]">Validación previa (Colombia):</strong> confirmar UAF municipal, licencia de subdivisión, POT, obligaciones de urbanización, licencia de construcción y viabilidad de autosuficiencia (agua/energía/saneamiento) antes de estructurar el vehículo de inversión.
      </div>
    </section>
  );
}