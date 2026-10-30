import React, { useEffect, useRef } from 'react';

/**
 * ParticlesBackground
 * Canvas 2D a pantalla completa con partículas cian que se conectan entre sí y
 * se repelen del cursor. Respeta `prefers-reduced-motion` (sin animación).
 * Sin props.
 */
export function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];

    const buildParticles = () => {
      const count = Math.max(1, Math.min(Math.floor(width / 22), 65));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.15,
      }));
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      buildParticles();
    };

    // Estado inicial
    canvas.width = width;
    canvas.height = height;
    buildParticles();

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const renderFrame = (advance) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (advance) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Repulsión respecto al cursor (radio 140px)
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0 && distance < 140) {
            const force = (140 - distance) / 140;
            p.x -= (dx / distance) * force * 0.6;
            p.y -= (dy / distance) * force * 0.6;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 233, 250, ${p.alpha * 0.7})`;
        ctx.fill();

        // Conexiones entre partículas cercanas (< 110px)
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const gap = Math.hypot(p.x - other.x, p.y - other.y);
          if (gap < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 233, 250, ${(1 - gap / 110) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    let animationId = null;
    const loop = () => {
      renderFrame(true);
      animationId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    if (reduceMotion) {
      // Modo estático: dibuja un único fotograma sin animar.
      renderFrame(false);
    } else {
      loop();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

export default ParticlesBackground;
