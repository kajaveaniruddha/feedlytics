ALTER TABLE feedbacks
    ADD COLUMN IF NOT EXISTS submitter_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS submitter_email VARCHAR(320);

ALTER TABLE feedback_metadata
    ADD COLUMN IF NOT EXISTS referrer VARCHAR(2048),
    ADD COLUMN IF NOT EXISTS accept_language VARCHAR(500);
