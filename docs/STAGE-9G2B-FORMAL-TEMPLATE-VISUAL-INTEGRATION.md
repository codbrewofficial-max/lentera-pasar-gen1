# Stage 9G.2B — Formal Company Profile Visual Integration

Stage ini mengintegrasikan hasil Google AI Studio untuk tema **Company Profile Formal** ke `apps/site-renderer`.

## Prinsip

Kode visual Next.js/React masuk dan dibuild di `site-renderer`. Template Pack ZIP tetap hanya berisi JSON config.

Alur:

```text
Template Pack JSON
→ templatePackKey/templateKey company_profile_formal
→ owner pilih section per slot
→ public API mengirim section assignment
→ site-renderer resolver membaca templateKey + slotKey
→ component Formal tampil
```

## Yang Ditambahkan

- Folder renderer formal:
  - `apps/site-renderer/templates/company-profile/formal/shared.tsx`
  - `apps/site-renderer/templates/company-profile/formal/sections/home.tsx`
  - `apps/site-renderer/templates/company-profile/formal/sections/about.tsx`
  - `apps/site-renderer/templates/company-profile/formal/sections/services.tsx`
  - `apps/site-renderer/templates/company-profile/formal/sections/portfolio.tsx`
  - `apps/site-renderer/templates/company-profile/formal/sections/articles.tsx`
  - `apps/site-renderer/templates/company-profile/formal/sections/article-detail.tsx`
  - `apps/site-renderer/templates/company-profile/formal/sections/contact.tsx`

- Mapping 33 slot ke component Formal di `formal/template.ts`.
- `SectionRegistry.tsx` mendaftarkan `formalSectionComponents`.
- Article detail public API sekarang mengirim `articleDetailSections` agar section article detail dari template juga bisa dipakai renderer.

## Catatan Nav Mobile Google AI Studio

Di ZIP Google AI Studio, nav mobile standalone tidak jalan karena `SiteHeader.tsx` memakai effect:

```tsx
useEffect(() => {
  if (isOpen) setTimeout(() => setIsOpen(false), 0);
}, [pathname, isOpen]);
```

Saat tombol menu diklik, `isOpen` berubah menjadi `true`, effect langsung jalan, lalu menu ditutup lagi. Untuk standalone preview, dependency effect harus hanya berdasarkan `pathname` atau pakai `onClick` close pada link.

Di integrasi Lentera Pasar, header Google AI Studio tidak dipakai langsung. Navbar tetap memakai `SiteShell` site-renderer yang sudah ada, sehingga bug mobile nav standalone tidak ikut masuk ke public renderer.

## QA

1. Upload `company-profile-formal-template-pack.zip`.
2. Pilih section Formal pada slot owner.
3. Buka public site.
4. Pastikan section Formal tampil.
5. Cek mobile navbar renderer tetap berjalan.
6. Cek article detail memakai section formal jika `article_detail` slot sudah dipilih dari pack Formal.
