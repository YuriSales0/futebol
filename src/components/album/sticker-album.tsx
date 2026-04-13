import { DIMENSION_LIST } from '@/lib/constants/dimensions'
import { DimensionCard } from './dimension-card'
import type { DimensionEntry } from '@/lib/types'

interface StickerAlbumProps {
  entries: DimensionEntry[]
}

export function StickerAlbum({ entries }: StickerAlbumProps) {
  const primaryEntries = new Map<string, DimensionEntry>()
  for (const entry of entries) {
    if (entry.is_primary || !primaryEntries.has(entry.dimension)) {
      primaryEntries.set(entry.dimension, entry)
    }
  }

  const filledCount = primaryEntries.size
  const totalCount = DIMENSION_LIST.length
  const completionPercent = Math.round((filledCount / totalCount) * 100)

  return (
    <div>
      {/* Progress header */}
      <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-muted">Progresso do Álbum</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-primary">{filledCount}</span>
              <span className="text-sm text-muted">/ {totalCount}</span>
            </div>
          </div>
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-2" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#progress-gradient)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${completionPercent * 2.64} 264`}
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e676" />
                  <stop offset="100%" stopColor="#7c4dff" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-foreground">
              {completionPercent}%
            </span>
          </div>
        </div>
        {filledCount === 0 && (
          <p className="text-xs text-muted">
            Envie um vídeo e preencha sua primeira dimensão para começar!
          </p>
        )}
        {filledCount > 0 && filledCount < totalCount && (
          <p className="text-xs text-muted">
            Faltam <span className="text-primary font-semibold">{totalCount - filledCount}</span> dimensões para completar seu álbum!
          </p>
        )}
        {filledCount === totalCount && (
          <p className="text-xs text-primary font-semibold">
            Álbum completo! Você está no ranking regional.
          </p>
        )}
      </div>

      {/* Dimension cards */}
      <div className="space-y-2">
        {DIMENSION_LIST.map((dim) => {
          const entry = primaryEntries.get(dim.code)
          return (
            <DimensionCard
              key={dim.code}
              dimension={dim}
              filled={!!entry}
              selfScore={entry?.self_score}
              description={entry?.description}
            />
          )
        })}
      </div>
    </div>
  )
}
