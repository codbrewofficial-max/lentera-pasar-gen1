import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  COMPANY_PROFILE_DEFAULT_NAV_LABELS,
  COMPANY_PROFILE_PAGE_PURPOSES,
  COMPANY_PROFILE_PAGES
} from "@lentera-pasar/shared";

const prisma = new PrismaClient();

const isDynamicDetailPage = (pageKey: string) =>
  COMPANY_PROFILE_PAGES.find((page) => page.pageKey === pageKey)?.isDynamicDetailPage || false;

const defaultLabel = (pageKey: string, fallback: string) =>
  (COMPANY_PROFILE_DEFAULT_NAV_LABELS as Record<string, string>)[pageKey] || fallback;

const defaultPurpose = (pageKey: string) =>
  (COMPANY_PROFILE_PAGE_PURPOSES as Record<string, string>)[pageKey] || null;

async function main() {
  const pages = await prisma.websitePage.findMany({ orderBy: [{ websiteId: "asc" }, { sortOrder: "asc" }] });
  let updated = 0;

  for (const page of pages) {
    const dynamic = isDynamicDetailPage(page.pageKey);
    await prisma.websitePage.update({
      where: { id: page.id },
      data: {
        navLabel: page.navLabel || defaultLabel(page.pageKey, page.title),
        footerLabel: page.footerLabel || page.navLabel || defaultLabel(page.pageKey, page.title),
        purpose: page.purpose || defaultPurpose(page.pageKey),
        isPublished: page.isPublished ?? page.isActive,
        isVisibleInNavbar: dynamic ? false : page.isVisibleInNavbar,
        isVisibleInFooter: dynamic ? false : page.isVisibleInFooter
      }
    });
    updated += 1;
  }

  console.log(JSON.stringify({ message: "Page navigation backfill completed", updated }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
