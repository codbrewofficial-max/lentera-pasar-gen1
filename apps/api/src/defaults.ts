import {
  CATALOG_PRODUCT_DEFAULT_NAV_LABELS,
  CATALOG_PRODUCT_PAGE_PURPOSES,
  CATALOG_PRODUCT_PAGES,
  CATALOG_PRODUCT_SECTION_SLOTS,
  COMPANY_PROFILE_DEFAULT_NAV_LABELS,
  COMPANY_PROFILE_PAGE_PURPOSES,
  COMPANY_PROFILE_PAGES,
  COMPANY_PROFILE_SECTION_SLOTS,
  type PageKey
} from "@lentera-pasar/shared";
import type { Prisma } from "@prisma/client";

// Struktur halaman & section per Website Type. Company Profile dan Katalog Produk
// sudah lengkap. Website Type lain (booking_inquiry, community_website, landing_page)
// belum punya CATALOG/BOOKING/COMMUNITY_* constants sendiri di shared package (belum
// digarap), jadi untuk sementara fallback ke struktur Company Profile supaya tidak
// crash — toh belum ada UI/CRUD khusus buat tipe-tipe itu juga.
const WEBSITE_TYPE_STRUCTURE = {
  company_profile: {
    pages: COMPANY_PROFILE_PAGES,
    sectionSlots: COMPANY_PROFILE_SECTION_SLOTS,
    pagePurposes: COMPANY_PROFILE_PAGE_PURPOSES as Record<string, string>,
    defaultNavLabels: COMPANY_PROFILE_DEFAULT_NAV_LABELS as Record<string, string>
  },
  catalog_product: {
    pages: CATALOG_PRODUCT_PAGES,
    sectionSlots: CATALOG_PRODUCT_SECTION_SLOTS,
    pagePurposes: CATALOG_PRODUCT_PAGE_PURPOSES as Record<string, string>,
    defaultNavLabels: CATALOG_PRODUCT_DEFAULT_NAV_LABELS as Record<string, string>
  }
} as const;

type SupportedWebsiteType = keyof typeof WEBSITE_TYPE_STRUCTURE;

const resolveStructure = (websiteType: string) =>
  WEBSITE_TYPE_STRUCTURE[websiteType as SupportedWebsiteType] || WEBSITE_TYPE_STRUCTURE.company_profile;

export const pagesFor = (websiteType: string) => resolveStructure(websiteType).pages;

export const sectionSlotsFor = (websiteType: string) => resolveStructure(websiteType).sectionSlots;

export const pagePurpose = (pageKey: string, websiteType: string = "company_profile") =>
  resolveStructure(websiteType).pagePurposes[pageKey] || "";

export const defaultPageNavLabel = (pageKey: string, websiteType: string = "company_profile") =>
  resolveStructure(websiteType).defaultNavLabels[pageKey] || pageKey;

export const isDynamicDetailPage = (pageKey: string, websiteType: string = "company_profile") =>
  resolveStructure(websiteType).pages.find((page) => page.pageKey === pageKey)?.isDynamicDetailPage || false;

export const isGlobalChromePage = (pageKey: string, websiteType: string = "company_profile") =>
  resolveStructure(websiteType).pages.find((page) => page.pageKey === pageKey)?.isGlobalChromePage || false;

export const defaultPageVisibility = (pageKey: string, websiteType: string = "company_profile") => ({
  isPublished: !isGlobalChromePage(pageKey, websiteType),
  isVisibleInNavbar: !isDynamicDetailPage(pageKey, websiteType) && !isGlobalChromePage(pageKey, websiteType),
  isVisibleInFooter: !isDynamicDetailPage(pageKey, websiteType) && !isGlobalChromePage(pageKey, websiteType)
});

export const createWebsiteDefaults = async (
  tx: Prisma.TransactionClient,
  websiteId: string,
  websiteName: string,
  websiteType: string = "company_profile"
) => {
  await ensureWebsiteStructure(tx, websiteId, websiteType);

  await tx.businessProfile.upsert({
    where: { websiteId },
    update: {},
    create: {
      websiteId,
      name: websiteName
    }
  });
};

// Alias lama dipertahankan biar tidak ada call site yang patah kalau ada yang
// belum sempat diupdate untuk ikut mengirim websiteType — selalu bootstrap
// sebagai company_profile, sama seperti perilaku sebelumnya.
export const createCompanyProfileDefaults = (
  tx: Prisma.TransactionClient,
  websiteId: string,
  websiteName: string
) => createWebsiteDefaults(tx, websiteId, websiteName, "company_profile");

export const ensureWebsiteStructure = async (
  tx: Prisma.TransactionClient,
  websiteId: string,
  websiteType: string = "company_profile"
) => {
  const pages = pagesFor(websiteType);
  const sectionSlots = sectionSlotsFor(websiteType);
  const pageByKey = new Map<string, { id: string; pageKey: string }>();

  for (const page of pages) {
    const visibility = defaultPageVisibility(page.pageKey, websiteType);
    const label = defaultPageNavLabel(page.pageKey, websiteType);
    const existing = await tx.websitePage.findUnique({
      where: { websiteId_pageKey: { websiteId, pageKey: page.pageKey } },
      select: {
        id: true,
        pageKey: true,
        title: true,
        slug: true,
        navLabel: true,
        footerLabel: true,
        purpose: true,
        isPublished: true,
        isVisibleInNavbar: true,
        isVisibleInFooter: true
      }
    });

    if (existing) {
      const saved = await tx.websitePage.update({
        where: { id: existing.id },
        data: {
          sortOrder: page.sortOrder,
          title: existing.title || label,
          navLabel: existing.navLabel || label,
          footerLabel: existing.footerLabel || label,
          purpose: existing.purpose || pagePurpose(page.pageKey, websiteType),
          isPublished: existing.isPublished ?? visibility.isPublished,
          isVisibleInNavbar: isDynamicDetailPage(page.pageKey, websiteType) || isGlobalChromePage(page.pageKey, websiteType) ? false : existing.isVisibleInNavbar ?? visibility.isVisibleInNavbar,
          isVisibleInFooter: isDynamicDetailPage(page.pageKey, websiteType) || isGlobalChromePage(page.pageKey, websiteType) ? false : existing.isVisibleInFooter ?? visibility.isVisibleInFooter
        },
        select: { id: true, pageKey: true }
      });
      pageByKey.set(saved.pageKey, saved);
      continue;
    }

    const saved = await tx.websitePage.create({
      data: {
        websiteId,
        pageKey: page.pageKey,
        title: label,
        navLabel: label,
        footerLabel: label,
        slug: page.slug,
        sortOrder: page.sortOrder,
        purpose: pagePurpose(page.pageKey, websiteType),
        isPublished: visibility.isPublished,
        isVisibleInNavbar: visibility.isVisibleInNavbar,
        isVisibleInFooter: visibility.isVisibleInFooter
      },
      select: { id: true, pageKey: true }
    });
    pageByKey.set(saved.pageKey, saved);
  }

  for (const slot of sectionSlots) {
    const page = pageByKey.get(slot.pageKey);
    if (!page) continue;
    await tx.pageSection.upsert({
      where: { websiteId_slotKey: { websiteId, slotKey: slot.slotKey } },
      update: { pageId: page.id, sortOrder: slot.sortOrder },
      create: {
        websiteId,
        pageId: page.id,
        slotKey: slot.slotKey,
        sortOrder: slot.sortOrder
      }
    });
  }

  // Bersihkan PageSection yang slotKey-nya sudah tidak ada lagi di struktur saat ini
  // (mis. "article_detail.article_detail_hero" / "portfolio_detail.portfolio_detail_hero"
  // yang sudah digabung ke dalam slot Content). Tanpa ini, "Sync Structure" cuma nambah
  // section baru dan section basi/deprecated akan terus nyangkut selamanya di database.
  const currentSlotKeys = sectionSlots.map((slot) => slot.slotKey);
  await tx.pageSection.deleteMany({
    where: { websiteId, slotKey: { notIn: currentSlotKeys } }
  });
};

// Alias lama.
export const ensureCompanyProfileStructure = (tx: Prisma.TransactionClient, websiteId: string) =>
  ensureWebsiteStructure(tx, websiteId, "company_profile");

export const pageLabel = (pageKey: PageKey | string, websiteType: string = "company_profile") =>
  resolveStructure(websiteType).pages.find((page) => page.pageKey === pageKey)?.title || pageKey;
