'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DimensionCode } from '@/lib/constants/dimensions'

export async function createDimensionEntry(data: {
  playerId: string
  dimension: DimensionCode
  videoId: string
  startTimeSeconds: number
  endTimeSeconds: number
  description: string
  selfScore?: number
}) {
  const supabase = await createClient()

  // Set as primary if this is the first entry for this dimension
  const { count } = await supabase
    .from('dimension_entries')
    .select('*', { count: 'exact', head: true })
    .eq('player_id', data.playerId)
    .eq('dimension', data.dimension)

  const { error } = await supabase
    .from('dimension_entries')
    .insert({
      player_id: data.playerId,
      dimension: data.dimension,
      video_id: data.videoId,
      start_time_seconds: data.startTimeSeconds,
      end_time_seconds: data.endTimeSeconds,
      description: data.description,
      self_score: data.selfScore || null,
      is_primary: (count ?? 0) === 0,
    })

  if (error) {
    return { error: 'Erro ao adicionar entrada de dimensão.' }
  }

  revalidatePath('/album')
  revalidatePath('/perfil')
  return { success: true }
}

export async function deleteDimensionEntry(entryId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('dimension_entries')
    .delete()
    .eq('id', entryId)

  if (error) {
    return { error: 'Erro ao deletar entrada.' }
  }

  revalidatePath('/album')
  revalidatePath('/perfil')
  return { success: true }
}

export async function getPlayerDimensions(playerId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dimension_entries')
    .select('*, videos(*)')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return data
}
