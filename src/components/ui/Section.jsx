import React from 'react';

export function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-12 md:mb-16 text-left ${className}`} style={{ borderLeft: '3px solid #00e9fa', paddingLeft: '24px' }}>
      {subtitle && (
        <p className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-[#00e9fa]/80 mb-3">
          {'// '}{subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
        {title}
      </h2>
    </div>
  )
}

export function SectionContainer({ children, className = '', variant = 'default' }) {
  const variants = {
    default: '',
    alt: 'bg-white/[0.02]',
    dark: 'bg-[#050508]',
  }

  return (
    <section className={`py-20 md:py-28 px-6 md:px-8 ${variants[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto">
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
