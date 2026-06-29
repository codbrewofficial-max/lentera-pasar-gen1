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
  abstract: "Abstract"
} as const;

export const PAGES = {
  home: "Home",
  about: "About Us",
  services: "Service",
  portfolio: "Portfolio",
  articles: "Blog / Artikel",
  article_detail: "Article Detail",
  contact: "Contact",
  products: "Products",
  product_detail: "Product Detail",
  packages: "Rooms / Packages",
  gallery: "Gallery",
  booking: "Booking / Inquiry",
  events: "Events",
  join: "Join Community"
} as const;

export const WEBSITE_TYPE_PAGES = {
  landing_page: ["home"],
  company_profile: ["home", "about", "services", "portfolio", "articles", "article_detail", "contact"],
  catalog_product: ["home", "products", "product_detail", "articles", "article_detail", "contact"],
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
    article_detail: ["article_detail_hero", "article_content", "related_articles", "article_cta"],
    contact: ["contact_hero", "contact_information", "maps_location", "contact_faq", "contact_cta"]
  },
  catalog_product: {
    home: ["hero", "category_preview", "featured_products", "advantages", "testimonials", "whatsapp_cta"],
    products: ["product_hero", "product_category_filter", "product_grid", "product_promo_highlight", "faq", "order_cta"],
    product_detail: ["product_detail_hero", "product_specification", "product_recommendation", "product_order_cta"],
    articles: ["article_preview"],
    article_detail: ["article_detail_hero", "article_content", "related_articles", "article_cta"],
    contact: ["contact_information", "maps_location", "contact_cta"]
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
  slug: pageKey === "home" ? "" : pageKey === "article_detail" ? "article-detail" : pageKey,
  sortOrder: index + 1,
  isDynamicDetailPage: pageKey === "article_detail"
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
  contact: "Halaman untuk informasi kontak, lokasi, dan cara calon client menghubungi bisnis."
} as const;

export const COMPANY_PROFILE_DEFAULT_NAV_LABELS = {
  home: "Home",
  about: "Tentang",
  services: "Layanan",
  portfolio: "Portfolio",
  articles: "Artikel",
  article_detail: "Detail Artikel",
  contact: "Kontak"
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
  "article_detail.article_detail_hero": "Pembuka Detail Artikel",
  "article_detail.article_content": "Isi Artikel",
  "article_detail.related_articles": "Artikel Terkait",
  "article_detail.article_cta": "CTA Artikel",
  "contact.contact_hero": "Pembuka Kontak",
  "contact.contact_information": "Informasi Kontak",
  "contact.maps_location": "Lokasi / Maps",
  "contact.contact_faq": "FAQ Kontak",
  "contact.contact_cta": "CTA Kontak"
} as const;

export const COMPANY_PROFILE_SECTION_SLOT_DESCRIPTIONS = Object.fromEntries(
  Object.entries(COMPANY_PROFILE_SECTION_SLOT_LABELS).map(([slotKey, label]) => [slotKey, `${label} untuk halaman ${slotKey.split(".")[0]}.`])
) as Record<keyof typeof COMPANY_PROFILE_SECTION_SLOT_LABELS, string>;
