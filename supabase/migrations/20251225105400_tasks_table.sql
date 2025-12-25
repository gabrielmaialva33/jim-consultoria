-- ============================================
-- TASKS TABLE
-- ============================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  grant_id UUID REFERENCES grants(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status task_status NOT NULL DEFAULT 'PENDING',
  priority task_priority NOT NULL DEFAULT 'MEDIUM',

  assigned_to UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,

  CONSTRAINT tasks_completed_at_valid CHECK (
    (status != 'COMPLETED' AND completed_at IS NULL) OR
    (status = 'COMPLETED' AND completed_at IS NOT NULL)
  )
);
