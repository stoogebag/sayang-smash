CREATE TABLE IF NOT EXISTS sayang_smash_entries (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  shareable_link VARCHAR(5),
  exercises JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
