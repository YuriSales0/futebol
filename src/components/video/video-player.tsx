'use client'

import { useRef, useEffect } from 'react'

interface VideoPlayerProps {
  src: string
  startTime?: number
  endTime?: number
  className?: string
}

export function VideoPlayer({ src, startTime, endTime, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !startTime) return

    video.currentTime = startTime

    if (endTime) {
      const handleTimeUpdate = () => {
        if (video.currentTime >= endTime) {
          video.pause()
          video.currentTime = startTime
        }
      }
      video.addEventListener('timeupdate', handleTimeUpdate)
      return () => video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [startTime, endTime])

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      playsInline
      className={`w-full rounded-lg bg-black ${className}`}
    >
      Seu navegador não suporta vídeo.
    </video>
  )
}
