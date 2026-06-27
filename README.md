# Lentera Pasar Backend MVP

Lentera Pasar backend ini adalah fondasi MVP untuk managed platform yang SaaS-ready secara struktur data. Scope saat ini hanya backend: `apps/api` dan `packages/shared`. Belum ada dashboard, site-renderer, billing, payment, custom domain, marketplace, permission kompleks, blog, WhatsApp official API, atau drag-and-drop builder.

## Stack

- Node.js, TypeScript, Fastify
- Prisma, PostgreSQL
- JWT stateless auth
- Zod validation
- JSON API
- pnpm workspace via Corepack

## PostgreSQL Lokal Dengan Docker

```bash
docker run --name lentera-pasar-postgres \
  -e POSTGRES_USER=lentera \
  -e POSTGRES_PASSWORD=lentera123 \
  -e POSTGRES_DB=lentera_pasar \
  -p 5432:5432 \
  -d postgres:16
```

Jika container sudah pernah dibuat:

```bash
docker start lentera-pasar-postgres
```

## Env

```bash
copy apps\api\.env.example apps\api\.env
```

Isi default untuk development lokal:

```env
DATABASE_URL="postgresql://lentera:lentera123@localhost:5432/lentera_pasar?schema=public"
JWT_SECRET="change-this-dev-secret"
API_PORT=4000
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
IP_HASH_SECRET="change-this-ip-hash-secret"
```

## Install

```bash
corepack pnpm install
```

## Database

```bash
corepack pnpm prisma:generate
corepack pnpm prisma:validate
corepack pnpm prisma:migrate
corepack pnpm prisma:seed
```

Seed membuat:

- Internal admin: `internal@lenterapasar.test` / `password123`
- Owner demo: `owner@lenterapasar.test` / `password123`
- Website published: `lentera-demo`
- Default pages, section slots, template sections, business profile, services, portfolios, testimonials, brand partners, leads, dan tracking events demo.

## Run API

```bash
corepack pnpm dev:api
```

API default berjalan di `http://localhost:4000`.

## Smoke Test

Jalankan setelah migration, seed, dan API dev server aktif:

```bash
corepack pnpm smoke:api
```

Smoke test membuktikan login demo, owner/internal access, create website company profile, default pages/sections, template selection, content CRUD dasar, public renderer API, tracking, contact lead, dan insight endpoints.

## Frontend Contract Docs

Backend Stage 3 fokus pada frontend readiness, bukan penambahan fitur SaaS.

- [Dashboard API Contract](docs/API-CONTRACT-DASHBOARD.md)
- [Site Renderer API Contract](docs/API-CONTRACT-SITE-RENDERER.md)
- [Frontend Integration Notes](docs/FRONTEND-INTEGRATION-NOTES.md)

## Build

```bash
corepack pnpm build:api
```

## Endpoint Utama

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/internal/owners`
- `POST /api/v1/internal/owners`
- `GET /api/v1/internal/owners/:ownerId`
- `PATCH /api/v1/internal/owners/:ownerId`
- `GET /api/v1/internal/websites`
- `GET /api/v1/internal/websites/:websiteId`
- `GET /api/v1/website-types`
- `GET /api/v1/websites`
- `POST /api/v1/websites`
- `GET /api/v1/websites/:websiteId`
- `PATCH /api/v1/websites/:websiteId`
- `POST /api/v1/websites/:websiteId/publish`
- `POST /api/v1/websites/:websiteId/unpublish`
- `GET /api/v1/websites/:websiteId/pages`
- `GET /api/v1/websites/:websiteId/pages/:pageKey`
- `GET /api/v1/websites/:websiteId/sections`
- `GET /api/v1/websites/:websiteId/sections/:slotKey`
- `PATCH /api/v1/websites/:websiteId/sections/:slotKey/template`
- `PATCH /api/v1/websites/:websiteId/sections/:slotKey/content`
- `PATCH /api/v1/websites/:websiteId/sections/:slotKey/visibility`
- `POST /api/v1/internal/template-sections/import-zip`
- `GET /api/v1/template-sections`
- `GET /api/v1/template-sections/:id`
- `GET /api/v1/template-sections/by-slot/:slotKey`
- `GET /api/v1/websites/:websiteId/business-profile`
- `PUT /api/v1/websites/:websiteId/business-profile`
- `GET /api/v1/websites/:websiteId/services`
- `POST /api/v1/websites/:websiteId/services`
- `GET /api/v1/websites/:websiteId/services/:serviceId`
- `PATCH /api/v1/websites/:websiteId/services/:serviceId`
- `DELETE /api/v1/websites/:websiteId/services/:serviceId`
- `GET /api/v1/websites/:websiteId/portfolios`
- `POST /api/v1/websites/:websiteId/portfolios`
- `GET /api/v1/websites/:websiteId/portfolios/:portfolioId`
- `PATCH /api/v1/websites/:websiteId/portfolios/:portfolioId`
- `DELETE /api/v1/websites/:websiteId/portfolios/:portfolioId`
- `GET /api/v1/websites/:websiteId/testimonials`
- `POST /api/v1/websites/:websiteId/testimonials`
- `GET /api/v1/websites/:websiteId/testimonials/:testimonialId`
- `PATCH /api/v1/websites/:websiteId/testimonials/:testimonialId`
- `DELETE /api/v1/websites/:websiteId/testimonials/:testimonialId`
- `GET /api/v1/websites/:websiteId/brand-partners`
- `POST /api/v1/websites/:websiteId/brand-partners`
- `GET /api/v1/websites/:websiteId/brand-partners/:brandPartnerId`
- `PATCH /api/v1/websites/:websiteId/brand-partners/:brandPartnerId`
- `DELETE /api/v1/websites/:websiteId/brand-partners/:brandPartnerId`
- `GET /api/v1/public/sites/:slug`
- `GET /api/v1/public/sites/:slug/pages/:pageSlug`
- `GET /api/v1/websites/:websiteId/preview/pages/:pageKey`
- `POST /api/v1/public/tracking/events`
- `POST /api/v1/public/sites/:slug/contact`
- `GET /api/v1/websites/:websiteId/leads`
- `GET /api/v1/websites/:websiteId/leads/recent`
- `PATCH /api/v1/websites/:websiteId/leads/:leadId/status`
- `GET /api/v1/websites/:websiteId/insights/summary`
- `GET /api/v1/websites/:websiteId/insights/top-pages`
- `GET /api/v1/websites/:websiteId/insights/top-sections`
- `GET /api/v1/websites/:websiteId/insights/top-ctas`
- `GET /api/v1/websites/:websiteId/insights/top-services`
- `GET /api/v1/websites/:websiteId/insights/top-portfolios`
- `GET /api/v1/websites/:websiteId/insights/traffic-sources`

## Response Contract

Sukses:

```json
{
  "data": {},
  "message": "..."
}
```

Error:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```
