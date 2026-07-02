import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Menghapus SEMUA data yang dibuat oleh scripts/smoke.ts, berdasarkan pola email akun
// yang dipakai smoke test: smoke-owner-*@lenterapasar.test dan smoke-user-*@lenterapasar.test.
// Akun demo (owner@lenterapasar.test, internal@lenterapasar.test) dan data manual/asli TIDAK
// disentuh karena tidak cocok pola ini.
//
// Urutan hapus: Website dulu (cascade otomatis ke pages/sections/services/portfolios/
// testimonials/brand-partners/articles/faqs/timelines/team-members/media/kategori/leads/
// tracking-events sesuai onDelete: Cascade di schema), baru User-nya. AuditLog milik akun
// smoke otomatis di-SetNull (bukan ikut terhapus), jadi jejak audit tetap ada kalau perlu ditelusuri.
async function main() {
  const smokeUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { startsWith: "smoke-owner-", endsWith: "@lenterapasar.test" } },
        { email: { startsWith: "smoke-user-", endsWith: "@lenterapasar.test" } }
      ]
    },
    select: { id: true, email: true }
  });

  if (!smokeUsers.length) {
    console.log("Tidak ada data smoke test yang ditemukan. Tidak ada yang dihapus.");
    return;
  }

  const userIds = smokeUsers.map((u) => u.id);

  const deletedWebsites = await prisma.website.deleteMany({ where: { ownerId: { in: userIds } } });
  const deletedUsers = await prisma.user.deleteMany({ where: { id: { in: userIds } } });

  console.log(`Dihapus: ${deletedWebsites.count} website (+ semua data turunannya), ${deletedUsers.count} user smoke test.`);
  for (const u of smokeUsers) {
    console.log(` - ${u.email}`);
  }
}

main().finally(() => prisma.$disconnect());
