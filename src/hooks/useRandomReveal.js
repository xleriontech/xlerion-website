import { useEffect } from 'react';

// Hook: randomized visual reveal for elements inside sections.
// Best practices applied:
// - Opt-in via `data-randomize` (or `data-randomize="visual"`) to avoid unexpected DOM changes
// - Visual reordering via CSS `order` (preserves DOM semantics for assistive tech)
// - Respect `prefers-reduced-motion`
// - Use CSS transitions with `transition-delay` for stagger (no long-running timers)
// - Clean up observers on unmount
export default function useRandomReveal({ enabled = true, selector = '[data-randomize], [data-randomize="visual"], .scroll-reveal' } = {}) {
    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return;

        // Respect users who prefer reduced motion
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observerOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -120px 0px'
        };

        function shuffleIndices(n) {
            const arr = Array.from({ length: n }, (_, i) => i);
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function findContainers(section) {
            // Candidate selectors to look for typical groupings. We only target containers
            // that have >1 children and are visible.
            const selectors = ['ul', 'ol', '.grid', '.cards', '.card-list', '.chart-container', '.space-y-6', '.grid-cols-2', '.grid-cols-3', '.grid-cols-4'];
            const set = new Set();
            selectors.forEach(s => {
                section.querySelectorAll(s).forEach(el => {
                    if (el.children && el.children.length > 1) set.add(el);
                });
            });
            // Also include direct group containers as fallback
            section.querySelectorAll(':scope > .grid, :scope > .space-y-6').forEach(el => { if (el.children.length > 1) set.add(el); });
            return Array.from(set);
        }

        function applyVisualShuffle(container) {
            if (!container || container.dataset.randomized === 'true') return;
            const children = Array.from(container.children).filter(n => n.nodeType === 1);
            if (children.length <= 1) return;

            // Generate a random permutation of visual positions
            const indices = shuffleIndices(children.length);

            // Apply ordering and reveal classes. Use transition-delay for stagger effect.
            children.forEach((child, i) => {
                // set order according to shuffled indices
                child.style.order = indices[i];
                // add class for initial state
                child.classList.add('reveal-item');
                // set transition delay for stagger (short, in ms)
                const delay = reduceMotion ? 0 : i * 80;
                child.style.transitionDelay = `${delay}ms`;
            });

            // Trigger the visible state in next frame so transitions run
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    children.forEach(child => child.classList.add('item-visible'));
                });
            });

            container.dataset.randomized = 'true';
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const section = entry.target;
                section.classList.add('revealed');

                const containers = findContainers(section);
                containers.forEach(c => applyVisualShuffle(c));

                // If reduced motion is requested, just reveal without animations
                if (reduceMotion) {
                    section.querySelectorAll('.reveal-item').forEach(el => el.classList.add('item-visible'));
                }

                obs.unobserve(section);
            });
        }, observerOptions);

        const nodes = Array.from(document.querySelectorAll(selector));
        nodes.forEach(n => observer.observe(n));

        return () => observer.disconnect();
    }, [enabled, selector]);
}
