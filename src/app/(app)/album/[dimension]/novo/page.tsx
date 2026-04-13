import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DIMENSIONS } from '@/lib/constants/dimensions'
import { DimensionForm } from '@/components/album/dimension-form'
import type { Metadata } from 'next'
import type { DimensionCode } from '@/lib/constants/dimensions'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dimension: string }>
}): Promise<Metadata> {
  const { dimension } = await params
  const dim = DIMENSIONS[dimension as DimensionCode]
  if (!dim) return { title: 'Nova Entrada' }
  return { title: `Nova Entrada — ${dim.name}` }
}

export default async function NewDimensionEntryPage({
  params,
}: {
  params: Promise<{ dimension: string }>
}) {
  const { dimension } = await params
  const dim = DIMENSIONS[dimension as DimensionCode]
  if (!dim) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) redirect('/cadastro')

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('player_id', player.id)
    .eq('status', 'ready')
    .order('uploaded_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: dim.color }}
        >
          D{dim.number}
        </div>
        <div>
          <h1 className="text-lg font-bold">{dim.name}</h1>
          <p className="text-xs text-muted">{dim.subtitle}</p>
        </div>
      </div>
      <DimensionForm
        dimension={dim}
        playerId={player.id}
        videos={videos || []}
      />
    </div>
  )
}
