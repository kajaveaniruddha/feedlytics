-- Legacy feedbacks used SERIAL (integer) IDs; JPA entities expect BIGINT.
DO $$
DECLARE
    r RECORD;
    id_type TEXT;
BEGIN
    SELECT data_type
    INTO id_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'feedbacks'
      AND column_name = 'id';

    IF id_type IS NULL OR id_type = 'bigint' THEN
        RETURN;
    END IF;

    FOR r IN (
        SELECT c.conname AS constraint_name, cl.relname AS table_name
        FROM pg_constraint c
        JOIN pg_class cl ON cl.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = cl.relnamespace
        WHERE c.confrelid = 'feedbacks'::regclass
          AND c.contype = 'f'
          AND n.nspname = 'public'
    ) LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', r.table_name, r.constraint_name);
    END LOOP;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'feedbacks'
          AND column_name = 'workspace_id' AND data_type = 'integer'
    ) THEN
        ALTER TABLE feedbacks ALTER COLUMN workspace_id TYPE BIGINT;
    END IF;

    ALTER TABLE feedbacks ALTER COLUMN id TYPE BIGINT;

    PERFORM setval(
        pg_get_serial_sequence('feedbacks', 'id'),
        GREATEST(COALESCE((SELECT MAX(id) FROM feedbacks), 1), 1)
    );
END $$;

ALTER SEQUENCE IF EXISTS feedbacks_id_seq AS BIGINT;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'feedback_metadata'
          AND column_name = 'feedback_id' AND data_type = 'integer'
    ) THEN
        ALTER TABLE feedback_metadata ALTER COLUMN feedback_id TYPE BIGINT;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'feedback_ai_analysis'
          AND column_name = 'feedback_id' AND data_type = 'integer'
    ) THEN
        ALTER TABLE feedback_ai_analysis ALTER COLUMN feedback_id TYPE BIGINT;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'feedback_category_assignments'
          AND column_name = 'feedback_id' AND data_type = 'integer'
    ) THEN
        ALTER TABLE feedback_category_assignments ALTER COLUMN feedback_id TYPE BIGINT;
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.feedback_metadata') IS NOT NULL THEN
        ALTER TABLE feedback_metadata DROP CONSTRAINT IF EXISTS feedback_metadata_feedback_id_fkey;
        ALTER TABLE feedback_metadata
            ADD CONSTRAINT feedback_metadata_feedback_id_fkey
            FOREIGN KEY (feedback_id) REFERENCES feedbacks (id) ON DELETE CASCADE;
    END IF;

    IF to_regclass('public.feedback_ai_analysis') IS NOT NULL THEN
        ALTER TABLE feedback_ai_analysis DROP CONSTRAINT IF EXISTS feedback_ai_analysis_feedback_id_fkey;
        ALTER TABLE feedback_ai_analysis
            ADD CONSTRAINT feedback_ai_analysis_feedback_id_fkey
            FOREIGN KEY (feedback_id) REFERENCES feedbacks (id) ON DELETE CASCADE;
    END IF;

    IF to_regclass('public.feedback_category_assignments') IS NOT NULL THEN
        ALTER TABLE feedback_category_assignments
            DROP CONSTRAINT IF EXISTS feedback_category_assignments_feedback_id_fkey;
        ALTER TABLE feedback_category_assignments
            ADD CONSTRAINT feedback_category_assignments_feedback_id_fkey
            FOREIGN KEY (feedback_id) REFERENCES feedbacks (id) ON DELETE CASCADE;
    END IF;
END $$;
