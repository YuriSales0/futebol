import type { ValidationLevel } from '@/lib/types'

export interface ConfidenceParams {
  validationLevel: ValidationLevel
  hasExternalValidation: boolean
  lastVideoDate: Date | null
  totalGamesAnalyzed: number
  scoreHistory: number[]
}

export interface ConfidenceBreakdown {
  videoSourceScore: number
  validationScore: number
  recencyScore: number
  sampleSizeScore: number
  consistencyScore: number
  totalScore: number
}

function videoSourceScore(level: ValidationLevel): number {
  switch (level) {
    case 'self_curated':
      return 0.3
    case 'full_match':
      return 0.6
    case 'externally_validated':
      return 1.0
    default:
      return 0
  }
}

function validationScore(hasExternal: boolean): number {
  return hasExternal ? 0.5 : 0
}

function recencyScore(lastVideoDate: Date | null): number {
  if (!lastVideoDate) return 0
  const daysSince = Math.floor(
    (Date.now() - lastVideoDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysSince >= 90) return 0
  return Math.max(0, 1 - daysSince / 90)
}

function sampleSizeScore(totalGames: number): number {
  return Math.min(totalGames / 10, 1.0)
}

function consistencyScore(scores: number[]): number {
  if (scores.length < 2) return 0.5
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const variance =
    scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length
  const stdDev = Math.sqrt(variance)
  // Max expected std dev is ~3 (on a 1-10 scale)
  // Lower std dev = higher consistency
  return Math.max(0, 1 - stdDev / 3)
}

export function calculateConfidence(params: ConfidenceParams): ConfidenceBreakdown {
  const vs = videoSourceScore(params.validationLevel)
  const val = validationScore(params.hasExternalValidation)
  const rec = recencyScore(params.lastVideoDate)
  const sample = sampleSizeScore(params.totalGamesAnalyzed)
  const cons = consistencyScore(params.scoreHistory)

  const total = vs * 0.25 + val * 0.25 + rec * 0.20 + sample * 0.20 + cons * 0.10

  return {
    videoSourceScore: vs,
    validationScore: val,
    recencyScore: rec,
    sampleSizeScore: sample,
    consistencyScore: cons,
    totalScore: Math.round(total * 100) / 100,
  }
}
