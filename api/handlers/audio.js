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
const { getRecitersV3 } = require('../../services/mp3quran.service.js')
const { isValidLanguage } = require('../../utils/validator.js')

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

  static async getRecitersV3(
    req,
    res
  ) {
    try {
      const {
        language,
        reciter,
        sura,
        rewaya
      } = req.query

      // validate language
      if (
        language &&
        !isValidLanguage(language)
      ) {
        return errorResponse(
          res,
          'Invalid language.',
          400
        )
      }

      // validate sura
      if (
        sura &&
        (Number(sura) < 1 ||
          Number(sura) > 114)
      ) {
        return errorResponse(
          res,
          'Sura must be between 1 and 114.',
          400
        )
      }

      const data =
        await getRecitersV3({
          language,
          reciter,
          sura,
          rewaya
        })

      return successResponse(
        res,
        'Success fetching reciters v3.',
        data
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
