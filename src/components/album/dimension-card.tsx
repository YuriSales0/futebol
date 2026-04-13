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
      className={`block rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        filled
          ? 'border-transparent bg-white shadow-sm'
          : 'border-dashed border-gray-300 bg-white/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 ${
            filled ? '' : 'opacity-40'
          }`}
          style={{ backgroundColor: dimension.color }}
        >
          D{dimension.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-sm ${filled ? '' : 'text-muted'}`}>
              {dimension.name}
            </h3>
            {filled && selfScore && (
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: dimension.color }}
              >
                {selfScore}/10
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {filled ? (
              <span className="line-clamp-2">{description}</span>
            ) : (
              <>
                {dimension.subtitle}
                <br />
                <span className="italic">Ref: {dimension.reference}</span>
              </>
            )}
          </p>
        </div>
        <div className="shrink-0">
          {filled ? (
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
        </div>
      </div>
    </Link>
  )
}
