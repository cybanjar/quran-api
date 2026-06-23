const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pool = require('../config/db');

const sendEmail = async ({ to, subject, text, html }) => {
  // If no SMTP host configured, fall back to console log (dev mode)
  if (!process.env.SMTP_HOST) {
    console.log('[EMAIL-LOG] SMTP not configured. Email contents:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log(text);
    return true;
  }

  const transporterConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false' }
  };

  if (process.env.SMTP_USER) {
    transporterConfig.auth = { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS };
  }

  const transporter = nodemailer.createTransport(transporterConfig);

  try {
    // verify connection configuration (will throw if cannot connect)
    await transporter.verify();
  } catch (err) {
    console.error('[EMAIL-ERROR] SMTP verify failed:', err && err.message ? err.message : err);
    throw new Error('SMTP connection/credentials invalid: ' + (err && err.message ? err.message : String(err)));
  }

  try {
    const message = { from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject };
    if (html) message.html = html;
    if (text) message.text = text;
    await transporter.sendMail(message);
    return true;
  } catch (err) {
    console.error('[EMAIL-ERROR] sendMail failed:', err && err.message ? err.message : err);
    throw new Error('Failed to send email: ' + (err && err.message ? err.message : String(err)));
  }
};

const register = async ({ name, email, password }) => {
  const client = await pool.connect();
  try {
    const exists = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rowCount) {
      const err = new Error('Email already registered');
      err.status = 400;
      throw err;
    }
  const hashed = await bcrypt.hash(password, 10);
  // use timestamp-based id to match previous behavior
  const id = Date.now().toString();
    await client.query(
      'INSERT INTO users(id, name, email, password, email_verified) VALUES($1,$2,$3,$4,$5)',
      [id, name, email, hashed, false]
    );
    return { id, name, email, emailVerified: false };
  } finally {
    client.release();
  }
};

const authenticate = async ({ email, password }) => {
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT id, name, email, password, email_verified FROM users WHERE email = $1', [email]);
    if (!r.rowCount) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return { user: { id: user.id, name: user.name, email: user.email, emailVerified: user.email_verified }, token };
  } finally {
    client.release();
  }
};

const generateVerification = async (email) => {
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!r.rowCount) return null;
    const id = r.rows[0].id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });
    await client.query('UPDATE users SET verification_token = $1 WHERE id = $2', [token, id]);
    return token;
  } finally {
    client.release();
  }
};

const verifyEmail = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const client = await pool.connect();
    try {
      const r = await client.query('SELECT id FROM users WHERE id = $1 AND verification_token = $2', [decoded.id, token]);
      if (!r.rowCount) {
        const err = new Error('Invalid token');
        err.status = 400;
        throw err;
      }
      await client.query('UPDATE users SET email_verified = true, verification_token = NULL WHERE id = $1', [decoded.id]);
      return true;
    } finally {
      client.release();
    }
  } catch (e) {
    const err = new Error('Invalid or expired token');
    err.status = 400;
    throw err;
  }
};

const generateResetToken = async (email) => {
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!r.rowCount) return null;
    const id = r.rows[0].id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1h' });
    await client.query('UPDATE users SET reset_token = $1 WHERE id = $2', [token, id]);
    return token;
  } finally {
    client.release();
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const client = await pool.connect();
    try {
      const r = await client.query('SELECT id FROM users WHERE id = $1 AND reset_token = $2', [decoded.id, token]);
      if (!r.rowCount) {
        const err = new Error('Invalid token');
        err.status = 400;
        throw err;
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await client.query('UPDATE users SET password = $1, reset_token = NULL WHERE id = $2', [hashed, decoded.id]);
      return true;
    } finally {
      client.release();
    }
  } catch (e) {
    const err = new Error('Invalid or expired token');
    err.status = 400;
    throw err;
  }
};

const findByEmail = async (email) => {
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT id, name, email, email_verified FROM users WHERE email = $1', [email]);
    return r.rowCount ? r.rows[0] : null;
  } finally {
    client.release();
  }
};

module.exports = {
  register,
  authenticate,
  generateVerification,
  verifyEmail,
  generateResetToken,
  resetPassword,
  sendEmail,
  findByEmail
};
