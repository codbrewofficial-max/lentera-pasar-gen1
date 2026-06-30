export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  badge?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  year: string;
  client: string;
  colorTheme?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  author: {
    name: string;
    avatarUrl: string;
    role: string;
  };
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  signature?: string;
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
  role: string;
  company: string;
  content: string;
  imageUrl: string;
}

// Default data arrays matching "Studio Sinestesia" (Desain avant-garde, branding eksperimental, & digital agency Jakarta)
export const defaultServices: ServiceItem[] = [
  {
    id: "s1",
    title: "Identitas Visual Spekulatif",
    description: "Merancang visual branding yang mendobrak konvensi pasar. Menggabungkan tipografi eksperimental, asimetri ekstrem, dan color blocking berani untuk mendominasi persepsi audiens.",
    iconName: "Sparkles",
    category: "Branding",
    badge: "Terpopuler"
  },
  {
    id: "s2",
    title: "Arsitektur Digital & Web Art",
    description: "Mengubah website standar menjadi kanvas interaktif berkinerja tinggi. Kami mendesain antarmuka imersif yang memberikan pengalaman sensorik tak terlupakan bagi pengunjung Anda.",
    iconName: "Monitor",
    category: "Web & Tech",
    badge: "Eksperimental"
  },
  {
    id: "s3",
    title: "Kampanye Kampas Sosial",
    description: "Strategi konten multimedia non-linear untuk media sosial. Memecah kebisingan feed digital dengan aset visual berdaya sengat tinggi, montase dinamis, dan narasi provokatif.",
    iconName: "Flame",
    category: "Social Media"
  },
  {
    id: "s4",
    title: "Fotografi & Sinematika Abstrak",
    description: "Produksi visual yang bermain dengan perspektif, pencahayaan distorsi, dan crop non-konvensional. Menghadirkan jiwa brand Anda ke dalam bentuk visual paling murni.",
    iconName: "Camera",
    category: "Creative Production"
  }
];

export const defaultPortfolios: PortfolioItem[] = [
  {
    id: "p1",
    title: "Nirmala: Dekonstruksi Seni Tenun Nusantara",
    description: "Kampanye rebranding modern untuk brand fashion tenun lokal dengan pendekatan asimetris ekstrem dan fotografi kontras tinggi yang sukses menjangkau audiens gen-Z global.",
    imageUrl: "https://picsum.photos/seed/nirmala/800/600",
    category: "Rebranding",
    year: "2026",
    client: "Nirmala Nusantara",
    colorTheme: "#F56B71"
  },
  {
    id: "p2",
    title: "Kopi Labirin: Lanskap Ruang Ketiga Jakarta",
    description: "Pengembangan situs web interaktif 3D dan kemasan produk kopi spesialti yang menggunakan skema warna neo-noir dan grid kolase abstrak untuk menciptakan misteri petualangan rasa.",
    imageUrl: "https://picsum.photos/seed/kopilabirin/800/600",
    category: "Digital Art & Web",
    year: "2025",
    client: "Labirin Coffee Roasters",
    colorTheme: "#649FF6"
  },
  {
    id: "p3",
    title: "Suara Jiwa: Festival Musik Tanpa Bentuk",
    description: "Koleksi poster cetak saring, tipografi bergerak, dan visual panggung terdistorsi untuk festival seni independen lintas disiplin terbesar di Asia Tenggara.",
    imageUrl: "https://picsum.photos/seed/suarajiwa/800/600",
    category: "Creative Direction",
    year: "2026",
    client: "Kolektif Suara Jiwa",
    colorTheme: "#B283AF"
  },
  {
    id: "p4",
    title: "Monokrom Eksentrik: Manifesto Desain Furnitur",
    description: "Katalog digital interaktif dan video profil produk untuk produsen furnitur modular minimalis dengan penataan set abstrak menggunakan balok geometris raksasa.",
    imageUrl: "https://picsum.photos/seed/monokrom/800/600",
    category: "Industrial Art",
    year: "2025",
    client: "Studio Monolabel",
    colorTheme: "#F56B71"
  }
];

export const defaultArticles: ArticleItem[] = [
  {
    id: "a1",
    title: "Mengapa Desain Simetris Membunuh Karakter Brand Anda?",
    description: "Eksplorasi mendalam bagaimana keseimbangan visual yang terlalu kaku membuat brand terperangkap dalam homogenitas visual global, dan mengapa asimetri adalah kuncinya.",
    content: "Di era algoritma template instan, mayoritas brand terlihat seragam. Mereka menggunakan layout grid yang sama, spasi yang presisi, dan warna pastel yang aman. Kami menyebutnya 'matinya jiwa visual'. Artikel ini mengupas bagaimana asimetri, penggunaan whitespace yang ekstrem, dan color blocking yang menantang dapat membebaskan brand dari jerat kebosanan digital.\n\nDengan memotong gambar secara tidak biasa (crop non-konvensional) dan merotasi teks tipografi beberapa derajat, kita mengirim pesan instan ke otak audiens: 'Kami berbeda, kami berani, kami hidup.' Simetri mengekspresikan stabilitas, tapi asimetri melambangkan gerakan dan emosi.",
    imageUrl: "https://picsum.photos/seed/visualdeath/1200/800",
    publishedAt: "28 Juni 2026",
    category: "Opini Desain",
    author: {
      name: "Raka Danendra",
      avatarUrl: "https://picsum.photos/seed/raka/150/150",
      role: "Principal Designer"
    },
    tags: ["Asimetris", "Branding", "Desain Grafis", "Eksperimental"]
  },
  {
    id: "a2",
    title: "Estetika Brutalisme dalam Web Modern: Panduan Praktis",
    description: "Bagaimana cara menyuntikkan elemen brutalist seperti grid mentah, tipografi raksasa, dan warna-warna tabrakan tanpa mengorbankan fungsionalitas dan keterbacaan.",
    content: "Brutalisme digital sering disalahpahami sebagai desain yang sengaja dibuat jelek atau sulit digunakan. Faktanya, brutalist sejati merayakan kejujuran struktural — seperti beton telanjang pada arsitektur pertengahan abad ke-20. Dalam dunia web, ini berarti menggunakan elemen fungsional murni tanpa pemanis yang berlebihan.\n\nDalam panduan ini, kami membedah teknik memadukan warna kontras tinggi (seperti biru neon #649FF6 dengan merah karang #F56B71) dan bagaimana menjaga kegunaan agar navigasi tetap instan dipahami pengunjung awam sekalipun.",
    imageUrl: "https://picsum.photos/seed/brutal/1200/800",
    publishedAt: "15 Mei 2026",
    category: "Eksplorasi Teknis",
    author: {
      name: "Saskia Utami",
      avatarUrl: "https://picsum.photos/seed/saskia/150/150",
      role: "Creative Tech Lead"
    },
    tags: ["Web Art", "UI/UX", "Brutalisme", "Tailwind"]
  },
  {
    id: "a3",
    title: "Psikologi Warna Lentera Pasar: Merah Karang & Ungu Aksen",
    description: "Bedah mendalam di balik pemilihan warna primer Lentera Pasar untuk merangsang imajinasi kolektif pelaku usaha kreatif di Indonesia.",
    content: "Warna bukan sekadar hiasan; ia adalah frekuensi emosi. Ketika kami memutuskan menggunakan warna coral merah #F56B71 yang berpadu dengan ungu aksen #B283AF dan biru cerah #649FF6, tujuannya adalah memantik energi kreatif yang terpendam.\n\nMerah karang mengaktifkan urgensi kreativitas, sementara ungu menyuntikkan aura misteri dan kecerdasan intelektual. Biru bertindak sebagai stabilizer yang meyakinkan audiens akan reliabilitas sistem. Bersama-sama, ketiganya melahirkan harmoni abstrak yang menantang batas visual normal.",
    imageUrl: "https://picsum.photos/seed/psychology/1200/800",
    publishedAt: "02 April 2026",
    category: "Teori Warna",
    author: {
      name: "Aditya Wardhana",
      avatarUrl: "https://picsum.photos/seed/adit/150/150",
      role: "Brand strategist"
    },
    tags: ["Lentera Pasar", "Teori Warna", "Psikologi Brand"]
  }
];

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Raka Danendra",
    role: "Pendiri & Direktur Kreatif",
    bio: "Pecinta tipografi ekstrem dan kopi tanpa gula. Mengabdikan hidupnya untuk merusak grid yang terlalu rapi demi melahirkan karya visual yang memiliki denyut nadi.",
    imageUrl: "https://picsum.photos/seed/raka-team/400/500",
    signature: "R. Danendra"
  },
  {
    id: "m2",
    name: "Saskia Utami",
    role: "Kepala Rekayasa Kreatif",
    bio: "Seorang insinyur perangkat lunak yang berjiwa seniman. Baginya, kode adalah kuas cat dan browser adalah kanvas tanpa batas untuk menuangkan animasi interaktif.",
    imageUrl: "https://picsum.photos/seed/saskia-team/400/500",
    signature: "S. Utami"
  },
  {
    id: "m3",
    name: "Aditya Wardhana",
    role: "Kepala Strategi & Narasi",
    bio: "Penerjemah visi abstrak menjadi pesan bisnis yang menancap tajam. Menggunakan pendekatan semiotika budaya untuk memastikan kegilaan visual kami tetap menghasilkan konversi luar biasa.",
    imageUrl: "https://picsum.photos/seed/adit-team/400/500",
    signature: "A. Wardhana"
  }
];

export const defaultTimeline: TimelineItem[] = [
  {
    id: "t1",
    year: "2023",
    title: "Kelahiran dalam Garis & Sudut",
    description: "Didirikan di sebuah garasi sempit di Kemang, Jakarta Selatan, dengan satu keyakinan: dunia bisnis Indonesia butuh alternatif visual yang menolak seragam."
  },
  {
    id: "t2",
    year: "2024",
    title: "Manifesto Digital Pertama",
    description: "Meluncurkan portofolio interaktif pertama yang memenangkan penghargaan situs web eksperimental terbaik, menarik perhatian brand retail internasional."
  },
  {
    id: "t3",
    year: "2025",
    title: "Ekspansi Kolaboratif",
    description: "Membuka studio fisik berkonsep galeri seni terbuka dan menginisiasi program residensi untuk seniman digital serta desainer grafis muda berbakat."
  },
  {
    id: "t4",
    year: "2026",
    title: "Tema Abstract Lentera Pasar",
    description: "Berkolaborasi dengan Lentera Pasar untuk mendemokratisasi desain avant-garde agar dapat diakses oleh seluruh UMKM berani di tanah air."
  }
];

export const defaultFaqs: FaqItem[] = [
  {
    id: "f1",
    question: "Apakah desain bertema Abstract cocok untuk bisnis saya?",
    answer: "Jika bisnis Anda bergerak di bidang kreatif, jasa profesional yang ingin menonjol, fashion, kuliner modern, seni, atau jika Anda ingin membangun persepsi brand yang premium, berkarakter kuat, dan progresif—jawabannya adalah ya, sangat cocok!"
  },
  {
    id: "f2",
    question: "Bagaimana dengan keterbacaan teks pada website asimetris?",
    answer: "Meskipun layout kami asimetris dan ekspresif, kami menggunakan aturan rasio kontras tinggi dan hierarki tipografi yang ketat. Semua teks navigasi penting, detail harga, serta informasi kontak tetap diletakkan di zona baca yang aman agar kegunaan website tetap 100% terjaga."
  },
  {
    id: "f3",
    question: "Dapatkah saya mengganti warna dasar pada tema Abstract ini?",
    answer: "Tentu saja. Tema ini dirancang dengan fleksibilitas tinggi. Namun, kami menyarankan untuk tetap menggunakan kombinasi warna kontras tinggi untuk menjaga nyawa estetik abstrak yang berani dan ekspresif."
  },
  {
    id: "f4",
    question: "Apakah website ini ramah untuk diakses melalui smartphone?",
    answer: "Ya, tema Abstract menggunakan pendekatan desktop-first precision dengan mobile-first code. Di layar ponsel, susunan visual bertumpuk secara adaptif (fluid stack), mengubah overlap ekstrem menjadi tumpukan kolase linear yang sangat nyaman di-scroll dengan ibu jari."
  }
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: "tm1",
    name: "Hendra Wijaya",
    role: "CEO & Co-Founder",
    company: "Nirmala Nusantara",
    content: "Situs web baru kami benar-benar mengejutkan pasar. Sejak peluncuran dengan tema Abstract, engagement di media sosial naik 140% dan brand kami langsung dipersepsikan setara dengan jenama desainer global.",
    imageUrl: "https://picsum.photos/seed/hendra/100/100"
  },
  {
    id: "tm2",
    name: "Nabila Putri",
    role: "Direktur Kreatif",
    company: "Labirin Coffee",
    content: "Kombinasi asimetris dan warna color blocking yang ditawarkan berhasil menerjemahkan rahasia rasa kopi kami ke dalam pengalaman visual digital. Pelanggan kami sering memuji keunikan website kami.",
    imageUrl: "https://picsum.photos/seed/nabila/100/100"
  }
];
