/*
  Warnings:

  - A unique constraint covering the columns `[websiteId,slug]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_websiteId_slug_key" ON "Portfolio"("websiteId", "slug");
