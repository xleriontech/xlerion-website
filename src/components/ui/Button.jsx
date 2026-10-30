import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-black font-semibold shadow-glow hover:shadow-glow-lg',
    secondary: 'bg-transparent border border-primary/30 hover:border-primary text-primary hover:bg-primary/5',
    ghost: 'bg-transparent hover:bg-surface/50 text-gray-300 hover:text-primary',
    danger: 'bg-accent hover:bg-accent-light text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium uppercase tracking-wider
        transition-all duration-300
        hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-black
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
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
