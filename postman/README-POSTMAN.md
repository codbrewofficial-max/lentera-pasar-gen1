# Lentera Pasar Postman Pack

Import dua file berikut ke Postman:

1. `Lentera-Pasar-API-MVP.postman_collection.json`
2. `Lentera-Pasar-Local.postman_environment.json`

## Urutan cepat manual QA

1. Jalankan API di `http://localhost:4000/api/v1`.
2. Import collection dan environment.
3. Pilih environment `Lentera Pasar Local`.
4. Jalankan request `01 - Auth / Login Internal Admin`.
5. Jalankan request `01 - Auth / Login Owner`.
6. Jika sudah punya website manual, isi variable `websiteId`, `websiteSlug`, dan `trackingKey` dari response `List My Websites` atau `Get Website Detail`.
7. Untuk upload template pack, buka request `06 - Template Packs & Sections / Import Template Pack ZIP`, lalu pilih file ZIP manual di field form-data `file`.
8. Untuk public API, pastikan website sudah `published`.

## Catatan

- Request `Publish Website` sengaja tidak memakai body agar tidak memicu error Fastify empty JSON body.
- Request delete bisa menghapus data test. Jalankan dengan hati-hati.
- Variable ID akan otomatis terisi dari beberapa response lewat test script Postman.
