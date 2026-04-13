import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/profile-header'
import { GIERadarChart } from '@/components/profile/gie-radar-chart'
import { ConfidenceMeter } from '@/components/confidence/confidence-meter'
import { Card } from '@/components/ui/card'
import { DIMENSION_LIST } from '@/lib/constants/dimensions'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: player } = await supabase
    .from('players')
    .select('full_name, position, city, state')
    .eq('id', id)
    .single()

  if (!player) return { title: 'Jogador não encontrado' }

  return {
    title: `${player.full_name} — ${player.city}, ${player.state}`,
    description: `Perfil GIE de ${player.full_name}`,
  }
}

export default async function PublicPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!player) notFound()

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

  const { data: entries } = await supabase
    .from('dimension_entries')
    .select('dimension, description, self_score')
    .eq('player_id', player.id)
    .eq('is_primary', true)

  const scores: Record<string, number> = {
    d1_scanning: Number(gieScore?.d1_scanning) || 0,
    d2_decision: Number(gieScore?.d2_decision) || 0,
    d3_off_ball: Number(gieScore?.d3_off_ball) || 0,
    d4_orientation: Number(gieScore?.d4_orientation) || 0,
    d5_anticipation: Number(gieScore?.d5_anticipation) || 0,
    d6_resilience: Number(gieScore?.d6_resilience) || 0,
    d7_communication: Number(gieScore?.d7_communication) || 0,
  }

  const entryMap = new Map(entries?.map((e) => [e.dimension, e]) || [])

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <Card variant="bordered">
          <ProfileHeader player={player} gieScore={gieScore?.total_gie ? Number(gieScore.total_gie) : null} />
        </Card>

        {player.bio && (
          <Card variant="bordered">
            <p className="text-sm text-muted">{player.bio}</p>
          </Card>
        )}

        <Card variant="bordered">
          <h3 className="text-sm font-semibold mb-3">Dimensões GIE</h3>
          <GIERadarChart scores={scores} />
        </Card>

        <Card variant="bordered">
          <h3 className="text-sm font-semibold mb-3">Detalhes das Dimensões</h3>
          <div className="space-y-3">
            {DIMENSION_LIST.map((dim) => {
              const entry = entryMap.get(dim.code)
              return (
                <div key={dim.code} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: dim.color }}
                  >
                    D{dim.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dim.name}</span>
                      {entry?.self_score && (
                        <Badge variant="success" size="sm">{entry.self_score}/10</Badge>
                      )}
                    </div>
                    {entry ? (
                      <p className="text-xs text-muted mt-0.5 line-clamp-2">{entry.description}</p>
                    ) : (
                      <p className="text-xs text-muted mt-0.5 italic">Não preenchido</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {confidence && (
          <Card variant="bordered">
            <ConfidenceMeter score={Number(confidence.total_score) || 0} />
          </Card>
        )}
      </div>
    </div>
  )
}
