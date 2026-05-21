-- Migration to add monitoring and invalidation columns to the audits table
ALTER TABLE audits ADD COLUMN IF NOT EXISTS invalidated BOOLEAN DEFAULT FALSE;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS invalidated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS report_url TEXT;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS share_token TEXT;
