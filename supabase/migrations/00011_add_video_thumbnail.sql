-- Add thumbnail_url column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add analysis_result column to store AI classification
ALTER TABLE videos ADD COLUMN IF NOT EXISTS analysis_result JSONB;
