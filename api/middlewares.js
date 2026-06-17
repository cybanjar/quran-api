const jwt = require('jsonwebtoken');
const cache = {};

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
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).send({ code: 401, status: 'Unauthorized.', message: 'Invalid token' });
  }
};

module.exports = {
  caching,
  verifyToken
};
