CREATE TABLE usage_limits (
    id BIGSERIAL PRIMARY KEY,
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    feedback_count INT NOT NULL DEFAULT 0,
    api_calls INT NOT NULL DEFAULT 0,
    campaign_count INT NOT NULL DEFAULT 0,
    period_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, period_start)
);
