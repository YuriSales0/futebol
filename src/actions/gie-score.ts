'use server'

import { createClient } from '@/lib/supabase/server'
import { DIMENSION_CODES } from '@/lib/constants/dimensions'

export async function recalculateGIEScore(playerId: string) {
  const supabase = await createClient()

  // Get primary dimension entries with self-scores
  const { data: entries } = await supabase
    .from('dimension_entries')
    .select('dimension, self_score')
    .eq('player_id', playerId)
    .eq('is_primary', true)
    .not('self_score', 'is', null)

  const entryList = entries || []

  // Build score map
  const scores: Record<string, number> = {}
  for (const code of DIMENSION_CODES) {
    const entry = entryList.find((e) => e.dimension === code)
    scores[code] = entry?.self_score ?? 0
  }

  const { error } = await supabase
    .from('gie_scores')
    .upsert({
      player_id: playerId,
      d1_scanning: scores.d1_scanning,
      d2_decision: scores.d2_decision,
      d3_off_ball: scores.d3_off_ball,
      d4_orientation: scores.d4_orientation,
      d5_anticipation: scores.d5_anticipation,
      d6_resilience: scores.d6_resilience,
      d7_communication: scores.d7_communication,
      calculated_at: new Date().toISOString(),
    }, { onConflict: 'player_id' })

  if (error) {
    return { error: 'Erro ao recalcular GIE Score.' }
  }

  return { success: true }
}
