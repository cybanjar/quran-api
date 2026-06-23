-- add surah_name to last_reads
ALTER TABLE last_reads
  ADD COLUMN IF NOT EXISTS surah_name TEXT;
