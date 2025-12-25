-- ============================================
-- GRANTS EXTERNAL INTEGRATION
-- Add fields to support external data sources
-- ============================================

-- Add source tracking fields
ALTER TABLE grants
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS program TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS raw_data JSONB DEFAULT '{}';

-- Create unique index for external_id + source combination
CREATE UNIQUE INDEX IF NOT EXISTS grants_external_source_idx
  ON grants (external_id, source)
  WHERE external_id IS NOT NULL AND source IS NOT NULL;

-- Create index for source filtering
CREATE INDEX IF NOT EXISTS grants_source_idx ON grants (source);

-- Create index for program filtering
CREATE INDEX IF NOT EXISTS grants_program_idx ON grants (program);

-- Add comment for documentation
COMMENT ON COLUMN grants.external_id IS 'External ID from the source system (e.g., FomentoCultSP notice ID)';
COMMENT ON COLUMN grants.source IS 'Data source identifier (e.g., fomentocultsp, cultura_sp)';
COMMENT ON COLUMN grants.source_url IS 'Direct URL to the grant page on source website';
COMMENT ON COLUMN grants.program IS 'Program name (e.g., ProAC ICMS, ProAC Editais, PNAB)';
COMMENT ON COLUMN grants.year IS 'Year of the grant/notice';
COMMENT ON COLUMN grants.categories IS 'Cultural categories from the source system';
COMMENT ON COLUMN grants.synced_at IS 'Last synchronization timestamp';
COMMENT ON COLUMN grants.raw_data IS 'Original raw data from the source API/scrape';
