import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VideoCard } from '@/components/video/video-card'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meus Vídeos',
}

export default async function VideosPage() {
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
    .order('uploaded_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Meus Vídeos</h1>
        <Link
          href="/videos/upload"
          className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Enviar
        </Link>
      </div>

      {videos && videos.length > 0 ? (
        <div className="space-y-2">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <h3 className="font-semibold mb-1">Nenhum vídeo ainda</h3>
          <p className="text-sm text-muted mb-4">
            Envie vídeos de jogos reais para preencher seu álbum de dimensões.
          </p>
          <Link
            href="/videos/upload"
            className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Enviar primeiro vídeo
          </Link>
        </div>
      )}
    </div>
  )
}
