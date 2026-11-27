import React from 'react';

/**
 * Iconos corporativos Xlerion: línea limpia, cian #00e9fa, fondo oscuro.
 * Reemplazan emojis para mantener consistencia con la imagen corporativa.
 */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

const GLYPHS = {
  home: <><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M10 21v-4h4v4" /></>,
  energy: <path d="M13 2L4 14h7l-1 8 10-12h-7z" />,
  water: <><path d="M12 3C12 3 5 11 5 15a7 7 0 0014 0c0-4-7-12-7-12z" /><path d="M9 16c0 1 .8 2 2 2" /></>,
  recycle: <><path d="M7 7l-2 3.5L7 14" /><path d="M5 10.5h6l2 3.5" /><path d="M17 7l2 3.5-2 3.5" /><path d="M19 10.5h-6l-2-3.5" /><path d="M10 21l2-3.5h4" /><path d="M12 17.5l-2-3.5" /></>,
  light: <><path d="M9 21h6M10 17h4" /><path d="M8 10a4 4 0 118 0c0 1.5-.8 2.8-2 3.5V15h-4v-1.5A4 4 0 018 10z" /></>,
  camera: <><path d="M4 8h3l2-2h6l2 2h3v12H4z" /><circle cx="12" cy="14" r="3" /></>,
  climate: <><path d="M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0z" /><path d="M12 12v5" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 118 0v3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" /></>,
  chart: <><path d="M4 20h16M7 16V9m5 7V5m5 11v-7" /></>,
  chain: <><path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.2 4.73" /><path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07L12.8 19.27" /></>,
  money: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9h4.5a1.5 1.5 0 010 3H9h5a1.5 1.5 0 010 3H9" /></>,
  leaf: <><path d="M20 4c-8 0-14 2-16 10 6 0 10-2 12-6" /><path d="M4 20c0-6 4-10 10-12" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></>,
  users: <><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="3" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a3 3 0 010 5.75" /></>,
  shield: <path d="M12 3l7 3v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6z" />,
  alert: <><path d="M12 3l9 16H3z" /><path d="M12 9v4M12 16h.01" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-5" /></>,
  rocket: <><path d="M14 4c3 1 5 3 6 6-2 1-4 2-6 2l-3 3-2-1 1-2 3-3c0-2 1-4 2-5z" /><path d="M9 15l-2 2c-1 1-1 3-1 3s2 0 3-1l2-2" /><path d="M14 4l6 6" /></>,
  map: <><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></>,
  tool: <><path d="M14.7 6.3a4 4 0 00-5.66 5.66L3 18l3 3 6.04-6.04a4 4 0 005.66-5.66l-3 3-2.7-2.7z" /></>,
  star: <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9z" />,
  box: <><path d="M21 8l-9 5-9-5 9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></>,
  coin: <><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5 7v5c0 1.66 3.13 3 7 3s7-1.34 7-3V7" /><path d="M5 12v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" /></>,
  tree: <><path d="M12 22v-7" /><path d="M17 15a5 5 0 00-1-9.9A5 5 0 007 7a4 4 0 001 8h9z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
  cafe: <><path d="M18 8h1a4 4 0 010 8h-1M3 8h15v9a4 4 0 01-4 4H7a4 4 0 01-4-4zM6 2v3M10 2v3M14 2v3" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" /></>,
  send: <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
  trophy: <><path d="M8 4h8v3a4 4 0 01-8 0z" /><path d="M6 4h2v2a2 2 0 01-2-2zM16 4h2a2 2 0 01-2 2z" /><path d="M10 11h4v3l-2 2-2-2zM9 20h6" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-3.5-3.5" /></>,
  game: <><rect x="3" y="7" width="18" height="10" rx="3" /><path d="M8 12h2m-1-1v2m5-1h.01M17 11h.01" /></>,
  mobile: <><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M10 18h4" /></>,
  signal: <><path d="M4 18v-2M8 18v-5M12 18V8M16 18V5M20 18V3" /></>,
  spark: <><path d="M12 2l1.5 5L18 8.5l-4.5 1.5L12 15l-1.5-5L6 8.5 10.5 7z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  xlerion: <><path d="M12 3C8.5 3 6 5.5 6 9c0 3.5 3 7.5 6 10 3-2.5 6-6.5 6-10 0-3.5-2.5-6-6-6z" /><path d="M12 6v7M12 9l-2-1.5M12 11l2-1.5" /><circle cx="10" cy="7.5" r=".8" fill="currentColor" stroke="none" /><circle cx="14" cy="9.5" r=".8" fill="currentColor" stroke="none" /><circle cx="12" cy="6" r=".8" fill="currentColor" stroke="none" /></>,
};

export function XI({ name, size = 18, className = '', color }) {
  const g = GLYPHS[name] || GLYPHS.xlerion;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={color ? { color } : undefined}
      {...S}
    >
      {g}
    </svg>
  );
}

export function XIBadge({ name, size = 18, box = 36, color = '#00e9fa', className = '' }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-lg shrink-0 ${className}`}
      style={{ width: box, height: box, background: color + '18', color, border: `1px solid ${color}33` }}
    >
      <XI name={name} size={size} />
    </span>
  );
}
