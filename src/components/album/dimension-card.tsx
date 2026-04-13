import Link from 'next/link'
import type { DimensionMeta } from '@/lib/constants/dimensions'

interface DimensionCardProps {
  dimension: DimensionMeta
  filled: boolean
  selfScore?: number | null
  description?: string
}

export function DimensionCard({ dimension, filled, selfScore, description }: DimensionCardProps) {
  return (
    <Link
      href={`/album/${dimension.code}`}
      className={`group block relative rounded-2xl p-4 transition-all card-hover overflow-hidden ${
        filled
          ? 'bg-surface border border-border'
          : 'bg-surface-2/50 border border-dashed border-border'
      }`}
    >
      {/* Filled glow accent */}
      {filled && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: dimension.color }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Dimension badge */}
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${
              filled ? 'text-white shadow-lg' : 'text-white/50'
            }`}
            style={{
              backgroundColor: filled ? dimension.color : `${dimension.color}30`,
              boxShadow: filled ? `0 4px 20px ${dimension.color}40` : 'none',
            }}
          >
            D{dimension.number}
          </div>
          {filled && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-background" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-sm ${filled ? 'text-foreground' : 'text-muted'}`}>
              {dimension.name}
            </h3>
            {filled && selfScore && (
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: dimension.color }}
              >
                {selfScore}/10
              </span>
            )}
          </div>
          {filled ? (
            <p className="text-xs text-muted mt-1 line-clamp-2">{description}</p>
          ) : (
            <p className="text-xs text-muted/60 mt-1">
              {dimension.subtitle}
              <span className="block text-[10px] mt-0.5" style={{ color: `${dimension.color}80` }}>
                Ref: {dimension.reference}
              </span>
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="shrink-0 mt-1">
          <svg
            className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
              filled ? 'text-muted' : 'text-border'
            }`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
