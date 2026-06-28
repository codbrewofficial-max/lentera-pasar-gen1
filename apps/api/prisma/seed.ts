import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { COMPANY_PROFILE_PAGES, COMPANY_PROFILE_SECTION_SLOTS, getSlotLabel } from "@lentera-pasar/shared";
import { createCompanyProfileDefaults } from "../src/defaults.js";
import { hashPassword, prismaJson, randomToken } from "../src/security.js";

const prisma = new PrismaClient();

const field = (key: string, label: string, type = "text") => ({ key, label, type });

const pascal = (value: string) =>
  value
    .split(/[_\-.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const templates = COMPANY_PROFILE_SECTION_SLOTS.map((slot) => [
  `${slot.slotKey.replace(".", "-")}-default`,
  slot.slotKey,
  `${getSlotLabel(slot.slotKey)} Default`,
  `${pascal(slot.slotKey)}Section`,
  "default"
] as const);

async function main() {
  const passwordHash = await hashPassword("password123");
  const internal = await prisma.user.upsert({
    where: { email: "internal@lenterapasar.test" },
    update: { name: "Internal Admin Demo", passwordHash, role: "internal_admin" },
    create: { name: "Internal Admin Demo", email: "internal@lenterapasar.test", passwordHash, role: "internal_admin" }
  });
  const owner = await prisma.user.upsert({
    where: { email: "owner@lenterapasar.test" },
    update: { name: "Owner Demo", passwordHash, role: "owner_admin", whatsapp: "6281234567890" },
    create: { name: "Owner Demo", email: "owner@lenterapasar.test", passwordHash, role: "owner_admin", whatsapp: "6281234567890" }
  });

  const website = await prisma.website.upsert({
    where: { slug: "lentera-demo" },
    update: { ownerId: owner.id, name: "Lentera Demo Company", status: "published" },
    create: {
      ownerId: owner.id,
      name: "Lentera Demo Company",
      slug: "lentera-demo",
      websiteType: "company_profile",
      status: "published",
      trackingKey: randomToken("trk")
    }
  });

  const validPageKeys = COMPANY_PROFILE_PAGES.map((page) => page.pageKey);
  const validSlotKeys = COMPANY_PROFILE_SECTION_SLOTS.map((slot) => slot.slotKey);
  await prisma.pageSection.deleteMany({ where: { websiteId: website.id, slotKey: { notIn: validSlotKeys } } });
  await prisma.websitePage.deleteMany({ where: { websiteId: website.id, pageKey: { notIn: validPageKeys } } });
  await createCompanyProfileDefaults(prisma, website.id, website.name);

  const demoTemplatePack = await prisma.templatePack.upsert({
    where: { templatePackKey: "company-profile-demo-default" },
    update: {
      websiteType: "company_profile",
      name: "Company Profile Demo Default",
      theme: "formal",
      version: "1.0.0",
      description: "Template pack demo bawaan untuk Company Profile.",
      status: "active",
      validationSummaryJson: {
        expectedPages: COMPANY_PROFILE_PAGES.length,
        expectedSlots: COMPANY_PROFILE_SECTION_SLOTS.length,
        foundSections: COMPANY_PROFILE_SECTION_SLOTS.length,
        validSections: COMPANY_PROFILE_SECTION_SLOTS.length,
        draftSections: 0,
        invalidSections: 0,
        errors: [],
        warnings: []
      }
    },
    create: {
      templatePackKey: "company-profile-demo-default",
      websiteType: "company_profile",
      name: "Company Profile Demo Default",
      theme: "formal",
      version: "1.0.0",
      description: "Template pack demo bawaan untuk Company Profile.",
      status: "active",
      validationSummaryJson: {
        expectedPages: COMPANY_PROFILE_PAGES.length,
        expectedSlots: COMPANY_PROFILE_SECTION_SLOTS.length,
        foundSections: COMPANY_PROFILE_SECTION_SLOTS.length,
        validSections: COMPANY_PROFILE_SECTION_SLOTS.length,
        draftSections: 0,
        invalidSections: 0,
        errors: [],
        warnings: []
      }
    }
  });

  for (const [sectionKey, slotKey, name, component, variant] of templates) {
    await prisma.templateSection.upsert({
      where: { sectionKey },
      update: {
        templatePackId: demoTemplatePack.id,
        slotKey,
        pageKey: slotKey.split(".")[0],
        name,
        component,
        variant,
        websiteType: "company_profile",
        schemaJson: [field("title", "Judul Utama"), field("subtitle", "Deskripsi Singkat", "textarea")],
        defaultContentJson: {
          title: name,
          subtitle: "Konten demo siap diganti dari dashboard owner."
        },
        status: "active",
        isActive: true
      },
      create: {
        templatePackId: demoTemplatePack.id,
        sectionKey,
        websiteType: "company_profile",
        pageKey: slotKey.split(".")[0],
        slotKey,
        name,
        component,
        variant,
        schemaJson: [field("title", "Judul Utama"), field("subtitle", "Deskripsi Singkat", "textarea")],
        defaultContentJson: {
          title: name,
          subtitle: "Konten demo siap diganti dari dashboard owner."
        },
        status: "active",
        isActive: true
      }
    });
  }

  for (const slot of COMPANY_PROFILE_SECTION_SLOTS) {
    const template = await prisma.templateSection.findFirst({ where: { slotKey: slot.slotKey } });
    if (!template) continue;
    await prisma.pageSection.update({
      where: { websiteId_slotKey: { websiteId: website.id, slotKey: slot.slotKey } },
      data: { templateSectionId: template.id, contentJson: template.defaultContentJson as any }
    });
  }

  await prisma.businessProfile.upsert({
    where: { websiteId: website.id },
    update: {
      name: "Lentera Demo Company",
      tagline: "Partner digital untuk bisnis yang ingin tampil dipercaya.",
      description: "Kami membantu bisnis lokal membangun company profile yang rapi, mudah ditemukan, dan siap menerima calon client.",
      vision: "Menjadi partner digital yang membuat bisnis lokal lebih mudah dipercaya.",
      mission: "Membuat website company profile yang jelas, cepat, dan terukur.",
      timelineJson: [
        { year: "2024", title: "Mulai Melayani UMKM" },
        { year: "2025", title: "Mengembangkan Template Builder" },
        { year: "2026", title: "MVP Lentera Pasar" }
      ],
      contactEmail: "halo@lenterademo.test",
      phone: "021-123456",
      whatsapp: "6281234567890",
      address: "Jakarta, Indonesia"
    },
    create: {
      websiteId: website.id,
      name: "Lentera Demo Company",
      tagline: "Partner digital untuk bisnis yang ingin tampil dipercaya.",
      description: "Kami membantu bisnis lokal membangun company profile yang rapi, mudah ditemukan, dan siap menerima calon client.",
      vision: "Menjadi partner digital yang membuat bisnis lokal lebih mudah dipercaya.",
      mission: "Membuat website company profile yang jelas, cepat, dan terukur.",
      timelineJson: [{ year: "2026", title: "MVP Lentera Pasar" }],
      contactEmail: "halo@lenterademo.test",
      phone: "021-123456",
      whatsapp: "6281234567890",
      address: "Jakarta, Indonesia"
    }
  });

  await prisma.service.deleteMany({ where: { websiteId: website.id } });
  await prisma.portfolio.deleteMany({ where: { websiteId: website.id } });
  await prisma.testimonial.deleteMany({ where: { websiteId: website.id } });
  await prisma.brandPartner.deleteMany({ where: { websiteId: website.id } });
  await prisma.article.deleteMany({ where: { websiteId: website.id } });
  const services = await Promise.all([
    prisma.service.create({ data: { websiteId: website.id, title: "Company Profile Website", description: "Website profil bisnis siap publish.", sortOrder: 1 } }),
    prisma.service.create({ data: { websiteId: website.id, title: "Landing Page Campaign", description: "Halaman promosi untuk layanan utama.", sortOrder: 2 } }),
    prisma.service.create({ data: { websiteId: website.id, title: "Tracking Insight", description: "Insight ketertarikan calon client.", sortOrder: 3 } })
  ]);
  const portfolios = await Promise.all([
    prisma.portfolio.create({ data: { websiteId: website.id, title: "Profil Konsultan", description: "Website jasa konsultan.", sortOrder: 1 } }),
    prisma.portfolio.create({ data: { websiteId: website.id, title: "Profil Kontraktor", description: "Website kontraktor lokal.", sortOrder: 2 } }),
    prisma.portfolio.create({ data: { websiteId: website.id, title: "Profil Klinik", description: "Website layanan kesehatan.", sortOrder: 3 } })
  ]);
  await prisma.testimonial.createMany({
    data: [
      { websiteId: website.id, name: "Budi Santoso", role: "Owner", company: "Budi Teknik", quote: "Website kami jadi lebih mudah dipahami calon client.", sortOrder: 1 },
      { websiteId: website.id, name: "Rina Putri", role: "Marketing", company: "Putri Studio", quote: "Tim sales lebih mudah follow up karena lead lebih jelas.", sortOrder: 2 },
      { websiteId: website.id, name: "Andi Wijaya", role: "Founder", company: "Wijaya Digital", quote: "Insight layanan yang paling diminati sangat membantu.", sortOrder: 3 }
    ]
  });
  await prisma.brandPartner.createMany({
    data: [
      { websiteId: website.id, name: "Partner A", url: "https://example.com/a", sortOrder: 1 },
      { websiteId: website.id, name: "Partner B", url: "https://example.com/b", sortOrder: 2 },
      { websiteId: website.id, name: "Partner C", url: "https://example.com/c", sortOrder: 3 }
    ]
  });
  const now = new Date();
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        websiteId: website.id,
        title: "Cara Membuat Company Profile Lebih Dipercaya",
        slug: "cara-membuat-company-profile-lebih-dipercaya",
        excerpt: "Panduan singkat menata profil bisnis agar mudah dipercaya calon pelanggan.",
        content: "Company profile yang baik menjelaskan siapa Anda, layanan utama, bukti kerja, dan cara menghubungi bisnis.",
        coverImageUrl: "https://picsum.photos/seed/article-1/900/500",
        seoTitle: "Cara Membuat Company Profile Lebih Dipercaya",
        seoDescription: "Pelajari elemen dasar company profile yang dipercaya calon pelanggan.",
        status: "published",
        sortOrder: 1,
        publishedAt: now
      }
    }),
    prisma.article.create({
      data: {
        websiteId: website.id,
        title: "Mengapa Portfolio Penting untuk Bisnis Jasa",
        slug: "mengapa-portfolio-penting-untuk-bisnis-jasa",
        excerpt: "Portfolio membantu calon pelanggan melihat kualitas hasil kerja sebelum menghubungi Anda.",
        content: "Portfolio yang rapi membuat bukti kerja lebih mudah dipahami dan meningkatkan keyakinan calon pelanggan.",
        coverImageUrl: "https://picsum.photos/seed/article-2/900/500",
        status: "published",
        sortOrder: 2,
        publishedAt: now
      }
    }),
    prisma.article.create({
      data: {
        websiteId: website.id,
        title: "Tips Mengubah Pengunjung Website Menjadi Lead",
        slug: "tips-mengubah-pengunjung-website-menjadi-lead",
        excerpt: "CTA, kontak, dan pesan layanan yang jelas membantu pengunjung mengambil langkah berikutnya.",
        content: "Lead lebih mudah masuk ketika pengunjung menemukan informasi yang jelas dan tombol kontak yang mudah dijangkau.",
        coverImageUrl: "https://picsum.photos/seed/article-3/900/500",
        status: "published",
        sortOrder: 3,
        publishedAt: now
      }
    }),
    prisma.article.create({
      data: {
        websiteId: website.id,
        title: "Draft Strategi Konten Website",
        slug: "draft-strategi-konten-website",
        excerpt: "Draft artikel internal untuk rencana konten berikutnya.",
        content: "Artikel ini masih draft dan tidak tampil di public API.",
        status: "draft",
        sortOrder: 4
      }
    })
  ]);

  await prisma.trackingEvent.deleteMany({ where: { websiteId: website.id } });
  const events = [
    ["page_view", "home", null, null, null],
    ["page_view", "services", null, null, null],
    ["page_view", "portfolio", null, null, null],
    ["section_view", "home", "home.service_preview", null, null],
    ["cta_click", "home", "home.cta_contact", null, null],
    ["whatsapp_click", "contact", "contact.contact_information", null, null],
    ["service_view", "services", "services.service_grid", "service", services[0].id],
    ["service_view", "services", "services.service_grid", "service", services[0].id],
    ["service_view", "services", "services.service_grid", "service", services[1].id],
    ["portfolio_view", "portfolio", "portfolio.portfolio_grid", "portfolio", portfolios[0].id],
    ["portfolio_view", "portfolio", "portfolio.portfolio_grid", "portfolio", portfolios[0].id],
    ["contact_submit", "contact", "contact.contact_information", null, null],
    ["article_view", "articles", null, "article", articles[0].id],
    ["article_view", "articles", null, "article", articles[0].id],
    ["article_view", "articles", null, "article", articles[1].id]
  ] as const;
  for (let i = 0; i < events.length; i += 1) {
    const [eventName, pageKey, slotKey, objectType, objectId] = events[i];
    await prisma.trackingEvent.create({
      data: {
        websiteId: website.id,
        trackingKey: website.trackingKey,
        visitorId: `visitor_${i % 4}`,
        sessionId: `session_${i}`,
        eventName,
        pageKey,
        slotKey,
        objectType,
        objectId,
        ctaKey: eventName.includes("click") ? "primary" : null,
        referrer: i % 2 === 0 ? "https://google.com" : null,
        utmJson: prismaJson(i % 2 === 0 ? { source: "google", medium: "organic" } : null),
        ipHash: "seeded",
        userAgent: "seed"
      }
    });
  }
  await prisma.user.update({ where: { id: owner.id }, data: { primaryWebsiteId: website.id } });
  await prisma.lead.create({
    data: {
      websiteId: website.id,
      name: "Budi Lead",
      email: "budi@example.com",
      phone: "08123456789",
      message: "Saya tertarik dengan layanan company profile.",
      interest: "Company Profile",
      sourcePage: "contact",
      sourceSection: "contact.contact_information"
    }
  });

  console.log({ internal: internal.email, owner: owner.email, website: website.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
