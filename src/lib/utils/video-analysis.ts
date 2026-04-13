/**
 * Extract video metadata and thumbnail using browser APIs.
 * No server-side processing needed — runs 100% in the browser.
 */

export interface VideoMetadata {
  durationSeconds: number
  width: number
  height: number
  thumbnailBlob: Blob | null
}

/**
 * Load a video file and extract duration, resolution, and a thumbnail frame.
 * Captures a frame at 10% of the video duration (avoids black intro frames).
 */
export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      const duration = Math.round(video.duration)
      const width = video.videoWidth
      const height = video.videoHeight

      // Seek to 10% of the video to get a representative frame
      const seekTime = Math.min(video.duration * 0.1, 5)
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      // Capture frame as thumbnail
      const canvas = document.createElement('canvas')
      const targetWidth = 320
      const scale = targetWidth / video.videoWidth
      canvas.width = targetWidth
      canvas.height = Math.round(video.videoHeight * scale)

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(objectUrl)
        resolve({
          durationSeconds: Math.round(video.duration),
          width: video.videoWidth,
          height: video.videoHeight,
          thumbnailBlob: null,
        })
        return
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl)
          resolve({
            durationSeconds: Math.round(video.duration),
            width: video.videoWidth,
            height: video.videoHeight,
            thumbnailBlob: blob,
          })
        },
        'image/jpeg',
        0.7
      )
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Não foi possível ler o vídeo.'))
    }
  })
}

/**
 * Convert a Blob to base64 data URL for sending to server actions.
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
