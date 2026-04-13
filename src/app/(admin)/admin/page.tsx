import { createClient } from '@/lib/supabase/server'
import { REGIONS } from '@/lib/constants/regions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

async function getMetrics() {
  const supabase = await createClient()

  const [
    { count: totalPlayers },
    { count: activePlayers },
    { count: totalVideos },
    { count: totalEntries },
    { count: totalScouts },
    { data: regionData },
    { data: recentPlayers },
    { data: recentVideos },
  ] = await Promise.all([
    supabase.from('players').select('*', { count: 'exact', head: true }),
    supabase.from('players').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('videos').select('*', { count: 'exact', head: true }),
    supabase.from('dimension_entries').select('*', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'scout'),
    supabase.from('players').select('region').eq('is_active', true),
    supabase.from('players').select('full_name, city, state, region, position, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('videos').select('original_filename, file_size_bytes, status, uploaded_at, players(full_name)').order('uploaded_at', { ascending: false }).limit(10),
  ])

  // Region breakdown
  const regionCounts: Record<string, number> = {}
  regionData?.forEach((p) => {
    regionCounts[p.region] = (regionCounts[p.region] || 0) + 1
  })

  return {
    totalPlayers: totalPlayers ?? 0,
    activePlayers: activePlayers ?? 0,
    totalVideos: totalVideos ?? 0,
    totalEntries: totalEntries ?? 0,
    totalScouts: totalScouts ?? 0,
    regionCounts,
    recentPlayers: recentPlayers ?? [],
    recentVideos: recentVideos ?? [],
  }
}

export default async function AdminDashboard() {
  const m = await getMetrics()

  const KPI_CARDS = [
    { label: 'Jogadores', value: m.totalPlayers, sub: `${m.activePlayers} ativos`, color: 'from-primary to-emerald-400', icon: '⚽' },
    { label: 'Vídeos', value: m.totalVideos, sub: 'enviados', color: 'from-blue-500 to-cyan-400', icon: '🎬' },
    { label: 'Dimensões', value: m.totalEntries, sub: 'preenchidas', color: 'from-secondary to-purple-400', icon: '🧩' },
    { label: 'Scouts/Clubes', value: m.totalScouts, sub: 'cadastrados', color: 'from-accent to-yellow-400', icon: '🏢' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Visão geral da plataforma GIE</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted font-semibold uppercase tracking-wider">{kpi.label}</p>
                <p className={`text-3xl font-black mt-1 bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                  {kpi.value}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{kpi.sub}</p>
              </div>
              <span className="text-2xl">{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Region breakdown + Recent activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Region map */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Distribuição por Região</h3>
          <div className="space-y-3">
            {Object.entries(REGIONS).map(([code, region]) => {
              const count = m.regionCounts[code] || 0
              const maxCount = Math.max(...Object.values(m.regionCounts), 1)
              const pct = Math.round((count / maxCount) * 100)
              return (
                <div key={code}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{region.name}</span>
                    <span className="text-sm font-black text-primary">{count}</span>
                  </div>
                  <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent players */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Jogadores Recentes</h3>
          {m.recentPlayers.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">Nenhum jogador cadastrado ainda</p>
          ) : (
            <div className="space-y-2">
              {m.recentPlayers.map((p, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                    {(p.full_name as string).charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.full_name as string}</p>
                    <p className="text-[10px] text-muted">{p.city as string}, {p.state as string} — {p.position as string}</p>
                  </div>
                  <span className="text-[10px] text-muted font-mono">
                    {new Date(p.created_at as string).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent videos */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Vídeos Recentes</h3>
        {m.recentVideos.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">Nenhum vídeo enviado ainda</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] text-muted uppercase tracking-wider">
                  <th className="pb-2 font-semibold">Jogador</th>
                  <th className="pb-2 font-semibold">Arquivo</th>
                  <th className="pb-2 font-semibold">Tamanho</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Data</th>
                </tr>
              </thead>
              <tbody>
                {m.recentVideos.map((v, i) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="py-2 font-medium">{(v.players as unknown as { full_name: string } | null)?.full_name ?? '—'}</td>
                    <td className="py-2 text-muted truncate max-w-[150px]">{v.original_filename as string}</td>
                    <td className="py-2 text-muted font-mono text-xs">
                      {((v.file_size_bytes as number) / (1024 * 1024)).toFixed(1)}MB
                    </td>
                    <td className="py-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.status === 'ready' ? 'bg-primary/10 text-primary' :
                        v.status === 'failed' ? 'bg-error/10 text-error' :
                        'bg-accent/10 text-accent'
                      }`}>
                        {v.status as string}
                      </span>
                    </td>
                    <td className="py-2 text-muted font-mono text-xs">
                      {new Date(v.uploaded_at as string).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
