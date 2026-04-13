import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StickerAlbum } from '@/components/album/sticker-album'
import Link from 'next/link'
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
    .select('id, full_name')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) redirect('/cadastro')

  const [{ data: entries }, { count: videoCount }] = await Promise.all([
    supabase.from('dimension_entries').select('*').eq('player_id', player.id).order('created_at', { ascending: false }),
    supabase.from('videos').select('*', { count: 'exact', head: true }).eq('player_id', player.id).eq('status', 'ready'),
  ])

  const hasVideos = (videoCount ?? 0) > 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black">Meu Álbum</h1>
          <p className="text-xs text-muted mt-0.5">Preencha as 7 dimensões da inteligência de jogo</p>
        </div>
      </div>

      {!hasVideos && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎬</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Envie seu primeiro vídeo</p>
              <p className="text-xs text-muted mt-0.5">
                Você precisa de pelo menos um vídeo de jogo real para preencher as dimensões.
              </p>
              <Link
                href="/videos/upload"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-2 hover:underline"
              >
                Enviar vídeo
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      <StickerAlbum entries={entries || []} />
    </div>
  )
}
