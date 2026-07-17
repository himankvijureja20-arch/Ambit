-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  society_id INTEGER NOT NULL,
  admin_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Societies table
CREATE TABLE IF NOT EXISTS societies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  invite_code VARCHAR(50) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint
ALTER TABLE users ADD CONSTRAINT fk_users_society
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE;

-- User interests/tags
CREATE TABLE IF NOT EXISTS interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Circles table
CREATE TABLE IF NOT EXISTS circles (
  id SERIAL PRIMARY KEY,
  society_id INTEGER NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  meeting_schedule VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Circle memberships
CREATE TABLE IF NOT EXISTS circle_members (
  id SERIAL PRIMARY KEY,
  circle_id INTEGER NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(circle_id, user_id)
);

-- Requests table (only exist inside circles)
CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  circle_id INTEGER NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  needed_by TIMESTAMP,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request responses
CREATE TABLE IF NOT EXISTS request_responses (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  responder_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(request_id, responder_id)
);

-- Create indexes for common queries
CREATE INDEX idx_circles_society ON circles(society_id);
CREATE INDEX idx_circles_creator ON circles(creator_id);
CREATE INDEX idx_circle_members_circle ON circle_members(circle_id);
CREATE INDEX idx_circle_members_user ON circle_members(user_id);
CREATE INDEX idx_requests_circle ON requests(circle_id);
CREATE INDEX idx_requests_creator ON requests(creator_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_interests_user ON interests(user_id);
CREATE INDEX idx_users_society ON users(society_id);
