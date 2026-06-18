# API Reference — quran-api

All responses follow the shape: `{ code, status, message, data }` unless otherwise noted.

Base URL: `http://localhost:3000`

Surah / Juz / Ayah
- GET /surah — list all surah
- GET /surah/:surah — get a specific surah (1..114)
- GET /surah/:surah/:ayah — get specific ayah from a surah
- GET /juz/:juz — get a juz

Audio
- GET /ayah/:edition/:ayah — get audio metadata/url for a specific global ayah index
- GET /audio/:edition/:surah — audio for a full surah
- GET /reciters — list reciters
- GET /reciters/v3 — newer reciters endpoint (query params supported)

Prayer
- GET /prayer/timings/:date — get prayer timings for a date (see query params in docs object)

Authentication (added endpoints)
- POST /register
  - Body: { name, email, password }
  - Response: 201 with created user id and email
  - Sends verification email with link: `/verify-email?token=...`

- POST /login
  - Body: { email, password }
  - Response: 200 with { user, token } where token is a JWT

- POST /forgot-password
  - Body: { email }
  - Response: 200 (always) with message telling the user a reset link will be sent if email exists
  - Sends email containing `/reset-password?token=...`

- POST /reset-password
  - Body: { token, password }
  - Response: 200 on success

- GET /verify-email?token=...
  - Verifies user's email using the JWT token

- POST /email-verification-notification
  - Body: { email }
  - Re-sends verification email if the user exists

- POST /logout
  - Protected: requires `Authorization: Bearer <token>` header
  - Behaviour: stateless JWT; server replies OK — client should discard token

Notes and patterns
- Handlers are classes under `api/handlers` with static methods and are registered in `api/routes.js`.
- Responses follow `{ code, status, message, data }`.
- Use middleware `caching` (in `api/middlewares.js`) to cache route responses in-memory.
- Authentication uses JWT signed with `JWT_SECRET` env var. Tokens expire after 7 days by default.

Examples (curl)
- Register
  curl -X POST http://localhost:3000/register -H 'Content-Type: application/json' -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'

- Login
  curl -X POST http://localhost:3000/login -H 'Content-Type: application/json' -d '{"email":"alice@example.com","password":"secret"}'
