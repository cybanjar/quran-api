const jwt = require('jsonwebtoken');
const cache = {};
const pool = require('../config/db');

const caching = (req, res, next) => {
  const key = req.url;

  if (cache[key]) {
    return res.status(200).send(cache[key]);
  }

  res.sendResponse = res.send;
  res.send = (body) => {
    cache[key] = body;
    res.sendResponse(body);
  };

  next();
};

const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Missing token' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    // attach user basic info from db if possible
    req.user = decoded;
    (async () => {
      try {
        const client = await pool.connect();
        const r = await client.query('SELECT id, name, email, email_verified FROM users WHERE id = $1', [decoded.id]);
        client.release();
        if (r && r.rowCount) {
          req.user = Object.assign(req.user, {
            name: r.rows[0].name,
            email: r.rows[0].email,
            emailVerified: r.rows[0].email_verified
          });
        }
      } catch (e) {
        // ignore DB errors here; token is still valid
      }
    })();
    next();
  } catch (e) {
    return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Invalid token' });
  }
};

module.exports = {
  caching,
  verifyToken
};
