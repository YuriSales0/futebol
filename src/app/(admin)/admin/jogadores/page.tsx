import { createClient } from '@/lib/supabase/server'
import { POSITIONS } from '@/lib/constants/positions'
import { REGIONS } from '@/lib/constants/regions'
import { formatAge } from '@/lib/utils/age'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Jogadores — Admin' }

export default async function AdminPlayersPage() {
  const supabase = await createClient()

  const { data: players } = await supabase
    .from('players')
    .select('*, gie_scores(total_gie), confidence_scores(total_score)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black">Jogadores</h1>
        <p className="text-sm text-muted mt-1">{players?.length ?? 0} jogadores cadastrados</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-muted uppercase tracking-wider bg-surface-2">
                <th className="px-4 py-3 font-semibold">Jogador</th>
                <th className="px-4 py-3 font-semibold">Posição</th>
                <th className="px-4 py-3 font-semibold">Região</th>
                <th className="px-4 py-3 font-semibold">Idade</th>
                <th className="px-4 py-3 font-semibold">GIE</th>
                <th className="px-4 py-3 font-semibold">Confiança</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {players?.map((p) => {
                const gie = (p.gie_scores as { total_gie: number } | null)?.total_gie
                const conf = (p.confidence_scores as { total_score: number } | null)?.total_score
                const pos = POSITIONS[p.position as keyof typeof POSITIONS]
                const reg = REGIONS[p.region as keyof typeof REGIONS]
                return (
                  <tr key={p.id} className="border-t border-border/50 hover:bg-surface-2/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/jogador/${p.id}`} className="hover:text-primary transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                            {p.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{p.full_name}</p>
                            <p className="text-[10px] text-muted">{p.city}, {p.state}</p>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md px-1.5 py-0.5">
                        {pos?.abbreviation ?? p.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{reg?.name ?? p.region}</td>
                    <td className="px-4 py-3 text-muted text-xs">{formatAge(p.date_of_birth)}</td>
                    <td className="px-4 py-3">
                      {gie && Number(gie) > 0 ? (
                        <span className="font-black text-primary">{Number(gie).toFixed(1)}</span>
                      ) : (
                        <span className="text-muted/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {conf ? (
                        <span className="font-mono text-xs">{Math.round(Number(conf) * 100)}%</span>
                      ) : (
                        <span className="text-muted/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.is_active
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-error/10 text-error border border-error/20'
                      }`}>
                        {p.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
