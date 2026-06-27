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
  const pageByKey = new Map<string, { id: string }>();
  for (const page of COMPANY_PROFILE_PAGES) {
    const created = await tx.websitePage.create({
      data: {
        websiteId,
        pageKey: page.pageKey,
        title: page.title,
        slug: page.slug,
        sortOrder: page.sortOrder
      },
      select: { id: true, pageKey: true }
    });
    pageByKey.set(created.pageKey, created);
  }

  for (const slot of COMPANY_PROFILE_SECTION_SLOTS) {
    const page = pageByKey.get(slot.pageKey);
    if (!page) continue;
    await tx.pageSection.create({
      data: {
        websiteId,
        pageId: page.id,
        slotKey: slot.slotKey,
        sortOrder: slot.sortOrder
      }
    });
  }

  await tx.businessProfile.create({
    data: {
      websiteId,
      name: websiteName
    }
  });
};

export const pageLabel = (pageKey: PageKey) =>
  COMPANY_PROFILE_PAGES.find((page) => page.pageKey === pageKey)?.title || pageKey;
