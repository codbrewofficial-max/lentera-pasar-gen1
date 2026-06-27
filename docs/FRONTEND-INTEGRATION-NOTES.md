# Frontend Integration Notes

Stage 3 fokus pada frontend readiness untuk `apps/dashboard` dan `apps/site-renderer`. Backend masih MVP managed platform, belum SaaS penuh.

## Base URL

Development default:

```txt
http://localhost:4000/api/v1
```

Dashboard menyimpan JWT dari login dan mengirim:

```http
Authorization: Bearer <jwt>
```

Site renderer public page, tracking, dan contact submit tidak memakai JWT.

## Response Handling

Selalu baca:

```ts
response.data
response.message
```

Untuk error:

```ts
error.error.code
error.error.message
error.error.details
```

Error code yang perlu ditangani UI: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INVALID_CREDENTIALS`, `INVALID_WEBSITE_TYPE`, `INVALID_PAGE_KEY`, `INVALID_SLOT_KEY`, `INVALID_TEMPLATE_SECTION`, `INVALID_TRACKING_KEY`, `WEBSITE_NOT_PUBLISHED`, `INTERNAL_ERROR`.

## Dashboard Route Mapping

- Website Saya: `GET /websites`
- Buat Website: `POST /websites`
- Detail Website: `GET /websites/:websiteId`
- Halaman: `GET /websites/:websiteId/pages`
- Detail Halaman: `GET /websites/:websiteId/pages/:pageKey`
- Bagian Website: `GET /websites/:websiteId/sections/:slotKey`
- Pilih Tampilan Section: `GET /template-sections/by-slot/:slotKey`
- Isi Konten: `PATCH /websites/:websiteId/sections/:slotKey/content`
- Preview Website: `GET /websites/:websiteId/preview/pages/:pageKey`
- Aktifkan Website: `POST /websites/:websiteId/publish`
- Lead Masuk: `GET /websites/:websiteId/leads/recent`
- Insight Pengunjung: `GET /websites/:websiteId/insights/summary`

## Site Renderer Route Mapping

- Home: `GET /public/sites/:slug`
- Page: `GET /public/sites/:slug/pages/:pageSlug`
- Tracking: `POST /public/tracking/events`
- Contact: `POST /public/sites/:slug/contact`

## Dynamic Form Notes

Template field types yang didukung:

- `text`
- `textarea`
- `image_url`
- `url`

Dashboard boleh menampilkan label teknis seperti `slotKey` dan `schema` hanya untuk developer tools. UI owner sebaiknya memakai `slotLabel`, `slotDescription`, `pageLabel`, `statusLabel`, dan `websiteTypeLabel`.

## Suggested Owner UI Terms

Gunakan:

- Website Saya
- Halaman
- Bagian Website
- Pilih Tampilan Section
- Isi Konten
- Preview Website
- Aktifkan Website
- Insight Pengunjung
- Lead Masuk

Hindari untuk owner:

- registry
- manifest
- schema
- binding
- tenant
- slot registry

## Seed Accounts

- Internal admin: `internal@lenterapasar.test` / `password123`
- Owner demo: `owner@lenterapasar.test` / `password123`

Seed website public:

```txt
lentera-demo
```
