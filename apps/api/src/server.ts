import "dotenv/config";
import AdmZip from "adm-zip";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyRequest } from "fastify";
import { apiConfig, assertRuntimeEnv, isOriginAllowed } from "./env.js";
import { loggerConfig, registerObservabilityHooks, safeServerInfo } from "./observability.js";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  CATALOG_PRODUCT_SECTION_SLOTS,
  COMPANY_PROFILE_PAGES,
  COMPANY_PROFILE_SECTION_SLOTS,
  LEAD_STATUS,
  SECTION_FIELD_TYPES,
  THEMES,
  TRACKING_EVENT_NAMES,
  WEBSITE_TYPE_PAGES,
  WEBSITE_TYPES,
  getArticleStatusLabel,
  getLeadStatusLabel,
  getPageLabel,
  getSlotDescription,
  getSlotLabel,
  getTemplateSectionStatusLabel,
  getWebsiteStatusLabel,
  getWebsiteTypeLabel
} from "@lentera-pasar/shared";
import { prisma } from "./prisma.js";
import { createWebsiteDefaults, ensureWebsiteStructure, defaultPageNavLabel, isDynamicDetailPage, pagePurpose } from "./defaults.js";
import { AppError, buildPaginationMeta, created, ok, paginated, parsePagination, publicUser, toErrorPayload } from "./http.js";
import { hashIp, hashPassword, hashToken, limitJson, prismaJson, randomToken, verifyApiKey, verifyPassword } from "./security.js";
import { buildPasswordResetEmail, buildVerificationEmail, sendEmail } from "./email.js";
import sharp from "sharp";

type AuthUser = { id: string; role: "internal_admin" | "owner_admin" | "user"; email: string };
type Req = FastifyRequest<{ Params?: Record<string, string>; Querystring?: Record<string, string> }>;

assertRuntimeEnv();

const app = Fastify({
  logger: loggerConfig,
  maxParamLength: apiConfig.maxParamLength,
  bodyLimit: apiConfig.requestBodyLimitBytes,
  requestIdHeader: "x-request-id"
});

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
  lifecycleStatus: website.lifecycleStatus,
  lifecycleStatusLabel: WEBSITE_LIFECYCLE_LABELS[website.lifecycleStatus],
  trackingKey: website.trackingKey,
  publicUrl: publicUrlFor(website),
  previewPath: `/websites/${website.id}/preview/pages/home`,
  createdAt: website.createdAt,
  updatedAt: website.updatedAt
});

const getPlatformSetting = async () => {
  const existing = await prisma.platformSetting.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;
  // Belum ada baris sama sekali (fresh install) -> buat default mati (false)
  return prisma.platformSetting.create({
    data: { id: "singleton", publicActivationEnabled: false }
  });
};

const isPublicActivationEnabled = async () => {
  const setting = await getPlatformSetting();
  return setting.publicActivationEnabled;
};

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

const templatePackContract = (pack: any) => ({
  id: pack.id,
  templatePackKey: pack.templatePackKey,
  websiteType: pack.websiteType,
  websiteTypeLabel: getWebsiteTypeLabel(pack.websiteType),
  name: pack.name,
  theme: pack.theme,
  version: pack.version,
  description: pack.description,
  status: pack.status,
  statusLabel: getTemplateSectionStatusLabel(pack.status),
  validationSummary: pack.validationSummaryJson || null,
  sectionsCount: pack._count?.sections ?? pack.sections?.length ?? 0,
  createdAt: pack.createdAt,
  updatedAt: pack.updatedAt
});

const templateContract = (template: any) => ({
  id: template.id,
  sectionKey: template.sectionKey,
  templatePackId: template.templatePackId || null,
  templatePack: template.templatePack ? templatePackContract(template.templatePack) : null,
  pageKey: template.pageKey || template.slotKey?.split(".")[0] || null,
  pageLabel: template.pageKey || template.slotKey ? getPageLabel(template.pageKey || template.slotKey.split(".")[0], template.websiteType) : null,
  slotKey: template.slotKey,
  slotLabel: getSlotLabel(template.slotKey, template.websiteType),
  websiteType: template.websiteType,
  websiteTypeLabel: getWebsiteTypeLabel(template.websiteType),
  name: template.name,
  component: template.component,
  variant: template.variant,
  status: template.status || (template.isActive ? "active" : "draft"),
  statusLabel: getTemplateSectionStatusLabel(template.status || (template.isActive ? "active" : "draft")),
  validationErrors: template.validationErrors || null,
  schema: normalizeSectionSchema(template.schemaJson),
  defaultContent: template.defaultContentJson || {}
});

const ownerContract = (owner: any) => ({
  id: owner.id,
  name: owner.name,
  email: owner.email,
  role: owner.role,
  whatsapp: owner.whatsapp || null,
  accountStatus: owner.accountStatus,
  accountStatusLabel: USER_ACCOUNT_STATUS_LABELS[owner.accountStatus],
  storageQuotaMb: owner.storageQuotaMb ?? 50,
  primaryWebsiteId: owner.primaryWebsiteId || null,
  primaryWebsite: owner.primaryWebsite ? websiteSummary(owner.primaryWebsite) : null,
  websitesCount: owner._count?.websites ?? owner.websites?.length ?? 0,
  createdAt: owner.createdAt
});

const auditLogContract = (log: any) => ({
  id: log.id,
  category: log.category,
  action: log.action,
  actorUserId: log.actorUserId,
  actorRole: log.actorRole,
  actor: log.actor
    ? {
        id: log.actor.id,
        name: log.actor.name,
        email: log.actor.email,
        role: log.actor.role
      }
    : null,
  websiteId: log.websiteId,
  website: log.website
    ? {
        id: log.website.id,
        name: log.website.name,
        slug: log.website.slug,
        status: log.website.status
      }
    : null,
  entityType: log.entityType,
  entityId: log.entityId,
  summary: log.summary,
  metadata: log.metadataJson || null,
  ipHash: log.ipHash || null,
  userAgent: log.userAgent || null,
  requestId: log.requestId || null,
  createdAt: log.createdAt
});

const createAuditLog = async (
  request: FastifyRequest,
  input: {
    category?: "audit" | "security" | "system";
    action: string;
    actor?: AuthUser | null;
    websiteId?: string | null;
    entityType?: string | null;
    entityId?: string | null;
    summary: string;
    metadata?: unknown;
  }
) => {
  try {
    await prisma.auditLog.create({
      data: {
        category: input.category || "audit",
        action: input.action,
        actorUserId: input.actor?.id || null,
        actorRole: input.actor?.role || null,
        websiteId: input.websiteId || null,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        summary: input.summary,
        metadataJson: prismaJson(limitJson(input.metadata, 5000)),
        ipHash: hashIp(request.ip),
        userAgent: request.headers["user-agent"] || null,
        requestId: request.id
      }
    });
  } catch (error) {
    request.log.warn(
      {
        requestId: request.id,
        action: input.action,
        error: error instanceof Error ? error.message : String(error)
      },
      "audit_log_failed"
    );
  }
};

// Vision & Mission are sent as raw HTML from the RichTextEditor (TipTap) in Business Profile.
// The site-renderer renders them with <RichHtml> (see components/content/RichHtml.tsx) so
// formatting (bold, lists, headings, links) from the editor displays correctly on the public
// site, instead of being stripped to plain text or shown as literal HTML tags.
const businessProfileToVisionMissionContent = (businessProfile: any) => {
  if (!businessProfile) return {};
  return {
    vision: businessProfile.vision || "",
    mission: businessProfile.mission || ""
  };
};

const applyVisionMissionOverride = (slotKey: string, content: Record<string, unknown>, businessProfile: any) => {
  if (slotKey !== "about.vision_mission") return content;
  const { description, subtitle, ...rest } = content;
  return { ...rest, ...businessProfileToVisionMissionContent(businessProfile) };
};

// Sama seperti Visi & Misi: Maps Location dan Informasi Kontak selalu ambil datanya dari
// Business Profile (bukan dari input per-section), supaya owner cukup isi satu tempat dan
// section terkait ikut update otomatis. Field section untuk kedua slot ini cuma menyisakan
// field umum (title/subtitle/badge/cta/imgUrl) plus mapEmbedUrl/address/email/whatsapp
// yang di-override di sini akan selalu ditimpa oleh data Business Profile.
const applyMapsLocationOverride = (slotKey: string, content: Record<string, unknown>, businessProfile: any) => {
  if (slotKey !== "contact.maps_location") return content;
  return { ...content, mapEmbedUrl: businessProfile?.mapEmbedUrl || "" };
};

const applyContactInformationOverride = (slotKey: string, content: Record<string, unknown>, businessProfile: any) => {
  if (slotKey !== "contact.contact_information") return content;
  return {
    ...content,
    address: businessProfile?.address || "",
    contactEmail: businessProfile?.contactEmail || "",
    phone: businessProfile?.phone || "",
    whatsapp: businessProfile?.whatsapp || ""
  };
};

const applyBusinessProfileOverrides = (slotKey: string, content: Record<string, unknown>, businessProfile: any) => {
  let result = applyVisionMissionOverride(slotKey, content, businessProfile);
  result = applyMapsLocationOverride(slotKey, result, businessProfile);
  result = applyContactInformationOverride(slotKey, result, businessProfile);
  return result;
};

const mergeContent = (template: any, contentJson: unknown) => ({
  ...((template?.defaultContentJson as Record<string, unknown> | null) || {}),
  ...((contentJson as Record<string, unknown> | null) || {})
});

// Slot yang isinya sepenuhnya diambil dari Business Profile (lihat applyBusinessProfileOverrides
// di atas) — dashboard perlu tahu field mana saja yang "auto-managed" ini supaya bisa
// menyembunyikan form manual dan mengarahkan owner ke halaman Profil Bisnis.
const AUTO_MANAGED_SLOT_FIELDS: Record<string, string[]> = {
  "about.vision_mission": ["vision", "mission"],
  "contact.maps_location": ["mapEmbedUrl"],
  "contact.contact_information": ["address", "contactEmail", "phone", "whatsapp"]
};

const sectionDetailContract = (section: any, websiteId: string, businessProfile: any = null, websiteType: string = "company_profile") => ({
  id: section.id,
  slotKey: section.slotKey,
  slotLabel: getSlotLabel(section.slotKey, websiteType),
  slotDescription: getSlotDescription(section.slotKey, websiteType),
  sortOrder: section.sortOrder,
  isVisible: section.isVisible,
  hasTemplate: Boolean(section.templateSection),
  hasContent: Boolean(section.contentJson && Object.keys(section.contentJson as Record<string, unknown>).length > 0),
  isAutoManaged: Boolean(AUTO_MANAGED_SLOT_FIELDS[section.slotKey]),
  autoManagedSource: AUTO_MANAGED_SLOT_FIELDS[section.slotKey] ? "business_profile" : null,
  autoManagedFields: AUTO_MANAGED_SLOT_FIELDS[section.slotKey] || [],
  templateSection: section.templateSection
    ? {
        ...templateSummary(section.templateSection),
        schema: normalizeSectionSchema(section.templateSection.schemaJson),
        defaultContent: section.templateSection.defaultContentJson || {}
      }
    : null,
  contentJson: section.contentJson || {},
  effectiveContent: applyBusinessProfileOverrides(section.slotKey, mergeContent(section.templateSection, section.contentJson), businessProfile),
  actions: {
    chooseTemplatePath: `/websites/${websiteId}/sections/${section.slotKey}/choose`,
    editContentPath: `/websites/${websiteId}/sections/${section.slotKey}/edit`
  }
});

const cleanPageSlug = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();

const isValidPageSlug = (value: string) => value === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const pagePublicPath = (page: any) => {
  if (page.pageKey === "article_detail") return "/articles/:articleSlug";
  if (page.pageKey === "portfolio_detail") return "/portfolio/:portfolioId";
  if (page.pageKey === "product_detail") return "/products/:productSlug";
  if (page.pageKey === "home") return "/";
  return `/${page.slug}`;
};

const pageDisplayLabel = (page: any, websiteType: string = "company_profile") =>
  page.navLabel || page.title || defaultPageNavLabel(page.pageKey, websiteType);

const pageDashboardSummary = (page: any, websiteType: string = "company_profile") => {
  const sections = page.sections || [];
  const dynamicDetailPage = isDynamicDetailPage(page.pageKey, websiteType);
  return {
    id: page.id,
    pageKey: page.pageKey,
    title: page.title,
    navLabel: page.navLabel || page.title,
    footerLabel: page.footerLabel || page.navLabel || page.title,
    slug: page.slug,
    publicPath: pagePublicPath(page),
    purpose: page.purpose || pagePurpose(page.pageKey, websiteType),
    pageLabel: getPageLabel(page.pageKey, websiteType),
    isDynamicDetailPage: dynamicDetailPage,
    isPublished: page.isPublished ?? page.isActive,
    isVisibleInNavbar: dynamicDetailPage ? false : Boolean(page.isVisibleInNavbar),
    isVisibleInFooter: dynamicDetailPage ? false : Boolean(page.isVisibleInFooter),
    seoTitle: page.seoTitle || null,
    seoDescription: page.seoDescription || null,
    sectionCount: sections.length,
    filledSectionCount: sections.filter((section: any) => section.templateSectionId || section.contentJson).length,
    sortOrder: page.sortOrder,
    isActive: page.isActive,
    oldSlugsCount: page._count?.slugHistories ?? page.slugHistories?.length ?? 0
  };
};

const buildNavigationContract = async (websiteId: string, websiteType: string = "company_profile") => {
  const [pages, businessProfile, chromeSections] = await Promise.all([
    prisma.websitePage.findMany({ where: { websiteId }, orderBy: { sortOrder: "asc" } }),
    prisma.businessProfile.findUnique({ where: { websiteId } }),
    // Navbar & Footer sekarang section tersendiri (slot "global.navbar" / "global.footer")
    // yang bisa dipilih bebas lintas tema, sama seperti section lain — lihat catatan di
    // ensureCompanyProfileStructure / COMPANY_PROFILE_SECTION_SLOTS.
    prisma.pageSection.findMany({
      where: { websiteId, slotKey: { in: ["global.navbar", "global.footer"] } },
      include: { templateSection: { include: { templatePack: true } } }
    })
  ]);

  const navbarSection = chromeSections.find((section: any) => section.slotKey === "global.navbar");
  const footerSection = chromeSections.find((section: any) => section.slotKey === "global.footer");
  // Kalau owner belum pernah memilih tampilan Navbar/Footer, tetap null — site-renderer
  // fallback ke tema section konten (perilaku lama) supaya website lama tidak "hilang"
  // header/footer-nya sebelum di-migrasi.
  const navbarTheme = navbarSection?.templateSection?.templatePack?.theme || null;
  const footerTheme = footerSection?.templateSection?.templatePack?.theme || null;
  const navbarComponent = navbarSection?.templateSection?.component || null;
  const footerComponent = footerSection?.templateSection?.component || null;

  const publishedPages = pages.filter((page: any) => (page.isPublished ?? page.isActive) && !isDynamicDetailPage(page.pageKey, websiteType));
  const navbarItems = publishedPages
    .filter((page: any) => page.isVisibleInNavbar)
    .slice(0, 6)
    .map((page: any) => ({
      pageKey: page.pageKey,
      label: page.navLabel || page.title || defaultPageNavLabel(page.pageKey, websiteType),
      slug: page.slug,
      path: pagePublicPath(page),
      sortOrder: page.sortOrder
    }));

  const footerItems = publishedPages
    .filter((page: any) => page.isVisibleInFooter)
    .map((page: any) => ({
      pageKey: page.pageKey,
      label: page.footerLabel || page.navLabel || page.title || defaultPageNavLabel(page.pageKey, websiteType),
      slug: page.slug,
      path: pagePublicPath(page),
      sortOrder: page.sortOrder
    }));

  const availableTargets = [
    ...publishedPages.map((page: any) => ({
      type: "page",
      pageKey: page.pageKey,
      label: `Halaman ${pageDisplayLabel(page, websiteType)}`,
      path: pagePublicPath(page)
    })),
    {
      type: "whatsapp",
      label: "WhatsApp Bisnis",
      value: "business_whatsapp",
      path: businessProfile?.whatsapp ? `https://wa.me/${String(businessProfile.whatsapp).replace(/\D/g, "")}` : null
    },
    { type: "custom", label: "Link Custom", value: "custom", path: null }
  ];

  return {
    navbar: {
      maxItems: 6,
      items: navbarItems,
      theme: navbarTheme,
      component: navbarComponent,
      cta: {
        label: "Hubungi Kami",
        targetType: "page",
        targetPageKey: "contact",
        path: publishedPages.find((page: any) => page.pageKey === "contact") ? pagePublicPath(publishedPages.find((page: any) => page.pageKey === "contact")) : "/contact"
      }
    },
    footer: { items: footerItems, theme: footerTheme, component: footerComponent },
    availableTargets
  };
};

const leadContract = (lead: any, websiteType: string = "company_profile") => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  message: lead.message,
  interest: lead.interest,
  status: lead.status,
  statusLabel: getLeadStatusLabel(lead.status),
  sourcePage: lead.sourcePage,
  sourcePageLabel: lead.sourcePage ? getPageLabel(lead.sourcePage, websiteType) : null,
  sourceSection: lead.sourceSection,
  sourceSectionLabel: lead.sourceSection ? getSlotLabel(lead.sourceSection, websiteType) : null,
  createdAt: lead.createdAt
});

const articleContract = (article: any) => ({
  id: article.id,
  websiteId: article.websiteId,
  categoryId: article.categoryId,
  category: article.category ? categoryContract(article.category) : null,
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  content: article.content,
  coverImageUrl: article.coverImageUrl,
  seoTitle: article.seoTitle,
  seoDescription: article.seoDescription,
  status: article.status,
  statusLabel: getArticleStatusLabel(article.status),
  sortOrder: article.sortOrder,
  isFeatured: article.isFeatured ?? false,
  featuredOrder: article.featuredOrder ?? 0,
  publishedAt: article.publishedAt,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt
});

const publicArticleSummary = (article: any) => ({
  id: article.id,
  categoryId: article.categoryId,
  category: article.category ? categoryContract(article.category) : null,
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  coverImageUrl: article.coverImageUrl,
  seoTitle: article.seoTitle,
  seoDescription: article.seoDescription,
  isFeatured: article.isFeatured ?? false,
  featuredOrder: article.featuredOrder ?? 0,
  sortOrder: article.sortOrder ?? 0,
  publishedAt: article.publishedAt
});

const portfolioContract = (portfolio: any) => ({
  id: portfolio.id,
  websiteId: portfolio.websiteId,
  categoryId: portfolio.categoryId,
  category: portfolio.category ? categoryContract(portfolio.category) : null,
  title: portfolio.title,
  slug: portfolio.slug,
  description: portfolio.description,
  imageUrl: portfolio.imageUrl,
  sortOrder: portfolio.sortOrder,
  isFeatured: portfolio.isFeatured ?? false,
  featuredOrder: portfolio.featuredOrder ?? 0,
  isActive: portfolio.isActive,
  createdAt: portfolio.createdAt,
  updatedAt: portfolio.updatedAt
});

const publicPortfolioSummary = (portfolio: any) => ({
  id: portfolio.id,
  categoryId: portfolio.categoryId,
  category: portfolio.category ? categoryContract(portfolio.category) : null,
  title: portfolio.title,
  slug: portfolio.slug,
  description: portfolio.description,
  imageUrl: portfolio.imageUrl,
  isFeatured: portfolio.isFeatured ?? false,
  featuredOrder: portfolio.featuredOrder ?? 0,
  sortOrder: portfolio.sortOrder ?? 0
});

const categoryContract = (category: any) => ({
  id: category.id,
  websiteId: category.websiteId,
  name: category.name,
  slug: category.slug,
  description: category.description,
  sortOrder: category.sortOrder,
  isActive: category.isActive,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt
});

const faqContract = (faq: any, websiteType: string = "company_profile") => ({
  id: faq.id,
  websiteId: faq.websiteId,
  question: faq.question,
  answer: faq.answer,
  pageKey: faq.pageKey,
  pageLabel: faq.pageKey ? getPageLabel(faq.pageKey, websiteType) : null,
  sortOrder: faq.sortOrder,
  isActive: faq.isActive,
  createdAt: faq.createdAt,
  updatedAt: faq.updatedAt
});

const mediaAssetContract = (asset: any) => ({
  id: asset.id,
  websiteId: asset.websiteId,
  filename: asset.filename,
  originalName: asset.originalName,
  mimeType: asset.mimeType,
  sizeBytes: asset.sizeBytes,
  url: asset.url,
  altText: asset.altText,
  createdAt: asset.createdAt,
  updatedAt: asset.updatedAt
});

const productImageContract = (image: any) => ({
  id: image.id,
  productId: image.productId,
  url: image.url,
  altText: image.altText,
  isPrimary: image.isPrimary,
  sortOrder: image.sortOrder,
  createdAt: image.createdAt
});

const productVariantContract = (variant: any) => ({
  id: variant.id,
  productId: variant.productId,
  name: variant.name,
  sku: variant.sku,
  priceOverride: variant.priceOverride !== null && variant.priceOverride !== undefined ? Number(variant.priceOverride) : null,
  stock: variant.stock,
  sortOrder: variant.sortOrder,
  isActive: variant.isActive,
  createdAt: variant.createdAt,
  updatedAt: variant.updatedAt
});

const productReviewContract = (review: any) => ({
  id: review.id,
  productId: review.productId,
  customerName: review.customerName,
  rating: review.rating,
  comment: review.comment,
  avatarUrl: review.avatarUrl,
  isActive: review.isActive,
  sortOrder: review.sortOrder,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt
});

const productContract = (product: any) => ({
  id: product.id,
  websiteId: product.websiteId,
  categoryId: product.categoryId,
  category: product.category ? categoryContract(product.category) : null,
  title: product.title,
  slug: product.slug,
  sku: product.sku,
  shortDescription: product.shortDescription,
  description: product.description,
  price: Number(product.price),
  compareAtPrice: product.compareAtPrice !== null && product.compareAtPrice !== undefined ? Number(product.compareAtPrice) : null,
  ctaLabel: product.ctaLabel,
  ctaUrl: product.ctaUrl,
  isFeatured: product.isFeatured ?? false,
  featuredOrder: product.featuredOrder ?? 0,
  isNewArrival: product.isNewArrival ?? false,
  isActive: product.isActive,
  sortOrder: product.sortOrder,
  images: Array.isArray(product.images) ? product.images.map(productImageContract) : undefined,
  variants: Array.isArray(product.variants) ? product.variants.map(productVariantContract) : undefined,
  reviews: Array.isArray(product.reviews) ? product.reviews.map(productReviewContract) : undefined,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt
});

const valuePropositionContract = (item: any) => ({
  id: item.id,
  websiteId: item.websiteId,
  icon: item.icon,
  title: item.title,
  description: item.description,
  sortOrder: item.sortOrder,
  isActive: item.isActive,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt
});

const bannerContract = (banner: any) => ({
  id: banner.id,
  websiteId: banner.websiteId,
  imageUrl: banner.imageUrl,
  title: banner.title,
  subtitle: banner.subtitle,
  ctaLabel: banner.ctaLabel,
  ctaUrl: banner.ctaUrl,
  sortOrder: banner.sortOrder,
  isActive: banner.isActive,
  createdAt: banner.createdAt,
  updatedAt: banner.updatedAt
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
const verifyEmailBody = z.object({ token: z.string().min(10) });
const forgotPasswordBody = z.object({ email: z.string().email() });
const resetPasswordBody = z.object({ token: z.string().min(10), password: z.string().min(8) });
const createOwnerBody = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  whatsapp: z.string().nullable().optional(),
  primaryWebsiteId: z.string().nullable().optional(),
  storageQuotaMb: z.number().int().min(1).max(1024000).optional()
});
const patchOwnerBody = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  whatsapp: z.string().nullable().optional(),
  primaryWebsiteId: z.string().nullable().optional()
});
// Kuota storage owner dipisah dari patchOwnerBody biar endpoint-nya independen
// (internal admin bisa ubah kuota tanpa harus kirim ulang field lain).
const patchStorageQuotaBody = z.object({
  storageQuotaMb: z.number().int().min(1).max(1024000)
});
const websiteBody = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  // Baru company_profile & catalog_product yang punya struktur halaman/section
  // lengkap (lihat apps/api/src/defaults.ts). Tipe lain nanti ditambah setelah
  // CATALOG/BOOKING/COMMUNITY_* constants-nya digarap di packages/shared.
  websiteType: z.enum(["company_profile", "catalog_product"])
});
const patchWebsiteBody = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  themeJson: z.unknown().optional()
});
const pageSetupBody = z.object({
  title: z.string().min(1).optional(),
  navLabel: z.string().min(1).nullable().optional(),
  footerLabel: z.string().min(1).nullable().optional(),
  slug: z.string().nullable().optional(),
  purpose: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  isVisibleInNavbar: z.boolean().optional(),
  isVisibleInFooter: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional()
});
const businessProfileBody = z.object({
  name: z.string().min(2),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  logoAlt: z.string().nullable().optional(),
  vision: z.string().nullable().optional(),
  mission: z.string().nullable().optional(),
  timelineJson: z.unknown().nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  websiteUrl: z.string().url().nullable().optional()
});
const listItemBody = z.object({
  categoryId: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const portfolioBody = listItemBody.extend({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
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
const productBody = z.object({
  categoryId: z.string().nullable().optional(),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  sku: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaUrl: z.string().nullable().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().optional(),
  isNewArrival: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});
const productImageBody = z.object({
  url: z.string().min(1),
  altText: z.string().nullable().optional(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});
const productVariantBody = z.object({
  name: z.string().min(1),
  sku: z.string().nullable().optional(),
  priceOverride: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const productReviewBody = z.object({
  customerName: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(1),
  avatarUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});
const valuePropositionBody = z.object({
  icon: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const bannerBody = z.object({
  imageUrl: z.string().min(1),
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const timelineBody = z.object({
  year: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});

const teamMemberBody = z.object({
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});

const faqBody = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  pageKey: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const categoryBody = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});
const mediaUpdateBody = z.object({
  altText: z.string().nullable().optional()
});
const articleBody = z.object({
  categoryId: z.string().nullable().optional(),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).optional(),
  sortOrder: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().optional()
});
const createOwnerWebsiteBody = websiteBody;
const assignWebsiteOwnerBody = z.object({
  ownerId: z.string().min(1)
});
const primaryWebsiteBody = z.object({ websiteId: z.string().min(1) });
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

const websiteStatusBody = z.object({
  status: z.enum(["active", "suspended", "nonactive"])
});

const ownerStatusBody = z.object({
  status: z.enum(["active", "non_active", "suspended", "banned", "blacklisted"])
});

const publicActivationBody = z.object({
  enabled: z.boolean()
});

const WEBSITE_LIFECYCLE_LABELS: Record<string, string> = {
  active: "Aktif",
  suspended: "Ditangguhkan",
  nonactive: "Non-Aktif"
};

const USER_ACCOUNT_STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  non_active: "Non-Aktif",
  suspended: "Ditangguhkan",
  banned: "Diblokir",
  blacklisted: "Daftar Hitam"
};


const registerPlugins = async () => {
  await app.register(cors, {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-lentera-api-key", "x-request-id"],
    exposedHeaders: ["x-request-id"],
    credentials: false,
    maxAge: apiConfig.isProductionLike ? 86400 : 600
  });
  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  });
  await app.register(jwt, {
    secret: apiConfig.jwtSecret,
    sign: { expiresIn: apiConfig.jwtExpiresIn }
  });
  await app.register(multipart, { limits: { fileSize: apiConfig.templateUploadMaxBytes, files: 1 } });
  await app.register(rateLimit, apiConfig.rateLimits.global);
  registerObservabilityHooks(app);
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

const requireInternalApiKey = async (request: FastifyRequest) => {
  const provided = request.headers["x-lentera-api-key"];
  if (!verifyApiKey(provided)) {
    await createAuditLog(request, {
      category: "security",
      action: "api_key.invalid",
      entityType: "api_key",
      summary: "Invalid internal API key request",
      metadata: { method: request.method, url: request.url }
    });
    throw new AppError(401, "INVALID_API_KEY", "Valid internal API key is required");
  }
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

// Kuota storage berlaku per-akun owner, bukan per-website. MediaAsset sendiri
// tetap terikat ke websiteId (tidak diubah), jadi pemakaian dihitung dengan
// menjumlahkan sizeBytes dari semua MediaAsset milik website manapun yang
// ownerId-nya sama. Kalau owner hapus salah satu website-nya, kuota otomatis
// "kembali" karena MediaAsset ikut terhapus (onDelete: Cascade di schema).
const getOwnerStorageUsageBytes = async (ownerId: string) => {
  const usage = await prisma.mediaAsset.aggregate({
    _sum: { sizeBytes: true },
    where: { website: { ownerId } }
  });
  return usage._sum.sizeBytes || 0;
};

const getOwnerStorageQuotaBytes = async (ownerId: string) => {
  const owner = await prisma.user.findUnique({ where: { id: ownerId }, select: { storageQuotaMb: true } });
  return (owner?.storageQuotaMb ?? 50) * 1024 * 1024;
};

const getBusinessProfileForWebsite = async (websiteId: string) =>
  prisma.businessProfile.findUnique({ where: { websiteId } });

const buildPublicPage = async (websiteId: string, pageWhere: { pageKey?: string; slug?: string }, options: { publicOnly?: boolean } = {}) => {
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    include: { businessProfile: true }
  });
  if (!website) throw new AppError(404, "WEBSITE_NOT_FOUND", "Website not found");
  const page = await prisma.websitePage.findFirst({
    where: { websiteId, isActive: true, ...(options.publicOnly ? { isPublished: true } : {}), ...pageWhere },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        include: { templateSection: { include: { templatePack: true } } }
      }
    }
  });
  if (!page) throw new AppError(404, "PAGE_NOT_FOUND", "Page not found");
  const websiteType = website.websiteType;
  const [services, portfolios, testimonials, brands, articles, faqs, articleCategories, portfolioCategories, timelines, teamMembers, products, productCategories, valuePropositions, banners] = await Promise.all([
    prisma.service.findMany({ where: { websiteId, isActive: true }, orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }] }),
    prisma.portfolio.findMany({ where: { websiteId, isActive: true }, orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }], include: { category: true } }),
    prisma.testimonial.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.brandPartner.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.article.findMany({ where: { websiteId, status: "published" }, orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }, { publishedAt: "desc" }], include: { category: true } }),
    prisma.faq.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.articleCategory.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.portfolioCategory.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.businessTimeline.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.teamMember.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { websiteId, isActive: true },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }],
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        reviews: { where: { isActive: true }, orderBy: { sortOrder: "asc" } }
      }
    }),
    prisma.productCategory.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.valueProposition.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.banner.findMany({ where: { websiteId, isActive: true }, orderBy: { sortOrder: "asc" } })
  ]);
  const navigation = await buildNavigationContract(websiteId, websiteType);
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
      navLabel: page.navLabel || page.title,
      footerLabel: page.footerLabel || page.navLabel || page.title,
      slug: page.slug,
      path: pagePublicPath(page),
      purpose: page.purpose || pagePurpose(page.pageKey, websiteType),
      isPublished: page.isPublished ?? page.isActive,
      isDynamicDetailPage: isDynamicDetailPage(page.pageKey, websiteType),
      seoTitle: page.seoTitle || null,
      seoDescription: page.seoDescription || null,
      sections: page.sections
        .filter((section: any) => section.templateSection)
        .map((section: any) => ({
          id: section.id,
          slotKey: section.slotKey,
          slotLabel: getSlotLabel(section.slotKey, websiteType),
          sectionKey: section.templateSection?.sectionKey || null,
          templateKey: section.templateSection?.templatePack?.templatePackKey || null,
          templateName: section.templateSection?.templatePack?.name || null,
          templateTheme: section.templateSection?.templatePack?.theme || null,
          component: section.templateSection?.component || null,
          variant: section.templateSection?.variant || null,
          content: applyBusinessProfileOverrides(section.slotKey, mergeContent(section.templateSection, section.contentJson), website.businessProfile),
          tracking: {
            slotKey: section.slotKey,
            sectionKey: section.templateSection?.sectionKey || null
          },
          data: {
            services,
            portfolios,
            testimonials,
            brands,
            faqs: faqs.map((f) => faqContract(f, websiteType)),
            articleCategories: articleCategories.map(categoryContract),
            portfolioCategories: portfolioCategories.map(categoryContract),
            articles: articles.map(publicArticleSummary),
            timelines,
            teamMembers,
            products: products.map(productContract),
            productCategories: productCategories.map(categoryContract),
            valuePropositions: valuePropositions.map(valuePropositionContract),
            banners: banners.map(bannerContract)
          }
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
  app.post("/api/v1/auth/register", { config: { rateLimit: apiConfig.rateLimits.auth } }, async (request, reply) => {
    if (!(await isPublicActivationEnabled())) {
      throw new AppError(
        403,
        "PUBLIC_REGISTRATION_DISABLED",
        "Pendaftaran akun publik belum dibuka. Silakan hubungi tim Lentera Pasar untuk info lebih lanjut."
      );
    }
    const body = authBody.parse(request.body);
    const count = await prisma.user.count();
    // Akun pertama tetap jadi internal_admin untuk bootstrap sistem (tidak ada admin lain
    // yang bisa membuatkannya). Semua registrasi publik setelahnya HANYA boleh dapat role
    // "user" — akun owner_admin (pemilik website) hanya dibuat internal admin lewat
    // POST /internal/owners, bukan dari registrasi publik.
    const role = count === 0 ? "internal_admin" : "user";

    const rawVerificationToken = randomToken("verify");
    const emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: body.name || body.email.split("@")[0],
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        role,
        // Akun bootstrap internal_admin langsung dianggap terverifikasi supaya tidak
        // terkunci dari sistem sebelum SMTP sempat dikonfigurasi.
        emailVerifiedAt: role === "internal_admin" ? new Date() : null,
        emailVerificationTokenHash: role === "internal_admin" ? null : hashToken(rawVerificationToken),
        emailVerificationExpiresAt: role === "internal_admin" ? null : emailVerificationExpiresAt
      }
    });

    const authUser = { id: user.id, role: user.role, email: user.email } as AuthUser;
    await createAuditLog(request, {
      category: "security",
      action: "auth.registered",
      actor: authUser,
      entityType: "user",
      entityId: user.id,
      summary: `${user.email} registered as ${user.role}`
    });

    if (role !== "internal_admin") {
      const verifyUrl = `${apiConfig.dashboardAppUrl}/verify-email?token=${rawVerificationToken}`;
      const email = buildVerificationEmail(user.name, verifyUrl);
      await sendEmail({ to: user.email, ...email });
    }

    return created(reply, {
      user: publicUser(user),
      token: app.jwt.sign({ id: user.id, role: user.role, email: user.email }),
      // Token mentah HANYA dikembalikan di mode non-production (development/test), supaya
      // smoke test bisa memverifikasi alur verifikasi email tanpa perlu akses inbox asli.
      // Di production/deployment field ini tidak pernah ada di response.
      ...(apiConfig.isProductionLike || role === "internal_admin" ? {} : { debugVerificationToken: rawVerificationToken })
    }, "Registered");
  });
  app.post("/api/v1/auth/login", { config: { rateLimit: apiConfig.rateLimits.auth } }, async (request, reply) => {
    const body = authBody.omit({ name: true }).parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      await createAuditLog(request, {
        category: "security",
        action: "auth.login_failed",
        entityType: "auth",
        summary: "Failed login attempt",
        metadata: { email: body.email.toLowerCase() }
      });
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }
    if (user.role === "owner_admin" && user.accountStatus !== "active") {
      const statusInfo: Record<string, { code: string; message: string }> = {
        non_active: {
          code: "ACCOUNT_NON_ACTIVE",
          message: "Akun Anda saat ini non-aktif. Hubungi tim internal Lentera Pasar untuk mengaktifkan kembali."
        },
        suspended: {
          code: "ACCOUNT_SUSPENDED",
          message: "Akun Anda sedang ditangguhkan sementara. Hubungi tim internal Lentera Pasar."
        },
        banned: {
          code: "ACCOUNT_BANNED",
          message: "Akun Anda telah diblokir oleh tim internal Lentera Pasar."
        },
        blacklisted: {
          code: "ACCOUNT_BLACKLISTED",
          message: "Akun Anda masuk daftar hitam dan tidak dapat digunakan."
        }
      };
      const info = statusInfo[user.accountStatus];
      if (info) throw new AppError(403, info.code, info.message);
    }
    const authUser = { id: user.id, role: user.role, email: user.email } as AuthUser;
    await createAuditLog(request, {
      category: "security",
      action: "auth.login_success",
      actor: authUser,
      entityType: "user",
      entityId: user.id,
      summary: `${user.email} logged in`
    });
    return ok(reply, { user: publicUser(user), token: app.jwt.sign({ id: user.id, role: user.role, email: user.email }) }, "Logged in");
  });
  app.get("/api/v1/auth/me", async (request, reply) => {
    const auth = await requireAuth(request);
    const user = await prisma.user.findUnique({ where: { id: auth.id } });
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
    return ok(reply, publicUser(user), "Current user loaded");
  });
  app.get("/api/v1/me/storage-usage", async (request, reply) => {
    const auth = await requireAuth(request);
    const [usedBytes, quotaBytes] = await Promise.all([
      getOwnerStorageUsageBytes(auth.id),
      getOwnerStorageQuotaBytes(auth.id)
    ]);
    return ok(reply, {
      usedBytes,
      quotaBytes,
      remainingBytes: Math.max(0, quotaBytes - usedBytes)
    }, "Storage usage loaded");
  });

  app.post("/api/v1/auth/logout", async (_request, reply) => ok(reply, true, "Logged out"));

  app.post("/api/v1/auth/verify-email", { config: { rateLimit: apiConfig.rateLimits.auth } }, async (request, reply) => {
    const body = verifyEmailBody.parse(request.body);
    const tokenHash = hashToken(body.token);
    const user = await prisma.user.findFirst({ where: { emailVerificationTokenHash: tokenHash } });
    if (!user || !user.emailVerificationExpiresAt || user.emailVerificationExpiresAt.getTime() < Date.now()) {
      throw new AppError(400, "INVALID_OR_EXPIRED_TOKEN", "Link verifikasi tidak valid atau sudah kedaluwarsa");
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date(), emailVerificationTokenHash: null, emailVerificationExpiresAt: null }
    });
    await createAuditLog(request, {
      category: "security",
      action: "auth.email_verified",
      actor: { id: updated.id, role: updated.role, email: updated.email } as AuthUser,
      entityType: "user",
      entityId: updated.id,
      summary: `${updated.email} verified their email`
    });
    return ok(reply, publicUser(updated), "Email verified");
  });

  app.post("/api/v1/auth/resend-verification", { config: { rateLimit: apiConfig.rateLimits.auth } }, async (request, reply) => {
    const auth = await requireAuth(request);
    const user = await prisma.user.findUnique({ where: { id: auth.id } });
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
    if (user.emailVerifiedAt) {
      return ok(reply, true, "Email sudah terverifikasi");
    }
    const rawVerificationToken = randomToken("verify");
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationTokenHash: hashToken(rawVerificationToken),
        emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    const verifyUrl = `${apiConfig.dashboardAppUrl}/verify-email?token=${rawVerificationToken}`;
    const email = buildVerificationEmail(updated.name, verifyUrl);
    await sendEmail({ to: updated.email, ...email });
    return ok(
      reply,
      apiConfig.isProductionLike ? true : { debugVerificationToken: rawVerificationToken },
      "Email verifikasi dikirim ulang"
    );
  });

  app.post("/api/v1/auth/forgot-password", { config: { rateLimit: apiConfig.rateLimits.auth } }, async (request, reply) => {
    const body = forgotPasswordBody.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });

    // Selalu balas sukses generik walau email tidak ditemukan, supaya endpoint ini
    // tidak bisa dipakai untuk menebak-nebak email mana yang terdaftar (user enumeration).
    if (user) {
      const rawResetToken = randomToken("reset");
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetTokenHash: hashToken(rawResetToken),
          passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
        }
      });
      const resetUrl = `${apiConfig.dashboardAppUrl}/reset-password?token=${rawResetToken}`;
      const email = buildPasswordResetEmail(user.name, resetUrl);
      await sendEmail({ to: user.email, ...email });
      await createAuditLog(request, {
        category: "security",
        action: "auth.password_reset_requested",
        actor: { id: user.id, role: user.role, email: user.email } as AuthUser,
        entityType: "user",
        entityId: user.id,
        summary: `${user.email} requested a password reset`
      });
      if (!apiConfig.isProductionLike) {
        return ok(reply, { debugResetToken: rawResetToken }, "Kalau email terdaftar, instruksi reset password sudah dikirim");
      }
    }

    return ok(reply, true, "Kalau email terdaftar, instruksi reset password sudah dikirim");
  });

  app.post("/api/v1/auth/reset-password", { config: { rateLimit: apiConfig.rateLimits.auth } }, async (request, reply) => {
    const body = resetPasswordBody.parse(request.body);
    const tokenHash = hashToken(body.token);
    const user = await prisma.user.findFirst({ where: { passwordResetTokenHash: tokenHash } });
    if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt.getTime() < Date.now()) {
      throw new AppError(400, "INVALID_OR_EXPIRED_TOKEN", "Link reset password tidak valid atau sudah kedaluwarsa");
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(body.password),
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null
      }
    });
    await createAuditLog(request, {
      category: "security",
      action: "auth.password_reset",
      actor: { id: updated.id, role: updated.role, email: updated.email } as AuthUser,
      entityType: "user",
      entityId: updated.id,
      summary: `${updated.email} reset their password`
    });
    return ok(reply, true, "Password berhasil diubah");
  });
};

const registerCoreRoutes = () => {
  app.get("/api/v1/health", async (_request, reply) => ok(reply, safeServerInfo(), "API healthy"));
  app.get("/api/v1/health/live", async (_request, reply) => ok(reply, safeServerInfo(), "API live"));
  app.get("/api/v1/health/ready", async (request, reply) => {
    await requireInternalApiKey(request);
    await prisma.$queryRaw`SELECT 1`;
    return ok(reply, { ...safeServerInfo(), database: "ok" }, "API ready");
  });
  app.get("/api/v1/deployment/health", async (request, reply) => {
    await requireInternalApiKey(request);
    await prisma.$queryRaw`SELECT 1`;
    return ok(reply, {
      ...safeServerInfo(),
      database: "ok",
      corsOrigins: apiConfig.corsOrigins,
      jwtExpiresIn: apiConfig.jwtExpiresIn,
      rateLimits: apiConfig.rateLimits
    }, "Deployment health loaded");
  });
  app.get("/api/v1/website-types", async (_request, reply) => ok(reply, WEBSITE_TYPES, "Website types loaded"));
  app.get("/api/v1/settings/public-activation", async (_request, reply) => {
    // 1. Cek autentikasi dan otorisasi terlebih dahulu
    const actor = await requireRole(_request, ["internal_admin"]);
    
    // 2. Jika internal_admin, langsung bypass pengecekan DB dan return true
    if (actor.role === "internal_admin") {
      return ok(reply, { enabled: true }, "Public activation setting loaded (Bypassed for Admin)");
    }
    
    // 3. Jika nanti ada role lain di array requireRole, mereka akan mengecek nilai asli dari DB
    const enabled = await isPublicActivationEnabled();
    return ok(reply, { enabled }, "Public activation setting loaded");
  });
};

const registerInternalRoutes = () => {
  app.get("/api/v1/internal/owners", async (request, reply) => {
    await requireRole(request, ["internal_admin"]);
    const owners = await prisma.user.findMany({
      where: { role: "owner_admin" },
      include: { primaryWebsite: true, _count: { select: { websites: true } } },
      orderBy: { createdAt: "desc" }
    });
    return ok(reply, owners.map(ownerContract), "Owners loaded");
  });
  app.post("/api/v1/internal/owners", async (request, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = createOwnerBody.parse(request.body);
    const owner = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        role: "owner_admin",
        whatsapp: body.whatsapp || null,
        primaryWebsiteId: body.primaryWebsiteId || null,
        storageQuotaMb: body.storageQuotaMb ?? 50
      },
      include: { primaryWebsite: true, _count: { select: { websites: true } } }
    });
    await createAuditLog(request, {
      action: "internal.owner_created",
      actor,
      entityType: "user",
      entityId: owner.id,
      summary: `Owner ${owner.email} created`,
      metadata: { ownerEmail: owner.email, whatsapp: owner.whatsapp || null }
    });
    return created(reply, ownerContract(owner), "Owner created");
  });
  app.get("/api/v1/internal/owners/:ownerId", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);
    const owner = await prisma.user.findUnique({
      where: { id: request.params?.ownerId },
      include: { primaryWebsite: true, websites: true, _count: { select: { websites: true } } }
    });
    if (!owner || owner.role !== "owner_admin") throw new AppError(404, "OWNER_NOT_FOUND", "Owner not found");
    return ok(reply, ownerContract(owner), "Owner loaded");
  });
  app.patch("/api/v1/internal/owners/:ownerId", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = patchOwnerBody.parse(request.body);
    if (body.primaryWebsiteId) {
      const website = await prisma.website.findFirst({ where: { id: body.primaryWebsiteId, ownerId: request.params?.ownerId } });
      if (!website) throw new AppError(422, "INVALID_PRIMARY_WEBSITE", "Primary website must belong to owner");
    }
    const owner = await prisma.user.update({
      where: { id: request.params?.ownerId },
      data: {
        name: body.name,
        email: body.email?.toLowerCase(),
        passwordHash: body.password ? await hashPassword(body.password) : undefined,
        whatsapp: body.whatsapp,
        primaryWebsiteId: body.primaryWebsiteId
      },
      include: { primaryWebsite: true, _count: { select: { websites: true } } }
    });
    await createAuditLog(request, {
      action: "internal.owner_updated",
      actor,
      entityType: "user",
      entityId: owner.id,
      summary: `Owner ${owner.email} updated`,
      metadata: { changedFields: Object.keys(body).filter((key) => key !== "password") }
    });
    return ok(reply, ownerContract(owner), "Owner updated");
  });
  app.post("/api/v1/internal/owners/:ownerId/websites", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = createOwnerWebsiteBody.parse(request.body);
    const owner = await prisma.user.findUnique({ where: { id: request.params?.ownerId } });
    if (!owner || owner.role !== "owner_admin") throw new AppError(404, "OWNER_NOT_FOUND", "Owner not found");
    const website = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdWebsite = await tx.website.create({
        data: {
          ownerId: owner.id,
          websiteType: body.websiteType,
          name: body.name,
          slug: body.slug,
          trackingKey: randomToken("trk")
        }
      });
      await createWebsiteDefaults(tx, createdWebsite.id, createdWebsite.name, createdWebsite.websiteType);
      return createdWebsite;
    });
    await createAuditLog(request, {
      action: "internal.owner_website_created",
      actor,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Website ${website.slug} created for owner ${owner.email}`,
      metadata: { ownerId: owner.id, websiteSlug: website.slug }
    });
    return created(reply, websiteSummary(website), "Owner website created");
  });
  app.patch("/api/v1/internal/owners/:ownerId/primary-website", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = primaryWebsiteBody.parse(request.body);
    const owner = await prisma.user.findUnique({ where: { id: request.params?.ownerId } });
    if (!owner || owner.role !== "owner_admin") throw new AppError(404, "OWNER_NOT_FOUND", "Owner not found");
    const website = await prisma.website.findFirst({ where: { id: body.websiteId, ownerId: owner.id } });
    if (!website) throw new AppError(422, "INVALID_PRIMARY_WEBSITE", "Primary website must belong to owner");
    const updated = await prisma.user.update({
      where: { id: owner.id },
      data: { primaryWebsiteId: website.id },
      include: { primaryWebsite: true, _count: { select: { websites: true } } }
    });
    await createAuditLog(request, {
      action: "internal.primary_website_updated",
      actor,
      websiteId: website.id,
      entityType: "user",
      entityId: owner.id,
      summary: `Primary website updated for owner ${owner.email}`,
      metadata: { primaryWebsiteId: website.id, websiteSlug: website.slug }
    });
    return ok(reply, ownerContract(updated), "Primary website updated");
  });
  app.patch("/api/v1/internal/owners/:ownerId/storage-quota", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = patchStorageQuotaBody.parse(request.body);
    const owner = await prisma.user.findUnique({ where: { id: request.params?.ownerId } });
    if (!owner || owner.role !== "owner_admin") throw new AppError(404, "OWNER_NOT_FOUND", "Owner not found");
    const updated = await prisma.user.update({
      where: { id: owner.id },
      data: { storageQuotaMb: body.storageQuotaMb },
      include: { primaryWebsite: true, _count: { select: { websites: true } } }
    });
    await createAuditLog(request, {
      action: "internal.owner_storage_quota_updated",
      actor,
      entityType: "user",
      entityId: owner.id,
      summary: `Storage quota owner ${owner.email} diubah jadi ${body.storageQuotaMb}MB`,
      metadata: { previousStorageQuotaMb: owner.storageQuotaMb, storageQuotaMb: body.storageQuotaMb }
    });
    return ok(reply, ownerContract(updated), "Storage quota updated");
  });
  app.patch("/api/v1/internal/websites/:websiteId/status", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = websiteStatusBody.parse(request.body);
    const website = await prisma.website.findUnique({ where: { id: request.params?.websiteId } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_FOUND", "Website not found");

    const updated = await prisma.website.update({
      where: { id: website.id },
      data: { lifecycleStatus: body.status }
    });

    await createAuditLog(request, {
      action: "internal.website_status_updated",
      actor,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Status website ${website.slug} diubah dari ${website.lifecycleStatus} ke ${body.status}`,
      metadata: { previousStatus: website.lifecycleStatus, newStatus: body.status }
    });

    return ok(reply, websiteSummary(updated), "Website status updated");
  });
  app.post("/api/v1/internal/websites", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = createOwnerWebsiteBody.parse(request.body); // { name, slug, websiteType }

    const website = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdWebsite = await tx.website.create({
        data: {
          ownerId: actor.id, // sementara "dimiliki" internal admin pembuatnya
          websiteType: body.websiteType,
          name: body.name,
          slug: body.slug,
          trackingKey: randomToken("trk")
        }
      });
      await createWebsiteDefaults(tx, createdWebsite.id, createdWebsite.name, createdWebsite.websiteType);
      return createdWebsite;
    });

    await createAuditLog(request, {
      action: "internal.website_preprovisioned",
      actor,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Website ${website.slug} dibuat tanpa owner oleh ${actor.email}`,
      metadata: { websiteSlug: website.slug }
    });

    return created(reply, websiteSummary(website), "Website pre-provisioned berhasil dibuat");
  });
  app.patch("/api/v1/internal/websites/:websiteId/assign-owner", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = assignWebsiteOwnerBody.parse(request.body);

    const website = await prisma.website.findUnique({ where: { id: request.params?.websiteId } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_FOUND", "Website not found");

    const owner = await prisma.user.findUnique({ where: { id: body.ownerId } });
    if (!owner || owner.role !== "owner_admin") {
      throw new AppError(404, "OWNER_NOT_FOUND", "Owner not found");
    }

    const updated = await prisma.website.update({
      where: { id: website.id },
      data: { ownerId: owner.id }
    });

    await createAuditLog(request, {
      action: "internal.website_owner_assigned",
      actor,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Kepemilikan website ${website.slug} dipindah ke owner ${owner.email}`,
      metadata: { previousOwnerId: website.ownerId, newOwnerId: owner.id }
    });

    return ok(reply, websiteSummary(updated), "Owner website berhasil di-assign");
  });
  app.patch("/api/v1/internal/owners/:ownerId/status", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = ownerStatusBody.parse(request.body);
    const owner = await prisma.user.findUnique({ where: { id: request.params?.ownerId } });
    if (!owner || owner.role !== "owner_admin") throw new AppError(404, "OWNER_NOT_FOUND", "Owner not found");

    const updated = await prisma.user.update({
      where: { id: owner.id },
      data: { accountStatus: body.status },
      include: { primaryWebsite: true, _count: { select: { websites: true } } }
    });

    await createAuditLog(request, {
      action: "internal.owner_status_updated",
      actor,
      entityType: "user",
      entityId: owner.id,
      summary: `Status owner ${owner.email} diubah dari ${owner.accountStatus} ke ${body.status}`,
      metadata: { previousStatus: owner.accountStatus, newStatus: body.status }
    });

    return ok(reply, ownerContract(updated), "Owner status updated");
  });
  app.get("/api/v1/internal/websites", async (request, reply) => {
    await requireRole(request, ["internal_admin"]);
    const websites = await prisma.website.findMany({
      include: {
        owner: true, // pastikan ini ada
        _count: { select: { pages: true, sections: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return ok(
      reply,
      websites.map((w) => ({
        ...websiteSummary(w),
        ownerId: w.ownerId,
        ownerName: w.owner?.name,
        ownerRole: w.owner?.role,                        // <-- BARU
        isUnassigned: w.owner?.role === "internal_admin"  // <-- BARU
      })),
      "Websites loaded"
    );
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

  app.post("/api/v1/internal/websites/:websiteId/sync-structure", async (request: Req, reply) => {
    const user = await requireRole(request, ["internal_admin"]);
    
    const websiteId = request.params?.websiteId;
    
    // 1. TAMBAHKAN GUARD CLAUSE INI UNTUK MENYAKINKAN TYPESCRIPT
    if (!websiteId) {
      throw new AppError(400, "BAD_REQUEST", "Website ID harus disertakan.");
    }
    // Setelah baris ini, TypeScript otomatis menganggap tipe websiteId adalah 'string'

    const website = await prisma.website.findUnique({ where: { id: websiteId } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_FOUND", "Website tidak ditemukan.");
    
    if (!["company_profile", "catalog_product"].includes(website.websiteType)) {
      throw new AppError(400, "UNSUPPORTED_WEBSITE_TYPE", `Sinkronisasi struktur belum didukung untuk tipe website: ${website.websiteType}`);
    }

    const before = {
      pages: await prisma.websitePage.count({ where: { websiteId } }),
      sections: await prisma.pageSection.count({ where: { websiteId } })
    };

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Sekarang baris ini sudah aman dari error ts(2345)
      await ensureWebsiteStructure(tx, websiteId, website.websiteType);
    });

    const after = {
      pages: await prisma.websitePage.count({ where: { websiteId } }),
      sections: await prisma.pageSection.count({ where: { websiteId } })
    };

    await createAuditLog(request, {
      action: "internal.website_structure_synced",
      actor: user,
      websiteId,
      entityType: "website",
      entityId: websiteId,
      summary: `Struktur website ${website.slug} disinkronkan ke versi terbaru`,
      metadata: {
        websiteType: website.websiteType,
        pagesBefore: before.pages,
        pagesAfter: after.pages,
        pagesAdded: after.pages - before.pages,
        sectionsBefore: before.sections,
        sectionsAfter: after.sections,
        sectionsAdded: after.sections - before.sections
      }
    });

    return ok(reply, {
      websiteId,
      websiteSlug: website.slug,
      pagesAdded: after.pages - before.pages,
      sectionsAdded: after.sections - before.sections,
      totalPages: after.pages,
      totalSections: after.sections
    }, "Struktur website berhasil disinkronkan ke versi terbaru.");
});
  app.patch("/api/v1/internal/settings/public-activation", async (request: Req, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const body = publicActivationBody.parse(request.body);

    const before = await getPlatformSetting();
    const updated = await prisma.platformSetting.upsert({
      where: { id: "singleton" },
      update: { publicActivationEnabled: body.enabled, updatedByUserId: actor.id },
      create: { id: "singleton", publicActivationEnabled: body.enabled, updatedByUserId: actor.id }
    });

    await createAuditLog(request, {
      category: "security",
      action: "internal.public_activation_toggled",
      actor,
      entityType: "platform_setting",
      entityId: "singleton",
      summary: `Aktivasi publik diubah dari ${before.publicActivationEnabled} ke ${body.enabled} oleh ${actor.email}`,
      metadata: { previousValue: before.publicActivationEnabled, newValue: body.enabled }
    });

    return ok(reply, { enabled: updated.publicActivationEnabled }, "Public activation setting updated");
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
    const actor = await requireAuth(request);
    if (actor.role === "owner_admin" && !(await isPublicActivationEnabled())) {
      throw new AppError(
        403,
        "SELF_SERVICE_WEBSITE_DISABLED",
        "Pembuatan website mandiri belum dibuka. Website Anda saat ini hanya bisa dibuatkan oleh tim internal Lentera Pasar."
      );
    }
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
      await createWebsiteDefaults(tx, created.id, created.name, created.websiteType);
      return created;
    });
    await createAuditLog(request, {
      action: "website.created",
      actor: user,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Website ${website.slug} created`,
      metadata: { websiteType: website.websiteType }
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
    const { user, website } = await getWebsiteForAccess(request);
    const body = patchWebsiteBody.parse(request.body);
    const updated = await prisma.website.update({ where: { id: website.id }, data: { ...body, themeJson: prismaJson(limitJson(body.themeJson)) } });
    await createAuditLog(request, {
      action: "website.updated",
      actor: user,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Website ${website.slug} updated`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, websiteSummary(updated), "Website updated");
  });
  app.post("/api/v1/websites/:websiteId/publish", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const updated = await prisma.website.update({ where: { id: website.id }, data: { status: "published" } });
    await createAuditLog(request, {
      action: "website.published",
      actor: user,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Website ${website.slug} published`
    });
    return ok(reply, websiteSummary(updated), "Website published");
  });
  app.post("/api/v1/websites/:websiteId/unpublish", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const updated = await prisma.website.update({ where: { id: website.id }, data: { status: "draft" } });
    await createAuditLog(request, {
      action: "website.unpublished",
      actor: user,
      websiteId: website.id,
      entityType: "website",
      entityId: website.id,
      summary: `Website ${website.slug} unpublished`
    });
    return ok(reply, websiteSummary(updated), "Website unpublished");
  });
  app.get("/api/v1/websites/:websiteId/page-setup", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const pages = await prisma.websitePage.findMany({
      where: { websiteId: website.id, pageKey: { not: "global" } },
      include: { sections: true, _count: { select: { slugHistories: true } } },
      orderBy: { sortOrder: "asc" }
    });
    const navigation = await buildNavigationContract(website.id, website.websiteType);
    return ok(reply, {
      pages: pages.map((p) => pageDashboardSummary(p, website.websiteType)),
      navbarItems: navigation.navbar.items,
      footerItems: navigation.footer.items,
      availableTargets: navigation.availableTargets,
      navbarChrome: { theme: navigation.navbar.theme, component: navigation.navbar.component },
      footerChrome: { theme: navigation.footer.theme, component: navigation.footer.component }
    }, "Page setup loaded");
  });

  app.get("/api/v1/websites/:websiteId/navigation-contract", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, await buildNavigationContract(website.id, website.websiteType), "Navigation contract loaded");
  });

  app.get("/api/v1/websites/:websiteId/page-redirects", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const redirects = await prisma.websitePageSlugHistory.findMany({
      where: { websiteId: website.id },
      orderBy: { createdAt: "desc" }
    });
    return ok(reply, redirects.map((redirect: any) => ({
      id: redirect.id,
      pageKey: redirect.pageKey,
      oldSlug: redirect.oldSlug,
      newSlug: redirect.newSlug,
      from: redirect.oldSlug ? `/${redirect.oldSlug}` : "/",
      to: redirect.newSlug ? `/${redirect.newSlug}` : "/",
      redirectType: redirect.redirectType,
      createdAt: redirect.createdAt
    })), "Page redirects loaded");
  });

  app.patch("/api/v1/websites/:websiteId/pages/:pageKey/setup", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const pageKey = request.params?.pageKey || "";
    const body = pageSetupBody.parse(request.body);
    const page = await prisma.websitePage.findUnique({ where: { websiteId_pageKey: { websiteId: website.id, pageKey } } });
    if (!page) throw new AppError(404, "PAGE_NOT_FOUND", "Page not found");

    const dynamicDetailPage = isDynamicDetailPage(page.pageKey, website.websiteType);
    const nextSlug = page.pageKey === "home" ? "" : body.slug === undefined ? page.slug : cleanPageSlug(body.slug);
    if (!isValidPageSlug(nextSlug)) throw new AppError(422, "INVALID_PAGE_SLUG", "Slug must use lowercase kebab-case without slash");
    if (page.pageKey !== "home" && !nextSlug) throw new AppError(422, "PAGE_SLUG_REQUIRED", "Slug is required for this page");

    if (nextSlug !== page.slug) {
      const existingSlug = await prisma.websitePage.findFirst({ where: { websiteId: website.id, slug: nextSlug, id: { not: page.id } } });
      if (existingSlug) throw new AppError(409, "PAGE_SLUG_EXISTS", "Slug already used by another page");
    }

    const data: any = {
      title: body.title,
      navLabel: body.navLabel === undefined ? undefined : body.navLabel || null,
      footerLabel: body.footerLabel === undefined ? undefined : body.footerLabel || null,
      slug: nextSlug,
      purpose: body.purpose === undefined ? undefined : body.purpose || null,
      isPublished: body.isPublished,
      isVisibleInNavbar: dynamicDetailPage ? false : body.isVisibleInNavbar,
      isVisibleInFooter: dynamicDetailPage ? false : body.isVisibleInFooter,
      sortOrder: body.sortOrder,
      seoTitle: body.seoTitle === undefined ? undefined : body.seoTitle || null,
      seoDescription: body.seoDescription === undefined ? undefined : body.seoDescription || null
    };

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (nextSlug !== page.slug) {
        await tx.websitePageSlugHistory.create({
          data: {
            websiteId: website.id,
            pageId: page.id,
            pageKey: page.pageKey,
            oldSlug: page.slug,
            newSlug: nextSlug,
            redirectType: 301
          }
        });
      }
      return tx.websitePage.update({
        where: { id: page.id },
        data,
        include: { sections: true, _count: { select: { slugHistories: true } } }
      });
    });

    await createAuditLog(request, {
      action: "page_setup.updated",
      actor: user,
      websiteId: website.id,
      entityType: "website_page",
      entityId: updated.id,
      summary: `Page setup updated: ${updated.pageKey}`,
      metadata: {
        pageKey: updated.pageKey,
        oldSlug: page.slug,
        newSlug: updated.slug,
        changedFields: Object.keys(body)
      }
    });
    return ok(reply, pageDashboardSummary(updated, website.websiteType), "Page setup updated");
  });

  app.get("/api/v1/websites/:websiteId/pages", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const pages = await prisma.websitePage.findMany({
      where: { websiteId: website.id, pageKey: { not: "global" } },
      include: { sections: true, _count: { select: { slugHistories: true } } },
      orderBy: { sortOrder: "asc" }
    });
    return ok(reply, pages.map((p) => pageDashboardSummary(p, website.websiteType)), "Pages loaded");
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
    const businessProfile = await getBusinessProfileForWebsite(website.id);
    return ok(reply, {
      id: page.id,
      pageKey: page.pageKey,
      title: page.title,
      navLabel: page.navLabel || page.title,
      footerLabel: page.footerLabel || page.navLabel || page.title,
      slug: page.slug,
      publicPath: pagePublicPath(page),
      purpose: page.purpose || pagePurpose(page.pageKey, website.websiteType),
      pageLabel: getPageLabel(page.pageKey, website.websiteType),
      isDynamicDetailPage: isDynamicDetailPage(page.pageKey, website.websiteType),
      isPublished: page.isPublished ?? page.isActive,
      isVisibleInNavbar: isDynamicDetailPage(page.pageKey, website.websiteType) ? false : page.isVisibleInNavbar,
      isVisibleInFooter: isDynamicDetailPage(page.pageKey, website.websiteType) ? false : page.isVisibleInFooter,
      seoTitle: page.seoTitle || null,
      seoDescription: page.seoDescription || null,
      isActive: page.isActive,
      sections: page.sections.map((section: any) => sectionDetailContract(section, website.id, businessProfile, website.websiteType))
    }, "Page loaded");
  });
};

const registerSectionRoutes = () => {
  app.get("/api/v1/websites/:websiteId/sections", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const sections = await prisma.pageSection.findMany({ where: { websiteId: website.id }, include: { templateSection: true }, orderBy: { sortOrder: "asc" } });
    const businessProfile = await getBusinessProfileForWebsite(website.id);
    return ok(reply, sections.map((section: any) => sectionDetailContract(section, website.id, businessProfile, website.websiteType)), "Sections loaded");
  });
  app.get("/api/v1/websites/:websiteId/sections/:slotKey", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const section = await prisma.pageSection.findUnique({ where: { websiteId_slotKey: { websiteId: website.id, slotKey: request.params?.slotKey || "" } }, include: { templateSection: true } });
    if (!section) throw new AppError(404, "SECTION_NOT_FOUND", "Section not found");
    const businessProfile = await getBusinessProfileForWebsite(website.id);
    return ok(reply, sectionDetailContract(section, website.id, businessProfile, website.websiteType), "Section loaded");
  });
  app.patch("/api/v1/websites/:websiteId/sections/:slotKey/template", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = sectionTemplateBody.parse(request.body);
    const section = await prisma.pageSection.findUnique({ where: { websiteId_slotKey: { websiteId: website.id, slotKey: request.params?.slotKey || "" } } });
    const template = await prisma.templateSection.findUnique({ where: { id: body.templateSectionId } });
    if (!section || !template || template.slotKey !== section.slotKey || template.websiteType !== website.websiteType || template.status !== "active" || !template.isActive) {
      throw new AppError(400, "INVALID_TEMPLATE_SECTION", "Template section does not match this slot");
    }
    const updated = await prisma.pageSection.update({ where: { id: section.id }, data: { templateSectionId: template.id }, include: { templateSection: true } });
    await createAuditLog(request, {
      action: "section.template_updated",
      actor: user,
      websiteId: website.id,
      entityType: "page_section",
      entityId: updated.id,
      summary: `Section template updated: ${updated.slotKey}`,
      metadata: { slotKey: updated.slotKey, templateSectionId: template.id, sectionKey: template.sectionKey }
    });
    const businessProfile = await getBusinessProfileForWebsite(website.id);
    return ok(reply, sectionDetailContract(updated, website.id, businessProfile, website.websiteType), "Section template updated");
  });
  app.patch("/api/v1/websites/:websiteId/sections/:slotKey/content", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const slotKey = request.params?.slotKey || "";
    if (slotKey === "about.vision_mission") {
      throw new AppError(400, "SECTION_AUTO_MANAGED", "Konten Visi & Misi otomatis diambil dari Profil Bisnis dan tidak dapat diedit manual di sini. Silakan edit di halaman Profil Bisnis.");
    }
    const body = sectionContentBody.parse(request.body);
    const updated = await prisma.pageSection.update({
      where: { websiteId_slotKey: { websiteId: website.id, slotKey } },
      data: { contentJson: prismaJson(limitJson(body.contentJson)) },
      include: { templateSection: true }
    });
    await createAuditLog(request, {
      action: "section.content_updated",
      actor: user,
      websiteId: website.id,
      entityType: "page_section",
      entityId: updated.id,
      summary: `Section content updated: ${updated.slotKey}`,
      metadata: { slotKey: updated.slotKey, contentKeys: Object.keys(body.contentJson || {}) }
    });
    const businessProfile = await getBusinessProfileForWebsite(website.id);
    return ok(reply, sectionDetailContract(updated, website.id, businessProfile, website.websiteType), "Section content updated");
  });
  app.patch("/api/v1/websites/:websiteId/sections/:slotKey/visibility", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = visibilityBody.parse(request.body);
    const updated = await prisma.pageSection.update({
      where: { websiteId_slotKey: { websiteId: website.id, slotKey: request.params?.slotKey || "" } },
      data: { isVisible: body.isVisible },
      include: { templateSection: true }
    });
    await createAuditLog(request, {
      action: "section.visibility_updated",
      actor: user,
      websiteId: website.id,
      entityType: "page_section",
      entityId: updated.id,
      summary: `Section visibility updated: ${updated.slotKey}`,
      metadata: { slotKey: updated.slotKey, isVisible: updated.isVisible }
    });
    const businessProfile = await getBusinessProfileForWebsite(website.id);
    return ok(reply, sectionDetailContract(updated, website.id, businessProfile, website.websiteType), "Section visibility updated");
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
  templateKey: z.string().min(1).nullable().optional(),
  slotKey: z.string().min(1),
  websiteType: z.enum(["company_profile", "catalog_product"]),
  pageKey: z.string().min(1),
  name: z.string().min(1),
  component: z.string().min(1),
  variant: z.string().nullable().optional(),
  schema: z.array(templateFieldSchema),
  defaultContent: z.record(z.unknown())
});

const templatePackManifestSchema = z.object({
  templatePackKey: z.string().min(1),
  websiteType: z.enum(["company_profile", "catalog_product"]),
  name: z.string().min(1),
  theme: z.enum(["formal", "casual", "abstract", "premium"]),
  version: z.string().min(1),
  description: z.string().nullable().optional(),
  pages: z.array(z.string().min(1))
});

type ValidationItem = { level: "error" | "warning"; file?: string; slotKey?: string; message: string };

const expectedPagesFor = (websiteType: string) =>
  websiteType === "company_profile" ? [...WEBSITE_TYPE_PAGES.company_profile]
    : websiteType === "catalog_product" ? [...WEBSITE_TYPE_PAGES.catalog_product]
    : [];

const expectedSlotsFor = (websiteType: string) =>
  websiteType === "company_profile" ? COMPANY_PROFILE_SECTION_SLOTS.map((slot) => slot.slotKey)
    : websiteType === "catalog_product" ? CATALOG_PRODUCT_SECTION_SLOTS.map((slot) => slot.slotKey)
    : [];

const sameStringSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((item) => b.includes(item)) && b.every((item) => a.includes(item));

const isSafeZipEntryName = (name: string) =>
  !name.includes("..") && !name.startsWith("/") && !name.startsWith("\\") && !name.includes(":") && !name.includes("\\");

const validationSummary = (summary: Record<string, unknown>, errors: ValidationItem[], warnings: ValidationItem[]) => ({
  ...summary,
  errors,
  warnings
});

const importTemplatePackZip = async (buffer: Buffer) => {
  if (buffer.byteLength > 5 * 1024 * 1024) {
    throw new AppError(413, "ZIP_TOO_LARGE", "Template pack ZIP is too large");
  }

  const zip = new AdmZip(buffer);
  const allEntries = zip.getEntries();
  for (const entry of allEntries) {
    if (!isSafeZipEntryName(entry.entryName)) {
      throw new AppError(400, "UNSAFE_ZIP_ENTRY", `Unsafe ZIP entry path: ${entry.entryName}`);
    }
  }

  const manifestEntry = zip.getEntry("manifest.json");
  if (!manifestEntry) throw new AppError(400, "MANIFEST_REQUIRED", "manifest.json is required");

  let manifestRaw: unknown;
  try {
    manifestRaw = JSON.parse(manifestEntry.getData().toString("utf8"));
  } catch {
    throw new AppError(400, "INVALID_MANIFEST_JSON", "manifest.json must be valid JSON");
  }

  const manifestResult = templatePackManifestSchema.safeParse(manifestRaw);
  if (!manifestResult.success) {
    throw new AppError(422, "INVALID_MANIFEST", "Template pack manifest is invalid", manifestResult.error.flatten());
  }
  const manifest = manifestResult.data;
  const expectedPages = expectedPagesFor(manifest.websiteType);
  const expectedSlots = expectedSlotsFor(manifest.websiteType);
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  if (!WEBSITE_TYPES.some((type) => type.key === manifest.websiteType)) {
    errors.push({ level: "error", file: "manifest.json", message: "websiteType tidak dikenal." });
  }
  if (!["company_profile", "catalog_product"].includes(manifest.websiteType)) {
    errors.push({ level: "error", file: "manifest.json", message: "Untuk saat ini, websiteType harus company_profile atau catalog_product." });
  }
  if (!Object.keys(THEMES).includes(manifest.theme)) {
    errors.push({ level: "error", file: "manifest.json", message: "theme tidak valid." });
  }
  if (!sameStringSet(manifest.pages, expectedPages)) {
    errors.push({ level: "error", file: "manifest.json", message: "pages tidak cocok dengan struktur websiteType." });
  }

  const sectionEntries = allEntries.filter((entry) => !entry.isDirectory && entry.entryName.startsWith("sections/") && entry.entryName.endsWith(".json"));
  if (sectionEntries.length === 0) {
    errors.push({ level: "error", file: "sections/", message: "Folder sections harus berisi minimal satu JSON section." });
  }

  const seenSectionKeys = new Set<string>();
  const validSectionRows: Array<{ parsed: z.infer<typeof templateImportSchema>; file: string; status: "draft" | "active" | "invalid"; validationErrors: ValidationItem[] }> = [];
  const foundValidSlots = new Set<string>();

  for (const entry of sectionEntries) {
    const file = entry.entryName;
    const sectionErrors: ValidationItem[] = [];
    let raw: any;
    try {
      raw = JSON.parse(entry.getData().toString("utf8"));
    } catch {
      errors.push({ level: "error", file, message: "File section bukan JSON valid." });
      continue;
    }

    const parsedResult = templateImportSchema.safeParse(raw);
    if (!parsedResult.success) {
      sectionErrors.push({ level: "error", file, slotKey: raw?.slotKey, message: "Format section tidak valid." });
    }

    const parsed = parsedResult.success
      ? parsedResult.data
      : {
          sectionKey: String(raw?.sectionKey || ""),
          templateKey: raw?.templateKey ? String(raw.templateKey) : null,
          slotKey: String(raw?.slotKey || ""),
          websiteType: raw?.websiteType,
          pageKey: String(raw?.pageKey || ""),
          name: String(raw?.name || raw?.sectionKey || file),
          component: String(raw?.component || ""),
          variant: raw?.variant || null,
          schema: Array.isArray(raw?.schema) ? raw.schema : [],
          defaultContent: raw?.defaultContent && typeof raw.defaultContent === "object" ? raw.defaultContent : {}
        };

    if (!parsed.sectionKey) sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "sectionKey wajib diisi." });
    if (parsed.sectionKey && seenSectionKeys.has(parsed.sectionKey)) {
      sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "sectionKey duplikat dalam pack." });
    }
    if (parsed.sectionKey) seenSectionKeys.add(parsed.sectionKey);
    if (parsed.websiteType !== manifest.websiteType) {
      sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "websiteType section tidak sama dengan manifest." });
    }
    if (parsed.templateKey && parsed.templateKey !== manifest.templatePackKey) {
      sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "templateKey section tidak sama dengan templatePackKey manifest." });
    }
    if (!expectedPages.includes(parsed.pageKey as any)) {
      sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "pageKey tidak valid untuk websiteType." });
    }
    if (!parsed.slotKey.includes(".") || parsed.slotKey.split(".")[0] !== parsed.pageKey) {
      sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "slotKey tidak cocok dengan pageKey." });
    }
    if (!expectedSlots.includes(parsed.slotKey)) {
      sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "slotKey tidak valid untuk struktur websiteType." });
    }
    if (!parsed.component) {
      sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "component tidak boleh kosong." });
    }
    for (const field of parsed.schema as any[]) {
      if (!field?.key || !field?.label || !field?.type || !SECTION_FIELD_TYPES.includes(field.type)) {
        sectionErrors.push({ level: "error", file, slotKey: parsed.slotKey, message: "schema field harus memiliki key, label, dan type valid." });
        break;
      }
    }

    if (sectionErrors.length === 0) foundValidSlots.add(parsed.slotKey);
    else errors.push(...sectionErrors);

    if (parsed.sectionKey) {
      validSectionRows.push({
        parsed: parsed as z.infer<typeof templateImportSchema>,
        file,
        status: sectionErrors.length > 0 ? "invalid" : "draft",
        validationErrors: sectionErrors
      });
    }
  }

  const missingSlots = expectedSlots.filter((slotKey) => !foundValidSlots.has(slotKey));
  for (const slotKey of missingSlots) {
    warnings.push({ level: "warning", slotKey, message: "Template untuk slot ini belum ada di pack." });
  }

  const packStatus = errors.length > 0 ? "invalid" : missingSlots.length > 0 ? "draft" : "active";
  for (const row of validSectionRows) {
    if (row.status !== "invalid") row.status = packStatus === "active" ? "active" : "draft";
  }

  const summary = {
    expectedPages: expectedPages.length,
    expectedSlots: expectedSlots.length,
    foundSections: sectionEntries.length,
    validSections: validSectionRows.filter((row) => row.status !== "invalid").length,
    draftSections: validSectionRows.filter((row) => row.status === "draft").length,
    invalidSections: validSectionRows.filter((row) => row.status === "invalid").length
  };

  const templatePack = await prisma.templatePack.upsert({
    where: { templatePackKey: manifest.templatePackKey },
    update: {
      websiteType: manifest.websiteType,
      name: manifest.name,
      theme: manifest.theme,
      version: manifest.version,
      description: manifest.description || null,
      status: packStatus,
      validationSummaryJson: validationSummary(summary, errors, warnings) as any
    },
    create: {
      templatePackKey: manifest.templatePackKey,
      websiteType: manifest.websiteType,
      name: manifest.name,
      theme: manifest.theme,
      version: manifest.version,
      description: manifest.description || null,
      status: packStatus,
      validationSummaryJson: validationSummary(summary, errors, warnings) as any
    }
  });

  for (const row of validSectionRows) {
    const parsed = row.parsed;
    const schemaJson = normalizeSectionSchema(parsed.schema);
    await prisma.templateSection.upsert({
      where: { sectionKey: parsed.sectionKey },
      update: {
        templatePackId: templatePack.id,
        websiteType: parsed.websiteType,
        pageKey: parsed.pageKey,
        slotKey: parsed.slotKey,
        name: parsed.name,
        component: parsed.component || "InvalidSection",
        variant: parsed.variant || null,
        schemaJson: schemaJson as any,
        defaultContentJson: parsed.defaultContent as any,
        status: row.status,
        isActive: row.status === "active",
        validationErrors: row.validationErrors.length ? row.validationErrors as any : null
      },
      create: {
        templatePackId: templatePack.id,
        sectionKey: parsed.sectionKey,
        websiteType: parsed.websiteType,
        pageKey: parsed.pageKey,
        slotKey: parsed.slotKey,
        name: parsed.name,
        component: parsed.component || "InvalidSection",
        variant: parsed.variant || null,
        schemaJson: schemaJson as any,
        defaultContentJson: parsed.defaultContent as any,
        status: row.status,
        isActive: row.status === "active",
        validationErrors: row.validationErrors.length ? row.validationErrors as any : null
      }
    });
  }

  const savedPack = await prisma.templatePack.findUnique({ where: { id: templatePack.id }, include: { _count: { select: { sections: true } } } });
  return { templatePack: savedPack || templatePack, summary, errors, warnings };
};

const registerTemplateRoutes = () => {
  app.post("/api/v1/internal/template-sections/import-zip", { config: { rateLimit: apiConfig.rateLimits.templateUpload } }, async (request, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const file = await request.file();
    if (!file) throw new AppError(400, "ZIP_REQUIRED", "Template ZIP file is required");
    const report = await importTemplatePackZip(await file.toBuffer());
    await createAuditLog(request, {
      action: "template_pack.imported",
      actor,
      entityType: "template_pack",
      entityId: report.templatePack.id,
      summary: `Template pack imported: ${report.templatePack.templatePackKey}`,
      metadata: { status: report.templatePack.status, summary: report.summary, errors: report.errors.length, warnings: report.warnings.length }
    });
    return ok(reply, { templatePack: templatePackContract(report.templatePack), summary: report.summary, errors: report.errors, warnings: report.warnings }, "Template pack imported");
  });
  app.post("/api/v1/internal/template-packs/import-zip", { config: { rateLimit: apiConfig.rateLimits.templateUpload } }, async (request, reply) => {
    const actor = await requireRole(request, ["internal_admin"]);
    const file = await request.file();
    if (!file) throw new AppError(400, "ZIP_REQUIRED", "Template pack ZIP file is required");
    const report = await importTemplatePackZip(await file.toBuffer());
    await createAuditLog(request, {
      action: "template_pack.imported",
      actor,
      entityType: "template_pack",
      entityId: report.templatePack.id,
      summary: `Template pack imported: ${report.templatePack.templatePackKey}`,
      metadata: { status: report.templatePack.status, summary: report.summary, errors: report.errors.length, warnings: report.warnings.length }
    });
    return ok(reply, { templatePack: templatePackContract(report.templatePack), summary: report.summary, errors: report.errors, warnings: report.warnings }, "Template pack imported");
  });
  app.get("/api/v1/internal/template-packs", async (request, reply) => {
    await requireRole(request, ["internal_admin"]);
    const packs = await prisma.templatePack.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { sections: true } } }
    });
    return ok(reply, packs.map(templatePackContract), "Template packs loaded");
  });
  app.get("/api/v1/internal/template-packs/:templatePackId", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);
    const pack = await prisma.templatePack.findUnique({
      where: { id: request.params?.templatePackId },
      include: { sections: { orderBy: [{ pageKey: "asc" }, { slotKey: "asc" }, { name: "asc" }] }, _count: { select: { sections: true } } }
    });
    if (!pack) throw new AppError(404, "TEMPLATE_PACK_NOT_FOUND", "Template pack not found");
    return ok(reply, { ...templatePackContract(pack), sections: pack.sections.map(templateContract) }, "Template pack loaded");
  });
  app.get("/api/v1/internal/template-packs/:templatePackId/validation-report", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);
    const pack = await prisma.templatePack.findUnique({ where: { id: request.params?.templatePackId }, include: { _count: { select: { sections: true } } } });
    if (!pack) throw new AppError(404, "TEMPLATE_PACK_NOT_FOUND", "Template pack not found");
    const report = pack.validationSummaryJson as any;
    return ok(reply, { templatePack: templatePackContract(pack), summary: report || null, errors: report?.errors || [], warnings: report?.warnings || [] }, "Template pack validation report loaded");
  });
  app.get("/api/v1/template-sections", async (request: Req, reply) => {
    const user = await requireAuth(request);
    const includeDraft = request.query?.includeDraft === "true" && user.role === "internal_admin";
    const sections = await prisma.templateSection.findMany({
      where: {
        websiteType: request.query?.websiteType,
        slotKey: request.query?.slotKey,
        ...(includeDraft ? {} : { status: "active", isActive: true })
      },
      orderBy: { name: "asc" },
      include: { templatePack: true }
    });
    return ok(reply, sections.map(templateContract), "Template sections loaded");
  });
  app.get("/api/v1/template-sections/:id", async (request: Req, reply) => {
    await requireAuth(request);
    const section = await prisma.templateSection.findUnique({ where: { id: request.params?.id }, include: { templatePack: true } });
    if (!section) throw new AppError(404, "TEMPLATE_SECTION_NOT_FOUND", "Template section not found");
    return ok(reply, templateContract(section), "Template section loaded");
  });
  app.get("/api/v1/template-sections/by-slot/:slotKey", async (request: Req, reply) => {
    await requireAuth(request);
    // websiteType opsional (query param) supaya backward-compatible untuk caller lama.
    // Tapi begitu TemplateSection untuk catalog_product mulai dibuat, slotKey yang sama
    // (mis. "home.hero") bakal ada di 2 websiteType sekaligus — caller baru WAJIB kirim
    // ?websiteType= biar nggak ketuker.
    const websiteType = typeof request.query?.websiteType === "string" ? request.query.websiteType : undefined;
    const sections = await prisma.templateSection.findMany({
      where: {
        slotKey: request.params?.slotKey,
        ...(websiteType ? { websiteType } : {}),
        status: "active",
        isActive: true
      },
      orderBy: { name: "asc" },
      include: { templatePack: true }
    });
    return ok(reply, sections.map(templateContract), "Template sections loaded");
  });
};

const registerContentRoutes = () => {
  app.get("/api/v1/websites/:websiteId/business-profile", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, await prisma.businessProfile.findUnique({ where: { websiteId: website.id } }), "Business profile loaded");
  });
  app.put("/api/v1/websites/:websiteId/business-profile", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = businessProfileBody.parse(request.body);
    const profileData = { ...body, timelineJson: prismaJson(limitJson(body.timelineJson)) };
    const profile = await prisma.businessProfile.upsert({ where: { websiteId: website.id }, update: profileData, create: { ...profileData, websiteId: website.id } });
    await createAuditLog(request, {
      action: "business_profile.saved",
      actor: user,
      websiteId: website.id,
      entityType: "business_profile",
      entityId: profile.id,
      summary: `Business profile saved for ${website.slug}`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, profile, "Business profile saved");
  });
};

const registerCrud = (
  base: "services" | "portfolios" | "testimonials" | "brand-partners" | "value-propositions" | "banners",
  schema: z.ZodTypeAny
) => {
  const model = base === "services" ? prisma.service
    : base === "portfolios" ? prisma.portfolio
    : base === "testimonials" ? prisma.testimonial
    : base === "brand-partners" ? prisma.brandPartner
    : base === "value-propositions" ? prisma.valueProposition
    : prisma.banner;
  const idParam = base === "services" ? "serviceId"
    : base === "portfolios" ? "portfolioId"
    : base === "testimonials" ? "testimonialId"
    : base === "brand-partners" ? "brandPartnerId"
    : base === "value-propositions" ? "valuePropositionId"
    : "bannerId";
  const include = base === "portfolios" ? { category: true } : undefined;
  app.get(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const orderBy = base === "services" || base === "portfolios"
      ? [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }]
      : [{ sortOrder: "asc" }];
    const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
    const where = { websiteId: website.id };
    const [rows, total] = await Promise.all([
      (model as any).findMany({ where, orderBy, skip, take, ...(include ? { include } : {}) }),
      (model as any).count({ where })
    ]);
    return paginated(reply, rows, buildPaginationMeta(page, pageSize, total), `${base} loaded`);
  });
  app.post(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = schema.parse(request.body);
    const data = base === "portfolios" ? body : { ...body, categoryId: undefined };
    if (base === "portfolios" && data.categoryId) {
      const category = await prisma.portfolioCategory.findFirst({ where: { id: data.categoryId, websiteId: website.id } });
      if (!category) throw new AppError(404, "PORTFOLIO_CATEGORY_NOT_FOUND", "Portfolio category not found");
    }
    if (base === "portfolios") {
      const existingSlug = await prisma.portfolio.findFirst({ where: { websiteId: website.id, slug: (data as any).slug } });
      if (existingSlug) throw new AppError(409, "PORTFOLIO_SLUG_EXISTS", "Portfolio slug already exists for this website");
    }
    const row = await (model as any).create({ data: { ...data, websiteId: website.id }, ...(include ? { include } : {}) });
    await createAuditLog(request, {
      action: `${base}.created`,
      actor: user,
      websiteId: website.id,
      entityType: base,
      entityId: row.id,
      summary: `${base} item created`,
      metadata: { title: row.title || row.name || null }
    });
    return ok(reply, row, `${base} created`, 201);
  });
  app.get(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const row = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id }, ...(include ? { include } : {}) });
    if (!row) throw new AppError(404, "ITEM_NOT_FOUND", "Item not found");
    return ok(reply, row, `${base} loaded`);
  });
  app.patch(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = (schema as any).partial().parse(request.body);
    const data = base === "portfolios" ? body : { ...body, categoryId: undefined };
    const existing = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id } });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Item not found");
    if (base === "portfolios" && data.categoryId) {
      const category = await prisma.portfolioCategory.findFirst({ where: { id: data.categoryId, websiteId: website.id } });
      if (!category) throw new AppError(404, "PORTFOLIO_CATEGORY_NOT_FOUND", "Portfolio category not found");
    }
    if (base === "portfolios" && (data as any).slug && (data as any).slug !== existing.slug) {
      const existingSlug = await prisma.portfolio.findFirst({ where: { websiteId: website.id, slug: (data as any).slug, id: { not: existing.id } } });
      if (existingSlug) throw new AppError(409, "PORTFOLIO_SLUG_EXISTS", "Portfolio slug already exists for this website");
    }
    const row = await (model as any).update({ where: { id: existing.id }, data, ...(include ? { include } : {}) });
    await createAuditLog(request, {
      action: `${base}.updated`,
      actor: user,
      websiteId: website.id,
      entityType: base,
      entityId: row.id,
      summary: `${base} item updated`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, row, `${base} updated`);
  });
  app.delete(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const existing = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id } });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Item not found");
    await (model as any).delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: `${base}.deleted`,
      actor: user,
      websiteId: website.id,
      entityType: base,
      entityId: existing.id,
      summary: `${base} item deleted`,
      metadata: { title: existing.title || existing.name || null }
    });
    return ok(reply, true, `${base} deleted`);
  });
};

const registerProductRoutes = () => {
  const productInclude = {
    category: true,
    images: { orderBy: { sortOrder: "asc" as const } },
    variants: { orderBy: { sortOrder: "asc" as const } },
    reviews: { orderBy: { sortOrder: "asc" as const } }
  };

  const getOwnedProduct = async (request: Req, websiteId: string) => {
    const product = await prisma.product.findFirst({ where: { id: request.params?.productId, websiteId } });
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
    return product;
  };

  app.get("/api/v1/websites/:websiteId/products", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
    const query = (request.query || {}) as Record<string, unknown>;
    const where: any = { websiteId: website.id };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.isFeatured === "true") where.isFeatured = true;
    if (query.isNewArrival === "true") where.isNewArrival = true;
    const [rows, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }], include: productInclude, skip, take }),
      prisma.product.count({ where })
    ]);
    return paginated(reply, rows.map(productContract), buildPaginationMeta(page, pageSize, total), "Products loaded");
  });

  app.post("/api/v1/websites/:websiteId/products", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = productBody.parse(request.body);
    if (body.categoryId) {
      const category = await prisma.productCategory.findFirst({ where: { id: body.categoryId, websiteId: website.id } });
      if (!category) throw new AppError(404, "PRODUCT_CATEGORY_NOT_FOUND", "Product category not found");
    }
    const existingSlug = await prisma.product.findFirst({ where: { websiteId: website.id, slug: body.slug } });
    if (existingSlug) throw new AppError(409, "PRODUCT_SLUG_EXISTS", "Product slug already exists for this website");
    const row = await prisma.product.create({ data: { ...body, websiteId: website.id }, include: productInclude });
    await createAuditLog(request, {
      action: "product.created",
      actor: user,
      websiteId: website.id,
      entityType: "product",
      entityId: row.id,
      summary: `Product created: ${row.title}`,
      metadata: { slug: row.slug }
    });
    return created(reply, productContract(row), "Product created");
  });

  app.get("/api/v1/websites/:websiteId/products/:productId", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const row = await prisma.product.findFirst({ where: { id: request.params?.productId, websiteId: website.id }, include: productInclude });
    if (!row) throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
    return ok(reply, productContract(row), "Product loaded");
  });

  app.patch("/api/v1/websites/:websiteId/products/:productId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = productBody.partial().parse(request.body);
    const existing = await getOwnedProduct(request, website.id);
    if (body.categoryId) {
      const category = await prisma.productCategory.findFirst({ where: { id: body.categoryId, websiteId: website.id } });
      if (!category) throw new AppError(404, "PRODUCT_CATEGORY_NOT_FOUND", "Product category not found");
    }
    if (body.slug && body.slug !== existing.slug) {
      const existingSlug = await prisma.product.findFirst({ where: { websiteId: website.id, slug: body.slug, id: { not: existing.id } } });
      if (existingSlug) throw new AppError(409, "PRODUCT_SLUG_EXISTS", "Product slug already exists for this website");
    }
    const row = await prisma.product.update({ where: { id: existing.id }, data: body, include: productInclude });
    await createAuditLog(request, {
      action: "product.updated",
      actor: user,
      websiteId: website.id,
      entityType: "product",
      entityId: row.id,
      summary: `Product updated: ${row.title}`,
      metadata: { changedFields: Object.keys(body), oldSlug: existing.slug, newSlug: row.slug }
    });
    return ok(reply, productContract(row), "Product updated");
  });

  app.delete("/api/v1/websites/:websiteId/products/:productId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const existing = await getOwnedProduct(request, website.id);
    await prisma.product.delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: "product.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "product",
      entityId: existing.id,
      summary: `Product deleted: ${existing.title}`,
      metadata: { slug: existing.slug }
    });
    return ok(reply, true, "Product deleted");
  });

  // --- Nested: Product Images ---
  app.get("/api/v1/websites/:websiteId/products/:productId/images", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const rows = await prisma.productImage.findMany({ where: { productId: product.id }, orderBy: { sortOrder: "asc" } });
    return ok(reply, rows.map(productImageContract), "Product images loaded");
  });

  app.post("/api/v1/websites/:websiteId/products/:productId/images", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const body = productImageBody.parse(request.body);
    const row = await prisma.productImage.create({ data: { ...body, productId: product.id } });
    await createAuditLog(request, {
      action: "product_image.created",
      actor: user,
      websiteId: website.id,
      entityType: "product_image",
      entityId: row.id,
      summary: `Product image added for ${product.title}`,
      metadata: { productId: product.id }
    });
    return created(reply, productImageContract(row), "Product image created");
  });

  app.patch("/api/v1/websites/:websiteId/products/:productId/images/:imageId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const body = productImageBody.partial().parse(request.body);
    const existing = await prisma.productImage.findFirst({ where: { id: request.params?.imageId, productId: product.id } });
    if (!existing) throw new AppError(404, "PRODUCT_IMAGE_NOT_FOUND", "Product image not found");
    const row = await prisma.productImage.update({ where: { id: existing.id }, data: body });
    await createAuditLog(request, {
      action: "product_image.updated",
      actor: user,
      websiteId: website.id,
      entityType: "product_image",
      entityId: row.id,
      summary: `Product image updated for ${product.title}`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, productImageContract(row), "Product image updated");
  });

  app.delete("/api/v1/websites/:websiteId/products/:productId/images/:imageId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const existing = await prisma.productImage.findFirst({ where: { id: request.params?.imageId, productId: product.id } });
    if (!existing) throw new AppError(404, "PRODUCT_IMAGE_NOT_FOUND", "Product image not found");
    await prisma.productImage.delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: "product_image.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "product_image",
      entityId: existing.id,
      summary: `Product image deleted for ${product.title}`,
      metadata: { productId: product.id }
    });
    return ok(reply, true, "Product image deleted");
  });

  // --- Nested: Product Variants ---
  app.get("/api/v1/websites/:websiteId/products/:productId/variants", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const rows = await prisma.productVariant.findMany({ where: { productId: product.id }, orderBy: { sortOrder: "asc" } });
    return ok(reply, rows.map(productVariantContract), "Product variants loaded");
  });

  app.post("/api/v1/websites/:websiteId/products/:productId/variants", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const body = productVariantBody.parse(request.body);
    const row = await prisma.productVariant.create({ data: { ...body, productId: product.id } });
    await createAuditLog(request, {
      action: "product_variant.created",
      actor: user,
      websiteId: website.id,
      entityType: "product_variant",
      entityId: row.id,
      summary: `Product variant added for ${product.title}: ${row.name}`,
      metadata: { productId: product.id }
    });
    return created(reply, productVariantContract(row), "Product variant created");
  });

  app.patch("/api/v1/websites/:websiteId/products/:productId/variants/:variantId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const body = productVariantBody.partial().parse(request.body);
    const existing = await prisma.productVariant.findFirst({ where: { id: request.params?.variantId, productId: product.id } });
    if (!existing) throw new AppError(404, "PRODUCT_VARIANT_NOT_FOUND", "Product variant not found");
    const row = await prisma.productVariant.update({ where: { id: existing.id }, data: body });
    await createAuditLog(request, {
      action: "product_variant.updated",
      actor: user,
      websiteId: website.id,
      entityType: "product_variant",
      entityId: row.id,
      summary: `Product variant updated for ${product.title}: ${row.name}`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, productVariantContract(row), "Product variant updated");
  });

  app.delete("/api/v1/websites/:websiteId/products/:productId/variants/:variantId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const existing = await prisma.productVariant.findFirst({ where: { id: request.params?.variantId, productId: product.id } });
    if (!existing) throw new AppError(404, "PRODUCT_VARIANT_NOT_FOUND", "Product variant not found");
    await prisma.productVariant.delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: "product_variant.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "product_variant",
      entityId: existing.id,
      summary: `Product variant deleted for ${product.title}: ${existing.name}`,
      metadata: { productId: product.id }
    });
    return ok(reply, true, "Product variant deleted");
  });

  // --- Nested: Product Reviews ---
  app.get("/api/v1/websites/:websiteId/products/:productId/reviews", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const rows = await prisma.productReview.findMany({ where: { productId: product.id }, orderBy: { sortOrder: "asc" } });
    return ok(reply, rows.map(productReviewContract), "Product reviews loaded");
  });

  app.post("/api/v1/websites/:websiteId/products/:productId/reviews", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const body = productReviewBody.parse(request.body);
    const row = await prisma.productReview.create({ data: { ...body, productId: product.id } });
    await createAuditLog(request, {
      action: "product_review.created",
      actor: user,
      websiteId: website.id,
      entityType: "product_review",
      entityId: row.id,
      summary: `Product review added for ${product.title} by ${row.customerName}`,
      metadata: { productId: product.id, rating: row.rating }
    });
    return created(reply, productReviewContract(row), "Product review created");
  });

  app.patch("/api/v1/websites/:websiteId/products/:productId/reviews/:reviewId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const body = productReviewBody.partial().parse(request.body);
    const existing = await prisma.productReview.findFirst({ where: { id: request.params?.reviewId, productId: product.id } });
    if (!existing) throw new AppError(404, "PRODUCT_REVIEW_NOT_FOUND", "Product review not found");
    const row = await prisma.productReview.update({ where: { id: existing.id }, data: body });
    await createAuditLog(request, {
      action: "product_review.updated",
      actor: user,
      websiteId: website.id,
      entityType: "product_review",
      entityId: row.id,
      summary: `Product review updated for ${product.title}`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, productReviewContract(row), "Product review updated");
  });

  app.delete("/api/v1/websites/:websiteId/products/:productId/reviews/:reviewId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const product = await getOwnedProduct(request, website.id);
    const existing = await prisma.productReview.findFirst({ where: { id: request.params?.reviewId, productId: product.id } });
    if (!existing) throw new AppError(404, "PRODUCT_REVIEW_NOT_FOUND", "Product review not found");
    await prisma.productReview.delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: "product_review.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "product_review",
      entityId: existing.id,
      summary: `Product review deleted for ${product.title}`,
      metadata: { productId: product.id }
    });
    return ok(reply, true, "Product review deleted");
  });
};

const articleData = (body: z.infer<typeof articleBody>, existing?: { publishedAt: Date | null }) => ({
  categoryId: body.categoryId || null,
  title: body.title,
  slug: body.slug,
  excerpt: body.excerpt || null,
  content: body.content,
  coverImageUrl: body.coverImageUrl || null,
  seoTitle: body.seoTitle || null,
  seoDescription: body.seoDescription || null,
  status: body.status || "draft",
  sortOrder: body.sortOrder ?? 0,
  isFeatured: body.isFeatured ?? false,
  featuredOrder: body.featuredOrder ?? 0,
  publishedAt: body.status === "published" ? existing?.publishedAt || new Date() : null
});

const registerArticleRoutes = () => {
  app.get("/api/v1/websites/:websiteId/articles", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
    const where = { websiteId: website.id };
    const [articles, total] = await Promise.all([
      prisma.article.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { category: true }, skip, take }),
      prisma.article.count({ where })
    ]);
    return paginated(reply, articles.map(articleContract), buildPaginationMeta(page, pageSize, total), "Articles loaded");
  });
  app.post("/api/v1/websites/:websiteId/articles", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = articleBody.parse(request.body);
    const existingSlug = await prisma.article.findUnique({ where: { websiteId_slug: { websiteId: website.id, slug: body.slug } } });
    if (existingSlug) throw new AppError(409, "ARTICLE_SLUG_EXISTS", "Article slug already exists for this website");
    if (body.categoryId) {
      const category = await prisma.articleCategory.findFirst({ where: { id: body.categoryId, websiteId: website.id } });
      if (!category) throw new AppError(404, "ARTICLE_CATEGORY_NOT_FOUND", "Article category not found");
    }
    const article = await prisma.article.create({ data: { ...articleData(body), websiteId: website.id }, include: { category: true } });
    await createAuditLog(request, {
      action: "article.created",
      actor: user,
      websiteId: website.id,
      entityType: "article",
      entityId: article.id,
      summary: `Article created: ${article.title}`,
      metadata: { slug: article.slug, status: article.status }
    });
    return created(reply, articleContract(article), "Article created");
  });
  app.get("/api/v1/websites/:websiteId/articles/:articleId", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const article = await prisma.article.findFirst({ where: { id: request.params?.articleId, websiteId: website.id }, include: { category: true } });
    if (!article) throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found");
    return ok(reply, articleContract(article), "Article loaded");
  });
  app.patch("/api/v1/websites/:websiteId/articles/:articleId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = articleBody.partial().parse(request.body);
    const article = await prisma.article.findFirst({ where: { id: request.params?.articleId, websiteId: website.id }, include: { category: true } });
    if (!article) throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found");
    if (body.slug && body.slug !== article.slug) {
      const existingSlug = await prisma.article.findUnique({ where: { websiteId_slug: { websiteId: website.id, slug: body.slug } } });
      if (existingSlug) throw new AppError(409, "ARTICLE_SLUG_EXISTS", "Article slug already exists for this website");
    }
    if (body.categoryId) {
      const category = await prisma.articleCategory.findFirst({ where: { id: body.categoryId, websiteId: website.id } });
      if (!category) throw new AppError(404, "ARTICLE_CATEGORY_NOT_FOUND", "Article category not found");
    }
    const status = body.status || article.status;
    const updated = await prisma.article.update({
      where: { id: article.id },
      data: {
        categoryId: body.categoryId,
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImageUrl: body.coverImageUrl,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        status,
        sortOrder: body.sortOrder,
        isFeatured: body.isFeatured,
        featuredOrder: body.featuredOrder,
        publishedAt: status === "published" ? article.publishedAt || new Date() : null
      },
      include: { category: true }
    });
    await createAuditLog(request, {
      action: "article.updated",
      actor: user,
      websiteId: website.id,
      entityType: "article",
      entityId: updated.id,
      summary: `Article updated: ${updated.title}`,
      metadata: { changedFields: Object.keys(body), oldSlug: article.slug, newSlug: updated.slug, status: updated.status }
    });
    return ok(reply, articleContract(updated), "Article updated");
  });
  app.delete("/api/v1/websites/:websiteId/articles/:articleId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const article = await prisma.article.findFirst({ where: { id: request.params?.articleId, websiteId: website.id }, include: { category: true } });
    if (!article) throw new AppError(404, "ARTICLE_NOT_FOUND", "Article not found");
    await prisma.article.delete({ where: { id: article.id } });
    await createAuditLog(request, {
      action: "article.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "article",
      entityId: article.id,
      summary: `Article deleted: ${article.title}`,
      metadata: { slug: article.slug }
    });
    return ok(reply, true, "Article deleted");
  });
};


const registerStage9cContentRoutes = () => {
  const categoryRoutes = (
    base: "article-categories" | "portfolio-categories" | "product-categories",
    model: typeof prisma.articleCategory | typeof prisma.portfolioCategory | typeof prisma.productCategory,
    entityType: "article_category" | "portfolio_category" | "product_category"
  ) => {
    const idParam = base === "article-categories" ? "articleCategoryId" : base === "portfolio-categories" ? "portfolioCategoryId" : "productCategoryId";

    app.get(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
      const { website } = await getWebsiteForAccess(request);
      const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
      const where = { websiteId: website.id };
      const [rows, total] = await Promise.all([
        (model as any).findMany({ where, orderBy: { sortOrder: "asc" }, skip, take }),
        (model as any).count({ where })
      ]);
      return paginated(reply, rows.map(categoryContract), buildPaginationMeta(page, pageSize, total), `${base} loaded`);
    });

    app.post(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const body = categoryBody.parse(request.body);
      const exists = await (model as any).findFirst({ where: { websiteId: website.id, slug: body.slug } });
      if (exists) throw new AppError(409, "CATEGORY_SLUG_EXISTS", "Category slug already exists for this website");
      const row = await (model as any).create({ data: { ...body, websiteId: website.id } });
      await createAuditLog(request, {
        action: `${entityType}.created`,
        actor: user,
        websiteId: website.id,
        entityType,
        entityId: row.id,
        summary: `${entityType} created: ${row.name}`,
        metadata: { slug: row.slug }
      });
      return created(reply, categoryContract(row), `${base} created`);
    });

    app.patch(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const body = categoryBody.partial().parse(request.body);
      const existing = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id } });
      if (!existing) throw new AppError(404, "CATEGORY_NOT_FOUND", "Category not found");
      if (body.slug && body.slug !== existing.slug) {
        const exists = await (model as any).findFirst({ where: { websiteId: website.id, slug: body.slug } });
        if (exists) throw new AppError(409, "CATEGORY_SLUG_EXISTS", "Category slug already exists for this website");
      }
      const row = await (model as any).update({ where: { id: existing.id }, data: body });
      await createAuditLog(request, {
        action: `${entityType}.updated`,
        actor: user,
        websiteId: website.id,
        entityType,
        entityId: row.id,
        summary: `${entityType} updated: ${row.name}`,
        metadata: { changedFields: Object.keys(body), oldSlug: existing.slug, newSlug: row.slug }
      });
      return ok(reply, categoryContract(row), `${base} updated`);
    });

    app.delete(`/api/v1/websites/:websiteId/${base}/:${idParam}`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const existing = await (model as any).findFirst({ where: { id: request.params?.[idParam], websiteId: website.id } });
      if (!existing) throw new AppError(404, "CATEGORY_NOT_FOUND", "Category not found");
      await (model as any).delete({ where: { id: existing.id } });
      await createAuditLog(request, {
        action: `${entityType}.deleted`,
        actor: user,
        websiteId: website.id,
        entityType,
        entityId: existing.id,
        summary: `${entityType} deleted: ${existing.name}`,
        metadata: { slug: existing.slug }
      });
      return ok(reply, true, `${base} deleted`);
    });
  };

  categoryRoutes("article-categories", prisma.articleCategory, "article_category");
  categoryRoutes("portfolio-categories", prisma.portfolioCategory, "portfolio_category");
  categoryRoutes("product-categories", prisma.productCategory, "product_category");

  app.get("/api/v1/websites/:websiteId/faqs", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const pageKey = request.query?.pageKey;
    const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
    const where = { websiteId: website.id, ...(pageKey ? { pageKey } : {}) };
    const [faqs, total] = await Promise.all([
      prisma.faq.findMany({ where, orderBy: { sortOrder: "asc" }, skip, take }),
      prisma.faq.count({ where })
    ]);
    return paginated(reply, faqs.map((f) => faqContract(f, website.websiteType)), buildPaginationMeta(page, pageSize, total), "FAQs loaded");
  });

  app.post("/api/v1/websites/:websiteId/faqs", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = faqBody.parse(request.body);
    const faq = await prisma.faq.create({ data: { ...body, websiteId: website.id } });
    await createAuditLog(request, {
      action: "faq.created",
      actor: user,
      websiteId: website.id,
      entityType: "faq",
      entityId: faq.id,
      summary: `FAQ created: ${faq.question}`,
      metadata: { pageKey: faq.pageKey }
    });
    return created(reply, faqContract(faq, website.websiteType), "FAQ created");
  });

  app.patch("/api/v1/websites/:websiteId/faqs/:faqId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = faqBody.partial().parse(request.body);
    const existing = await prisma.faq.findFirst({ where: { id: request.params?.faqId, websiteId: website.id } });
    if (!existing) throw new AppError(404, "FAQ_NOT_FOUND", "FAQ not found");
    const faq = await prisma.faq.update({ where: { id: existing.id }, data: body });
    await createAuditLog(request, {
      action: "faq.updated",
      actor: user,
      websiteId: website.id,
      entityType: "faq",
      entityId: faq.id,
      summary: `FAQ updated: ${faq.question}`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, faqContract(faq, website.websiteType), "FAQ updated");
  });

  app.delete("/api/v1/websites/:websiteId/faqs/:faqId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const existing = await prisma.faq.findFirst({ where: { id: request.params?.faqId, websiteId: website.id } });
    if (!existing) throw new AppError(404, "FAQ_NOT_FOUND", "FAQ not found");
    await prisma.faq.delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: "faq.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "faq",
      entityId: existing.id,
      summary: `FAQ deleted: ${existing.question}`,
      metadata: { pageKey: existing.pageKey }
    });
    return ok(reply, true, "FAQ deleted");
  });

  app.get("/api/v1/websites/:websiteId/media", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
    const where = { websiteId: website.id };
    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.mediaAsset.count({ where })
    ]);
    return paginated(reply, assets.map(mediaAssetContract), buildPaginationMeta(page, pageSize, total), "Media assets loaded");
  });

  app.post("/api/v1/websites/:websiteId/media", { config: { rateLimit: apiConfig.rateLimits.templateUpload } }, async (request, reply) => {
    const { user, website } = await getWebsiteForAccess(request as any);

    // Kuota storage berlaku per-akun owner (akumulasi lintas semua website
    // milik owner tsb), bukan per-website. Dicek di awal biar gagal cepat
    // kalau kuota sudah penuh, sebelum sempat baca stream file sama sekali.
    const [ownerUsedBytes, ownerQuotaBytes] = await Promise.all([
      getOwnerStorageUsageBytes(website.ownerId),
      getOwnerStorageQuotaBytes(website.ownerId)
    ]);
    const ownerRemainingBytes = ownerQuotaBytes - ownerUsedBytes;
    if (ownerRemainingBytes <= 0) {
      throw new AppError(
        413,
        "STORAGE_QUOTA_EXCEEDED",
        `Kuota storage akun sudah penuh (${Math.round(ownerQuotaBytes / 1024 / 1024)} MB terpakai semua). Hapus media lama atau hubungi admin untuk menambah kuota.`
      );
    }

    const allowed = new Map([
      ["image/jpeg", "jpg"],
      ["image/png", "png"],
      ["image/webp", "webp"],
      ["image/gif", "gif"]
    ]);

    let uploadedFile: { buffer: Buffer; filename: string; mimetype: string } | null = null;
    let altText: string | null = null;

    try {
      for await (const part of (request as any).parts()) {
        if (part.type === "field" && part.fieldname === "altText") {
          const value = String(part.value || "").trim();
          altText = value ? value.slice(0, 300) : null;
          continue;
        }

        if (part.type !== "file" || part.fieldname !== "file") {
          continue;
        }

        if (uploadedFile) {
          throw new AppError(400, "MEDIA_ONLY_ONE_FILE", "Upload satu gambar saja dalam satu waktu");
        }

        const ext = allowed.get(part.mimetype);
        if (!ext) {
          throw new AppError(400, "MEDIA_TYPE_NOT_ALLOWED", "Format gambar yang didukung hanya JPG, PNG, WEBP, dan GIF");
        }

        const chunks: Buffer[] = [];
        let totalBytes = 0;
        for await (const chunk of part.file) {
          const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          totalBytes += bufferChunk.length;
          if (totalBytes > apiConfig.templateUploadMaxBytes) {
            throw new AppError(413, "MEDIA_TOO_LARGE", `Ukuran gambar maksimal ${Math.round(apiConfig.templateUploadMaxBytes / 1024 / 1024)} MB`);
          }
          if (totalBytes > ownerRemainingBytes) {
            throw new AppError(
              413,
              "STORAGE_QUOTA_EXCEEDED",
              `Sisa kuota storage akun tinggal ${(ownerRemainingBytes / 1024 / 1024).toFixed(1)} MB, file ini melebihi sisa kuota tersebut.`
            );
          }
          chunks.push(bufferChunk);
        }

        uploadedFile = {
          buffer: Buffer.concat(chunks),
          filename: part.filename || `media.${ext}`,
          mimetype: part.mimetype
        };
      }
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      if (error?.code === "FST_REQ_FILE_TOO_LARGE" || error?.message?.toLowerCase?.().includes("request file too large")) {
        throw new AppError(413, "MEDIA_TOO_LARGE", `Ukuran gambar maksimal ${Math.round(apiConfig.templateUploadMaxBytes / 1024 / 1024)} MB`);
      }
      throw error;
    }

    if (!uploadedFile) {
      throw new AppError(400, "MEDIA_FILE_REQUIRED", "Pilih file gambar terlebih dahulu");
    }

    // Semua gambar yang masuk (JPG/PNG/WEBP/GIF) dikonversi jadi WebP dan di-resize
    // supaya ringan. Lebar dibatasi 1600px (tanpa upscale gambar yang lebih kecil),
    // tinggi mengikuti rasio aslinya. GIF animasi tetap dipertahankan animasinya.
    const isAnimatedGif = uploadedFile.mimetype === "image/gif";
    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(uploadedFile.buffer, { animated: isAnimatedGif })
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      throw new AppError(400, "MEDIA_PROCESSING_FAILED", "Gagal memproses gambar. Pastikan file gambar tidak rusak.");
    }

    const ext = "webp";
    const id = randomToken("media");
    const filename = `${id}.${ext}`;
    const storageDir = path.join(process.cwd(), "storage", "uploads", "sites", website.id);
    const storagePath = path.join(storageDir, filename);
    await mkdir(storageDir, { recursive: true });
    await writeFile(storagePath, processedBuffer);

    const asset = await prisma.mediaAsset.create({
      data: {
        id,
        websiteId: website.id,
        filename,
        originalName: uploadedFile.filename,
        mimeType: "image/webp",
        sizeBytes: processedBuffer.length,
        url: `/api/v1/public/media/${id}`,
        altText,
        storagePath
      }
    });

    await createAuditLog(request, {
      action: "media.uploaded",
      actor: user,
      websiteId: website.id,
      entityType: "media_asset",
      entityId: asset.id,
      summary: `Media uploaded: ${asset.originalName}`,
      metadata: { mimeType: asset.mimeType, sizeBytes: asset.sizeBytes }
    });

    return created(reply, mediaAssetContract(asset), "Media uploaded");
  });

  app.patch("/api/v1/websites/:websiteId/media/:mediaId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = mediaUpdateBody.parse(request.body);
    const existing = await prisma.mediaAsset.findFirst({ where: { id: request.params?.mediaId, websiteId: website.id } });
    if (!existing) throw new AppError(404, "MEDIA_NOT_FOUND", "Media asset not found");
    const asset = await prisma.mediaAsset.update({ where: { id: existing.id }, data: body });
    await createAuditLog(request, {
      action: "media.updated",
      actor: user,
      websiteId: website.id,
      entityType: "media_asset",
      entityId: asset.id,
      summary: `Media updated: ${asset.originalName}`,
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, mediaAssetContract(asset), "Media updated");
  });

  app.delete("/api/v1/websites/:websiteId/media/:mediaId", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const existing = await prisma.mediaAsset.findFirst({ where: { id: request.params?.mediaId, websiteId: website.id } });
    if (!existing) throw new AppError(404, "MEDIA_NOT_FOUND", "Media asset not found");
    await prisma.mediaAsset.delete({ where: { id: existing.id } });
    await unlink(existing.storagePath).catch(() => undefined);
    await createAuditLog(request, {
      action: "media.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "media_asset",
      entityId: existing.id,
      summary: `Media deleted: ${existing.originalName}`,
      metadata: { filename: existing.filename }
    });
    return ok(reply, true, "Media deleted");
  });

  app.get("/api/v1/api/v1/public/media/:mediaId", async (request: Req, reply) => {
    return reply
      .code(301)
      .header("Location", `/api/v1/public/media/${request.params?.mediaId}`)
      .send();
  });

  app.get("/api/v1/public/media/:mediaId", async (request: Req, reply) => {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: request.params?.mediaId } });
    if (!asset) throw new AppError(404, "MEDIA_NOT_FOUND", "Media asset not found");

    try {
      const buffer = await readFile(asset.storagePath);
      return reply
        .header("Cache-Control", "public, max-age=2592000")
        .type(asset.mimeType)
        .send(buffer);
    } catch {
      throw new AppError(404, "MEDIA_FILE_MISSING", "File media tidak ditemukan di storage. Cek volume/folder upload backend.");
    }
  });
};


const registerPublicRoutes = () => {
  app.get("/api/v1/public/sites/:slug", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
    return ok(reply, await buildPublicPage(website.id, { pageKey: "home" }, { publicOnly: true }), "Public page loaded");
  });
  app.get("/api/v1/public/sites/:slug/pages/:pageSlug", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
    const requestedSlug = cleanPageSlug(request.params?.pageSlug || "");
    const page = await prisma.websitePage.findFirst({ where: { websiteId: website.id, slug: requestedSlug, isPublished: true } });
    if (!page) {
      const redirect = await prisma.websitePageSlugHistory.findFirst({
        where: { websiteId: website.id, oldSlug: requestedSlug },
        orderBy: { createdAt: "desc" }
      });
      if (redirect) {
        return ok(reply, {
          redirect: {
            type: redirect.redirectType,
            from: redirect.oldSlug ? `/${redirect.oldSlug}` : "/",
            to: redirect.newSlug ? `/${redirect.newSlug}` : "/"
          }
        }, "Page redirect found");
      }
    }
    return ok(reply, await buildPublicPage(website.id, { slug: requestedSlug }, { publicOnly: true }), "Public page loaded");
  });
  app.get("/api/v1/public/sites/:slug/articles", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" }, include: { businessProfile: true } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
    const articles = await prisma.article.findMany({
      where: { websiteId: website.id, status: "published" },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
      include: { category: true }
    });
    return ok(reply, articles.map(publicArticleSummary), "Public articles loaded");
  });
  app.get("/api/v1/public/sites/:slug/articles/:articleSlug", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" }, include: { businessProfile: true } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
    const article = await prisma.article.findFirst({
      where: { websiteId: website.id, slug: request.params?.articleSlug, status: "published" },
      include: { category: true }
    });
    if (!article) throw new AppError(404, "ARTICLE_NOT_FOUND", "Published article not found");
    const sameCategoryArticles = article.categoryId
      ? await prisma.article.findMany({
        where: { websiteId: website.id, status: "published", id: { not: article.id }, categoryId: article.categoryId },
        orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
        take: 3,
        include: { category: true }
      })
      : [];
    const fallbackArticles = sameCategoryArticles.length < 3
      ? await prisma.article.findMany({
        where: {
          websiteId: website.id,
          status: "published",
          id: { notIn: [article.id, ...sameCategoryArticles.map((item: any) => item.id)] }
        },
        orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
        take: 3 - sameCategoryArticles.length,
        include: { category: true }
      })
      : [];
    const relatedArticles = [...sameCategoryArticles, ...fallbackArticles].slice(0, 3);
    const articleDetailPage = await buildPublicPage(website.id, { pageKey: "article_detail" }).catch(() => null);
    return ok(reply, {
      article: articleContract(article),
      relatedArticles: relatedArticles.map(publicArticleSummary),
      articleDetailSections: articleDetailPage?.page?.sections || [],
      website: websiteSummary(website),
      businessProfile: website.businessProfile,
      seo: {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt || website.businessProfile?.description || website.name
      },
      trackingKey: website.trackingKey,
      navigation: await buildNavigationContract(website.id, website.websiteType)
    }, "Public article loaded");
  });
  app.get("/api/v1/public/sites/:slug/portfolios/:portfolioId", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" }, include: { businessProfile: true } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
    const identifier = request.params?.portfolioId;
    const portfolio =
      (await prisma.portfolio.findFirst({ where: { websiteId: website.id, slug: identifier, isActive: true }, include: { category: true } })) ||
      (await prisma.portfolio.findFirst({ where: { websiteId: website.id, id: identifier, isActive: true }, include: { category: true } }));
    if (!portfolio) throw new AppError(404, "PORTFOLIO_NOT_FOUND", "Published portfolio not found");

    const sameCategoryPortfolios = portfolio.categoryId
      ? await prisma.portfolio.findMany({
        where: { websiteId: website.id, isActive: true, id: { not: portfolio.id }, categoryId: portfolio.categoryId },
        orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }],
        take: 3,
        include: { category: true }
      })
      : [];
    const fallbackPortfolios = sameCategoryPortfolios.length < 3
      ? await prisma.portfolio.findMany({
        where: {
          websiteId: website.id,
          isActive: true,
          id: { notIn: [portfolio.id, ...sameCategoryPortfolios.map((item: any) => item.id)] }
        },
        orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }],
        take: 3 - sameCategoryPortfolios.length,
        include: { category: true }
      })
      : [];
    const relatedPortfolios = [...sameCategoryPortfolios, ...fallbackPortfolios].slice(0, 3);
    const portfolioDetailPage = await buildPublicPage(website.id, { pageKey: "portfolio_detail" }).catch(() => null);

    return ok(reply, {
      portfolio: portfolioContract(portfolio),
      relatedPortfolios: relatedPortfolios.map(publicPortfolioSummary),
      portfolioDetailSections: portfolioDetailPage?.page?.sections || [],
      website: websiteSummary(website),
      businessProfile: website.businessProfile,
      seo: {
        title: portfolio.title,
        description: portfolio.description || website.businessProfile?.description || website.name
      },
      trackingKey: website.trackingKey,
      navigation: await buildNavigationContract(website.id, website.websiteType)
    }, "Public portfolio loaded");
  });
  // Daftar produk publik (Product Grid di halaman "products") — dipaginasi + bisa
  // difilter kategori/rentang harga dan diurutkan, niru pola paginated di
  // registerProductRoutes (admin) tapi hanya untuk produk isActive milik website published.
  app.get("/api/v1/public/sites/:slug/products", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
    const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
    const query = (request.query || {}) as Record<string, unknown>;
    const where: any = { websiteId: website.id, isActive: true };
    if (query.categoryId) where.categoryId = query.categoryId;
    const search = String(query.q || "").trim();
    if (search) where.title = { contains: search, mode: "insensitive" };
    const minPrice = Number(query.minPrice);
    const maxPrice = Number(query.maxPrice);
    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      where.price = {};
      if (Number.isFinite(minPrice)) where.price.gte = minPrice;
      if (Number.isFinite(maxPrice)) where.price.lte = maxPrice;
    }
    const sort = String(query.sort || "featured");
    const orderBy =
      sort === "price_asc" ? [{ price: "asc" as const }] :
      sort === "price_desc" ? [{ price: "desc" as const }] :
      sort === "newest" ? [{ createdAt: "desc" as const }] :
      [{ isFeatured: "desc" as const }, { featuredOrder: "asc" as const }, { sortOrder: "asc" as const }];
    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { category: true, images: { orderBy: { sortOrder: "asc" } } }
      }),
      prisma.product.count({ where })
    ]);
    return paginated(reply, rows.map(productContract), buildPaginationMeta(page, pageSize, total), "Public products loaded");
  });
  app.get("/api/v1/public/sites/:slug/products/:productSlug", async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" }, include: { businessProfile: true } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
    const identifier = request.params?.productSlug;
    const productInclude = {
      category: true,
      images: { orderBy: { sortOrder: "asc" as const } },
      variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" as const } },
      reviews: { where: { isActive: true }, orderBy: { sortOrder: "asc" as const } }
    };
    const product =
      (await prisma.product.findFirst({ where: { websiteId: website.id, slug: identifier, isActive: true }, include: productInclude })) ||
      (await prisma.product.findFirst({ where: { websiteId: website.id, id: identifier, isActive: true }, include: productInclude }));
    if (!product) throw new AppError(404, "PRODUCT_NOT_FOUND", "Published product not found");

    const sameCategoryProducts = product.categoryId
      ? await prisma.product.findMany({
        where: { websiteId: website.id, isActive: true, id: { not: product.id }, categoryId: product.categoryId },
        orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }],
        take: 4,
        include: productInclude
      })
      : [];
    const fallbackProducts = sameCategoryProducts.length < 4
      ? await prisma.product.findMany({
        where: {
          websiteId: website.id,
          isActive: true,
          id: { notIn: [product.id, ...sameCategoryProducts.map((item: any) => item.id)] }
        },
        orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { sortOrder: "asc" }],
        take: 4 - sameCategoryProducts.length,
        include: productInclude
      })
      : [];
    const relatedProducts = [...sameCategoryProducts, ...fallbackProducts].slice(0, 4);
    const productDetailPage = await buildPublicPage(website.id, { pageKey: "product_detail" }).catch(() => null);

    return ok(reply, {
      product: productContract(product),
      relatedProducts: relatedProducts.map(productContract),
      productDetailSections: productDetailPage?.page?.sections || [],
      website: websiteSummary(website),
      businessProfile: website.businessProfile,
      seo: {
        title: product.title,
        description: product.shortDescription || product.description || website.businessProfile?.description || website.name
      },
      trackingKey: website.trackingKey,
      navigation: await buildNavigationContract(website.id, website.websiteType)
    }, "Public product loaded");
  });
  app.get("/api/v1/websites/:websiteId/preview/pages/:pageKey", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, { ...(await buildPublicPage(website.id, { pageKey: request.params?.pageKey || "home" })), isPreview: true }, "Preview page loaded");
  });
  app.post("/api/v1/public/tracking/events", { config: { rateLimit: apiConfig.rateLimits.tracking } }, async (request, reply) => {
    const body = trackingBody.parse(request.body);
    await recordTracking(request, body);
    return ok(reply, { accepted: true }, "Tracking event accepted", 202);
  });
  app.post("/api/v1/public/sites/:slug/contact", { config: { rateLimit: apiConfig.rateLimits.contact } }, async (request: Req, reply) => {
    const website = await prisma.website.findFirst({ where: { slug: request.params?.slug, status: "published" } });
    if (!website) throw new AppError(404, "WEBSITE_NOT_PUBLISHED", "Published site not found");
    if (website.lifecycleStatus !== "active") {
      throw new AppError(403, "WEBSITE_UNAVAILABLE", "Website ini sedang tidak aktif dan tidak dapat diakses publik.");
    }
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
    return created(reply, leadContract(lead, website.websiteType), "Lead created");
  });
};


const registerAuditRoutes = () => {
  app.get("/api/v1/internal/audit-logs", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);

    const query = request.query || {};
    const limit = Math.min(Math.max(Number(query.limit || 50), 1), 100);
    const page = Math.max(Number(query.page || 1), 1);
    const skip = (page - 1) * limit;
    const search = query.q?.trim();

    const where: Prisma.AuditLogWhereInput = {
      ...(query.category ? { category: query.category } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.websiteId ? { websiteId: query.websiteId } : {}),
      ...(query.actorUserId ? { actorUserId: query.actorUserId } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(search
        ? {
            OR: [
              { action: { contains: search, mode: "insensitive" } },
              { summary: { contains: search, mode: "insensitive" } },
              { entityType: { contains: search, mode: "insensitive" } },
              { actorRole: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { actor: true, website: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ]);

    return ok(reply, {
      items: items.map(auditLogContract),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    }, "Audit logs loaded");
  });

  app.get("/api/v1/internal/audit-logs/summary", async (request: Req, reply) => {
    await requireRole(request, ["internal_admin"]);

    const [total, security, audit, system, latest] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { category: "security" } }),
      prisma.auditLog.count({ where: { category: "audit" } }),
      prisma.auditLog.count({ where: { category: "system" } }),
      prisma.auditLog.findMany({
        include: { actor: true, website: true },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);

    return ok(reply, {
      total,
      categories: { security, audit, system },
      latest: latest.map(auditLogContract)
    }, "Audit log summary loaded");
  });
};

const registerLeadAndInsightRoutes = () => {
  app.get("/api/v1/websites/:websiteId/leads", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const leads = await prisma.lead.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "desc" } });
    return ok(reply, leads.map((l) => leadContract(l, website.websiteType)), "Leads loaded");
  });
  app.get("/api/v1/websites/:websiteId/leads/recent", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const leads = await prisma.lead.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "desc" }, take: 10 });
    return ok(reply, leads.map((l) => leadContract(l, website.websiteType)), "Recent leads loaded");
  });
  app.patch("/api/v1/websites/:websiteId/leads/:leadId/status", async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = z.object({ status: z.enum(LEAD_STATUS) }).parse(request.body);
    const lead = await prisma.lead.findFirst({ where: { id: request.params?.leadId, websiteId: website.id } });
    if (!lead) throw new AppError(404, "LEAD_NOT_FOUND", "Lead not found");
    const updatedLead = await prisma.lead.update({ where: { id: lead.id }, data: { status: body.status } });
    await createAuditLog(request, {
      action: "lead.status_updated",
      actor: user,
      websiteId: website.id,
      entityType: "lead",
      entityId: lead.id,
      summary: `Lead status updated to ${body.status}`,
      metadata: { oldStatus: lead.status, newStatus: body.status }
    });
    return ok(reply, leadContract(updatedLead, website.websiteType), "Lead status updated");
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

  const topPages = async (websiteId: string, websiteType: string = "company_profile") => {
    const rows = await prisma.trackingEvent.groupBy({
      by: ["pageKey", "pageSlug"],
      where: { websiteId, eventName: "page_view", pageKey: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { pageKey: "desc" } },
      take: 10
    });
    return rows.map((row) => ({
      pageKey: row.pageKey,
      pageLabel: row.pageKey ? getPageLabel(row.pageKey, websiteType) : null,
      pageSlug: row.pageSlug,
      total: row._count._all
    }));
  };

  const topSections = async (websiteId: string, websiteType: string = "company_profile") => {
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
      slotLabel: row.slotKey ? getSlotLabel(row.slotKey, websiteType) : null,
      sectionKey: row.sectionKey,
      sectionName: row.sectionKey ? nameByKey.get(row.sectionKey) || null : null,
      total: row._count._all
    }));
  };

  const topCtas = async (websiteId: string, websiteType: string = "company_profile") => {
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
      slotLabel: row.slotKey ? getSlotLabel(row.slotKey, websiteType) : null,
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
  const topArticles = async (websiteId: string) => {
    const rows = await prisma.trackingEvent.groupBy({
      by: ["objectId"],
      where: { websiteId, eventName: "article_view", objectId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { objectId: "desc" } },
      take: 10
    });
    const ids = rows.map((row) => row.objectId).filter(Boolean) as string[];
    const articles = await prisma.article.findMany({ where: { id: { in: ids } }, select: { id: true, title: true, slug: true } });
    const articleById = new Map(articles.map((article) => [article.id, article]));
    return rows.map((row) => {
      const article = row.objectId ? articleById.get(row.objectId) : null;
      return {
        articleId: row.objectId,
        title: article?.title || null,
        slug: article?.slug || null,
        total: row._count._all
      };
    });
  };
  app.get("/api/v1/websites/:websiteId/insights/summary", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const [visitors, totalPageViews, totalCtaClicks, totalWhatsappClicks, totalContactSubmits, topPageRows, topServiceRows, topPortfolioRows, topArticleRows] = await Promise.all([
      prisma.trackingEvent.findMany({ where: { websiteId: website.id, visitorId: { not: null } }, distinct: ["visitorId"], select: { visitorId: true } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "page_view" } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "cta_click" } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "whatsapp_click" } }),
      prisma.trackingEvent.count({ where: { websiteId: website.id, eventName: "contact_submit" } }),
      topBy(website.id, "pageKey", { eventName: "page_view" }),  // dipakai untuk highlights.topPage di atas
      topBy(website.id, "objectId", { eventName: "service_view", objectType: "service" }),
      topBy(website.id, "objectId", { eventName: "portfolio_view", objectType: "portfolio" }),
      topArticles(website.id)
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
          ? { label: "Halaman Paling Sering Dilihat", value: getPageLabel(topPageRows[0].pageKey, website.websiteType), total: topPageRows[0].total }
          : null,
        topService: topService
          ? { label: "Layanan Paling Diminati", value: topService.title, total: topServiceRows[0].total }
          : null,
        topPortfolio: topPortfolio
          ? { label: "Portfolio Paling Sering Dilihat", value: topPortfolio.title, total: topPortfolioRows[0].total }
          : null,
        topArticle: topArticleRows[0]
          ? { label: "Artikel Paling Sering Dibaca", value: topArticleRows[0].title, total: topArticleRows[0].total }
          : null
      }
    }, "Insight summary loaded");
  });
  app.get("/api/v1/websites/:websiteId/insights/top-pages", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, await topPages(website.id, website.websiteType), "Top pages loaded");
  });
  app.get("/api/v1/websites/:websiteId/insights/top-sections", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, await topSections(website.id, website.websiteType), "Top sections loaded");
  });
  app.get("/api/v1/websites/:websiteId/insights/top-ctas", async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    return ok(reply, await topCtas(website.id, website.websiteType), "Top CTAs loaded");
  });
  app.get("/api/v1/websites/:websiteId/insights/top-services", async (request: Req, reply) => ok(reply, await topObjects((await getWebsiteForAccess(request)).website.id, "service"), "Top services loaded"));
  app.get("/api/v1/websites/:websiteId/insights/top-portfolios", async (request: Req, reply) => ok(reply, await topObjects((await getWebsiteForAccess(request)).website.id, "portfolio"), "Top portfolios loaded"));
  app.get("/api/v1/websites/:websiteId/insights/top-articles", async (request: Req, reply) => ok(reply, await topArticles((await getWebsiteForAccess(request)).website.id), "Top articles loaded"));
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
  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error, requestId: request.id, method: request.method, url: request.url }, "request_error");
    const payload = toErrorPayload(error, request);
    reply.code(payload.statusCode).send(payload.body);
  });
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route ${request.method}:${request.url} not found`,
        details: {},
        requestId: request.id
      }
    });
  });
  registerCoreRoutes();
  registerAuthRoutes();
  registerInternalRoutes();
  registerWebsiteRoutes();
  registerSectionRoutes();
  registerTemplateRoutes();
  registerContentRoutes();
  registerCrud("services", listItemBody);
  registerCrud("portfolios", portfolioBody);
  registerCrud("testimonials", testimonialBody);
  registerCrud("brand-partners", brandBody);
  registerCrud("value-propositions", valuePropositionBody);
  registerCrud("banners", bannerBody);
  registerProductRoutes();

  const registerTimelineRoutes = () => {
    const base = "timelines";
    app.get(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
      const { website } = await getWebsiteForAccess(request);
      const rows = await prisma.businessTimeline.findMany({
        where: { websiteId: website.id },
        orderBy: { sortOrder: "asc" }
      });
      return ok(reply, rows, "timelines loaded");
    });

    app.post(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const body = timelineBody.parse(request.body);
      const row = await prisma.businessTimeline.create({
        data: { ...body, websiteId: website.id }
      });
      await createAuditLog(request, {
        action: "timelines.created",
        actor: user,
        websiteId: website.id,
        entityType: "timeline",
        entityId: row.id,
        summary: "Timeline item created",
        metadata: { year: row.year, title: row.title }
      });
      return ok(reply, row, "timeline created", 201);
    });

    app.get(`/api/v1/websites/:websiteId/${base}/:timelineId`, async (request: Req, reply) => {
      const { website } = await getWebsiteForAccess(request);
      const row = await prisma.businessTimeline.findFirst({
        where: { id: (request.params as any).timelineId, websiteId: website.id }
      });
      if (!row) throw new AppError(404, "ITEM_NOT_FOUND", "Timeline item not found");
      return ok(reply, row, "timeline loaded");
    });

    app.patch(`/api/v1/websites/:websiteId/${base}/:timelineId`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const body = timelineBody.partial().parse(request.body);
      const existing = await prisma.businessTimeline.findFirst({
        where: { id: (request.params as any).timelineId, websiteId: website.id }
      });
      if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Timeline item not found");
      const row = await prisma.businessTimeline.update({ where: { id: existing.id }, data: body });
      await createAuditLog(request, {
        action: "timelines.updated",
        actor: user,
        websiteId: website.id,
        entityType: "timeline",
        entityId: row.id,
        summary: "Timeline item updated",
        metadata: { changedFields: Object.keys(body) }
      });
      return ok(reply, row, "timeline updated");
    });

    app.delete(`/api/v1/websites/:websiteId/${base}/:timelineId`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const existing = await prisma.businessTimeline.findFirst({
        where: { id: (request.params as any).timelineId, websiteId: website.id }
      });
      if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Timeline item not found");
      await prisma.businessTimeline.delete({ where: { id: existing.id } });
      await createAuditLog(request, {
        action: "timelines.deleted",
        actor: user,
        websiteId: website.id,
        entityType: "timeline",
        entityId: existing.id,
        summary: "Timeline item deleted",
        metadata: { year: existing.year, title: existing.title }
      });
      return ok(reply, true, "timeline deleted");
    });
  };

  // --- Team Member CRUD ---
  const registerTeamMemberRoutes = () => {
    const base = "team-members";
    app.get(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
      const { website } = await getWebsiteForAccess(request);
      const { page, pageSize, skip, take } = parsePagination(request.query as Record<string, unknown>);
      const where = { websiteId: website.id };
      const [rows, total] = await Promise.all([
        prisma.teamMember.findMany({ where, orderBy: { sortOrder: "asc" }, skip, take }),
        prisma.teamMember.count({ where })
      ]);
      return paginated(reply, rows, buildPaginationMeta(page, pageSize, total), "team members loaded");
    });

    app.post(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const body = teamMemberBody.parse(request.body);
      const row = await prisma.teamMember.create({
        data: { ...body, websiteId: website.id }
      });
      await createAuditLog(request, {
        action: "team-members.created",
        actor: user,
        websiteId: website.id,
        entityType: "team_member",
        entityId: row.id,
        summary: "Team member created",
        metadata: { name: row.name }
      });
      return ok(reply, row, "team member created", 201);
    });

    app.get(`/api/v1/websites/:websiteId/${base}/:teamMemberId`, async (request: Req, reply) => {
      const { website } = await getWebsiteForAccess(request);
      const row = await prisma.teamMember.findFirst({
        where: { id: (request.params as any).teamMemberId, websiteId: website.id }
      });
      if (!row) throw new AppError(404, "ITEM_NOT_FOUND", "Team member not found");
      return ok(reply, row, "team member loaded");
    });

    app.patch(`/api/v1/websites/:websiteId/${base}/:teamMemberId`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const body = teamMemberBody.partial().parse(request.body);
      const existing = await prisma.teamMember.findFirst({
        where: { id: (request.params as any).teamMemberId, websiteId: website.id }
      });
      if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Team member not found");
      const row = await prisma.teamMember.update({ where: { id: existing.id }, data: body });
      await createAuditLog(request, {
        action: "team-members.updated",
        actor: user,
        websiteId: website.id,
        entityType: "team_member",
        entityId: row.id,
        summary: "Team member updated",
        metadata: { changedFields: Object.keys(body) }
      });
      return ok(reply, row, "team member updated");
    });

    app.delete(`/api/v1/websites/:websiteId/${base}/:teamMemberId`, async (request: Req, reply) => {
      const { user, website } = await getWebsiteForAccess(request);
      const existing = await prisma.teamMember.findFirst({
        where: { id: (request.params as any).teamMemberId, websiteId: website.id }
      });
      if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Team member not found");
      await prisma.teamMember.delete({ where: { id: existing.id } });
      await createAuditLog(request, {
        action: "team-members.deleted",
        actor: user,
        websiteId: website.id,
        entityType: "team_member",
        entityId: existing.id,
        summary: "Team member deleted",
        metadata: { name: existing.name }
      });
      return ok(reply, true, "team member deleted");
    });
  };

  registerTimelineRoutes();
  registerTeamMemberRoutes();

  registerArticleRoutes();
  registerStage9cContentRoutes();
  registerPublicRoutes();
  registerAuditRoutes();
  registerLeadAndInsightRoutes();
  return app;
};

if (process.env.NODE_ENV !== "test") {
  const port = apiConfig.port;
  buildApp()
    .then((server) => server.listen({ port, host: "0.0.0.0" }))
    .then(() => app.log.info({ port, runtimeMode: apiConfig.runtimeMode }, "api_started"))
    .catch(async (error) => {
      app.log.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
