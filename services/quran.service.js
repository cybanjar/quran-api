const api = require('../config/axios.js')
const config = require('../config/api.js')

const getAyahAudioUrl = ({
  bitrate,
  edition,
  ayah
}) => {
  return `${config.quran.cdnUrl}/quran/audio/${bitrate}/${edition}/${ayah}.mp3`
}

const getSurahAudioUrl = ({
  bitrate,
  edition,
  surah
}) => {
  return `${config.quran.cdnUrl}/quran/audio-surah/${bitrate}/${edition}/${surah}.mp3`
}

const getReciters = async () => {
  const response = await api.get(
    '/v1/edition/format/audio'
  )

  return response.data.data || []
}

module.exports = {
  getAyahAudioUrl,
  getSurahAudioUrl,
  getReciters
}
