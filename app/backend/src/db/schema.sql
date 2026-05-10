-- pickyeat — Postgres 16 schema
-- Mirrors MenuPick-Architecture-v2.md §4. No extensions required.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── users ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           TEXT UNIQUE,
  name            TEXT,
  age_band        TEXT,
  language        TEXT DEFAULT 'en',
  diet_default    TEXT,
  allergens       TEXT[] DEFAULT '{}',
  spice_default   TEXT,
  health_goal     TEXT,
  premium_until   TIMESTAMPTZ,
  taste_vector    JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  consent_at      TIMESTAMPTZ
);

-- ── restaurants ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id          TEXT UNIQUE,
  name                     TEXT NOT NULL,
  address                  TEXT,
  gps                      POINT,
  google_rating            NUMERIC(2,1),
  google_review_count      INTEGER,
  cuisine_tags             TEXT[] DEFAULT '{}',
  bestsellers              JSONB DEFAULT '{}'::jsonb,
  bestsellers_updated_at   TIMESTAMPTZ,
  claimed_by               UUID REFERENCES users(id),
  created_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS restaurants_google_place_id_idx ON restaurants(google_place_id);

-- ── menus_cache ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menus_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_phash     TEXT,
  restaurant_id   UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  parsed_menu     JSONB NOT NULL,
  scan_count      INTEGER DEFAULT 1,
  first_seen_at   TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at    TIMESTAMPTZ DEFAULT NOW(),
  source          TEXT DEFAULT 'user_scan'
);

CREATE INDEX IF NOT EXISTS menus_cache_phash_idx ON menus_cache(image_phash);
CREATE INDEX IF NOT EXISTS menus_cache_restaurant_idx ON menus_cache(restaurant_id);

-- ── scans ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  restaurant_id   UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  menu_id         UUID REFERENCES menus_cache(id) ON DELETE SET NULL,
  prefs           JSONB NOT NULL DEFAULT '{}'::jsonb,
  picks           JSONB NOT NULL DEFAULT '[]'::jsonb,
  group_id        UUID,
  gps             POINT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scans_user_idx ON scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS scans_restaurant_idx ON scans(restaurant_id);

-- ── feedback ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id         UUID REFERENCES scans(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  dish_name       TEXT,
  action          TEXT CHECK (action IN ('ordered','liked','disliked','skipped')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS feedback_scan_idx ON feedback(scan_id);

-- ── dish_photos ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dish_photos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  dish_name       TEXT,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  s3_key          TEXT NOT NULL,
  approved        BOOLEAN DEFAULT FALSE,
  upvotes         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dish_photos_restaurant_dish_idx ON dish_photos(restaurant_id, dish_name);

-- ── groups ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE,
  host_user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id   UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  menu_id         UUID REFERENCES menus_cache(id) ON DELETE SET NULL,
  members         JSONB DEFAULT '[]'::jsonb,
  combined_picks  JSONB,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS groups_code_idx ON groups(code);
