import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/profile-header'
import { GIERadarChart } from '@/components/profile/gie-radar-chart'
import { ConfidenceMeter } from '@/components/confidence/confidence-meter'
import { ConfidenceBreakdown } from '@/components/confidence/confidence-breakdown'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meu Perfil',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) redirect('/cadastro')

  const { data: gieScore } = await supabase
    .from('gie_scores')
    .select('*')
    .eq('player_id', player.id)
    .single()

  const { data: confidence } = await supabase
    .from('confidence_scores')
    .select('*')
    .eq('player_id', player.id)
    .single()

  const scores: Record<string, number> = {
    d1_scanning: Number(gieScore?.d1_scanning) || 0,
    d2_decision: Number(gieScore?.d2_decision) || 0,
    d3_off_ball: Number(gieScore?.d3_off_ball) || 0,
    d4_orientation: Number(gieScore?.d4_orientation) || 0,
    d5_anticipation: Number(gieScore?.d5_anticipation) || 0,
    d6_resilience: Number(gieScore?.d6_resilience) || 0,
    d7_communication: Number(gieScore?.d7_communication) || 0,
  }

  return (
    <div className="space-y-4">
      <Card variant="bordered">
        <ProfileHeader player={player} gieScore={gieScore?.total_gie ? Number(gieScore.total_gie) : null} />
        <div className="mt-3">
          <Link
            href="/perfil/editar"
            className="text-sm text-primary font-medium hover:underline"
          >
            Editar perfil
          </Link>
        </div>
      </Card>

      {player.bio && (
        <Card variant="bordered">
          <h3 className="text-sm font-semibold mb-1">Sobre</h3>
          <p className="text-sm text-muted">{player.bio}</p>
        </Card>
      )}

      <Card variant="bordered">
        <h3 className="text-sm font-semibold mb-3">Dimensões GIE</h3>
        <GIERadarChart scores={scores} />
      </Card>

      {confidence && (
        <Card variant="bordered">
          <ConfidenceMeter score={Number(confidence.total_score) || 0} className="mb-4" />
          <ConfidenceBreakdown confidence={confidence} />
        </Card>
      )}
    </div>
  )
}
