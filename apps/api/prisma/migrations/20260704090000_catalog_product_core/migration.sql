-- Catalog Product Core
-- Model baru untuk Website Type "catalog_product": ProductCategory, Product,
-- ProductImage, ProductVariant, ProductReview, ValueProposition, Banner.
-- Faq, Article, ArticleCategory, dan BrandPartner tetap direuse (tidak diubah).

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "price" DECIMAL(14,2) NOT NULL,
    "compareAtPrice" DECIMAL(14,2),
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredOrder" INTEGER NOT NULL DEFAULT 0,
    "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "priceOverride" DECIMAL(14,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueProposition" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValueProposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_websiteId_slug_key" ON "ProductCategory"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "ProductCategory_websiteId_sortOrder_idx" ON "ProductCategory"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductCategory_websiteId_isActive_idx" ON "ProductCategory"("websiteId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Product_websiteId_slug_key" ON "Product"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "Product_websiteId_sortOrder_idx" ON "Product"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "Product_websiteId_isActive_sortOrder_idx" ON "Product"("websiteId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "Product_websiteId_isFeatured_featuredOrder_idx" ON "Product"("websiteId", "isFeatured", "featuredOrder");

-- CreateIndex
CREATE INDEX "Product_websiteId_isNewArrival_sortOrder_idx" ON "Product"("websiteId", "isNewArrival", "sortOrder");

-- CreateIndex
CREATE INDEX "Product_websiteId_categoryId_idx" ON "Product"("websiteId", "categoryId");

-- CreateIndex
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductImage_productId_isPrimary_idx" ON "ProductImage"("productId", "isPrimary");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_sortOrder_idx" ON "ProductVariant"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_isActive_idx" ON "ProductVariant"("productId", "isActive");

-- CreateIndex
CREATE INDEX "ProductReview_productId_isActive_sortOrder_idx" ON "ProductReview"("productId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ValueProposition_websiteId_sortOrder_idx" ON "ValueProposition"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "ValueProposition_websiteId_isActive_idx" ON "ValueProposition"("websiteId", "isActive");

-- CreateIndex
CREATE INDEX "Banner_websiteId_sortOrder_idx" ON "Banner"("websiteId", "sortOrder");

-- CreateIndex
CREATE INDEX "Banner_websiteId_isActive_idx" ON "Banner"("websiteId", "isActive");

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueProposition" ADD CONSTRAINT "ValueProposition_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
