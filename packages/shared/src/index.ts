export * from "./website-structure.js";
import {
  CATALOG_PRODUCT_DEFAULT_NAV_LABELS,
  CATALOG_PRODUCT_PAGE_LABELS,
  CATALOG_PRODUCT_PAGE_PURPOSES,
  CATALOG_PRODUCT_PAGES,
  CATALOG_PRODUCT_SECTION_SLOT_DESCRIPTIONS,
  CATALOG_PRODUCT_SECTION_SLOT_LABELS,
  CATALOG_PRODUCT_SECTION_SLOTS,
  COMPANY_PROFILE_PAGE_LABELS,
  COMPANY_PROFILE_PAGES,
  COMPANY_PROFILE_PAGE_PURPOSES,
  COMPANY_PROFILE_DEFAULT_NAV_LABELS,
  COMPANY_PROFILE_SECTION_SLOT_DESCRIPTIONS,
  COMPANY_PROFILE_SECTION_SLOT_LABELS,
  COMPANY_PROFILE_SECTION_SLOTS,
  WEBSITE_TYPES
} from "./website-structure.js";

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

export const ARTICLE_STATUS = ["draft", "published"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUS)[number];
export const ARTICLE_STATUS_LABELS = {
  draft: "Draft",
  published: "Published"
} as const satisfies Record<ArticleStatus, string>;

export const TEMPLATE_SECTION_STATUS = ["draft", "active", "invalid"] as const;
export type TemplateSectionStatus = (typeof TEMPLATE_SECTION_STATUS)[number];
export const TEMPLATE_SECTION_STATUS_LABELS = {
  draft: "Draft",
  active: "Active",
  invalid: "Invalid"
} as const satisfies Record<TemplateSectionStatus, string>;

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
  "portfolio_view",
  "article_view"
] as const;
export type TrackingEventName = (typeof TRACKING_EVENT_NAMES)[number];
export const TRACKING_EVENT_LABELS = {
  page_view: "Page View",
  section_view: "Section View",
  cta_click: "Klik CTA",
  whatsapp_click: "Klik WhatsApp",
  contact_submit: "Form Kontak",
  service_view: "Lihat Layanan",
  portfolio_view: "Lihat Portfolio",
  article_view: "Baca Artikel"
} as const satisfies Record<TrackingEventName, string>;

export const SECTION_FIELD_TYPES = ["text", "textarea", "image_url", "url", "repeater"] as const;
export type SectionFieldType = (typeof SECTION_FIELD_TYPES)[number];

export type CompanyProfilePageKey = (typeof COMPANY_PROFILE_PAGES)[number]["pageKey"];
export type CompanyProfileSlotKey = (typeof COMPANY_PROFILE_SECTION_SLOTS)[number]["slotKey"];
export type CatalogProductPageKey = (typeof CATALOG_PRODUCT_PAGES)[number]["pageKey"];
export type CatalogProductSlotKey = (typeof CATALOG_PRODUCT_SECTION_SLOTS)[number]["slotKey"];

// PageKey/SlotKey sekarang union dari SEMUA website type yang sudah punya struktur
// lengkap (company_profile & catalog_product). Kalau nanti nambah website type baru
// (booking_inquiry, community_website, dst), tinggal union-kan pageKey/slotKey-nya di sini.
export type PageKey = CompanyProfilePageKey | CatalogProductPageKey;
export type SlotKey = CompanyProfileSlotKey | CatalogProductSlotKey;
export type WebsiteTypeKey = (typeof WEBSITE_TYPES)[number]["key"];
export const WEBSITE_TYPE_LABELS = {
  landing_page: "Landing Page",
  catalog_product: "Katalog Produk / Layanan",
  booking_inquiry: "Booking / Inquiry",
  community_website: "Komunitas / Event",
  company_profile: "Company Profile"
} as const satisfies Record<WebsiteTypeKey, string>;

// Kumpulan lookup per website type. Website type yang belum punya struktur
// lengkap (booking_inquiry, community_website, landing_page) fallback ke
// company_profile supaya tidak crash — sama seperti pola di apps/api/src/defaults.ts.
const PAGE_LABEL_SETS: Record<string, Record<string, string>> = {
  company_profile: COMPANY_PROFILE_PAGE_LABELS,
  catalog_product: CATALOG_PRODUCT_PAGE_LABELS
};

const SLOT_LABEL_SETS: Record<string, Record<string, string>> = {
  company_profile: COMPANY_PROFILE_SECTION_SLOT_LABELS,
  catalog_product: CATALOG_PRODUCT_SECTION_SLOT_LABELS
};

const SLOT_DESCRIPTION_SETS: Record<string, Record<string, string>> = {
  company_profile: COMPANY_PROFILE_SECTION_SLOT_DESCRIPTIONS,
  catalog_product: CATALOG_PRODUCT_SECTION_SLOT_DESCRIPTIONS
};

const PAGE_PURPOSE_SETS: Record<string, Record<string, string>> = {
  company_profile: COMPANY_PROFILE_PAGE_PURPOSES,
  catalog_product: CATALOG_PRODUCT_PAGE_PURPOSES
};

const DEFAULT_NAV_LABEL_SETS: Record<string, Record<string, string>> = {
  company_profile: COMPANY_PROFILE_DEFAULT_NAV_LABELS,
  catalog_product: CATALOG_PRODUCT_DEFAULT_NAV_LABELS
};

const SLOT_KEY_SETS: Record<string, ReadonlyArray<{ slotKey: string }>> = {
  company_profile: COMPANY_PROFILE_SECTION_SLOTS,
  catalog_product: CATALOG_PRODUCT_SECTION_SLOTS
};

// Tetap dipertahankan apa adanya (nama & perilaku spesifik Company Profile) —
// tidak dipakai di tempat lain saat ini. Untuk cek generik lintas website type,
// pakai isValidSectionSlot(slotKey, websiteType) di bawah.
export const isCompanyProfileSlot = (slotKey: string) =>
  COMPANY_PROFILE_SECTION_SLOTS.some((slot) => slot.slotKey === slotKey);

export const isValidSectionSlot = (slotKey: string, websiteType: string = "company_profile") =>
  (SLOT_KEY_SETS[websiteType] || SLOT_KEY_SETS.company_profile).some((slot) => slot.slotKey === slotKey);

export const getWebsiteTypeLabel = (key: string) =>
  WEBSITE_TYPE_LABELS[key as WebsiteTypeKey] || key;

export const getWebsiteStatusLabel = (status: string) =>
  WEBSITE_STATUS_LABELS[status as WebsiteStatus] || status;

export const getPageLabel = (pageKey: string, websiteType: string = "company_profile") =>
  (PAGE_LABEL_SETS[websiteType] || PAGE_LABEL_SETS.company_profile)[pageKey] || pageKey;

export const getSlotLabel = (slotKey: string, websiteType: string = "company_profile") =>
  (SLOT_LABEL_SETS[websiteType] || SLOT_LABEL_SETS.company_profile)[slotKey] || slotKey;

export const getSlotDescription = (slotKey: string, websiteType: string = "company_profile") =>
  (SLOT_DESCRIPTION_SETS[websiteType] || SLOT_DESCRIPTION_SETS.company_profile)[slotKey] || "";

export const getLeadStatusLabel = (status: string) =>
  LEAD_STATUS_LABELS[status as LeadStatus] || status;

export const getArticleStatusLabel = (status: string) =>
  ARTICLE_STATUS_LABELS[status as ArticleStatus] || status;

export const getTemplateSectionStatusLabel = (status: string) =>
  TEMPLATE_SECTION_STATUS_LABELS[status as TemplateSectionStatus] || status;


export const getPagePurpose = (pageKey: string, websiteType: string = "company_profile") =>
  (PAGE_PURPOSE_SETS[websiteType] || PAGE_PURPOSE_SETS.company_profile)[pageKey] || "";

export const getDefaultPageNavLabel = (pageKey: string, websiteType: string = "company_profile") =>
  (DEFAULT_NAV_LABEL_SETS[websiteType] || DEFAULT_NAV_LABEL_SETS.company_profile)[pageKey] || getPageLabel(pageKey, websiteType);
