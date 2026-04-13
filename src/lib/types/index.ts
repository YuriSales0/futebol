import type { DimensionCode } from '@/lib/constants/dimensions'
import type { BrazilianRegion } from '@/lib/constants/regions'
import type { PlayerPosition } from '@/lib/constants/positions'

export type { DimensionCode, BrazilianRegion, PlayerPosition }

export type VideoStatus = 'uploading' | 'processing' | 'ready' | 'failed'
export type ValidationLevel = 'self_curated' | 'full_match' | 'externally_validated'
export type ConsentStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type PreferredFoot = 'direito' | 'esquerdo' | 'ambos'

export interface Player {
  id: string
  auth_user_id: string
  full_name: string
  nickname: string | null
  date_of_birth: string
  position: PlayerPosition
  secondary_position: PlayerPosition | null
  city: string
  state: string
  region: BrazilianRegion
  height_cm: number | null
  preferred_foot: PreferredFoot | null
  current_club: string | null
  bio: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ParentalConsent {
  id: string
  player_id: string
  guardian_name: string
  guardian_email: string
  guardian_phone: string | null
  guardian_relationship: string
  status: ConsentStatus
  consent_token: string
  consented_at: string | null
  ip_address: string | null
  created_at: string
  expires_at: string
}

export interface Video {
  id: string
  player_id: string
  storage_path: string
  original_filename: string
  file_size_bytes: number
  duration_seconds: number | null
  status: VideoStatus
  validation_level: ValidationLevel
  match_date: string | null
  match_description: string | null
  uploaded_at: string
  processed_at: string | null
}

export interface DimensionEntry {
  id: string
  player_id: string
  dimension: DimensionCode
  video_id: string
  start_time_seconds: number
  end_time_seconds: number
  description: string
  self_score: number | null
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface ConfidenceScore {
  id: string
  player_id: string
  video_source_score: number
  validation_score: number
  recency_score: number
  sample_size_score: number
  consistency_score: number
  total_score: number
  calculated_at: string
}

export interface GIEScore {
  id: string
  player_id: string
  d1_scanning: number
  d2_decision: number
  d3_off_ball: number
  d4_orientation: number
  d5_anticipation: number
  d6_resilience: number
  d7_communication: number
  total_gie: number
  calculated_at: string
}

export interface RankedPlayer {
  player_id: string
  full_name: string
  nickname: string | null
  date_of_birth: string
  position: PlayerPosition
  city: string
  state: string
  region: BrazilianRegion
  avatar_url: string | null
  total_gie: number | null
  confidence: number | null
  region_rank: number
  region_percentile: number
}
