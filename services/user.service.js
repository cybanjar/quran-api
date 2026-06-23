const pool = require('../config/db');

const setLastRead = async (userId, { surahId, ayat, surahName }) => {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO last_reads(user_id, surah_id, ayat, surah_name, updated_at)
       VALUES($1,$2,$3,$4,now())
       ON CONFLICT (user_id) DO UPDATE SET surah_id = EXCLUDED.surah_id, ayat = EXCLUDED.ayat, surah_name = EXCLUDED.surah_name, updated_at = now()`,
      [userId, surahId, ayat, surahName]
    );
    return { userId, surahId, ayat, surahName };
  } finally {
    client.release();
  }
};

const getLastRead = async (userId) => {
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT surah_id, ayat, surah_name FROM last_reads WHERE user_id = $1', [userId]);
    return r.rowCount ? { surahId: r.rows[0].surah_id, ayat: r.rows[0].ayat, surahName: r.rows[0].surah_name } : null;
  } finally {
    client.release();
  }
};

const saveAyat = async (userId, { surahId, ayat, surahName, arab, translation }) => {
  const client = await pool.connect();
  try {
    const r = await client.query(
      `INSERT INTO saved_ayats(user_id, surah_id, ayat, surah_name, arab, translation)
       VALUES($1,$2,$3,$4,$5,$6)
       ON CONFLICT (user_id, surah_id, ayat) DO NOTHING
       RETURNING id, surah_id, ayat, surah_name, arab, translation, created_at`,
      [userId, surahId, ayat, surahName, arab, translation]
    );
    if (r.rowCount) return r.rows[0];
    // already exists, return existing
    const existing = await client.query('SELECT id, surah_id, ayat, surah_name, arab, translation, created_at FROM saved_ayats WHERE user_id = $1 AND surah_id = $2 AND ayat = $3', [userId, surahId, ayat]);
    return existing.rowCount ? existing.rows[0] : null;
  } finally {
    client.release();
  }
};

const listSavedAyats = async (userId) => {
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT surah_id, ayat, surah_name, arab, translation FROM saved_ayats WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return r.rows.map((row) => ({ surahId: row.surah_id, ayat: row.ayat, surahName: row.surah_name, arab: row.arab, translation: row.translation }));
  } finally {
    client.release();
  }
};

const removeSavedAyat = async (userId, surahId, ayat) => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM saved_ayats WHERE user_id = $1 AND surah_id = $2 AND ayat = $3', [userId, surahId, ayat]);
    return true;
  } finally {
    client.release();
  }
};

const getProfile = async (userId) => {
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT id, name, email, email_verified, created_at FROM users WHERE id = $1', [userId]);
    if (!r.rowCount) return null;
    const u = r.rows[0];
    return { ...u };
  } finally {
    client.release();
  }
};

module.exports = {
  setLastRead,
  getLastRead,
  saveAyat,
  listSavedAyats,
  removeSavedAyat,
  getProfile
};
