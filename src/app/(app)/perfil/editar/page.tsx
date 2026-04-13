import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editar Perfil',
}

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) redirect('/cadastro')

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Editar Perfil</h1>
      <ProfileForm player={player} />
    </div>
  )
}
