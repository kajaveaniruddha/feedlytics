ALTER TABLE workspaces
  ADD COLUMN stripe_customer_id     VARCHAR(255),
  ADD COLUMN stripe_subscription_id VARCHAR(255),
  ADD COLUMN stripe_price_id        VARCHAR(255),
  ADD COLUMN billing_interval       VARCHAR(10);
