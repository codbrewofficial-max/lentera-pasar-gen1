import "dotenv/config";
import AdmZip from "adm-zip";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyRequest } from "fastify";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  COMPANY_PROFILE_PAGES,
  COMPANY_PROFILE_SECTION_SLOTS,
  LEAD_STATUS,
  SECTION_FIELD_TYPES,
  TRACKING_EVENT_NAMES,
  WEBSITE_TYPES,
  getLeadStatusLabel,
  getPageLabel,
  getSlotDescription,
  getSlotLabel,
  getWebsiteStatusLabel,
  getWebsiteTypeLabel,
  isCompanyProfileSlot
} from "@lentera-pasar/shared";
import { prisma } from "./prisma.js";
import { createCompanyProfileDefaults } from "./defaults.js";
import { AppError, created, ok, publicUser, toErrorPayload } from "./http.js";
import { hashIp, hashPassword, limitJson, prismaJson, randomToken, verifyPassword } from "./security.js";

type AuthUser = { id: string; role: "internal_admin" | "owner_admin"; email: string };
type Req = FastifyRequest<{ Params?: Record<string, string>; Querystring?: Record<string, string> }>;

const app = Fastify({ logger: true });

const publicUrlFor = (website: { slug: string; status: string }) =>
  website.status === "published" ? `/${website.slug}` : null;

const websiteSummary = (website: any) => ({
  id: website.id,
  name: website.name,
  slug: website.slug,
  websiteType: website.websiteType,
  websiteTypeLabel: getWebsiteTypeLabel(website.websiteType),
  status: website.status,
  statusLabel: getWebsiteStatusLabel(website.status),
  trackingKey: website.trackingKey,
  publicUrl: publicUrlFor(website),
  previewPath: `/websites/${website.id}/preview/pages/home`,
  createdAt: website.createdAt,
  updatedAt: website.updatedAt
});

const normalizeFieldType = (type: unknown) => {
  if (type === "image") return "image_url";
  return SECTION_FIELD_TYPES.includes(type as any) ? type : "text";
};

const normalizeSectionSchema = (schema: unknown) => {
  if (!Array.isArray(schema)) return [];
  return schema
    .filter((field) => field && typeof field === "object")
    .map((field: any) => ({
      key: String(field.key || ""),
      label: String(field.label || field.key || ""),
      type: normalizeFieldType(field.type),
      required: Boolean(field.required),
      placeholder: field.placeholder || null,
      helpText: field.helpText || null
    }))
    .filter((field) => field.key && field.label);
};

const templateSummary = (template: any) =>
  template
    ? {
        id: template.id,
        sectionKey: template.sectionKey,
        name: template.name,
        component: template.component,
        variant: template.variant
      }
    : null;

const templateContract = (template: any) => ({
  id: template.id,
  sectionKey: template.sectionKey,
  slotKey: template.slotKey,
  slotLabel: getSlotLabel(template.slotKey),
  websiteType: template.websiteType,
  websiteTypeLabel: getWebsiteTypeLabel(template.websiteType),
  name: template.name,
  component: template.component,
  variant: template.variant,
  schema: normalizeSectionSchema(template.schemaJson),
  defaultContent: template.defaultContentJson || {}
});

const mergeContent = (template: any, contentJson: unknown) => ({
  ...((template?.defaultContentJson as Record<string, unknown> | null) || {}),
  ...((contentJson as Record<string, unknown> | null) || {})
});

const sectionDetailContract = (section: any, websiteId: string) => ({
  id: section.id,
  slotKey: section.slotKey,
  slotLabel: getSlotLabel(section.slotKey),
  slotDescription: getSlotDescription(section.slotKey),
  sortOrder: section.sortOrder,
  isVisible: section.isVisible,
  hasTemplate: Boolean(section.templateSection),
  hasContent: Boolean(section.contentJson && Object.keys(section.contentJson as Record<string, unknown>).length > 0),
  templateSection: section.templateSection
    ? {
        ...templateSummary(section.templateSection),
        schema: normalizeSectionSchema(section.templateSection.schemaJson),
        defaultContent: section.templateSection.defaultContentJson || {}
      }
    : null,
  contentJson: section.contentJson || {},
  effectiveContent: mergeContent(section.templateSection, section.contentJson),
  actions: {
    chooseTemplatePath: `/websites/${websiteId}/sections/${section.slotKey}/choose`,
    editContentPath: `/websites/${websiteId}/sections/${section.slotKey}/edit`
  }
});

const pageDashboardSummary = (page: any) => {
  const sections = page.sections || [];
  return {
    id: page.id,
    pageKey: page.pageKey,
    title: page.title,
    slug: page.slug,
    pageLabel: getPageLabel(page.pageKey),
    sectionCount: sections.length,
    filledSectionCount: sections.filter((section: any) => section.templateSectionId || section.contentJson).length,
    sortOrder: page.sortOrder,
    isActive: page.isActive
  };
};

const leadContract = (lead: any) => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  message: lead.message,
  interest: lead.interest,
  status: lead.status,
  statusLabel: getLeadStatusLabel(lead.status),
  sourcePage: lead.sourcePage,
  sourcePageLabel: lead.sourcePage ? getPageLabel(lead.sourcePage) : null,
  sourceSection: lead.sourceSection,
  sourceSectionLabel: lead.sourceSection ? getSlotLabel(lead.sourceSection) : null,
  createdAt: lead.createdAt
});

const ctaLabel = (ctaKey: string | null) => {
  if (!ctaKey) return null;
  const labels: Record<string, string> = {
    primary: "CTA Utama",
    hero_primary: "CTA Hero Utama",
    whatsapp: "WhatsApp"
  };
  return labels[ctaKey] || ctaKey;
};

const authBody = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8)
});
const createOwnerBody = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});
const patchOwnerBody = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional()
});
const websiteBody = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  websiteType: z.literal("company_profile")
});
const patchWebsiteBody = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  themeJson: z.unknown().optional()
});
const businessProfileBody = z.object({
  name: z.string().min(2),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  vision: z.string().nullable().optional(),
  mission: z.string().nullable().optional(),
  timelineJson: z.unknown().nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  address: z.string().nullable().optional()
});
const listItemBody = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const testimonialBody = z.object({
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  quote: z.string().min(1),
  avatarUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const brandBody = z.object({
  name: z.string().min(1),
  logoUrl: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const sectionTemplateBody = z.object({ templateSectionId: z.string().min(1) });
const sectionContentBody = z.object({ contentJson: z.record(z.unknown()) });
const visibilityBody = z.object({ isVisible: z.boolean() });
const trackingBody = z.object({
  trackingKey: z.string().min(1),
  eventName: z.enum(TRACKING_EVENT_NAMES),
  visitorId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  pageKey: z.string().nullable().optional(),
  pageSlug: z.string().nullable().optional(),
  slotKey: z.string().nullable().optional(),
  sectionKey: z.string().nullable().optional(),
  objectType: z.string().nullable().optional(),
  objectId: z.string().nullable().optional(),
  ctaKey: z.string().nullable().optional(),
  referrer: z.string().nullable().optional(),
  utm: z.unknown().nullable().optional(),
  metadata: z.unknown().nullable().optional()
});
const contactBody = z.object({
  name: z.string().min(1),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  interest: z.string().nullable().optional(),
  sourcePage: z.string().nullable().optional(),
  sourceSection: z.string().nullable().optional(),
  tracking: z
    .object({
      visitorId: z.string().nullable().optional(),
      sessionId: z.string().nullable().optional(),
      referrer: z.string().nullable().optional(),
      utm: z.unknown().nullable().optional()
    })
    .optional()
});

const registerPlugins = async () => {
  await app.register(cors, { origin: (process.env.CORS_ORIGIN || "*").split(",") });
  await app.register(helmet);
  await app.register(jwt, { secret: process.env.JWT_SECRET || "dev-secret" });
  await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
  await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
};

const requireAuth = async (request: FastifyRequest) => {
  try {
    await request.jwtVerify();
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required");
  }
  return request.user as AuthUser;
};

const requireRole = async (request: FastifyRequest, roles: AuthUser["role"][]) => {
  const user = await requireAuth(request);
  if (!roles.includes(user.role)) throw new AppError(403, "FORBIDDEN", "You do not have access");
  return user;
};

const getWebsiteForAccess = async (request: Req, websiteId?: string) => {
  const user = await requireAuth(request);
  const id = websiteId || request.params?.websiteId;
  if (!id) throw new AppError(400, "WEBSITE_ID_REQUIRED", "Website id is required");
  const website = await prisma.website.findUnique({ where: { id } });
  if (!website) throw new AppError(404, "WEBSITE_NOT_FOUND", "Website not found");
  if (user.role !== "internal_admin" && website.ownerId !== user.id) {
    throw new AppError(403, "FORBIDDEN", "You do not have access to this website");
  }
  return { user, website };
};

const buildPublicPage = async (websiteId: string, pageWhere: { pageKey?: string; slug?: string }) => {
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    include: { businessProfile: true }
  });
  if (!website) throw new AppError(404, "WEBSITE_NOT_FOUND", "Website not found");
  const page = await prisma.websitePage.findFirst({
    where: { websiteId, isActive: true, ...pageWhere },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        include: { templateSection: true }
      }
    }
  });
  if (!page) throw new AppError(404, "PAGE_NOT_FOUND", "Page not found");
  const [services, portfolios, testimonials, brands] = await Promise.all([
    prisma.service.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.portfolio.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.brandPartner.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } })
  ]);
  const navigation = COMPANY_PROFILE_PAGES.map((navPage) => ({
    label: navPage.title,
    href: navPage.slug ? `/${website.slug}/${navPage.slug}` : `/${website.slug}`
  }));
  return {
    website: {
      id: website.id,
      name: website.name,
      slug: website.slug,
      websiteType: website.websiteType,
      websiteTypeLabel: getWebsiteTypeLabel(website.websiteType),
      status: website.status,
      trackingKey: website.trackingKey,
      theme: website.themeJson || {}
    },
    seo: {
      title: website.businessProfile?.tagline ? `${website.name} - ${website.businessProfile.tagline}` : website.name,
      description: website.businessProfile?.description || website.businessProfile?.tagline || website.name
    },
    businessProfile: website.businessProfile,
    navigation,
    page: {
      pageKey: page.pageKey,
      title: page.title,
      slug: page.slug,
      sections: page.sections
        .filter((section: any) => section.templateSection)
        .map((section: any) => ({
          id: section.id,
          slotKey: section.slotKey,
          slotLabel: getSlotLabel(section.slotKey),
          sectionKey: section.templateSection?.sectionKey || null,
          component: section.templateSection?.component || null,
          variant: section.templateSection?.variant || null,
          content: mergeContent(section.templateSection, section.contentJson),
          tracking: {
            slotKey: section.slotKey,
            sectionKey: section.templateSection?.sectionKey || null
          },
          data: { services, portfolios, testimonials, brands }
        }))
    }
  };
};

const recordTracking = async (request: FastifyRequest, input: z.infer<typeof trackingBody>) => {
  const website = await prisma.website.findUnique({ where: { trackingKey: input.trackingKey } });
  if (!website) throw new AppError(404, "INVALID_TRACKING_KEY", "Tracking key not found");
  return prisma.trackingEvent.create({
    data: {
      websiteId: website.id,
      trackingKey: input.trackingKey,
      visitorId: input.visitorId || null,
      sessionId: input.sessionId || null,
      eventName: input.eventName,
      pageKey: input.pageKey || null,
      pageSlug: input.pageSlug || null,
      slotKey: input.slotKey || null,
      sectionKey: input.sectionKey || null,
      objectType: input.objectType || null,
      objectId: input.objectId || null,
      ctaKey: input.ctaKey || null,
      referrer: input.referrer || null,
      utmJson: prismaJson(limitJson(input.utm)),
      metadataJson: prismaJson(limitJson(input.metadata)),
      ipHash: hashIp(request.ip),
      userAgent: request.headers["user-agent"] || null
    }
  });
};

const registerAuthRoutes = () => {
  app.post("/api/v1/auth/register", async (request, reply) => {
    const body = authBody.parse(request.body);
    const count = await prisma.user.count();
    const role = count === 0 ? "internal_admin" : "owner_admin";
    const user = await prisma.user.create({
      data: {
        name: body.name || body.email.split("@")[0],
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        role
      }
    });
    return created(reply, { user: publicUser(user), token: app.jwt.sign({ id: user.id, role: user.role, email: user.email }) }, "Registered");
  });
  app.post("/api/v1/auth/login", async (request, reply) => {
    const body = authBody.omit({ name: true }).parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }
    return ok(reply, { user: publicUser(user), token: app.jwt.sign({ id: user.id, role: user.role, email: user.email }) }, "Logged in");
  });
  app.get("/api/v1/auth/me", async (request, reply) => {
    const auth = await requireAuth(request);
    const user = await prisma.user.findUnique({ where: { id: auth.id } });
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
    return ok(reply, publicUser(user), "Current user loaded");
  });
  app.post("/api/v1/auth/logout", async (_request, reply) => ok(reply, true, "Logged out"));
};

const registerCoreRoutes = () => {
  app.get("/api/v1/health", async (_request, reply) => ok(reply, { status: "ok" }, "API healthy"));
  app.get("/api/v1/website-types", async (_request, reply) => ok(reply, WEBSITE_TYPES, "Website types loaded"));
};

const registerInternalRoutes = () => {
  app.get("/api/v1/internal/owners", async (request, reply) => {
    await requireRole(request, ["internal_admin"]);
    const owners = await prisma.user.findMany({ where: { role: "owner_admin" }, orderBy: { createdAt: "desc" } });
    return ok(reply, owners.map(publicUser), "Owners loaded");
  });
  app.post("/api/v1/internal/owners", async (request, reply) => {
    await requireRole(request, ["internal_admin"]);
    const body = createOwnerBody.parse(request.body);
    const owner = await prisma.user.create({
      data: { name: body.name, email: body.email.toLowerCase(), passwordHash: await hashPassword(body.password), role: "owner_admin" }
    });
    return created(reply, publicUser(owner), "Owner created");
  });
  app.get("/api/v1/internal/owners/:ownerId", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);
    const owner = await prisma.user.findUnique({ where: { id: request.params?.ownerId }, include: { websites: true } });
    if (!owner || owner.role !== "owner_admin") throw new AppError(404, "OWNER_NOT_FOUND", "Owner not found");
    return ok(reply, publicUser(owner), "Owner loaded");
  });
  app.patch("/api/v1/internal/owners/:ownerId", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);
    const body = patchOwnerBody.parse(request.body);
    const owner = await prisma.user.update({
      where: { id: request.params?.ownerId },
      data: {
        name: body.name,
        email: body.email?.toLowerCase(),
        passwordHash: body.password ? await hashPassword(body.password) : undefined
      }
    });
    return ok(reply, publicUser(owner), "Owner updated");
  });
  app.get("/api/v1/internal/websites", async (request, reply) => {
    await requireRole(request, ["internal_admin"]);
    const websites = await prisma.website.findMany({ include: { owner: true }, orderBy: { createdAt: "desc" } });
    return ok(reply, websites.map((site: any) => ({ ...site, owner: publicUser(site.owner) })), "Websites loaded");
  });
  app.get("/api/v1/internal/websites/:websiteId", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);
    const website = await prisma.website.findUnique({
      where: { id: request.params?.websiteId },
      include: { owner: true, pages: true, sections: true, businessProfile: true }
    });
    if (!website) throw new AppError(404, "WEBSITE_NOT_FOUND", "Website not found");
    return ok(reply, { ...website, owner: publicUser(website.owner) }, "Website loaded");
  });
};

const registerWebsiteRoutes = () => {
  app.get("/api/v1/websites", async (request, reply) => {
    const user = await requireAuth(request);
    const websites = await prisma.website.findMany({
      where: user.role === "internal_admin" ? undefined : { ownerId: user.id },
      orderBy: { createdAt: "desc" }
    });
    return ok(reply, websites.map(websiteSummary), "Websites loaded");
  });
  app.post("/api/v1/websites", async (request, reply) => {
    const user = await requireRole(request, ["owner_admin", "internal_admin"]);
    const body = websiteBody.parse(request.body);
    const website = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.website.create({
        data: {
          ownerId: user.id,
          websiteType: body.websiteType,
          name: body.name,
          slug: body.slug,
          trackingKey: randomToken("trk")
        }
      });
      await createCompanyProfileDefaults(tx, created.id, created.name);
      return created;
    });
    return created(reply, websiteSummary(website), "Website created");
  });
  app.get("/api/v1/websites/:websiteId", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const [pagesCount, sectionsCount, filledSectionsCount] = await Promise.all([
      prisma.websitePage.count({ where: { websiteId: website.id } }),
      prisma.pageSection.count({ where: { websiteId: website.id } }),
      prisma.pageSection.count({
        where: {
          websiteId: website.id,
          OR: [{ templateSectionId: { not: null } }, { contentJson: { not: Prisma.JsonNull } }]
        }
      })
    ]);
    return ok(reply, {
      ...websiteSummary(website),
      pagesCount,
      sectionsCount,
      filledSectionsCount,
      publishedAt: website.status === "published" ? website.updatedAt : null
    }, "Website loaded");
  });
  app.patch("/api/v1/websites/:websiteId", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = patchWebsiteBody.parse(request.body);
    const updated = await prisma.website.update({ where: { id: website.id }, data: { ...body, themeJson: prismaJson(limitJson(body.themeJson)) } });
    return ok(reply, websiteSummary(updated), "Website updated");
  });
  app.post("/api/v1/websites/:websiteId/publish", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const updated = await prisma.website.update({ where: { id: website.id }, data: { status: "published" } });
    return ok(reply, websiteSummary(updated), "Website published");
  });
  app.post("/api/v1/websites/:websiteId/unpublish", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const updated = await prisma.website.update({ where: { id: website.id }, data: { status: "draft" } });
    return ok(reply, websiteSummary(updated), "Website unpublished");
  });
  app.get("/api/v1/websites/:websiteId/pages", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const pages = await prisma.websitePage.findMany({
      where: { websiteId: website.id },
      include: { sections: true },
      orderBy: { sortOrder: "asc" }
    });
    return ok(reply, pages.map(pageDashboardSummary), "Pages loaded");
  });
  app.get("/api/v1/websites/:websiteId/pages/:pageKey", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const page = await prisma.websitePage.findUnique({
      where: { websiteId_pageKey: { websiteId: website.id, pageKey: request.params?.pageKey || "" } },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
          include: { templateSection: true }
        }
      }
    });
    if (!page) throw new AppError(404, "PAGE_NOT_FOUND", "Page not found");
    return ok(reply, {
      id: page.id,
      pageKey: page.pageKey,
      title: page.title,
      slug: page.slug,
      pageLabel: getPageLabel(page.pageKey),
      isActive: page.isActive,
      sections: page.sections.map((section: any) => sectionDetailContract(section, website.id))
    }, "Page loaded");
  });
};

const registerSectionRoutes = () => {
  app.get("/api/v1/websites/:websiteId/sections", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const sections = await prisma.pageSection.findMany({ where: { websiteId: website.id }, include: { templateSection: true }, orderBy: { sortOrder: "asc" } });
    return ok(reply, sections.map((section: any) => sectionDetailContract(section, website.id)), "Sections loaded");
  });
  app.get("/api/v1/websites/:websiteId/sections/:slotKey", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const section = await prisma.pageSection.findUnique({ where: { websiteId_slotKey: { websiteId: website.id, slotKey: request.params?.slotKey || "" } }, include: { templateSection: true } });
    if (!section) throw new AppError(404, "SECTION_NOT_FOUND", "Section not found");
    return ok(reply, sectionDetailContract(section, website.id), "Section loaded");
  });
  app.patch("/api/v1/websites/:websiteId/sections/:slotKey/template", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = sectionTemplateBody.parse(request.body);
    const section = await prisma.pageSection.findUnique({ where: { websiteId_slotKey: { websiteId: website.id, slotKey: request.params?.slotKey || "" } } });
    const template = await prisma.templateSection.findUnique({ where: { id: body.templateSectionId } });
    if (!section || !template || template.slotKey !== section.slotKey || template.websiteType !== "company_profile") {
      throw new AppError(400, "INVALID_TEMPLATE_SECTION", "Template section does not match this slot");
    }
    const updated = await prisma.pageSection.update({ where: { id: section.id }, data: { templateSectionId: template.id }, include: { templateSection: true } });
    return ok(reply, sectionDetailContract(updated, website.id), "Section template updated");
  });
  app.patch("/api/v1/websites/:websiteId/sections/:slotKey/content", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = sectionContentBody.parse(request.body);
    const updated = await prisma.pageSection.update({
      where: { websiteId_slotKey: { websiteId: website.id, slotKey: request.params?.slotKey || "" } },
      data: { contentJson: prismaJson(limitJson(body.contentJson)) },
      include: { templateSection: true }
    });
    return ok(reply, sectionDetailContract(updated, website.id), "Section content updated");
  });
  app.patch("/api/v1/websites/:websiteId/sections/:slotKey/visibility", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = visibilityBody.parse(request.body);
    const updated = await prisma.pageSection.update({
      where: { websiteId_slotKey: { websiteId: website.id, slotKey: request.params?.slotKey || "" } },
      data: { isVisible: body.isVisible },
      include: { templateSection: true }
    });
    return ok(reply, sectionDetailContract(updated, website.id), "Section visibility updated");
  });
};

const templateFieldSchema = z
  .object({
    key: z.string().min(1),
    label: z.string().min(1),
    type: z.union([z.enum(SECTION_FIELD_TYPES), z.literal("image")]),
    required: z.boolean().optional(),
    placeholder: z.string().optional(),
    helpText: z.string().optional()
  })
  .passthrough();

const templateImportSchema = z.object({
  sectionKey: z.string().min(1),
  slotKey: z.string().min(1),
  websiteType: z.literal("company_profile"),
  name: z.string().min(1),
  component: z.string().min(1),
  variant: z.string().nullable().optional(),
  schema: z.array(templateFieldSchema),
  defaultContent: z.record(z.unknown())
});

const registerTemplateRoutes = () => {
  app.post("/api/v1/internal/template-sections/import-zip", async (request, reply) => {
    await requireRole(request, ["internal_admin"]);
    const file = await request.file();
    if (!file) throw new AppError(400, "ZIP_REQUIRED", "Template ZIP file is required");
    const buffer = await file.toBuffer();
    const zip = new AdmZip(buffer);
    const manifest = zip.getEntry("manifest.json");
    if (!manifest) throw new AppError(400, "MANIFEST_REQUIRED", "manifest.json is required");
    JSON.parse(manifest.getData().toString("utf8"));
    const entries = zip.getEntries().filter((entry) => entry.entryName.startsWith("sections/") && entry.entryName.endsWith(".json"));
    const imported = [];
    for (const entry of entries) {
      const parsed = templateImportSchema.parse(JSON.parse(entry.getData().toString("utf8")));
      if (!isCompanyProfileSlot(parsed.slotKey)) throw new AppError(422, "INVALID_SLOT_KEY", `Invalid slotKey: ${parsed.slotKey}`);
      const schemaJson = parsed.schema.map((field) => ({ ...field, type: normalizeFieldType(field.type) }));
      imported.push(
        await prisma.templateSection.upsert({
          where: { sectionKey: parsed.sectionKey },
          update: {
            websiteType: parsed.websiteType,
            slotKey: parsed.slotKey,
            name: parsed.name,
            component: parsed.component,
            variant: parsed.variant || null,
            schemaJson: schemaJson as any,
            defaultContentJson: parsed.defaultContent as any,
            isActive: true
          },
          create: {
            sectionKey: parsed.sectionKey,
            websiteType: parsed.websiteType,
            slotKey: parsed.slotKey,
            name: parsed.name,
            component: parsed.component,
            variant: parsed.variant || null,
            schemaJson: schemaJson as any,
            defaultContentJson: parsed.defaultContent as any
          }
        })
      );
    }
    return ok(reply, { importedCount: imported.length, sections: imported.map(templateContract) }, "Template sections imported");
  });
  app.get("/api/v1/template-sections", async (request: Req, reply) => {
    await requireAuth(request);
    const sections = await prisma.templateSection.findMany({
      where: {
        websiteType: request.query?.websiteType,
        slotKey: request.query?.slotKey,
        isActive: true
      },
      orderBy: { name: "asc" }
    });
    return ok(reply, sections.map(templateContract), "Template sections loaded");
  });
  app.get("/api/v1/template-sections/:id", async (request: Req, reply) => {
    await requireAuth(request);
    const section = await prisma.templateSection.findUnique({ where: { id: request.params?.id } });
    if (!section) throw new AppError(404, "TEMPLATE_SECTION_NOT_FOUND", "Template section not found");
    return ok(reply, templateContract(section), "Template section loaded");
  });
  app.get("/api/v1/template-sections/by-slot/:slotKey", async (request: Req, reply) => {
    await requireAuth(request);
    const sections = await prisma.templateSection.findMany({ where: { slotKey: request.params?.slotKey, isActive: true }, orderBy: { name: "asc" } });
    return ok(reply, sections.map(templateContract), "Template sections loaded");
  });
};

const registerContentRoutes = () => {
  app.get("/api/v1/websites/:websiteId/business-profile", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, await prisma.businessProfile.findUnique({ where: { websiteId: website.id } }), "Business profile loaded");
  });
  app.put("/api/v1/websites/:websiteId/business-profile", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = businessProfileBody.parse(request.body);
    const profileData = { ...body, timelineJson: prismaJson(limitJson(body.timelineJson)) };
    const profile = await prisma.businessProfile.upsert({ where: { websiteId: website.id }, update: profileData, create: { ...profileData, websiteId: website.id } });
    return ok(reply, profile, "Business profile saved");
  });
};

const registerCrud = (
  base: "services" | "portfolios" | "testimonials" | "brand-partners",
  schema: z.ZodTypeAny
) => {
  const model = base === "services" ? prisma.service : base === "portfolios" ? prisma.portfolio : base === "testimonials" ? prisma.testimonial : prisma.brandPartner;
  const idParam = base === "services" ? "serviceId" : base === "portfolios" ? "portfolioId" : base === "testimonials" ? "testimonialId" : "brandPartnerId";
  app.get(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const rows = await (model as any).findMany({ where: { websiteId: website.id }, orderBy: { sortOrder: "asc" } });
    return ok(reply, rows, `${base} loaded`);
  });
  app.post(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = schema.parse(request.body);
    const row = await (model as any).create({ data: { ...body, websiteId: website.id } });
    return ok(reply, row, `${base} created`, 201);
  });
  app.get(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const row = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id } });
    if (!row) throw new AppError(404, "ITEM_NOT_FOUND", "Item not found");
    return ok(reply, row, `${base} loaded`);
  });
  app.patch(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = (schema as any).partial().parse(request.body);
    const existing = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id } });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Item not found");
    const row = await (model as any).update({ where: { id: existing.id }, data: body });
    return ok(reply, row, `${base} updated`);
  });
  app.delete(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const existing = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id } });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Item not found");
    await (model as any).delete({ where: { id: existing.id } });
    return ok(reply, true, `${base} deleted`);
  });
};

const registerPublicRoutes = () => {
  app.get("/api/v1/public/sites/:slug", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    return ok(reply, await buildPublicPage(website.id, { pageKey: "home" }), "Public page loaded");
  });
  app.get("/api/v1/public/sites/:slug/pages/:pageSlug", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    return ok(reply, await buildPublicPage(website.id, { slug: request.params?.pageSlug || "" }), "Public page loaded");
  });
  app.get("/api/v1/websites/:websiteId/preview/pages/:pageKey", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, { ...(await buildPublicPage(website.id, { pageKey: request.params?.pageKey || "home" })), isPreview: true }, "Preview page loaded");
  });
  app.post("/api/v1/public/tracking/events", { config: { rateLimit: { max: 60, timeWindow: "1 minute" } } }, async (request, reply) => {
    const body = trackingBody.parse(request.body);
    await recordTracking(request, body);
    return ok(reply, { accepted: true }, "Tracking event accepted", 202);
  });
  app.post("/api/v1/public/sites/:slug/contact", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    const body = contactBody.parse(request.body);
    const lead = await prisma.lead.create({
      data: {
        websiteId: website.id,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        message: body.message || null,
        interest: body.interest || null,
        sourcePage: body.sourcePage || null,
        sourceSection: body.sourceSection || null,
        metadataJson: prismaJson(limitJson(body.tracking))
      }
    });
    await prisma.trackingEvent.create({
      data: {
        websiteId: website.id,
        trackingKey: website.trackingKey,
        visitorId: body.tracking?.visitorId || null,
        sessionId: body.tracking?.sessionId || null,
        eventName: "contact_submit",
        pageKey: body.sourcePage || null,
        slotKey: body.sourceSection || null,
        referrer: body.tracking?.referrer || null,
        utmJson: prismaJson(limitJson(body.tracking?.utm)),
        metadataJson: { leadId: lead.id },
        ipHash: hashIp(request.ip),
        userAgent: request.headers["user-agent"] || null
      }
    });
    return created(reply, leadContract(lead), "Lead created");
  });
};

const registerLeadAndInsightRoutes = () => {
  app.get("/api/v1/websites/:websiteId/leads", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const leads = await prisma.lead.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "desc" } });
    return ok(reply, leads.map(leadContract), "Leads loaded");
  });
  app.get("/api/v1/websites/:websiteId/leads/recent", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const leads = await prisma.lead.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "desc" }, take: 10 });
    return ok(reply, leads.map(leadContract), "Recent leads loaded");
  });
  app.patch("/api/v1/websites/:websiteId/leads/:leadId/status", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const body = z.object({ status: z.enum(LEAD_STATUS) }).parse(request.body);
    const lead = await prisma.lead.findFirst({ where: { id: request.params?.leadId, websiteId: website.id } });
    if (!lead) throw new AppError(404, "LEAD_NOT_FOUND", "Lead not found");
    return ok(reply, leadContract(await prisma.lead.update({ where: { id: lead.id }, data: { status: body.status } })), "Lead status updated");
  });

  const topBy = async (websiteId: string, field: "pageKey" | "slotKey" | "ctaKey" | "objectId", where: Record<string, unknown> = {}) => {
    const rows = await prisma.trackingEvent.groupBy({
      by: [field],
      where: { websiteId, [field]: { not: null }, ...where },
      _count: { _all: true },
      orderBy: { _count: { [field]: "desc" } },
      take: 10
    } as any);
    return rows.map((row: any) => ({ [field]: row[field], total: row._count._all }));
  };

  const topPages = async (websiteId: string) => {
    const rows = await prisma.trackingEvent.groupBy({
      by: ["pageKey", "pageSlug"],
      where: { websiteId, eventName: "page_view", pageKey: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { pageKey: "desc" } },
      take: 10
    });
    return rows.map((row) => ({
      pageKey: row.pageKey,
      pageLabel: row.pageKey ? getPageLabel(row.pageKey) : null,
      pageSlug: row.pageSlug,
      total: row._count._all
    }));
  };

  const topSections = async (websiteId: string) => {
    const rows = await prisma.trackingEvent.groupBy({
      by: ["slotKey", "sectionKey"],
      where: { websiteId, eventName: "section_view", slotKey: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { slotKey: "desc" } },
      take: 10
    });
    const sectionKeys = rows.map((row) => row.sectionKey).filter(Boolean) as string[];
    const templates = await prisma.templateSection.findMany({
      where: { sectionKey: { in: sectionKeys } },
      select: { sectionKey: true, name: true }
    });
    const nameByKey = new Map(templates.map((template) => [template.sectionKey, template.name]));
    return rows.map((row) => ({
      slotKey: row.slotKey,
      slotLabel: row.slotKey ? getSlotLabel(row.slotKey) : null,
      sectionKey: row.sectionKey,
      sectionName: row.sectionKey ? nameByKey.get(row.sectionKey) || null : null,
      total: row._count._all
    }));
  };

  const topCtas = async (websiteId: string) => {
    const rows = await prisma.trackingEvent.groupBy({
      by: ["ctaKey", "slotKey"],
      where: { websiteId, eventName: { in: ["cta_click", "whatsapp_click"] }, ctaKey: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { ctaKey: "desc" } },
      take: 10
    });
    return rows.map((row) => ({
      ctaKey: row.ctaKey,
      ctaLabel: ctaLabel(row.ctaKey),
      slotKey: row.slotKey,
      slotLabel: row.slotKey ? getSlotLabel(row.slotKey) : null,
      total: row._count._all
    }));
  };

  const topObjects = async (websiteId: string, objectType: "service" | "portfolio") => {
    const eventName = objectType === "service" ? "service_view" : "portfolio_view";
    const rows = await prisma.trackingEvent.groupBy({
      by: ["objectId"],
      where: { websiteId, eventName, objectType, objectId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { objectId: "desc" } },
      take: 10
    });
    const ids = rows.map((row) => row.objectId).filter(Boolean) as string[];
    const items =
      objectType === "service"
        ? await prisma.service.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })
        : await prisma.portfolio.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } });
    const titleById = new Map(items.map((item) => [item.id, item.title]));
    return rows.map((row) => ({
      [objectType === "service" ? "serviceId" : "portfolioId"]: row.objectId,
      title: row.objectId ? titleById.get(row.objectId) || null : null,
      total: row._count._all
    }));
  };
  app.get("/api/v1/websites/:websiteId/insights/summary", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const [visitors, totalPageViews, totalCtaClicks, totalWhatsappClicks, totalContactSubmits, topPageRows, topServiceRows, topPortfolioRows] = await Promise.all([
      prisma.trackingEvent.findMany({ where: { websiteId: website.id, visitorId: { not: null } }, distinct: ["visitorId"], select: { visitorId: true } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "page_view" } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "cta_click" } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "whatsapp_click" } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "contact_submit" } }),
      topBy(website.id, "pageKey", { eventName: "page_view" }),
      topBy(website.id, "objectId", { eventName: "service_view", objectType: "service" }),
      topBy(website.id, "objectId", { eventName: "portfolio_view", objectType: "portfolio" })
    ]);
    const topServiceId = topServiceRows[0]?.objectId;
    const topPortfolioId = topPortfolioRows[0]?.objectId;
    const [topService, topPortfolio] = await Promise.all([
      topServiceId ? prisma.service.findUnique({ where: { id: topServiceId } }) : null,
      topPortfolioId ? prisma.portfolio.findUnique({ where: { id: topPortfolioId } }) : null
    ]);
    return ok(reply, {
      cards: [
        {
          key: "totalVisitors",
          label: "Total Visitor",
          value: visitors.length,
          helpText: "Jumlah pengunjung unik yang terdeteksi."
        },
        {
          key: "totalPageViews",
          label: "Total Page View",
          value: totalPageViews,
          helpText: "Total halaman yang dibuka pengunjung."
        },
        {
          key: "totalCtaClicks",
          label: "Klik CTA",
          value: totalCtaClicks,
          helpText: "Jumlah klik tombol ajakan seperti Hubungi Kami."
        },
        {
          key: "totalWhatsappClicks",
          label: "Klik WhatsApp",
          value: totalWhatsappClicks,
          helpText: "Jumlah klik tombol WhatsApp."
        },
        {
          key: "totalContactSubmits",
          label: "Form Masuk",
          value: totalContactSubmits,
          helpText: "Jumlah pengunjung yang mengirim form kontak."
        }
      ],
      highlights: {
        topPage: topPageRows[0]
          ? { label: "Halaman Paling Sering Dilihat", value: getPageLabel(topPageRows[0].pageKey), total: topPageRows[0].total }
          : null,
        topService: topService
          ? { label: "Layanan Paling Diminati", value: topService.title, total: topServiceRows[0].total }
          : null,
        topPortfolio: topPortfolio
          ? { label: "Portfolio Paling Sering Dilihat", value: topPortfolio.title, total: topPortfolioRows[0].total }
          : null
      }
    }, "Insight summary loaded");
  });
  app.get("/api/v1/websites/:websiteId/insights/top-pages", async (request: Req, reply) => ok(reply, await topPages((await getWebsiteForAccess(request)).website.id), "Top pages loaded"));
  app.get("/api/v1/websites/:websiteId/insights/top-sections", async (request: Req, reply) => ok(reply, await topSections((await getWebsiteForAccess(request)).website.id), "Top sections loaded"));
  app.get("/api/v1/websites/:websiteId/insights/top-ctas", async (request: Req, reply) => ok(reply, await topCtas((await getWebsiteForAccess(request)).website.id), "Top CTAs loaded"));
  app.get("/api/v1/websites/:websiteId/insights/top-services", async (request: Req, reply) => ok(reply, await topObjects((await getWebsiteForAccess(request)).website.id, "service"), "Top services loaded"));
  app.get("/api/v1/websites/:websiteId/insights/top-portfolios", async (request: Req, reply) => ok(reply, await topObjects((await getWebsiteForAccess(request)).website.id, "portfolio"), "Top portfolios loaded"));
  app.get("/api/v1/websites/:websiteId/insights/traffic-sources", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const rows = await prisma.trackingEvent.findMany({ where: { websiteId: website.id, eventName: "page_view" }, select: { referrer: true, utmJson: true } });
    const sources = new Map<string, number>();
    for (const row of rows) {
      const utm = row.utmJson as { source?: string } | null;
      const key = utm?.source || row.referrer || "direct";
      sources.set(key, (sources.get(key) || 0) + 1);
    }
    return ok(reply, Array.from(sources.entries()).map(([source, total]) => ({
      source,
      label: source === "direct" ? "Direct" : source.charAt(0).toUpperCase() + source.slice(1),
      total
    })).sort((a, b) => b.total - a.total), "Traffic sources loaded");
  });
};

export const buildApp = async () => {
  await registerPlugins();
  app.setErrorHandler((error, _request, reply) => {
    const payload = toErrorPayload(error);
    reply.code(payload.statusCode).send(payload.body);
  });
  registerCoreRoutes();
  registerAuthRoutes();
  registerInternalRoutes();
  registerWebsiteRoutes();
  registerSectionRoutes();
  registerTemplateRoutes();
  registerContentRoutes();
  registerCrud("services", listItemBody);
  registerCrud("portfolios", listItemBody);
  registerCrud("testimonials", testimonialBody);
  registerCrud("brand-partners", brandBody);
  registerPublicRoutes();
  registerLeadAndInsightRoutes();
  return app;
};

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.API_PORT || process.env.PORT || 4000);
  buildApp()
    .then((server) => server.listen({ port, host: "0.0.0.0" }))
    .catch(async (error) => {
      app.log.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
