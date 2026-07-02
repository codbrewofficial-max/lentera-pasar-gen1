# Frontend Integration Notes

Stage 4 fokus pada backend source of truth website structure, Articles SEO Basic, dan internal owner alignment. Backend masih MVP managed platform, belum SaaS penuh.

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

Error code yang perlu ditangani UI: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INVALID_CREDENTIALS`, `INVALID_WEBSITE_TYPE`, `INVALID_PAGE_KEY`, `INVALID_SLOT_KEY`, `INVALID_TEMPLATE_SECTION`, `INVALID_TRACKING_KEY`, `WEBSITE_NOT_PUBLISHED`, `INTERNAL_ERROR`,`ACCOUNT_NON_ACTIVE`, `ACCOUNT_SUSPENDED`, `ACCOUNT_BANNED`,`ACCOUNT_BLACKLISTED`, `WEBSITE_UNAVAILABLE`,`OWNER_NOT_FOUND`,`WEBSITE_NOT_FOUND`,`PUBLIC_REGISTRATION_DISABLED`, `SELF_SERVICE_WEBSITE_DISABLED`.

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
- Articles: `GET/POST /websites/:websiteId/articles`
- Article Detail: `GET/PATCH/DELETE /websites/:websiteId/articles/:articleId`
- Top Articles: `GET /websites/:websiteId/insights/top-articles`
- Internal Create Website for Owner: `POST /internal/owners/:ownerId/websites`
- Internal Set Primary Website: `PATCH /internal/owners/:ownerId/primary-website`

## Site Renderer Route Mapping

- Home: `GET /public/sites/:slug`
- Page: `GET /public/sites/:slug/pages/:pageSlug`
- Tracking: `POST /public/tracking/events`
- Contact: `POST /public/sites/:slug/contact`
- Articles: `GET /public/sites/:slug/articles`
- Article Detail: `GET /public/sites/:slug/articles/:articleSlug`

## Company Profile Structure

Company Profile sekarang terdiri dari 7 pages dan 33 section slots. Pages:

- `home`
- `about`
- `services`
- `portfolio`
- `articles`
- `article_detail`
- `contact`

`article_detail` adalah dynamic detail page dan tidak perlu masuk navigation listing biasa. Slot key selalu format `page.section`.

## Dynamic Form Notes

Template field types yang didukung:

- `text`
- `textarea`
- `image_url`
- `url`

Dashboard boleh menampilkan label teknis seperti `slotKey` dan `schema` hanya untuk developer tools. UI owner sebaiknya memakai `slotLabel`, `slotDescription`, `pageLabel`, `statusLabel`, dan `websiteTypeLabel`.

Template section memiliki status `draft`, `active`, atau `invalid`. Owner selection hanya memakai template `active`; internal library dapat memakai `includeDraft=true`.

Tracking event tambahan: `article_view`.

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
