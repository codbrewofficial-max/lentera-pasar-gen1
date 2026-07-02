import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "portfolio";
}

async function main() {
  const portfolios = await prisma.portfolio.findMany({ where: { slug: null } });
  const usedPerWebsite = new Map<string, Set<string>>();

  for (const portfolio of portfolios) {
    const used = usedPerWebsite.get(portfolio.websiteId) || new Set<string>();
    let base = slugify(portfolio.title);
    let candidate = base;
    let suffix = 2;
    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(candidate);
    usedPerWebsite.set(portfolio.websiteId, used);

    await prisma.portfolio.update({ where: { id: portfolio.id }, data: { slug: candidate } });
    console.log(`Portfolio ${portfolio.id} -> slug "${candidate}"`);
  }

  console.log(`Backfilled ${portfolios.length} portfolio(s).`);
}

main().finally(() => prisma.$disconnect());