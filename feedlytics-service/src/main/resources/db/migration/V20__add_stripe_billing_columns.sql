ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS stripe_customer_id     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_price_id        VARCHAR(255),
  ADD COLUMN IF NOT EXISTS billing_interval       VARCHAR(10);
