import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VideoUploader } from '@/components/video/video-uploader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enviar Vídeo',
}

export default async function VideoUploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) redirect('/cadastro')

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Enviar Vídeo</h1>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4">
        <p className="text-sm text-blue-400">
          Envie vídeos de <strong>jogos reais</strong> (não treinos). Quanto mais completo o jogo, maior sua confiança no ranking.
        </p>
      </div>
      <VideoUploader playerId={player.id} />
    </div>
  )
}
