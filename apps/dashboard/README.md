# Lentera Pasar Dashboard

Sistem dashboard manajemen konten dan analitik website untuk merchant UMKM Lentera Pasar.

## Persyaratan Sistem

- Node.js v18 atau v20+
- Backend Lentera Pasar berjalan di `http://localhost:4000/api/v1`

## Konfigurasi Environment

Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000/api/v1"
```

## Cara Instalasi & Menjalankan Aplikasi

1. Pasang dependensi aplikasi:
   ```bash
   npm install
   ```

2. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

3. Buka aplikasi di peramban Anda pada alamat `http://localhost:3000`.

## Akun Demo Pengujian

- **Owner Bisnis**:
  - Email: `owner@lenterapasar.test`
  - Password: `password123`
- **Tim Internal**:
  - Email: `internal@lenterapasar.test`
  - Password: `password123`

## Batasan MVP (Managed Platform)

Lentera Pasar saat ini berada dalam tahap MVP managed platform. Website dapat dipreview dan dipublikasikan untuk demo, sementara fitur hosting production, domain custom, dan paket langganan akan disiapkan pada tahap berikutnya.
