import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

export function Card({ className = '', variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-white rounded-xl p-5',
    bordered: 'bg-white rounded-xl border border-border p-5',
    elevated: 'bg-white rounded-xl shadow-md p-5',
  }

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
