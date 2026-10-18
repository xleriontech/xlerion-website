import React from 'react';
import { Link } from 'react-router-dom';

export function Card({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[#0a0a12]/80 border border-white/[0.08] hover:border-[#00e9fa]/30',
    primary: 'bg-[#00e9fa]/[0.04] border border-[#00e9fa]/20 hover:border-[#00e9fa]/40',
    ghost: 'bg-transparent border border-transparent hover:bg-white/[0.03]',
  }

  return (
    <div className={`
      relative rounded-lg p-6
      backdrop-blur-sm
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,233,250,0.1)]
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </div>
  )
}

export function CardHeader({ children, icon: Icon, className = '' }) {
  return (
    <div className={`flex items-center gap-4 mb-4 ${className}`}>
      {Icon && <Icon className="text-[#00e9fa]" size={24} />}
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`}>
      {children}
    </h3>
  )
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`text-gray-400 text-sm leading-relaxed ${className}`}>
      {children}
    </div>
  )
}

export function LinkCard({ title, icon: Icon, children, to, href, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[#0a0a12]/80 border border-white/[0.08] hover:border-[#00e9fa]/30',
    primary: 'bg-[#00e9fa]/[0.04] border border-[#00e9fa]/20 hover:border-[#00e9fa]/40',
  }

  const baseClasses = `
    group relative block p-6 rounded-lg
    backdrop-blur-sm
    transition-all duration-300 hover:-translate-y-1
    hover:shadow-[0_0_20px_rgba(0,233,250,0.1)]
    overflow-hidden
    ${variants[variant]}
    ${className}
  `

  const content = (
    <>
      <div className="flex items-center gap-4 mb-3 relative z-10">
        {Icon && <Icon className="text-[#00e9fa] group-hover:scale-110 transition-transform" size={22} />}
        <h3 className="text-base font-semibold text-white group-hover:text-[#00e9fa] transition-colors">{title}</h3>
      </div>
      <div className="text-gray-400 text-sm leading-relaxed relative z-10">{children}</div>
      <div className="absolute -bottom-4 -right-4 text-[#00e9fa]/[0.03] group-hover:text-[#00e9fa]/[0.06] transition-colors pointer-events-none">
        {Icon && <Icon size={100} />}
      </div>
    </>
  )

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    )
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  )
}
