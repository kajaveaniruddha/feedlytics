ALTER TABLE feedbacks
    ADD COLUMN submitter_name VARCHAR(200),
    ADD COLUMN submitter_email VARCHAR(320);

ALTER TABLE feedback_metadata
    ADD COLUMN referrer VARCHAR(2048),
    ADD COLUMN accept_language VARCHAR(500);
