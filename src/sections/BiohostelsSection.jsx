import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { METRICS, PERIODS, VILLAS, fmt, fmtMoney, genFromWaste, metricValue, rawValue } from '../data/biohostels';

function Stat({ label, value, unit, color }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">
        <span style={color ? { color } : undefined}>{value}</span>
        {unit && <span className="text-xs text-gray-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function getVal(entity, key, period, drift) {
  const d = drift || { energia: 1, agua: 1, basura: 1 };
  const arr = entity.hist?.[key] || [];
  if (!arr.length) return 0;
  const base = period === 'hoy' ? arr[29] : period === '7d' ? arr.slice(23).reduce((a, b) => a + b, 0) : arr.reduce((a, b) => a + b, 0);
  return key === 'dinero' ? base : base * (d[key] ?? 1);
}

// "V-04-B1-M1" → "Microhostal 1" (misma etiqueta que en el mapa)
const microLabel = (id) => `Microhostal ${String(id).split('-').slice(-1)[0].replace(/^M/, '')}`;

function EntityCard({ entity, onClose }) {
  if (!entity) return null;
  const { type, data, period, drift } = entity;
  const d = drift || { energia: 1, agua: 1, basura: 1 };
  const energia = getVal(data, 'energia', period, d);
  const agua = getVal(data, 'agua', period, d);
  const basura = getVal(data, 'basura', period, d);
  const dinero = getVal(data, 'dinero', period, d);
  const waste = genFromWaste(data, basura);
  const title = type === 'lot' ? `Lote ${data.name}` : type === 'biohostel' ? data.name : microLabel(data.id);
  const subtitle = type === 'lot' ? `${data.id} · ${data.sector}` : type === 'biohostel' ? `${data.id} · 2 Microhostales` : `${data.id} · Aporta a su Biohostel`;

  return (
    <div className="w-full xl:w-[340px] rounded-xl border border-[#00e9fa]/30 bg-[#081018]/95 backdrop-blur p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00e9fa]">{type === 'lot' ? 'Lote' : type === 'biohostel' ? 'Biohostel' : 'Microhostal'}</div>
          <div className="text-lg font-semibold text-white">{title}</div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-lg leading-none px-1" aria-label="Cerrar">×</button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-white/[0.03] border border-white/[0.06] p-2"><div className="text-gray-500 text-[10px] font-mono">ENERGÍA</div><div className="text-[#f2b23e] font-semibold">{fmt(energia, true)} kWh</div></div>
        <div className="rounded-md bg-white/[0.03] border border-white/[0.06] p-2"><div className="text-gray-500 text-[10px] font-mono">AGUA</div><div className="text-[#4fc8dd] font-semibold">{fmt(agua, true)} m³</div></div>
        <div className="rounded-md bg-white/[0.03] border border-white/[0.06] p-2"><div className="text-gray-500 text-[10px] font-mono">RESIDUOS</div><div className="text-[#e0785a] font-semibold">{fmt(basura, true)} kg</div></div>
        <div className="rounded-md bg-white/[0.03] border border-white/[0.06] p-2"><div className="text-gray-500 text-[10px] font-mono">DINERO</div><div className="text-[#a5cf62] font-semibold">{fmtMoney(dinero)}</div></div>
      </div>
      <div className="mt-3 text-xs text-gray-400 border-t border-white/[0.08] pt-3 space-y-1">
        <div className="flex justify-between"><span>Biogás estimado</span><span className="text-[#a5cf62] font-mono">{fmt(waste.biogas, true)} kWh</span></div>
        <div className="flex justify-between"><span>CO₂ evitado</span><span className="text-white font-mono">{fmt(waste.co2, true)} kg</span></div>
      </div>
    </div>
  );
}

function parseVB(vb) { const [x, y, w, h] = vb.split(' ').map(Number); return { x, y, w, h }; }
function lerp(a, b, t) { return a + (b - a) * t; }
function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

const FLOWS = [
  { key: 'agua', color: '#4fc8dd' },
  { key: 'residuos', color: '#e0785a' },
  { key: 'dinero', color: '#a5cf62' },
];

function DetailBlock({ title, subtitle, rows }) {
  return (
    <g>
      <rect x="40" y="24" width="820" height="552" rx="20" fill="#111c14" stroke="#ffffff14" />
      <text x="450" y="78" textAnchor="middle" fontSize="34" fill="#fff" fontWeight="700">{title}</text>
      <text x="450" y="106" textAnchor="middle" fontSize="14" fill="#9fd3ff" fontFamily="monospace">{subtitle}</text>
      <line x1="90" y1="130" x2="810" y2="130" stroke="#ffffff14" />
      {rows.map((r, i) => {
        const yy = 176 + i * 68;
        return (
          <g key={r.label}>
            <rect x="90" y={yy - 34} width="720" height="54" rx="12" fill="#ffffff04" stroke="#ffffff0a" />
            <text x="118" y={yy} fontSize="17" fill="#c8d5ca">{r.label}</text>
            <text x="782" y={yy} textAnchor="end" fontSize="21" fill={r.color || '#fff'} fontFamily="monospace" fontWeight="700">{r.value}</text>
          </g>
        );
      })}
    </g>
  );
}

function TerrainMap({ values, metric, selected, onSelect, zoomed, onResetZoom, focus, onFocus, onClearFocus, period, drift, onEntity }) {
  const color = METRICS[metric].color;
  const selectedVilla = VILLAS.find((v) => v.id === selected);
  const targetVB = zoomed && selectedVilla ? '0 0 900 600' : '0 0 1000 640';
  const [vb, setVb] = useState(targetVB);
  const [fade, setFade] = useState(zoomed ? 0 : 1); // 1 = vista general, 0 = detalle
  const animRef = useRef();

  useEffect(() => {
    const from = parseVB(vb);
    const to = parseVB(targetVB);
    if (from.x === to.x && from.y === to.y && from.w === to.w && from.h === to.h) { setFade(zoomed ? 0 : 1); return; }
    const start = performance.now();
    const dur = 450;
    cancelAnimationFrame(animRef.current);
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const e = ease(t);
      setVb(`${lerp(from.x, to.x, e)} ${lerp(from.y, to.y, e)} ${lerp(from.w, to.w, e)} ${lerp(from.h, to.h, e)}`);
      setFade(zoomed ? 1 - e : e);
      if (t < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [targetVB]); // eslint-disable-line

  const focusRows = useMemo(() => {
    if (!focus || !selectedVilla) return [];
    const d = drift[selectedVilla.id] || { energia: 1, agua: 1, basura: 1 };
    const data = focus.data;
    const energia = getVal(data, 'energia', period, d);
    const agua = getVal(data, 'agua', period, d);
    const basura = getVal(data, 'basura', period, d);
    const dinero = getVal(data, 'dinero', period, d);
    const waste = genFromWaste(data, basura);
    return [
      { label: 'Genera · Biogás potencial', value: `${fmt(waste.biogas, true)} kWh`, color: '#a5cf62' },
      { label: 'Gasta · Energía', value: `${fmt(energia, true)} kWh`, color: '#f2b23e' },
      { label: 'Usa · Agua', value: `${fmt(agua, true)} m³`, color: '#4fc8dd' },
      { label: 'Genera · Residuos', value: `${fmt(basura, true)} kg`, color: '#e0785a' },
      { label: 'Aporta · Flujo monetario', value: fmtMoney(dinero), color: '#a5cf62' },
      { label: 'Evita · CO₂', value: `${fmt(waste.co2, true)} kg`, color: '#fff' },
    ];
  }, [focus, period, drift, selectedVilla]);

  const detailOpacity = 1 - fade;
  const overviewOpacity = fade;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0a0a12]/80 p-3 sm:p-4 relative min-h-[420px]">
      {/* Cabecera: navegación + título del lote + métrica activa */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          {zoomed && selectedVilla && !focus && (
            <button onClick={onResetZoom} className="px-3 py-1.5 rounded-md text-xs font-mono border border-white/15 bg-black/60 text-gray-200 hover:text-white hover:border-white/30 transition-colors">← Ver todos los lotes</button>
          )}
          {zoomed && selectedVilla && focus && (
            <button onClick={onClearFocus} className="px-3 py-1.5 rounded-md text-xs font-mono border border-[#00e9fa]/30 bg-black/60 text-[#00e9fa] hover:text-white transition-colors">← Volver al lote</button>
          )}
          {!zoomed && <span className="px-3 py-1.5 text-xs font-mono text-gray-500">Vista general · 8 lotes</span>}
          {zoomed && selectedVilla && (
            <div className="leading-tight">
              <div className="text-white font-semibold text-sm">Lote {selectedVilla.name}</div>
              <div className="text-[11px] font-mono text-[#9fd3ff]">{selectedVilla.id} · {selectedVilla.sector} · 4 secciones · 4 Biohostels · 8 Microhostales</div>
            </div>
          )}
        </div>
        {zoomed && (
          <span className="px-3 py-1.5 rounded-md text-xs font-mono border shrink-0" style={{ background: color + '20', borderColor: color, color }}>Métrica: {METRICS[metric].label}</span>
        )}
      </div>

      <svg viewBox={vb} className="w-full h-auto select-none" role="img" aria-label="Plano interactivo de lotes Biohostels">
        <defs>
          <pattern id="bioGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeOpacity="0.035" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="1000" height="640" fill="#0b120d" />
        <rect x="0" y="0" width="1000" height="640" fill="url(#bioGrid)" />

        {/* VISTA GENERAL — grilla ordenada 4×2 que aprovecha todo el plano */}
        <g opacity={overviewOpacity} style={{ pointerEvents: overviewOpacity > 0.5 ? 'auto' : 'none' }}>
          {(() => {
            const M = 24, GX = 18, GY = 20, top = 26;
            const cw = (1000 - M * 2 - GX * 3) / 4;
            const ch = (640 - top * 2 - GY) / 2;
            return VILLAS.map((v, i) => {
              const x = M + (i % 4) * (cw + GX);
              const y = top + Math.floor(i / 4) * (ch + GY);
              const isSel = selected === v.id;
              const row = (yy, label, val, valColor) => (
                <>
                  <text x={x + 18} y={yy} fontSize="12" fill="#6d8694" fontFamily="monospace">{label}</text>
                  <text x={x + cw - 18} y={yy} textAnchor="end" fontSize="13" fill={valColor || '#d7e3da'} fontFamily="monospace" fontWeight="700">{val}</text>
                </>
              );
              return (
                <g key={v.id} onClick={() => { onSelect(v.id); onEntity({ type: 'lot', data: v, period, drift: drift[v.id] }); }} style={{ cursor: 'pointer' }}>
                  <rect x={x} y={y} width={cw} height={ch} rx="16" fill={isSel ? color + '33' : color + '14'} stroke={isSel ? color : color + '55'} strokeWidth={isSel ? 2.5 : 1.2} />
                  <text x={x + 18} y={y + 34} fontSize="14" fill="#9fd3ff" fontFamily="monospace">{v.id}</text>
                  <text x={x + 18} y={y + 74} fontSize="27" fill="#fff" fontWeight="700">{v.name}</text>
                  <text x={x + 18} y={y + 100} fontSize="14" fill="#b7c7b9">{v.sector}</text>
                  <line x1={x + 18} y1={y + 120} x2={x + cw - 18} y2={y + 120} stroke="#ffffff18" />
                  {row(y + 150, 'BIOHOSTELS', '4')}
                  {row(y + 176, 'MICROHOSTALES', '8')}
                  {row(y + 202, 'ÁREA', `${v.area.toLocaleString('es-CL')} m²`)}
                  <text x={x + 18} y={y + ch - 52} fontSize="11" fill="#6d8694" fontFamily="monospace" letterSpacing="1">{METRICS[metric].label.toUpperCase()}</text>
                  <text x={x + 18} y={y + ch - 20} fontSize="26" fill={color} fontFamily="monospace" fontWeight="700">{fmt(values[v.id], metric === 'agua')} <tspan fontSize="14">{METRICS[metric].unit}</tspan></text>
                </g>
              );
            });
          })()}
        </g>

        {/* LOTE EN ZOOM — GRILLA ORDENADA 2x2 */}
        {detailOpacity > 0.01 && selectedVilla && !focus && (() => {
          const v = selectedVilla;
          const M = 24, GAP = 16, top = 16;
          const gridW = 900 - M * 2;
          const gridH = 600 - top - 16;
          const cardW = (gridW - GAP) / 2;
          const cardH = (gridH - GAP) / 2;
          const areas = [
            { x: M, y: top, s: v.sections[0] },
            { x: M + cardW + GAP, y: top, s: v.sections[1] },
            { x: M, y: top + cardH + GAP, s: v.sections[2] },
            { x: M + cardW + GAP, y: top + cardH + GAP, s: v.sections[3] },
          ];
          const d = drift[v.id] || { energia: 1, agua: 1, basura: 1 };
          const unitOf = (val) => `${fmt(val, metric === 'agua')} ${METRICS[metric].unit}`;
          const bhValOf = (ent) => metric === 'generacion'
            ? genFromWaste(ent, getVal(ent, 'basura', period, d)).biogas
            : getVal(ent, metric, period, d);

          return (
            <g opacity={detailOpacity} style={{ pointerEvents: detailOpacity > 0.5 ? 'auto' : 'none' }}>
              {areas.map((a) => {
                const bhW = cardW - 56;
                const bh = { x: a.x + cardW / 2, top: a.y + 46, h: 60 };
                const mW = 170, mH = 58;
                const mTop = a.y + cardH - 80;
                const mY = mTop + mH / 2;
                const m1 = { x: a.x + cardW * 0.27 };
                const m2 = { x: a.x + cardW * 0.73 };
                const secNum = a.s.name.replace('Biohostel ', '');
                return (
                  <g key={a.s.id}>
                    <rect x={a.x} y={a.y} width={cardW} height={cardH} rx="16" fill="#141f17" stroke="#ffffff14" />
                    <text x={a.x + 18} y={a.y + 27} fontSize="12" fill="#7fb0cb" fontFamily="monospace">SECCIÓN {secNum}</text>
                    <text x={a.x + cardW - 18} y={a.y + 27} textAnchor="end" fontSize="13" fill={color} fontFamily="monospace" fontWeight="700">{unitOf(bhValOf(a.s))}</text>
                    <line x1={a.x + 18} y1={a.y + 40} x2={a.x + cardW - 18} y2={a.y + 40} stroke="#ffffff12" />

                    {/* Biohostel */}
                    <g onClick={() => onFocus({ type: 'biohostel', data: a.s, period, drift: d })} style={{ cursor: 'pointer' }}>
                      <rect x={bh.x - bhW / 2} y={bh.top} width={bhW} height={bh.h} rx="12" fill="#0f2b3a" stroke={color} strokeWidth="2.2" />
                      <text x={bh.x} y={bh.top + 28} textAnchor="middle" fontSize="17" fill="#fff" fontWeight="700">{a.s.name}</text>
                      <text x={bh.x} y={bh.top + 47} textAnchor="middle" fontSize="11" fill="#8fdfff" fontFamily="monospace">recibe de 2 microhostales</text>
                    </g>

                    {/* Flujos paralelos microhostal → biohostel (sin cruces) */}
                    {[{ m: a.s.microhostales[0], box: m1, target: bh.x - 56 }, { m: a.s.microhostales[1], box: m2, target: bh.x + 56 }].map(({ m, box, target }) => (
                      <g key={`flow-${m.id}`}>
                        {FLOWS.map((f, i) => {
                          const off = (i - 1) * 8;
                          const x1 = box.x + off;
                          const y1 = mTop;
                          const x2 = target + off;
                          const y2 = bh.top + bh.h;
                          return (
                            <g key={f.key}>
                              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={f.color} strokeWidth="2.4" strokeOpacity="0.9" strokeLinecap="round" />
                              <path d={`M ${x2 - 5} ${y2 + 9} L ${x2 + 5} ${y2 + 9} L ${x2} ${y2 + 1} Z`} fill={f.color} fillOpacity="0.95" />
                            </g>
                          );
                        })}
                      </g>
                    ))}

                    {/* Microhostales */}
                    {[{ m: a.s.microhostales[0], pos: m1, label: 'Microhostal 1' }, { m: a.s.microhostales[1], pos: m2, label: 'Microhostal 2' }].map(({ m, pos, label }) => (
                      <g key={m.id} onClick={() => onFocus({ type: 'microhostal', data: m, period, drift: d })} style={{ cursor: 'pointer' }}>
                        <rect x={pos.x - mW / 2} y={mTop} width={mW} height={mH} rx="12" fill="#183225" stroke={color} strokeWidth="1.8" />
                        <text x={pos.x} y={mTop + 24} textAnchor="middle" fontSize="13" fill="#fff" fontWeight="600">{label}</text>
                        <text x={pos.x} y={mTop + 44} textAnchor="middle" fontSize="12" fill={color} fontFamily="monospace">{unitOf(bhValOf(m))}</text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* SUB-ZOOM: DETALLE DEL ELEMENTO */}
        {detailOpacity > 0.01 && selectedVilla && focus && (
          <g opacity={detailOpacity} style={{ pointerEvents: detailOpacity > 0.5 ? 'auto' : 'none' }}>
            <DetailBlock
              title={focus.type === 'biohostel' ? focus.data.name : microLabel(focus.data.id)}
              subtitle={focus.type === 'biohostel' ? `${focus.data.id} · Genera, gasta y recibe recursos de 2 microhostales` : `${focus.data.id} · Aporta agua, residuos y dinero a su Biohostel`}
              rows={focusRows}
            />
          </g>
        )}
      </svg>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-400">
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#0f2b3a] border border-[#00e9fa]" /> Biohostel</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#183225] border border-[#7bc67b]" /> Microhostal</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-0.5 bg-[#4fc8dd]" /> Agua</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-0.5 bg-[#e0785a]" /> Residuos</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-0.5 bg-[#a5cf62]" /> Dinero</span>
        <span className="text-gray-500 basis-full">{focus ? 'Detalle de generación y gasto. Usa "Volver al lote".' : 'Clic en un Biohostel o Microhostal para ver su detalle.'}</span>
      </div>
    </div>
  );
}

export default function BiohostelsSection() {
  const [selected, setSelected] = useState('V-04');
  const [zoomed, setZoomed] = useState(true);
  const [focus, setFocus] = useState(null);
  const [metric, setMetric] = useState('energia');
  const [period, setPeriod] = useState('hoy');
  const [entity, setEntity] = useState(null);
  const [drift, setDrift] = useState(() => Object.fromEntries(VILLAS.map((v) => [v.id, { energia: 1, agua: 1, basura: 1 }])));

  useEffect(() => {
    const t = setInterval(() => {
      setDrift((prev) => {
        const next = {};
        for (const v of VILLAS) {
          const d = prev[v.id];
          const walk = (x) => Math.min(1.16, Math.max(0.88, x + (Math.random() - 0.5) * 0.045));
          next[v.id] = { energia: walk(d.energia), agua: walk(d.agua), basura: walk(d.basura) };
        }
        return next;
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const v = VILLAS.find((x) => x.id === selected) || VILLAS[0];
    setEntity({ type: 'lot', data: v, period, drift: drift[v.id] });
  }, [selected]); // eslint-disable-line

  const values = useMemo(() => {
    const out = {};
    for (const v of VILLAS) out[v.id] = metricValue(v, metric, period, drift[v.id]);
    return out;
  }, [metric, period, drift]);

  const totals = useMemo(() => {
    let energia = 0, agua = 0, basura = 0, biogas = 0, dinero = 0;
    for (const v of VILLAS) {
      energia += rawValue(v, 'energia', period, drift[v.id]);
      agua += rawValue(v, 'agua', period, drift[v.id]);
      const b = rawValue(v, 'basura', period, drift[v.id]);
      basura += b; biogas += genFromWaste(v, b).biogas; dinero += rawValue(v, 'dinero', period, drift[v.id]);
    }
    return { energia, agua, basura, biogas, dinero };
  }, [period, drift]);

  const selectedDrift = drift[selected] || { energia: 1, agua: 1, basura: 1 };

  return (
    <section id="biohostels" className="py-20 px-6 md:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <p className="text-[#00e9fa] font-mono text-[11px] uppercase tracking-[0.3em] mb-3">// proyecto_destacado</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Biohostels · Terravista</h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Cada lote se divide en 4 secciones. Cada sección tiene 1 Biohostel y 2 Microhostales. Los microhostales alimentan al Biohostel con agua, residuos y dinero. Haz clic en cualquier elemento para ver sus datos.
        </p>
                <div className="mt-5 flex flex-wrap gap-3">
          <a href="#modelo-negocio-biohostels" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00e9fa]/30 text-[#00e9fa] text-sm font-medium hover:bg-[#00e9fa]/[0.08] transition-colors">Ver modelo de negocio interactivo →</a>
          <Link to="/proyectos/biohostels" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00C9A7]/30 text-[#00C9A7] text-sm font-medium hover:bg-[#00C9A7]/[0.08] transition-colors">Documentación completa Biohostels →</Link>
          <Link to="/proyectos/biohostels#bioquest" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4A373]/30 text-[#D4A373] text-sm font-medium hover:bg-[#D4A373]/[0.08] transition-colors">BioQuest · Gamificación →</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Stat label="Energía" value={fmt(totals.energia)} unit="kWh" color="#f2b23e" />
        <Stat label="Agua" value={fmt(totals.agua, true)} unit="m³" color="#4fc8dd" />
        <Stat label="Residuos" value={fmt(totals.basura, true)} unit="kg" color="#e0785a" />
        <Stat label="Biogás" value={fmt(totals.biogas, true)} unit="kWh" color="#a5cf62" />
        <Stat label="Flujo monetario" value={fmtMoney(totals.dinero)} color="#a5cf62" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {Object.values(METRICS).map((m) => (
            <button key={m.key} onClick={() => setMetric(m.key)} className={`px-3 py-2 rounded-md text-xs font-mono uppercase tracking-wider border transition-colors ${metric === m.key ? 'text-black border-transparent' : 'text-gray-400 border-white/[0.1] hover:text-white hover:border-white/20'}`} style={metric === m.key ? { background: m.color } : undefined}>{m.short}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          {Object.values(PERIODS).map((p) => (
            <button key={p.key} onClick={() => { setPeriod(p.key); if (entity) setEntity({ ...entity, period: p.key }); }} className={`px-3 py-2 rounded-md text-xs font-mono border transition-colors ${period === p.key ? 'bg-white/10 text-white border-white/20' : 'text-gray-500 border-white/[0.08] hover:text-white'}`}>{p.label}</button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
        <TerrainMap
          values={values} metric={metric} selected={selected}
          onSelect={(id) => { setSelected(id); setZoomed(true); setFocus(null); }}
          zoomed={zoomed} onResetZoom={() => { setZoomed(false); setFocus(null); }}
          focus={focus} onFocus={(f) => { setFocus(f); setEntity(f); }} onClearFocus={() => setFocus(null)}
          period={period} drift={drift}
          onEntity={(e) => setEntity(e)}
        />
        <div className="xl:sticky xl:top-24">
          {entity ? (
            <EntityCard
              entity={{ ...entity, period, drift: entity.type === 'lot' ? drift[entity.data.id] : selectedDrift }}
              onClose={() => setEntity(null)}
            />
          ) : (
            <div className="w-full xl:w-[340px] rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs text-gray-500 font-mono">
              Selecciona un lote, Biohostel o Microhostal para ver sus datos aquí.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
