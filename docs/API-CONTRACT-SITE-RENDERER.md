# API Contract Site Renderer

Site renderer memakai public API tanpa JWT:

```http
GET /api/v1/public/sites/:slug
GET /api/v1/public/sites/:slug/pages/:pageSlug
GET /api/v1/public/sites/:slug/articles
GET /api/v1/public/sites/:slug/articles/:articleSlug
GET /api/v1/public/sites/:slug/portfolios/:portfolioId
```

Public API hanya mengembalikan website `published`. Website `draft` mengembalikan error `WEBSITE_NOT_PUBLISHED`.

## Public Page Response

```json
{
  "data": {
    "website": {
      "id": "website_id",
      "name": "Lentera Demo Company",
      "slug": "lentera-demo",
      "websiteType": "company_profile",
      "websiteTypeLabel": "Company Profile",
      "status": "published",
      "trackingKey": "trk_xxx",
      "theme": {}
    },
    "seo": {
      "title": "Lentera Demo Company",
      "description": "Partner digital untuk bisnis yang ingin tampil dipercaya."
    },
    "businessProfile": {},
    "navigation": {
      "navbar": {
        "maxItems": 6,
        "items": [
          { "pageKey": "home", "label": "Home", "slug": "", "path": "/", "sortOrder": 1 },
          { "pageKey": "about", "label": "About Us", "slug": "about", "path": "/about", "sortOrder": 2 }
        ],
        "cta": {
          "label": "Hubungi Kami",
          "targetType": "page",
          "targetPageKey": "contact",
          "path": "/contact"
        }
      },
      "footer": {
        "items": [
          { "pageKey": "home", "label": "Home", "slug": "", "path": "/", "sortOrder": 1 }
        ]
      },
      "availableTargets": [
        { "type": "page", "pageKey": "home", "label": "Halaman Home", "path": "/" },
        { "type": "whatsapp", "label": "WhatsApp Bisnis", "value": "business_whatsapp", "path": "https://wa.me/628123456789" },
        { "type": "custom", "label": "Link Custom", "value": "custom", "path": null }
      ]
    },
    "page": {
      "pageKey": "home",
      "title": "Home",
      "slug": "",
      "sections": [
        {
          "id": "section_id",
          "slotKey": "home.hero",
          "slotLabel": "Hero",
          "sectionKey": "hero-clean",
          "component": "CompanyProfileCleanHomeHero",
          "templateTheme": "formal",
          "variant": "clean",
          "content": {},
          "tracking": {
            "slotKey": "home.hero",
            "sectionKey": "hero-clean"
          },
          "data": {
            "services": [],
            "portfolios": [],
            "testimonials": [],
            "brands": []
          }
        }
      ]
    }
  },
  "message": "Public page loaded"
}
```

Company Profile public structure terdiri dari 7 page source of truth dan 33 section slots. `article_detail` dan `portfolio_detail` adalah dynamic detail page, jadi tidak dikirim di navigation biasa.

`navigation` berbentuk object (`{ navbar: { items, cta }, footer: { items } }}`), bukan array — dipakai langsung oleh `SiteShell` di site-renderer untuk menentukan header/footer tema (Formal/Casual/Premium/Abstract) berdasarkan `templateTheme` yang muncul di salah satu section halaman itu.

## Public Articles

List:

```http
GET /api/v1/public/sites/:slug/articles
```

Item list:

```json
{
  "id": "article_id",
  "title": "Judul Artikel",
  "slug": "judul-artikel",
  "excerpt": "Ringkasan",
  "coverImageUrl": "https://example.com/cover.jpg",
  "seoTitle": "SEO Title",
  "seoDescription": "SEO description",
  "publishedAt": "2026-06-28T00:00:00.000Z"
}
```

Detail:

```http
GET /api/v1/public/sites/:slug/articles/:articleSlug
```

Detail response menyertakan `article`, `relatedArticles`, `articleDetailSections`, `website`, `businessProfile`, `seo`, `trackingKey`, dan `navigation`. SEO title memakai `article.seoTitle || article.title`; SEO description memakai `article.seoDescription || article.excerpt || businessProfile.description`. `relatedArticles` diisi maksimal 3 artikel: prioritas kategori sama, sisanya diisi artikel published lain. Kalau `article_detail` belum punya template terpasang di dashboard, `articleDetailSections` kosong dan site-renderer fallback ke komponen hardcode (`RenderArticleDetail`).

## Public Portfolio Detail

```http
GET /api/v1/public/sites/:slug/portfolios/:portfolioId
```

Meski parameter di URL bernama `:portfolioId`, backend **mencoba resolve sebagai `slug` dulu**, baru fallback ke `id` (cuid) kalau tidak ketemu — jadi endpoint ini bisa dipanggil pakai slug (`/portfolios/profil-konsultan`, cara yang disarankan untuk link publik/SEO) maupun id lama. Hanya portfolio dengan `isActive: true` yang bisa diakses; kalau tidak ketemu balas `404 PORTFOLIO_NOT_FOUND`.

```json
{
  "data": {
    "portfolio": {
      "id": "portfolio_id",
      "websiteId": "website_id",
      "categoryId": "category_id",
      "category": { "id": "category_id", "name": "Konsultasi", "slug": "konsultasi" },
      "title": "Profil Konsultan",
      "slug": "profil-konsultan",
      "description": "Website jasa konsultan.",
      "imageUrl": "https://example.com/portfolio.jpg",
      "sortOrder": 1,
      "isFeatured": false,
      "featuredOrder": 0,
      "isActive": true,
      "createdAt": "2026-07-02T00:00:00.000Z",
      "updatedAt": "2026-07-02T00:00:00.000Z"
    },
    "relatedPortfolios": [],
    "portfolioDetailSections": [],
    "website": {},
    "businessProfile": {},
    "seo": { "title": "Profil Konsultan", "description": "Website jasa konsultan." },
    "trackingKey": "trk_xxx",
    "navigation": {}
  },
  "message": "Public portfolio loaded"
}
```

`relatedPortfolios` diisi maksimal 3 portfolio aktif lain: prioritas kategori sama, sisanya diisi portfolio aktif lain. Sama seperti artikel: kalau `portfolio_detail` belum punya template terpasang di dashboard, `portfolioDetailSections` kosong dan site-renderer fallback ke komponen hardcode (`RenderPortfolioDetail`) supaya halaman tetap tampil lengkap (hero, deskripsi, portfolio terkait, CTA), bukan blank.

Section yang tidak visible tidak dikirim. Section yang belum memilih template juga tidak dikirim agar renderer tidak perlu menebak component.

## Preview API

Preview dipakai dashboard dan wajib JWT:

```http
GET /api/v1/websites/:websiteId/preview/pages/:pageKey
```

Response sama seperti public page, tetapi menambahkan:

```json
{
  "isPreview": true
}
```

Preview boleh untuk website draft selama user adalah owner website atau `internal_admin`.

## Tracking Event

```http
POST /api/v1/public/tracking/events
```

```json
{
  "trackingKey": "trk_xxx",
  "eventName": "page_view",
  "visitorId": "visitor_abc",
  "sessionId": "session_xyz",
  "pageKey": "home",
  "pageSlug": "",
  "slotKey": null,
  "sectionKey": null,
  "objectType": null,
  "objectId": null,
  "ctaKey": null,
  "referrer": "https://google.com",
  "utm": {
    "source": "google",
    "medium": "organic",
    "campaign": null
  },
  "metadata": {}
}
```

Valid event: `page_view`, `section_view`, `cta_click`, `whatsapp_click`, `contact_submit`, `service_view`, `portfolio_view`, `article_view`.

Backend menyimpan `ipHash`, bukan raw IP. `metadata` dibatasi ukuran. `trackingKey` yang tidak valid balas `404 INVALID_TRACKING_KEY`. Endpoint ini dibatasi rate limit (`RATE_LIMIT_TRACKING_MAX`, default 120/menit) — lebih dari itu balas `429 RATE_LIMIT_EXCEEDED`.

## Contact Submit

```http
POST /api/v1/public/sites/:slug/contact
```

```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "phone": "08123456789",
  "message": "Saya tertarik dengan layanan website company profile.",
  "interest": "Website Company Profile",
  "sourcePage": "contact",
  "sourceSection": "contact.contact_form",
  "tracking": {
    "visitorId": "visitor_abc",
    "sessionId": "session_xyz",
    "referrer": "",
    "utm": {}
  }
}
```

Submit contact membuat `Lead` dan `TrackingEvent contact_submit`. Endpoint ini dibatasi rate limit (`RATE_LIMIT_CONTACT_MAX`, default 8/10 menit).

## Error Shape

```json
{
  "error": {
    "code": "WEBSITE_NOT_PUBLISHED",
    "message": "Published site not found",
    "details": {},
    "requestId": "req-xxx"
  }
}
```

Kode error publik yang umum ditemui: `WEBSITE_NOT_PUBLISHED` (404), `ARTICLE_NOT_FOUND` (404), `PORTFOLIO_NOT_FOUND` (404), `INVALID_TRACKING_KEY` (404), `VALIDATION_ERROR` (422), `RATE_LIMIT_EXCEEDED` (429).