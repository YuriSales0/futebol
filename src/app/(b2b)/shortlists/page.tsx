import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/utils/roles'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Minhas Shortlists — GIE Scout' }

export default async function ShortlistsPage() {
  const userRole = await getUserRole()
  if (!userRole) redirect('/entrar')

  const supabase = await createClient()

  const { data: shortlists } = await supabase
    .from('shortlists')
    .select('*, shortlist_players(count)')
    .eq('scout_profile_id', userRole.profileId)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Minhas Shortlists</h1>
          <p className="text-sm text-muted mt-1">Organize seus jogadores favoritos</p>
        </div>
      </div>

      {shortlists && shortlists.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortlists.map((sl) => {
            const playerCount = (sl.shortlist_players as { count: number }[] | null)?.[0]?.count ?? 0
            return (
              <div key={sl.id} className="bg-surface border border-border rounded-2xl p-5 card-hover">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{sl.name}</h3>
                    <p className="text-xs text-muted mt-1">{playerCount} jogadores</p>
                  </div>
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-[10px] text-muted mt-3 font-mono">
                  Atualizado em {new Date(sl.updated_at as string).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="font-bold mb-1">Nenhuma shortlist ainda</h3>
          <p className="text-sm text-muted mb-4">
            Explore o catálogo e salve jogadores nas suas listas.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 bg-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-purple-600 transition-colors"
          >
            Explorar catálogo
          </Link>
        </div>
      )}
    </div>
  )
}
