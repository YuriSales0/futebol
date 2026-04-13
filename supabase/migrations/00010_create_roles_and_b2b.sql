-- User roles system
CREATE TYPE user_role AS ENUM ('player', 'scout', 'admin');

-- Profiles table (extends auth.users with role info)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'player',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_auth ON user_profiles(auth_user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Organizations (clubs, brokers, agencies)
CREATE TYPE org_type AS ENUM ('club', 'broker', 'agency', 'scout_independent');
CREATE TYPE subscription_tier AS ENUM ('entry', 'pro', 'enterprise');

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  org_type org_type NOT NULL,
  country TEXT NOT NULL DEFAULT 'BR',
  city TEXT,
  logo_url TEXT,
  subscription_tier subscription_tier,
  subscription_active BOOLEAN NOT NULL DEFAULT false,
  max_profiles_per_month INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link scouts to organizations
CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_profile_id)
);

-- Shortlists (scouts save players)
CREATE TABLE shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Minha Lista',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shortlist_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortlist_id UUID NOT NULL REFERENCES shortlists(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  notes TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shortlist_id, player_id)
);

-- Player profile views (analytics for admin)
CREATE TABLE profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  viewer_profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profile_views_player ON profile_views(player_id);
CREATE INDEX idx_profile_views_date ON profile_views(viewed_at);
CREATE INDEX idx_shortlist_players_player ON shortlist_players(player_id);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlist_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- User profiles: users can read own, admins can read all
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT
  USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Organizations: members can read their org
CREATE POLICY "Org members can view their org" ON organizations FOR SELECT
  USING (EXISTS (SELECT 1 FROM org_members om JOIN user_profiles up ON up.id = om.user_profile_id WHERE om.org_id = organizations.id AND up.auth_user_id = auth.uid()));

-- Shortlists: owner only
CREATE POLICY "Scouts can manage own shortlists" ON shortlists FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = shortlists.scout_profile_id AND user_profiles.auth_user_id = auth.uid()));
CREATE POLICY "Scouts can manage shortlist players" ON shortlist_players FOR ALL
  USING (EXISTS (SELECT 1 FROM shortlists s JOIN user_profiles up ON up.id = s.scout_profile_id WHERE s.id = shortlist_players.shortlist_id AND up.auth_user_id = auth.uid()));

-- Profile views: insert for authenticated, select for admins/player owner
CREATE POLICY "Authenticated users can log views" ON profile_views FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Players can see own views" ON profile_views FOR SELECT
  USING (EXISTS (SELECT 1 FROM players WHERE players.id = profile_views.player_id AND players.auth_user_id = auth.uid()));
