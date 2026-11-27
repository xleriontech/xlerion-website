export const METRICS = {
  energia: { key: 'energia', label: 'Energía', short: 'Energía', unit: 'kWh', color: '#f2b23e', icon: 'bolt' },
  agua: { key: 'agua', label: 'Agua', short: 'Agua', unit: 'm³', color: '#4fc8dd', icon: 'drop' },
  basura: { key: 'basura', label: 'Residuos', short: 'Residuos', unit: 'kg', color: '#e0785a', icon: 'trash' },
  generacion: { key: 'generacion', label: 'Generación biogás', short: 'Biogás', unit: 'kWh', color: '#a5cf62', icon: 'flame' },
};

export const PERIODS = {
  hoy: { key: 'hoy', label: 'Hoy', days: 1 },
  '7d': { key: '7d', label: '7 días', days: 7 },
  '30d': { key: '30d', label: '30 días', days: 30 },
};

export const FACTORS = {
  biogasKwhPerKg: 0.62,
  compostYield: 0.3,
  recycleYield: 0.86,
  co2OrganicKg: 0.45,
  co2RecycleKg: 1.15,
  eurPerKwh: 0.16,
  eurPerKgRecycle: 0.31,
  eurPerKgCompost: 0.09,
};

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LOT_DEFS = [
  { id: 'V-01', name: 'Arrayán', sector: 'Mirador', area: 1240, plot: { x: 268, y: 58, w: 168, h: 106 } },
  { id: 'V-02', name: 'Boldo', sector: 'Mirador', area: 1480, plot: { x: 470, y: 46, w: 186, h: 118 } },
  { id: 'V-03', name: 'Quillay', sector: 'Bosque Alto', area: 1105, plot: { x: 692, y: 64, w: 168, h: 108 } },
  { id: 'V-04', name: 'Litre', sector: 'Ladera', area: 1690, plot: { x: 240, y: 214, w: 196, h: 124 } },
  { id: 'V-05', name: 'Peumo', sector: 'Ladera', area: 1310, plot: { x: 478, y: 214, w: 186, h: 128 } },
  { id: 'V-06', name: 'Maitén', sector: 'Quebrada', area: 1150, plot: { x: 704, y: 222, w: 172, h: 118 } },
  { id: 'V-07', name: 'Olivillo', sector: 'Ribera', area: 1820, plot: { x: 280, y: 404, w: 204, h: 132 } },
  { id: 'V-08', name: 'Tepa', sector: 'Ribera', area: 1540, plot: { x: 528, y: 414, w: 196, h: 124 } },
];

function makeMicro(id, seed, factor) {
  const rand = mulberry32(seed);
  const base = {
    energia: (18 + rand() * 18) * factor,
    agua: (0.5 + rand() * 1.2) * factor,
    basura: (8 + rand() * 10) * factor,
    dinero: (120 + rand() * 180) * factor, // USD/día equivalente
  };
  const hist = { energia: [], agua: [], basura: [], dinero: [] };
  for (let day = 0; day < 30; day++) {
    const wave = 1 + 0.12 * Math.sin((day / 7) * Math.PI * 2 + seed * 0.01);
    const weekend = day % 7 >= 5 ? 1.08 : 1;
    ['energia', 'agua', 'basura', 'dinero'].forEach((m) => {
      const noise = 0.82 + rand() * 0.36;
      hist[m].push(Math.round(base[m] * wave * weekend * noise * 100) / 100);
    });
  }
  return { id, base, hist, organico: 0.42 + rand() * 0.18, reciclable: 0.22 + rand() * 0.14 };
}

function aggregateHist(items, key) {
  const out = [];
  for (let i = 0; i < 30; i++) out.push(items.reduce((s, it) => s + (it.hist[key][i] || 0), 0));
  return out;
}

export const VILLAS = LOT_DEFS.map((d, lotIdx) => {
  const sections = Array.from({ length: 4 }).map((_, sIdx) => {
    const sectionId = `${d.id}-B${sIdx + 1}`;
    const micros = Array.from({ length: 2 }).map((__, mIdx) => makeMicro(`${sectionId}-M${mIdx + 1}`, 1000 + lotIdx * 100 + sIdx * 10 + mIdx, 0.85 + lotIdx * 0.03));
    const hist = {
      energia: aggregateHist(micros, 'energia'),
      agua: aggregateHist(micros, 'agua'),
      basura: aggregateHist(micros, 'basura'),
      dinero: aggregateHist(micros, 'dinero'),
    };
    const base = {
      energia: micros.reduce((s, m) => s + m.base.energia, 0),
      agua: micros.reduce((s, m) => s + m.base.agua, 0),
      basura: micros.reduce((s, m) => s + m.base.basura, 0),
      dinero: micros.reduce((s, m) => s + m.base.dinero, 0),
    };
    const organico = micros.reduce((s, m) => s + m.organico, 0) / micros.length;
    const reciclable = micros.reduce((s, m) => s + m.reciclable, 0) / micros.length;
    return { id: sectionId, name: `Biohostel ${sIdx + 1}`, microhostales: micros, hist, base, organico, reciclable };
  });

  const hist = {
    energia: aggregateHist(sections, 'energia'),
    agua: aggregateHist(sections, 'agua'),
    basura: aggregateHist(sections, 'basura'),
    dinero: aggregateHist(sections, 'dinero'),
  };
  const base = {
    energia: sections.reduce((s, x) => s + x.base.energia, 0),
    agua: sections.reduce((s, x) => s + x.base.agua, 0),
    basura: sections.reduce((s, x) => s + x.base.basura, 0),
    dinero: sections.reduce((s, x) => s + x.base.dinero, 0),
  };
  const organico = sections.reduce((s, x) => s + x.organico, 0) / sections.length;
  const reciclable = sections.reduce((s, x) => s + x.reciclable, 0) / sections.length;
  return { ...d, sections, hist, base, organico, reciclable, guests: 4 + lotIdx, capacity: 8, tags: ['4 Biohostels', '8 Microhostales'] };
});

export const sum = (a) => a.reduce((x, y) => x + y, 0);
export const avg = (a) => (a.length ? sum(a) / a.length : 0);

export function rawValue(v, m, period, drift) {
  const arr = v.hist[m];
  if (!arr) return 0;
  if (period === 'hoy') return arr[29] * (drift ? (drift[m] ?? 1) : 1);
  if (period === '7d') return sum(arr.slice(23));
  return sum(arr);
}

export function genFromWaste(v, basuraKg) {
  const org = basuraKg * v.organico;
  const rec = basuraKg * v.reciclable;
  const rechazo = basuraKg - org - rec;
  const biogas = org * FACTORS.biogasKwhPerKg;
  const compost = org * FACTORS.compostYield;
  const reciclado = rec * FACTORS.recycleYield;
  const co2 = org * FACTORS.co2OrganicKg + rec * FACTORS.co2RecycleKg;
  const income = biogas * FACTORS.eurPerKwh + rec * FACTORS.eurPerKgRecycle + compost * FACTORS.eurPerKgCompost;
  return { org, rec, rechazo: rechazo + org * 0.08, biogas, compost, reciclado, co2, income };
}

export function metricValue(v, m, period, drift) {
  if (m === 'generacion') return genFromWaste(v, rawValue(v, 'basura', period, drift)).biogas;
  return rawValue(v, m, period, drift);
}

export function deltaVsPrev(v, m, period, drift) {
  const arr = v.hist[m];
  if (!arr) return null;
  if (period === 'hoy') {
    const prev = avg(arr.slice(22, 29));
    return prev ? (arr[29] * (drift ? (drift[m] ?? 1) : 1)) / prev - 1 : null;
  }
  if (period === '7d') {
    const prev = sum(arr.slice(16, 23));
    return prev ? sum(arr.slice(23)) / prev - 1 : null;
  }
  return null;
}

export function statusFor(value, average) {
  const r = average ? value / average : 1;
  if (r < 0.82) return { key: 'eficiente', label: 'Eficiente', color: '#a5cf62' };
  if (r <= 1.18) return { key: 'estable', label: 'Estable', color: '#f2b23e' };
  return { key: 'elevado', label: 'Elevado', color: '#e0785a' };
}

const nf0 = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export function fmt(n, decimals = false) {
  if (decimals || (Math.abs(n) < 100 && Math.round(n * 10) !== Math.round(n) * 10)) return nf1.format(n);
  return nf0.format(Math.round(n));
}
export const fmtMoney = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);