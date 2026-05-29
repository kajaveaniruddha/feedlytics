CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    workspace_id BIGINT NOT NULL REFERENCES workspaces (id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT feedbacks_source_type_check CHECK (
        source_type IN ('API', 'WIDGET', 'CAMPAIGN')
    )
);
