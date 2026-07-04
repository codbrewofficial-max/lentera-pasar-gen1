import {
  COMPANY_PROFILE_DEFAULT_NAV_LABELS,
  COMPANY_PROFILE_PAGE_PURPOSES,
  COMPANY_PROFILE_PAGES,
  COMPANY_PROFILE_SECTION_SLOTS,
  type PageKey
} from "@lentera-pasar/shared";
import type { Prisma } from "@prisma/client";

export const pagePurpose = (pageKey: string) =>
  (COMPANY_PROFILE_PAGE_PURPOSES as Record<string, string>)[pageKey] || "";

export const defaultPageNavLabel = (pageKey: string) =>
  (COMPANY_PROFILE_DEFAULT_NAV_LABELS as Record<string, string>)[pageKey] || pageKey;

export const isDynamicDetailPage = (pageKey: string) =>
  COMPANY_PROFILE_PAGES.find((page) => page.pageKey === pageKey)?.isDynamicDetailPage || false;

export const isGlobalChromePage = (pageKey: string) =>
  COMPANY_PROFILE_PAGES.find((page) => page.pageKey === pageKey)?.isGlobalChromePage || false;

export const defaultPageVisibility = (pageKey: string) => ({
  isPublished: !isGlobalChromePage(pageKey),
  isVisibleInNavbar: !isDynamicDetailPage(pageKey) && !isGlobalChromePage(pageKey),
  isVisibleInFooter: !isDynamicDetailPage(pageKey) && !isGlobalChromePage(pageKey)
});

export const createCompanyProfileDefaults = async (
  tx: Prisma.TransactionClient,
  websiteId: string,
  websiteName: string
) => {
  await ensureCompanyProfileStructure(tx, websiteId);

  await tx.businessProfile.upsert({
    where: { websiteId },
    update: {},
    create: {
      websiteId,
      name: websiteName
    }
  });
};

export const ensureCompanyProfileStructure = async (
  tx: Prisma.TransactionClient,
  websiteId: string
) => {
  const pageByKey = new Map<string, { id: string; pageKey: string }>();

  for (const page of COMPANY_PROFILE_PAGES) {
    const visibility = defaultPageVisibility(page.pageKey);
    const label = defaultPageNavLabel(page.pageKey);
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
          purpose: existing.purpose || pagePurpose(page.pageKey),
          isPublished: existing.isPublished ?? visibility.isPublished,
          isVisibleInNavbar: isDynamicDetailPage(page.pageKey) || isGlobalChromePage(page.pageKey) ? false : existing.isVisibleInNavbar ?? visibility.isVisibleInNavbar,
          isVisibleInFooter: isDynamicDetailPage(page.pageKey) || isGlobalChromePage(page.pageKey) ? false : existing.isVisibleInFooter ?? visibility.isVisibleInFooter
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
        purpose: pagePurpose(page.pageKey),
        isPublished: visibility.isPublished,
        isVisibleInNavbar: visibility.isVisibleInNavbar,
        isVisibleInFooter: visibility.isVisibleInFooter
      },
      select: { id: true, pageKey: true }
    });
    pageByKey.set(saved.pageKey, saved);
  }

  for (const slot of COMPANY_PROFILE_SECTION_SLOTS) {
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
  const currentSlotKeys = COMPANY_PROFILE_SECTION_SLOTS.map((slot) => slot.slotKey);
  await tx.pageSection.deleteMany({
    where: { websiteId, slotKey: { notIn: currentSlotKeys } }
  });
};

export const pageLabel = (pageKey: PageKey) =>
  COMPANY_PROFILE_PAGES.find((page) => page.pageKey === pageKey)?.title || pageKey;
