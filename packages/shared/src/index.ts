export * from "./website-structure.js";
import {
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

export type PageKey = (typeof COMPANY_PROFILE_PAGES)[number]["pageKey"];
export type SlotKey = (typeof COMPANY_PROFILE_SECTION_SLOTS)[number]["slotKey"];
export type WebsiteTypeKey = (typeof WEBSITE_TYPES)[number]["key"];
export const WEBSITE_TYPE_LABELS = {
  landing_page: "Landing Page",
  catalog_product: "Katalog Produk / Layanan",
  booking_inquiry: "Booking / Inquiry",
  community_website: "Komunitas / Event",
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
  (COMPANY_PROFILE_SECTION_SLOT_LABELS as Record<string, string>)[slotKey] || slotKey;

export const getSlotDescription = (slotKey: string) =>
  (COMPANY_PROFILE_SECTION_SLOT_DESCRIPTIONS as Record<string, string>)[slotKey] || "";

export const getLeadStatusLabel = (status: string) =>
  LEAD_STATUS_LABELS[status as LeadStatus] || status;

export const getArticleStatusLabel = (status: string) =>
  ARTICLE_STATUS_LABELS[status as ArticleStatus] || status;

export const getTemplateSectionStatusLabel = (status: string) =>
  TEMPLATE_SECTION_STATUS_LABELS[status as TemplateSectionStatus] || status;


export const getPagePurpose = (pageKey: string) =>
  (COMPANY_PROFILE_PAGE_PURPOSES as Record<string, string>)[pageKey] || "";

export const getDefaultPageNavLabel = (pageKey: string) =>
  (COMPANY_PROFILE_DEFAULT_NAV_LABELS as Record<string, string>)[pageKey] || getPageLabel(pageKey);
