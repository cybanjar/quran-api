const { Router } = require('express');

const { caching, verifyToken } = require('./middlewares');
const SurahHandler = require('./handlers/surah');
const AudioHandler = require('./handlers/audio');
const JuzHandler = require('./handlers/juz');
const PrayerHandler = require('./handlers/prayer');
const AuthHandler = require('./handlers/auth');
const UserHandler = require('./handlers/user');
const docs = require('./docs')

const router = Router();

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  next();
});

router.get('/', (req, res) => res.status(200).send(docs))

router.get('/surah', caching, SurahHandler.getAllSurah);
router.get('/surah/:surah', caching, SurahHandler.getSurah);
router.get('/surah/:surah/:ayah', caching, SurahHandler.getAyahFromSurah);
router.get('/juz/:juz', caching, JuzHandler.getJuz);

router.get('/ayah/:edition/:ayah', caching, AudioHandler.getAudioByAyah);
router.get('/audio/:edition/:surah', caching, AudioHandler.getAudioBySurah);
router.get('/reciters', caching, AudioHandler.getReciters);
router.get('/reciters/v3', AudioHandler.getRecitersV3)

router.get('/prayer/timings/:date', PrayerHandler.getTimings)

// Authentication
router.post('/register', AuthHandler.register);
router.post('/login', AuthHandler.login);
router.post('/forgot-password', AuthHandler.forgotPassword);
router.post('/reset-password', AuthHandler.resetPassword);
router.get('/verify-email', AuthHandler.verifyEmail);
router.post('/email-verification-notification', AuthHandler.resendVerification);
router.post('/logout', verifyToken, AuthHandler.logout);

// User scoped endpoints (require token)
router.post('/me/last-read', verifyToken, UserHandler.setLastRead);
router.get('/me/last-read', verifyToken, UserHandler.getLastRead);

router.post('/me/saved-ayats', verifyToken, UserHandler.saveAyat);
router.get('/me/saved-ayats', verifyToken, UserHandler.listSavedAyats);
router.delete('/me/saved-ayats', verifyToken, UserHandler.removeSavedAyat);
router.get('/me/profile', verifyToken, UserHandler.getProfile);

// fallback router
router.all('*', (req, res) => res.status(404).send({
  code: 404,
  status: 'Not Found.',
  message: `Resource "${req.url}" is not found.`
}));

module.exports = router;
