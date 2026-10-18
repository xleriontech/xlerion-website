import React from 'react';

export function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3
          bg-surface/50 border border-white/10
          rounded-lg text-white
          placeholder-gray-500
          transition-all duration-300
          focus:outline-none focus:border-primary focus:bg-primary/5 focus:shadow-glow
          ${error ? 'border-red-500 focus:border-red-500 focus:shadow-none' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export function Textarea({
  label,
  error,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          w-full px-4 py-3
          bg-surface/50 border border-white/10
          rounded-lg text-white
          placeholder-gray-500
          transition-all duration-300
          resize-none
          focus:outline-none focus:border-primary focus:bg-primary/5 focus:shadow-glow
          ${error ? 'border-red-500 focus:border-red-500 focus:shadow-none' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export function Select({
  label,
  error,
  options = [],
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3
          bg-surface/50 border border-white/10
          rounded-lg text-white
          transition-all duration-300
          focus:outline-none focus:border-primary focus:bg-primary/5 focus:shadow-glow
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
