import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-[#00e9fa] hover:bg-white text-black font-semibold',
    secondary: 'bg-transparent border border-white/20 hover:border-[#00e9fa]/60 text-white hover:text-[#00e9fa]',
    ghost: 'bg-transparent hover:bg-white/[0.04] text-gray-300 hover:text-white',
    danger: 'bg-accent hover:bg-accent-light text-white',
  }

  const sizes = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full font-medium tracking-wide
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-[#00e9fa]/50 focus:ring-offset-2 focus:ring-offset-black
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-black',
    ghost: 'bg-transparent hover:bg-surface/50 text-gray-300 hover:text-primary',
  }

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-lg
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
