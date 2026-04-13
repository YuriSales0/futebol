'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function approveConsent(token: string) {
  const supabase = createAdminClient()

  const { data: consent, error: fetchError } = await supabase
    .from('parental_consents')
    .select('*')
    .eq('consent_token', token)
    .single()

  if (fetchError || !consent) {
    return { error: 'Link de consentimento inválido ou expirado.' }
  }

  if (consent.status !== 'pending') {
    return { error: `Consentimento já foi ${consent.status === 'approved' ? 'aprovado' : 'processado'}.` }
  }

  if (new Date(consent.expires_at) < new Date()) {
    await supabase
      .from('parental_consents')
      .update({ status: 'expired' })
      .eq('id', consent.id)
    return { error: 'Link de consentimento expirado. Solicite um novo.' }
  }

  const { error: updateError } = await supabase
    .from('parental_consents')
    .update({
      status: 'approved',
      consented_at: new Date().toISOString(),
    })
    .eq('id', consent.id)

  if (updateError) {
    return { error: 'Erro ao aprovar consentimento. Tente novamente.' }
  }

  return { success: true }
}

export async function rejectConsent(token: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('parental_consents')
    .update({ status: 'rejected' })
    .eq('consent_token', token)
    .eq('status', 'pending')

  if (error) {
    return { error: 'Erro ao rejeitar consentimento.' }
  }

  return { success: true }
}
