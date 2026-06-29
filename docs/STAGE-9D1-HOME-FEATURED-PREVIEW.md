# Stage 9D.1 — Home Featured Service & Portfolio Preview

Stage 9D.1 memperketat aturan tampilan preview di halaman Home.

## Contract

- `home.service_preview` hanya mengambil service unggulan.
- `home.portfolio_preview` hanya mengambil portfolio unggulan.
- Masing-masing maksimal 3 item.
- Sorting menggunakan `featuredOrder` ascending.
- Fallback sorting menggunakan `sortOrder` ascending.

## Tidak Diubah

- Halaman `/services` tetap memakai daftar layanan.
- Halaman `/portfolio` tetap memakai daftar portfolio.
- Backend schema/API tidak berubah.
- Dashboard form tidak berubah.
