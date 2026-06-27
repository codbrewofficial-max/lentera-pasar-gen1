# Lentera Pasar Backend MVP

Backend ini adalah fondasi MVP untuk Lentera Pasar sebagai managed platform yang SaaS-ready secara struktur data. Scope saat ini hanya `apps/api` dan `packages/shared`; belum ada dashboard, site-renderer, billing, payment, custom domain, marketplace, atau permission kompleks.

## Stack

- Node.js, TypeScript, Fastify
- Prisma, PostgreSQL
- JWT stateless auth
- Zod validation
- JSON API
- pnpm workspace

## Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
```

Isi `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lentera_pasar?schema=public"
JWT_SECRET="change-me-in-production"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
IP_HASH_SECRET="change-me-too"
```

## Database

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

Seed membuat:

- Internal admin: `internal@lenterapasar.test` / `password123`
- Owner demo: `owner@lenterapasar.test` / `password123`
- Website published: `lentera-demo`
- Default pages, section slots, template sections, business profile, services, portfolios, testimonials, brand partners, leads, dan tracking events demo.

## Run

```bash
pnpm dev:api
```

API default berjalan di `http://localhost:4000`.

## Endpoint Utama

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/internal/owners`
- `POST /api/v1/internal/owners`
- `GET /api/v1/internal/websites`
- `GET /api/v1/website-types`
- `GET /api/v1/websites`
- `POST /api/v1/websites`
- `GET /api/v1/websites/:websiteId/pages`
- `GET /api/v1/websites/:websiteId/sections`
- `PATCH /api/v1/websites/:websiteId/sections/:slotKey/template`
- `PATCH /api/v1/websites/:websiteId/sections/:slotKey/content`
- `GET /api/v1/template-sections?websiteType=company_profile&slotKey=home.hero`
- `POST /api/v1/internal/template-sections/import-zip`
- `GET /api/v1/websites/:websiteId/business-profile`
- `PUT /api/v1/websites/:websiteId/business-profile`
- `GET/POST/PATCH/DELETE /api/v1/websites/:websiteId/services`
- `GET/POST/PATCH/DELETE /api/v1/websites/:websiteId/portfolios`
- `GET/POST/PATCH/DELETE /api/v1/websites/:websiteId/testimonials`
- `GET/POST/PATCH/DELETE /api/v1/websites/:websiteId/brand-partners`
- `GET /api/v1/public/sites/:slug`
- `GET /api/v1/public/sites/:slug/pages/:pageSlug`
- `POST /api/v1/public/tracking/events`
- `POST /api/v1/public/sites/:slug/contact`
- `GET /api/v1/websites/:websiteId/leads`
- `GET /api/v1/websites/:websiteId/insights/summary`
- `GET /api/v1/websites/:websiteId/insights/top-pages`
- `GET /api/v1/websites/:websiteId/insights/top-sections`
- `GET /api/v1/websites/:websiteId/insights/top-ctas`
- `GET /api/v1/websites/:websiteId/insights/top-services`
- `GET /api/v1/websites/:websiteId/insights/top-portfolios`
- `GET /api/v1/websites/:websiteId/insights/traffic-sources`

## Manual Smoke Test

Login owner:

```bash
curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "content-type: application/json" \
  -d "{\"email\":\"owner@lenterapasar.test\",\"password\":\"password123\"}"
```

Load public website demo:

```bash
curl -s http://localhost:4000/api/v1/public/sites/lentera-demo
```

Create tracking event:

```bash
curl -s -X POST http://localhost:4000/api/v1/public/tracking/events \
  -H "content-type: application/json" \
  -d "{\"trackingKey\":\"TRACKING_KEY_FROM_PUBLIC_SITE\",\"eventName\":\"page_view\",\"visitorId\":\"visitor_abc\",\"sessionId\":\"session_xyz\",\"pageKey\":\"home\",\"metadata\":{}}"
```

Submit contact:

```bash
curl -s -X POST http://localhost:4000/api/v1/public/sites/lentera-demo/contact \
  -H "content-type: application/json" \
  -d "{\"name\":\"Budi\",\"email\":\"budi@example.com\",\"phone\":\"08123456789\",\"message\":\"Saya tertarik\",\"interest\":\"Company Profile\",\"sourcePage\":\"contact\",\"sourceSection\":\"contact.contact_form\"}"
```

Automated smoke script tersedia setelah API berjalan dan seed sudah masuk:

```bash
pnpm smoke:api
```
