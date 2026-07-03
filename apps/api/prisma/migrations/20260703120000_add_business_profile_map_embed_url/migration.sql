-- AlterTable: tambah field mapEmbedUrl di BusinessProfile
-- Dipakai supaya section "Lokasi / Maps" di Contact bisa ambil embed URL Google Maps
-- langsung dari Business Profile, bukan dari input per-section lagi.
ALTER TABLE "BusinessProfile" ADD COLUMN IF NOT EXISTS "mapEmbedUrl" TEXT;
