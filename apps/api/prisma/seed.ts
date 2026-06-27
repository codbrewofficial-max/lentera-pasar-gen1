import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { COMPANY_PROFILE_SECTION_SLOTS } from "@lentera-pasar/shared";
import { createCompanyProfileDefaults } from "../src/defaults.js";
import { hashPassword, prismaJson, randomToken } from "../src/security.js";

const prisma = new PrismaClient();

const field = (key: string, label: string, type = "text") => ({ key, label, type });

const templates = [
  ["hero-clean", "home.hero", "Hero Clean", "HeroSection", "clean"],
  ["about-simple", "home.about_preview", "About Simple", "AboutPreviewSection", "simple"],
  ["services-grid-clean", "home.services_preview", "Services Grid Clean", "ServicesPreviewSection", "clean"],
  ["portfolio-grid-simple", "home.portfolio_preview", "Portfolio Grid Simple", "PortfolioPreviewSection", "simple"],
  ["testimonial-card-soft", "home.testimonial_preview", "Testimonial Card Soft", "TestimonialPreviewSection", "soft"],
  ["cta-basic", "home.cta", "CTA Basic", "CtaSection", "basic"],
  ["business-profile-basic", "about.business_profile", "Business Profile Basic", "BusinessProfileSection", "basic"],
  ["vision-mission-basic", "about.vision_mission", "Vision Mission Basic", "VisionMissionSection", "basic"],
  ["timeline-basic", "about.timeline", "Timeline Basic", "TimelineSection", "basic"],
  ["service-list-clean", "services.service_list", "Service List Clean", "ServiceListSection", "clean"],
  ["portfolio-grid-clean", "portfolio.portfolio_grid", "Portfolio Grid Clean", "PortfolioGridSection", "clean"],
  ["testimonial-list-clean", "testimonials.testimonial_list", "Testimonial List Clean", "TestimonialListSection", "clean"],
  ["contact-info-basic", "contact.contact_info", "Contact Info Basic", "ContactInfoSection", "basic"],
  ["contact-form-basic", "contact.contact_form", "Contact Form Basic", "ContactFormSection", "basic"]
] as const;

async function main() {
  const passwordHash = await hashPassword("password123");
  const internal = await prisma.user.upsert({
    where: { email: "internal@lenterapasar.test" },
    update: { name: "Internal Admin Demo", passwordHash, role: "internal_admin" },
    create: { name: "Internal Admin Demo", email: "internal@lenterapasar.test", passwordHash, role: "internal_admin" }
  });
  const owner = await prisma.user.upsert({
    where: { email: "owner@lenterapasar.test" },
    update: { name: "Owner Demo", passwordHash, role: "owner_admin" },
    create: { name: "Owner Demo", email: "owner@lenterapasar.test", passwordHash, role: "owner_admin" }
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

  if ((await prisma.websitePage.count({ where: { websiteId: website.id } })) === 0) {
    await createCompanyProfileDefaults(prisma, website.id, website.name);
  }

  for (const [sectionKey, slotKey, name, component, variant] of templates) {
    await prisma.templateSection.upsert({
      where: { sectionKey },
      update: {
        slotKey,
        name,
        component,
        variant,
        websiteType: "company_profile",
        schemaJson: [field("title", "Judul Utama"), field("subtitle", "Deskripsi Singkat", "textarea")],
        defaultContentJson: {
          title: name,
          subtitle: "Konten demo siap diganti dari dashboard owner."
        },
        isActive: true
      },
      create: {
        sectionKey,
        websiteType: "company_profile",
        slotKey,
        name,
        component,
        variant,
        schemaJson: [field("title", "Judul Utama"), field("subtitle", "Deskripsi Singkat", "textarea")],
        defaultContentJson: {
          title: name,
          subtitle: "Konten demo siap diganti dari dashboard owner."
        }
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

  await prisma.trackingEvent.deleteMany({ where: { websiteId: website.id } });
  const events = [
    ["page_view", "home", null, null, null],
    ["page_view", "services", null, null, null],
    ["page_view", "portfolio", null, null, null],
    ["section_view", "home", "home.services_preview", null, null],
    ["cta_click", "home", "home.cta", null, null],
    ["whatsapp_click", "contact", "contact.contact_info", null, null],
    ["service_view", "services", "services.service_list", "service", services[0].id],
    ["service_view", "services", "services.service_list", "service", services[0].id],
    ["service_view", "services", "services.service_list", "service", services[1].id],
    ["portfolio_view", "portfolio", "portfolio.portfolio_grid", "portfolio", portfolios[0].id],
    ["portfolio_view", "portfolio", "portfolio.portfolio_grid", "portfolio", portfolios[0].id],
    ["contact_submit", "contact", "contact.contact_form", null, null]
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
  await prisma.lead.create({
    data: {
      websiteId: website.id,
      name: "Budi Lead",
      email: "budi@example.com",
      phone: "08123456789",
      message: "Saya tertarik dengan layanan company profile.",
      interest: "Company Profile",
      sourcePage: "contact",
      sourceSection: "contact.contact_form"
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
