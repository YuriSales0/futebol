import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

export function Badge({ className = '', variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-surface-2 text-muted border border-border',
    success: 'bg-primary/10 text-primary border border-primary/20',
    warning: 'bg-accent/10 text-accent border border-accent/20',
    error: 'bg-error/10 text-error border border-error/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  }

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
