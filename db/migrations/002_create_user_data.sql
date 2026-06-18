-- per-user last read and saved ayat
CREATE TABLE IF NOT EXISTS last_reads (
  user_id VARCHAR(64) PRIMARY KEY,
  surah_id INTEGER NOT NULL,
  ayat INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_ayats (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  surah_id INTEGER NOT NULL,
  ayat INTEGER NOT NULL,
  surah_name TEXT,
  arab TEXT,
  translation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, surah_id, ayat)
);
