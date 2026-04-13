import { Progress } from '@/components/ui/progress'
import type { ConfidenceScore } from '@/lib/types'

interface ConfidenceBreakdownProps {
  confidence: ConfidenceScore
}

const FACTORS = [
  { key: 'video_source_score' as const, label: 'Fonte do vídeo', weight: '25%', tip: 'Envie jogos completos para aumentar' },
  { key: 'validation_score' as const, label: 'Validação externa', weight: '25%', tip: 'Participe de um GIE Day' },
  { key: 'recency_score' as const, label: 'Recência', weight: '20%', tip: 'Envie vídeos recentes (< 30 dias)' },
  { key: 'sample_size_score' as const, label: 'Tamanho da amostra', weight: '20%', tip: 'Envie mais jogos (ideal: 10+)' },
  { key: 'consistency_score' as const, label: 'Consistência', weight: '10%', tip: 'Mantenha scores estáveis entre jogos' },
]

export function ConfidenceBreakdown({ confidence }: ConfidenceBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Detalhes da Confiança</h3>
      {FACTORS.map((factor) => {
        const value = Number(confidence[factor.key]) || 0
        const percentage = Math.round(value * 100)
        return (
          <div key={factor.key}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-muted">{factor.label} ({factor.weight})</span>
              <span className="text-xs font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} size="sm" />
            {percentage < 50 && (
              <p className="text-[10px] text-muted mt-0.5">{factor.tip}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
