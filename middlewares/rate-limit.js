const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100, // max request
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    code: 429,
    status: 'TOO MANY REQUESTS',
    message:
      'Too many requests, please try again later.',
    data: {}
  }
})

module.exports = {
  apiLimiter
}
