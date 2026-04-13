-- Videos uploaded by players
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  duration_seconds INTEGER,
  status video_status NOT NULL DEFAULT 'uploading',
  validation_level validation_level NOT NULL DEFAULT 'self_curated',
  match_date DATE,
  match_description TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_videos_player ON videos(player_id);
CREATE INDEX idx_videos_status ON videos(status);
