import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useAutoRotate — rotación automática de índice con pausa por interacción.
 *
 * - Avanza `index` cada `interval` ms.
 * - `select(i)` fija un índice manualmente, pausa la rotación y reinicia
 *   el temporizador de reanudación (`resumeDelay` ms de inactividad).
 * - `progress` (0..1) alimenta la barra de progreso del tab activo.
 * - Si el usuario prefiere movimiento reducido, la rotación automática
 *   queda desactivada y solo hay navegación manual.
 */
export default function useAutoRotate({ count, interval = 6000, resumeDelay = 15000 }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const pausedRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const reducedMotionRef = useRef(
    typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reducedMotionRef.current) {
      pausedRef.current = true;
      setPaused(true);
    }
  }, []);

  const select = useCallback(
    (next) => {
      const clamped = ((next % count) + count) % count;
      setIndex(clamped);
      setProgress(0);
      lastInteractionRef.current = Date.now();
      if (!pausedRef.current) {
        pausedRef.current = true;
        setPaused(true);
      }
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return undefined;
    const tickMs = 100;

    const timer = setInterval(() => {
      if (pausedRef.current) {
        if (Date.now() - lastInteractionRef.current >= resumeDelay) {
          pausedRef.current = false;
          setPaused(false);
        }
        return;
      }
      setProgress((prev) => Math.min(1, prev + tickMs / interval));
    }, tickMs);

    return () => clearInterval(timer);
  }, [count, interval, resumeDelay]);

  useEffect(() => {
    if (paused || progress < 1) return;
    setIndex((prev) => (prev + 1) % count);
    setProgress(0);
  }, [progress, paused, count]);

  return { index, select, progress, paused };
}
