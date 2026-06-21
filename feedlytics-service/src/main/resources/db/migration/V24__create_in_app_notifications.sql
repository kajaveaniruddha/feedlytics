CREATE TYPE notification_delivery_status AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TYPE notification_type AS ENUM (
    'WORKSPACE_INVITE_PENDING'
);

CREATE TABLE in_app_notifications (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    recipient_user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    workspace_id BIGINT REFERENCES workspaces (id) ON DELETE SET NULL,
    type notification_type NOT NULL,
    dedupe_key VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    read_at TIMESTAMPTZ NULL,
    delivery_status notification_delivery_status NOT NULL DEFAULT 'PENDING',
    delivery_error TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT in_app_notifications_recipient_dedupe UNIQUE (recipient_user_id, dedupe_key)
);

CREATE INDEX idx_in_app_notifications_recipient_id_desc
    ON in_app_notifications (recipient_user_id, id DESC);

CREATE INDEX idx_in_app_notifications_recipient_unread
    ON in_app_notifications (recipient_user_id)
    WHERE read_at IS NULL;

CREATE INDEX idx_in_app_notifications_recipient_type
    ON in_app_notifications (recipient_user_id, type);

CREATE INDEX idx_in_app_notifications_workspace
    ON in_app_notifications (workspace_id);
