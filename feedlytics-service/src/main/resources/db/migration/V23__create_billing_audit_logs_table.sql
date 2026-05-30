CREATE TABLE billing_audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    workspace_id    BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    actor_type      VARCHAR(20)  NOT NULL,
    actor_id        VARCHAR(255),
    action          VARCHAR(50)  NOT NULL,
    previous_plan   VARCHAR(50),
    new_plan        VARCHAR(50),
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_workspace ON billing_audit_logs(workspace_id);
CREATE INDEX idx_audit_action    ON billing_audit_logs(action);
