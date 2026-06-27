export const USER_ROLES = ["internal_admin", "owner_admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const USER_ROLE_LABELS = {
  internal_admin: "Internal Admin",
  owner_admin: "Owner Admin"
} as const satisfies Record<UserRole, string>;

export const WEBSITE_STATUS = ["draft", "published"] as const;
export type WebsiteStatus = (typeof WEBSITE_STATUS)[number];
export const WEBSITE_STATUS_LABELS = {
  draft: "Draft",
  published: "Published"
} as const satisfies Record<WebsiteStatus, string>;

export const LEAD_STATUS = ["new", "contacted", "closed", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUS)[number];
export const LEAD_STATUS_LABELS = {
  new: "Baru",
  contacted: "Sudah Dihubungi",
  closed: "Closing",
  lost: "Tidak Lanjut"
} as const satisfies Record<LeadStatus, string>;

export const TRACKING_EVENT_NAMES = [
  "page_view",
  "section_view",
  "cta_click",
  "whatsapp_click",
  "contact_submit",
  "service_view",
  "portfolio_view"
] as const;
export type TrackingEventName = (typeof TRACKING_EVENT_NAMES)[number];
export const TRACKING_EVENT_LABELS = {
  page_view: "Page View",
  section_view: "Section View",
  cta_click: "Klik CTA",
  whatsapp_click: "Klik WhatsApp",
  contact_submit: "Form Kontak",
  service_view: "Lihat Layanan",
  portfolio_view: "Lihat Portfolio"
} as const satisfies Record<TrackingEventName, string>;

export const SECTION_FIELD_TYPES = ["text", "textarea", "image_url", "url"] as const;
export type SectionFieldType = (typeof SECTION_FIELD_TYPES)[number];

export const COMPANY_PROFILE_PAGES = [
  { pageKey: "home", title: "Home", slug: "", sortOrder: 1 },
  { pageKey: "about", title: "About", slug: "about", sortOrder: 2 },
  { pageKey: "services", title: "Services", slug: "services", sortOrder: 3 },
  { pageKey: "portfolio", title: "Portfolio", slug: "portfolio", sortOrder: 4 },
  { pageKey: "testimonials", title: "Testimonials", slug: "testimonials", sortOrder: 5 },
  { pageKey: "contact", title: "Contact", slug: "contact", sortOrder: 6 }
] as const;
export type PageKey = (typeof COMPANY_PROFILE_PAGES)[number]["pageKey"];
export const COMPANY_PROFILE_PAGE_LABELS = {
  home: "Home",
  about: "About",
  services: "Services",
  portfolio: "Portfolio",
  testimonials: "Testimonials",
  contact: "Contact"
} as const satisfies Record<PageKey, string>;

export const COMPANY_PROFILE_SECTION_SLOTS = [
  { pageKey: "home", slotKey: "home.hero", sortOrder: 1 },
  { pageKey: "home", slotKey: "home.about_preview", sortOrder: 2 },
  { pageKey: "home", slotKey: "home.services_preview", sortOrder: 3 },
  { pageKey: "home", slotKey: "home.portfolio_preview", sortOrder: 4 },
  { pageKey: "home", slotKey: "home.testimonial_preview", sortOrder: 5 },
  { pageKey: "home", slotKey: "home.cta", sortOrder: 6 },
  { pageKey: "about", slotKey: "about.business_profile", sortOrder: 1 },
  { pageKey: "about", slotKey: "about.vision_mission", sortOrder: 2 },
  { pageKey: "about", slotKey: "about.timeline", sortOrder: 3 },
  { pageKey: "services", slotKey: "services.service_list", sortOrder: 1 },
  { pageKey: "portfolio", slotKey: "portfolio.portfolio_grid", sortOrder: 1 },
  { pageKey: "testimonials", slotKey: "testimonials.testimonial_list", sortOrder: 1 },
  { pageKey: "contact", slotKey: "contact.contact_info", sortOrder: 1 },
  { pageKey: "contact", slotKey: "contact.contact_form", sortOrder: 2 }
] as const;
export type SlotKey = (typeof COMPANY_PROFILE_SECTION_SLOTS)[number]["slotKey"];
export const COMPANY_PROFILE_SECTION_SLOT_LABELS = {
  "home.hero": "Hero",
  "home.about_preview": "Ringkasan Profil",
  "home.services_preview": "Ringkasan Layanan",
  "home.portfolio_preview": "Ringkasan Portfolio",
  "home.testimonial_preview": "Ringkasan Testimoni",
  "home.cta": "Ajakan Menghubungi",
  "about.business_profile": "Profil Bisnis",
  "about.vision_mission": "Visi & Misi",
  "about.timeline": "Sejarah Singkat",
  "services.service_list": "Daftar Layanan",
  "portfolio.portfolio_grid": "Galeri Portfolio",
  "testimonials.testimonial_list": "Daftar Testimoni",
  "contact.contact_info": "Informasi Kontak",
  "contact.contact_form": "Form Kontak"
} as const satisfies Record<SlotKey, string>;

export const COMPANY_PROFILE_SECTION_SLOT_DESCRIPTIONS = {
  "home.hero": "Bagian pembuka utama website.",
  "home.about_preview": "Ringkasan singkat profil bisnis di halaman home.",
  "home.services_preview": "Cuplikan layanan utama di halaman home.",
  "home.portfolio_preview": "Cuplikan portfolio utama di halaman home.",
  "home.testimonial_preview": "Cuplikan testimoni pelanggan di halaman home.",
  "home.cta": "Ajakan agar pengunjung segera menghubungi bisnis.",
  "about.business_profile": "Profil lengkap bisnis dan penjelasan utama.",
  "about.vision_mission": "Bagian untuk menampilkan visi dan misi bisnis.",
  "about.timeline": "Sejarah singkat atau perjalanan bisnis.",
  "services.service_list": "Daftar layanan yang ditawarkan bisnis.",
  "portfolio.portfolio_grid": "Galeri portfolio atau project bisnis.",
  "testimonials.testimonial_list": "Daftar testimoni dari pelanggan.",
  "contact.contact_info": "Informasi kontak bisnis.",
  "contact.contact_form": "Form untuk menerima pesan atau lead dari pengunjung."
} as const satisfies Record<SlotKey, string>;

export const WEBSITE_TYPES = [
  {
    key: "company_profile",
    name: "Company Profile",
    description: "Website untuk menampilkan profil bisnis, layanan, portofolio, testimoni, dan kontak.",
    pages: COMPANY_PROFILE_PAGES.map((page) => page.pageKey)
  }
] as const;
export type WebsiteTypeKey = (typeof WEBSITE_TYPES)[number]["key"];
export const WEBSITE_TYPE_LABELS = {
  company_profile: "Company Profile"
} as const satisfies Record<WebsiteTypeKey, string>;

export const isCompanyProfileSlot = (slotKey: string) =>
  COMPANY_PROFILE_SECTION_SLOTS.some((slot) => slot.slotKey === slotKey);

export const getWebsiteTypeLabel = (key: string) =>
  WEBSITE_TYPE_LABELS[key as WebsiteTypeKey] || key;

export const getWebsiteStatusLabel = (status: string) =>
  WEBSITE_STATUS_LABELS[status as WebsiteStatus] || status;

export const getPageLabel = (pageKey: string) =>
  COMPANY_PROFILE_PAGE_LABELS[pageKey as PageKey] || pageKey;

export const getSlotLabel = (slotKey: string) =>
  COMPANY_PROFILE_SECTION_SLOT_LABELS[slotKey as SlotKey] || slotKey;

export const getSlotDescription = (slotKey: string) =>
  COMPANY_PROFILE_SECTION_SLOT_DESCRIPTIONS[slotKey as SlotKey] || "";

export const getLeadStatusLabel = (status: string) =>
  LEAD_STATUS_LABELS[status as LeadStatus] || status;
