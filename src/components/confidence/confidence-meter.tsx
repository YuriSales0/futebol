import { Progress } from '@/components/ui/progress'

interface ConfidenceMeterProps {
  score: number // 0-1
  className?: string
}

export function ConfidenceMeter({ score, className = '' }: ConfidenceMeterProps) {
  const percentage = Math.round(score * 100)
  let color = 'bg-red-500'
  let label = 'Baixa'

  if (percentage >= 60) {
    color = 'bg-emerald-500'
    label = 'Alta'
  } else if (percentage >= 30) {
    color = 'bg-amber-500'
    label = 'Média'
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted">Confiança</span>
        <span className="text-xs font-semibold">{percentage}% — {label}</span>
      </div>
      <Progress value={percentage} color={color} size="sm" />
    </div>
  )
}
