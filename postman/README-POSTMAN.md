# Lentera Pasar Postman Pack

Import dua file berikut ke Postman:

1. `Lentera-Pasar-API-MVP.postman_collection.json`
2. `Lentera-Pasar-Local.postman_environment.json`

## Urutan cepat manual QA

1. Jalankan API di `http://localhost:4000/api/v1`.
2. Import collection dan environment.
3. Pilih environment `Lentera Pasar Local`.
4. Isi variable `internalApiKey` sesuai `INTERNAL_API_KEY` di `.env` kamu (dipakai request `Health Ready` & `Deployment Health`).
5. Jalankan `01 - Auth / Login Internal Admin`.
6. Jalankan `01 - Auth / Login Owner`.
7. Kalau mau menguji alur user publik (register → verifikasi email → lupa/reset password):
   - Jalankan `01 - Auth / Register New User` — otomatis mengisi `userToken`, `userEmail`, dan `verificationToken` (token verifikasi hanya muncul di response saat backend jalan di mode `development`/`test`, bukan `production`/`deployment`).
   - Jalankan `01 - Auth / Verify Email`.
   - Kalau perlu kirim ulang token verifikasi: `01 - Auth / Resend Verification` (pakai `userToken`).
   - Jalankan `01 - Auth / Forgot Password` — otomatis mengisi `resetToken` (sama, hanya di mode non-production).
   - Jalankan `01 - Auth / Reset Password`.
8. Jika sudah punya website manual, isi variable `websiteId`, `websiteSlug`, dan `trackingKey` dari response `List My Websites` atau `Get Website Detail`.
9. Untuk upload template pack, buka request `06 - Template Packs & Sections / Import Template Pack ZIP`, lalu pilih file ZIP manual di field form-data `file`.
10. Untuk upload media (`07B - Media Library / Upload Media`), pilih file gambar asli (JPG/PNG/WEBP/GIF) di field form-data `file` — backend otomatis convert ke WebP + resize, jadi jangan kaget kalau `mimeType` response selalu `image/webp` walau kamu upload JPG.
11. Untuk cek detail portfolio publik, jalankan `07 - Business Profile & Content CRUD / Create Portfolio` dulu (otomatis mengisi `portfolioId` & `portfolioSlug`), lalu publish website, baru jalankan `09 - Public Site API / Public Portfolio Detail (by slug)`.
12. Untuk public API lainnya, pastikan website sudah `published`.

## Folder baru di collection ini

- `07B - Media Library` — upload/list/update/delete media (hasil upload selalu di-convert ke WebP).
- `07C - FAQ` — CRUD FAQ per website.
- `07D - Categories` — CRUD kategori artikel & kategori portfolio.
- `07E - Timeline & Team Members` — CRUD linimasa bisnis & anggota tim.
- `12 - Audit Logs (Internal)` — daftar & ringkasan audit log, khusus token internal admin.

## Catatan

- Request `Publish Website` sengaja tidak memakai body agar tidak memicu error Fastify empty JSON body.
- Request delete bisa menghapus data test. Jalankan dengan hati-hati.
- Variable ID akan otomatis terisi dari beberapa response lewat test script Postman.
- Registrasi publik (`Register New User`) sekarang **selalu** menghasilkan role `user`, bukan `owner_admin`. Untuk membuat akun owner (pemilik website), pakai `02 - Internal Admin / Create Owner` dengan token internal admin.
- `debugVerificationToken` dan `debugResetToken` di response `Register`/`Resend Verification`/`Forgot Password` **hanya muncul saat backend jalan di mode `development` atau `test`** (`APP_MODE`). Di `production`/`deployment` field ini tidak pernah dikirim — token asli hanya sampai lewat email.
