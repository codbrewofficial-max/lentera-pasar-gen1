# Stage 9B — Dashboard UX Inputs + Brand Identity

Status: patch manual copy-paste.

## Tujuan

Stage ini merapikan pengalaman dashboard sebelum public testing:

- Field boolean tidak lagi memaksa owner mengetik `true` / `false`.
- Area deskripsi/konten panjang memakai textarea yang lebih nyaman.
- Dashboard memakai identitas warna LabKerKomIT Community.
- Branding LabKerKomIT Community muncul di login dan shell dashboard.

## Brand Color

Warna utama:

- Primary 1: `#649FF6`
- Primary 2: `#F56B71`
- Primary 3: `#B283AF`

Implementasi awal:

- CSS variable di `apps/dashboard/app/globals.css`
- Brand mark gradient di `components/brand/BrandMark.tsx`
- Signature LabKerKomIT di sidebar/dashboard drawer
- Warna fokus/button utama pada halaman yang disentuh Stage 9B

## Komponen Baru

### `BooleanRadio`

Path:

```text
apps/dashboard/components/ui/BooleanRadio.tsx
```

Dipakai untuk mengganti checkbox/true-false menjadi pilihan:

```text
Ya / Tidak
```

### `EnhancedTextarea`

Path:

```text
apps/dashboard/components/ui/EnhancedTextarea.tsx
```

Fitur:

- lebih nyaman untuk deskripsi panjang
- counter karakter
- counter paragraf
- helper text
- min rows configurable

### `BrandMark` dan `BrandSignature`

Path:

```text
apps/dashboard/components/brand/BrandMark.tsx
apps/dashboard/components/brand/BrandSignature.tsx
```

Dipakai untuk branding dashboard.

## File yang Diubah

- `apps/dashboard/app/globals.css`
- `apps/dashboard/app/login/page.tsx`
- `apps/dashboard/components/DashboardLayout.tsx`
- `apps/dashboard/app/websites/[websiteId]/profile/page.tsx`
- `apps/dashboard/app/websites/[websiteId]/page-setup/page.tsx`
- `apps/dashboard/app/websites/[websiteId]/sections/[slotKey]/edit/page.tsx`
- `apps/dashboard/app/websites/[websiteId]/content/services/page.tsx`
- `apps/dashboard/app/websites/[websiteId]/content/portfolio/page.tsx`
- `apps/dashboard/app/websites/[websiteId]/content/testimonials/page.tsx`
- `apps/dashboard/app/websites/[websiteId]/content/brands/page.tsx`
- `apps/dashboard/app/websites/[websiteId]/content/articles/page.tsx`

## Verifikasi

Jalankan:

```powershell
corepack pnpm --filter lentera-pasar-dashboard build
```

Manual QA:

1. Login dashboard.
2. Pastikan branding LabKerKomIT muncul di login dan sidebar.
3. Buka Profil Bisnis, cek field deskripsi/misi/sejarah/alamat.
4. Buka Halaman & Menu, cek Ya/Tidak untuk publish/navbar/footer.
5. Buka edit section yang punya field `show...`, pastikan tampil sebagai Ya/Tidak.
6. Buka CRUD layanan/portfolio/testimoni/brand, cek status tampil sebagai Ya/Tidak.
7. Buka artikel, cek excerpt/content/SEO description lebih nyaman diisi.
