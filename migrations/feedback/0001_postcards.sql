CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('love', 'idea', 'issue')),
  message TEXT NOT NULL CHECK (length(message) BETWEEN 3 AND 2000),
  name TEXT NOT NULL DEFAULT '' CHECK (length(name) <= 80),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
