import React from 'react';
import { Asterisk } from 'lucide-react';

const ITEMS = [
  'Gemelos Digitales',
  'IoT en Tiempo Real',
  'Visualización 3D',
  'Arquitectura DeepTech',
  'Inteligencia Operativa',
  'WebGL Interactivo',
];

export default function Marquee() {
  const row = (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10">
          <span
            className={`whitespace-nowrap text-5xl font-bold uppercase tracking-[-0.03em] md:text-7xl lg:text-8xl ${
              i % 2 === 1 ? 'text-stroke' : 'text-white'
            }`}
          >
            {item}
          </span>
          <Asterisk className="shrink-0 text-[#00e9fa]" size={40} strokeWidth={1.5} />
        </span>
      ))}
    </>
  );

  return (
    <section className="overflow-hidden border-y border-white/10 py-8 md:py-12 bg-black" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </section>
  );
}
