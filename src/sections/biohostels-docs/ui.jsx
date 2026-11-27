import React from 'react';
import { XI } from './icons';

/** Paleta oficial del ecosistema Biohostels (Documento Maestro · Capítulo 02). */
export const BIO = {
  green: '#1B4D3E', // Bio Green   · primario
  dark: '#0F3328',  // Bio Dark    · footer / contraste
  teal: '#00C9A7',  // Sync Teal   · acentos, IA, nodos
  accent: '#D4A373', // Tierra Andina · acento cálido "1 árbol"
  cream: '#FAFAF7',  // Bio Cream   · fondo principal
  danger: '#E74C3C',
  warning: '#F39C12',
  info: '#4FC8DD',
};

/**
 * Contenedor de una micro-sección del documento.
 * `cap` es el rótulo de capítulo (Capítulo 01, …) y `id` el ancla del índice.
 */
export function DocSection({ id, cap, title, lead, children }) {
  return (
    <section id={id} className="scroll-mt-28 py-14 border-t border-white/[0.08]">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00e9fa]">{cap}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
      {lead && (
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">{lead}</p>
      )}
      <div className="mt-8 space-y-8">{children}</div>
    </section>
  );
}

/** Subtítulo de bloque dentro de una micro-sección. */
export function Sub({ icon, iconName, title, hint, children }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {iconName ? <span className="text-[#00e9fa]"><XI name={iconName} size={18} /></span> : icon ? <span aria-hidden="true">{icon}</span> : null}
        <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
        {hint && <span className="text-xs font-mono text-gray-500">{hint}</span>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Card({ children, className = '', tone = 'default' }) {
  const tones = {
    default: 'border-white/[0.08] bg-white/[0.02]',
    teal: 'border-[#00C9A7]/30 bg-[#00C9A7]/[0.05]',
    accent: 'border-[#D4A373]/30 bg-[#D4A373]/[0.05]',
    dark: 'border-white/[0.06] bg-black/30',
  };
  return <div className={`rounded-xl border p-4 md:p-5 ${tones[tone]} ${className}`}>{children}</div>;
}

/** Cifra destacada (KPI). */
export function Kpi({ value, unit, label, hint, color = BIO.teal }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-1.5 text-2xl md:text-3xl font-bold text-white" style={{ color }}>
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

/**
 * Lista de características. Cada ítem puede empezar por ✓ (positivo),
 * ⚠ (advertencia) o • (neutro) para heredar el color del documento original.
 */
export function Bullets({ items, cols = 1 }) {
  // Clases literales (Tailwind no detecta plantillas dinámicas).
  const grids = {
    1: 'space-y-2',
    2: 'grid sm:grid-cols-2 gap-2',
    3: 'grid sm:grid-cols-3 gap-2',
  };
  const grid = grids[cols] || grids[1];
  return (
    <ul className={`list-none p-0 m-0 ${grid}`}>
      {items.map((it) => {
        const mark = it.slice(0, 1);
        const text = it.slice(1).trim();
        const color = mark === '✓' ? BIO.teal : mark === '⚠' ? BIO.warning : mark === '•' ? '#9aa7a0' : null;
        return (
          <li key={it} className="flex items-start gap-2 text-sm text-gray-300">
            {color ? (
              <span className="mt-0.5 font-mono shrink-0" style={{ color }}>{mark}</span>
            ) : null}
            <span>{color ? text : it}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Tabla con scroll horizontal propio (nunca ensancha la página). */
export function DataTable({ head, rows, foot }) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full min-w-[560px] text-sm border-collapse">
        <thead>
          <tr className="bg-white/[0.04]">
            {head.map((h, i) => (
              <th
                key={h}
                className={`p-3 text-[10px] font-mono uppercase tracking-wider text-[#00e9fa] border-b border-white/[0.08] ${i === 0 ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={ri % 2 ? 'bg-white/[0.015]' : ''}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={`p-3 border-b border-white/[0.05] ${ci === 0 ? 'text-left text-white' : 'text-right text-gray-300'}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            <tr className="bg-[#00C9A7]/[0.07]">
              {foot.map((c, ci) => (
                <td
                  key={ci}
                  className={`p-3 border-t border-[#00C9A7]/30 font-semibold ${ci === 0 ? 'text-left text-white' : 'text-right text-[#00C9A7]'}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

/** Barra de progreso / distribución. */
export function Bar({ label, pct, color = BIO.teal, right }) {
  return (
    <div>
      <div className="flex justify-between items-baseline text-xs mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono font-semibold text-white">{right ?? `${pct}%`}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-2 rounded-full transition-[width] duration-700"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }}
        />
      </div>
    </div>
  );
}

/** Fila numerada de pasos / fases. */
export function Step({ n, title, meta, items, color = BIO.teal }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 w-9 h-9 rounded-lg grid place-items-center font-mono font-bold text-sm"
          style={{ background: color + '22', color, border: `1px solid ${color}55` }}
        >
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="font-semibold text-white">{title}</h4>
            {meta && <span className="text-xs font-mono text-gray-500">{meta}</span>}
          </div>
          {items && <div className="mt-3"><Bullets items={items} /></div>}
        </div>
      </div>
    </Card>
  );
}

/** Etiqueta / pill. */
export function Chip({ children, color = BIO.teal }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
      style={{ background: color + '1f', color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  );
}

/** Nota al pie / advertencia de privacidad. */
export function Note({ children, title }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-gray-400 leading-relaxed">
      {title && <strong className="text-[#00e9fa]">{title} </strong>}
      {children}
    </div>
  );
}

/** Par clave/valor de ficha técnica. */
export function Field({ label, value, color }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/25 p-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold" style={{ color: color || '#fff' }}>{value}</div>
    </div>
  );
}
