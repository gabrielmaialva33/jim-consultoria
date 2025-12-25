-- ============================================
-- LEADS TABLE (Prospects)
-- ============================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Basic info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Qualification
  organization_type organization_type NOT NULL,
  company_age company_age,
  tax_id TEXT,
  state_code CHAR(2) DEFAULT 'SP',
  city TEXT,

  -- Cultural profile
  cultural_areas cultural_area[] DEFAULT '{}',
  project_description TEXT,
  estimated_budget NUMERIC(12,2),

  -- Pipeline
  status lead_status NOT NULL DEFAULT 'NEW',
  interested_grants TEXT[] DEFAULT '{}',
  eligible_grants TEXT[] DEFAULT '{}',
  eligibility_score SMALLINT DEFAULT 0,

  -- Tracking
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  source TEXT,

  -- Constraints
  CONSTRAINT leads_email_unique UNIQUE (email),
  CONSTRAINT leads_eligibility_score_range CHECK (eligibility_score >= 0 AND eligibility_score <= 100)
);
