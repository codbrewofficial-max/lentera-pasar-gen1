export const USER_ROLES = ["internal_admin", "owner_admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const WEBSITE_STATUS = ["draft", "published"] as const;
export type WebsiteStatus = (typeof WEBSITE_STATUS)[number];

export const LEAD_STATUS = ["new", "contacted", "closed", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUS)[number];

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

export const COMPANY_PROFILE_PAGES = [
  { pageKey: "home", title: "Home", slug: "", sortOrder: 1 },
  { pageKey: "about", title: "About", slug: "about", sortOrder: 2 },
  { pageKey: "services", title: "Services", slug: "services", sortOrder: 3 },
  { pageKey: "portfolio", title: "Portfolio", slug: "portfolio", sortOrder: 4 },
  { pageKey: "testimonials", title: "Testimonials", slug: "testimonials", sortOrder: 5 },
  { pageKey: "contact", title: "Contact", slug: "contact", sortOrder: 6 }
] as const;
export type PageKey = (typeof COMPANY_PROFILE_PAGES)[number]["pageKey"];

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

export const WEBSITE_TYPES = [
  {
    key: "company_profile",
    name: "Company Profile",
    description: "Website untuk menampilkan profil bisnis, layanan, portofolio, testimoni, dan kontak.",
    pages: COMPANY_PROFILE_PAGES.map((page) => page.pageKey)
  }
] as const;
export type WebsiteTypeKey = (typeof WEBSITE_TYPES)[number]["key"];

export const isCompanyProfileSlot = (slotKey: string) =>
  COMPANY_PROFILE_SECTION_SLOTS.some((slot) => slot.slotKey === slotKey);
