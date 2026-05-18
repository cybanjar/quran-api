const cache = require('../config/cache.js')

const getCache = (key) => {
  return cache.get(key)
}

const setCache = (
  key,
  value,
  ttl = 3600
) => {
  return cache.set(
    key,
    value,
    ttl
  )
}

module.exports = {
  getCache,
  setCache
}
