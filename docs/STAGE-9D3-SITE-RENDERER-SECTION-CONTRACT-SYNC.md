# Stage 9D.3 — Site Renderer Section Contract Sync

Stage 9D.3 menyinkronkan renderer publik dengan contract section yang sudah bisa dikelola dari dashboard.

## Perubahan utama

- `services.service_faq` sekarang menampilkan FAQ layanan aktif maksimal 10 item.
- `contact.contact_faq` sekarang menampilkan FAQ kontak aktif maksimal 10 item dan menjadi satu-satunya section contact yang memuat form kontak.
- Testimonial di section trust proof dibatasi maksimal 5 item aktif teratas.
- Dashboard Testimoni menampilkan informasi bahwa website publik hanya memunculkan maksimal 5 testimoni aktif teratas.
- Article card, article detail, dan portfolio card menampilkan badge kategori jika kategori tersedia.
- `portfolio.portfolio_category` menampilkan daftar kategori portfolio aktif.
- Section generic `TextImageSection` dan `PageHeroSection` membaca field gambar umum seperti `imageUrl`, `coverImageUrl`, `heroImageUrl`, `backgroundImageUrl`, `illustrationImageUrl`, `photoUrl`, dan `thumbnailUrl`.
- `article_detail.article_detail_hero` membaca cover image, tanggal publish, dan kategori artikel.
- `article_detail.article_content` membaca setting lebar konten dan ajakan share.
- `article_detail.related_articles` dibatasi 3 item dan backend memprioritaskan artikel berkategori sama.
- `article_detail.article_cta` muncul juga pada fallback renderer detail artikel.
- `contact.contact_information` hanya menampilkan informasi kontak, tanpa form.
- `contact.contact_cta` menjadi CTA block, bukan form kontak.

## Contract tampilan

### FAQ

```text
services.service_faq:
- filter FAQ pageKey=services jika ada
- fallback ke semua FAQ aktif jika tidak ada FAQ services
- maksimal 10 item

contact.contact_faq:
- filter FAQ pageKey=contact jika ada
- fallback ke semua FAQ aktif jika tidak ada FAQ contact
- maksimal 10 item
- memuat form kontak
```

### Testimonial

```text
TrustProofSection:
- maksimal 5 testimonial aktif teratas
- urut sortOrder paling rendah
```

### Article detail

```text
article_detail.article_detail_hero:
- cover image dari article.coverImageUrl
- tanggal dari article.publishedAt
- kategori dari article.category

article_detail.article_content:
- max width dari contentMaxWidth / maxContentWidth / maxWidth / contentWidth / articleWidth / width
- share CTA dari showShareCta / showShare / showShareButton / displayShareCta / enableShareCta / showSharing

article_detail.related_articles:
- maksimal 3 artikel
- backend memprioritaskan kategori yang sama
```

