export const GOALS = {
  lead_generation: "Mendapat pelanggan baru",
  booking_inquiry: "Menerima booking / reservasi",
  organization_branding: "Branding lembaga / organisasi",
  catalog_showcase: "Menampilkan katalog",
  community_growth: "Mengelola komunitas",
  donation_sponsorship: "Mencari donatur / sponsorship"
} as const;

export const THEMES = {
  formal: "Formal",
  casual: "Casual",
  abstract: "Abstract",
  premium: "Premium"
} as const;

export const PAGES = {
  home: "Home",
  about: "About Us",
  services: "Service",
  portfolio: "Portfolio",
  articles: "Blog / Artikel",
  article_detail: "Article Detail",
  contact: "Contact",
  portfolio_detail: "Portfolio Detail",
  products: "Products",
  product_detail: "Product Detail",
  packages: "Rooms / Packages",
  gallery: "Gallery",
  booking: "Booking / Inquiry",
  events: "Events",
  join: "Join Community",
  faq: "FAQ / Bantuan",
  // "global" BUKAN halaman sungguhan — ini kontainer teknis tempat nempel section
  // Navbar & Footer supaya bisa dipilih/preview lewat mekanisme "Pilih Tampilan Section"
  // yang sama seperti section biasa. Tidak pernah punya rute publik sendiri, dan selalu
  // difilter keluar dari daftar "Halaman Website" / "Halaman & Menu" di dashboard.
  global: "Navbar & Footer (Global)"
} as const;

export const WEBSITE_TYPE_PAGES = {
  landing_page: ["home"],
  company_profile: ["home", "about", "services", "portfolio", "articles", "article_detail", "contact", "portfolio_detail", "global"],
  catalog_product: ["home", "products", "product_detail", "faq", "articles", "article_detail", "contact", "global"],
  booking_inquiry: ["home", "packages", "gallery", "booking", "articles", "contact"],
  community_website: ["home", "events", "gallery", "articles", "join"]
} as const;

export const PAGE_SECTION_RULES = {
  company_profile: {
    home: ["hero", "profile_summary", "service_preview", "portfolio_preview", "trust_proof", "cta_contact"],
    about: ["organization_profile", "history_timeline", "vision_mission", "value_statement", "team_highlight"],
    services: ["service_hero", "service_grid", "service_process", "service_benefits", "service_faq"],
    portfolio: ["portfolio_hero", "portfolio_category", "portfolio_grid", "case_highlight", "portfolio_cta"],
    articles: ["article_hero", "featured_article", "article_preview"],
    article_detail: ["article_content", "related_articles", "article_cta"],
    contact: ["contact_hero", "contact_information", "maps_location", "contact_faq", "contact_cta"],
    portfolio_detail: ["portfolio_detail_content", "related_portfolios", "portfolio_detail_cta"],
    global: ["navbar", "footer"]
  },
  catalog_product: {
    home: ["hero", "category_showcase", "featured_products", "new_arrivals", "value_proposition", "brand_trust"],
    products: ["breadcrumbs", "product_filter_sidebar", "product_grid", "product_pagination"],
    product_detail: ["product_core_info", "product_tabs", "product_recommendation", "product_reviews", "product_faq"],
    faq: ["faq_hero_search", "faq_accordion", "faq_contact_cta"],
    articles: ["blog_hero", "featured_post", "article_category_filter", "article_grid", "article_pagination"],
    article_detail: ["article_header_meta", "article_main_content", "product_contextual_cta", "related_articles", "article_comments"],
    contact: ["contact_info_cards", "inquiry_form", "maps_location"],
    global: ["navbar", "footer", "whatsapp_fab"]
  },
  booking_inquiry: {
    home: ["hero_slider", "package_grid", "gallery_preview", "facilities", "testimonials", "booking_cta"],
    packages: ["package_hero", "package_grid", "package_filter", "booking_cta"],
    gallery: ["gallery_hero", "gallery_grid", "gallery_cta"],
    booking: ["booking_hero", "booking_form", "contact_info", "whatsapp_cta"],
    articles: ["article_hero", "article_list", "article_cta"],
    contact: ["contact_hero", "contact_form", "maps", "whatsapp_cta"]
  },
  community_website: {
    home: ["hero", "upcoming_events", "member_benefits", "gallery_preview", "sponsors", "join_cta"],
    events: ["events_hero", "event_list", "event_detail_preview", "join_cta"],
    gallery: ["gallery_hero", "gallery_grid", "activity_highlight"],
    articles: ["article_hero", "article_list", "article_cta"],
    join: ["join_hero", "join_form", "member_benefits", "whatsapp_cta"]
  },
  landing_page: {
    home: ["hero", "problem_solution", "features", "proof", "faq", "cta_contact"]
  }
} as const;

export const WEBSITE_TYPES = [
  {
    key: "landing_page",
    name: "Landing Page",
    description: "Website satu halaman untuk penawaran atau kampanye spesifik.",
    pages: WEBSITE_TYPE_PAGES.landing_page
  },
  {
    key: "company_profile",
    name: "Company Profile",
    description: "Website untuk menampilkan profil organisasi, layanan, portfolio, artikel, dan kontak.",
    pages: WEBSITE_TYPE_PAGES.company_profile
  },
  {
    key: "catalog_product",
    name: "Katalog Produk / Layanan",
    description: "Website katalog untuk produk atau layanan dengan halaman detail.",
    pages: WEBSITE_TYPE_PAGES.catalog_product
  },
  {
    key: "booking_inquiry",
    name: "Booking / Inquiry",
    description: "Website untuk paket, galeri, dan permintaan booking.",
    pages: WEBSITE_TYPE_PAGES.booking_inquiry
  },
  {
    key: "community_website",
    name: "Komunitas / Event",
    description: "Website komunitas untuk event, galeri, artikel, dan pendaftaran anggota.",
    pages: WEBSITE_TYPE_PAGES.community_website
  }
] as const;

export const COMPANY_PROFILE_PAGES = WEBSITE_TYPE_PAGES.company_profile.map((pageKey, index) => ({
  pageKey,
  title: PAGES[pageKey],
  slug: pageKey === "home" ? "" : pageKey === "article_detail" ? "article-detail" : pageKey === "portfolio_detail" ? "portfolio-detail" : pageKey === "global" ? "__global__" : pageKey,
  sortOrder: index + 1,
  isDynamicDetailPage: pageKey === "article_detail" || pageKey === "portfolio_detail",
  // Halaman kontainer teknis untuk Navbar & Footer — tidak pernah dirutekan publik,
  // tidak pernah tampil di navbar/footer, dan selalu difilter keluar dari daftar
  // "Halaman Website" / "Halaman & Menu" di dashboard.
  isGlobalChromePage: pageKey === "global"
}));

export const COMPANY_PROFILE_SECTION_SLOTS = Object.entries(PAGE_SECTION_RULES.company_profile).flatMap(
  ([pageKey, sections]) =>
    sections.map((section, index) => ({
      pageKey,
      sectionKey: section,
      slotKey: `${pageKey}.${section}`,
      sortOrder: index + 1
    }))
) as Array<{
  pageKey: (typeof WEBSITE_TYPE_PAGES.company_profile)[number];
  sectionKey: string;
  slotKey: string;
  sortOrder: number;
}>;


export const COMPANY_PROFILE_PAGE_PURPOSES = {
  home: "Halaman utama untuk memperkenalkan bisnis dan mengarahkan pengunjung ke aksi penting.",
  about: "Halaman untuk menjelaskan siapa bisnis Anda, sejarah singkat, visi misi, nilai utama, dan tim.",
  services: "Halaman untuk menampilkan daftar layanan utama yang ditawarkan kepada calon client.",
  portfolio: "Halaman untuk menampilkan bukti kerja, pengalaman, project, atau hasil yang pernah dikerjakan.",
  articles: "Halaman untuk artikel, edukasi, dan konten SEO agar bisnis lebih mudah ditemukan dari pencarian.",
  article_detail: "Template halaman detail artikel. Halaman ini tidak tampil di navbar karena digunakan otomatis saat pengunjung membuka artikel tertentu.",
  contact: "Halaman untuk informasi kontak, lokasi, dan cara calon client menghubungi bisnis.",
  portfolio_detail: "Template halaman detail portfolio. Halaman ini tidak tampil di navbar karena digunakan otomatis saat pengunjung membuka detail proyek tertentu.",
  global: "Kontainer teknis tempat menyimpan pilihan tampilan Navbar & Footer. Tidak pernah tampil sebagai halaman publik."
} as const;

export const COMPANY_PROFILE_DEFAULT_NAV_LABELS = {
  home: "Home",
  about: "Tentang",
  services: "Layanan",
  portfolio: "Portfolio",
  articles: "Artikel",
  article_detail: "Detail Artikel",
  contact: "Kontak",
  portfolio_detail: "Detail Portfolio"
} as const;

export const COMPANY_PROFILE_PAGE_LABELS = Object.fromEntries(
  WEBSITE_TYPE_PAGES.company_profile.map((pageKey) => [pageKey, PAGES[pageKey]])
) as Record<(typeof WEBSITE_TYPE_PAGES.company_profile)[number], string>;

export const COMPANY_PROFILE_SECTION_SLOT_LABELS = {
  "home.hero": "Hero",
  "home.profile_summary": "Ringkasan Profil",
  "home.service_preview": "Ringkasan Layanan",
  "home.portfolio_preview": "Ringkasan Portfolio",
  "home.trust_proof": "Bukti Kepercayaan",
  "home.cta_contact": "Ajakan Menghubungi",
  "about.organization_profile": "Profil Organisasi",
  "about.history_timeline": "Sejarah Singkat",
  "about.vision_mission": "Visi & Misi",
  "about.value_statement": "Nilai Utama",
  "about.team_highlight": "Tim / Pengurus",
  "services.service_hero": "Pembuka Layanan",
  "services.service_grid": "Daftar Layanan",
  "services.service_process": "Proses Layanan",
  "services.service_benefits": "Manfaat Layanan",
  "services.service_faq": "FAQ Layanan",
  "portfolio.portfolio_hero": "Pembuka Portfolio",
  "portfolio.portfolio_category": "Kategori Portfolio",
  "portfolio.portfolio_grid": "Galeri Portfolio",
  "portfolio.case_highlight": "Sorotan Studi Kasus",
  "portfolio.portfolio_cta": "CTA Portfolio",
  "articles.article_hero": "Pembuka Artikel",
  "articles.featured_article": "Artikel Unggulan",
  "articles.article_preview": "Daftar Artikel",
  "article_detail.article_content": "Isi Detail Artikel",
  "article_detail.related_articles": "Artikel Terkait",
  "article_detail.article_cta": "CTA Artikel",
  "contact.contact_hero": "Pembuka Kontak",
  "contact.contact_information": "Informasi Kontak",
  "contact.maps_location": "Lokasi / Maps",
  "contact.contact_faq": "FAQ Kontak",
  "contact.contact_cta": "CTA Kontak",
  "portfolio_detail.portfolio_detail_content": "Isi Detail Portfolio",
  "portfolio_detail.related_portfolios": "Portfolio Terkait",
  "portfolio_detail.portfolio_detail_cta": "CTA Detail Portfolio",
  "global.navbar": "Navbar (Menu Atas)",
  "global.footer": "Footer (Bagian Bawah)"
} as const;

export const COMPANY_PROFILE_SECTION_SLOT_DESCRIPTIONS = Object.fromEntries(
  Object.entries(COMPANY_PROFILE_SECTION_SLOT_LABELS).map(([slotKey, label]) => [slotKey, `${label} untuk halaman ${slotKey.split(".")[0]}.`])
) as Record<keyof typeof COMPANY_PROFILE_SECTION_SLOT_LABELS, string>;

// ==========================================================================
// Website Type: Katalog Produk (catalog_product)
// Pola di bawah ini meniru persis blok COMPANY_PROFILE_* di atas, sesuai
// catatan di apps/site-renderer/templates/company-profile/clean/template.ts
// yang minta pola Company Profile direplikasi untuk Website Type baru.
// ==========================================================================

export const CATALOG_PRODUCT_PAGES = WEBSITE_TYPE_PAGES.catalog_product.map((pageKey, index) => ({
  pageKey,
  title: PAGES[pageKey],
  slug: pageKey === "home" ? "" : pageKey === "product_detail" ? "product-detail" : pageKey === "article_detail" ? "article-detail" : pageKey === "global" ? "__global__" : pageKey,
  sortOrder: index + 1,
  isDynamicDetailPage: pageKey === "product_detail" || pageKey === "article_detail",
  // Halaman kontainer teknis untuk Navbar, Footer & WhatsApp FAB — tidak pernah
  // dirutekan publik, tidak pernah tampil di navbar/footer, dan selalu difilter
  // keluar dari daftar "Halaman Website" / "Halaman & Menu" di dashboard.
  isGlobalChromePage: pageKey === "global"
}));

export const CATALOG_PRODUCT_SECTION_SLOTS = Object.entries(PAGE_SECTION_RULES.catalog_product).flatMap(
  ([pageKey, sections]) =>
    sections.map((section, index) => ({
      pageKey,
      sectionKey: section,
      slotKey: `${pageKey}.${section}`,
      sortOrder: index + 1
    }))
) as Array<{
  pageKey: (typeof WEBSITE_TYPE_PAGES.catalog_product)[number];
  sectionKey: string;
  slotKey: string;
  sortOrder: number;
}>;

export const CATALOG_PRODUCT_PAGE_PURPOSES = {
  home: "Halaman utama untuk menampilkan promo, kategori, dan produk unggulan agar pengunjung tertarik menjelajah katalog.",
  products: "Halaman daftar/arsip produk dengan filter dan sortir untuk membantu pengunjung menemukan produk yang dicari.",
  product_detail: "Template halaman detail satu produk: galeri, harga, varian, spesifikasi, rekomendasi, dan ulasan pelanggan. Tidak tampil di navbar karena dipakai otomatis saat pengunjung membuka produk tertentu.",
  faq: "Halaman pusat bantuan berisi pertanyaan yang sering diajukan seputar cara pesan, pembayaran, dan pengiriman.",
  articles: "Halaman arsip artikel/blog untuk konten edukasi dan SEO seputar produk.",
  article_detail: "Template halaman detail artikel. Tidak tampil di navbar karena dipakai otomatis saat pengunjung membuka artikel tertentu.",
  contact: "Halaman kontak, lokasi, dan formulir permintaan penawaran harga (request a quote).",
  global: "Kontainer teknis tempat menyimpan pilihan tampilan Navbar, Footer, dan Tombol WhatsApp mengambang. Tidak pernah tampil sebagai halaman publik."
} as const;

export const CATALOG_PRODUCT_DEFAULT_NAV_LABELS = {
  home: "Home",
  products: "Produk",
  product_detail: "Detail Produk",
  faq: "FAQ",
  articles: "Artikel",
  article_detail: "Detail Artikel",
  contact: "Kontak"
} as const;

export const CATALOG_PRODUCT_PAGE_LABELS = Object.fromEntries(
  WEBSITE_TYPE_PAGES.catalog_product.map((pageKey) => [pageKey, PAGES[pageKey]])
) as Record<(typeof WEBSITE_TYPE_PAGES.catalog_product)[number], string>;

export const CATALOG_PRODUCT_SECTION_SLOT_LABELS = {
  "home.hero": "Hero / Banner Utama",
  "home.category_showcase": "Kategori Produk (Showcase)",
  "home.featured_products": "Produk Unggulan / Best Seller",
  "home.new_arrivals": "Produk Terbaru",
  "home.value_proposition": "Keunggulan / USP",
  "home.brand_trust": "Kepercayaan Brand / Partner",
  "products.breadcrumbs": "Judul Halaman & Breadcrumbs",
  "products.product_filter_sidebar": "Filter & Sortir Produk",
  "products.product_grid": "Daftar Produk (Grid)",
  "products.product_pagination": "Navigasi Halaman Produk",
  "product_detail.product_core_info": "Info Utama Produk (Galeri, Harga, CTA)",
  "product_detail.product_tabs": "Spesifikasi & Deskripsi",
  "product_detail.product_recommendation": "Produk Terkait / Rekomendasi",
  "product_detail.product_reviews": "Ulasan Pelanggan",
  "product_detail.product_faq": "FAQ Produk",
  "faq.faq_hero_search": "Pembuka & Pencarian Bantuan",
  "faq.faq_accordion": "Daftar Pertanyaan (Accordion)",
  "faq.faq_contact_cta": "CTA Hubungi Support",
  "articles.blog_hero": "Pembuka Blog & Pencarian Artikel",
  "articles.featured_post": "Artikel Utama",
  "articles.article_category_filter": "Filter Kategori Artikel",
  "articles.article_grid": "Daftar Artikel (Grid)",
  "articles.article_pagination": "Navigasi Halaman Artikel",
  "article_detail.article_header_meta": "Judul & Info Artikel",
  "article_detail.article_main_content": "Isi Artikel (2 Kolom + Sidebar)",
  "article_detail.product_contextual_cta": "CTA Produk Terkait Artikel",
  "article_detail.related_articles": "Artikel Terkait",
  "article_detail.article_comments": "Kolom Komentar",
  "contact.contact_info_cards": "Info Kontak (Kartu)",
  "contact.inquiry_form": "Formulir Permintaan Penawaran",
  "contact.maps_location": "Lokasi / Maps",
  "global.navbar": "Navbar (Menu Atas + Pencarian & Wishlist)",
  "global.footer": "Footer (Bagian Bawah)",
  "global.whatsapp_fab": "Tombol Mengambang WhatsApp"
} as const;

export const CATALOG_PRODUCT_SECTION_SLOT_DESCRIPTIONS = Object.fromEntries(
  Object.entries(CATALOG_PRODUCT_SECTION_SLOT_LABELS).map(([slotKey, label]) => [slotKey, `${label} untuk halaman ${slotKey.split(".")[0]}.`])
) as Record<keyof typeof CATALOG_PRODUCT_SECTION_SLOT_LABELS, string>;
