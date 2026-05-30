CREATE TABLE feedback_ai_analysis (
    id BIGSERIAL PRIMARY KEY,
    feedback_id BIGINT NOT NULL REFERENCES feedbacks (id) ON DELETE CASCADE,
    sentiment VARCHAR(50) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT feedback_ai_analysis_sentiment_check CHECK (
        sentiment IN ('POSITIVE', 'NEGATIVE', 'NEUTRAL')
    ),
    CONSTRAINT uq_feedback_ai_analysis_feedback_id UNIQUE (feedback_id)
);
