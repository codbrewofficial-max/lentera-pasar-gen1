-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('internal_admin', 'owner_admin');

-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'closed', 'lost');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "websiteType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "WebsiteStatus" NOT NULL DEFAULT 'draft',
    "trackingKey" TEXT NOT NULL,
    "themeJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsitePage" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WebsitePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSection" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    "templateSectionId" TEXT,
    "contentJson" JSONB,
    "sourceMode" TEXT NOT NULL DEFAULT 'manual',
    "sortOrder" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateSection" (
    "id" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "websiteType" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "variant" TEXT,
    "schemaJson" JSONB NOT NULL,
    "defaultContentJson" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "timelineJson" JSONB,
    "contactEmail" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "quote" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandPartner" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "url" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "interest" TEXT,
    "sourcePage" TEXT,
    "sourceSection" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingEvent" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "trackingKey" TEXT NOT NULL,
    "visitorId" TEXT,
    "sessionId" TEXT,
    "eventName" TEXT NOT NULL,
    "pageKey" TEXT,
    "pageSlug" TEXT,
    "slotKey" TEXT,
    "sectionKey" TEXT,
    "objectType" TEXT,
    "objectId" TEXT,
    "ctaKey" TEXT,
    "referrer" TEXT,
    "utmJson" JSONB,
    "metadataJson" JSONB,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Website_slug_key" ON "Website"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Website_trackingKey_key" ON "Website"("trackingKey");

-- CreateIndex
CREATE INDEX "Website_ownerId_idx" ON "Website"("ownerId");

-- CreateIndex
CREATE INDEX "Website_websiteType_idx" ON "Website"("websiteType");

-- CreateIndex
CREATE INDEX "Website_status_idx" ON "Website"("status");

-- CreateIndex
CREATE INDEX "WebsitePage_websiteId_sortOrder_idx" ON "WebsitePage"("websiteId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "WebsitePage_websiteId_pageKey_key" ON "WebsitePage"("websiteId", "pageKey");

-- CreateIndex
CREATE UNIQUE INDEX "WebsitePage_websiteId_slug_key" ON "WebsitePage"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "PageSection_websiteId_pageId_idx" ON "PageSection"("websiteId", "pageId");

-- CreateIndex
CREATE UNIQUE INDEX "PageSection_websiteId_slotKey_key" ON "PageSection"("websiteId", "slotKey");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateSection_sectionKey_key" ON "TemplateSection"("sectionKey");

-- CreateIndex
CREATE INDEX "TemplateSection_websiteType_slotKey_idx" ON "TemplateSection"("websiteType", "slotKey");

-- CreateIndex
CREATE INDEX "TemplateSection_isActive_idx" ON "TemplateSection"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_websiteId_key" ON "BusinessProfile"("websiteId");

-- CreateIndex
CREATE INDEX "Service_websiteId_sortOrder_idx" ON "Service"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "Portfolio_websiteId_sortOrder_idx" ON "Portfolio"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_websiteId_sortOrder_idx" ON "Testimonial"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "BrandPartner_websiteId_sortOrder_idx" ON "BrandPartner"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "Lead_websiteId_status_createdAt_idx" ON "Lead"("websiteId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "TrackingEvent_trackingKey_idx" ON "TrackingEvent"("trackingKey");

-- CreateIndex
CREATE INDEX "TrackingEvent_websiteId_eventName_createdAt_idx" ON "TrackingEvent"("websiteId", "eventName", "createdAt");

-- CreateIndex
CREATE INDEX "TrackingEvent_websiteId_pageKey_createdAt_idx" ON "TrackingEvent"("websiteId", "pageKey", "createdAt");

-- CreateIndex
CREATE INDEX "TrackingEvent_websiteId_slotKey_createdAt_idx" ON "TrackingEvent"("websiteId", "slotKey", "createdAt");

-- CreateIndex
CREATE INDEX "TrackingEvent_websiteId_objectType_objectId_createdAt_idx" ON "TrackingEvent"("websiteId", "objectType", "objectId", "createdAt");

-- CreateIndex
CREATE INDEX "TrackingEvent_websiteId_visitorId_idx" ON "TrackingEvent"("websiteId", "visitorId");

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsitePage" ADD CONSTRAINT "WebsitePage_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSection" ADD CONSTRAINT "PageSection_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSection" ADD CONSTRAINT "PageSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "WebsitePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSection" ADD CONSTRAINT "PageSection_templateSectionId_fkey" FOREIGN KEY ("templateSectionId") REFERENCES "TemplateSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandPartner" ADD CONSTRAINT "BrandPartner_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
