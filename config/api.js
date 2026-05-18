module.exports = {
  quran: {
    cdnUrl: 'https://cdn.islamic.network',
    apiUrl: 'https://api.alquran.cloud'
  },

  mp3quran: {
    apiUrl: 'https://mp3quran.net/api/v3'
  },

  axios: {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  },

  audio: {
    allowedBitrates: [192, 128, 64, 48, 40, 32],
    defaultBitrate: 128
  }
}
