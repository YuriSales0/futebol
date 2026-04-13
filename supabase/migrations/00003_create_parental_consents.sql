-- Parental consent tracking for minors
CREATE TABLE parental_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  guardian_name TEXT NOT NULL,
  guardian_email TEXT NOT NULL,
  guardian_phone TEXT,
  guardian_relationship TEXT NOT NULL,
  status consent_status NOT NULL DEFAULT 'pending',
  consent_token UUID NOT NULL DEFAULT gen_random_uuid(),
  consented_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

CREATE UNIQUE INDEX idx_consents_token ON parental_consents(consent_token);
CREATE INDEX idx_consents_player ON parental_consents(player_id);
