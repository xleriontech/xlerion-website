import React from 'react';

/**
 * DemoShell — chrome visual compartido de las demos del hero (mismo patrón
 * que el HUD del gemelo digital: barra superior mono + viewport + barra
 * inferior). La altura del viewport replica la del visor 3D.
 */
export default function DemoShell({ title, right, children, footer }) {
  return (
    <div className="relative bg-[#050508] border border-[#00e9fa]/20 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-white/[0.08] bg-black/50 font-mono text-[10px] sm:text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#00e9fa] opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e9fa]" />
          </span>
          <span className="text-white uppercase tracking-[0.15em] truncate">{title}</span>
        </div>
        {right}
      </div>

      <div className="relative h-[360px] sm:h-[440px] lg:h-[520px] w-full">{children}</div>

      {footer && (
        <div className="px-3 sm:px-4 py-2.5 border-t border-white/[0.08] bg-black/50 font-mono text-[10px]">
          {footer}
        </div>
      )}
    </div>
  );
}
