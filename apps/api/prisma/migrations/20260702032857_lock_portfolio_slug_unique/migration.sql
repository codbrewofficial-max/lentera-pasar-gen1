/*
  Warnings:

  - A unique constraint covering the columns `[websiteId,slug]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.

*/

-- DataMigration: backfill any NULL slugs before enforcing NOT NULL + UNIQUE.
-- This makes the migration self-contained and safe to run with `prisma migrate deploy`
-- without depending on a separate manual backfill script being run first.
UPDATE "Portfolio" AS p
SET "slug" = sub.candidate
FROM (
  SELECT
    id,
    CASE
      WHEN base_slug = '' THEN 'portfolio-' || substr(id::text, 1, 8)
      WHEN row_num = 1 THEN base_slug
      ELSE base_slug || '-' || row_num::text
    END AS candidate
  FROM (
    SELECT
      id,
      "websiteId",
      regexp_replace(regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g') AS base_slug,
      ROW_NUMBER() OVER (
        PARTITION BY "websiteId", regexp_replace(regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')
        ORDER BY "createdAt", id
      ) AS row_num
    FROM "Portfolio"
    WHERE "slug" IS NULL
  ) AS base
) AS sub
WHERE p.id = sub.id;

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_websiteId_slug_key" ON "Portfolio"("websiteId", "slug");
