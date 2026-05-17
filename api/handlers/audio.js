const config = require('../../config/api.js')

const {
  successResponse,
  errorResponse
} = require('../../helpers/response.js')

const {
  isValidBitrate,
  isValidAyah,
  isValidSurah
} = require('../../utils/validator.js')

const {
  getAyahAudioUrl,
  getSurahAudioUrl,
  getReciters
} = require('../../services/quran.service.js')

class AudioController {
  /**
   * GET AUDIO BY AYAH
   * /audio/:edition/:ayah
   */
  static getAudioByAyah(req, res) {
    try {
      const { edition, ayah } = req.params

      const bitrate = Number(
        req.query.bitrate ||
        config.audio.defaultBitrate
      )

      // validate bitrate
      if (!isValidBitrate(bitrate)) {
        return errorResponse(
          res,
          'Invalid bitrate.',
          400
        )
      }

      // validate ayah
      if (!isValidAyah(ayah)) {
        return errorResponse(
          res,
          'Ayah must be between 1 and 6236.',
          400
        )
      }

      // generate url
      const url = getAyahAudioUrl({
        bitrate,
        edition,
        ayah
      })

      return successResponse(
        res,
        'Success fetching audio.',
        {
          edition,
          ayah: Number(ayah),
          bitrate,
          url
        }
      )
    } catch (error) {
      return errorResponse(
        res,
        error.message
      )
    }
  }

  /**
   * GET AUDIO BY SURAH
   * /audio-surah/:edition/:surah
   */
  static getAudioBySurah(req, res) {
    try {
      const { edition, surah } = req.params

      const bitrate = Number(
        req.query.bitrate ||
        config.audio.defaultBitrate
      )

      // validate bitrate
      if (!isValidBitrate(bitrate)) {
        return errorResponse(
          res,
          'Invalid bitrate.',
          400
        )
      }

      // validate surah
      if (!isValidSurah(surah)) {
        return errorResponse(
          res,
          'Surah must be between 1 and 114.',
          400
        )
      }

      // generate url
      const url = getSurahAudioUrl({
        bitrate,
        edition,
        surah
      })

      return successResponse(
        res,
        'Success fetching surah audio.',
        {
          edition,
          surah: Number(surah),
          bitrate,
          url
        }
      )
    } catch (error) {
      return errorResponse(
        res,
        error.message
      )
    }
  }

  /**
   * GET RECITERS
   * /reciters?language=ar
   */
  static async getReciters(req, res) {
    try {
      const { language } = req.query

      let reciters = await getReciters()

      // mapping response
      reciters = reciters.map((item) => ({
        identifier: item.identifier,
        language: item.language,
        englishName: item.englishName,
        name: item.name,
        format: item.format,
        type: item.type
      }))

      // optional filter
      if (language) {
        reciters = reciters.filter(
          (item) =>
            item.language === language
        )
      }

      return successResponse(
        res,
        'Success fetching reciters.',
        reciters
      )
    } catch (error) {
      return errorResponse(
        res,
        error.message
      )
    }
  }
}

module.exports = AudioController
