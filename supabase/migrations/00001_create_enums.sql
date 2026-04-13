-- GIE Platform Enums

CREATE TYPE player_position AS ENUM (
  'goleiro',
  'zagueiro',
  'lateral_direito',
  'lateral_esquerdo',
  'volante',
  'meia',
  'ponta_direita',
  'ponta_esquerda',
  'centroavante'
);

CREATE TYPE brazilian_region AS ENUM (
  'norte',
  'nordeste',
  'centro_oeste',
  'sudeste',
  'sul'
);

CREATE TYPE video_status AS ENUM (
  'uploading',
  'processing',
  'ready',
  'failed'
);

CREATE TYPE validation_level AS ENUM (
  'self_curated',
  'full_match',
  'externally_validated'
);

CREATE TYPE consent_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'expired'
);

CREATE TYPE dimension_code AS ENUM (
  'd1_scanning',
  'd2_decision',
  'd3_off_ball',
  'd4_orientation',
  'd5_anticipation',
  'd6_resilience',
  'd7_communication'
);
