import { createClient } from '@/lib/supabase/server'

export type UserRole = 'player' | 'scout' | 'admin'

export async function getUserRole(): Promise<{ role: UserRole; profileId: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return null
  return { role: profile.role as UserRole, profileId: profile.id as string }
}

export async function requireAdmin() {
  const userRole = await getUserRole()
  if (!userRole || userRole.role !== 'admin') {
    return null
  }
  return userRole
}

export async function requireScout() {
  const userRole = await getUserRole()
  if (!userRole || (userRole.role !== 'scout' && userRole.role !== 'admin')) {
    return null
  }
  return userRole
}
