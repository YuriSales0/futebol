'use client'

import { useState } from 'react'
import { deleteVideo } from '@/actions/video'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatFileSize, formatDate, formatDuration } from '@/lib/utils/formatting'
import type { Video } from '@/lib/types'

interface VideoCardProps {
  video: Video & { thumbnail_url?: string | null }
}

export function VideoCard({ video }: VideoCardProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja deletar este vídeo? As dimensões associadas também serão removidas.')) return
    setDeleting(true)
    await deleteVideo(video.id)
  }

  const statusColors = {
    uploading: 'warning',
    processing: 'info',
    ready: 'success',
    failed: 'error',
  } as const

  const statusLabels = {
    uploading: 'Enviando',
    processing: 'Processando',
    ready: 'Pronto',
    failed: 'Erro',
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-surface border border-border rounded-2xl card-hover">
      {/* Thumbnail */}
      <div className="relative w-20 h-14 bg-surface-2 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/videos/${video.thumbnail_url}`}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
        )}
        {video.duration_seconds && (
          <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
            {formatDuration(video.duration_seconds)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{video.original_filename}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant={statusColors[video.status]} size="sm">
            {statusLabels[video.status]}
          </Badge>
          <span className="text-[10px] text-muted font-mono">{formatFileSize(video.file_size_bytes)}</span>
        </div>
        {video.match_description && (
          <p className="text-[10px] text-muted mt-1 truncate">{video.match_description}</p>
        )}
        {video.match_date && (
          <p className="text-[10px] text-muted">{formatDate(video.match_date)}</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        loading={deleting}
        className="shrink-0 text-muted hover:text-error"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </Button>
    </div>
  )
}
