import { DIMENSION_LIST } from '@/lib/constants/dimensions'
import { DimensionCard } from './dimension-card'
import { Progress } from '@/components/ui/progress'
import type { DimensionEntry } from '@/lib/types'

interface StickerAlbumProps {
  entries: DimensionEntry[]
}

export function StickerAlbum({ entries }: StickerAlbumProps) {
  // Get primary entry for each dimension
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
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            Álbum: {filledCount}/{totalCount} dimensões
          </span>
          <span className="text-xs text-muted">{completionPercent}%</span>
        </div>
        <Progress value={completionPercent} color="bg-primary" size="md" />
      </div>

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
