'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDimensionEntry } from '@/actions/dimension'
import { recalculateConfidence } from '@/actions/confidence'
import { recalculateGIEScore } from '@/actions/gie-score'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { VideoPlayer } from '@/components/video/video-player'
import { formatTimestamp, parseTimestamp } from '@/lib/utils/formatting'
import type { DimensionMeta } from '@/lib/constants/dimensions'
import type { Video } from '@/lib/types'

interface DimensionFormProps {
  dimension: DimensionMeta
  playerId: string
  videos: Video[]
}

export function DimensionForm({ dimension, playerId, videos }: DimensionFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [selfScore, setSelfScore] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedVideo = videos.find((v) => v.id === selectedVideoId)

  const videoOptions = videos
    .filter((v) => v.status === 'ready')
    .map((v) => ({
      value: v.id,
      label: `${v.original_filename}${v.match_description ? ` — ${v.match_description}` : ''}`,
    }))

  async function handleSubmit() {
    if (!selectedVideoId || !startTime || !endTime || !description) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    const startSeconds = parseTimestamp(startTime)
    const endSeconds = parseTimestamp(endTime)

    if (endSeconds <= startSeconds) {
      setError('O tempo final deve ser maior que o inicial.')
      return
    }

    setLoading(true)
    setError('')

    const result = await createDimensionEntry({
      playerId,
      dimension: dimension.code,
      videoId: selectedVideoId,
      startTimeSeconds: startSeconds,
      endTimeSeconds: endSeconds,
      description,
      selfScore: selfScore ? Number(selfScore) : undefined,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Recalculate scores in parallel
    await Promise.all([
      recalculateConfidence(playerId),
      recalculateGIEScore(playerId),
    ])

    router.push(`/album/${dimension.code}`)
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted mb-4">
          Você precisa enviar um vídeo de jogo antes de preencher esta dimensão.
        </p>
        <Button onClick={() => router.push('/videos/upload')}>
          Enviar vídeo
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-xl">{error}</div>
      )}

      {/* Step 1: Select video */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-muted'}`}>1</span>
          <h3 className="font-medium text-sm">Selecione o vídeo</h3>
        </div>
        <Select
          id="video"
          options={videoOptions}
          placeholder="Escolha um vídeo"
          value={selectedVideoId}
          onChange={(e) => {
            setSelectedVideoId(e.target.value)
            if (e.target.value) setStep(Math.max(step, 2))
          }}
        />
      </div>

      {/* Step 2: Mark timestamps */}
      {step >= 2 && selectedVideo && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-muted'}`}>2</span>
            <h3 className="font-medium text-sm">Marque o trecho (minuto:segundo)</h3>
          </div>
          <VideoPlayer src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${selectedVideo.storage_path}`} />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Input
              id="startTime"
              label="Início"
              placeholder="0:00"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value)
                if (e.target.value) setStep(Math.max(step, 3))
              }}
            />
            <Input
              id="endTime"
              label="Fim"
              placeholder="0:30"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value)
                if (e.target.value) setStep(Math.max(step, 3))
              }}
            />
          </div>
          {startTime && endTime && (
            <p className="text-xs text-muted mt-1">
              Trecho: {formatTimestamp(parseTimestamp(startTime))} — {formatTimestamp(parseTimestamp(endTime))}
            </p>
          )}
        </div>
      )}

      {/* Step 3: Describe */}
      {step >= 3 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-muted'}`}>3</span>
            <h3 className="font-medium text-sm">Descreva a jogada</h3>
          </div>
          <Textarea
            id="description"
            placeholder={`Descreva o que você fez neste lance relacionado a ${dimension.name}...`}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (e.target.value.length >= 10) setStep(Math.max(step, 4))
            }}
            rows={3}
          />
          <p className="text-xs text-muted mt-1">Mínimo 10 caracteres</p>
        </div>
      )}

      {/* Step 4: Self-score */}
      {step >= 4 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-muted'}`}>4</span>
            <h3 className="font-medium text-sm">Autoavaliação (opcional)</h3>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="10"
              value={selfScore || 5}
              onChange={(e) => setSelfScore(e.target.value)}
              className="flex-1"
            />
            <span className="text-lg font-bold w-10 text-center" style={{ color: dimension.color }}>
              {selfScore || '-'}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>1 — Básico</span>
            <span>10 — Excelente</span>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={() => router.back()} className="flex-1">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!selectedVideoId || !startTime || !endTime || description.length < 10}
          className="flex-1"
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}
