const axios = require('axios')

class AudioController {
  static getAudioByAyah(req, res) {
    try {
      const { edition, ayah } = req.params

      // default bitrate
      const bitrate = req.query.bitrate || 128

      // valid bitrate
      const allowedBitrates = [192, 128, 64, 48, 40, 32]

      if (!allowedBitrates.includes(Number(bitrate))) {
        return res.status(400).send({
          code: 400,
          status: 'Bad Request',
          message: 'Invalid bitrate.',
          data: {}
        })
      }

      // valid ayah
      if (Number(ayah) < 1 || Number(ayah) > 6236) {
        return res.status(400).send({
          code: 400,
          status: 'Bad Request',
          message: 'Ayah must be between 1 and 6236.',
          data: {}
        })
      }

      const url =
        `https://cdn.islamic.network/quran/audio/` +
        `${bitrate}/${edition}/${ayah}.mp3`

      return res.status(200).send({
        code: 200,
        status: 'OK',
        message: 'Success fetching audio.',
        data: {
          edition,
          ayah: Number(ayah),
          bitrate: Number(bitrate),
          url
        }
      })
    } catch (error) {
      return res.status(500).send({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
        data: {}
      })
    }
  }

  static getAudioBySurah(req, res) {
    try {
      const { edition, surah } = req.params
      console.log({edition, surah})


      // default bitrate
      const bitrate = req.query.bitrate || 128

      // valid bitrate
      const allowedBitrates = [192, 128, 64, 48, 40, 32]

      if (!allowedBitrates.includes(Number(bitrate))) {
        return res.status(400).send({
          code: 400,
          status: 'Bad Request',
          message: 'Invalid bitrate.',
          data: {}
        })
      }

      // valid surah
      if (Number(surah) < 1 || Number(surah) > 114) {
        return res.status(400).send({
          code: 400,
          status: 'Bad Request',
          message: 'Surah must be between 1 and 114.',
          data: {}
        })
      }

      const url =
        `https://cdn.islamic.network/quran/audio-surah/` +
        `${bitrate}/${edition}/${surah}.mp3`

      return res.status(200).send({
        code: 200,
        status: 'OK',
        message: 'Success fetching surah audio.',
        data: {
          edition,
          surah: Number(surah),
          bitrate: Number(bitrate),
          url
        }
      })
    } catch (error) {
      return res.status(500).send({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
        data: {}
      })
    }
  }

  static async getReciters(req, res) {
    try {
      const { language } = req.query
      const response = await axios.get(
        'https://api.alquran.cloud/v1/edition/format/audio'
      )

      const editions = response.data.data || []

      // filter audio only
      let reciters = editions.map((item) => ({
        identifier: item.identifier,
        language: item.language,
        englishName: item.englishName,
        name: item.name,
        format: item.format,
        type: item.type
      }))

      // optional filter language
      if (language) {
        reciters = reciters.filter(
          (item) => item.language === language
        )
      }

      return res.status(200).send({
        code: 200,
        status: 'OK',
        message: 'Success fetching reciters.',
        data: reciters
      })
    } catch (error) {
      return res.status(500).send({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
        data: []
      })
    }
  }
}

module.exports = AudioController
