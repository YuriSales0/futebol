import { createClient } from '@/lib/supabase/server'
import { POSITIONS } from '@/lib/constants/positions'
import { REGIONS } from '@/lib/constants/regions'
import { POSITION_LIST } from '@/lib/constants/positions'
import { REGION_LIST } from '@/lib/constants/regions'
import { formatAge } from '@/lib/utils/age'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Catálogo de Jogadores — GIE Scout' }

async function CatalogContent({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const supabase = await createClient()

  let query = supabase
    .from('players')
    .select('*, gie_scores(total_gie, d1_scanning, d2_decision, d3_off_ball, d4_orientation, d5_anticipation, d6_resilience, d7_communication), confidence_scores(total_score)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (searchParams.regiao) {
    query = query.eq('region', searchParams.regiao)
  }
  if (searchParams.posicao) {
    query = query.eq('position', searchParams.posicao)
  }

  const { data: players } = await query

  let filtered = players || []

  // Age filter
  if (searchParams.idade) {
    const [minAge, maxAge] = searchParams.idade.split('-').map(Number)
    const now = new Date()
    filtered = filtered.filter((p) => {
      const dob = new Date(p.date_of_birth)
      let age = now.getFullYear() - dob.getFullYear()
      const m = now.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--
      return age >= minAge && age <= maxAge
    })
  }

  // Sort by GIE score
  filtered.sort((a, b) => {
    const aGie = Number((a.gie_scores as { total_gie: number } | null)?.total_gie) || 0
    const bGie = Number((b.gie_scores as { total_gie: number } | null)?.total_gie) || 0
    return bGie - aGie
  })

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="font-bold">Nenhum jogador encontrado</h3>
        <p className="text-sm text-muted mt-1">Ajuste os filtros para ver mais resultados.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((p) => {
        const gieData = p.gie_scores as { total_gie: number } | null
        const confData = p.confidence_scores as { total_score: number } | null
        const gie = Number(gieData?.total_gie) || 0
        const conf = Math.round((Number(confData?.total_score) || 0) * 100)
        const pos = POSITIONS[p.position as keyof typeof POSITIONS]
        const reg = REGIONS[p.region as keyof typeof REGIONS]
        let confColor = '#ff5252'
        if (conf >= 60) confColor = '#00e676'
        else if (conf >= 30) confColor = '#ffd740'

        return (
          <Link
            key={p.id}
            href={`/jogador/${p.id}`}
            className="bg-surface border border-border rounded-2xl p-4 card-hover block"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-lg shrink-0">
                {p.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{p.full_name}</h3>
                {p.nickname && <p className="text-[10px] text-primary">&quot;{p.nickname}&quot;</p>}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md px-1.5 py-0.5">
                    {pos?.abbreviation}
                  </span>
                  <span className="text-[10px] text-muted">{p.city}, {p.state}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-sm font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {gie > 0 ? gie.toFixed(1) : '—'}
                </div>
                <div className="text-[8px] text-muted font-bold uppercase">GIE</div>
              </div>
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-sm font-black" style={{ color: confColor }}>{conf}%</div>
                <div className="text-[8px] text-muted font-bold uppercase">Conf.</div>
              </div>
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-sm font-black text-foreground">{formatAge(p.date_of_birth)}</div>
                <div className="text-[8px] text-muted font-bold uppercase">Idade</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
              <span className="text-[10px] text-muted">{reg?.name}</span>
              <span className="text-[10px] text-primary font-semibold">Ver perfil →</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  const regionOptions = [{ value: '', label: 'Todas' }, ...REGION_LIST.map((r) => ({ value: r.code, label: r.name }))]
  const positionOptions = [{ value: '', label: 'Todas' }, ...POSITION_LIST.map((p) => ({ value: p.code, label: p.name }))]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black">Catálogo de Jogadores</h1>
        <p className="text-sm text-muted mt-1">Explore talentos por região, posição e idade</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {regionOptions.map((opt) => (
          <a
            key={opt.value}
            href={opt.value ? `/catalogo?regiao=${opt.value}&posicao=${params.posicao || ''}&idade=${params.idade || ''}` : `/catalogo?posicao=${params.posicao || ''}&idade=${params.idade || ''}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              (params.regiao || '') === opt.value
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {positionOptions.map((opt) => (
          <a
            key={opt.value}
            href={opt.value ? `/catalogo?regiao=${params.regiao || ''}&posicao=${opt.value}&idade=${params.idade || ''}` : `/catalogo?regiao=${params.regiao || ''}&idade=${params.idade || ''}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              (params.posicao || '') === opt.value
                ? 'bg-secondary/10 text-secondary border-secondary/30'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-surface border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        }
      >
        <CatalogContent searchParams={params} />
      </Suspense>
    </div>
  )
}
