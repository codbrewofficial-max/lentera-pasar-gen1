# Stage 9C — Content Management Completion

Stage ini melengkapi modul konten dasar sebelum public testing lebih luas.

## Modul yang ditambahkan

- FAQ CRUD
- Media Library upload/list/delete
- Article Categories CRUD
- Portfolio Categories CRUD
- Relasi Article → ArticleCategory
- Relasi Portfolio → PortfolioCategory
- Public page payload membawa FAQ dan kategori sebagai data section

## Endpoint baru

### FAQ

- `GET /api/v1/websites/:websiteId/faqs`
- `POST /api/v1/websites/:websiteId/faqs`
- `PATCH /api/v1/websites/:websiteId/faqs/:faqId`
- `DELETE /api/v1/websites/:websiteId/faqs/:faqId`

Payload:

```json
{
  "question": "Berapa lama prosesnya?",
  "answer": "Proses bergantung kebutuhan.",
  "pageKey": "services",
  "sortOrder": 1,
  "isActive": true
}
```

### Article Categories

- `GET /api/v1/websites/:websiteId/article-categories`
- `POST /api/v1/websites/:websiteId/article-categories`
- `PATCH /api/v1/websites/:websiteId/article-categories/:articleCategoryId`
- `DELETE /api/v1/websites/:websiteId/article-categories/:articleCategoryId`

### Portfolio Categories

- `GET /api/v1/websites/:websiteId/portfolio-categories`
- `POST /api/v1/websites/:websiteId/portfolio-categories`
- `PATCH /api/v1/websites/:websiteId/portfolio-categories/:portfolioCategoryId`
- `DELETE /api/v1/websites/:websiteId/portfolio-categories/:portfolioCategoryId`

Category payload:

```json
{
  "name": "Kegiatan",
  "slug": "kegiatan",
  "description": "Dokumentasi kegiatan utama.",
  "sortOrder": 1,
  "isActive": true
}
```

### Media Library

- `GET /api/v1/websites/:websiteId/media`
- `POST /api/v1/websites/:websiteId/media`
- `PATCH /api/v1/websites/:websiteId/media/:mediaId`
- `DELETE /api/v1/websites/:websiteId/media/:mediaId`
- `GET /api/v1/public/media/:mediaId`

Upload memakai `multipart/form-data`:

- `file`: image JPG/PNG/WEBP/GIF
- `altText`: optional

Media disimpan lokal di:

```text
apps/api/storage/uploads/sites/:websiteId
```

URL publik media berbentuk:

```text
/api/v1/public/media/:mediaId
```

## Dashboard route baru

- `/websites/[websiteId]/content/faq`
- `/websites/[websiteId]/content/media`
- `/websites/[websiteId]/content/article-categories`
- `/websites/[websiteId]/content/portfolio-categories`

## Catatan storage

Untuk MVP, Media Library memakai local filesystem. Saat deploy dengan Docker, folder berikut harus dipersist sebagai volume:

```text
apps/api/storage/uploads
```

Jika tidak, file upload bisa hilang ketika container rebuild.

## Verifikasi

```powershell
corepack pnpm prisma:validate
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
corepack pnpm build:api
corepack pnpm smoke:api
corepack pnpm --filter lentera-pasar-dashboard build
```

## Manual QA

1. Login owner.
2. Buka menu FAQ, tambah/edit/delete FAQ.
3. Buka Article Categories, tambah kategori.
4. Buat/edit artikel dan pilih kategori.
5. Buka Portfolio Categories, tambah kategori.
6. Buat/edit portfolio dan pilih kategori.
7. Buka Media Library, upload gambar.
8. Copy URL media, pakai di artikel/portfolio.
9. Cek public site tetap tampil.
