-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidence_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE gie_scores ENABLE ROW LEVEL SECURITY;

-- PLAYERS
CREATE POLICY "Active players are viewable by everyone"
  ON players FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert their own profile"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile"
  ON players FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can delete their own profile"
  ON players FOR DELETE
  USING (auth.uid() = auth_user_id);

-- PARENTAL CONSENTS
CREATE POLICY "Players can view their own consent"
  ON parental_consents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = parental_consents.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can create consent request"
  ON parental_consents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = parental_consents.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

-- VIDEOS
CREATE POLICY "Videos viewable if player is active"
  ON videos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = videos.player_id
      AND players.is_active = true
    )
  );

CREATE POLICY "Players can upload own videos"
  ON videos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = videos.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can update own videos"
  ON videos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = videos.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can delete own videos"
  ON videos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = videos.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

-- DIMENSION ENTRIES
CREATE POLICY "Dimension entries viewable if player active"
  ON dimension_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = dimension_entries.player_id
      AND players.is_active = true
    )
  );

CREATE POLICY "Players can manage own dimension entries"
  ON dimension_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = dimension_entries.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can update own dimension entries"
  ON dimension_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = dimension_entries.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can delete own dimension entries"
  ON dimension_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = dimension_entries.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

-- CONFIDENCE SCORES (public read, system write)
CREATE POLICY "Confidence scores are publicly readable"
  ON confidence_scores FOR SELECT
  USING (true);

CREATE POLICY "Players can manage own confidence scores"
  ON confidence_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = confidence_scores.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can update own confidence scores"
  ON confidence_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = confidence_scores.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

-- GIE SCORES (public read, system write)
CREATE POLICY "GIE scores are publicly readable"
  ON gie_scores FOR SELECT
  USING (true);

CREATE POLICY "Players can manage own GIE scores"
  ON gie_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = gie_scores.player_id
      AND players.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can update own GIE scores"
  ON gie_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = gie_scores.player_id
      AND players.auth_user_id = auth.uid()
    )
  );
