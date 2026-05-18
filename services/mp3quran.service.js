const api = require('../config/mp3quran-axios.js')
const cache = require('../config/cache.js')

const buildSurahAudio = ({
  server,
  surah
}) => {
  const padded = String(surah).padStart(
    3,
    '0'
  )

  return `${server}${padded}.mp3`
}

const mapMoshaf = (moshaf) => {
  const surahList =
    moshaf.surah_list
      .split(',')
      .map(Number)

  const surahs = surahList.map(
    (surah) => ({
      surah,
      audio: buildSurahAudio({
        server: moshaf.server,
        surah
      })
    })
  )

  return {
    id: moshaf.id,
    name: moshaf.name,
    rewayaId: moshaf.rewaya_id,
    server: moshaf.server,
    surahTotal: moshaf.surah_total,
    moshafType: moshaf.moshaf_type,
    surahs
  }
}

const getRecitersV3 = async ({
  language,
  reciter,
  sura,
  rewaya
}) => {
  const cacheKey =
    `reciters-v3-` +
    `${language || 'all'}-` +
    `${reciter || 'all'}-` +
    `${sura || 'all'}-` +
    `${rewaya || 'all'}`

  // cache
  const cached =
    cache.get(cacheKey)

  if (cached) {
    console.log(
      '[CACHE] Reciters V3'
    )

    return cached
  }

  const params = {}

  if (language)
    params.language = language

  if (reciter)
    params.reciter = reciter

  if (sura)
    params.sura = sura

  if (rewaya)
    params.rewaya = rewaya

  const response =
    await api.get('/reciters', {
      params
    })

  const reciters =
    response.data.reciters || []

  const mapped = reciters.map(
    (item) => ({
      id: item.id,
      name: item.name,
      letter: item.letter,
      date: item.date,

      moshaf:
        item.moshaf.map(
          (moshaf) =>
            mapMoshaf(
              moshaf
            )
        )
    })
  )

  // cache 24 jam
  cache.set(
    cacheKey,
    mapped,
    60 * 60 * 24
  )

  return mapped
}

module.exports = {
  getRecitersV3
}
