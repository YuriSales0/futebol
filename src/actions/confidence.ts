'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateConfidence } from '@/lib/utils/confidence'

export async function recalculateConfidence(playerId: string) {
  const supabase = await createClient()

  // Get all videos for the player
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('player_id', playerId)
    .eq('status', 'ready')
    .order('uploaded_at', { ascending: false })

  // Get all dimension entries with scores
  const { data: entries } = await supabase
    .from('dimension_entries')
    .select('self_score')
    .eq('player_id', playerId)
    .not('self_score', 'is', null)

  const videoList = videos || []
  const entryList = entries || []

  // Determine best validation level
  let bestValidation: 'self_curated' | 'full_match' | 'externally_validated' = 'self_curated'
  for (const v of videoList) {
    if (v.validation_level === 'externally_validated') {
      bestValidation = 'externally_validated'
      break
    }
    if (v.validation_level === 'full_match') {
      bestValidation = 'full_match'
    }
  }

  const lastVideoDate = videoList.length > 0 ? new Date(videoList[0].uploaded_at) : null
  const scoreHistory = entryList
    .map((e) => e.self_score as number)
    .filter((s) => s !== null)

  const confidence = calculateConfidence({
    validationLevel: bestValidation,
    hasExternalValidation: false, // MVP: no external validation yet
    lastVideoDate,
    totalGamesAnalyzed: videoList.length,
    scoreHistory,
  })

  const { error } = await supabase
    .from('confidence_scores')
    .upsert({
      player_id: playerId,
      video_source_score: confidence.videoSourceScore,
      validation_score: confidence.validationScore,
      recency_score: confidence.recencyScore,
      sample_size_score: confidence.sampleSizeScore,
      consistency_score: confidence.consistencyScore,
      calculated_at: new Date().toISOString(),
    }, { onConflict: 'player_id' })

  if (error) {
    return { error: 'Erro ao recalcular confiança.' }
  }

  return { success: true, confidence }
}
