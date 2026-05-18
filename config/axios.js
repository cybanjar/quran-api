const axios = require('axios')
const config = require('./api.js')

const api = axios.create({
  baseURL: config.quran.apiUrl,
  timeout: config.axios.timeout,
  headers: config.axios.headers
})

api.interceptors.request.use(
  (request) => {
    console.log(
      `[REQUEST] ${request.method?.toUpperCase()} ${request.url}`
    )

    return request
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[AXIOS ERROR]', error.message)

    return Promise.reject(error)
  }
)

module.exports = api
