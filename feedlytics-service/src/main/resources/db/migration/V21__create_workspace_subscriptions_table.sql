CREATE TABLE IF NOT EXISTS workspace_subscriptions (
    id                      BIGSERIAL PRIMARY KEY,
    workspace_id            BIGINT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    stripe_customer_id      VARCHAR(255) NOT NULL,
    stripe_subscription_id  VARCHAR(255) NOT NULL UNIQUE,
    stripe_price_id         VARCHAR(255) NOT NULL,
    plan                    VARCHAR(50)  NOT NULL,
    billing_interval        VARCHAR(10)  NOT NULL,
    status                  VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    cancelled_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_sub_workspace ON workspace_subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ws_sub_customer  ON workspace_subscriptions(stripe_customer_id);
