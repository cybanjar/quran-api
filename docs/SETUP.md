# Setup — Local development

This file explains how to run the API locally with Postgres and Mailtrap (SMTP sandbox).

1) Start Postgres

System: PostgreSQL
Server: postgres
Username: postgres
Password: postgres
Database: quran_db
Port: 5432
Host: localhost

You can start Postgres locally via Docker:

```bash
docker run --name quran-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=quran_db -p 5432:5432 -d postgres:15
```

2) Environment variables

Create a `.env` file in the project root with at least:

```
PORT=3000
JWT_SECRET=your_secure_secret
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASS=postgres
PG_DATABASE=quran_db

# SMTP (Mailtrap sandbox example)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=72ce0f2cdeb928
SMTP_PASS=80c25747b32926
SMTP_FROM=admin@quranapi.com
```

3) Install dependencies

```bash
npm install
```

4) Run DB migrations

```bash
npm run db:migrate
```

5) Start the server

```bash
npm start
# or for dev mode
npm run dev
```

6) Check emails

If you used the Mailtrap credentials above, log into Mailtrap to view verification/reset emails.

Troubleshooting
- If migrations fail, check that Postgres is reachable at `PG_HOST:PG_PORT` and credentials are correct.
- If SMTP emails do not appear, confirm SMTP credentials and check logs — the app logs email contents when `SMTP_HOST` is not set.
