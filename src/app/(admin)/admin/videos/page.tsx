import { createClient } from '@/lib/supabase/server'
import { formatFileSize, formatDate } from '@/lib/utils/formatting'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Vídeos — Admin' }

export default async function AdminVideosPage() {
  const supabase = await createClient()

  const { data: videos } = await supabase
    .from('videos')
    .select('*, players(full_name, city, state)')
    .order('uploaded_at', { ascending: false })
    .limit(100)

  const statusCounts = { ready: 0, uploading: 0, processing: 0, failed: 0 }
  videos?.forEach((v) => { statusCounts[v.status as keyof typeof statusCounts]++ })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black">Vídeos</h1>
        <p className="text-sm text-muted mt-1">{videos?.length ?? 0} vídeos no sistema</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Prontos', count: statusCounts.ready, color: 'text-primary bg-primary/10' },
          { label: 'Enviando', count: statusCounts.uploading, color: 'text-accent bg-accent/10' },
          { label: 'Processando', count: statusCounts.processing, color: 'text-blue-400 bg-blue-500/10' },
          { label: 'Falha', count: statusCounts.failed, color: 'text-error bg-error/10' },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className={`text-xl font-black ${s.color.split(' ')[0]}`}>{s.count}</div>
            <div className="text-[10px] text-muted font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-muted uppercase tracking-wider bg-surface-2">
                <th className="px-4 py-3 font-semibold">Jogador</th>
                <th className="px-4 py-3 font-semibold">Arquivo</th>
                <th className="px-4 py-3 font-semibold">Tamanho</th>
                <th className="px-4 py-3 font-semibold">Descrição</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {videos?.map((v) => (
                <tr key={v.id} className="border-t border-border/50 hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium">
                    {(v.players as { full_name: string } | null)?.full_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted truncate max-w-[180px] font-mono text-xs">
                    {v.original_filename}
                  </td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">{formatFileSize(v.file_size_bytes)}</td>
                  <td className="px-4 py-3 text-muted truncate max-w-[150px] text-xs">{v.match_description || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'ready' ? 'bg-primary/10 text-primary' :
                      v.status === 'failed' ? 'bg-error/10 text-error' :
                      'bg-accent/10 text-accent'
                    }`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">{formatDate(v.uploaded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
