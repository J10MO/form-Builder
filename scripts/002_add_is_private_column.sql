-- Add is_private column to forms table for privacy control
ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Add index for better query performance when filtering by privacy
CREATE INDEX IF NOT EXISTS idx_forms_is_private ON forms(is_private);

-- Update any existing forms to be public by default
UPDATE forms 
SET is_private = false 
WHERE is_private IS NULL;
