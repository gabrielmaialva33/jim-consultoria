-- ============================================
-- GRANTS TABLE (Editais)
-- ============================================

CREATE TABLE grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  name TEXT NOT NULL,
  agency TEXT NOT NULL,
  grant_type grant_type NOT NULL,

  opens_at DATE,
  closes_at DATE,

  total_budget NUMERIC(14,2),
  max_per_project NUMERIC(12,2),

  requirements JSONB DEFAULT '{}',
  required_documents TEXT[] DEFAULT '{}',
  official_url TEXT,

  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Constraints
  CONSTRAINT grants_dates_valid CHECK (opens_at IS NULL OR closes_at IS NULL OR opens_at <= closes_at)
);
