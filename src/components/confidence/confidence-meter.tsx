interface ConfidenceMeterProps {
  score: number
  className?: string
}

export function ConfidenceMeter({ score, className = '' }: ConfidenceMeterProps) {
  const percentage = Math.round(score * 100)
  let color = '#ff5252'
  let label = 'Baixa'

  if (percentage >= 60) {
    color = '#00e676'
    label = 'Alta'
  } else if (percentage >= 30) {
    color = '#ffd740'
    label = 'Média'
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Confiança</span>
        <span className="text-sm font-black" style={{ color }}>{percentage}%</span>
      </div>
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[10px] text-muted mt-1">{label}</p>
    </div>
  )
}
