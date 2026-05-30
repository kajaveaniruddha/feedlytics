CREATE TABLE feedback_metadata (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    feedback_id BIGINT NOT NULL REFERENCES feedbacks (id) ON DELETE CASCADE,
    ip_address VARCHAR(255),
    user_agent TEXT,
    location VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_feedback_metadata_feedback_id UNIQUE (feedback_id)
);
