/*
  # Create users table with authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `userid` (text, unique)
      - `password_hash` (text)
      - `role` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on users table
    - Add policies for:
      - Authenticated users can read all users
      - No direct insert/update/delete allowed (handled by auth functions)
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert some sample data
INSERT INTO users (userid, password_hash, role)
VALUES 
  ('admin123', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpxQQHMQNqHVXm', 'admin'),
  ('user456', '$2a$12$ZHFQgAY/sFJKKVIZHKvMvOzXCn1j.qmY.vKohQQMWrOiVL3lZTrxK', 'user'),
  ('manager789', '$2a$12$9DFQBxEJxQKm/mKJJeQxWOYw5TZIf1M8CkVyRBhE5FtQYpJfJvKXy', 'manager')
ON CONFLICT DO NOTHING;