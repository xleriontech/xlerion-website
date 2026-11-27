import React from 'react';

export function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-14 md:mb-20 ${className}`}>
      {subtitle && (
        <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#00e9fa]/85 mb-5">
          {subtitle}
        </p>
      )}
      <h2 className="text-[clamp(2rem,4.8vw,4rem)] leading-[0.95] font-semibold text-white tracking-[-0.04em] max-w-4xl text-balance">
        {title}
      </h2>
    </div>
  )
}

export function SectionContainer({ children, className = '', variant = 'default' }) {
  const variants = {
    default: '',
    alt: 'bg-white/[0.015]',
    dark: 'bg-[#050508]',
  }

  return (
    <section className={`py-24 md:py-32 lg:py-36 px-6 md:px-10 lg:px-14 ${variants[variant]} ${className}`}>
      <div className="max-w-[90rem] mx-auto">
        {children}
      </div>
    </section>
  )
}

export function SectionDivider({ className = '' }) {
  return (
    <div className={`w-full h-px bg-gradient-to-r from-transparent via-[#00e9fa]/20 to-transparent ${className}`} />
  )
}
