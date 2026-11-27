import React, { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], input[type="submit"], input[type="button"], summary, select, .cursor-pointer';
const TEXT = 'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

export default function TechCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('default'); // default | hover | text | down | select
  const modeRef = useRef('default');

  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;
    setEnabled(true);
    document.body.classList.add('has-tech-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;
    let down = false;
    let selecting = false;

    const setCursorMode = (next) => {
      if (modeRef.current === next) return;
      modeRef.current = next;
      setMode(next);
    };

    const resolveMode = (el) => {
      if (down) return 'down';
      if (selecting) return 'select';
      if (!el) return 'default';
      if (el.closest(TEXT)) return 'text';
      if (el.closest(INTERACTIVE) || el.closest('[data-cursor="hover"]')) return 'hover';
      return 'default';
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const el = e.target instanceof Element ? e.target : null;
      setCursorMode(resolveMode(el));
    };

    const onDown = (e) => {
      down = true;
      const el = e.target instanceof Element ? e.target : null;
      setCursorMode(resolveMode(el));
    };
    const onUp = (e) => {
      down = false;
      const el = e.target instanceof Element ? e.target : null;
      setCursorMode(resolveMode(el));
    };
    const onSelectionChange = () => {
      const sel = window.getSelection?.();
      const text = sel ? sel.toString() : '';
      selecting = text.length > 0;
      if (!down) setCursorMode(selecting ? 'select' : resolveMode(document.elementFromPoint(target.x, target.y)));
    };
    const onLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('has-tech-cursor');
    };
  }, []);

  if (!enabled) return null;

  const isHover = mode === 'hover';
  const isDown = mode === 'down';
  const isText = mode === 'text';
  const isSelect = mode === 'select';
  const ringSize = isText ? 28 : isHover ? 52 : isDown ? 26 : isSelect ? 40 : 34;
  const ringRadius = isText ? 4 : isSelect ? 8 : 999;
  const dotSize = isDown ? 10 : isHover ? 6 : isSelect ? 4 : 5;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[10000] pointer-events-none transition-[width,height,border-radius,background-color,border-color,opacity] duration-200 ease-out"
        style={{
          width: ringSize,
          height: isText ? 34 : ringSize,
          borderRadius: ringRadius,
          border: `1px solid ${isHover ? 'rgba(0,233,250,0.95)' : isSelect ? 'rgba(0,233,250,0.8)' : 'rgba(0,233,250,0.55)'}`,
          backgroundColor: isHover ? 'rgba(0,233,250,0.08)' : isDown ? 'rgba(0,233,250,0.14)' : isSelect ? 'rgba(0,233,250,0.06)' : 'transparent',
          boxShadow: isHover || isDown || isSelect ? '0 0 18px rgba(0,233,250,0.22)' : '0 0 0 rgba(0,0,0,0)',
          opacity: 1,
        }}
      >
        {!isText && (
          <>
            <span className="absolute left-[-1px] top-[-1px] w-2 h-2 border-l border-t border-[#00e9fa]/80" />
            <span className="absolute right-[-1px] top-[-1px] w-2 h-2 border-r border-t border-[#00e9fa]/80" />
            <span className="absolute left-[-1px] bottom-[-1px] w-2 h-2 border-l border-b border-[#00e9fa]/80" />
            <span className="absolute right-[-1px] bottom-[-1px] w-2 h-2 border-r border-b border-[#00e9fa]/80" />
          </>
        )}
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[10001] pointer-events-none rounded-full transition-[width,height,opacity,background-color] duration-150 ease-out"
        style={{
          width: isText ? 2 : dotSize,
          height: isText ? 18 : dotSize,
          borderRadius: isText ? 1 : 999,
          backgroundColor: '#00e9fa',
          boxShadow: '0 0 10px rgba(0,233,250,0.7)',
          opacity: 1,
        }}
      />
    </>
  );
}
