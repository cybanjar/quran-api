module.exports = {
  surah: {
    listSurah: '/surah',

    specificSurah: {
      pattern: '/surah/{surah}',
      example: '/surah/18'
    },

    specificAyahInSurah: {
      pattern:
        '/surah/{surah}/{ayah}',
      example: '/surah/18/60'
    },

    specificJuz: {
      pattern: '/juz/{juz}',
      example: '/juz/30'
    }
  },

  audio: {
    ayah: {
      pattern:
        '/ayah/{edition}/{ayah}',
      example:
        '/ayah/ar.alafasy/2:255'
    },

    surah: {
      pattern:
        '/audio/{edition}/{surah}',
      example:
        '/audio/ar.alafasy/18'
    },

    reciters: {
      pattern: '/reciters',
      example: '/reciters'
    },

    recitersV3: {
      pattern:
        '/reciters/v3?language={language}&reciter={reciter}&sura={sura}&rewaya={rewaya}',
      example:
        '/reciters/v3?language=eng&sura=1'
    }
  },

  prayer: {
    timings: {
      pattern:
        '/prayer/timings/{date}?latitude={latitude}&longitude={longitude}',
      example:
        '/prayer/timings/27-05-2026?latitude=-6.871869534164147&longitude=109.06208042946209'
    }
  },

  maintainer:
    'Sutan Gading Fadhillah Nasution <contact@gading.dev> modified Syamsul Amin <cybanjar@gmail.com>',

  source:
    'https://github.com/gadingnst/quran-api'
}
