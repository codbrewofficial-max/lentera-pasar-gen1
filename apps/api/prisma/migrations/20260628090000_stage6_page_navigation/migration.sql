-- Stage 6: Page, navigation, slug history, and SEO setup
ALTER TABLE "WebsitePage" ADD COLUMN "navLabel" TEXT;
ALTER TABLE "WebsitePage" ADD COLUMN "footerLabel" TEXT;
ALTER TABLE "WebsitePage" ADD COLUMN "purpose" TEXT;
ALTER TABLE "WebsitePage" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WebsitePage" ADD COLUMN "isVisibleInNavbar" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WebsitePage" ADD COLUMN "isVisibleInFooter" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WebsitePage" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "WebsitePage" ADD COLUMN "seoDescription" TEXT;

CREATE TABLE "WebsitePageSlugHistory" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "oldSlug" TEXT NOT NULL,
    "newSlug" TEXT NOT NULL,
    "redirectType" INTEGER NOT NULL DEFAULT 301,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsitePageSlugHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WebsitePage_websiteId_isPublished_idx" ON "WebsitePage"("websiteId", "isPublished");
CREATE INDEX "WebsitePage_websiteId_isVisibleInNavbar_idx" ON "WebsitePage"("websiteId", "isVisibleInNavbar");
CREATE INDEX "WebsitePageSlugHistory_websiteId_oldSlug_idx" ON "WebsitePageSlugHistory"("websiteId", "oldSlug");
CREATE INDEX "WebsitePageSlugHistory_websiteId_pageKey_idx" ON "WebsitePageSlugHistory"("websiteId", "pageKey");

ALTER TABLE "WebsitePageSlugHistory" ADD CONSTRAINT "WebsitePageSlugHistory_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WebsitePageSlugHistory" ADD CONSTRAINT "WebsitePageSlugHistory_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "WebsitePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
