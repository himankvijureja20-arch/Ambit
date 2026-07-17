-- Circles: admin approval workflow
ALTER TABLE circles ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending';
ALTER TABLE circles ADD CONSTRAINT chk_circles_status CHECK (status IN ('pending', 'approved', 'rejected'));

-- Grandfather in circles that already existed before this workflow existed
UPDATE circles SET status = 'approved' WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_circles_status ON circles(status);
