import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { GIERadarChart } from '@/components/profile/gie-radar-chart'
import { POSITIONS } from '@/lib/constants/positions'
import { REGIONS } from '@/lib/constants/regions'
import { DIMENSION_LIST } from '@/lib/constants/dimensions'
import { formatAge } from '@/lib/utils/age'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: player } = await supabase.from('players').select('full_name, position, city, state').eq('id', id).single()
  if (!player) return { title: 'Jogador não encontrado' }
  return {
    title: `${player.full_name} — ${player.city}, ${player.state}`,
    description: `Perfil GIE de ${player.full_name}. Veja as 7 dimensões da inteligência de jogo.`,
  }
}

export default async function PublicPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: player } = await supabase.from('players').select('*').eq('id', id).eq('is_active', true).single()
  if (!player) notFound()

  const [{ data: gieScore }, { data: confidence }, { data: entries }, { data: videoCount }] = await Promise.all([
    supabase.from('gie_scores').select('*').eq('player_id', player.id).single(),
    supabase.from('confidence_scores').select('*').eq('player_id', player.id).single(),
    supabase.from('dimension_entries').select('dimension, description, self_score').eq('player_id', player.id).eq('is_primary', true),
    supabase.from('videos').select('*', { count: 'exact', head: true }).eq('player_id', player.id).eq('status', 'ready'),
  ])

  const totalGie = gieScore?.total_gie ? Number(gieScore.total_gie) : 0
  const totalConfidence = confidence?.total_score ? Number(confidence.total_score) : 0
  const filledDimensions = entries?.length ?? 0
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

  const entryMap = new Map(entries?.map((e) => [e.dimension, e]) || [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
              <span className="text-background text-xs font-black">G</span>
            </div>
            <span className="text-xs font-black text-primary">GIE</span>
          </div>
          <span className="text-[10px] text-muted bg-surface border border-border rounded-lg px-2.5 py-1 font-mono">
            Relatório do Jogador
          </span>
        </div>

        {/* === SCOUT PLAYER CARD === */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface-2 to-surface border border-border">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/8 to-transparent" />
          <div className="relative p-6">
            {/* Player identity */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-background font-black text-3xl shadow-lg shadow-primary/20">
                {player.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black">{player.full_name}</h1>
                </div>
                {player.nickname && (
                  <p className="text-sm text-primary font-semibold">&quot;{player.nickname}&quot;</p>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                    {position?.name}
                  </span>
                  <span>{player.city}, {player.state}</span>
                </div>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { label: 'GIE', value: totalGie > 0 ? totalGie.toFixed(1) : '—', gradient: true },
                { label: 'Confiança', value: `${confPercent}%`, color: confColor },
                { label: 'Dimensões', value: `${filledDimensions}/7` },
                { label: 'Vídeos', value: String(videoCount ?? 0) },
              ].map((stat) => (
                <div key={stat.label} className="bg-background/50 rounded-xl p-3 text-center border border-border/50">
                  <div
                    className={`text-lg font-black ${stat.gradient ? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent' : ''}`}
                    style={stat.color ? { color: stat.color } : undefined}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-muted font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Player details */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Idade</span>
                <span className="font-semibold">{formatAge(player.date_of_birth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Região</span>
                <span className="font-semibold">{region?.name}</span>
              </div>
              {player.height_cm && (
                <div className="flex justify-between">
                  <span className="text-muted">Altura</span>
                  <span className="font-semibold">{player.height_cm}cm</span>
                </div>
              )}
              {player.preferred_foot && (
                <div className="flex justify-between">
                  <span className="text-muted">Pé</span>
                  <span className="font-semibold capitalize">{player.preferred_foot}</span>
                </div>
              )}
              {player.current_club && (
                <div className="flex justify-between col-span-2">
                  <span className="text-muted">Clube</span>
                  <span className="font-semibold">{player.current_club}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {player.bio && (
          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-sm text-muted leading-relaxed italic">&ldquo;{player.bio}&rdquo;</p>
          </div>
        )}

        {/* === RADAR === */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Mapa de Inteligência</h3>
          <GIERadarChart scores={scores} />
        </div>

        {/* === DIMENSION DETAILS (B2B explainability) === */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Análise por Dimensão</h3>
          <div className="space-y-4">
            {DIMENSION_LIST.map((dim) => {
              const entry = entryMap.get(dim.code)
              const score = scores[dim.code] ?? 0
              return (
                <div key={dim.code}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0"
                      style={{
                        backgroundColor: score > 0 ? dim.color : `${dim.color}30`,
                        boxShadow: score > 0 ? `0 2px 10px ${dim.color}30` : 'none',
                      }}
                    >
                      D{dim.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{dim.name}</span>
                        <span className="text-[10px] text-muted">Peso {dim.weight * 100}%</span>
                      </div>
                    </div>
                    {score > 0 ? (
                      <span className="text-sm font-black" style={{ color: dim.color }}>{score.toFixed(0)}/10</span>
                    ) : (
                      <span className="text-xs text-muted/40">—</span>
                    )}
                  </div>
                  {/* Score bar */}
                  <div className="h-1 bg-surface-2 rounded-full overflow-hidden ml-11 mb-1">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${score * 10}%`, backgroundColor: dim.color }}
                    />
                  </div>
                  {entry ? (
                    <p className="text-[11px] text-muted ml-11 leading-relaxed">{entry.description}</p>
                  ) : (
                    <p className="text-[11px] text-muted/30 ml-11 italic">Não preenchido</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* === CONFIDENCE LAYER (B2B trust) === */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Confidence Layer</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: confColor }} />
              <span className="text-xs font-black" style={{ color: confColor }}>{confPercent}%</span>
            </div>
          </div>
          {confidence && (
            <div className="space-y-2.5">
              {[
                { label: 'Fonte do vídeo', value: Number(confidence.video_source_score), desc: 'Self-submitted vs jogo completo' },
                { label: 'Validação externa', value: Number(confidence.validation_score), desc: 'Embaixador, academia ou GIE Day' },
                { label: 'Recência', value: Number(confidence.recency_score), desc: 'Último vídeo enviado' },
                { label: 'Amostra', value: Number(confidence.sample_size_score), desc: 'Quantidade de jogos analisados' },
                { label: 'Consistência', value: Number(confidence.consistency_score), desc: 'Estabilidade do score entre jogos' },
              ].map((item) => {
                const pct = Math.round(item.value * 100)
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-0.5">
                      <div>
                        <span className="text-[11px] font-semibold text-foreground">{item.label}</span>
                        <span className="text-[9px] text-muted ml-2">{item.desc}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-muted">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 60 ? '#00e676' : pct >= 30 ? '#ffd740' : '#ff5252',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-[10px] text-muted">
            Relatório gerado pela <span className="font-bold text-primary">GIE</span> — Game Intelligence Engine
          </p>
          <p className="text-[9px] text-muted/50 mt-1">
            Score de priorização, não predição. Decisão final é sempre do scout/clube.
          </p>
        </div>
      </div>
    </div>
  )
}
