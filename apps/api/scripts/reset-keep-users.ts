import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CountSummary = {
  users: number;
  websites: number;
  templatePacks: number;
  templateSections: number;
  articles: number;
  faqs: number;
  mediaAssets: number;
  articleCategories: number;
  portfolioCategories: number;
  leads: number;
  trackingEvents: number;
  auditLogs: number;
};

const delegate = (modelName: string) => (prisma as any)[modelName];

async function countModel(modelName: string) {
  const model = delegate(modelName);
  if (!model?.count) return 0;
  return model.count();
}

async function deleteModel(modelName: string) {
  const model = delegate(modelName);
  if (!model?.deleteMany) return 0;
  const result = await model.deleteMany({});
  return result.count || 0;
}

async function getSummary(): Promise<CountSummary> {
  return {
    users: await countModel("user"),
    websites: await countModel("website"),
    templatePacks: await countModel("templatePack"),
    templateSections: await countModel("templateSection"),
    articles: await countModel("article"),
    faqs: await countModel("faq"),
    mediaAssets: await countModel("mediaAsset"),
    articleCategories: await countModel("articleCategory"),
    portfolioCategories: await countModel("portfolioCategory"),
    leads:
      (await countModel("lead")) +
      (await countModel("contactLead")) +
      (await countModel("contactMessage")),
    trackingEvents: await countModel("trackingEvent"),
    auditLogs: await countModel("auditLog")
  };
}

async function nullPrimaryWebsite() {
  const user = delegate("user");
  if (!user?.updateMany) return 0;
  const result = await user.updateMany({
    where: { primaryWebsiteId: { not: null } },
    data: { primaryWebsiteId: null }
  });
  return result.count || 0;
}

async function main() {
  const before = await getSummary();

  const usersUpdated = await nullPrimaryWebsite();

  const deleteOrder = [
    "auditLog",
    "trackingEvent",
    "contactMessage",
    "contactLead",
    "lead",
    "mediaAsset",
    "article",
    "articleCategory",
    "faq",
    "service",
    "portfolio",
    "portfolioCategory",
    "testimonial",
    "brandPartner",
    "businessProfile",
    "websitePageSlugHistory",
    "pageSection",
    "websitePage",
    "website",
    "templateSection",
    "templatePack"
  ];

  const deleted: Record<string, number> = {};
  for (const modelName of deleteOrder) {
    deleted[modelName] = await deleteModel(modelName);
  }

  const after = await getSummary();

  console.log(
    JSON.stringify(
      {
        message: "Database reset completed. User records were preserved.",
        usersUpdatedPrimaryWebsiteIdToNull: usersUpdated,
        before,
        deleted,
        after
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
