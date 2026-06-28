-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "TemplateSectionStatus" AS ENUM ('draft', 'active', 'invalid');

-- AlterTable
ALTER TABLE "TemplateSection" ADD COLUMN     "status" "TemplateSectionStatus" NOT NULL DEFAULT 'draft',
ADD COLUMN     "validationErrors" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "primaryWebsiteId" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Article_websiteId_status_sortOrder_idx" ON "Article"("websiteId", "status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Article_websiteId_slug_key" ON "Article"("websiteId", "slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_primaryWebsiteId_fkey" FOREIGN KEY ("primaryWebsiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
