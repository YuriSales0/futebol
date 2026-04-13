import type { ConfidenceScore } from '@/lib/types'

interface ConfidenceBreakdownProps {
  confidence: ConfidenceScore
}

const FACTORS = [
  { key: 'video_source_score' as const, label: 'Fonte do vídeo', weight: '25%', tip: 'Envie jogos completos para aumentar', icon: '🎬' },
  { key: 'validation_score' as const, label: 'Validação externa', weight: '25%', tip: 'Participe de um GIE Day', icon: '✅' },
  { key: 'recency_score' as const, label: 'Recência', weight: '20%', tip: 'Envie vídeos recentes (< 30 dias)', icon: '📅' },
  { key: 'sample_size_score' as const, label: 'Amostra', weight: '20%', tip: 'Envie mais jogos (ideal: 10+)', icon: '📊' },
  { key: 'consistency_score' as const, label: 'Consistência', weight: '10%', tip: 'Mantenha scores estáveis', icon: '📈' },
]

export function ConfidenceBreakdown({ confidence }: ConfidenceBreakdownProps) {
  return (
    <div className="space-y-3">
      {FACTORS.map((factor) => {
        const value = Number(confidence[factor.key]) || 0
        const percentage = Math.round(value * 100)
        let color = '#ff5252'
        if (percentage >= 60) color = '#00e676'
        else if (percentage >= 30) color = '#ffd740'

        return (
          <div key={factor.key}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs">{factor.icon}</span>
                <span className="text-[11px] font-semibold text-foreground">{factor.label}</span>
                <span className="text-[9px] text-muted font-mono">({factor.weight})</span>
              </div>
              <span className="text-[11px] font-black font-mono" style={{ color }}>{percentage}%</span>
            </div>
            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${percentage}%`, backgroundColor: color }}
              />
            </div>
            {percentage < 50 && (
              <p className="text-[9px] text-muted/60 mt-0.5 ml-6">{factor.tip}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
