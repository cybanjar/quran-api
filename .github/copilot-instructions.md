# Quick orient — quran-api (for automated coding agents)

This repository is a small Node/Express JSON API that serves a pre-built Quran dataset and audio metadata. Keep guidance short, concrete and code-aware so you can be productive immediately.

Key locations
- API server and routes: `api/server.js`, `api/routes.js`, `api/middlewares.js`
- Route handlers: `api/handlers/*.js` (e.g. `surah.js`, `audio.js`, `juz.js`) — handlers are classes with static methods.
- Canonical data: `data/quran.json`, `data/juz.json`
- Data generator / crawler: `crawler/script.js` (recreates `data/quran.json`)
- Juz assembly logic: `api/lib/juz.js`
- Services: `services/*.js` (business logic used by handlers)

Big picture (what to know)
- The app is a stateless Express server that reads canonical JSON files at startup and serves derived JSON responses.
- No database — runtime state comes from files in `data/`. Changing those files often requires running the crawler (`npm run crawl`) or restarting the server.
- Audio metadata/URLs are computed on the fly (see `api/handlers/audio.js`) and reference external CDNs (`cdn.islamic.network`, `api.alquran.cloud`).
- There is a small in-memory request cache implemented in `api/middlewares.js` keyed by `req.url`. It's process-local and reset on restart.

Conventions and patterns to follow
- CommonJS modules everywhere (use `require` / `module.exports`).
- Handlers are classes with static methods. Register them in `api/routes.js` using the existing caching middleware.
  - Example route pattern: `router.get('/surah', caching, SurahHandler.getAllSurah)`
- Responses follow a strict JSON shape: { code, status, message, data }. All handlers must return this shape and appropriate HTTP codes.
- `api/handlers/audio.js` validates bitrates against an allowed list: [192,128,64,48,40,32]. Follow this when adding audio endpoints.
- Surah/ayah bounds are enforced (surah: 1–114, global ayah index up to 6236). Use service helpers (e.g. `services/quran.service.js`) where available.
- When changing Juz logic, update both `api/lib/juz.js` and `data/juz.json` to keep them consistent.

Developer workflows (commands you can use)
- Install deps: `npm install`
- Start production-style server: `npm start` (runs `node api/server.js`)
- Dev mode with auto-reload: `npm run dev` (nodemon)
- Regenerate canonical JSON: `npm run crawl` (runs `node crawler/script.js`). After crawling, restart the server to pick up `data/quran.json`.

Integration points and external dependencies
- Crawler fetches upstream editions from `api.alquran.cloud` and other sources in `crawler/script.js`.
- Audio URLs rely on CDNs: `cdn.islamic.network` and `cdn.alquran.cloud` (see `api/handlers/audio.js`).
- No external DB or queue — everything is file-backed.

Small, actionable rules for code changes
- Prefer small edits and preserve CommonJS style. Don't introduce ESM unless the project already migrated.
- When adding endpoints: wire route in `api/routes.js`, implement handler as a class in `api/handlers/`, follow response shape, and reuse services in `services/`.
- If you change `data/*.json`, either regenerate via the crawler or document why the manual change is safe. Restart the server to pick up changes.
- Use the in-memory cache middleware when appropriate (routes already use it; follow existing pattern).

Examples (copy-paste patterns)
- Route registration: `router.get('/surah', caching, SurahHandler.getAllSurah)`
- Handler response:
  return res.status(200).send({ code: 200, status: 'OK.', message: 'Success', data })

If anything here is unclear or a handler's behavior seems inconsistent with the data files, open a short issue and include the route and a sample request/response. Ask me if you want automated tests or a small smoke-test harness added — I can create one quickly.
