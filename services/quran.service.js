const api = require('../config/axios.js')
const config = require('../config/api.js')
const cache = require('../config/cache.js')

const RECITERS_CACHE_KEY = 'reciters'

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
  // check cache
  const cached = cache.get(RECITERS_CACHE_KEY)
  if (cached) {
    console.log('[CACHE] Reciters from memory cache')

    return cached
  }
  console.log('[API] Fetch reciters from API')

  const response = await api.get(
    '/v1/edition/format/audio'
  )
  const data = response.data.data || []

  // save cache
  cache.set(
    RECITERS_CACHE_KEY,
    data
  )

  return data
}

module.exports = {
  getAyahAudioUrl,
  getSurahAudioUrl,
  getReciters
}
