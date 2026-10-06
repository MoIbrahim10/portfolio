ALTER TABLE feedback
ADD COLUMN visibility TEXT NOT NULL DEFAULT 'private'
CHECK (visibility IN ('private', 'public'));

CREATE INDEX feedback_public_created_at_id
ON feedback (created_at DESC, id DESC)
WHERE visibility = 'public';
