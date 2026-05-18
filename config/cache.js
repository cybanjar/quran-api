const NodeCache = require('node-cache')

// default cache 1 jam
const cache = new NodeCache({
  stdTTL: 60 * 60,
  checkperiod: 120
})

module.exports = cache
