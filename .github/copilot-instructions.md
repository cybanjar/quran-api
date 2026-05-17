## Quick orient — what this project is

This repo is a small Node/Express JSON API that serves a pre-built Quran dataset and audio metadata. Key concerns:
- API code lives under `api/` (server, routes, handlers, middleware).
- Canonical data files live in `data/` (especially `data/quran.json` and `data/juz.json`).
- A crawler (`crawler/script.js`) regenerates `data/quran.json` by fetching multiple upstream sources.

## Big-picture architecture

- `api/server.js` boots an Express app, loads `routes.js`, and uses `dotenv` for `PORT`.
- `api/routes.js` wires routes and a simple in-memory caching middleware `api/middlewares.js`.
- Route handlers are organized in `api/handlers/*.js` as classes with static methods (e.g. `SurahHandler`, `AudioController`, `JuzHandler`). They follow a consistent JSON response shape: { code, status, message, data }.
- `api/lib/juz.js` provides logic to assemble a Juz from `data/juz.json` + `data/quran.json` (so both files must be consistent when editing).
- Audio metadata / URLs are computed (not stored) by `api/handlers/audio.js` and reference external CDN(s) like `https://cdn.islamic.network` and `https://api.alquran.cloud`.

## Developer workflows & useful commands

- Install / build: `npm install` (there is a `build` script that runs `npm install`).
- Run production-style server: `npm start` (runs `node api/server.js`).
- Run in dev mode with auto-reload: `npm run dev` (uses `nodemon`).
- Re-generate canonical JSON data: `npm run crawl` (runs `node crawler/script.js`).
  - After `crawl` finishes it writes `data/quran.json`. Restart the server to pick up new data because the app requires a process restart to read updated JSON.

## Project-specific conventions and gotchas

- CommonJS modules (require/module.exports). Add new files using the same style.
- Responses always use the pattern: status HTTP code + JSON body with `code`, `status`, `message`, `data`. Follow this format in new handlers for consistency.
- Routes set a `Cache-Control` header in `api/routes.js`. Additionally `api/middlewares.js` implements an in-memory `cache` object keyed by `req.url`. This cache is process-local and cleared on restart — don't rely on it for long-term caching.
- Handlers are implemented as classes with static methods. Example:
  - `api/handlers/surah.js` exports `SurahHandler` with `getAllSurah`, `getSurah`, `getAyahFromSurah`.
- Audio endpoints validate request params strictly (see allowed bitrates in `api/handlers/audio.js`: [192,128,64,48,40,32]) and return helpful 400 responses on invalid input.
- `crawler/script.js` is the single source for regenerating `data/quran.json`. It fetches upstream editions and merges tafsir; changing data shape requires updating both crawler and handlers that read `data/*.json`.

## Integration points / external dependencies

- Primary upstream sources used by the crawler: `api.alquran.cloud`, `quran.kemenag.go.id` (see `crawler/script.js` and `README.md`).
- Audio URLs are composed against `cdn.islamic.network` and `cdn.alquran.cloud` (see `api/handlers/audio.js`).
- No DB: all runtime data is served from `data/*.json` files.

## Where to make common edits

- Add new endpoints: `api/routes.js` -> new handler at `api/handlers/<name>.js`.
- Change the canonical dataset: edit or re-generate `data/quran.json` (preferred via `npm run crawl`).
- Modify Juz logic: `api/lib/juz.js` and `data/juz.json`.

## Examples (copy/paste patterns)

- Route registration pattern (use same caching middleware):
  router.get('/surah', caching, SurahHandler.getAllSurah)
- Handler response pattern (use same JSON shape):
  return res.status(200).send({ code:200, status:'OK.', message:'Success', data })

## Small reminders for bots/agents

- Preserve CommonJS style and existing JSON response shape.
- When changing `data/*.json`, run `npm run crawl` if the change should be produced by the crawler and restart the server to validate.
- Be mindful that the in-memory cache in `api/middlewares.js` is process-local; testing endpoints after changing handlers may require clearing cache (restart server).
- Use the allowed bitrate list and numeric ranges enforced in `api/handlers/audio.js` and the numeric bounds for surah/ayah (surah: 1–114, ayah: 1–6236) when generating or validating requests.

If anything here is unclear or you want more examples (tests, PR checklist, or CI hooks), tell me which area to expand and I'll iterate.
