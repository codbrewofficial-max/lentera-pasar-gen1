export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  priceRange?: string;
  iconName?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  client: string;
  imageUrl: string;
  tags: string[];
  location?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  author: string;
  authorRole?: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  role: string;
  feedback: string;
  avatarUrl?: string;
}

export const defaultServices: ServiceItem[] = [
  {
    id: "service-1",
    title: "Perencanaan Masterplan & Arsitektur",
    description: "Pengembangan konsep spasial berskala makro dengan estetika fungsional tinggi untuk vila, resort, dan hunian privat premium.",
    longDescription: "Setiap rancangan arsitektur kami merupakan dialog antara lansekap alam, kebutuhan klien, dan kejujuran material. Kami merumuskan ruang yang tidak hanya memukau secara visual, namun juga memberikan ketenangan batin dan efisiensi fungsional yang bertahan lintas generasi.",
    priceRange: "Mulai dari Rp 150.000.000",
    iconName: "Compass"
  },
  {
    id: "service-2",
    title: "Desain Interior & Kurasi Seni",
    description: "Penciptaan ruang dalam yang intim, mewah, dan penuh karakter melalui pemilihan material eksklusif serta instalasi seni pilihan.",
    longDescription: "Kami percaya bahwa interior yang baik harus menceritakan kisah pemiliknya. Melalui kurasi furnitur custom, pencahayaan teatrikal yang presisi, serta pemilihan material taktil kelas atas seperti marmer Carrara dan kayu jati tua, kami menghidupkan ruang yang menginspirasi.",
    priceRange: "Mulai dari Rp 85.000.000",
    iconName: "Layers"
  },
  {
    id: "service-3",
    title: "Konsultasi Renovasi & Restorasi Klasik",
    description: "Transformasi bangunan bersejarah atau aset properti lama menjadi ruang fungsional modern tanpa kehilangan nilai sejarahnya.",
    longDescription: "Melestarikan sejarah sembari merangkul masa kini. Kami berspesialisasi dalam memugar bangunan cagar budaya atau residensi vintage, mengintegrasikan teknologi rumah pintar modern dan infrastruktur baru secara halus di balik fasad klasik yang agung.",
    priceRange: "Mulai dari Rp 120.000.000",
    iconName: "History"
  }
];

export const defaultPortfolios: PortfolioItem[] = [
  {
    id: "portfolio-1",
    title: "The Alila Sanctuary, Uluwatu",
    description: "Villa privat tepi tebing berkonsep minimalis tropis dengan perpaduan material batu alam lokal dan kayu ulin reklamasi.",
    category: "Residensi Privat",
    year: "2025",
    client: "Alila Group Indonesia",
    imageUrl: "https://picsum.photos/seed/sanctuary/1200/800",
    tags: ["Tropis Modern", "Vila Tebing", "Batu Alam"],
    location: "Uluwatu, Bali"
  },
  {
    id: "portfolio-2",
    title: "Rumah Menteng Heritage",
    description: "Restorasi rumah kolonial tahun 1930 di Menteng, Jakarta Pusat, menjadi hunian modern berestetika klasik kontemporer.",
    category: "Restorasi Sejarah",
    year: "2024",
    client: "Keluarga Pranata",
    imageUrl: "https://picsum.photos/seed/heritage/1200/800",
    tags: ["Menteng", "Art Deco", "Modern Klasik"],
    location: "Menteng, Jakarta Pusat"
  },
  {
    id: "portfolio-3",
    title: "Atelier & Gallery Sudirman",
    description: "Desain ruang kerja kolaboratif eksklusif untuk private equity firm, menonjolkan pencahayaan alami dan detail marmer Carrara.",
    category: "Ruang Komersial",
    year: "2025",
    client: "Capital Partners",
    imageUrl: "https://picsum.photos/seed/atelier/1200/800",
    tags: ["Kantor Butik", "Minimalis", "Marmer Carrara"],
    location: "Sudirman CBD, Jakarta"
  },
  {
    id: "portfolio-4",
    title: "The Cliffside Pavilion",
    description: "Paviliun peristirahatan dengan konstruksi baja ringan dan dinding kaca penuh, memberikan pandangan panorama 360 derajat tanpa sekat.",
    category: "Paviliun & Lanskap",
    year: "2023",
    client: "Dr. Adrian Wardhana",
    imageUrl: "https://picsum.photos/seed/pavilion/1200/800",
    tags: ["Kaca Kontemporer", "Baja Ringan", "Panorama"],
    location: "Canggu, Bali"
  }
];

export const defaultArticles: ArticleItem[] = [
  {
    id: "article-1",
    title: "Mendefinisikan Kemewahan dalam Arsitektur Tropis Modern",
    description: "Menelusuri bagaimana material lokal yang langka dan permainan cahaya alami mendefinisikan kenyamanan spasial tingkat tinggi tanpa bergantung pada ornamen berlebih.",
    content: "Kemewahan sejati dalam arsitektur modern tidak lagi diukur dari seberapa banyak emas atau kristal yang dipajang di dalam ruangan. Kini, kemewahan bergeser ke arah hal-hal yang tidak berwujud namun sangat dirasakan secara sensoris: kemurnian udara, kelimpahan cahaya alami, serta ketenangan akustik.\n\nDalam arsitektur tropis, kami mendefinisikannya lewat kejujuran material. Kayu ulin tua yang dibiarkan menua secara alami tanpa pelitur tebal, atau batu andesit bertekstur kasar yang menangkap bayangan dedaunan di sore hari. Desain premium berupaya meminimalisasi gangguan visual agar mata dapat beristirahat, membiarkan lanskap luar ruangan menjadi lukisan dinamis utama yang terus berganti seiring berjalannya hari.\n\nSebuah bangunan harus bernapas. Courtyard tengah (taman dalam) bukan sekadar dekorasi, melainkan organ paru-paru arsitektural yang menarik angin sejuk ke dasar ruangan dan membuang panas ke atas langit-langit. Di sinilah letak kemewahan spasial yang sesungguhnya: ruang yang memahami iklimnya.",
    publishedDate: "24 Juni 2026",
    readTime: "5 Menit Baca",
    imageUrl: "https://picsum.photos/seed/luxury/800/600",
    author: "Bramastra Niskala",
    authorRole: "Principal Architect",
    category: "Wawasan Spasial"
  },
  {
    id: "article-2",
    title: "Seni Mengintegrasikan Ruang Hijau pada Hunian Urban Menteng",
    description: "Panduan praktis menciptakan mikroklimat sejuk di tengah kota padat melalui desain taman semi-terbuka (courtyard) dan koridor udara.",
    content: "Tinggal di kawasan urban bersejarah seperti Menteng sering kali mengharuskan kita berkompromi dengan keterbatasan lahan luar ruangan dan privasi yang tinggi dari tetangga sekitar.\n\nSolusi elegan yang kami tawarkan adalah konsep 'Oasis Tersembunyi'—sebuah courtyard internal yang dikelilingi oleh dinding kaca setinggi dua lantai. Struktur ini berfungsi sebagai perangkap cahaya alami sekaligus sirkulator udara vertikal. Dengan menanam pohon rindang berakar dalam di tengah courtyard, suhu ruangan di sekitarnya dapat turun hingga 2-3 derajat Celcius tanpa bantuan pendingin udara konseptual.\n\nSelain itu, pemilihan material lantai transisi seperti kerikil sungai hitam halus menciptakan harmoni taktil saat melangkah dari ruang tamu indoor menuju area semi-outdoor. Detail mikro ini adalah pembeda utama antara sekadar rumah besar dan karya seni spasial yang fungsional.",
    publishedDate: "12 Mei 2026",
    readTime: "4 Menit Baca",
    imageUrl: "https://picsum.photos/seed/green/800/600",
    author: "Larasati Adiningrat",
    authorRole: "Senior Landscape Designer",
    category: "Lanskap"
  },
  {
    id: "article-3",
    title: "Investasi Properti Premium: Mengapa Desain Arsitektur Berdampak pada Nilai Aset",
    description: "Analisis mendalam mengenai korelasi nyata antara kualitas material, reputasi arsitek, dan apresiasi nilai pasar jangka panjang pada properti butik.",
    content: "Di kalangan investor properti premium, terdapat pemahaman bersama bahwa biaya yang dikeluarkan untuk arsitektur berkualitas bukanlah beban biaya pengeluaran, melainkan proteksi aset jangka panjang.\n\nSebuah riset menunjukkan bahwa properti butik yang dirancang oleh arsitek terkemuka memiliki apresiasi harga hingga 35% lebih tinggi dibandingkan properti dengan ukuran serupa yang dibangun secara massal di area yang sama. Mengapa demikian? Pertama, keunikan desain menciptakan kelangkaan (scarcity). Kolektor properti bersedia membayar premium untuk karya seni tiga dimensi yang fungsional.\n\nKedua, daya tahan material yang dipilih secara cermat memangkas biaya pemeliharaan secara drastis hingga satu dekade ke depan. Marmer berkualitas tinggi tidak pernah ketinggalan zaman; ia justru mengumpulkan patina keindahan yang semakin bernilai seiring waktu.",
    publishedDate: "05 April 2026",
    readTime: "6 Menit Baca",
    imageUrl: "https://picsum.photos/seed/invest/800/600",
    author: "Bramastra Niskala",
    authorRole: "Principal Architect",
    category: "Bisnis & Properti"
  }
];

export const defaultTeam: TeamMember[] = [
  {
    id: "member-1",
    name: "Bramastra Niskala, M.Arch",
    role: "Founder & Principal Architect",
    bio: "Lulusan Architectural Association (AA) School of Architecture, London. Berpengalaman lebih dari 15 tahun merancang resor mewah dan hunian privat di Asia Tenggara.",
    imageUrl: "https://picsum.photos/seed/bram/400/400",
    linkedinUrl: "https://linkedin.com/in/bram-niskala"
  },
  {
    id: "member-2",
    name: "Larasati Adiningrat, B.Ds",
    role: "Director of Interior Architecture",
    bio: "Spesialis kurasi ruang dalam berkarakter tinggi dengan latar belakang studi di Milan. Mengedepankan keseimbangan material lokal dan ergonomi kontemporer.",
    imageUrl: "https://picsum.photos/seed/laras/400/400",
    linkedinUrl: "https://linkedin.com/in/laras-adiningrat"
  },
  {
    id: "member-3",
    name: "Ir. Hendra Wijaya, MT",
    role: "Chief Structural Engineer",
    bio: "Memastikan presisi teknis arsitektur ekstrem seperti kantilever panjang dan struktur tanpa pilar. Mengawasi realisasi fisik di setiap lokasi proyek.",
    imageUrl: "https://picsum.photos/seed/hendra/400/400",
    linkedinUrl: "https://linkedin.com/in/hendra-wijaya"
  }
];

export const defaultTimeline: TimelineItem[] = [
  {
    id: "timeline-1",
    year: "2015",
    title: "Pendirian Niskala Atelier",
    description: "Didirikan di Jakarta dengan misi membawa pendekatan arsitektur jujur material dan kontekstual ke pasar hunian privat mewah Indonesia."
  },
  {
    id: "timeline-2",
    year: "2018",
    title: "Penghargaan IAI (Ikatan Arsitek Indonesia)",
    description: "Meraih penghargaan kategori Komersial Butik atas proyek 'Atelier & Gallery Sudirman' yang mengedepankan sirkulasi udara alami radikal."
  },
  {
    id: "timeline-3",
    year: "2021",
    title: "Ekspansi Bali & Proyek Uluwatu",
    description: "Membuka studio satelit di Bali untuk menangani permintaan resor ekologis kelas atas, dipimpin langsung oleh Bramastra Niskala."
  },
  {
    id: "timeline-4",
    year: "2025",
    title: "Dekade Keindahan Fungsional",
    description: "Menyelesaikan portofolio ke-50, meneguhkan posisi sebagai salah satu butik arsitektur paling dihormati di pasar premium tanah air."
  }
];

export const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Bagaimana proses konsultasi awal dan penentuan biaya di Niskala Atelier?",
    answer: "Kami memulai setiap proyek dengan sesi dialog mendalam tanpa biaya untuk memahami visi, batasan lahan, dan aspirasi fungsional Anda. Setelah itu, kami mengajukan proposal desain komprehensif yang mencakup estimasi biaya perencanaan berbasis persentase nilai konstruksi atau biaya per meter persegi yang disepakati secara transparan."
  },
  {
    id: "faq-2",
    question: "Apakah Niskala Atelier juga menyediakan jasa kontraktor (design & build)?",
    answer: "Fokus utama kami adalah perencanaan arsitektur, interior, dan lanskap demi menjaga objektivitas dan kualitas detail tertinggi. Namun, kami memiliki jaringan mitra kontraktor premium yang terpercaya serta menyediakan jasa Pengawasan Berkala (Supervision) yang ketat untuk memastikan hasil fisik di lapangan 100% presisi sesuai dokumen gambar kerja kami."
  },
  {
    id: "faq-3",
    question: "Berapa lama rata-hari waktu yang dibutuhkan untuk menyelesaikan satu paket desain?",
    answer: "Untuk hunian residensial premium, fase pra-rencana hingga gambar detail konstruksi (DED) biasanya memakan waktu antara 3 hingga 6 bulan. Proses ini membutuhkan presisi tinggi karena kami merancang detail custom mulai dari sambungan kayu, letak sela pencahayaan, hingga pemilihan blok marmer spesifik."
  },
  {
    id: "faq-4",
    question: "Apakah Anda melayani pengerjaan proyek di luar wilayah Jakarta dan Bali?",
    answer: "Ya, kami menerima penugasan di seluruh penjuru Indonesia dan regional Asia Tenggara. Untuk proyek di luar area jangkauan studio fisik kami, kami menyesuaikan jadwal kunjungan lapangan berkala berkoordinasi dengan tim pengawas lokal demi kelancaran proses konstruksi."
  }
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Pranata Kesuma",
    company: "Kesuma Holdings",
    role: "Founder",
    feedback: "Merenovasi hunian keluarga di Menteng bersama Niskala Atelier adalah pengalaman yang luar biasa. Mereka sangat menghargai nilai sejarah bangunan asli, namun berhasil menyisipkan fungsionalitas modern yang sangat mewah.",
    avatarUrl: "https://picsum.photos/seed/pranata/100/100"
  },
  {
    id: "test-2",
    name: "Sonia Guntur",
    company: "The Cliff Villa Bali",
    role: "Owner & Developer",
    feedback: "Detail arsitektur tropis mereka sangat matang. Aliran angin, pencahayaan alami, dan ketahanan material ulin di Uluwatu terbukti prima meskipun diterpa angin laut asin setiap hari. Benar-benar arsitektur bernilai investasi tinggi.",
    avatarUrl: "https://picsum.photos/seed/sonia/100/100"
  }
];
