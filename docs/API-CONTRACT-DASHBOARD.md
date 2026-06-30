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
    "details": {}
  }
}
```

## Auth Flow

Login owner:

```http
POST /api/v1/auth/login
```

```json
{
  "email": "owner@lenterapasar.test",
  "password": "password123"
}
```

Simpan `data.token`, lalu panggil:

```http
GET /api/v1/auth/me
```

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
- `article_detail` adalah dynamic detail page dan response page list menyertakan `isDynamicDetailPage: true`.
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

Response owner menyertakan `whatsapp`, `primaryWebsiteId`, `primaryWebsite`, `websitesCount`, dan `createdAt`.

Internal admin juga dapat membuat website untuk owner dan set primary website:

```http
POST /api/v1/internal/owners/:ownerId/websites
PATCH /api/v1/internal/owners/:ownerId/primary-website
```

## Template Section Status

Template section punya status `draft`, `active`, atau `invalid`. Owner selection hanya melihat template `active`.

```http
GET /api/v1/template-sections?websiteType=company_profile&slotKey=home.hero
GET /api/v1/template-sections?websiteType=company_profile&includeDraft=true
```

`includeDraft=true` hanya berlaku untuk `internal_admin`. Response item menyertakan `pageKey`, `pageLabel`, `status`, `statusLabel`, dan `validationErrors`.

## Istilah UI Owner

Gunakan istilah: Website Saya, Halaman, Bagian Website, Pilih Tampilan Section, Isi Konten, Preview Website, Aktifkan Website, Insight Pengunjung, Lead Masuk.

Hindari istilah UI owner: registry, manifest, schema, binding, tenant, slot registry.
