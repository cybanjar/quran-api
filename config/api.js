module.exports = {
  quran: {
    cdnUrl: 'https://cdn.islamic.network',
    apiUrl: 'https://api.alquran.cloud'
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
