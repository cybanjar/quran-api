# User-scoped APIs — Last Read & Saved Ayat

These endpoints are user-scoped and require a valid JWT in the `Authorization: Bearer <token>` header. Each user has their own data.

Types
- LastRead

```json
{
  "surahId": 18,
  "ayat": 60
}
```

- SavedAyat

```json
{
  "surahId": 18,
  "ayat": 60,
  "surahName": "Al-Kahf",
  "arab": "...arabic text...",
  "translation": "...english/indonesian translation..."
}
```

Endpoints

- POST /me/last-read
  - Description: Save or update the last read position for the authenticated user.
  - Auth: required
  - Body: LastRead
  - Success: 200
  - Example

```bash
curl -X POST http://localhost:3000/me/last-read \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"surahId":18,"ayat":60}'
```

- GET /me/last-read
  - Description: Retrieve the authenticated user's last read position.
  - Auth: required
  - Success: 200, data: LastRead or null
  - Example

```bash
curl -X GET http://localhost:3000/me/last-read \
  -H 'Authorization: Bearer <token>'
```

- POST /me/saved-ayats
  - Description: Save an ayat for the authenticated user. Duplicate entries (same user + surahId + ayat) are ignored and the existing record is returned.
  - Auth: required
  - Body: SavedAyat
  - Success: 201 with saved item
  - Example

```bash
curl -X POST http://localhost:3000/me/saved-ayats \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"surahId":18,"ayat":60,"surahName":"Al-Kahf","arab":"...","translation":"..."}'
```

- GET /me/saved-ayats
  - Description: List saved ayats for the authenticated user (most recent first).
  - Auth: required
  - Success: 200 with array of SavedAyat
  - Example

```bash
curl -X GET http://localhost:3000/me/saved-ayats \
  -H 'Authorization: Bearer <token>'
```

- DELETE /me/saved-ayats
  - Description: Remove a saved ayat (body contains surahId and ayat). Returns 200 on success.
  - Auth: required
  - Body: { surahId, ayat }
  - Example

```bash
curl -X DELETE http://localhost:3000/me/saved-ayats \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"surahId":18,"ayat":60}'
```

Notes and caveats
- Auth: Use the JWT returned from `POST /login` in the `Authorization` header.
- Per-user scope: endpoints use `req.user.id` (set by `verifyToken`) to scope database rows to the authenticated user.
- Id format: this project currently uses timestamp-based string ids (e.g., `Date.now().toString()`) for users. Ensure tokens reference those ids.
- Input validation: the API performs minimal validation. It's recommended to sanitize or validate inputs on client and server for production use.
- Concurrency: saved ayats table has a uniqueness constraint to avoid duplicate saves for the same user/ayat.

If you'd like, I can:
- Add request/response examples to `docs/API.md` so everything is in one file.
- Provide a small Postman collection or example JSON for import.
