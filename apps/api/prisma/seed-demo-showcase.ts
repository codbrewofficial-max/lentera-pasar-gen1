/**
 * Seed script khusus untuk akun DEMO SHOWCASE:
 *   - 4 website Company Profile (tema: formal, casual, premium, abstract)
 *   - 4 website Katalog Produk   (tema: formal, casual, premium, abstract)
 *
 * Setiap website:
 *   - Punya TemplatePack + TemplateSection sendiri per slot (namespace "-demo-showcase-"
 *     supaya TIDAK bentrok dengan TemplatePack produksi yang sudah/akan diimpor dari ZIP asli).
 *   - Semua section (termasuk global.navbar/footer) diisi content — section yang tidak
 *     punya templateSectionId TIDAK tampil di halaman publik (lihat buildPublicPage di
 *     server.ts, filter `.filter(section => section.templateSection)`), jadi setiap slot
 *     WAJIB dapat TemplateSection walau kontennya sederhana.
 *   - CRUD terisi sesuai jumlah yang diminta:
 *       Company Profile : Portfolio 10, Article 10, Service 3, Testimonial 6, FAQ ±6, BrandPartner ±6
 *       Katalog Produk  : Product 10, Banner 5, ValueProposition(USP) 4, FAQ ±6, BrandPartner ±6
 *         (+ Article 6 & ArticleCategory tidak wajib di spesifikasi awal, tapi tetap diisi
 *          supaya halaman Artikel & Blog Hero di Katalog Produk tidak kosong)
 *
 * Cara pakai:
 *   cd apps/api
 *   npx tsx prisma/seed-demo-showcase.ts
 *
 * Aman dijalankan berkali-kali (idempotent): user/website di-upsert, CRUD lama
 * dihapus dulu baru dibuat ulang, TemplatePack/TemplateSection di-upsert by key.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  COMPANY_PROFILE_SECTION_SLOTS,
  COMPANY_PROFILE_SECTION_SLOT_LABELS,
  CATALOG_PRODUCT_SECTION_SLOTS,
  CATALOG_PRODUCT_SECTION_SLOT_LABELS
} from "@lentera-pasar/shared";
import { createWebsiteDefaults } from "../src/defaults.js";
import { hashPassword, randomToken } from "../src/security.js";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo12345!";
type Theme = "formal" | "casual" | "premium" | "abstract";
const THEMES: Theme[] = ["formal", "casual", "premium", "abstract"];

const pascal = (value: string) =>
  value
    .split(/[_.\-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const field = (key: string, label: string, type = "text") => ({ key, label, type });

const STANDARD_SCHEMA = [
  field("badge", "Label Kecil di Atas Judul"),
  field("title", "Judul"),
  field("subtitle", "Deskripsi Singkat", "textarea"),
  field("ctaLabel", "Teks Tombol"),
  field("ctaUrl", "Link Tombol"),
  field("imageUrl", "URL Gambar", "image")
];

// ============================================================================
// PERSONA — profil bisnis fiktif per tema, dipakai untuk BusinessProfile +
// copywriting section. 4 bisnis company_profile berbeda + 4 bisnis catalog_product
// berbeda, masing-masing disesuaikan "rasa" copy-nya dengan identitas visual tema:
//   formal = korporat/profesional, casual = santai anak muda, premium = mewah/elegan,
//   abstract = kreatif/eksperimental.
// ============================================================================
interface Persona {
  theme: Theme;
  slug: string;
  email: string;
  ownerName: string;
  brandName: string;
  tagline: string;
  description: string;
  vision: string;
  mission: string;
  city: string;
  address: string;
  whatsapp: string;
  contactEmail: string;
  instagram?: string;
  timeline: { year: string; title: string; description?: string }[];
  hero: { title: string; subtitle: string; ctaLabel: string };
  listing: { badge: string; title: string; subtitle: string }; // services (CP) / products (Katalog)
  secondary: { badge: string; title: string; subtitle: string }; // portfolio (CP) / value_proposition (Katalog)
  articles: { badge: string; title: string; subtitle: string };
  contact: { badge: string; title: string; subtitle: string };
  finalCta: { badge: string; title: string; subtitle: string; ctaLabel: string };
  faq: { badge: string; title: string; subtitle: string };
  brandTrust: { badge: string; title: string; subtitle: string };
}

const COMPANY_PROFILE_PERSONAS: Record<Theme, Persona> = {
  formal: {
    theme: "formal",
    slug: "demo-formal-company-profile",
    email: "demo.formal.companyprofile@lenterapasar.test",
    ownerName: "Andhika Pratama",
    brandName: "Cahaya Hukum & Rekan",
    tagline: "Kepastian Hukum untuk Setiap Langkah Bisnis Anda",
    description:
      "Cahaya Hukum & Rekan adalah kantor konsultan hukum bisnis yang membantu perusahaan mengurus legalitas, kontrak, perizinan, hingga pendampingan sengketa dengan pendekatan yang jelas dan terukur.",
    vision: "Menjadi mitra hukum tepercaya bagi pelaku usaha di seluruh Indonesia.",
    mission: "Memberikan pendampingan hukum yang jelas, cepat, dan berpihak pada kepentingan client.",
    city: "Jakarta Selatan",
    address: "Jl. Jenderal Sudirman Kav. 45, Jakarta Selatan",
    whatsapp: "6281100000001",
    contactEmail: "halo@cahayahukum.test",
    instagram: "https://instagram.com/cahayahukum.rekan",
    timeline: [
      { year: "2014", title: "Kantor Hukum Didirikan", description: "Memulai praktik dengan fokus pada hukum korporasi." },
      { year: "2019", title: "Ekspansi ke Hukum Kekayaan Intelektual", description: "Menambah lini layanan HKI dan kepatuhan regulasi." },
      { year: "2025", title: "Melayani 200+ Perusahaan", description: "Dipercaya oleh UMKM hingga korporasi menengah di berbagai sektor." }
    ],
    hero: {
      title: "Lindungi Bisnis Anda dengan Fondasi Hukum yang Kokoh",
      subtitle: "Cahaya Hukum & Rekan telah membantu 200+ perusahaan mengurus legalitas, kontrak, dan perizinan tanpa ribet.",
      ctaLabel: "Konsultasi Gratis Sekarang"
    },
    listing: {
      badge: "Layanan Kami",
      title: "Layanan Hukum Menyeluruh untuk Bisnis Anda",
      subtitle: "Dari pendirian PT hingga pendampingan sengketa, tim kami siap menjadi garda hukum bisnis Anda."
    },
    secondary: {
      badge: "Portofolio",
      title: "Rekam Jejak Kepercayaan Client Kami",
      subtitle: "Sebagian kasus dan proyek legal yang telah berhasil kami selesaikan untuk client dari berbagai industri."
    },
    articles: {
      badge: "Wawasan Hukum",
      title: "Wawasan Hukum untuk Pengusaha",
      subtitle: "Artikel praktis seputar legalitas bisnis, kontrak, dan kepatuhan hukum yang wajib diketahui pemilik usaha."
    },
    contact: {
      badge: "Hubungi Kami",
      title: "Konsultasikan Masalah Hukum Anda",
      subtitle: "Tim kami siap merespons dalam 1x24 jam kerja untuk membantu persoalan hukum bisnis Anda."
    },
    finalCta: {
      badge: "Mulai Sekarang",
      title: "Jangan Tunggu Masalah Hukum Membesar",
      subtitle: "Hubungi Cahaya Hukum & Rekan sekarang dan dapatkan sesi konsultasi awal secara gratis.",
      ctaLabel: "Jadwalkan Konsultasi"
    },
    faq: {
      badge: "FAQ",
      title: "Pertanyaan Seputar Layanan Hukum Kami",
      subtitle: "Kumpulan pertanyaan yang paling sering ditanyakan calon client sebelum menggunakan jasa kami."
    },
    brandTrust: {
      badge: "Dipercaya Oleh",
      title: "Perusahaan yang Telah Kami Dampingi",
      subtitle: "Sebagian dari perusahaan dan institusi yang mempercayakan urusan hukumnya kepada kami."
    }
  },
  casual: {
    theme: "casual",
    slug: "demo-casual-company-profile",
    email: "demo.casual.companyprofile@lenterapasar.test",
    ownerName: "Salsa Amelia",
    brandName: "Ruang Kreasi Studio",
    tagline: "Bikin Brand Kamu Makin Standout, Tanpa Ribet",
    description:
      "Ruang Kreasi Studio adalah studio desain kreatif yang bantu UMKM dan startup punya identitas visual yang kece, konsisten, dan gampang diingat orang.",
    vision: "Jadi teman desain nomor satu buat brand-brand lokal yang mau naik kelas.",
    mission: "Bikin proses desain jadi cepat, seru, dan hasilnya tetap profesional.",
    city: "Bandung",
    address: "Jl. Dago No. 88, Bandung",
    whatsapp: "6281100000002",
    contactEmail: "halo@ruangkreasi.test",
    instagram: "https://instagram.com/ruangkreasi.studio",
    timeline: [
      { year: "2020", title: "Mulai dari Freelance", description: "Berawal dari project desain logo untuk teman-teman UMKM." },
      { year: "2022", title: "Resmi Jadi Studio", description: "Membentuk tim kecil untuk melayani lebih banyak brand." },
      { year: "2025", title: "150+ Brand Terbantu", description: "Sudah dipercaya brand lokal dari berbagai kota di Indonesia." }
    ],
    hero: {
      title: "Brand Kece Nggak Harus Mahal & Ribet",
      subtitle: "Ruang Kreasi Studio udah bantu 150+ brand lokal tampil lebih pede lewat desain yang related sama audiensnya.",
      ctaLabel: "Yuk, Ngobrolin Project Kamu"
    },
    listing: {
      badge: "Layanan Kami",
      title: "Semua Kebutuhan Desain, Kami yang Handle",
      subtitle: "Dari logo sampai konten sosmed harian, tim kami siap jadi partner kreatif buat brand kamu."
    },
    secondary: {
      badge: "Portofolio",
      title: "Karya yang Udah Kami Bikin Buat Client",
      subtitle: "Intip beberapa project seru yang udah kelar dan bikin brand client makin dikenal."
    },
    articles: {
      badge: "Cerita Kami",
      title: "Cerita & Tips Seputar Branding",
      subtitle: "Insight ringan biar kamu makin paham dunia desain dan branding tanpa bikin pusing."
    },
    contact: {
      badge: "Say Hi!",
      title: "Cerita Dulu, Yuk!",
      subtitle: "Ceritain kebutuhan brand kamu, kita bantu cariin solusi desain yang paling pas."
    },
    finalCta: {
      badge: "Gaskeun!",
      title: "Udah Siap Bikin Brand Kamu Naik Level?",
      subtitle: "Chat kami sekarang, konsultasi awal gratis tanpa komitmen apapun.",
      ctaLabel: "Chat Sekarang"
    },
    faq: {
      badge: "FAQ",
      title: "FAQ Seputar Proses Desain Kami",
      subtitle: "Biar makin yakin sebelum mulai project bareng kita, cek dulu jawaban dari pertanyaan yang paling sering muncul."
    },
    brandTrust: {
      badge: "Udah Dipercaya",
      title: "Brand yang Udah Kolaborasi Bareng Kami",
      subtitle: "Beberapa brand kece yang udah pernah kerja bareng Ruang Kreasi Studio."
    }
  },
  premium: {
    theme: "premium",
    slug: "demo-premium-company-profile",
    email: "demo.premium.companyprofile@lenterapasar.test",
    ownerName: "Regina Anggraini",
    brandName: "Estetika Interior Living",
    tagline: "Merancang Ruang, Menghadirkan Kemewahan yang Personal",
    description:
      "Estetika Interior Living adalah studio desain interior premium untuk hunian dan ruang komersial kelas atas, menghadirkan detail yang dirancang khusus sesuai karakter pemiliknya.",
    vision: "Menjadi rujukan utama desain interior mewah yang timeless di Indonesia.",
    mission: "Menghadirkan ruang yang mencerminkan karakter dan selera pemiliknya, dengan detail tanpa kompromi.",
    city: "Jakarta",
    address: "Jl. Senopati No. 12, Jakarta Selatan",
    whatsapp: "6281100000003",
    contactEmail: "concierge@estetikaliving.test",
    instagram: "https://instagram.com/estetika.interior",
    timeline: [
      { year: "2016", title: "Studio Didirikan", description: "Berfokus pada desain interior residensial kelas atas." },
      { year: "2021", title: "Merambah Ruang Komersial", description: "Mulai menangani hotel butik dan kantor premium." },
      { year: "2025", title: "80+ Proyek Eksklusif", description: "Dipercaya klien individu maupun korporasi papan atas." }
    ],
    hero: {
      title: "Ruang yang Berbicara Tentang Selera Anda",
      subtitle: "Estetika Interior Living menghadirkan desain interior eksklusif untuk hunian dan ruang usaha premium Anda.",
      ctaLabel: "Ajukan Konsultasi Privat"
    },
    listing: {
      badge: "Layanan Kami",
      title: "Layanan Desain Interior End-to-End",
      subtitle: "Dari konsep hingga instalasi akhir, kami kawal setiap detail dengan presisi tinggi."
    },
    secondary: {
      badge: "Portofolio Pilihan",
      title: "Karya Pilihan Kami",
      subtitle: "Setiap proyek adalah cerminan kemewahan yang dirancang khusus untuk client kami."
    },
    articles: {
      badge: "Jurnal",
      title: "Inspirasi & Tren Desain Interior",
      subtitle: "Wawasan eksklusif seputar gaya hidup dan desain ruang premium."
    },
    contact: {
      badge: "Konsultasi Privat",
      title: "Wujudkan Ruang Impian Anda",
      subtitle: "Jadwalkan sesi konsultasi privat bersama tim desainer interior kami."
    },
    finalCta: {
      badge: "Mulai Perjalanan Anda",
      title: "Ruang Terbaik Anda Dimulai dari Sini",
      subtitle: "Hubungi kami untuk sesi konsultasi desain interior yang dipersonalisasi sepenuhnya.",
      ctaLabel: "Hubungi Desainer Kami"
    },
    faq: {
      badge: "FAQ",
      title: "Pertanyaan yang Sering Diajukan Client Kami",
      subtitle: "Informasi seputar proses kerja, biaya, dan timeline proyek desain interior."
    },
    brandTrust: {
      badge: "Klien Kami",
      title: "Dipercaya Klien & Mitra Pilihan",
      subtitle: "Sebagian klien dan mitra yang telah mempercayakan ruang mereka kepada kami."
    }
  },
  abstract: {
    theme: "abstract",
    slug: "demo-abstract-company-profile",
    email: "demo.abstract.companyprofile@lenterapasar.test",
    ownerName: "Bram Wicaksana",
    brandName: "Nirmana Digital Agency",
    tagline: "Kami Bikin Brand Berani Tampil Beda",
    description:
      "Nirmana Digital Agency adalah creative & digital agency yang membantu brand modern membangun identitas visual dan strategi digital yang eksperimental tapi tetap strategis.",
    vision: "Jadi partner kreatif untuk brand-brand yang berani keluar dari pakem.",
    mission: "Menghadirkan solusi kreatif dan digital yang eksperimental tapi tetap terukur hasilnya.",
    city: "Yogyakarta",
    address: "Jl. Prawirotaman No. 21, Yogyakarta",
    whatsapp: "6281100000004",
    contactEmail: "hello@nirmana.test",
    instagram: "https://instagram.com/nirmana.agency",
    timeline: [
      { year: "2019", title: "Studio Kreatif Terbentuk", description: "Diawali dari kolektif desainer dan developer independen." },
      { year: "2022", title: "Masuk ke Digital Campaign", description: "Memperluas layanan ke strategi kampanye digital." },
      { year: "2025", title: "40+ Brand Kolaborasi", description: "Bekerja sama dengan brand F&B, fashion, hingga teknologi." }
    ],
    hero: {
      title: "Berani Tampil Beda? Kita Cocok.",
      subtitle: "Nirmana Digital Agency membantu brand modern membangun identitas visual dan kampanye digital yang nggak biasa.",
      ctaLabel: "Mulai Kolaborasi"
    },
    listing: {
      badge: "Layanan Kami",
      title: "Layanan Kreatif Lintas Disiplin",
      subtitle: "Branding, digital campaign, sampai motion — kami eksplorasi bareng brand kamu."
    },
    secondary: {
      badge: "Karya Kami",
      title: "Eksperimen Kreatif yang Sudah Kami Wujudkan",
      subtitle: "Kumpulan project yang menantang cara orang melihat sebuah brand."
    },
    articles: {
      badge: "Perspektif",
      title: "Perspektif Kreatif dari Studio Kami",
      subtitle: "Bacaan seputar tren desain, budaya visual, dan strategi digital."
    },
    contact: {
      badge: "Let's Talk",
      title: "Punya Ide Gila? Kita Dengar.",
      subtitle: "Ceritakan visi brand kamu, kita bantu wujudkan lewat pendekatan kreatif yang tidak biasa."
    },
    finalCta: {
      badge: "Waktunya Bergerak",
      title: "Waktunya Brand Kamu Tampil Beda",
      subtitle: "Diskusikan project pertama kamu bersama tim kreatif Nirmana.",
      ctaLabel: "Diskusi Bareng Kami"
    },
    faq: {
      badge: "FAQ",
      title: "Yang Sering Ditanyakan Sebelum Kolaborasi",
      subtitle: "Beberapa hal yang biasanya ditanyakan brand sebelum mulai kerja bareng kami."
    },
    brandTrust: {
      badge: "Kolaborator Kami",
      title: "Brand yang Sudah Berkolaborasi",
      subtitle: "Sebagian brand yang sudah menjelajahi pendekatan kreatif bersama Nirmana."
    }
  }
};

const CATALOG_PRODUCT_PERSONAS: Record<Theme, Persona> = {
  formal: {
    theme: "formal",
    slug: "demo-formal-catalog-produk",
    email: "demo.formal.katalogproduk@lenterapasar.test",
    ownerName: "Hendra Gunawan",
    brandName: "Sumber Elektronik Nusantara",
    tagline: "Partner Tepercaya Pengadaan Elektronik & Peralatan Kantor",
    description:
      "Sumber Elektronik Nusantara adalah distributor resmi produk elektronik dan office equipment untuk kebutuhan bisnis, instansi, dan pengadaan dalam jumlah besar.",
    vision: "Menjadi distributor elektronik B2B paling tepercaya di Indonesia.",
    mission: "Menyediakan produk elektronik berkualitas dengan harga bersaing dan layanan purna jual yang jelas.",
    city: "Jakarta",
    address: "Jl. Gajah Mada No. 100, Jakarta Barat",
    whatsapp: "6281200000001",
    contactEmail: "sales@sumberelektronik.test",
    instagram: "https://instagram.com/sumberelektronik.id",
    timeline: [
      { year: "2012", title: "Mulai Sebagai Toko Elektronik", description: "Berawal dari toko retail elektronik kecil." },
      { year: "2018", title: "Fokus ke Segmen B2B", description: "Beralih fokus melayani pengadaan korporat dan instansi." },
      { year: "2025", title: "500+ Klien Korporat", description: "Dipercaya perusahaan dan instansi pemerintah di seluruh Indonesia." }
    ],
    hero: {
      title: "Solusi Pengadaan Elektronik untuk Bisnis Anda",
      subtitle: "Sumber Elektronik Nusantara melayani pengadaan dalam jumlah besar dengan garansi resmi dan harga bersaing.",
      ctaLabel: "Lihat Katalog Produk"
    },
    listing: {
      badge: "Produk Kami",
      title: "Produk Unggulan Kami",
      subtitle: "Pilihan perangkat elektronik dan office equipment tepercaya untuk operasional bisnis Anda."
    },
    secondary: {
      badge: "Kenapa Memilih Kami",
      title: "Keunggulan Bermitra dengan Kami",
      subtitle: "Alasan ratusan perusahaan mempercayakan pengadaan elektronik mereka kepada kami."
    },
    articles: {
      badge: "Artikel",
      title: "Tips & Informasi Seputar Elektronik Kantor",
      subtitle: "Panduan praktis memilih dan merawat perangkat elektronik untuk kebutuhan bisnis."
    },
    contact: {
      badge: "Hubungi Sales",
      title: "Ajukan Penawaran Harga",
      subtitle: "Tim sales kami siap membantu kebutuhan pengadaan dalam jumlah besar."
    },
    finalCta: {
      badge: "Pengadaan Massal",
      title: "Butuh Pengadaan dalam Jumlah Besar?",
      subtitle: "Hubungi tim kami untuk mendapatkan penawaran harga khusus korporat.",
      ctaLabel: "Minta Penawaran"
    },
    faq: {
      badge: "FAQ",
      title: "Pertanyaan Seputar Pemesanan & Garansi",
      subtitle: "Informasi seputar cara pemesanan, pembayaran, pengiriman, dan klaim garansi."
    },
    brandTrust: {
      badge: "Dipercaya Oleh",
      title: "Klien Korporat Kami",
      subtitle: "Sebagian perusahaan dan instansi yang mempercayakan pengadaan elektroniknya kepada kami."
    }
  },
  casual: {
    theme: "casual",
    slug: "demo-casual-catalog-produk",
    email: "demo.casual.katalogproduk@lenterapasar.test",
    ownerName: "Rafi Aditya",
    brandName: "Kicks & Vibe Streetwear",
    tagline: "Gaya Lo, Statement Lo",
    description:
      "Kicks & Vibe adalah toko streetwear yang jual sepatu dan apparel kekinian buat anak muda yang nggak takut tampil beda dari yang lain.",
    vision: "Jadi brand streetwear lokal yang paling relate sama anak muda Indonesia.",
    mission: "Nyediain produk kekinian dengan kualitas oke dan harga yang masuk akal buat anak muda.",
    city: "Bandung",
    address: "Jl. Riau No. 45, Bandung",
    whatsapp: "6281200000002",
    contactEmail: "cs@kicksvibe.test",
    instagram: "https://instagram.com/kicksvibe.id",
    timeline: [
      { year: "2021", title: "Jualan Online Pertama Kali", description: "Mulai jualan sepatu preloved lewat sosial media." },
      { year: "2023", title: "Buka Toko Online Resmi", description: "Mulai jual koleksi original dan kolaborasi brand lokal." },
      { year: "2025", title: "10.000+ Pesanan Terkirim", description: "Udah dipercaya customer dari berbagai kota di Indonesia." }
    ],
    hero: {
      title: "Fresh Drop, Fresh Fit",
      subtitle: "Kicks & Vibe punya koleksi sepatu & apparel streetwear terbaru buat lo yang selalu update sama tren.",
      ctaLabel: "Belanja Sekarang"
    },
    listing: {
      badge: "New Drop",
      title: "Best Seller Minggu Ini",
      subtitle: "Item paling laris yang lagi jadi favorit customer kita."
    },
    secondary: {
      badge: "Kenapa Belanja di Sini",
      title: "Alasan Kamu Harus Belanja di Kicks & Vibe",
      subtitle: "Beberapa alasan kenapa customer selalu balik lagi belanja di kita."
    },
    articles: {
      badge: "Blog",
      title: "Tips Mix & Match Outfit Kekinian",
      subtitle: "Inspirasi outfit dan tips styling biar tampilan kamu makin on point."
    },
    contact: {
      badge: "Kontak",
      title: "Ada yang Mau Ditanyain?",
      subtitle: "Chat admin kita, biasanya fast response kok!"
    },
    finalCta: {
      badge: "Buruan!",
      title: "Jangan Sampai Kehabisan Size Favorit Kamu",
      subtitle: "Stok terbatas, buruan checkout sebelum sold out!",
      ctaLabel: "Belanja Sekarang"
    },
    faq: {
      badge: "FAQ",
      title: "FAQ Seputar Belanja & Pengiriman",
      subtitle: "Info soal cara order, metode pembayaran, sampai estimasi pengiriman."
    },
    brandTrust: {
      badge: "Kolaborasi",
      title: "Brand yang Udah Kolaborasi Bareng Kita",
      subtitle: "Beberapa brand lokal yang pernah kolaborasi bareng Kicks & Vibe."
    }
  },
  premium: {
    theme: "premium",
    slug: "demo-premium-catalog-produk",
    email: "demo.premium.katalogproduk@lenterapasar.test",
    ownerName: "Diandra Kusuma",
    brandName: "Aurum Jewellery House",
    tagline: "Keindahan Abadi, Dibuat untuk Momen Berharga Anda",
    description:
      "Aurum Jewellery House adalah rumah perhiasan premium yang menghadirkan koleksi emas dan berlian pilihan dengan kualitas dan detail terbaik.",
    vision: "Menjadi rumah perhiasan premium paling dipercaya untuk momen berharga keluarga Indonesia.",
    mission: "Menghadirkan perhiasan berkualitas tinggi dengan sertifikasi yang jelas dan layanan personal.",
    city: "Jakarta",
    address: "Jl. Kemang Raya No. 8, Jakarta Selatan",
    whatsapp: "6281200000003",
    contactEmail: "concierge@aurumjewellery.test",
    instagram: "https://instagram.com/aurum.jewellery",
    timeline: [
      { year: "2010", title: "Rumah Perhiasan Didirikan", description: "Berawal dari toko perhiasan keluarga di Jakarta." },
      { year: "2017", title: "Meluncurkan Koleksi Signature", description: "Menghadirkan koleksi desain eksklusif pertama." },
      { year: "2025", title: "Dipercaya Ribuan Keluarga", description: "Menjadi pilihan perhiasan untuk momen pernikahan dan perayaan penting." }
    ],
    hero: {
      title: "Perhiasan yang Menceritakan Kisah Anda",
      subtitle: "Aurum Jewellery House menghadirkan koleksi emas dan berlian eksklusif untuk setiap momen berharga.",
      ctaLabel: "Jelajahi Koleksi"
    },
    listing: {
      badge: "Koleksi Kami",
      title: "Koleksi Pilihan Kami",
      subtitle: "Setiap perhiasan dirancang dengan detail dan kualitas material terbaik."
    },
    secondary: {
      badge: "Keunggulan Kami",
      title: "Kenapa Memilih Aurum",
      subtitle: "Komitmen kami terhadap kualitas, keaslian, dan layanan personal untuk setiap klien."
    },
    articles: {
      badge: "Journal",
      title: "Panduan Memilih Perhiasan",
      subtitle: "Wawasan seputar merawat dan memilih perhiasan untuk momen istimewa Anda."
    },
    contact: {
      badge: "Konsultasi",
      title: "Konsultasi Perhiasan Eksklusif",
      subtitle: "Tim kami siap membantu memilihkan perhiasan yang tepat untuk momen spesial Anda."
    },
    finalCta: {
      badge: "Momen Istimewa",
      title: "Momen Spesial Layak Perhiasan Spesial",
      subtitle: "Konsultasikan pilihan perhiasan Anda bersama tim Aurum.",
      ctaLabel: "Konsultasi Sekarang"
    },
    faq: {
      badge: "FAQ",
      title: "Pertanyaan Seputar Sertifikat & Garansi",
      subtitle: "Informasi seputar keaslian, sertifikasi, dan kebijakan garansi produk kami."
    },
    brandTrust: {
      badge: "Dipercaya Oleh",
      title: "Dipercaya Klien Kami",
      subtitle: "Sebagian klien yang telah mempercayakan momen berharganya kepada Aurum."
    }
  },
  abstract: {
    theme: "abstract",
    slug: "demo-abstract-catalog-produk",
    email: "demo.abstract.katalogproduk@lenterapasar.test",
    ownerName: "Kevin Aryasatya",
    brandName: "Modula Furniture Lab",
    tagline: "Furnitur Modular untuk Ruang yang Terus Berubah",
    description:
      "Modula Furniture Lab adalah brand furniture modern yang mendesain perabot modular dan fungsional untuk gaya hidup urban yang dinamis.",
    vision: "Menjadi rujukan furnitur modular paling inovatif untuk hunian urban modern.",
    mission: "Mendesain furnitur yang fleksibel, fungsional, dan mudah beradaptasi dengan kebutuhan ruang.",
    city: "Yogyakarta",
    address: "Jl. Kaliurang KM 7, Yogyakarta",
    whatsapp: "6281200000004",
    contactEmail: "studio@modulalab.test",
    instagram: "https://instagram.com/modula.lab",
    timeline: [
      { year: "2020", title: "Studio Riset Furnitur", description: "Dimulai sebagai studio riset desain furnitur modular." },
      { year: "2023", title: "Peluncuran Lini Produk Pertama", description: "Merilis koleksi furnitur modular pertama ke pasar." },
      { year: "2025", title: "Dipakai di 30+ Kota", description: "Produk Modula sudah menjangkau berbagai kota di Indonesia." }
    ],
    hero: {
      title: "Ruang Berubah, Furnitur Kamu Harus Ikut Adaptif",
      subtitle: "Modula Furniture Lab mendesain perabot modular yang bisa menyesuaikan kebutuhan ruang kamu kapan saja.",
      ctaLabel: "Eksplor Koleksi"
    },
    listing: {
      badge: "Koleksi Kami",
      title: "Desain Favorit Studio Kami",
      subtitle: "Perabot modular yang menggabungkan fungsi, bentuk, dan fleksibilitas."
    },
    secondary: {
      badge: "Kenapa Modula",
      title: "Keunggulan Sistem Modular Kami",
      subtitle: "Beberapa alasan kenapa furnitur modular jadi pilihan tepat untuk ruang yang terus berubah."
    },
    articles: {
      badge: "Studio Notes",
      title: "Catatan Desain dari Studio Kami",
      subtitle: "Wawasan seputar desain modular, material, dan gaya hidup urban."
    },
    contact: {
      badge: "Konsultasi",
      title: "Diskusikan Kebutuhan Ruang Kamu",
      subtitle: "Tim kami bantu rekomendasikan konfigurasi modular yang paling pas untuk ruang kamu."
    },
    finalCta: {
      badge: "Rancang Ulang",
      title: "Rancang Ulang Ruang Kamu Sekarang",
      subtitle: "Konsultasikan kebutuhan furnitur modular kamu bersama tim Modula.",
      ctaLabel: "Konsultasi Desain"
    },
    faq: {
      badge: "FAQ",
      title: "Pertanyaan Seputar Material & Perakitan",
      subtitle: "Informasi seputar material yang digunakan, cara perakitan, dan garansi produk."
    },
    brandTrust: {
      badge: "Digunakan Oleh",
      title: "Dipercaya di Berbagai Ruang",
      subtitle: "Sebagian klien dan mitra yang telah menggunakan sistem furnitur modular kami."
    }
  }
};

// ============================================================================
// COPYWRITING PER SLOT
// Setiap slot WAJIB dapat konten (badge/title/subtitle, +ctaLabel/ctaUrl untuk
// slot ajakan bertindak, +imageUrl untuk slot hero/visual utama) supaya tidak
// ada section yang kosong di halaman publik.
// ============================================================================
const img = (seed: string) => `https://picsum.photos/seed/${seed}/1600/900`;

function companyProfileSlotContent(slotKey: string, p: Persona): Record<string, unknown> {
  const label = (COMPANY_PROFILE_SECTION_SLOT_LABELS as Record<string, string>)[slotKey] || slotKey;
  switch (slotKey) {
    case "global.navbar":
    case "global.footer":
      return {};
    case "home.hero":
      return { badge: "Selamat Datang", title: p.hero.title, subtitle: p.hero.subtitle, ctaLabel: p.hero.ctaLabel, ctaUrl: "/contact", imageUrl: img(`${p.slug}-hero`) };
    case "home.profile_summary":
      return { badge: "Tentang Kami", title: `Kenalan Lebih Dekat dengan ${p.brandName}`, subtitle: p.description };
    case "home.service_preview":
      return { badge: p.listing.badge, title: p.listing.title, subtitle: p.listing.subtitle };
    case "home.portfolio_preview":
      return { badge: p.secondary.badge, title: p.secondary.title, subtitle: p.secondary.subtitle };
    case "home.trust_proof":
      return { badge: "Testimoni", title: "Apa Kata Client Kami", subtitle: `Pengalaman langsung dari client yang telah bekerja sama dengan ${p.brandName}.` };
    case "home.cta_contact":
      return { badge: p.finalCta.badge, title: p.finalCta.title, subtitle: p.finalCta.subtitle, ctaLabel: p.finalCta.ctaLabel, ctaUrl: "/contact" };
    case "about.organization_profile":
      return { badge: "Profil Organisasi", title: `Tentang ${p.brandName}`, subtitle: p.description, imageUrl: img(`${p.slug}-about`) };
    case "about.history_timeline":
      return { badge: "Perjalanan Kami", title: "Sejarah Singkat Kami", subtitle: `Perjalanan ${p.brandName} dari awal berdiri hingga hari ini.` };
    case "about.vision_mission":
      return { badge: "Visi & Misi", title: "Visi dan Misi Kami", subtitle: "Arah dan komitmen yang memandu setiap langkah kami.", vision: p.vision, mission: p.mission };
    case "about.value_statement":
      return { badge: "Nilai Kami", title: `Prinsip yang Kami Pegang di ${p.brandName}`, subtitle: "Nilai-nilai ini membentuk cara kami bekerja dan melayani client setiap hari." };
    case "about.team_highlight":
      return { badge: "Tim Kami", title: "Orang-Orang di Balik Layanan Kami", subtitle: `Tim profesional yang berdedikasi menjalankan operasional ${p.brandName}.` };
    case "services.service_hero":
      return { badge: p.listing.badge, title: p.listing.title, subtitle: p.listing.subtitle, imageUrl: img(`${p.slug}-services`) };
    case "services.service_grid":
      return { badge: p.listing.badge, title: p.listing.title, subtitle: p.listing.subtitle };
    case "services.service_process":
      return { badge: "Alur Kerja", title: "Bagaimana Kami Bekerja", subtitle: "Proses kerja yang jelas dari awal konsultasi hingga hasil akhir." };
    case "services.service_benefits":
      return { badge: "Manfaat", title: "Kenapa Memilih Kami", subtitle: `Beberapa alasan client memilih ${p.brandName} sebagai partner mereka.` };
    case "services.service_faq":
      return { badge: p.faq.badge, title: p.faq.title, subtitle: p.faq.subtitle };
    case "portfolio.portfolio_hero":
      return { badge: p.secondary.badge, title: p.secondary.title, subtitle: p.secondary.subtitle, imageUrl: img(`${p.slug}-portfolio`) };
    case "portfolio.portfolio_category":
      return { badge: "Kategori", title: "Jelajahi Berdasarkan Kategori", subtitle: "Temukan proyek yang paling relevan dengan kebutuhan Anda." };
    case "portfolio.portfolio_grid":
      return { badge: p.secondary.badge, title: p.secondary.title, subtitle: p.secondary.subtitle };
    case "portfolio.case_highlight":
      return { badge: "Studi Kasus", title: "Sorotan Proyek Pilihan", subtitle: "Salah satu proyek yang paling merepresentasikan kualitas kerja kami." };
    case "portfolio.portfolio_cta":
      return { badge: p.finalCta.badge, title: p.finalCta.title, subtitle: p.finalCta.subtitle, ctaLabel: p.finalCta.ctaLabel, ctaUrl: "/contact" };
    case "articles.article_hero":
      return { badge: p.articles.badge, title: p.articles.title, subtitle: p.articles.subtitle, imageUrl: img(`${p.slug}-articles`) };
    case "articles.featured_article":
      return { badge: "Artikel Pilihan", title: "Artikel Paling Banyak Dibaca", subtitle: "Konten pilihan yang paling banyak membantu pembaca kami." };
    case "articles.article_preview":
      return { badge: p.articles.badge, title: p.articles.title, subtitle: p.articles.subtitle };
    case "article_detail.article_content":
      return {};
    case "article_detail.related_articles":
      return { badge: "Baca Juga", title: "Artikel Terkait Lainnya", subtitle: "Rekomendasi bacaan lain yang mungkin Anda suka." };
    case "article_detail.article_cta":
      return { badge: p.finalCta.badge, title: p.finalCta.title, subtitle: p.finalCta.subtitle, ctaLabel: p.finalCta.ctaLabel, ctaUrl: "/contact" };
    case "contact.contact_hero":
      return { badge: p.contact.badge, title: p.contact.title, subtitle: p.contact.subtitle, imageUrl: img(`${p.slug}-contact`) };
    case "contact.contact_information":
      return { badge: "Info Kontak", title: "Informasi Kontak Kami" };
    case "contact.maps_location":
      return { badge: "Lokasi", title: "Kunjungi Kantor Kami" };
    case "contact.contact_faq":
      return { badge: p.faq.badge, title: p.faq.title, subtitle: p.faq.subtitle };
    case "contact.contact_cta":
      return { badge: p.finalCta.badge, title: p.finalCta.title, subtitle: p.finalCta.subtitle, ctaLabel: p.finalCta.ctaLabel, ctaUrl: `https://wa.me/${p.whatsapp}` };
    case "portfolio_detail.portfolio_detail_content":
      return {};
    case "portfolio_detail.related_portfolios":
      return { badge: "Lihat Juga", title: "Proyek Terkait Lainnya", subtitle: "Beberapa proyek lain yang relevan dengan yang sedang Anda lihat." };
    case "portfolio_detail.portfolio_detail_cta":
      return { badge: p.finalCta.badge, title: p.finalCta.title, subtitle: p.finalCta.subtitle, ctaLabel: p.finalCta.ctaLabel, ctaUrl: "/contact" };
    default:
      return { badge: label, title: `${label} — ${p.brandName}`, subtitle: p.tagline };
  }
}

function catalogProductSlotContent(slotKey: string, p: Persona): Record<string, unknown> {
  const label = (CATALOG_PRODUCT_SECTION_SLOT_LABELS as Record<string, string>)[slotKey] || slotKey;
  switch (slotKey) {
    case "global.navbar":
    case "global.footer":
    case "global.whatsapp_fab":
      return {};
    case "home.hero":
      return { badge: "Selamat Datang", title: p.hero.title, subtitle: p.hero.subtitle, ctaLabel: p.hero.ctaLabel, ctaUrl: "/products", imageUrl: img(`${p.slug}-hero`) };
    case "home.category_showcase":
      return { badge: "Kategori", title: "Belanja Berdasarkan Kategori", subtitle: `Jelajahi koleksi ${p.brandName} berdasarkan kategori favorit Anda.` };
    case "home.featured_products":
      return { badge: p.listing.badge, title: p.listing.title, subtitle: p.listing.subtitle };
    case "home.new_arrivals":
      return { badge: "Baru Datang", title: "Produk Terbaru Kami", subtitle: "Koleksi paling baru yang baru saja kami tambahkan ke katalog." };
    case "home.value_proposition":
      return { badge: p.secondary.badge, title: p.secondary.title, subtitle: p.secondary.subtitle };
    case "home.brand_trust":
      return { badge: p.brandTrust.badge, title: p.brandTrust.title, subtitle: p.brandTrust.subtitle, imageUrl: img(`${p.slug}-trust`) };
    case "products.breadcrumbs":
      return { title: "Semua Produk", subtitle: `Jelajahi seluruh katalog produk ${p.brandName}.` };
    case "products.product_filter_sidebar":
      return { title: "Filter & Urutkan" };
    case "products.product_grid":
      return { badge: p.listing.badge, title: p.listing.title, subtitle: p.listing.subtitle };
    case "products.product_pagination":
      return {};
    case "product_detail.product_core_info":
      return {};
    case "product_detail.product_tabs":
      return { title: "Spesifikasi & Deskripsi" };
    case "product_detail.product_recommendation":
      return { badge: "Rekomendasi", title: "Produk Terkait Lainnya", subtitle: "Beberapa produk lain yang mungkin Anda suka." };
    case "product_detail.product_reviews":
      return { badge: "Ulasan", title: "Apa Kata Pelanggan Kami", subtitle: "Ulasan asli dari pelanggan yang telah membeli produk ini." };
    case "product_detail.product_faq":
      return { badge: p.faq.badge, title: p.faq.title, subtitle: p.faq.subtitle };
    case "faq.faq_hero_search":
      return { badge: "Pusat Bantuan", title: p.faq.title, subtitle: p.faq.subtitle, imageUrl: img(`${p.slug}-faq`) };
    case "faq.faq_accordion":
      return { badge: p.faq.badge, title: "Pertanyaan yang Sering Diajukan", subtitle: p.faq.subtitle };
    case "faq.faq_contact_cta":
      return { badge: p.finalCta.badge, title: "Masih Ada Pertanyaan?", subtitle: "Tim support kami siap membantu Anda kapan saja.", ctaLabel: "Hubungi Support", ctaUrl: `https://wa.me/${p.whatsapp}`, imageUrl: img(`${p.slug}-support`) };
    case "articles.blog_hero":
      return { badge: p.articles.badge, title: p.articles.title, subtitle: p.articles.subtitle, imageUrl: img(`${p.slug}-blog`) };
    case "articles.featured_post":
      return { badge: "Artikel Pilihan", title: "Artikel Paling Banyak Dibaca", subtitle: "Konten pilihan yang paling banyak membantu pembaca kami." };
    case "articles.article_category_filter":
      return { title: "Kategori Artikel" };
    case "articles.article_grid":
      return { badge: p.articles.badge, title: p.articles.title, subtitle: p.articles.subtitle };
    case "articles.article_pagination":
      return {};
    case "article_detail.article_header_meta":
      return { imageUrl: img(`${p.slug}-article-detail`) };
    case "article_detail.article_main_content":
      return {};
    case "article_detail.product_contextual_cta":
      return { badge: p.listing.badge, title: "Produk yang Dibahas di Artikel Ini", subtitle: "Lihat produk terkait yang dibahas dalam artikel ini.", ctaLabel: p.hero.ctaLabel, ctaUrl: "/products" };
    case "article_detail.related_articles":
      return { badge: "Baca Juga", title: "Artikel Terkait Lainnya", subtitle: "Rekomendasi bacaan lain yang mungkin Anda suka." };
    case "article_detail.article_comments":
      return { title: "Komentar Pembaca" };
    case "contact.contact_info_cards":
      return { badge: p.contact.badge, title: p.contact.title, subtitle: p.contact.subtitle };
    case "contact.inquiry_form":
      return { badge: "Formulir", title: "Kirim Permintaan Penawaran", subtitle: "Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda." };
    case "contact.maps_location":
      return { badge: "Lokasi", title: "Kunjungi Toko Kami" };
    default:
      return { badge: label, title: `${label} — ${p.brandName}`, subtitle: p.tagline };
  }
}

// ============================================================================
// TEMPLATE PACK + TEMPLATE SECTION (per tema, namespace demo-showcase supaya
// tidak bentrok dengan template pack produksi yang sudah/akan diimpor dari ZIP).
// ============================================================================
async function ensureThemeTemplatePack(websiteType: "company_profile" | "catalog_product", theme: Theme) {
  const slots = websiteType === "company_profile" ? COMPANY_PROFILE_SECTION_SLOTS : CATALOG_PRODUCT_SECTION_SLOTS;
  const labels = (websiteType === "company_profile" ? COMPANY_PROFILE_SECTION_SLOT_LABELS : CATALOG_PRODUCT_SECTION_SLOT_LABELS) as Record<string, string>;
  const templatePackKey = `${websiteType}-${theme}-demo-showcase`;

  const pack = await prisma.templatePack.upsert({
    where: { templatePackKey },
    update: { websiteType, theme, name: `${pascal(websiteType)} ${pascal(theme)} (Demo Showcase)`, status: "active" },
    create: {
      templatePackKey,
      websiteType,
      theme,
      name: `${pascal(websiteType)} ${pascal(theme)} (Demo Showcase)`,
      version: "1.0.0",
      description: `Template pack demo showcase untuk ${websiteType} tema ${theme}.`,
      status: "active"
    }
  });

  const sectionIdBySlot = new Map<string, string>();
  for (const slot of slots) {
    const sectionKey = `demo-showcase-${websiteType}-${theme}-${slot.slotKey.replace(/\./g, "-")}`;
    const name = labels[slot.slotKey] || slot.slotKey;
    const section = await prisma.templateSection.upsert({
      where: { sectionKey },
      update: {
        templatePackId: pack.id,
        websiteType,
        pageKey: slot.pageKey,
        slotKey: slot.slotKey,
        name,
        component: `${pascal(slot.slotKey)}Section`,
        variant: theme,
        status: "active",
        isActive: true
      },
      create: {
        templatePackId: pack.id,
        sectionKey,
        websiteType,
        pageKey: slot.pageKey,
        slotKey: slot.slotKey,
        name,
        component: `${pascal(slot.slotKey)}Section`,
        variant: theme,
        schemaJson: STANDARD_SCHEMA,
        defaultContentJson: {},
        status: "active",
        isActive: true
      }
    });
    sectionIdBySlot.set(slot.slotKey, section.id);
  }
  return sectionIdBySlot;
}

// ============================================================================
// SEED 1 WEBSITE COMPANY PROFILE
// ============================================================================
async function seedCompanyProfileWebsite(persona: Persona) {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const owner = await prisma.user.upsert({
    where: { email: persona.email },
    update: { name: persona.ownerName, passwordHash, role: "owner_admin", whatsapp: persona.whatsapp, emailVerifiedAt: new Date() },
    create: { name: persona.ownerName, email: persona.email, passwordHash, role: "owner_admin", whatsapp: persona.whatsapp, emailVerifiedAt: new Date() }
  });

  const website = await prisma.website.upsert({
    where: { slug: persona.slug },
    update: { ownerId: owner.id, name: persona.brandName, status: "published" },
    create: {
      ownerId: owner.id,
      name: persona.brandName,
      slug: persona.slug,
      websiteType: "company_profile",
      status: "published",
      trackingKey: randomToken("trk")
    }
  });

  await prisma.$transaction(async (tx: any) => {
    await createWebsiteDefaults(tx as any, website.id, website.name, "company_profile");
  });

  const sectionIdBySlot = await ensureThemeTemplatePack("company_profile", persona.theme);

  for (const slot of COMPANY_PROFILE_SECTION_SLOTS) {
    const templateSectionId = sectionIdBySlot.get(slot.slotKey) || null;
    const contentJson = companyProfileSlotContent(slot.slotKey, persona);
    await prisma.pageSection.update({
      where: { websiteId_slotKey: { websiteId: website.id, slotKey: slot.slotKey } },
      data: { templateSectionId, contentJson: contentJson as any }
    });
  }

  await prisma.businessProfile.upsert({
    where: { websiteId: website.id },
    update: {
      name: persona.brandName,
      tagline: persona.tagline,
      description: persona.description,
      vision: persona.vision,
      mission: persona.mission,
      timelineJson: persona.timeline as any,
      contactEmail: persona.contactEmail,
      phone: persona.whatsapp,
      whatsapp: persona.whatsapp,
      address: persona.address,
      instagramUrl: persona.instagram || null
    },
    create: {
      websiteId: website.id,
      name: persona.brandName,
      tagline: persona.tagline,
      description: persona.description,
      vision: persona.vision,
      mission: persona.mission,
      timelineJson: persona.timeline as any,
      contactEmail: persona.contactEmail,
      phone: persona.whatsapp,
      whatsapp: persona.whatsapp,
      address: persona.address,
      instagramUrl: persona.instagram || null
    }
  });

  // Bersihkan CRUD lama punya website ini biar seed aman dijalankan berkali-kali.
  await Promise.all([
    prisma.service.deleteMany({ where: { websiteId: website.id } }),
    prisma.portfolio.deleteMany({ where: { websiteId: website.id } }),
    prisma.testimonial.deleteMany({ where: { websiteId: website.id } }),
    prisma.brandPartner.deleteMany({ where: { websiteId: website.id } }),
    prisma.article.deleteMany({ where: { websiteId: website.id } }),
    prisma.faq.deleteMany({ where: { websiteId: website.id } })
  ]);

  // ---- Services x3 ----
  const serviceCatalog: Record<Theme, { title: string; description: string }[]> = {
    formal: [
      { title: "Pendirian & Legalitas Perusahaan", description: "Pengurusan akta pendirian, NIB, dan izin usaha secara menyeluruh." },
      { title: "Penyusunan & Review Kontrak", description: "Memastikan setiap kontrak bisnis Anda kuat secara hukum dan minim risiko." },
      { title: "Pendampingan Sengketa Bisnis", description: "Mewakili kepentingan Anda dalam negosiasi maupun proses hukum." }
    ],
    casual: [
      { title: "Desain Logo & Brand Identity", description: "Bikin identitas visual brand kamu yang gampang diingat orang." },
      { title: "Konten Media Sosial", description: "Konten feed dan story yang konsisten sama gaya brand kamu." },
      { title: "Desain Kemasan Produk", description: "Packaging yang eye-catching dan bikin produk kamu standout di rak." }
    ],
    premium: [
      { title: "Konsultasi Desain Interior", description: "Sesi konsultasi mendalam untuk memahami kebutuhan dan selera Anda." },
      { title: "Desain & Perencanaan Ruang", description: "Perencanaan tata ruang, material, dan furnitur secara menyeluruh." },
      { title: "Pengawasan Instalasi Eksklusif", description: "Memastikan hasil akhir sesuai konsep hingga detail terkecil." }
    ],
    abstract: [
      { title: "Brand Identity & Visual Language", description: "Membangun bahasa visual yang unik dan mudah dikenali." },
      { title: "Digital Campaign Strategy", description: "Strategi kampanye digital yang eksperimental namun terukur." },
      { title: "Motion & Content Production", description: "Produksi konten visual bergerak untuk kebutuhan kampanye brand." }
    ]
  };
  const services = await Promise.all(
    serviceCatalog[persona.theme].map((s, i) =>
      prisma.service.create({ data: { websiteId: website.id, title: s.title, description: s.description, imageUrl: img(`${persona.slug}-service-${i}`), sortOrder: i + 1, isFeatured: i === 0, featuredOrder: i === 0 ? 1 : 0 } })
    )
  );

  // ---- Portfolio x10 ----
  const portfolios = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.portfolio.create({
        data: {
          websiteId: website.id,
          title: `${persona.secondary.title.split(" ").slice(0, 2).join(" ")} — Proyek ${i + 1}`,
          slug: `${persona.slug}-portfolio-${i + 1}`,
          description: `Studi kasus proyek ke-${i + 1} yang menunjukkan hasil kerja nyata ${persona.brandName} untuk client.`,
          imageUrl: img(`${persona.slug}-portfolio-${i + 1}`),
          sortOrder: i + 1,
          isFeatured: i < 3,
          featuredOrder: i < 3 ? i + 1 : 0
        }
      })
    )
  );

  // ---- Testimonial x6 ----
  const testimonialNames = [
    ["Budi Santoso", "Owner", "Budi Teknik"],
    ["Rina Puspita", "Marketing Manager", "Puspita Group"],
    ["Andi Wijaya", "Founder", "Wijaya Digital"],
    ["Sari Melati", "Direktur Operasional", "Melati Corp"],
    ["Dimas Prakoso", "CEO", "Prakoso Studio"],
    ["Lestari Handayani", "Owner", "Handayani Boutique"]
  ] as const;
  await prisma.testimonial.createMany({
    data: testimonialNames.map(([name, role, company], i) => ({
      websiteId: website.id,
      name,
      role,
      company,
      quote: `Bekerja sama dengan ${persona.brandName} benar-benar membantu kami. Prosesnya jelas, hasilnya sesuai ekspektasi, dan tim mereka sangat responsif.`,
      avatarUrl: img(`${persona.slug}-testimonial-${i}`),
      sortOrder: i + 1
    }))
  });

  // ---- Brand Partner (menyesuaikan, 6) ----
  await prisma.brandPartner.createMany({
    data: Array.from({ length: 6 }).map((_, i) => ({
      websiteId: website.id,
      name: `Mitra ${persona.brandName.split(" ")[0]} ${i + 1}`,
      logoUrl: img(`${persona.slug}-partner-${i}`),
      url: `https://example.com/partner-${i + 1}`,
      sortOrder: i + 1
    }))
  });

  // ---- FAQ (menyesuaikan, 6) ----
  const faqPairs = [
    ["Bagaimana cara memulai kerja sama dengan kami?", `Anda bisa menghubungi kami melalui halaman kontak atau WhatsApp di ${persona.whatsapp}, lalu tim kami akan menindaklanjuti dalam 1x24 jam kerja.`],
    ["Berapa lama proses pengerjaan biasanya berlangsung?", "Durasi bergantung pada kompleksitas kebutuhan, namun kami selalu menyampaikan estimasi waktu di awal sebelum memulai pekerjaan."],
    ["Apakah ada sesi konsultasi awal sebelum mulai?", "Ya, kami selalu menyediakan sesi konsultasi awal untuk memahami kebutuhan Anda secara mendalam sebelum memberikan penawaran."],
    ["Bagaimana skema pembayarannya?", "Kami menerapkan skema pembayaran bertahap yang akan dijelaskan secara rinci dalam penawaran resmi."],
    ["Apakah bisa request revisi setelah hasil awal selesai?", "Tentu, kami menyediakan sesi revisi sesuai kesepakatan di awal kerja sama."],
    ["Apakah layanan ini tersedia untuk client di luar kota?", "Tentu, kami sudah terbiasa menangani client dari berbagai kota melalui komunikasi jarak jauh."]
  ];
  await prisma.faq.createMany({
    data: faqPairs.map(([question, answer], i) => ({ websiteId: website.id, question, answer, pageKey: i % 2 === 0 ? "services" : "contact", sortOrder: i + 1 }))
  });

  // ---- Article x10 ----
  const now = new Date();
  await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
      const title = `${persona.articles.title} #${i + 1}: ${persona.tagline}`;
      return prisma.article.create({
        data: {
          websiteId: website.id,
          title,
          slug: `${persona.slug}-artikel-${i + 1}`,
          excerpt: `${persona.articles.subtitle} Bagian ke-${i + 1} dari seri artikel kami.`,
          content: `${persona.description}\n\nPada artikel ke-${i + 1} ini, kami membahas lebih dalam topik yang relevan dengan layanan ${persona.brandName}, lengkap dengan contoh nyata dan tips praktis yang bisa langsung diterapkan.`,
          coverImageUrl: img(`${persona.slug}-article-${i + 1}`),
          seoTitle: title,
          seoDescription: persona.articles.subtitle,
          status: "published",
          sortOrder: i + 1,
          isFeatured: i < 2,
          featuredOrder: i < 2 ? i + 1 : 0,
          publishedAt: new Date(now.getTime() - i * 86400000)
        }
      });
    })
  );

  await prisma.user.update({ where: { id: owner.id }, data: { primaryWebsiteId: website.id } });

  return { owner, website, servicesCount: services.length, portfoliosCount: portfolios.length };
}

// ============================================================================
// SEED 1 WEBSITE KATALOG PRODUK
// ============================================================================
const CATALOG_SEED_DATA: Record<Theme, { categories: string[]; products: { title: string; price: number; compareAtPrice?: number }[] }> = {
  formal: {
    categories: ["Perangkat Kantor", "Elektronik Rumah Tangga", "Aksesoris & Networking"],
    products: [
      { title: "Laptop Bisnis ProBook 14 - i5 Gen 12", price: 9500000, compareAtPrice: 10800000 },
      { title: "Printer Multifungsi LaserJet Office", price: 3200000 },
      { title: "Proyektor Ruang Meeting Full HD", price: 5400000 },
      { title: "UPS Office 1200VA", price: 950000 },
      { title: "Router Wi-Fi 6 Enterprise", price: 1750000 },
      { title: "Telepon Konferensi Ruang Rapat", price: 2100000 },
      { title: "AC Split Ruang Kantor 1PK", price: 4300000 },
      { title: "Mesin Absensi Fingerprint", price: 1450000 },
      { title: "CCTV Kit 4 Kamera Office", price: 3800000, compareAtPrice: 4200000 },
      { title: "Server Mini Tower untuk Kantor Kecil", price: 12500000 }
    ]
  },
  casual: {
    categories: ["Sepatu Sneakers", "Apparel Streetwear", "Aksesoris"],
    products: [
      { title: "Sneakers Canvas Classic White", price: 349000, compareAtPrice: 429000 },
      { title: "Jaket Hoodie Oversized Vibe", price: 279000 },
      { title: "Kaos Statement Tee Bold", price: 129000 },
      { title: "Sneakers Runner Boost Grey", price: 499000 },
      { title: "Celana Cargo Street Style", price: 259000 },
      { title: "Topi Bucket Hat Signature", price: 99000 },
      { title: "Tas Selempang Street Pack", price: 189000, compareAtPrice: 229000 },
      { title: "Sepatu Slip-On Casual Black", price: 299000 },
      { title: "Jaket Varsity Kicks & Vibe", price: 389000 },
      { title: "Kaos Kaki Motif Statement (3 Pack)", price: 79000 }
    ]
  },
  premium: {
    categories: ["Cincin", "Kalung", "Anting & Gelang"],
    products: [
      { title: "Cincin Emas Putih Berlian 0.5 Carat", price: 18500000 },
      { title: "Kalung Emas 18K Signature Aurum", price: 12750000 },
      { title: "Anting Berlian Solitaire", price: 8900000 },
      { title: "Gelang Emas Rantai Klasik", price: 6400000 },
      { title: "Cincin Tunangan Halo Diamond", price: 24500000, compareAtPrice: 27000000 },
      { title: "Kalung Liontin Berlian Aurum Signature", price: 15200000 },
      { title: "Anting Emas Mutiara Selatan", price: 5300000 },
      { title: "Set Perhiasan Pengantin Aurum", price: 45000000 },
      { title: "Gelang Tenis Berlian", price: 32000000 },
      { title: "Cincin Emas Kuning Motif Klasik", price: 7100000 }
    ]
  },
  abstract: {
    categories: ["Sofa Modular", "Meja & Storage", "Aksesori Ruang"],
    products: [
      { title: "Sofa Modular Cluster 3 Seat", price: 8900000 },
      { title: "Meja Kopi Modular Stackable", price: 2100000 },
      { title: "Rak Modular Dinding Adjustable", price: 1750000 },
      { title: "Kursi Modular Lounge Single", price: 3200000 },
      { title: "Meja Kerja Modular Fold-Away", price: 2650000, compareAtPrice: 2950000 },
      { title: "Partisi Ruang Modular Panel", price: 1450000 },
      { title: "Sofa Bed Modular Convertible", price: 6700000 },
      { title: "Rak Sepatu Modular Stackable", price: 890000 },
      { title: "Set Meja & Kursi Makan Modular", price: 5400000 },
      { title: "Nightstand Modular Minimalis", price: 990000 }
    ]
  }
};

async function seedCatalogProductWebsite(persona: Persona) {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const owner = await prisma.user.upsert({
    where: { email: persona.email },
    update: { name: persona.ownerName, passwordHash, role: "owner_admin", whatsapp: persona.whatsapp, emailVerifiedAt: new Date() },
    create: { name: persona.ownerName, email: persona.email, passwordHash, role: "owner_admin", whatsapp: persona.whatsapp, emailVerifiedAt: new Date() }
  });

  const website = await prisma.website.upsert({
    where: { slug: persona.slug },
    update: { ownerId: owner.id, name: persona.brandName, status: "published" },
    create: {
      ownerId: owner.id,
      name: persona.brandName,
      slug: persona.slug,
      websiteType: "catalog_product",
      status: "published",
      trackingKey: randomToken("trk")
    }
  });

  await prisma.$transaction(async (tx: any) => {
    await createWebsiteDefaults(tx as any, website.id, website.name, "catalog_product");
  });

  const sectionIdBySlot = await ensureThemeTemplatePack("catalog_product", persona.theme);

  for (const slot of CATALOG_PRODUCT_SECTION_SLOTS) {
    const templateSectionId = sectionIdBySlot.get(slot.slotKey) || null;
    const contentJson = catalogProductSlotContent(slot.slotKey, persona);
    await prisma.pageSection.update({
      where: { websiteId_slotKey: { websiteId: website.id, slotKey: slot.slotKey } },
      data: { templateSectionId, contentJson: contentJson as any }
    });
  }

  await prisma.businessProfile.upsert({
    where: { websiteId: website.id },
    update: {
      name: persona.brandName,
      tagline: persona.tagline,
      description: persona.description,
      vision: persona.vision,
      mission: persona.mission,
      timelineJson: persona.timeline as any,
      contactEmail: persona.contactEmail,
      phone: persona.whatsapp,
      whatsapp: persona.whatsapp,
      address: persona.address,
      instagramUrl: persona.instagram || null
    },
    create: {
      websiteId: website.id,
      name: persona.brandName,
      tagline: persona.tagline,
      description: persona.description,
      vision: persona.vision,
      mission: persona.mission,
      timelineJson: persona.timeline as any,
      contactEmail: persona.contactEmail,
      phone: persona.whatsapp,
      whatsapp: persona.whatsapp,
      address: persona.address,
      instagramUrl: persona.instagram || null
    }
  });

  await Promise.all([
    prisma.product.deleteMany({ where: { websiteId: website.id } }),
    prisma.productCategory.deleteMany({ where: { websiteId: website.id } }),
    prisma.banner.deleteMany({ where: { websiteId: website.id } }),
    prisma.valueProposition.deleteMany({ where: { websiteId: website.id } }),
    prisma.brandPartner.deleteMany({ where: { websiteId: website.id } }),
    prisma.faq.deleteMany({ where: { websiteId: website.id } }),
    prisma.article.deleteMany({ where: { websiteId: website.id } })
  ]);

  const seedData = CATALOG_SEED_DATA[persona.theme];

  // ---- Product Category (pendukung, dibagi rata ke 10 produk) ----
  const categories = await Promise.all(
    seedData.categories.map((name, i) =>
      prisma.productCategory.create({
        data: { websiteId: website.id, name, slug: `${persona.slug}-kategori-${i + 1}`, description: `Kategori ${name} dari ${persona.brandName}.`, sortOrder: i + 1 }
      })
    )
  );

  // ---- Product x10 (+ 1 gambar & 2 varian tiap produk) ----
  for (let i = 0; i < seedData.products.length; i += 1) {
    const p = seedData.products[i];
    const category = categories[i % categories.length];
    const product = await prisma.product.create({
      data: {
        websiteId: website.id,
        categoryId: category.id,
        title: p.title,
        slug: `${persona.slug}-produk-${i + 1}`,
        sku: `SKU-${persona.theme.toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
        shortDescription: `${p.title} — pilihan terbaik dari ${persona.brandName}.`,
        description: `${p.title} adalah salah satu produk unggulan kami. ${persona.listing.subtitle}`,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        ctaLabel: persona.hero.ctaLabel,
        ctaUrl: "/contact",
        isFeatured: i < 3,
        featuredOrder: i < 3 ? i + 1 : 0,
        isNewArrival: i >= 7,
        sortOrder: i + 1
      }
    });
    await prisma.productImage.create({
      data: { productId: product.id, url: img(`${persona.slug}-product-${i + 1}`), altText: p.title, isPrimary: true, sortOrder: 1 }
    });
    await prisma.productVariant.createMany({
      data: [
        { productId: product.id, name: "Standar", sku: `${product.sku}-STD`, stock: 25, sortOrder: 1 },
        { productId: product.id, name: "Premium", sku: `${product.sku}-PRM`, priceOverride: Number(p.price) * 1.15, stock: 10, sortOrder: 2 }
      ]
    });
  }

  // ---- Banner x5 ----
  const bannerCopy = [
    { title: persona.hero.title, subtitle: persona.hero.subtitle, ctaLabel: persona.hero.ctaLabel },
    { title: persona.listing.title, subtitle: persona.listing.subtitle, ctaLabel: "Lihat Semua" },
    { title: "Promo Spesial Bulan Ini", subtitle: `Dapatkan penawaran terbaik hanya di ${persona.brandName}.`, ctaLabel: "Cek Promo" },
    { title: "Koleksi Terbaru Telah Tiba", subtitle: "Jangan sampai ketinggalan produk terbaru kami.", ctaLabel: "Belanja Sekarang" },
    { title: persona.finalCta.title, subtitle: persona.finalCta.subtitle, ctaLabel: persona.finalCta.ctaLabel }
  ];
  await prisma.banner.createMany({
    data: bannerCopy.map((b, i) => ({
      websiteId: website.id,
      imageUrl: img(`${persona.slug}-banner-${i + 1}`),
      title: b.title,
      subtitle: b.subtitle,
      ctaLabel: b.ctaLabel,
      ctaUrl: "/products",
      sortOrder: i + 1
    }))
  });

  // ---- Value Proposition / USP x4 ----
  const uspCatalog: Record<Theme, { icon: string; title: string; description: string }[]> = {
    formal: [
      { icon: "shield-check", title: "Garansi Resmi", description: "Semua produk bergaransi resmi dari distributor." },
      { icon: "truck", title: "Pengiriman ke Seluruh Indonesia", description: "Melayani pengiriman untuk kebutuhan pengadaan skala besar." },
      { icon: "file-text", title: "Invoice & Faktur Pajak Lengkap", description: "Mendukung kebutuhan administrasi dan keuangan perusahaan Anda." },
      { icon: "headset", title: "Dukungan Teknis Purna Jual", description: "Tim teknis siap membantu instalasi dan troubleshooting." }
    ],
    casual: [
      { icon: "zap", title: "Kirim Kilat 1-2 Hari", description: "Pesanan kamu sampai lebih cepat tanpa drama." },
      { icon: "badge-check", title: "Original 100%", description: "Semua produk dijamin asli, bukan KW." },
      { icon: "refresh-cw", title: "Bisa Tukar Size", description: "Salah size? Tenang, bisa tukar dengan mudah." },
      { icon: "message-circle", title: "Fast Response Admin", description: "Chat admin kita, dibalas cepat tiap hari." }
    ],
    premium: [
      { icon: "gem", title: "Bersertifikat Resmi", description: "Setiap perhiasan dilengkapi sertifikat keaslian." },
      { icon: "shield", title: "Garansi Seumur Pakai", description: "Layanan perawatan dan garansi jangka panjang." },
      { icon: "truck", title: "Pengiriman Aman & Terasuransi", description: "Setiap pengiriman diasuransikan penuh." },
      { icon: "users", title: "Konsultasi Personal", description: "Layanan konsultasi personal dengan tim ahli kami." }
    ],
    abstract: [
      { icon: "layers", title: "Sistem Modular Fleksibel", description: "Bisa disusun ulang sesuai kebutuhan ruang kamu." },
      { icon: "leaf", title: "Material Berkelanjutan", description: "Menggunakan material ramah lingkungan pilihan." },
      { icon: "tool", title: "Mudah Dirakit Sendiri", description: "Dilengkapi panduan perakitan yang jelas dan mudah." },
      { icon: "truck", title: "Pengiriman ke Seluruh Kota", description: "Sudah menjangkau lebih dari 30 kota di Indonesia." }
    ]
  };
  await prisma.valueProposition.createMany({
    data: uspCatalog[persona.theme].map((u, i) => ({ websiteId: website.id, icon: u.icon, title: u.title, description: u.description, sortOrder: i + 1 }))
  });

  // ---- Brand Partner (menyesuaikan, 6) ----
  await prisma.brandPartner.createMany({
    data: Array.from({ length: 6 }).map((_, i) => ({
      websiteId: website.id,
      name: `Mitra ${persona.brandName.split(" ")[0]} ${i + 1}`,
      logoUrl: img(`${persona.slug}-partner-${i}`),
      url: `https://example.com/partner-${i + 1}`,
      sortOrder: i + 1
    }))
  });

  // ---- FAQ (menyesuaikan, 6) ----
  const faqPairs = [
    ["Bagaimana cara melakukan pemesanan?", `Anda bisa langsung memilih produk di katalog, lalu checkout atau hubungi kami via WhatsApp di ${persona.whatsapp}.`],
    ["Metode pembayaran apa saja yang tersedia?", "Kami menerima transfer bank, e-wallet, dan pembayaran di tempat untuk area tertentu."],
    ["Berapa lama estimasi pengiriman?", "Estimasi pengiriman 2-5 hari kerja tergantung lokasi tujuan."],
    ["Apakah produk memiliki garansi?", "Ya, sebagian besar produk kami dilengkapi garansi resmi sesuai ketentuan masing-masing produk."],
    ["Bisakah saya melakukan retur atau tukar barang?", "Bisa, selama memenuhi syarat dan ketentuan retur yang berlaku dalam 7 hari setelah barang diterima."],
    ["Apakah bisa pesan dalam jumlah banyak?", "Tentu, silakan hubungi tim kami untuk mendapatkan penawaran khusus pembelian dalam jumlah besar."]
  ];
  await prisma.faq.createMany({
    data: faqPairs.map(([question, answer], i) => ({ websiteId: website.id, question, answer, pageKey: i % 2 === 0 ? "faq" : "contact", sortOrder: i + 1 }))
  });

  // ---- Article x6 (pelengkap; tidak diminta eksplisit, tapi tetap diisi supaya
  //      halaman Blog & slot articles.* tidak kosong) ----
  const now = new Date();
  await Promise.all(
    Array.from({ length: 6 }).map((_, i) => {
      const title = `${persona.articles.title} #${i + 1}`;
      return prisma.article.create({
        data: {
          websiteId: website.id,
          title,
          slug: `${persona.slug}-artikel-${i + 1}`,
          excerpt: `${persona.articles.subtitle} Edisi ke-${i + 1}.`,
          content: `${persona.description}\n\nArtikel edisi ke-${i + 1} ini membahas topik seputar produk dan tips penggunaan dari ${persona.brandName}.`,
          coverImageUrl: img(`${persona.slug}-article-${i + 1}`),
          seoTitle: title,
          seoDescription: persona.articles.subtitle,
          status: "published",
          sortOrder: i + 1,
          isFeatured: i < 2,
          featuredOrder: i < 2 ? i + 1 : 0,
          publishedAt: new Date(now.getTime() - i * 86400000)
        }
      });
    })
  );

  await prisma.user.update({ where: { id: owner.id }, data: { primaryWebsiteId: website.id } });

  return { owner, website, productsCount: seedData.products.length, categoriesCount: categories.length };
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  const results: { type: string; theme: Theme; email: string; slug: string; brand: string }[] = [];

  for (const theme of THEMES) {
    const persona = COMPANY_PROFILE_PERSONAS[theme];
    const { website, owner } = await seedCompanyProfileWebsite(persona);
    results.push({ type: "Company Profile", theme, email: owner.email, slug: website.slug, brand: persona.brandName });
    console.log(`✔ Company Profile [${theme}] siap: ${website.slug}`);
  }

  for (const theme of THEMES) {
    const persona = CATALOG_PRODUCT_PERSONAS[theme];
    const { website, owner } = await seedCatalogProductWebsite(persona);
    results.push({ type: "Katalog Produk", theme, email: owner.email, slug: website.slug, brand: persona.brandName });
    console.log(`✔ Katalog Produk [${theme}] siap: ${website.slug}`);
  }

  console.log("\n================= AKUN DEMO SHOWCASE =================");
  for (const r of results) {
    console.log(`${r.type.padEnd(16)} | ${r.theme.padEnd(8)} | ${r.brand.padEnd(28)} | ${r.email} | password: ${DEMO_PASSWORD} | /${r.slug}`);
  }
  console.log("========================================================\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
