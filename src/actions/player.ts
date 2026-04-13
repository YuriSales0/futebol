'use server'

import { createClient } from '@/lib/supabase/server'
import { STATE_TO_REGION } from '@/lib/constants/regions'
import { revalidatePath } from 'next/cache'
import type { PlayerProfileFormData } from '@/lib/utils/validation'

export async function getPlayerProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  return player
}

export async function updatePlayer(formData: PlayerProfileFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado.' }
  }

  const region = STATE_TO_REGION[formData.state]
  if (!region) {
    return { error: 'Estado inválido.' }
  }

  const { error } = await supabase
    .from('players')
    .update({
      full_name: formData.fullName,
      nickname: formData.nickname || null,
      position: formData.position,
      secondary_position: formData.secondaryPosition || null,
      city: formData.city,
      state: formData.state,
      region,
      height_cm: formData.heightCm || null,
      preferred_foot: formData.preferredFoot || null,
      current_club: formData.currentClub || null,
      bio: formData.bio || null,
      updated_at: new Date().toISOString(),
    })
    .eq('auth_user_id', user.id)

  if (error) {
    return { error: 'Erro ao atualizar perfil.' }
  }

  revalidatePath('/perfil')
  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Não autenticado.' }
  }

  // Soft delete: mark as inactive
  const { error } = await supabase
    .from('players')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('auth_user_id', user.id)

  if (error) {
    return { error: 'Erro ao deletar conta.' }
  }

  await supabase.auth.signOut()
  return { success: true }
}
