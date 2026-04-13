import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Usuários — Admin' }

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const roleCounts = { player: 0, scout: 0, admin: 0 }
  profiles?.forEach((p) => { roleCounts[p.role as keyof typeof roleCounts]++ })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black">Usuários</h1>
        <p className="text-sm text-muted mt-1">{profiles?.length ?? 0} usuários no sistema</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Jogadores', count: roleCounts.player, icon: '⚽', color: 'text-primary' },
          { label: 'Scouts/Clubes', count: roleCounts.scout, icon: '🔍', color: 'text-secondary' },
          { label: 'Admins', count: roleCounts.admin, icon: '👑', color: 'text-accent' },
        ].map((r) => (
          <div key={r.label} className="bg-surface border border-border rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{r.icon}</div>
            <div className={`text-2xl font-black ${r.color}`}>{r.count}</div>
            <div className="text-[10px] text-muted font-semibold">{r.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-muted uppercase tracking-wider bg-surface-2">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {profiles?.map((p) => (
                <tr key={p.id} className="border-t border-border/50 hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{(p.id as string).slice(0, 8)}...</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      p.role === 'admin' ? 'bg-accent/10 text-accent border border-accent/20' :
                      p.role === 'scout' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                      'bg-primary/10 text-primary border border-primary/20'
                    }`}>{p.role as string}</span>
                  </td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">
                    {new Date(p.created_at as string).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
