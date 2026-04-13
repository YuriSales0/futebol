import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StickerAlbum } from '@/components/album/sticker-album'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meu Álbum',
}

export default async function AlbumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) redirect('/cadastro')

  const { data: entries } = await supabase
    .from('dimension_entries')
    .select('*')
    .eq('player_id', player.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Meu Álbum</h1>
      <StickerAlbum entries={entries || []} />
    </div>
  )
}
