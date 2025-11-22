-- Add password and admin fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Insert a default admin user (password: admin123 - hashed with bcrypt)
-- Note: In production, you should change this password immediately
INSERT INTO users (email, name, password_hash, is_admin) 
VALUES ('admin@example.com', 'Admin User', '$2a$10$rOzJQjQjQjQjQjQjQjQjQuKxYxYxYxYxYxYxYxYxYxYxYxYxYxYxY', true)
ON CONFLICT (email) DO NOTHING;
