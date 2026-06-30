-- CreateTable: BusinessTimeline
CREATE TABLE "BusinessTimeline" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable: TeamMember
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessTimeline_websiteId_sortOrder_idx" ON "BusinessTimeline"("websiteId", "sortOrder");
CREATE INDEX "BusinessTimeline_websiteId_isActive_idx" ON "BusinessTimeline"("websiteId", "isActive");

CREATE INDEX "TeamMember_websiteId_sortOrder_idx" ON "TeamMember"("websiteId", "sortOrder");
CREATE INDEX "TeamMember_websiteId_isActive_idx" ON "TeamMember"("websiteId", "isActive");

-- AddForeignKey
ALTER TABLE "BusinessTimeline" ADD CONSTRAINT "BusinessTimeline_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
