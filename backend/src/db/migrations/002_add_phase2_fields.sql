-- Users: role, trust score, contact/identity fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'resident';
ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_score INTEGER NOT NULL DEFAULT 70;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS flat_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('resident', 'admin'));
ALTER TABLE users ADD CONSTRAINT chk_users_trust_score CHECK (trust_score >= 0 AND trust_score <= 100);

-- Requests: category, urgency, photo
ALTER TABLE requests ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE requests ADD COLUMN IF NOT EXISTS urgency VARCHAR(20) NOT NULL DEFAULT 'normal';
ALTER TABLE requests ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE requests ADD CONSTRAINT chk_requests_urgency CHECK (urgency IN ('normal', 'high', 'urgent'));

-- Circles: image
ALTER TABLE circles ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON requests(urgency);
