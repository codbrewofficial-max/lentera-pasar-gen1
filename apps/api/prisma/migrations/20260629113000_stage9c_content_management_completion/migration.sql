-- Stage 9C — Content Management Completion
-- Adds FAQ, Media Library, Article Categories, and Portfolio Categories.

CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "pageKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PortfolioCategory" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "storagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Article" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "Portfolio" ADD COLUMN "categoryId" TEXT;

CREATE UNIQUE INDEX "ArticleCategory_websiteId_slug_key" ON "ArticleCategory"("websiteId", "slug");
CREATE UNIQUE INDEX "PortfolioCategory_websiteId_slug_key" ON "PortfolioCategory"("websiteId", "slug");

CREATE INDEX "Faq_websiteId_pageKey_sortOrder_idx" ON "Faq"("websiteId", "pageKey", "sortOrder");
CREATE INDEX "Faq_websiteId_isActive_idx" ON "Faq"("websiteId", "isActive");
CREATE INDEX "ArticleCategory_websiteId_sortOrder_idx" ON "ArticleCategory"("websiteId", "sortOrder");
CREATE INDEX "ArticleCategory_websiteId_isActive_idx" ON "ArticleCategory"("websiteId", "isActive");
CREATE INDEX "PortfolioCategory_websiteId_sortOrder_idx" ON "PortfolioCategory"("websiteId", "sortOrder");
CREATE INDEX "PortfolioCategory_websiteId_isActive_idx" ON "PortfolioCategory"("websiteId", "isActive");
CREATE INDEX "MediaAsset_websiteId_createdAt_idx" ON "MediaAsset"("websiteId", "createdAt");
CREATE INDEX "MediaAsset_websiteId_mimeType_idx" ON "MediaAsset"("websiteId", "mimeType");
CREATE INDEX "Article_websiteId_categoryId_idx" ON "Article"("websiteId", "categoryId");
CREATE INDEX "Portfolio_websiteId_categoryId_idx" ON "Portfolio"("websiteId", "categoryId");

ALTER TABLE "Faq" ADD CONSTRAINT "Faq_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArticleCategory" ADD CONSTRAINT "ArticleCategory_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PortfolioCategory" ADD CONSTRAINT "PortfolioCategory_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PortfolioCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
