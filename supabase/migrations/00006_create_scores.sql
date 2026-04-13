-- Confidence scores (Confidence Layer)
CREATE TABLE confidence_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL UNIQUE REFERENCES players(id) ON DELETE CASCADE,
  video_source_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  validation_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  recency_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  sample_size_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  consistency_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_score NUMERIC(3,2) GENERATED ALWAYS AS (
    (video_source_score * 0.25) +
    (validation_score * 0.25) +
    (recency_score * 0.20) +
    (sample_size_score * 0.20) +
    (consistency_score * 0.10)
  ) STORED,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GIE Scores (composite intelligence score)
CREATE TABLE gie_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL UNIQUE REFERENCES players(id) ON DELETE CASCADE,
  d1_scanning NUMERIC(4,2) NOT NULL DEFAULT 0,
  d2_decision NUMERIC(4,2) NOT NULL DEFAULT 0,
  d3_off_ball NUMERIC(4,2) NOT NULL DEFAULT 0,
  d4_orientation NUMERIC(4,2) NOT NULL DEFAULT 0,
  d5_anticipation NUMERIC(4,2) NOT NULL DEFAULT 0,
  d6_resilience NUMERIC(4,2) NOT NULL DEFAULT 0,
  d7_communication NUMERIC(4,2) NOT NULL DEFAULT 0,
  total_gie NUMERIC(5,2) GENERATED ALWAYS AS (
    (d1_scanning * 0.20) +
    (d2_decision * 0.25) +
    (d3_off_ball * 0.15) +
    (d4_orientation * 0.10) +
    (d5_anticipation * 0.10) +
    (d6_resilience * 0.10) +
    (d7_communication * 0.10)
  ) STORED,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gie_scores_total ON gie_scores(total_gie DESC);
CREATE INDEX idx_confidence_scores_total ON confidence_scores(total_score DESC);
