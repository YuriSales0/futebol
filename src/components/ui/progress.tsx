interface ProgressProps {
  value: number
  className?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function Progress({
  value,
  className = '',
  color = 'bg-primary',
  size = 'md',
  showLabel = false,
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-surface-2 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${color} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted mt-1 text-right">{Math.round(clamped)}%</p>
      )}
    </div>
  )
}
