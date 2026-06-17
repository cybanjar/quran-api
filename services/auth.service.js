const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const findByEmail = (email) => readUsers().find((u) => u.email === email);

const register = async ({ name, email, password }) => {
  console.log({ name, email, password: password ? '***' : null })
  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashed,
    emailVerified: false,
    verificationToken: null,
    resetToken: null,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  writeUsers(users);
  return user;
};

const authenticate = async ({ email, password }) => {
  const user = findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  return { user: { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified }, token };
};

const generateVerification = (email) => {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });
  user.verificationToken = token;
  writeUsers(users);
  return token;
};

const verifyEmail = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const users = readUsers();
    const user = users.find((u) => u.id === decoded.id && u.verificationToken === token);
    if (!user) {
      const err = new Error('Invalid token');
      err.status = 400;
      throw err;
    }
    user.emailVerified = true;
    user.verificationToken = null;
    writeUsers(users);
    return user;
  } catch (e) {
    const err = new Error('Invalid or expired token');
    err.status = 400;
    throw err;
  }
};

const generateResetToken = (email) => {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1h' });
  user.resetToken = token;
  writeUsers(users);
  return token;
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const users = readUsers();
    const user = users.find((u) => u.id === decoded.id && u.resetToken === token);
    if (!user) {
      const err = new Error('Invalid token');
      err.status = 400;
      throw err;
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    writeUsers(users);
    return user;
  } catch (e) {
    const err = new Error('Invalid or expired token');
    err.status = 400;
    throw err;
  }
};

const sendEmail = async ({ to, subject, text }) => {
  // Use env-configured SMTP. In dev, logs the email to console.
  if (!process.env.SMTP_HOST) {
    console.log('[EMAIL] To:', to, 'Subject:', subject, '\n', text);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text });
  return true;
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
