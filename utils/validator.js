const config = require('../config/api.js')

const isValidBitrate = (bitrate) => {
  return config.audio.allowedBitrates.includes(
    Number(bitrate)
  )
}

const isValidAyah = (ayah) => {
  return Number(ayah) >= 1 && Number(ayah) <= 6236
}

const isValidSurah = (surah) => {
  return Number(surah) >= 1 && Number(surah) <= 114
}

module.exports = {
  isValidBitrate,
  isValidAyah,
  isValidSurah
}
