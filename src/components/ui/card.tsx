import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-surface rounded-2xl p-5',
    bordered: 'bg-surface rounded-2xl border border-border p-5',
    elevated: 'bg-surface rounded-2xl shadow-lg shadow-black/20 p-5',
  }

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
