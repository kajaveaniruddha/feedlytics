-- Legacy feedbacks table may predate revamp columns (V10 CREATE was skipped).
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS public_id UUID;
UPDATE feedbacks SET public_id = gen_random_uuid() WHERE public_id IS NULL;

ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS source_type VARCHAR(50);
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
UPDATE feedbacks SET updated_at = COALESCE(updated_at, created_at, NOW()) WHERE updated_at IS NULL;

-- Align with SourceTypeEnum: API_KEY (not API) + WIDGET + CAMPAIGN
UPDATE feedbacks SET source_type = 'API_KEY' WHERE source_type = 'API';
UPDATE feedbacks SET source_type = 'WIDGET' WHERE source_type IS NULL;

ALTER TABLE feedbacks DROP CONSTRAINT IF EXISTS feedbacks_source_type_check;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM feedbacks WHERE source_type IS NULL) THEN
        ALTER TABLE feedbacks ALTER COLUMN source_type SET NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM feedbacks WHERE public_id IS NULL) THEN
        ALTER TABLE feedbacks ALTER COLUMN public_id SET NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM feedbacks WHERE updated_at IS NULL) THEN
        ALTER TABLE feedbacks ALTER COLUMN updated_at SET NOT NULL;
    END IF;
END $$;

ALTER TABLE feedbacks ADD CONSTRAINT feedbacks_source_type_check CHECK (
    source_type IN ('API_KEY', 'WIDGET', 'CAMPAIGN')
);
