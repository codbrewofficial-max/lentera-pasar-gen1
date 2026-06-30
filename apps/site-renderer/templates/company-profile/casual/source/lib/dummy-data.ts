export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  color: string;
  price: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  client: string;
  year: string;
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Desain Identitas Brand',
    shortDesc: 'Logo unik, palet warna ceria, & panduan gaya visual agar brand kamu langsung dikenali.',
    iconName: 'Sparkles',
    color: '#649FF6',
    price: 'Mulai dari Rp 2.5 Juta',
  },
  {
    id: 'srv-2',
    title: 'Sosial Media Management',
    shortDesc: 'Konten Instagram & TikTok estetik lengkap dengan copywriting seru serta riset hashtag harian.',
    iconName: 'Instagram',
    color: '#F56B71',
    price: 'Mulai dari Rp 3 Juta / Bln',
  },
  {
    id: 'srv-3',
    title: 'Website Builder UMKM',
    shortDesc: 'Situs web super cepat, mobile-friendly, dan mudah diedit agar jualanmu naik kelas di internet.',
    iconName: 'Laptop',
    color: '#B283AF',
    price: 'Mulai dari Rp 4 Juta',
  },
  {
    id: 'srv-4',
    title: 'Foto & Video Produk',
    shortDesc: 'Sesi foto profesional di studio kami dengan props kreatif yang disesuaikan tema brand kamu.',
    iconName: 'Camera',
    color: '#649FF6',
    price: 'Mulai dari Rp 1.5 Juta',
  },
];

export const portfolioData: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Kopi Kenangan Senja',
    category: 'Branding & Kemasan',
    imageUrl: 'https://picsum.photos/seed/kopi/800/600',
    description: 'Re-branding kemasan kopi susu botol dan cup plastik ramah lingkungan dengan ilustrasi gaya retro yang hangat dan bersahabat.',
    client: 'Kenangan Senja Group',
    year: '2025',
  },
  {
    id: 'port-2',
    title: 'Dapur Mama Selera',
    category: 'Sosial Media',
    imageUrl: 'https://picsum.photos/seed/catering/800/600',
    description: 'Transformasi feed Instagram menjadi bento-style yang interaktif dengan skema warna cerah yang membangkitkan selera makan.',
    client: 'Dapur Mama Selera Catering',
    year: '2025',
  },
  {
    id: 'port-3',
    title: 'Tenun Karsa Jaya',
    category: 'Website Desain',
    imageUrl: 'https://picsum.photos/seed/tenun/800/600',
    description: 'Pembuatan katalog website modern berbasis landing page interaktif dengan fitur filter kain tenun nusantara yang estetik.',
    client: 'Karsa Jaya Craft',
    year: '2026',
  },
  {
    id: 'port-4',
    title: 'Studio Keramik Bumi',
    category: 'Kampanye Foto',
    imageUrl: 'https://picsum.photos/seed/keramik/800/600',
    description: 'Sesi dokumentasi produk kerajinan tangan berbahan tanah liat dengan pencahayaan alami nan lembut untuk menonjolkan tekstur organik.',
    client: 'Studio Keramik Bumi',
    year: '2026',
  },
];

export const articlesData: ArticleItem[] = [
  {
    id: 'art-1',
    slug: '5-tips-branding-umkm-kuliner',
    title: '5 Tips Branding Sederhana agar Bisnis Kuliner Dilirik Banyak Pembeli',
    excerpt: 'Jangan cuma fokus di rasa! Kemasan lucu dan visual sosial media yang menggugah selera juga kunci sukses jualan online.',
    content: `Branding bukan cuma milik korporat besar berbudget miliaran rupiah. Bagi bisnis kuliner skala UMKM di Indonesia, memiliki branding yang ramah dan menarik justru adalah jalan ninja memenangkan hati pelanggan lokal. 

Berikut adalah 5 tips sederhana yang langsung bisa kamu praktikkan hari ini:

1. **Gunakan Warna yang Memicu Rasa Lapar**
   Menurut penelitian psikologi warna, warna-warna hangat seperti merah, coral, kuning, dan oranye dapat memicu pelepasan hormon lapar di otak manusia. Tidak heran jika brand raksasa menggunakan skema warna ini. Untuk UMKM, pilihlah varian warna hangat yang casual, misalnya soft coral atau pastel oranye, agar terlihat lebih modern.

2. **Ceritakan Kisah di Balik Layar (Storytelling)**
   Orang tidak hanya membeli makanan, mereka juga membeli cerita. Tunjukkan proses pembuatan dapur yang bersih, bagaimana kamu memilih bahan-bahan lokal berkualitas, atau kisah perjuangan kamu saat memulai bisnis ini. Ini menciptakan keterikatan emosi yang erat.

3. **Kemasan yang Instagrammable**
   Apakah kemasan makananmu saat ini aman dikirim tapi terasa biasa saja? Coba tambahkan stiker dengan pesan ramah, atau buat box dengan warna ceria. Ketika pelanggan menerima paket, hal pertama yang mereka lakukan adalah memotretnya dan mengunggahnya ke Instagram Story. Kemasan yang lucu adalah iklan gratis!

4. **Konsistensi Gaya Visual**
   Jika feed Instagram kamu hari ini berwarna biru, besok hijau tua kusam, dan lusa kuning neon, pelanggan akan kesulitan mengenali karakter tokomu. Tentukan 3 warna utama dan gunakan font yang konsisten dalam setiap poster promosi.

5. **Respons yang Hangat dan Santai**
   Gunakan gaya bahasa chat yang ceria ketika membalas pesan pelanggan. Hindari template kaku seperti "Yth. Pelanggan, pesanan Anda sedang kami proses." Lebih baik gunakan sapaan ramah seperti "Halo Kak! Pesanan nasi liwet lezatnya sedang diracik sepenuh hati oleh chef kami ya. Mohon tunggu sebentar!"`,
    imageUrl: 'https://picsum.photos/seed/foodbrand/1200/600',
    publishedAt: '25 Juni 2026',
    author: {
      name: 'Aria Satria',
      avatar: 'https://picsum.photos/seed/aria/100/100',
      role: 'Creative Director'
    },
    tags: ['Branding', 'Kuliner', 'Tips Bisnis']
  },
  {
    id: 'art-2',
    slug: 'cara-foto-produk-estetik-hp',
    title: 'Cara Foto Produk Terlihat Estetik Cuma Pakai HP & Cahaya Jendela',
    excerpt: 'Nggak usah beli kamera mahal dulu. Manfaatkan smartphone dan trik pencahayaan alami di dekat jendela rumah kamu!',
    content: `Banyak pemilik usaha kecil mengeluh karena tidak memiliki budget untuk menyewa fotografer profesional. Padahal, dengan smartphone di genggaman dan sedikit kreativitas, kamu sudah bisa memproduksi foto katalog produk yang bersaing di marketplace!

Ini adalah trik rahasia studio kami yang dapat kamu tiru secara gratis:

1. **Golden Rule: Gunakan Cahaya Alami (Natural Light)**
   Lupakan lampu flash bawaan HP yang sering kali membuat warna produk melenceng atau menghasilkan bayangan kasar. Cari jendela di rumahmu yang mendapatkan sinar matahari tidak langsung (terang tapi teduh, biasanya di pagi hari jam 08.00-10.00 atau sore jam 15.00-16.30). Tempatkan meja kerja fotomu di sebelah jendela tersebut.

2. **Gunakan Reflektor Sederhana**
   Untuk mengurangi bayangan gelap di sisi produk yang tidak terkena cahaya jendela, tempatkan selembar styrofoam putih atau kertas karton putih tebal di seberang jendela. Karton putih ini berfungsi sebagai pemantul cahaya alami yang membuat produk terlihat menyala merata dari kedua sisi.

3. **Background Netral atau Bertekstur Lembut**
   Gunakan kain linen, kertas bermotif semen semen halus, atau sebilah papan kayu rustic sebagai alas foto. Background yang bersih membiarkan mata audiens fokus sepenuhnya ke detail produk kamu.

4. **Kuasai Sudut Pengambilan Gambar (Angles)**
   - *Eye Level (Sejajar mata)*: Sangat bagus untuk produk botol minuman, toples selai, atau pajangan dekoratif.
   - *Flat Lay (Tegak lurus dari atas)*: Sempurna untuk produk makanan berpiring, pakaian, buku agenda, atau kombinasi aksesoris serasi.

5. **Edit Secukupnya, Jangan Over-saturated**
   Gunakan aplikasi gratis seperti Lightroom Mobile atau VSCO. Naikkan sedikit kecerahan (exposure), kurangi shadow, dan pastikan warna produk tetap terlihat asli agar pembeli tidak kecewa saat barang asli sampai di rumah mereka.`,
    imageUrl: 'https://picsum.photos/seed/phonephoto/1200/600',
    publishedAt: '20 Juni 2026',
    author: {
      name: 'Laras Atmaja',
      avatar: 'https://picsum.photos/seed/laras/100/100',
      role: 'Head Photographer'
    },
    tags: ['Fotografi', 'Tips HP', 'Visual']
  },
  {
    id: 'art-3',
    slug: 'trik-desain-logo-umkm',
    title: 'Trik Desain Logo yang Bagus & Mudah Diingat Tanpa Kesan Murahan',
    excerpt: 'Logo yang baik adalah logo yang sederhana. Hindari terlalu banyak elemen ruwet yang malah bikin susah dicetak atau dibaca.',
    content: `Logo adalah "wajah" utama bisnismu. Ketika seseorang melihat stiker di atas gelas kopimu, atau banner di profil WhatsApp tokomu, logo tersebut harus langsung bercerita tentang karakter usahamu.

Mengapa banyak logo UMKM terlihat kaku dan kurang bernilai tinggi? Biasanya karena mereka terjebak untuk memasukkan semua gambar ke dalam satu bulatan sempit.

Mari kita bahas trik mendesain logo yang clean, casual, tapi berkelas:

1. **Sederhanakan Bentuk (Keep It Simple)**
   Pikirkan logo-logo brand terkenal di dunia: apel tergigit, centang olahraga, atau lengkungan emas. Logo terbaik adalah yang paling sederhana karena mudah diingat dalam sekejap mata. Hindari menambahkan gradasi warna terlalu rumit, border hitam tebal, atau tumpukan efek 3D yang usang.

2. **Pilih Font dengan Karakter yang Sesuai**
   Jika bisnismu adalah mainan anak atau studio kreatif casual, gunakan font berjenis rounded sans-serif yang ramah dan menyenangkan. Sebaliknya, jika jasamu adalah bimbingan belajar atau kantor hukum, pilih sans-serif yang modern dan tegas. Jangan sekali-kali menggabungkan lebih dari dua jenis font berbeda di satu logo.

3. **Uji Keterbacaan dalam Ukuran Kecil**
   Logo yang bagus harus tetap terlihat jelas meskipun diperkecil sampai ukuran 1 cm x 1 cm (misalnya sebagai ikon profil WhatsApp Business). Jika teks atau ikon kecil di dalam logomu melebur menjadi noda hitam tak terbaca saat diperkecil, tandanya logomu terlalu rumit!

4. **Batasi Palet Warna**
   Cukup gunakan 1 hingga maksimal 3 warna utama yang saling berpasangan secara harmonis. Misalnya paduan biru muda ramah dan coral energik, atau lavender lembut dengan abu-abu hangat.`,
    imageUrl: 'https://picsum.photos/seed/logodesign/1200/600',
    publishedAt: '12 Juni 2026',
    author: {
      name: 'Rian Hidayat',
      avatar: 'https://picsum.photos/seed/rian/100/100',
      role: 'Brand Specialist'
    },
    tags: ['Branding', 'Desain', 'UMKM']
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Aria Satria',
    role: 'Creative Director',
    imageUrl: 'https://picsum.photos/seed/team1/400/400',
    bio: 'Pencinta kopi yang gemar mengubah ide-ide abstrak pemilik usaha menjadi sketsa visual yang menggemaskan dan penuh cerita.'
  },
  {
    id: 'team-2',
    name: 'Laras Atmaja',
    role: 'Lead Photographer & Stylist',
    imageUrl: 'https://picsum.photos/seed/team2/400/400',
    bio: 'Memiliki radar alami untuk mendeteksi pencahayaan terbaik di sudut ruangan manapun. Spesialis pencipta estetika alami.'
  },
  {
    id: 'team-3',
    name: 'Rian Hidayat',
    role: 'Digital Strategist & Copywriter',
    imageUrl: 'https://picsum.photos/seed/team3/400/400',
    bio: 'Menulis caption sosial media yang terasa akrab layaknya bertukar pesan dengan sahabat karib, meningkatkan interaksi tanpa terkesan memaksa.'
  }
];

export const timelineData: TimelineItem[] = [
  {
    year: '2022',
    title: 'Lahir di Kedai Kopi',
    desc: 'Ruang Karsa berawal dari 3 sahabat kreatif yang berkumpul di Bandung, menawarkan jasa poster digital sederhana untuk toko roti teman kuliah.'
  },
  {
    year: '2023',
    title: 'Mendampingi 50+ UMKM',
    desc: 'Kami resmi mendirikan studio kecil di Dipati Ukur. Meluncurkan paket branding terjangkau yang fokus membantu UMKM kuliner lokal naik kelas.'
  },
  {
    year: '2024',
    title: 'Ekspansi Layanan Digital',
    desc: 'Menambahkan tim pengembang web dan pakar strategi konten TikTok. Membantu memperluas jangkauan UMKM ke luar kota Bandung.'
  },
  {
    year: '2026',
    title: 'Menjadi Partner Tepercaya',
    desc: 'Kini dipercaya oleh lebih dari 200 pemilik usaha mandiri di seluruh Indonesia untuk mendesain wajah digital brand mereka.'
  }
];

export const faqData: FaqItem[] = [
  {
    question: 'Berapa lama proses pembuatan identitas brand di Ruang Karsa?',
    answer: 'Biasanya berkisar antara 2 hingga 3 minggu sejak sesi brainstorming awal. Kami tidak buru-buru karena ingin memastikan visual logo dan moodboard benar-benar mewakili jiwa dari bisnismu.'
  },
  {
    question: 'Apakah saya bisa mengajukan revisi jika desain kurang cocok?',
    answer: 'Tentu saja! Di setiap paket kami selalu menyertakan sesi revisi (biasanya 2-3 kali revisi mayor). Kami bekerja dengan suasana santai dan diskusi terbuka agar kamu merasa nyaman mencurahkan ide.'
  },
  {
    question: 'Bagaimana jika saya berlokasi di luar Bandung?',
    answer: 'Tidak masalah sama sekali! Lebih dari 60% klien kami berasal dari luar kota (Jakarta, Yogyakarta, Surabaya, Medan, hingga Bali). Seluruh proses diskusi, pengiriman produk fisik untuk sesi foto, dan penyerahan aset dilakukan secara online lewat Zoom dan WhatsApp.'
  },
  {
    question: 'Apakah aset desain logo akan menjadi milik saya sepenuhnya?',
    answer: 'Ya, 100%! Semua file master resolusi tinggi (.AI, .PNG, .SVG, .PDF) akan diserahkan dalam cloud folder pribadi setelah pelunasan dilakukan, siap digunakan untuk cetak kemasan atau kaos.'
  }
];
