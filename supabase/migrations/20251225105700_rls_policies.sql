-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access on leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on grants"
  ON grants FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on tasks"
  ON tasks FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on activities"
  ON activities FOR ALL
  USING (auth.role() = 'authenticated');

-- Public can insert leads (capture form)
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Public can read grants (display on landing)
CREATE POLICY "Public can read active grants"
  ON grants FOR SELECT
  USING (is_active = true);
