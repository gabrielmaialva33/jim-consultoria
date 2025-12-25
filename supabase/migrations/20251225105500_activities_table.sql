-- ============================================
-- ACTIVITIES TABLE (Activity Log)
-- ============================================

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',

  created_by UUID REFERENCES auth.users(id)
);
