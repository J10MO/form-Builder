-- Add is_private column to forms table for privacy feature
-- This allows users to mark forms as private (only owner can access) or public (shareable)

ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_forms_is_private ON forms(is_private);

-- Update existing forms to be public by default (backward compatibility)
UPDATE forms 
SET is_private = false 
WHERE is_private IS NULL;
