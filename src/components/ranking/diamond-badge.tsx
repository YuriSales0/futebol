interface DiamondBadgeProps {
  className?: string
}

export function DiamondBadge({ className = '' }: DiamondBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ${className}`}
      title="Top 5% da região"
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 9l10 13L22 9z" />
      </svg>
      Diamante
    </span>
  )
}
