CREATE TABLE email_verifications (
                                     id BIGSERIAL PRIMARY KEY,
                                     user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                     code VARCHAR(6) NOT NULL,
                                     expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                     is_used BOOLEAN NOT NULL DEFAULT FALSE,
                                     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                                     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_verifications_user_id ON email_verifications(user_id);
