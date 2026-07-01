-- Stage 9D - Featured Content + Owner Branding

ALTER TABLE "BusinessProfile"
  ADD COLUMN IF NOT EXISTS "logoUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "logoAlt" TEXT;

ALTER TABLE "Service"
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "featuredOrder" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Portfolio"
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "featuredOrder" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Article"
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "featuredOrder" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "Service_websiteId_isFeatured_featuredOrder_idx" ON "Service"("websiteId", "isFeatured", "featuredOrder");
CREATE INDEX IF NOT EXISTS "Portfolio_websiteId_isFeatured_featuredOrder_idx" ON "Portfolio"("websiteId", "isFeatured", "featuredOrder");
CREATE INDEX IF NOT EXISTS "Article_websiteId_status_isFeatured_featuredOrder_idx" ON "Article"("websiteId", "status", "isFeatured", "featuredOrder");
