# Stage 9D — Featured Content + Owner Branding

## Tujuan

Melengkapi MVP dengan kontrol konten unggulan dan identitas visual owner bisnis.

## Isi patch

- `BusinessProfile.logoUrl` dan `BusinessProfile.logoAlt`
- `Service.isFeatured` dan `Service.featuredOrder`
- `Portfolio.isFeatured` dan `Portfolio.featuredOrder`
- `Article.isFeatured` dan `Article.featuredOrder`
- Dashboard profil bisnis bisa isi URL logo dari Media Library
- Dashboard layanan/portfolio/artikel bisa tandai item sebagai unggulan
- Public renderer mendahulukan item unggulan
- Navbar/footer public renderer menampilkan logo bisnis jika tersedia

## Apply

Copy/replace file dari patch ke project.

## Commands

```powershell
corepack pnpm prisma:validate
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
corepack pnpm build:api
corepack pnpm smoke:api
corepack pnpm --filter lentera-pasar-dashboard build
corepack pnpm --filter @lentera-pasar/site-renderer build
```

## Manual QA

1. Buka Media Library dan upload logo.
2. Copy URL media.
3. Buka Profil Bisnis dan tempel URL ke field Logo Bisnis.
4. Isi Alt Text Logo dan simpan.
5. Buka Layanan, tandai salah satu sebagai unggulan, isi urutan unggulan.
6. Buka Portfolio, tandai salah satu sebagai unggulan.
7. Buka Artikel, tandai salah satu artikel published sebagai unggulan.
8. Buka public website dan cek navbar/footer menampilkan logo.
9. Cek section layanan/portfolio/artikel mendahulukan item unggulan.
