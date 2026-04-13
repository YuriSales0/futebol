-- Players table (central entity)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  nickname TEXT,
  date_of_birth DATE NOT NULL,
  position player_position NOT NULL,
  secondary_position player_position,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  region brazilian_region NOT NULL,
  height_cm SMALLINT,
  preferred_foot TEXT CHECK (preferred_foot IN ('direito', 'esquerdo', 'ambos')),
  current_club TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_players_region ON players(region);
CREATE INDEX idx_players_state ON players(state);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_dob ON players(date_of_birth);
CREATE INDEX idx_players_auth_user ON players(auth_user_id);
