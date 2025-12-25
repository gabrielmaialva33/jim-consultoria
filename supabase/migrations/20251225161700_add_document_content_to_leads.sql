-- ============================================
-- ADD DOCUMENT CONTENT FIELD TO LEADS
-- ============================================

-- Add document_content column to store parsed document text
ALTER TABLE leads ADD COLUMN IF NOT EXISTS document_content TEXT;

-- Add document_metadata column to store file info (JSON)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS document_metadata JSONB DEFAULT NULL;

-- Add document_analysis column to store AI analysis (JSON)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS document_analysis JSONB DEFAULT NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN leads.document_content IS 'Parsed text content from uploaded project document (PDF/DOCX)';
COMMENT ON COLUMN leads.document_metadata IS 'Metadata about the uploaded document: fileName, fileType, fileSize, parsedAt';
COMMENT ON COLUMN leads.document_analysis IS 'AI analysis of the document: title, summary, objectives, culturalAreas, etc.';
