# API Contract Site Renderer

Site renderer memakai public API tanpa JWT:

```http
GET /api/v1/public/sites/:slug
GET /api/v1/public/sites/:slug/pages/:pageSlug
GET /api/v1/public/sites/:slug/articles
GET /api/v1/public/sites/:slug/articles/:articleSlug
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
    "navigation": [
      { "label": "Home", "href": "/lentera-demo" },
      { "label": "About Us", "href": "/lentera-demo/about" },
      { "label": "Blog / Artikel", "href": "/lentera-demo/articles" }
    ],
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
          "component": "HeroSection",
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

Company Profile public structure terdiri dari 7 page source of truth dan 33 section slots. `article_detail` adalah dynamic detail page, jadi tidak dikirim di navigation biasa.

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

Detail response menyertakan `article`, `relatedArticles`, `website`, `businessProfile`, `seo`, dan `trackingKey`. SEO title memakai `article.seoTitle || article.title`; SEO description memakai `article.seoDescription || article.excerpt || businessProfile.description`.

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

Backend menyimpan `ipHash`, bukan raw IP. `metadata` dibatasi ukuran.

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

Submit contact membuat `Lead` dan `TrackingEvent contact_submit`.

## Error Shape

```json
{
  "error": {
    "code": "WEBSITE_NOT_PUBLISHED",
    "message": "Published site not found",
    "details": {}
  }
}
```
