import { useEffect } from 'react';

/**
 * Section transition hook - subtle reveal animations for sections
 * Works alongside TransitionOverlay for dramatic nav transitions
 */
export default function useSectionTransition({
  enabled = true,
  selector = 'section',
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px'
} = {}) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let observer;

    const init = () => {
      const sections = document.querySelectorAll(selector);
      if (sections.length === 0) return;

      // Add ready class to all sections
      sections.forEach((section, index) => {
        if (index === 0) return; // Skip hero
        section.classList.add('xl-ready');
      });

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('xl-active');
          }
        });
      }, { threshold, rootMargin });

      sections.forEach((section, index) => {
        if (index === 0) return;
        observer.observe(section);
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(init));

    return () => {
      if (observer) observer.disconnect();
    };
  }, [enabled, selector, threshold, rootMargin]);
}
