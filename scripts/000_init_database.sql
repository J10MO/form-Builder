-- -- Create users table
-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   name VARCHAR(255),
--   password_hash VARCHAR(255),
--   is_admin BOOLEAN DEFAULT false,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create forms table
-- CREATE TABLE IF NOT EXISTS forms (
--   id SERIAL PRIMARY KEY,
--   title VARCHAR(255) NOT NULL,
--   description TEXT,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   fields JSONB NOT NULL DEFAULT '[]',
--   share_token VARCHAR(255) UNIQUE NOT NULL,
--   is_active BOOLEAN DEFAULT true,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create responses table
-- CREATE TABLE IF NOT EXISTS responses (
--   id SERIAL PRIMARY KEY,
--   form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
--   data JSONB NOT NULL,
--   submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
-- CREATE INDEX IF NOT EXISTS idx_forms_share_token ON forms(share_token);
-- CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);

-- -- Insert a default admin user (password: admin123)
-- -- Password hash for 'admin123' using a simple hash
-- INSERT INTO users (email, name, password_hash, is_admin) 
-- VALUES ('admin@example.com', 'Admin User', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', true)
-- ON CONFLICT (email) DO NOTHING;



-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  fields JSONB NOT NULL DEFAULT '[]',
  share_token VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_share_token ON forms(share_token);
CREATE INDEX IF NOT EXISTS idx_forms_is_private ON forms(is_private);
CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);

-- Insert a default admin user (password: admin123)
-- Password hash for 'admin123' using a simple hash
INSERT INTO users (email, name, password_hash, is_admin) 
VALUES ('admin@example.com', 'Admin User', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', true)
ON CONFLICT (email) DO NOTHING;
