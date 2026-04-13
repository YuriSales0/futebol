'use client'

import { useState, useRef } from 'react'
import * as tus from 'tus-js-client'
import { createClient } from '@/lib/supabase/client'
import { createVideoRecord } from '@/actions/video'
import { updateVideoMetadata, saveThumbnail, analyzeVideoThumbnail } from '@/actions/video-analysis'
import { extractVideoMetadata, blobToBase64 } from '@/lib/utils/video-analysis'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { formatFileSize, formatDuration } from '@/lib/utils/formatting'

interface VideoUploaderProps {
  playerId: string
  onComplete?: () => void
}

type UploadPhase = 'idle' | 'analyzing' | 'uploading' | 'processing' | 'done'

export function VideoUploader({ playerId, onComplete }: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [matchDate, setMatchDate] = useState('')
  const [matchDescription, setMatchDescription] = useState('')
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [metadata, setMetadata] = useState<{ duration: number; width: number; height: number } | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<{ scene: string; description: string; isFootball: boolean } | null>(null)
  const uploadRef = useRef<tus.Upload | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
    if (!validTypes.includes(selected.type)) {
      setError('Formato não suportado. Use MP4, MOV ou WebM.')
      return
    }

    if (selected.size > 500 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 500MB.')
      return
    }

    setFile(selected)
    setError('')
    setMetadata(null)
    setThumbnailUrl(null)
    setAnalysisResult(null)

    // Extract metadata + thumbnail in background
    setPhase('analyzing')
    extractVideoMetadata(selected)
      .then((meta) => {
        setMetadata({ duration: meta.durationSeconds, width: meta.width, height: meta.height })
        if (meta.thumbnailBlob) {
          const url = URL.createObjectURL(meta.thumbnailBlob)
          setThumbnailUrl(url)
        }
        setPhase('idle')
      })
      .catch(() => {
        setPhase('idle')
      })
  }

  async function handleUpload() {
    if (!file) return
    setPhase('uploading')
    setError('')
    setProgress(0)

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setError('Sessão expirada. Faça login novamente.')
      setPhase('idle')
      return
    }

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const storagePath = `${session.user.id}/${fileName}`

    const upload = new tus.Upload(file, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        'x-upsert': 'true',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: 'videos',
        objectName: storagePath,
        contentType: file.type,
      },
      chunkSize: 6 * 1024 * 1024,
      onError: (err) => {
        setError(`Erro no upload: ${err.message}`)
        setPhase('idle')
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        setProgress(Math.round((bytesUploaded / bytesTotal) * 100))
      },
      onSuccess: async () => {
        setPhase('processing')

        // 1. Create video record
        const result = await createVideoRecord({
          playerId,
          storagePath,
          originalFilename: file.name,
          fileSizeBytes: file.size,
          matchDate: matchDate || undefined,
          matchDescription: matchDescription || undefined,
        })

        if (result.error) {
          setError(result.error)
          setPhase('idle')
          return
        }

        const videoId = result.data?.id

        if (videoId) {
          // 2. Save metadata (duration)
          if (metadata) {
            await updateVideoMetadata(videoId, {
              durationSeconds: metadata.duration,
              width: metadata.width,
              height: metadata.height,
            })
          }

          // 3. Save thumbnail + 4. AI analysis (in parallel)
          const promises: Promise<unknown>[] = []

          if (thumbnailUrl) {
            // Get the blob from the extracted metadata
            try {
              const meta = await extractVideoMetadata(file)
              if (meta.thumbnailBlob) {
                const base64 = await blobToBase64(meta.thumbnailBlob)
                promises.push(saveThumbnail(videoId, playerId, base64))
                promises.push(analyzeVideoThumbnail(videoId, base64).then((res) => {
                  if (res.data) {
                    setAnalysisResult({
                      scene: res.data.scene,
                      description: res.data.description,
                      isFootball: res.data.isFootballMatch,
                    })
                  }
                }))
              }
            } catch {
              // Non-critical — proceed without thumbnail/analysis
            }
          }

          await Promise.allSettled(promises)
        }

        setSuccess(true)
        setPhase('done')
        onComplete?.()
      },
    })

    uploadRef.current = upload
    upload.start()
  }

  function handleCancel() {
    if (uploadRef.current) {
      uploadRef.current.abort()
      uploadRef.current = null
    }
    setPhase('idle')
    setProgress(0)
  }

  function handleReset() {
    setSuccess(false)
    setFile(null)
    setProgress(0)
    setMatchDate('')
    setMatchDescription('')
    setMetadata(null)
    setThumbnailUrl(null)
    setAnalysisResult(null)
    setPhase('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold mb-1">Vídeo enviado!</h3>

        {analysisResult && (
          <div className={`mt-3 mx-auto max-w-sm p-3 rounded-xl text-xs ${
            analysisResult.isFootball
              ? 'bg-primary/10 border border-primary/20 text-primary'
              : 'bg-accent/10 border border-accent/20 text-accent'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{analysisResult.isFootball ? '✅' : '⚠️'}</span>
              <span className="font-bold">
                {analysisResult.isFootball ? 'Jogo de futebol detectado' : 'Conteúdo não identificado como jogo'}
              </span>
            </div>
            <p className="text-muted text-[11px]">{analysisResult.description}</p>
          </div>
        )}

        <p className="text-sm text-muted mt-3 mb-4">
          Agora preencha as dimensões do seu álbum com este vídeo.
        </p>
        <Button onClick={handleReset}>
          Enviar outro vídeo
        </Button>
      </div>
    )
  }

  const isUploading = phase === 'uploading' || phase === 'processing'

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-xl">{error}</div>
      )}

      {/* File picker */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Vídeo do jogo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary-dark file:cursor-pointer"
        />
      </div>

      {/* Metadata preview */}
      {file && (
        <div className="bg-surface border border-border rounded-xl p-3">
          <div className="flex items-start gap-3">
            {/* Thumbnail */}
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt="Preview"
                className="w-24 h-16 object-cover rounded-lg shrink-0"
              />
            ) : (
              <div className="w-24 h-16 bg-surface-2 rounded-lg flex items-center justify-center shrink-0">
                {phase === 'analyzing' ? (
                  <svg className="w-5 h-5 text-muted animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{file.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                <span>{formatFileSize(file.size)}</span>
                {metadata && (
                  <>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>{formatDuration(metadata.duration)}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span>{metadata.width}x{metadata.height}</span>
                  </>
                )}
              </div>
              {metadata && metadata.duration < 60 && (
                <p className="text-[10px] text-accent mt-1">
                  ⚠️ Vídeo curto — jogos completos aumentam sua confiança no ranking
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Input
        id="matchDate"
        label="Data do jogo (opcional)"
        type="date"
        value={matchDate}
        onChange={(e) => setMatchDate(e.target.value)}
        disabled={isUploading}
      />

      <Input
        id="matchDescription"
        label="Descrição do jogo (opcional)"
        value={matchDescription}
        onChange={(e) => setMatchDescription(e.target.value)}
        placeholder="Ex: Campeonato sub-15 vs Palmeirinha"
        disabled={isUploading}
      />

      {/* Upload progress */}
      {phase === 'uploading' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted">Enviando vídeo...</span>
            <span className="text-xs font-mono text-primary">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {phase === 'processing' && (
        <div className="flex items-center gap-2 text-xs text-muted">
          <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processando vídeo e gerando análise...
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {isUploading ? (
          <Button variant="danger" onClick={handleCancel} className="w-full">
            Cancelar
          </Button>
        ) : (
          <Button
            onClick={handleUpload}
            disabled={!file || phase === 'analyzing'}
            className="w-full"
          >
            {phase === 'analyzing' ? 'Analisando vídeo...' : 'Enviar vídeo'}
          </Button>
        )}
      </div>
    </div>
  )
}
