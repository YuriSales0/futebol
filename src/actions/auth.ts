'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { STATE_TO_REGION } from '@/lib/constants/regions'
import { isMinor } from '@/lib/utils/age'
import type { SignUpFormData } from '@/lib/utils/validation'

export async function signUp(formData: SignUpFormData) {
  const supabase = await createClient()

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Erro ao criar conta. Tente novamente.' }
  }

  const region = STATE_TO_REGION[formData.state]
  if (!region) {
    return { error: 'Estado inválido.' }
  }

  // Create player profile
  const { data: player, error: playerError } = await supabase
    .from('players')
    .insert({
      auth_user_id: authData.user.id,
      full_name: formData.fullName,
      date_of_birth: formData.dateOfBirth,
      position: formData.position,
      city: formData.city,
      state: formData.state,
      region,
    })
    .select()
    .single()

  if (playerError) {
    return { error: 'Erro ao criar perfil. Tente novamente.' }
  }

  // Check if minor - create parental consent if needed
  const dob = new Date(formData.dateOfBirth)
  if (isMinor(dob) && formData.guardianName && formData.guardianEmail) {
    await supabase.from('parental_consents').insert({
      player_id: player.id,
      guardian_name: formData.guardianName,
      guardian_email: formData.guardianEmail,
      guardian_relationship: formData.guardianRelationship || 'responsavel',
    })
  }

  // Create user profile with role
  await supabase.from('user_profiles').insert({
    auth_user_id: authData.user.id,
    role: 'player',
  })

  // Initialize empty scores
  await supabase.from('confidence_scores').insert({ player_id: player.id })
  await supabase.from('gie_scores').insert({ player_id: player.id })

  redirect('/album')
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  redirect('/album')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
