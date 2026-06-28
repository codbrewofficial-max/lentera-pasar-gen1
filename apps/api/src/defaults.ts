import {
  COMPANY_PROFILE_PAGES,
  COMPANY_PROFILE_SECTION_SLOTS,
  type PageKey
} from "@lentera-pasar/shared";
import type { Prisma } from "@prisma/client";

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
  const pageByKey = new Map<string, { id: string }>();
  for (const page of COMPANY_PROFILE_PAGES) {
    const existing = await tx.websitePage.findUnique({
      where: { websiteId_pageKey: { websiteId, pageKey: page.pageKey } },
      select: { id: true, pageKey: true }
    });
    const saved = existing || await tx.websitePage.create({
      data: {
        websiteId,
        pageKey: page.pageKey,
        title: page.title,
        slug: page.slug,
        sortOrder: page.sortOrder
      },
      select: { id: true, pageKey: true }
    });
    if (existing) {
      await tx.websitePage.update({
        where: { id: existing.id },
        data: { title: page.title, slug: page.slug, sortOrder: page.sortOrder }
      });
    }
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

export const isDynamicDetailPage = (pageKey: string) =>
  COMPANY_PROFILE_PAGES.find((page) => page.pageKey === pageKey)?.isDynamicDetailPage || false;
