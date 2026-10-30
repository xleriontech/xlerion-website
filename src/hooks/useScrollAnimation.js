import { useEffect } from 'react';

/**
 * Modern scroll animation hook using Intersection Observer
 * Applies smooth reveal animations to elements as they enter viewport
 */
export default function useScrollAnimation({
  enabled = true,
  selector = '[data-reveal]',
  threshold = 0.1,
  rootMargin = '0px 0px -60px 0px'
} = {}) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      document.querySelectorAll(selector).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('visible');

        // Stagger children if they have stagger class
        const staggerChildren = el.querySelectorAll('[class*="stagger-"]');
        staggerChildren.forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
        });

        observer.unobserve(el);
      });
    }, { threshold, rootMargin });

    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [enabled, selector, threshold, rootMargin]);
}
