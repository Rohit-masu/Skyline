-- Run once against the Neon database: npm run db:setup (reads DATABASE_URL from .env.local).
-- Safe to run again: every statement is IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS enquiries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_slug text        NOT NULL,
  name          text        NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  phone         text        NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
  email         text,
  message       text        NOT NULL CHECK (char_length(message) BETWEEN 10 AND 1000),
  visit_date    date        NOT NULL,
  ip_hash       text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- The rate limit query filters on ip_hash and a created_at window.
CREATE INDEX IF NOT EXISTS enquiries_ip_hash_created_at_idx ON enquiries (ip_hash, created_at DESC);

-- The admin page lists the newest first.
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
