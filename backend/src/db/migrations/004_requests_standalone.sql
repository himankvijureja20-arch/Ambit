-- Requests: decouple from Circles (society-wide requests now supported)
ALTER TABLE requests ADD COLUMN IF NOT EXISTS society_id INTEGER REFERENCES societies(id) ON DELETE CASCADE;

UPDATE requests r SET society_id = c.society_id
FROM circles c
WHERE r.circle_id = c.id AND r.society_id IS NULL;

ALTER TABLE requests ALTER COLUMN circle_id DROP NOT NULL;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE requests ADD COLUMN IF NOT EXISTS duration VARCHAR(100);

ALTER TABLE request_responses ADD COLUMN IF NOT EXISTS confirmed BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_requests_society_id ON requests(society_id);
