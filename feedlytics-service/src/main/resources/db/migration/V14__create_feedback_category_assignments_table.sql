CREATE TABLE feedback_category_assignments (
    id BIGSERIAL PRIMARY KEY,
    feedback_id BIGINT NOT NULL REFERENCES feedbacks (id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES feedbacks_categories (id) ON DELETE CASCADE,
    feedback_ai_analysis_id BIGINT REFERENCES feedback_ai_analysis (id) ON DELETE SET NULL,
    confidence DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_feedback_category_assignments_feedback_category UNIQUE (feedback_id, category_id)
);

CREATE INDEX idx_feedback_category_assignments_feedback_id ON feedback_category_assignments (feedback_id);
CREATE INDEX idx_feedback_category_assignments_category_id ON feedback_category_assignments (category_id);
CREATE INDEX idx_feedback_category_assignments_analysis_id ON feedback_category_assignments (feedback_ai_analysis_id);
