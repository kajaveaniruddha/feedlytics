ALTER TABLE workspaces
    ADD COLUMN IF NOT EXISTS api_key_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS widget_secret_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS widget_allowed_origins TEXT;
