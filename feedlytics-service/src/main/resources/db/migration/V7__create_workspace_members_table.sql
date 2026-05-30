CREATE TABLE workspace_members (
                                   id BIGSERIAL PRIMARY KEY,
                                   workspace_id BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
                                   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                   role VARCHAR(50) NOT NULL,
                                   status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
                                   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                   UNIQUE (workspace_id, user_id)
);
