const api = require('../config/prayer-axios.js')
const cache = require('../config/cache.js')

const buildCacheKey = ({
  date,
  latitude,
  longitude
}) =>
  `prayer-timings-${date}-${latitude}-${longitude}`

const mapPrayerTimings = (
  data
) => ({
  timings: data.timings,
  date: data.date,
  meta: data.meta
})

const getPrayerTimings =
  async ({
    date,
    latitude,
    longitude
  }) => {
    const cacheKey =
      buildCacheKey({
        date,
        latitude,
        longitude
      })

    // cache
    const cached =
      cache.get(cacheKey)

    if (cached) {
      console.log(
        '[CACHE] Prayer Timings'
      )

      return cached
    }

    const params = {
      latitude,
      longitude
    }

    const response =
      await api.get(
        `/v1/timings/${date}`,
        {
          params
        }
      )

    const mapped =
      mapPrayerTimings(
        response.data.data
      )

    // cache 30 menit
    cache.set(
      cacheKey,
      mapped,
      60 * 30
    )

    return mapped
  }

module.exports = {
  getPrayerTimings
}
