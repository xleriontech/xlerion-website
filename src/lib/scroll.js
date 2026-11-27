import Lenis from 'lenis';

let lenis = null;

export function initLenis() {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  function raf(time) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

export function getLenis() { return lenis; }

export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4), ...options });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function stopScroll() { lenis?.stop(); }
export function startScroll() { lenis?.start(); }
