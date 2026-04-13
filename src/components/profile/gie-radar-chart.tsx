'use client'

import { DIMENSION_LIST } from '@/lib/constants/dimensions'

interface GIERadarChartProps {
  scores: Record<string, number>
  size?: number
}

export function GIERadarChart({ scores, size = 300 }: GIERadarChartProps) {
  const center = size / 2
  const radius = size * 0.35
  const dimensions = DIMENSION_LIST
  const numDimensions = dimensions.length
  const angleStep = (2 * Math.PI) / numDimensions
  const startAngle = -Math.PI / 2

  function getPoint(index: number, value: number): { x: number; y: number } {
    const angle = startAngle + index * angleStep
    const r = (value / 10) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const rings = [2, 4, 6, 8, 10]
  const hasData = Object.values(scores).some((s) => s > 0)

  const dataPoints = dimensions.map((dim, i) => {
    const score = scores[dim.code] ?? 0
    return getPoint(i, score)
  })
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] mx-auto">
      <defs>
        {/* Gradient fill for data area */}
        <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e676" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c4dff" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e676" />
          <stop offset="100%" stopColor="#7c4dff" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid rings */}
      {rings.map((ring) => {
        const points = dimensions.map((_, i) => {
          const p = getPoint(i, ring)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon
            key={ring}
            points={points}
            fill="none"
            stroke={ring === 10 ? '#1e293b' : '#1e293b80'}
            strokeWidth={ring === 10 ? 1.5 : 0.5}
          />
        )
      })}

      {/* Axis lines */}
      {dimensions.map((dim, i) => {
        const p = getPoint(i, 10)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#1e293b80"
            strokeWidth={0.5}
          />
        )
      })}

      {/* Data polygon with glow */}
      {hasData && (
        <>
          <polygon
            points={dataPolygon}
            fill="url(#radar-fill)"
            stroke="url(#radar-stroke)"
            strokeWidth={2.5}
            filter="url(#glow)"
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Data points */}
      {dataPoints.map((p, i) => {
        const score = scores[dimensions[i].code] ?? 0
        if (score === 0) return null
        return (
          <g key={i}>
            {/* Outer glow */}
            <circle cx={p.x} cy={p.y} r={8} fill={dimensions[i].color} opacity={0.2} />
            {/* Point */}
            <circle cx={p.x} cy={p.y} r={4} fill={dimensions[i].color} stroke="#0a0f1a" strokeWidth={2} />
          </g>
        )
      })}

      {/* Labels with scores */}
      {dimensions.map((dim, i) => {
        const labelDist = 13.5
        const p = getPoint(i, labelDist)
        const score = scores[dim.code] ?? 0
        return (
          <g key={dim.code}>
            {/* Dimension badge */}
            <rect
              x={p.x - 16}
              y={p.y - 10}
              width={32}
              height={20}
              rx={6}
              fill={score > 0 ? dim.color : '#1e293b'}
              opacity={score > 0 ? 1 : 0.5}
            />
            <text
              x={p.x}
              y={p.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[8px] font-black"
              fill={score > 0 ? '#0a0f1a' : '#64748b'}
            >
              {score > 0 ? `D${dim.number} ${score.toFixed(0)}` : `D${dim.number}`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
