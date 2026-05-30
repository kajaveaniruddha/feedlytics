CREATE TABLE widgets (
    id BIGSERIAL PRIMARY KEY,
    workspace_id BIGINT NOT NULL UNIQUE REFERENCES workspaces (id) ON DELETE CASCADE,
    collect_name BOOLEAN NOT NULL DEFAULT FALSE,
    collect_email BOOLEAN NOT NULL DEFAULT TRUE,
    theme JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO widgets (workspace_id, collect_name, collect_email, theme, is_active)
SELECT w.id,
       FALSE,
       TRUE,
       '{"formBgColor":"#FFFFFF","formTextColor":"#1A1A1A","accentColor":"#6366F1","inputBgColor":"#F9FAFB","inputBorderColor":"#E5E7EB","inputTextColor":"#111827","secondaryTextColor":"#6B7280","fontFamily":"Inter","borderRadius":12,"shadow":"subtle","cardMaxWidth":432,"cardPadding":"default","successMessage":"Thank you for your feedback!","showConfetti":true,"successRedirectUrl":null,"successCtaText":null,"successCtaUrl":null,"buttonText":"Send Feedback"}'::jsonb,
       TRUE
FROM workspaces w
WHERE NOT EXISTS (SELECT 1 FROM widgets x WHERE x.workspace_id = w.id);
