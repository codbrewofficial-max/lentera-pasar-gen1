import "dotenv/config";
import { prisma } from "../src/prisma.js";
import { ensureCompanyProfileStructure } from "../src/defaults.js";

async function main() {
  const websites = await prisma.website.findMany({ where: { websiteType: "company_profile" }, select: { id: true, slug: true } });
  for (const website of websites) {
    await prisma.$transaction(async (tx) => {
      await ensureCompanyProfileStructure(tx, website.id);
    });
  }
  console.log({ backfilled: websites.length });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
