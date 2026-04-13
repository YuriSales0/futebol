'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface AnalysisResult {
  isFootballMatch: boolean
  confidence: number // 0-1
  scene: string // 'football_match' | 'training' | 'highlights' | 'other'
  description: string
  warnings: string[]
}

/**
 * Analyze a video thumbnail using Claude Vision API to determine
 * if the video is from a real football match.
 *
 * Level 1: Metadata (duration, resolution) — done client-side
 * Level 2: Thumbnail generation — done client-side
 * Level 3: Scene classification — this function (Claude Vision)
 */
export async function analyzeVideoThumbnail(
  videoId: string,
  thumbnailBase64: string
): Promise<{ data?: AnalysisResult; error?: string }> {
  // Validate input
  if (!thumbnailBase64.startsWith('data:image/')) {
    return { error: 'Thumbnail inválido.' }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // If no API key configured, skip analysis and return neutral result
    return {
      data: {
        isFootballMatch: true,
        confidence: 0,
        scene: 'other',
        description: 'Análise de IA não configurada. Vídeo aceito sem validação.',
        warnings: ['ANTHROPIC_API_KEY não configurada — análise pulada'],
      },
    }
  }

  try {
    // Extract base64 data and media type
    const match = thumbnailBase64.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!match) {
      return { error: 'Formato de thumbnail inválido.' }
    }

    const [, mediaType, base64Data] = match

    // Call Claude Vision API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: 'text',
                text: `Analyze this video frame. Classify the scene as one of:
- "football_match": a real football/soccer match or competitive game being played on a field
- "training": football training or practice session
- "highlights": edited highlights compilation
- "other": not football related (selfie, random video, etc.)

Respond in JSON only:
{"scene": "...", "confidence": 0.0-1.0, "description": "brief description in Portuguese", "warnings": ["any concerns"]}`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error('Claude API error:', response.status)
      // Don't block upload on API errors — accept the video
      return {
        data: {
          isFootballMatch: true,
          confidence: 0,
          scene: 'other',
          description: 'Não foi possível analisar o vídeo automaticamente.',
          warnings: ['Erro na API de análise — vídeo aceito sem validação'],
        },
      }
    }

    const result = await response.json()
    const text = result.content?.[0]?.text || '{}'

    // Parse the JSON response
    let analysis: { scene: string; confidence: number; description: string; warnings: string[] }
    try {
      // Extract JSON from response (may have markdown wrapping)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      analysis = JSON.parse(jsonMatch?.[0] || '{}')
    } catch {
      analysis = { scene: 'other', confidence: 0, description: 'Resposta inválida da IA.', warnings: [] }
    }

    const isFootball = analysis.scene === 'football_match' || analysis.scene === 'training'

    // Update video record with analysis
    const supabase = await createClient()
    await supabase
      .from('videos')
      .update({
        status: isFootball ? 'ready' : 'ready', // Still accept, but flag
        processed_at: new Date().toISOString(),
      })
      .eq('id', videoId)

    revalidatePath('/videos')

    return {
      data: {
        isFootballMatch: isFootball,
        confidence: analysis.confidence || 0,
        scene: analysis.scene || 'other',
        description: analysis.description || '',
        warnings: analysis.warnings || [],
      },
    }
  } catch (err) {
    console.error('Video analysis error:', err)
    return {
      data: {
        isFootballMatch: true,
        confidence: 0,
        scene: 'other',
        description: 'Erro na análise. Vídeo aceito.',
        warnings: ['Erro interno — vídeo aceito sem validação'],
      },
    }
  }
}

/**
 * Save thumbnail to Supabase Storage and update video record.
 */
export async function saveThumbnail(
  videoId: string,
  playerId: string,
  thumbnailBase64: string
): Promise<{ error?: string }> {
  const supabase = await createClient()

  // Convert base64 to buffer
  const match = thumbnailBase64.match(/^data:image\/\w+;base64,(.+)$/)
  if (!match) return { error: 'Thumbnail inválido.' }

  const buffer = Buffer.from(match[1], 'base64')
  const path = `${playerId}/thumbnails/${videoId}.jpg`

  // Upload thumbnail
  const { error: uploadError } = await supabase.storage
    .from('videos')
    .upload(path, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (uploadError) {
    console.error('Thumbnail upload error:', uploadError)
    return { error: 'Erro ao salvar thumbnail.' }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(path)

  // Update video record — store thumbnail path (not full URL, since bucket is private)
  await supabase
    .from('videos')
    .update({ thumbnail_url: path })
    .eq('id', videoId)

  return {}
}

/**
 * Update video metadata (duration, resolution) after client-side extraction.
 */
export async function updateVideoMetadata(
  videoId: string,
  metadata: {
    durationSeconds: number
    width?: number
    height?: number
  }
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('videos')
    .update({
      duration_seconds: metadata.durationSeconds,
      processed_at: new Date().toISOString(),
    })
    .eq('id', videoId)

  if (error) return { error: 'Erro ao atualizar metadados.' }
  revalidatePath('/videos')
  return {}
}
