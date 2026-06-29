# Stage 9A.1 — Database Audit Log + Dashboard

Stage ini menambahkan audit log berbasis database untuk event penting yang perlu ditelusuri oleh tim internal.

## Keputusan Penyimpanan Log

Tidak semua log disimpan ke database.

- Technical/request log tetap ke stdout/Docker/Portainer logs.
- Audit/security event penting disimpan ke tabel `AuditLog`.

Ini mencegah database cepat penuh oleh request publik biasa seperti `page_view` dan request renderer.

## Tabel AuditLog

Model menyimpan:

- category: `audit`, `security`, `system`
- action
- actor user jika ada
- website jika relevan
- entity type/id
- summary
- metadataJson
- ipHash
- userAgent
- requestId
- createdAt

## Event yang Dicatat

Contoh event:

- `auth.login_success`
- `auth.login_failed`
- `auth.registered`
- `api_key.invalid`
- `internal.owner_created`
- `internal.owner_updated`
- `internal.owner_website_created`
- `internal.primary_website_updated`
- `website.created`
- `website.updated`
- `website.published`
- `website.unpublished`
- `page_setup.updated`
- `section.template_updated`
- `section.content_updated`
- `section.visibility_updated`
- `template_pack.imported`
- `business_profile.saved`
- `services.created/updated/deleted`
- `portfolios.created/updated/deleted`
- `testimonials.created/updated/deleted`
- `brand-partners.created/updated/deleted`
- `article.created/updated/deleted`
- `lead.status_updated`

Tracking event publik tetap masuk ke `TrackingEvent`, bukan `AuditLog`.

Contact submit tetap masuk ke `Lead`, bukan wajib masuk `AuditLog`.

## Endpoint Internal

### List audit logs

```http
GET /api/v1/internal/audit-logs?limit=50&page=1
Authorization: Bearer <internal_token>
```

Filter:

```text
category=audit|security|system
action=website.published
websiteId=<id>
actorUserId=<id>
entityType=article
q=publish
```

Response:

```json
{
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 0,
      "totalPages": 1
    }
  },
  "message": "Audit logs loaded"
}
```

### Summary

```http
GET /api/v1/internal/audit-logs/summary
Authorization: Bearer <internal_token>
```

## Dashboard

Route baru:

```text
/internal/audit-logs
```

Fitur:

- list audit log
- filter kategori
- filter action
- search
- pagination
- tombol **Refresh Data**
- metadata expandable
- actor/website/entity/request id terlihat

## Apply

Jalankan:

```powershell
corepack pnpm prisma:validate
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
corepack pnpm build:api
corepack pnpm smoke:api
corepack pnpm --filter lentera-pasar-dashboard build
```

## Catatan Reset

`db:reset:keep-users` ikut menghapus `AuditLog` agar database manual QA bisa benar-benar bersih selain user.
