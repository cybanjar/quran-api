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
const allowedLanguages = [
  'ar',
  'eng',
  'fr',
  'ru',
  'de',
  'es',
  'tr',
  'cn',
  'th',
  'ur',
  'bn',
  'bs',
  'ug',
  'fa',
  'tg',
  'ml',
  'tl',
  'id',
  'pt',
  'ha',
  'sw'
]

const isValidLanguage = (language) => {
  return allowedLanguages.includes(
    language
  )
}

module.exports = {
  isValidBitrate,
  isValidAyah,
  isValidSurah,
  isValidLanguage,
}
