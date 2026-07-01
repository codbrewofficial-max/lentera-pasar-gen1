# Stage 9C Polish Fix — Sidebar, Category Slug, Media Upload, Hydration

Patch ini memperbaiki empat temuan setelah Stage 9C:

1. Sidebar `Kelola Website` dibuat lebih mudah dibaca seperti ringkasan dokumen.
2. Slug kategori artikel/portfolio otomatis mengikuti nama kategori penuh, bukan hanya huruf/ketikan awal.
3. Media Library dibuat lebih informatif dan upload multipart backend dibuat lebih aman.
4. Hydration mismatch utama di dashboard diperbaiki dengan tidak membaca `localStorage` saat initial render; site-renderer footer year diberi hydration guard.

## File yang diganti

```text
apps/api/src/server.ts
apps/dashboard/components/DashboardLayout.tsx
apps/dashboard/app/websites/[websiteId]/content/article-categories/page.tsx
apps/dashboard/app/websites/[websiteId]/content/portfolio-categories/page.tsx
apps/dashboard/app/websites/[websiteId]/content/media/page.tsx
apps/dashboard/app/websites/[websiteId]/content/portfolio/page.tsx
apps/site-renderer/components/layout/SiteShell.tsx
```

## Setelah copy/replace

```powershell
corepack pnpm build:api
corepack pnpm smoke:api
corepack pnpm --filter lentera-pasar-dashboard build
corepack pnpm --filter @lentera-pasar/site-renderer build
```

## QA manual

1. Buka salah satu website owner, cek sidebar `Kelola Website` sudah dikelompokkan menjadi poin 1-5.
2. Tambah/edit kategori artikel, ketik nama panjang seperti `Berita Komunitas LabKerKomIT`, slug harus menjadi `berita-komunitas-labkerkomit`.
3. Tambah/edit kategori portfolio, slug juga harus mengikuti nama penuh.
4. Buka Media Library, upload JPG/PNG/WEBP/GIF ukuran < 5 MB.
5. Pastikan preview gambar tampil, Copy URL berhasil, dan tidak ada 500 di POST `/media`.
6. Reload dashboard dan site-renderer, cek hydration warning berkurang/hilang.

## Catatan media upload di deployment

File media disimpan di:

```text
apps/api/storage/uploads/sites/:websiteId
```

Saat Docker/deployment, folder tersebut harus dibuat volume agar file tidak hilang ketika container rebuild.
