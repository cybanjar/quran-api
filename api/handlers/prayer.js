const {
  successResponse,
  errorResponse
} = require('../../helpers/response.js')

const {
  getPrayerTimings
} = require('../../services/prayer.service.js')

class PrayerHandler {
  static async getTimings(req, res) {
    try {
      const { date } = req.params
      const {
        latitude,
        longitude
      } = req.query

      console.log(
        `[PRAYER REQUEST] Date: ${date}, Latitude: ${latitude}, Longitude: ${longitude}`
      )

      if (
        !date ||
        !latitude ||
        !longitude
      ) {
        return errorResponse(
          res,
          'Date, latitude, and longitude are required.'
        )
      }

      const timings =
        await getPrayerTimings({
          date,
          latitude,
          longitude
        })

      return successResponse(
        res,
        'Success fetching prayer timings.',
        timings
      )
    } catch (error) {
      return errorResponse(
        res,
        error.message
      )
    }
  }
}

module.exports = PrayerHandler
