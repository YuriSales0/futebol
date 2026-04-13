'use client'

import { DIMENSION_LIST } from '@/lib/constants/dimensions'

interface GIERadarChartProps {
  scores: Record<string, number> // dimension code -> score (0-10)
  size?: number
}

export function GIERadarChart({ scores, size = 250 }: GIERadarChartProps) {
  const center = size / 2
  const radius = size * 0.38
  const dimensions = DIMENSION_LIST
  const numDimensions = dimensions.length
  const angleStep = (2 * Math.PI) / numDimensions
  const startAngle = -Math.PI / 2 // Start from top

  function getPoint(index: number, value: number): { x: number; y: number } {
    const angle = startAngle + index * angleStep
    const r = (value / 10) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  // Background grid rings
  const rings = [2, 4, 6, 8, 10]

  // Data polygon points
  const dataPoints = dimensions.map((dim, i) => {
    const score = scores[dim.code] ?? 0
    return getPoint(i, score)
  })
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
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
            stroke="#e2e8f0"
            strokeWidth={ring === 10 ? 1.5 : 0.5}
          />
        )
      })}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const p = getPoint(i, 10)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#e2e8f0"
            strokeWidth={0.5}
          />
        )
      })}

      {/* Data polygon */}
      {dataPolygon && (
        <polygon
          points={dataPolygon}
          fill="rgba(5, 150, 105, 0.15)"
          stroke="#059669"
          strokeWidth={2}
        />
      )}

      {/* Data points */}
      {dataPoints.map((p, i) => {
        const score = scores[dimensions[i].code] ?? 0
        if (score === 0) return null
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={dimensions[i].color}
            stroke="white"
            strokeWidth={2}
          />
        )
      })}

      {/* Labels */}
      {dimensions.map((dim, i) => {
        const p = getPoint(i, 12.5)
        return (
          <text
            key={dim.code}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] font-medium"
            fill={dim.color}
          >
            {`D${dim.number}`}
          </text>
        )
      })}
    </svg>
  )
}
