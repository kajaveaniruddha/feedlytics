CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255),
                       name VARCHAR(255) NOT NULL,
                       avatar_url VARCHAR(500),
                       is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       auth_provider VARCHAR(50) NOT NULL DEFAULT 'EMAIL',
                       oauth_id VARCHAR(255),
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
