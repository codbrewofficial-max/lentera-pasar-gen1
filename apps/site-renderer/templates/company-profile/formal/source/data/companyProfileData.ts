import { 
  CompanyData, 
  StatItem, 
  ServiceItem, 
  PortfolioItem, 
  TestimonialItem, 
  TimelineItem, 
  ValueItem, 
  TeamItem, 
  ProcessStep, 
  BenefitItem, 
  FaqItem, 
  ArticleItem 
} from "../lib/types";

export const companyData: CompanyData = {
  name: "Integra Consulting Group",
  tagline: "Mitra Strategis Pertumbuhan & Kepatuhan Bisnis Anda",
  description: "Integra Consulting Group adalah lembaga konsultan manajemen, legalitas, dan kepatuhan hukum B2B terkemuka yang membantu korporasi menavigasi regulasi kompleks dan memaksimalkan efisiensi operasional.",
  logoUrl: "/assets/images/logo.png",
  establishedYear: "2012",
  founderName: "Prof. Dr. Hendra Wijaya, S.H., M.B.A.",
  aboutImage: "https://picsum.photos/seed/integra-about/800/600",
  vision: "Menjadi mitra konsultasi bisnis terpercaya di Asia Tenggara yang mendorong kepatuhan standar global, inovasi organisasi, dan pertumbuhan bisnis yang berkelanjutan.",
  mission: [
    "Menyediakan solusi legalitas korporasi, kepatuhan regulasi, dan audit hukum terintegrasi berstandar tinggi.",
    "Mengembangkan kapasitas internal organisasi melalui restrukturisasi manajemen dan pelatihan kepemimpinan.",
    "Memberikan analisis risiko strategis yang akurat untuk mendukung pengambilan keputusan bisnis yang aman.",
    "Membangun ekosistem bisnis yang transparan, akuntabel, dan ramah investasi."
  ],
  contact: {
    address: "Sudirman Central Business District (SCBD), Tower Premium, Lantai 42, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan, DKI Jakarta 12190",
    email: "info@integraconsulting.co.id",
    phone: "+62 (21) 5088-9900",
    whatsapp: "+62 811-9900-8811",
    workingHours: "Senin - Jumat: 08.30 - 17.30 WIB (Sabtu, Minggu & Hari Libur Tutup)",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2538600115053!2d106.8083818!3d-6.223605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15055555555%3A0x2d87e02595dc0f89!2sSudirman%20Central%20Business%20District!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
  }
};

export const statsData: StatItem[] = [
  { label: "Klien Korporasi", value: "500+" },
  { label: "Konsultan Ahli", value: "45" },
  { label: "Tingkat Kesuksesan", value: "98.5%" },
  { label: "Tahun Pengalaman", value: "14" }
];

export const servicesData: ServiceItem[] = [
  {
    id: "legal-corporate",
    title: "Legalitas & Kepatuhan Korporasi",
    description: "Pendirian badan usaha (PT, PMA), peninjauan kontrak komersial, kepatuhan regulasi sektoral, serta perizinan investasi terintegrasi secara aman.",
    iconName: "Shield",
    features: [
      "Pendirian PT Lokal & Penanaman Modal Asing (PMA)",
      "Penyusunan & Audit Kontrak Komersial",
      "Sertifikasi Izin Usaha Industri & Sektoral",
      "Kepatuhan Hukum Ketenagakerjaan"
    ]
  },
  {
    id: "business-restructuring",
    title: "Restrukturisasi & Manajemen Strategis",
    description: "Evaluasi kinerja organisasi, perancangan ulang proses bisnis, manajemen perubahan, hingga tata kelola perusahaan yang baik (GCG).",
    iconName: "TrendingUp",
    features: [
      "Penilaian Efisiensi Struktur Organisasi",
      "Perumusan Indikator Kinerja Utama (KPI)",
      "Panduan Tata Kelola Perusahaan (Good Corporate Governance)",
      "Mitigasi Risiko Bisnis Operasional"
    ]
  },
  {
    id: "tax-financial-advisory",
    title: "Konsultasi Pajak & Keuangan B2B",
    description: "Strategi perencanaan pajak legal, pelaporan SPT badan keuangan, audit keuangan internal, dan dukungan proses transaksional korporat.",
    iconName: "Briefcase",
    features: [
      "Perencanaan & Manajemen Pajak Tahunan",
      "Audit & Review Laporan Keuangan",
      "Penilaian Nilai Perusahaan (Valuasi)",
      "Konsultasi Merger dan Akuisisi (M&A)"
    ]
  },
  {
    id: "risk-management",
    title: "Manajemen Risiko & Kepatuhan Hukum",
    description: "Identifikasi dini celah kepatuhan regulasi, pemetaan risiko operasional, audit forensik, dan penyusunan mitigasi mitigasi litigasi.",
    iconName: "Activity",
    features: [
      "Audit Celah Hukum Kepatuhan Regulasi",
      "Manajemen Risiko Operasional",
      "Program Anti-Suap & Anti-Korupsi",
      "Penyelesaian Sengketa Non-Litigasi"
    ]
  },
  {
    id: "esg-consulting",
    title: "Konsultasi Lingkungan & ESG",
    description: "Membantu perusahaan merancang program keberlanjutan sesuai dengan standar Environmental, Social, and Governance global.",
    iconName: "Globe",
    features: [
      "Penyusunan Laporan Keberlanjutan (ESG Report)",
      "Audit Kepatuhan Lingkungan & AMDAL",
      "Pengembangan Program Tanggung Jawab Sosial (CSR)",
      "Sertifikasi Industri Hijau"
    ]
  },
  {
    id: "corporate-training",
    title: "Pelatihan & Sertifikasi Profesional",
    description: "Program peningkatan kompetensi SDM bertema kepemimpinan, kepatuhan hukum praktis, etika bisnis, dan tata kelola modern.",
    iconName: "Award",
    features: [
      "Pelatihan Legalitas Praktis Non-Hukum",
      "Workshop Tata Kelola & Kepatuhan B2B",
      "Sertifikasi Kompetensi Profesional Internal",
      "Program Eksekutif Kepemimpinan Strategis"
    ]
  }
];

export const portfolioData: PortfolioItem[] = [
  {
    id: "restrukturisasi-energi",
    slug: "restrukturisasi-energi",
    title: "Restrukturisasi Organisasi PT Nusantara Energi",
    category: "Restrukturisasi & Manajemen",
    clientName: "PT Nusantara Energi Tbk",
    year: "2024",
    description: "Melakukan restrukturisasi birokrasi organisasi skala besar untuk meningkatkan produktivitas serta menurunkan biaya operasional tahunan secara aman.",
    imageUrl: "https://picsum.photos/seed/portfolio-energy/800/500",
    challenge: "PT Nusantara Energi mengalami tumpang tindih fungsi di 12 anak usahanya, mengakibatkan pengambilan keputusan yang lambat dan pembengkakan pengeluaran operasional hingga 22% dari anggaran industri standar.",
    solution: "Integra merancang peta proses bisnis baru yang ramping, menggabungkan departemen pendukung yang redundan, menyusun KPI berbasis sasaran berjenjang, dan mendampingi transisi SDM selama 8 bulan.",
    result: "Penurunan biaya operasional sebesar 18.5% dalam setahun pertama, percepatan waktu persetujuan proyek lintas divisi hingga 40%, serta zero-litigation selama transisi restrukturisasi."
  },
  {
    id: "kepatuhan-legalitas-pma",
    slug: "kepatuhan-legalitas-pma",
    title: "Kepatuhan Hukum & Izin PMA MedTech Global",
    category: "Legalitas & Kepatuhan",
    clientName: "MedTech Global Corp Inc.",
    year: "2023",
    description: "Membantu memandu ekspansi produsen perangkat medis internasional mendirikan Penanaman Modal Asing (PMA) dan memperoleh sertifikasi izin industri di Indonesia.",
    imageUrl: "https://picsum.photos/seed/portfolio-medical/800/500",
    challenge: "Menghadapi regulasi alat kesehatan lokal yang sangat ketat dan berbelit-belit, serta membutuhkan keselarasan kepatuhan hukum investasi asing yang dinamis di Indonesia.",
    solution: "Memberikan nasihat hukum investasi komprehensif, mengurus perizinan di portal OSS-RBA, mendampingi perolehan Izin Edar Alat Kesehatan, dan menyusun draf kontrak ketenagakerjaan berstandar lokal.",
    result: "PMA berhasil didirikan dalam waktu 45 hari kerja, semua izin operasional diperoleh dengan kepatuhan 100%, serta meluncurkan fasilitas manufaktur pertama di Karawang tepat waktu."
  },
  {
    id: "audit-pajak-konstruksi",
    slug: "audit-pajak-konstruksi",
    title: "Optimasi Audit Pajak Agung Beton Pratama",
    category: "Pajak & Keuangan",
    clientName: "PT Agung Beton Pratama",
    year: "2025",
    description: "Menyelesaikan restrukturisasi pembukuan perpajakan dan membimbing audit pajak badan dari otoritas berwenang secara adil dan transparan.",
    imageUrl: "https://picsum.photos/seed/portfolio-concrete/800/500",
    challenge: "Adanya selisih interpretasi transaksi ekspor-impor material dalam audit pajak tahunan yang berpotensi memicu denda administratif miliaran rupiah.",
    solution: "Menganalisis ulang seluruh invoice dan dokumen bea cukai 3 tahun terakhir, melakukan rekonsiliasi fiskal formal, serta mewakili korporasi dalam dengar pendapat resmi dengan pemeriksa pajak.",
    result: "Klarifikasi audit pajak diterima sepenuhnya, potensi denda administrasi berkurang hingga 85% berdasarkan interpretasi hukum perpajakan yang sah, dan pembukuan internal kini sesuai standar kepatuhan nasional."
  },
  {
    id: "implementasi-esg-agro",
    slug: "implementasi-esg-agro",
    title: "Implementasi ESG & Strategi CSR Bumi Agro Lestari",
    category: "Lingkungan & ESG",
    clientName: "PT Bumi Agro Lestari",
    year: "2024",
    description: "Merancang strategi integrasi kebijakan ESG perusahaan serta penyusunan laporan keberlanjutan tahunan bersertifikasi global.",
    imageUrl: "https://picsum.photos/seed/portfolio-agro/800/500",
    challenge: "Tekanan dari investor institusi global yang menuntut bukti nyata dari praktik keberlanjutan lingkungan dan kontribusi sosial yang terukur di wilayah operasional perkebunan.",
    solution: "Melakukan penilaian kesenjangan materialitas ESG, menyusun strategi manajemen limbah tanpa pembakaran, serta merancang program pemberdayaan ekonomi masyarakat berbasis koperasi pertanian binaan.",
    result: "Berhasil meluncurkan Sustainability Report pertama sesuai kerangka kerja standar GRI, skor indeks ESG perusahaan melonjak menjadi peringkat 'Baik', dan mendapatkan pendanaan hijau tambahan senilai $15M."
  },
  {
    id: "manajemen-risiko-fintech",
    slug: "manajemen-risiko-fintech",
    title: "Mitigasi Risiko Regulasi Digital Finansial Utama",
    category: "Manajemen Risiko",
    clientName: "PT Finansial Utama Indonesia",
    year: "2025",
    description: "Membangun sistem pengawasan kepatuhan kepatuhan (Compliance Check System) untuk memenuhi standar baru Bank Indonesia dan Otoritas Jasa Keuangan.",
    imageUrl: "https://picsum.photos/seed/portfolio-fintech/800/500",
    challenge: "Perubahan cepat pada regulasi privasi data pengguna dan aturan anti-pencucian uang (APU-PPT) yang menuntut peningkatan sistem deteksi transaksi secara real-time.",
    solution: "Melakukan audit kesenjangan tata kelola data, menyusun kebijakan internal tata kelola privasi informasi, serta memberikan pelatihan audit investigasi bagi tim kepatuhan internal perusahaan.",
    result: "Lulus audit berkala OJK dengan predikat kepatuhan penuh, peluncuran modul transaksi tanpa interupsi hukum, dan penurunan keluhan insiden kebocoran data pengguna hingga 0%."
  },
  {
    id: "legalitas-merger-logistik",
    slug: "legalitas-merger-logistik",
    title: "M&A Legal Due Diligence Nusantara Logistik",
    category: "Legalitas & Kepatuhan",
    clientName: "Nusantara Cargo Group",
    year: "2023",
    description: "Melakukan uji tuntas hukum (Legal Due Diligence) komprehensif dalam rangka akuisisi 3 perusahaan ekspedisi regional.",
    imageUrl: "https://picsum.photos/seed/portfolio-logistic/800/500",
    challenge: "Keterbatasan waktu penyelesaian transaksi akuisisi dan adanya kekhawatiran atas liabilitas tersembunyi dari aset bermasalah milik perusahaan target.",
    solution: "Mengerahkan tim audit hukum khusus untuk meneliti kepemilikan aset, lisensi armada angkutan, sengketa perburuhan lama, serta status pinjaman di bank milik target akuisisi.",
    result: "Menemukan celah risiko liabilitas lama senilai Rp 12M yang berhasil digunakan untuk menegosiasikan pengurangan harga beli final, memastikan kontrak akuisisi aman dan berkekuatan hukum penuh."
  }
];

export const testimonialData: TestimonialItem[] = [
  {
    id: "t-1",
    name: "Ir. Bambang Hartono",
    role: "Direktur Utama",
    company: "PT Nusantara Energi Tbk",
    quote: "Keahlian Integra dalam restrukturisasi organisasi sangat profesional. Mereka tidak sekadar memberikan rekomendasi teoretis, melainkan mengawal transisi operasional langsung di lapangan bersama manajemen kami sampai berhasil.",
    rating: 5,
    logoUrl: "/assets/images/logo1.png"
  },
  {
    id: "t-2",
    name: "Sarah Jenkins",
    role: "VP Investment & Operations",
    company: "MedTech Global Corp Inc.",
    quote: "Mendirikan PMA di Indonesia awalnya tampak sangat rumit karena regulasi yang kerap berubah. Integra menyelesaikannya dengan komunikasi yang jelas, efisien, dan kepatuhan hukum tanpa celah.",
    rating: 5,
    logoUrl: "/assets/images/logo2.png"
  },
  {
    id: "t-3",
    name: "Haryo Prakoso",
    role: "Chief Financial Officer",
    company: "PT Agung Beton Pratama",
    quote: "Integra mendampingi kami dalam audit pajak korporat dengan sangat transparan. Kemampuan mereka menerjemahkan aturan perpajakan yang rumit ke dalam argumentasi hukum yang kuat sangat membantu kasus kami.",
    rating: 5,
    logoUrl: "/assets/images/logo3.png"
  },
  {
    id: "t-4",
    name: "Diana Wijaya",
    role: "Direktur Keberlanjutan & CSR",
    company: "PT Bumi Agro Lestari",
    quote: "Pendampingan penyusunan Sustainability Report oleh Integra sangat luar biasa. Berkat metodologi materialitas ESG mereka yang akurat, perusahaan kami kini dihargai tinggi oleh investor institusi hijau global.",
    rating: 4,
    logoUrl: "/assets/images/logo4.png"
  },
  {
    id: "t-5",
    name: "Rendy Syahputra",
    role: "Chief Compliance Officer",
    company: "PT Finansial Utama Indonesia",
    quote: "Kecepatan merespons konsultasi regulasi baru BI dan OJK dari tim Integra sangat luar biasa. Dukungan hukum mereka membuat kami melangkah dengan percaya diri di sektor fintech yang berisiko kepatuhan tinggi.",
    rating: 5,
    logoUrl: "/assets/images/logo5.png"
  }
];

export const timelineData: TimelineItem[] = [
  {
    year: "2012",
    title: "Pendirian Kantor Pertama",
    description: "Didirikan di Jakarta oleh Prof. Dr. Hendra Wijaya dengan fokus awal layanan penasihat hukum korporat dan perizinan dasar untuk perusahaan lokal."
  },
  {
    year: "2016",
    title: "Ekspansi Divisi Manajemen Strategis",
    description: "Membuka lini bisnis baru untuk restrukturisasi organisasi, manajemen risiko, dan tata kelola perusahaan (GCG) guna memenuhi tingginya permintaan klien."
  },
  {
    year: "2020",
    title: "Digitalisasi & Konsultasi Jarak Jauh",
    description: "Meluncurkan portal konsultasi hukum & manajemen digital yang komprehensif selama masa pandemi, meminimalkan disrupsi operasional klien secara optimal."
  },
  {
    year: "2024",
    title: "Komitmen ESG & Ekspansi Regional",
    description: "Membuka layanan konsultasi kepatuhan ESG berstandar internasional dan menandatangani kemitraan strategis dengan firma audit global di Singapura."
  }
];

export const valuesData: ValueItem[] = [
  {
    title: "Integritas Tanpa Kompromi",
    description: "Kami mengutamakan prinsip kepatuhan hukum, kejujuran objektif, dan etika profesi tinggi dalam setiap analisis dan rekomendasi yang kami berikan.",
    iconName: "Shield"
  },
  {
    title: "Keunggulan Profesional",
    description: "Menghadirkan layanan berkualitas tinggi didasarkan riset regulasi yang mendalam, pemahaman bisnis praktis, dan keahlian tim konsultan berpengalaman.",
    iconName: "Award"
  },
  {
    title: "Kolaborasi Solutif",
    description: "Bekerja secara sinergis berdampingan bersama manajemen internal klien guna melahirkan solusi operasional yang realistis dan dapat dieksekusi dengan aman.",
    iconName: "Users"
  },
  {
    title: "Inovasi Adaptif",
    description: "Terus memperbarui pendekatan dan metodologi kerja kami agar tetap selaras dengan perkembangan teknologi bisnis dan dinamika regulasi makro.",
    iconName: "TrendingUp"
  }
];

export const teamData: TeamItem[] = [
  {
    id: "member-1",
    name: "Prof. Dr. Hendra Wijaya, S.H., M.B.A.",
    role: "Founder & Senior Managing Partner",
    bio: "Pakar hukum korporasi dengan pengalaman lebih dari 25 tahun sebagai penasihat kementerian dan direksi BUMN utama. Menyelesaikan gelar Doktor Hukum di Universitas Indonesia dan MBA di Harvard Business School.",
    imageUrl: "https://picsum.photos/seed/team-hendra/400/400",
    social: {
      linkedin: "https://linkedin.com/in/dummy-hendra-wijaya"
    }
  },
  {
    id: "member-2",
    name: "Mariana Lubis, S.E., M.Ak., Ak., BKP",
    role: "Partner & Head of Tax Advisory",
    bio: "Spesialis perpajakan dan keuangan badan dengan pengalaman panjang memimpin proses sengketa fiskal multinasional. Anggota Ikatan Konsultan Pajak Indonesia yang berkecimpung di industri pajak selama 18 tahun.",
    imageUrl: "https://picsum.photos/seed/team-mariana/400/400",
    social: {
      linkedin: "https://linkedin.com/in/dummy-mariana-lubis"
    }
  },
  {
    id: "member-3",
    name: "Aditya Pratama, M.Sc., PMP",
    role: "Partner & Head of Business Restructuring",
    bio: "Ahli tata kelola operasional dan efisiensi organisasi bersertifikat PMP global. Berpengalaman merestrukturisasi rantai pasok dan arsitektur korporasi di sektor logistik, pertambangan, dan FMCG.",
    imageUrl: "https://picsum.photos/seed/team-aditya/400/400",
    social: {
      linkedin: "https://linkedin.com/in/dummy-aditya-pratama"
    }
  },
  {
    id: "member-4",
    name: "Ria Sitorus, S.H., LL.M.",
    role: "Senior Counsel of Investment & ESG Compliance",
    bio: "Mantan penasihat investasi asing di kementerian terkait dengan spesialisasi perizinan PMA, kepatuhan lingkungan internasional, dan penyusunan kerangka kepatuhan ESG perusahaan publik.",
    imageUrl: "https://picsum.photos/seed/team-ria/400/400",
    social: {
      linkedin: "https://linkedin.com/in/dummy-ria-sitorus"
    }
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Konsultasi & Analisis Awal",
    description: "Pertemuan diagnostik mendalam untuk memahami tantangan kepatuhan hukum, struktur operasional, atau sasaran strategis jangka panjang korporasi Anda."
  },
  {
    step: "02",
    title: "Audit Kesenjangan & Pemetaan Risiko",
    description: "Tim ahli kami melakukan penelaahan mendalam terhadap dokumen internal, kepatuhan regulasi eksternal, dan proses bisnis untuk memetakan risiko krusial."
  },
  {
    step: "03",
    title: "Formulasi Rekomendasi Solusi",
    description: "Penyusunan peta jalan strategis terperinci, draf hukum pelindung, rancangan arsitektur organisasi baru, atau strategi pajak yang sah demi keselamatan korporasi."
  },
  {
    step: "04",
    title: "Pendampingan Eksekusi & Evaluasi",
    description: "Kami turut serta memandu implementasi kebijakan baru di lapangan, melatih tim internal, meninjau kemajuan berkala, hingga memastikan sasaran tercapai optimal."
  }
];

export const benefitData: BenefitItem[] = [
  {
    title: "Kredibilitas Hukum Terjamin",
    description: "Didukung praktisi hukum bersertifikat, pakar regulasi senior, dan konsultan berizin resmi yang menjamin keabsahan semua dokumen dan hasil penasihat.",
    iconName: "Shield"
  },
  {
    title: "Pendekatan Holistik Terintegrasi",
    description: "Kami menyelaraskan aspek kepatuhan hukum dengan tujuan komersial bisnis serta perencanaan keuangan perpajakan perusahaan agar sejalan dan saling memperkuat.",
    iconName: "Compass"
  },
  {
    title: "Jaringan Institusi Luas",
    description: "Memiliki hubungan profesional yang baik dan etis dengan kementerian, lembaga pemerintah, asosiasi bisnis, serta praktisi industri guna mendukung kelancaran urusan.",
    iconName: "Users"
  },
  {
    title: "Fokus Solusi Praktis Berkelanjutan",
    description: "Menghindari saran teoretis yang mengambang. Setiap dokumen keluaran (output) kami dirancang agar langsung dapat digunakan dan aman diimplementasikan.",
    iconName: "CheckCircle"
  }
];

export const faqData: FaqItem[] = [
  {
    question: "Bagaimana cara kerja skema kerja sama konsultasi di Integra Consulting Group?",
    answer: "Kami menawarkan skema konsultasi berbasis proyek (Project-based) untuk kebutuhan spesifik seperti restrukturisasi atau perizinan PMA, serta skema retensi bulanan (Retainer Agreement) bagi korporat yang membutuhkan nasihat hukum dan kepatuhan pajak berkelanjutan."
  },
  {
    question: "Berapa lama waktu yang dibutuhkan untuk pendirian Penanaman Modal Asing (PMA) baru?",
    answer: "Proses pendirian PT PMA umumnya memakan waktu 30 hingga 45 hari kerja pasca penandatanganan akta notaris, tergantung pada kelengkapan dokumen persyaratan investor dan kecepatan verifikasi sektor usaha di portal OSS-RBA pemerintah."
  },
  {
    question: "Apakah data dan dokumen bisnis kami aman di bawah jaminan kerahasiaan?",
    answer: "Ya, jaminan keamanan data klien adalah prioritas utama kami. Setiap kerja sama diawali dengan penandatanganan Perjanjian Kerahasiaan (Non-Disclosure Agreement / NDA) yang ketat untuk mengikat secara hukum agar dokumen sensitif bisnis Anda terlindungi penuh."
  },
  {
    question: "Apakah Integra Consulting Group menyediakan layanan litigasi di pengadilan?",
    answer: "Fokus utama layanan hukum kami adalah korporasi non-litigasi (tindakan pencegahan, mediasi sengketa, legal drafting, kepatuhan tata kelola, dan perizinan investasi). Namun, jika klien kami membutuhkan advokasi di sidang pengadilan, kami memiliki jaringan firma hukum litigasi terafiliasi yang sangat terpercaya."
  },
  {
    question: "Bagaimana proses penyusunan Sustainability Report (ESG) bagi perusahaan publik?",
    answer: "Kami menggunakan standar pedoman Global Reporting Initiative (GRI) yang mencakup empat fase: (1) Penilaian kesenjangan & keselarasan awal, (2) Dialog pelibatan pemangku kepentingan untuk materialitas, (3) Pengumpulan data indikator kinerja ESG, dan (4) Penyuntingan serta jaminan kualitas laporan hingga publikasi resmi."
  },
  {
    question: "Bagaimana cara melakukan konsultasi pertama jika kami berlokasi di luar Jakarta?",
    answer: "Kami menyediakan opsi konsultasi video konferensi jarak jauh terenkripsi (melalui Google Meet atau Zoom). Setelah kesepakatan tercapai, tim konsultan ahli kami siap ditugaskan melakukan kunjungan lapangan langsung ke lokasi kantor atau operasional Anda di seluruh Indonesia."
  },
  {
    question: "Apakah Integra juga melayani konsultasi restrukturisasi untuk UMKM?",
    answer: "Meskipun mayoritas klien kami adalah perusahaan menengah dan korporasi multinasional, kami memiliki divisi khusus yang menyediakan program akselerasi kepatuhan hukum dan manajemen strategis dengan paket terjangkau bagi perusahaan berkembang yang sedang bertransisi menuju skala menengah."
  }
];

export const articlesData: ArticleItem[] = [
  {
    slug: "menavigasi-pma-terbaru-2026",
    title: "Menavigasi Regulasi PMA Terbaru 2026: Strategi Investasi Asing yang Aman",
    category: "Legalitas & Kepatuhan",
    publishDate: "2026-06-15",
    author: {
      name: "Ria Sitorus, S.H., LL.M.",
      role: "Senior Counsel of Investment",
      avatarUrl: "https://picsum.photos/seed/avatar-ria/100/100"
    },
    summary: "Analisis mendalam mengenai penyesuaian regulasi investasi asing terbaru di Indonesia, mencakup panduan kepatuhan portal OSS-RBA serta pemetaan sektor prioritas yang menguntungkan.",
    content: `<p>Dinamika regulasi Penanaman Modal Asing (PMA) di Indonesia terus berkembang pesat guna merespons iklim ekonomi makro global dan mendorong kemudahan berusaha. Memasuki kuartal kedua tahun 2026, pemerintah telah merilis serangkaian pembaruan penting pada sistem perizinan berbasis risiko (OSS-RBA) yang wajib dipahami oleh setiap korporasi multinasional yang berniat melakukan ekspansi.</p>
    
    <h3>Fokus Utama Perubahan Regulasi 2026</h3>
    <p>Ada tiga pilar utama yang mengalami pembaharuan signifikan dalam lanskap kepatuhan hukum investasi asing tahun ini:</p>
    <ul>
      <li><strong>Peningkatan Batas Minimum Modal Disetor:</strong> Kebijakan penyesuaian batasan modal disetor minimum bagi asing guna memastikan investasi yang masuk memiliki kapasitas teknologi tinggi dan menyerap tenaga kerja lokal secara profesional.</li>
      <li><strong>Harmonisasi KBLI & Hak Akses Sektoral:</strong> Penyelarasan Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) dengan ketentuan Daftar Positif Investasi terbaru, memperluas keterbukaan sektor energi baru terbarukan.</li>
      <li><strong>Sistem Penilaian Risiko Lingkungan Terotomatisasi:</strong> Integrasi persetujuan AMDAL digital dalam waktu yang lebih terprediksi bagi industri berkategori risiko menengah-tinggi.</li>
    </ul>

    <h3>Strategi Navigasi bagi Investor Asing</h3>
    <p>Menghadapi aturan yang semakin terstruktur, perusahaan disarankan untuk tidak sekadar mengajukan izin secara reaktif. Dibutuhkan uji kelayakan awal (Pre-Due Diligence) legalitas lokal guna memastikan kesiapan struktur pemegang saham, kecukupan dokumen kependudukan direksi asing, serta kesesuaian zonasi tata ruang wilayah industri terpilih.</p>
    
    <blockquote>"Kesalahan paling umum investor asing adalah mengabaikan kesesuaian tata ruang daerah sebelum mendirikan bangunan pabrik, yang akhirnya memicu penangguhan operasional berkepanjangan." - Ria Sitorus</blockquote>

    <p>Dengan kerja sama konsultasi hukum yang berdedikasi tinggi, tantangan regulasi ini sesungguhnya dapat diubah menjadi keunggulan bersaing pertama korporat Anda melalui percepatan jalur operasional pasar.</p>`,
    coverImageUrl: "https://picsum.photos/seed/article-pma/1200/600",
    readTime: "6 menit membaca"
  },
  {
    slug: "pentingnya-esg-report-bagi-b2b",
    title: "Mengapa Laporan Keberlanjutan ESG Kini Menjadi Kewajiban Mutlak bagi Bisnis B2B",
    category: "Lingkungan & ESG",
    publishDate: "2026-05-28",
    author: {
      name: "Aditya Pratama, M.Sc.",
      role: "Partner & Head of Management",
      avatarUrl: "https://picsum.photos/seed/avatar-aditya/100/100"
    },
    summary: "Laporan ESG bukan lagi sekadar pemanis citra perusahaan (greenwashing), melainkan prasyarat mutlak memenangkan kontrak vendor rantai pasok global dan pendanaan perbankan utama.",
    content: `<p>Jika sepuluh tahun lalu Environmental, Social, and Governance (ESG) dipandang hanya sebagai bagian dari program sukarela tanggung jawab sosial (CSR), hari ini lanskap tersebut telah bergeser secara radikal. Bagi perusahaan yang beroperasi di sektor business-to-business (B2B), kepatuhan ESG kini telah bertransformasi menjadi tiket masuk utama perdagangan korporasi internasional.</p>
    
    <h3>Tekanan Rantai Pasok Global</h3>
    <p>Pembeli korporat multinasional raksasa kini memiliki kewajiban global untuk mendeklarasikan jejak emisi karbon dan kepatuhan sosial dari seluruh lapisan rantai pasok mereka (Scope 3 Emissions). Jika perusahaan Anda selaku vendor penyedia bahan baku atau jasa pendukung tidak dapat membuktikan kepatuhan ESG yang terukur melalui dokumen formal, nama Anda akan tereliminasi secara otomatis dari daftar tender bergengsi.</p>

    <h3>Akses Pendanaan yang Lebih Murah</h3>
    <p>Perbankan besar nasional maupun institusi keuangan internasional telah menerapkan diskon bunga pinjaman modal khusus (Sustainability-Linked Loans) kepada debitur korporat yang mampu menyajikan Sustainability Report berstandar GRI yang lolos audit eksternal.</p>
    
    <p>Kesimpulannya, investasi pada penataan tata kelola lingkungan dan sosial bukan lagi pusat biaya (cost center) melainkan perlindungan nilai bisnis jangka panjang (value driver) yang sangat menguntungkan.</p>`,
    coverImageUrl: "https://picsum.photos/seed/article-esg/1200/600",
    readTime: "5 menit membaca"
  },
  {
    slug: "restrukturisasi-organisasi-pasca-pandemi",
    title: "Panduan Restrukturisasi Organisasi Tanpa Gejolak Hubungan Industrial",
    category: "Restrukturisasi & Manajemen",
    publishDate: "2026-04-12",
    author: {
      name: "Prof. Dr. Hendra Wijaya",
      role: "Founder & Senior Partner",
      avatarUrl: "https://picsum.photos/seed/avatar-hendra/100/100"
    },
    summary: "Cara merampingkan struktur hierarki korporasi, memangkas biaya yang tidak efisien, serta mengalokasikan ulang SDM secara persuasif sesuai dengan UU Cipta Kerja terbaru.",
    content: `<p>Kondisi pasar yang dinamis menuntut korporasi untuk bersikap lincah (agile). Restrukturisasi struktur organisasi sering kali menjadi jalan satu-satunya agar bisnis tetap relevan dan memiliki daya saing tinggi. Namun, banyak inisiatif perampingan ini yang gagal di tengah jalan, bukan karena konsep teoritisnya salah, melainkan karena gejolak perlawanan internal serta sengketa hubungan industrial yang menguras waktu dan energi.</p>
    
    <h3>Prinsip Komunikasi Persuasif & Keadilan Hukum</h3>
    <p>Restrukturisasi yang aman wajib dilandaskan pada transparansi data finansial kepada perwakilan serikat pekerja atau seluruh staf, kepatuhan nominal hak kompensasi sesuai hukum perburuhan nasional terbaru, serta penyusunan program pelatihan peralihan karier (Outplacement) yang humanis.</p>
    
    <p>Dengan memadukan pendekatan komunikasi kekeluargaan dan struktur hukum penyelesaian non-litigasi yang matang, perusahaan dapat melahirkan struktur organisasi yang baru tanpa perlu merusak reputasi moral korporasi di mata publik.</p>`,
    coverImageUrl: "https://picsum.photos/seed/article-restructuring/1200/600",
    readTime: "8 menit membaca"
  },
  {
    slug: "optimasi-pajak-badan-yang-legal",
    title: "Strategi Tax Planning Legal 2026 untuk Memaksimalkan Profitabilitas Perusahaan",
    category: "Pajak & Keuangan",
    publishDate: "2026-03-05",
    author: {
      name: "Mariana Lubis, S.E., M.Ak.",
      role: "Head of Tax Advisory",
      avatarUrl: "https://picsum.photos/seed/avatar-mariana/100/100"
    },
    summary: "Memahami batas tipis antara penghindaran pajak yang diperbolehkan (tax avoidance) dengan penggelapan pajak ilegal (tax evasion) demi mengamankan arus kas.",
    content: `<p>Banyak pengusaha mengira bahwa satu-satunya cara menghemat pajak adalah dengan menyembunyikan pendapatan. Ini adalah kekeliruan fatal yang dapat berujung pada sanksi pidana perpajakan berat. Melalui perencanaan pajak (Tax Planning) yang dirancang secara legal dan saintifik, korporasi dapat memanfaatkan celah insentif yang memang disediakan oleh undang-undang secara terhormat.</p>
    
    <h3>Memanfaatkan Tax Incentives yang Sah</h3>
    <p>Pemerintah memberikan fasilitas pengurangan tarif pajak bagi perusahaan publik tertentu, insentif super-deduction pajak bagi korporasi yang menyelenggarakan program magang vokasi atau riset inovasi mandiri, serta kebijakan percepatan depresiasi aset fisik.</p>
    
    <p>Dengan melakukan penyusunan laporan keuangan fiskal yang presisi sejak awal tahun buku, manajemen dapat menghemat pengeluaran pajak korporasi hingga puluhan persen secara legal dan akuntabel tanpa perlu mengkhawatirkan audit pajak di kemudian hari.</p>`,
    coverImageUrl: "https://picsum.photos/seed/article-tax/1200/600",
    readTime: "7 menit membaca"
  },
  {
    slug: "mengelola-risiko-kepatuhan-fintech",
    title: "Mengelola Risiko Kepatuhan Hukum di Sektor Fintech yang Bergerak Cepat",
    category: "Manajemen Risiko",
    publishDate: "2026-02-18",
    author: {
      name: "Rendy Syahputra",
      role: "Guest Contributor - CCO",
      avatarUrl: "https://picsum.photos/seed/avatar-rendy/100/100"
    },
    summary: "Bagaimana cara startup dan korporasi finansial digital menyeimbangkan antara kecepatan inovasi fitur aplikasi dengan kepatuhan terhadap aturan ketat OJK dan Bank Indonesia.",
    content: `<p>Sektor finansial berbasis teknologi (fintech) adalah salah satu sektor bisnis yang paling dinamis namun sekaligus paling ketat diatur oleh otoritas moneter. Kecepatan merilis fitur transaksi baru sering kali berbenturan dengan lamanya jalur birokrasi uji kepatuhan standar perlindungan konsumen.</p>
    
    <h3>Membangun Budaya Kepatuhan yang Iteratif</h3>
    <p>Alih-alih memperlakukan tim kepatuhan hukum (compliance team) sebagai 'penghambat inovasi', perusahaan fintech modern yang sukses menempatkan ahli kepatuhan sejak proses awal perancangan arsitektur sistem (Compliance by Design). Ini memotong risiko pengerjaan ulang kode sistem yang mahal akibat penolakan izin rilis oleh regulator.</p>
    
    <p>Membiasakan pengujian kepatuhan secara rutin melalui program sandbox teratur adalah metode terbaik menjaga akselerasi bisnis di jalur aman.</p>`,
    coverImageUrl: "https://picsum.photos/seed/article-fintech/1200/600",
    readTime: "5 menit membaca"
  }
];
