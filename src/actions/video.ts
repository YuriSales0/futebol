'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createVideoRecord(data: {
  playerId: string
  storagePath: string
  originalFilename: string
  fileSizeBytes: number
  matchDate?: string
  matchDescription?: string
}) {
  const supabase = await createClient()

  const { data: video, error } = await supabase
    .from('videos')
    .insert({
      player_id: data.playerId,
      storage_path: data.storagePath,
      original_filename: data.originalFilename,
      file_size_bytes: data.fileSizeBytes,
      status: 'ready',
      match_date: data.matchDate || null,
      match_description: data.matchDescription || null,
    })
    .select()
    .single()

  if (error) {
    return { error: 'Erro ao salvar registro do vídeo.' }
  }

  revalidatePath('/videos')
  return { data: video }
}

export async function deleteVideo(videoId: string) {
  const supabase = await createClient()

  // Get video to find storage path
  const { data: video } = await supabase
    .from('videos')
    .select('storage_path')
    .eq('id', videoId)
    .single()

  if (video) {
    // Delete from storage
    await supabase.storage
      .from('videos')
      .remove([video.storage_path])
  }

  // Delete from database (cascade will remove dimension entries)
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)

  if (error) {
    return { error: 'Erro ao deletar vídeo.' }
  }

  revalidatePath('/videos')
  revalidatePath('/album')
  return { success: true }
}

export async function getPlayerVideos(playerId: string) {
  const supabase = await createClient()

  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .eq('player_id', playerId)
    .order('uploaded_at', { ascending: false })

  if (error) {
    return []
  }

  return videos
}
