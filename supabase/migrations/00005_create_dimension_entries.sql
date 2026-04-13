-- Dimension entries (the "sticker" slots in the album)
CREATE TABLE dimension_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  dimension dimension_code NOT NULL,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  start_time_seconds INTEGER NOT NULL,
  end_time_seconds INTEGER NOT NULL,
  description TEXT NOT NULL,
  self_score SMALLINT CHECK (self_score BETWEEN 1 AND 10),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(player_id, dimension, video_id)
);

CREATE INDEX idx_dimension_entries_player ON dimension_entries(player_id);
CREATE INDEX idx_dimension_entries_dimension ON dimension_entries(dimension);
