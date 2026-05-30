-- Align with SourceTypeEnum: API_KEY (not API) + WIDGET + CAMPAIGN
ALTER TABLE feedbacks DROP CONSTRAINT IF EXISTS feedbacks_source_type_check;

UPDATE feedbacks SET source_type = 'API_KEY' WHERE source_type = 'API';

ALTER TABLE feedbacks ADD CONSTRAINT feedbacks_source_type_check CHECK (
    source_type IN ('API_KEY', 'WIDGET', 'CAMPAIGN')
);
