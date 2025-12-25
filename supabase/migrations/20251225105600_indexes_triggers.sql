-- ============================================
-- INDEXES (Performance)
-- ============================================

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_leads_eligibility_score ON leads(eligibility_score DESC);

CREATE INDEX idx_grants_is_active ON grants(is_active) WHERE is_active = true;
CREATE INDEX idx_grants_closes_at ON grants(closes_at) WHERE closes_at IS NOT NULL;

CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX idx_tasks_status ON tasks(status) WHERE status IN ('PENDING', 'IN_PROGRESS');
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;

CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- ============================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER grants_updated_at
  BEFORE UPDATE ON grants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
