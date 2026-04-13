import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GIERadarChart } from '@/components/profile/gie-radar-chart'
import { ConfidenceBreakdown } from '@/components/confidence/confidence-breakdown'
import { POSITIONS } from '@/lib/constants/positions'
import { REGIONS } from '@/lib/constants/regions'
import { DIMENSION_LIST } from '@/lib/constants/dimensions'
import { formatAge } from '@/lib/utils/age'
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

  const [{ data: gieScore }, { data: confidence }, { data: entries }, { data: videoCount }] = await Promise.all([
    supabase.from('gie_scores').select('*').eq('player_id', player.id).single(),
    supabase.from('confidence_scores').select('*').eq('player_id', player.id).single(),
    supabase.from('dimension_entries').select('dimension').eq('player_id', player.id).eq('is_primary', true),
    supabase.from('videos').select('*', { count: 'exact', head: true }).eq('player_id', player.id).eq('status', 'ready'),
  ])

  const totalGie = gieScore?.total_gie ? Number(gieScore.total_gie) : 0
  const totalConfidence = confidence?.total_score ? Number(confidence.total_score) : 0
  const filledDimensions = entries?.length ?? 0
  const totalVideos = videoCount ?? 0
  const position = POSITIONS[player.position as keyof typeof POSITIONS]
  const region = REGIONS[player.region as keyof typeof REGIONS]

  const scores: Record<string, number> = {
    d1_scanning: Number(gieScore?.d1_scanning) || 0,
    d2_decision: Number(gieScore?.d2_decision) || 0,
    d3_off_ball: Number(gieScore?.d3_off_ball) || 0,
    d4_orientation: Number(gieScore?.d4_orientation) || 0,
    d5_anticipation: Number(gieScore?.d5_anticipation) || 0,
    d6_resilience: Number(gieScore?.d6_resilience) || 0,
    d7_communication: Number(gieScore?.d7_communication) || 0,
  }

  const confPercent = Math.round(totalConfidence * 100)
  let confColor = '#ff5252'
  if (confPercent >= 60) confColor = '#00e676'
  else if (confPercent >= 30) confColor = '#ffd740'

  return (
    <div className="space-y-4 -mt-2">
      {/* === PLAYER CARD (FIFA-style) === */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface-2 to-surface border border-border">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-[60px]" />

        <div className="relative p-5 pb-4">
          {/* Header: avatar + info */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-background font-black text-3xl shadow-lg shadow-primary/30">
                {player.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-lg px-1.5 py-0.5 border border-border">
                <span className="text-[10px] font-black text-primary">{position?.abbreviation}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-xl font-black truncate">{player.full_name}</h1>
              {player.nickname && (
                <p className="text-sm text-primary font-semibold">&quot;{player.nickname}&quot;</p>
              )}
              <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
                <span>{player.city}, {player.state}</span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span>{region?.name}</span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span>{formatAge(player.date_of_birth)}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            <div className="bg-surface-2/80 rounded-xl p-3 text-center border border-border/50">
              <div className="text-xl font-black bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
                {totalGie > 0 ? totalGie.toFixed(1) : '—'}
              </div>
              <div className="text-[10px] text-muted font-semibold mt-0.5">GIE SCORE</div>
            </div>
            <div className="bg-surface-2/80 rounded-xl p-3 text-center border border-border/50">
              <div className="text-xl font-black" style={{ color: confColor }}>
                {confPercent}%
              </div>
              <div className="text-[10px] text-muted font-semibold mt-0.5">CONFIANÇA</div>
            </div>
            <div className="bg-surface-2/80 rounded-xl p-3 text-center border border-border/50">
              <div className="text-xl font-black text-foreground">
                {filledDimensions}<span className="text-muted text-sm">/7</span>
              </div>
              <div className="text-[10px] text-muted font-semibold mt-0.5">DIMENSÕES</div>
            </div>
            <div className="bg-surface-2/80 rounded-xl p-3 text-center border border-border/50">
              <div className="text-xl font-black text-foreground">{totalVideos}</div>
              <div className="text-[10px] text-muted font-semibold mt-0.5">VÍDEOS</div>
            </div>
          </div>

          {/* Extra info chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {player.current_club && (
              <span className="text-[10px] font-semibold bg-surface-2 border border-border rounded-lg px-2.5 py-1 text-muted">
                {player.current_club}
              </span>
            )}
            {player.height_cm && (
              <span className="text-[10px] font-semibold bg-surface-2 border border-border rounded-lg px-2.5 py-1 text-muted">
                {player.height_cm}cm
              </span>
            )}
            {player.preferred_foot && (
              <span className="text-[10px] font-semibold bg-surface-2 border border-border rounded-lg px-2.5 py-1 text-muted">
                Pé {player.preferred_foot}
              </span>
            )}
            {player.secondary_position && (
              <span className="text-[10px] font-semibold bg-surface-2 border border-border rounded-lg px-2.5 py-1 text-muted">
                2a: {POSITIONS[player.secondary_position as keyof typeof POSITIONS]?.abbreviation}
              </span>
            )}
          </div>

          <Link
            href="/perfil/editar"
            className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-xl py-2.5 hover:bg-primary/20 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Editar perfil
          </Link>
        </div>
      </div>

      {/* === BIO === */}
      {player.bio && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-sm text-muted leading-relaxed italic">&ldquo;{player.bio}&rdquo;</p>
        </div>
      )}

      {/* === RADAR CHART === */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Inteligência de Jogo</h3>
          {totalGie > 0 && (
            <span className="text-xs font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GIE {totalGie.toFixed(1)}
            </span>
          )}
        </div>
        <GIERadarChart scores={scores} />

        {/* Dimension legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4">
          {DIMENSION_LIST.map((dim) => {
            const score = scores[dim.code] ?? 0
            return (
              <div key={dim.code} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dim.color }} />
                <span className="text-[11px] text-muted truncate">{dim.name}</span>
                {score > 0 && (
                  <span className="text-[11px] font-bold ml-auto" style={{ color: dim.color }}>{score.toFixed(0)}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* === CONFIDENCE LAYER === */}
      {confidence && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Confidence Layer</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: confColor }}>
                <span className="text-[10px] font-black" style={{ color: confColor }}>{confPercent}</span>
              </div>
            </div>
          </div>
          <ConfidenceBreakdown confidence={confidence} />
        </div>
      )}
    </div>
  )
}
