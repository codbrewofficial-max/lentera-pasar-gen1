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

export const defaultPageVisibility = (pageKey: string) => ({
  isPublished: true,
  isVisibleInNavbar: !isDynamicDetailPage(pageKey),
  isVisibleInFooter: !isDynamicDetailPage(pageKey)
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
          isVisibleInNavbar: isDynamicDetailPage(page.pageKey) ? false : existing.isVisibleInNavbar ?? visibility.isVisibleInNavbar,
          isVisibleInFooter: isDynamicDetailPage(page.pageKey) ? false : existing.isVisibleInFooter ?? visibility.isVisibleInFooter
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
};

export const pageLabel = (pageKey: PageKey) =>
  COMPANY_PROFILE_PAGES.find((page) => page.pageKey === pageKey)?.title || pageKey;
