-- CreateEnum
CREATE TYPE "WebsiteLifecycleStatus" AS ENUM ('active', 'suspended', 'nonactive');

-- CreateEnum
CREATE TYPE "UserAccountStatus" AS ENUM ('active', 'non_active', 'suspended', 'banned', 'blacklisted');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountStatus" "UserAccountStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "lifecycleStatus" "WebsiteLifecycleStatus" NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");

-- CreateIndex
CREATE INDEX "Website_lifecycleStatus_idx" ON "Website"("lifecycleStatus");
