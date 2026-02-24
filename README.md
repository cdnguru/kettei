# Kettei.io MVP

Kettei.io is a decision ledger for architect ↔ client projects. It tracks project decisions, append-only event history, and explicit one-time-link approvals.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Neon Postgres via `@neondatabase/serverless`
- Vercel Route Handlers + Server Actions

## Features

- Landing page (`/`)
- Project list/create (`/projects`)
- Project overview + decision list/create (`/projects/[id]`)
- Decision detail with pending items, audit timeline, approvals (`/decisions/[id]`)
- Approval link route (`/approve/[token]`)
- API CRUD for projects and decisions
- Append-only decision events endpoint
- Request approval and approve-via-link endpoints

## Database setup (Neon)

1. Create a Neon project/database.
2. Copy connection string into `.env.local` as `DATABASE_URL`.
3. Run schema SQL:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## Local development

1. Install dependencies:

```bash
npm install
```

2. Configure env vars in `.env.local`:

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST/DB?sslmode=require
APP_BASE_URL=http://localhost:3000
```

3. Start dev server:

```bash
npm run dev
```

4. Open http://localhost:3000

## API reference

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/decisions`
- `GET /api/decisions/:id`
- `PUT /api/decisions/:id`
- `DELETE /api/decisions/:id`
- `GET /api/decisions/:id/events`
- `POST /api/decisions/:id/events`
- `POST /api/decision-events`
- `POST /api/approvals/request`
- `POST /api/approvals/approve/:token`

## Vercel notes

- No database calls are executed at build time.
- Dynamic pages are marked `force-dynamic` where data is fetched.
- Set `DATABASE_URL` and `APP_BASE_URL` in Vercel project environment settings.
