'use client'

import { useState, useRef } from 'react'
import * as tus from 'tus-js-client'
import { createClient } from '@/lib/supabase/client'
import { createVideoRecord } from '@/actions/video'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { formatFileSize } from '@/lib/utils/formatting'

interface VideoUploaderProps {
  playerId: string
  onComplete?: () => void
}

export function VideoUploader({ playerId, onComplete }: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [matchDate, setMatchDate] = useState('')
  const [matchDescription, setMatchDescription] = useState('')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError('')
    setProgress(0)

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setError('Sessão expirada. Faça login novamente.')
      setUploading(false)
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
      chunkSize: 6 * 1024 * 1024, // 6MB chunks
      onError: (err) => {
        setError(`Erro no upload: ${err.message}`)
        setUploading(false)
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        setProgress(Math.round((bytesUploaded / bytesTotal) * 100))
      },
      onSuccess: async () => {
        // Create video record in database
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
        } else {
          setSuccess(true)
          onComplete?.()
        }
        setUploading(false)
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
    setUploading(false)
    setProgress(0)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold mb-1">Vídeo enviado!</h3>
        <p className="text-sm text-muted mb-4">
          Agora você pode usar este vídeo para preencher as dimensões do seu álbum.
        </p>
        <Button
          onClick={() => {
            setSuccess(false)
            setFile(null)
            setProgress(0)
            setMatchDate('')
            setMatchDescription('')
            if (fileInputRef.current) fileInputRef.current.value = ''
          }}
        >
          Enviar outro vídeo
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-xl">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">Vídeo do jogo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer"
        />
        {file && (
          <p className="text-xs text-muted mt-1">
            {file.name} ({formatFileSize(file.size)})
          </p>
        )}
      </div>

      <Input
        id="matchDate"
        label="Data do jogo (opcional)"
        type="date"
        value={matchDate}
        onChange={(e) => setMatchDate(e.target.value)}
        disabled={uploading}
      />

      <Input
        id="matchDescription"
        label="Descrição do jogo (opcional)"
        value={matchDescription}
        onChange={(e) => setMatchDescription(e.target.value)}
        placeholder="Ex: Campeonato sub-15 vs Palmeirinha"
        disabled={uploading}
      />

      {uploading && (
        <div>
          <Progress value={progress} showLabel />
          <p className="text-xs text-muted mt-1">Enviando... Não feche a página.</p>
        </div>
      )}

      <div className="flex gap-3">
        {uploading ? (
          <Button variant="danger" onClick={handleCancel} className="w-full">
            Cancelar
          </Button>
        ) : (
          <Button onClick={handleUpload} disabled={!file} className="w-full">
            Enviar vídeo
          </Button>
        )}
      </div>
    </div>
  )
}
