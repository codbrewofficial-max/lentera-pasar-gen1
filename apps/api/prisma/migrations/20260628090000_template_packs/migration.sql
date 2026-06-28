CREATE TYPE "TemplatePackStatus" AS ENUM ('draft', 'active', 'invalid');

CREATE TABLE "TemplatePack" (
    "id" TEXT NOT NULL,
    "templatePackKey" TEXT NOT NULL,
    "websiteType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "status" "TemplatePackStatus" NOT NULL DEFAULT 'draft',
    "validationSummaryJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplatePack_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TemplateSection" ADD COLUMN "templatePackId" TEXT;
ALTER TABLE "TemplateSection" ADD COLUMN "pageKey" TEXT;

UPDATE "TemplateSection"
SET "pageKey" = split_part("slotKey", '.', 1)
WHERE "pageKey" IS NULL;

CREATE UNIQUE INDEX "TemplatePack_templatePackKey_key" ON "TemplatePack"("templatePackKey");
CREATE INDEX "TemplatePack_websiteType_status_idx" ON "TemplatePack"("websiteType", "status");
CREATE INDEX "TemplateSection_templatePackId_idx" ON "TemplateSection"("templatePackId");

ALTER TABLE "TemplateSection" ADD CONSTRAINT "TemplateSection_templatePackId_fkey" FOREIGN KEY ("templatePackId") REFERENCES "TemplatePack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
