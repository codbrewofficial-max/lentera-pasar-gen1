# API Contract Dashboard

Dashboard memakai JSON API dari `http://localhost:4000/api/v1`. Semua endpoint authenticated memakai header:

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

Response sukses selalu:

```json
{ "data": {}, "message": "..." }
```

Response error selalu:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {},
    "requestId": "req-xxx"
  }
}
```

Endpoint yang dibatasi rate limit (semua endpoint `/auth/*`, upload, tracking, contact) mengembalikan bentuk error yang sama dengan `code: "RATE_LIMIT_EXCEEDED"` dan status `429` kalau limit terlampaui.

## Role User

Ada 3 role, urutannya dari akses paling luas ke paling sempit:

- `internal_admin` — tim internal Lentera Pasar. Akses semua website, kelola owner, template pack, audit log.
- `owner_admin` — pemilik bisnis/website. Akses website milik sendiri saja. **Akun ini hanya bisa dibuat oleh `internal_admin`** lewat `POST /internal/owners`, bukan lewat registrasi publik.
- `user` — akun publik biasa hasil registrasi mandiri (`POST /auth/register`). Belum ada akses ke pengelolaan website. Role ini dasar buat fitur konsumen yang akan menyusul.

Akun pertama yang pernah register di sistem (`count === 0`) otomatis jadi `internal_admin` untuk bootstrap — ini satu-satunya pengecualian, dan langsung dianggap terverifikasi emailnya.

## Auth Flow

### Register (akun publik, role `user`)

```http
POST /api/v1/auth/register
```

```json
{
  "name": "Nama Pengguna",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "user", "emailVerifiedAt": null },
    "token": "jwt...",
    "debugVerificationToken": "verify_xxx"
  },
  "message": "Registered"
}
```

`debugVerificationToken` **hanya muncul kalau `APP_MODE` bukan `production`/`deployment`**. Di production, token asli hanya dikirim lewat email — kalau `SMTP_HOST` belum di-set, email cuma tercatat di log server (tidak benar-benar terkirim), jadi jangan andalkan registrasi publik di production sebelum SMTP dikonfigurasi.

### Login

```http
POST /api/v1/auth/login
```

```json
{ "email": "owner@lenterapasar.test", "password": "password123" }
```

Simpan `data.token`, lalu panggil:

```http
GET /api/v1/auth/me
```

### Verifikasi Email

```http
POST /api/v1/auth/verify-email
```

```json
{ "token": "verify_xxx" }
```

Token kedaluwarsa 24 jam. Token salah/kedaluwarsa balas `400 INVALID_OR_EXPIRED_TOKEN`.

```http
POST /api/v1/auth/resend-verification
```

Perlu `Authorization: Bearer <jwt>` milik akun yang mau diverifikasi. Kalau akun sudah terverifikasi, balas `data: true` tanpa mengirim email lagi. Kalau belum, balas token verifikasi baru di `data.debugVerificationToken` (non-production saja).

### Lupa & Reset Password

```http
POST /api/v1/auth/forgot-password
```

```json
{ "email": "user@example.com" }
```

**Selalu balas sukses generik** (`"Kalau email terdaftar, instruksi reset password sudah dikirim"`) baik email terdaftar maupun tidak — ini disengaja untuk mencegah orang menebak-nebak email mana yang terdaftar. Kalau email memang ada, `data.debugResetToken` ikut terisi (non-production saja).

```http
POST /api/v1/auth/reset-password
```

```json
{ "token": "reset_xxx", "password": "passwordBaru123" }
```

Token kedaluwarsa 1 jam. Token salah/kedaluwarsa balas `400 INVALID_OR_EXPIRED_TOKEN`.

## Website Saya

```http
GET /api/v1/websites
```

Item website siap dipakai card/list dashboard:

```json
{
  "id": "website_id",
  "name": "Lentera Demo Company",
  "slug": "lentera-demo",
  "websiteType": "company_profile",
  "websiteTypeLabel": "Company Profile",
  "status": "published",
  "statusLabel": "Published",
  "trackingKey": "trk_xxx",
  "publicUrl": "/lentera-demo",
  "previewPath": "/websites/website_id/preview/pages/home",
  "createdAt": "2026-06-27T00:00:00.000Z",
  "updatedAt": "2026-06-27T00:00:00.000Z"
}
```

```http
POST /api/v1/websites
```

```json
{
  "name": "PT Lentera Demo",
  "slug": "lentera-demo",
  "websiteType": "company_profile"
}
```

## Halaman

```http
GET /api/v1/websites/:websiteId/pages
```

Company Profile sekarang memakai 7 halaman dan 33 section slots sebagai source of truth:

- `home`, `about`, `services`, `portfolio`, `articles`, `article_detail`, `contact`
- `article_detail` dan `portfolio_detail` adalah dynamic detail page (response page list menyertakan `isDynamicDetailPage: true` untuk `article_detail`; `portfolio_detail` dibangun otomatis dari data portfolio kalau belum ada template terpasang — lihat bagian Portfolio di bawah).
- `slotKey` selalu format `page.section`, contoh `home.hero`, `articles.article_hero`, `article_detail.article_content`, `contact.contact_cta`.

```json
{
  "pageKey": "home",
  "title": "Home",
  "slug": "",
  "pageLabel": "Home",
  "isDynamicDetailPage": false,
  "sectionCount": 6,
  "filledSectionCount": 2,
  "isActive": true
}
```

```http
GET /api/v1/websites/:websiteId/pages/:pageKey
```

Section item:

```json
{
  "id": "section_id",
  "slotKey": "home.hero",
  "slotLabel": "Hero",
  "slotDescription": "Bagian pembuka utama website.",
  "sortOrder": 1,
  "isVisible": true,
  "hasTemplate": true,
  "hasContent": true,
  "templateSection": {
    "id": "template_id",
    "sectionKey": "hero-clean",
    "name": "Hero Clean",
    "component": "CompanyProfileCleanHomeHero",
    "variant": "clean",
    "schema": [],
    "defaultContent": {}
  },
  "contentJson": {},
  "effectiveContent": {},
  "actions": {
    "chooseTemplatePath": "/websites/website_id/sections/home.hero/choose",
    "editContentPath": "/websites/website_id/sections/home.hero/edit"
  }
}
```

## Pilih Tampilan Section

```http
GET /api/v1/template-sections?websiteType=company_profile&slotKey=home.hero
GET /api/v1/template-sections/by-slot/home.hero
```

Template item:

```json
{
  "id": "template_id",
  "sectionKey": "hero-clean",
  "slotKey": "home.hero",
  "slotLabel": "Hero",
  "websiteType": "company_profile",
  "websiteTypeLabel": "Company Profile",
  "name": "Hero Clean",
  "component": "CompanyProfileCleanHomeHero",
  "variant": "clean",
  "schema": [
    {
      "key": "title",
      "label": "Judul Utama",
      "type": "text",
      "required": false,
      "placeholder": null,
      "helpText": null
    }
  ],
  "defaultContent": {
    "title": "Hero Clean"
  }
}
```

Field type yang didukung: `text`, `textarea`, `image_url`, `url`.

## Isi Konten

```http
GET /api/v1/websites/:websiteId/sections/:slotKey
PATCH /api/v1/websites/:websiteId/sections/:slotKey/template
PATCH /api/v1/websites/:websiteId/sections/:slotKey/content
PATCH /api/v1/websites/:websiteId/sections/:slotKey/visibility
```

`effectiveContent` adalah merge dari `templateSection.defaultContent` dan `contentJson`, jadi form dashboard bisa langsung memakai nilai itu.

## Business Profile

```http
GET /api/v1/websites/:websiteId/business-profile
PUT /api/v1/websites/:websiteId/business-profile
```

## Services, Portfolio, Testimonials, Brand Partners

Pola CRUD sama untuk keempatnya:

```http
GET    /api/v1/websites/:websiteId/{services|portfolios|testimonials|brand-partners}
POST   /api/v1/websites/:websiteId/{services|portfolios|testimonials|brand-partners}
GET    /api/v1/websites/:websiteId/{services|portfolios|testimonials|brand-partners}/:id
PATCH  /api/v1/websites/:websiteId/{services|portfolios|testimonials|brand-partners}/:id
DELETE /api/v1/websites/:websiteId/{services|portfolios|testimonials|brand-partners}/:id
```

List di-sort `isFeatured desc, featuredOrder asc, sortOrder asc` untuk services & portfolios.

**Portfolio wajib punya `slug`** (unik per website, format kebab-case lowercase — `^[a-z0-9]+(?:-[a-z0-9]+)*$`), dipakai untuk URL detail portfolio publik (`/portfolio/:slug` di site-renderer). Kalau `slug` sudah dipakai portfolio lain di website yang sama, balas `409 PORTFOLIO_SLUG_EXISTS`.

```json
{
  "categoryId": "category_id",
  "title": "Judul Portfolio",
  "slug": "judul-portfolio",
  "description": "Deskripsi",
  "imageUrl": "https://example.com/image.jpg",
  "sortOrder": 1,
  "isFeatured": false,
  "isActive": true
}
```

## FAQ

```http
GET    /api/v1/websites/:websiteId/faqs
POST   /api/v1/websites/:websiteId/faqs
PATCH  /api/v1/websites/:websiteId/faqs/:faqId
DELETE /api/v1/websites/:websiteId/faqs/:faqId
```

```json
{
  "question": "Pertanyaan?",
  "answer": "Jawaban.",
  "pageKey": "services",
  "sortOrder": 1,
  "isActive": true
}
```

Tidak ada `GET :faqId` tersendiri — ambil dari `GET /faqs` (list).

## Kategori Artikel & Portfolio

```http
GET    /api/v1/websites/:websiteId/{article-categories|portfolio-categories}
POST   /api/v1/websites/:websiteId/{article-categories|portfolio-categories}
PATCH  /api/v1/websites/:websiteId/{article-categories|portfolio-categories}/:id
DELETE /api/v1/websites/:websiteId/{article-categories|portfolio-categories}/:id
```

```json
{
  "name": "Nama Kategori",
  "slug": "nama-kategori",
  "description": "Deskripsi",
  "sortOrder": 1,
  "isActive": true
}
```

`slug` wajib unik per website per jenis kategori (409 `CATEGORY_SLUG_EXISTS` kalau bentrok). Tidak ada `GET :id` tersendiri, sama seperti FAQ.

## Timeline & Team Members

```http
GET    /api/v1/websites/:websiteId/timelines
POST   /api/v1/websites/:websiteId/timelines
GET    /api/v1/websites/:websiteId/timelines/:timelineId
PATCH  /api/v1/websites/:websiteId/timelines/:timelineId
DELETE /api/v1/websites/:websiteId/timelines/:timelineId

GET    /api/v1/websites/:websiteId/team-members
POST   /api/v1/websites/:websiteId/team-members
GET    /api/v1/websites/:websiteId/team-members/:teamMemberId
PATCH  /api/v1/websites/:websiteId/team-members/:teamMemberId
DELETE /api/v1/websites/:websiteId/team-members/:teamMemberId
```

Timeline:

```json
{ "year": "2026", "title": "Milestone", "description": "Deskripsi", "sortOrder": 1, "isActive": true }
```

Team member:

```json
{ "name": "Nama", "role": "Jabatan", "bio": "Bio singkat", "imageUrl": "https://example.com/photo.jpg", "sortOrder": 1, "isActive": true }
```

Keduanya balas row Prisma langsung (bukan contract terpisah), jadi field response = field body + `id`, `websiteId`, `createdAt`, `updatedAt`.

## Media Library

```http
GET    /api/v1/websites/:websiteId/media
POST   /api/v1/websites/:websiteId/media
PATCH  /api/v1/websites/:websiteId/media/:mediaId
DELETE /api/v1/websites/:websiteId/media/:mediaId
```

Upload pakai `multipart/form-data`, field `file` (gambar) + `altText` (opsional, text). Format yang diterima: JPG, PNG, WEBP, GIF. Maksimal ukuran diatur `TEMPLATE_UPLOAD_MAX_BYTES` (default 5MB).

**Semua gambar yang masuk otomatis dikonversi ke WebP dan di-resize** (lebar maksimal 1600px tanpa upscale gambar kecil, GIF animasi tetap animasinya) sebelum disimpan. `mimeType` di response **selalu** `image/webp` terlepas dari format aslinya waktu upload.

```json
{
  "id": "media_xxx",
  "websiteId": "website_id",
  "filename": "media_xxx.webp",
  "originalName": "foto-asli.jpg",
  "mimeType": "image/webp",
  "sizeBytes": 48213,
  "url": "/api/v1/public/media/media_xxx",
  "altText": "Deskripsi gambar",
  "createdAt": "2026-07-02T00:00:00.000Z",
  "updatedAt": "2026-07-02T00:00:00.000Z"
}
```

Ambil file aslinya (public, tanpa auth): `GET /api/v1/public/media/:mediaId`.

## Leads

```http
GET /api/v1/websites/:websiteId/leads/recent
GET /api/v1/websites/:websiteId/leads
PATCH /api/v1/websites/:websiteId/leads/:leadId/status
```

Lead item:

```json
{
  "id": "lead_id",
  "name": "Budi",
  "email": "budi@example.com",
  "phone": "08123",
  "message": "Saya tertarik.",
  "interest": "Website Company Profile",
  "status": "new",
  "statusLabel": "Baru",
  "sourcePage": "contact",
  "sourcePageLabel": "Contact",
  "sourceSection": "contact.contact_form",
  "sourceSectionLabel": "Form Kontak",
  "createdAt": "2026-06-27T00:00:00.000Z"
}
```

## Articles

```http
GET /api/v1/websites/:websiteId/articles
POST /api/v1/websites/:websiteId/articles
GET /api/v1/websites/:websiteId/articles/:articleId
PATCH /api/v1/websites/:websiteId/articles/:articleId
DELETE /api/v1/websites/:websiteId/articles/:articleId
```

Create/update payload:

```json
{
  "categoryId": "category_id",
  "title": "Judul Artikel",
  "slug": "judul-artikel",
  "excerpt": "Ringkasan artikel",
  "content": "Isi artikel",
  "coverImageUrl": "https://example.com/cover.jpg",
  "seoTitle": "SEO Title",
  "seoDescription": "SEO description",
  "status": "draft",
  "sortOrder": 1
}
```

`status` valid: `draft`, `published`. Saat status berubah ke `published`, `publishedAt` otomatis diisi jika masih kosong.

## Insight Pengunjung

```http
GET /api/v1/websites/:websiteId/insights/summary
GET /api/v1/websites/:websiteId/insights/top-pages
GET /api/v1/websites/:websiteId/insights/top-sections
GET /api/v1/websites/:websiteId/insights/top-ctas
GET /api/v1/websites/:websiteId/insights/top-services
GET /api/v1/websites/:websiteId/insights/top-portfolios
GET /api/v1/websites/:websiteId/insights/top-articles
GET /api/v1/websites/:websiteId/insights/traffic-sources
```

Summary:

```json
{
  "cards": [
    {
      "key": "totalVisitors",
      "label": "Total Visitor",
      "value": 120,
      "helpText": "Jumlah pengunjung unik yang terdeteksi."
    }
  ],
  "highlights": {
    "topPage": {
      "label": "Halaman Paling Sering Dilihat",
      "value": "Services",
      "total": 86
    },
    "topArticle": {
      "label": "Artikel Paling Sering Dibaca",
      "value": "Judul Artikel",
      "total": 12
    }
  }
}
```

## Internal Owner

Internal admin dapat membuat owner dengan kontak WhatsApp:

```http
POST /api/v1/internal/owners
PATCH /api/v1/internal/owners/:ownerId
```

```json
{
  "name": "Owner Demo",
  "email": "owner@example.com",
  "password": "password123",
  "whatsapp": "6281234567890",
  "primaryWebsiteId": "website_id"
}
```

Response owner menyertakan `whatsapp`, `primaryWebsiteId`, `primaryWebsite`, `websitesCount`, dan `createdAt`. Akun yang dibuat lewat endpoint ini selalu berrole `owner_admin` — ini satu-satunya cara membuat akun owner (bukan lewat `POST /auth/register` publik).

Internal admin juga dapat membuat website untuk owner, set primary website, dan sinkronisasi ulang struktur halaman/section website (berguna kalau ada page/slot baru yang ditambahkan sistem setelah website dibuat):

```http
POST /api/v1/internal/owners/:ownerId/websites
PATCH /api/v1/internal/owners/:ownerId/primary-website
POST /api/v1/internal/websites/:websiteId/sync-structure
```

## Template Section Status

Template section punya status `draft`, `active`, atau `invalid`. Owner selection hanya melihat template `active`.

```http
GET /api/v1/template-sections?websiteType=company_profile&slotKey=home.hero
GET /api/v1/template-sections?websiteType=company_profile&includeDraft=true
```

`includeDraft=true` hanya berlaku untuk `internal_admin`. Response item menyertakan `pageKey`, `pageLabel`, `status`, `statusLabel`, dan `validationErrors`.

## Audit Logs (Internal Only)

```http
GET /api/v1/internal/audit-logs?limit=20&page=1&category=security&action=auth.login_failed&websiteId=...&actorUserId=...&entityType=...&q=keyword
GET /api/v1/internal/audit-logs/summary
```

Hanya `internal_admin`. `limit` maksimal 100, default 50. `q` mencari di `action`, `summary`, `entityType`, `actorRole` (case-insensitive).

List response:

```json
{
  "items": [
    {
      "id": "log_id",
      "category": "security",
      "action": "auth.login_failed",
      "actorUserId": null,
      "actorRole": null,
      "actor": null,
      "websiteId": null,
      "website": null,
      "entityType": "auth",
      "entityId": null,
      "summary": "Failed login attempt",
      "metadata": { "email": "someone@example.com" },
      "ipHash": "abc123...",
      "userAgent": "Mozilla/5.0...",
      "requestId": "req-xxx",
      "createdAt": "2026-07-02T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 }
}
```

Summary response:

```json
{
  "total": 143,
  "categories": { "security": 40, "audit": 100, "system": 3 },
  "latest": []
}
```

## Istilah UI Owner

Gunakan istilah: Website Saya, Halaman, Bagian Website, Pilih Tampilan Section, Isi Konten, Preview Website, Aktifkan Website, Insight Pengunjung, Lead Masuk.

Hindari istilah UI owner: registry, manifest, schema, binding, tenant, slot registry.