-- AlterTable: add social media fields to BusinessProfile
ALTER TABLE "BusinessProfile" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
ALTER TABLE "BusinessProfile" ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT;
ALTER TABLE "BusinessProfile" ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;
ALTER TABLE "BusinessProfile" ADD COLUMN IF NOT EXISTS "twitterUrl" TEXT;
ALTER TABLE "BusinessProfile" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;
