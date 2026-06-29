import "dotenv/config";
import AdmZip from "adm-zip";
import { COMPANY_PROFILE_SECTION_SLOTS, WEBSITE_TYPE_PAGES, getSlotLabel } from "@lentera-pasar/shared";

const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.API_PORT || process.env.PORT || 4000}`;

type Json = { data?: any; message?: string; error?: { code: string; message: string; details: unknown } };

async function request(path: string, options: RequestInit = {}) {
  const method = options.method || "GET";
  const headers = {
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers
  });
  const json = (await response.json().catch(() => null)) as Json | null;
  if (!response.ok) {
    throw new Error(`${method} ${path} failed: ${response.status} ${JSON.stringify(json)}`);
  }
  if (!json || !("data" in json) || typeof json.message !== "string") {
    throw new Error(`${method} ${path} returned invalid success contract: ${JSON.stringify(json)}`);
  }
  return json;
}

async function requestMultipart(path: string, formData: FormData, token: string) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: formData
  });
  const json = (await response.json().catch(() => null)) as Json | null;
  if (!response.ok) {
    throw new Error(`POST ${path} failed: ${response.status} ${JSON.stringify(json)}`);
  }
  if (!json || !("data" in json) || typeof json.message !== "string") {
    throw new Error(`POST ${path} returned invalid success contract: ${JSON.stringify(json)}`);
  }
  return json;
}

async function expectStatus(path: string, status: number, options: RequestInit = {}) {
  const method = options.method || "GET";
  const headers = {
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers
  });
  const json = (await response.json().catch(() => null)) as Json | null;
  if (response.status !== status) {
    throw new Error(`${method} ${path} expected ${status}, got ${response.status}: ${JSON.stringify(json)}`);
  }
  if (!json?.error?.code) {
    throw new Error(`${method} ${path} returned invalid error contract: ${JSON.stringify(json)}`);
  }
  return json;
}

const auth = (token: string) => ({ authorization: `Bearer ${token}` });

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function pascal(value: string) {
  return value
    .split(/[_\-.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function buildTemplatePackZip(templatePackKey: string, options: { full: boolean; invalidSlot?: boolean }) {
  const zip = new AdmZip();
  zip.addFile(
    "manifest.json",
    Buffer.from(
      JSON.stringify({
        templatePackKey,
        websiteType: "company_profile",
        name: `Smoke Template Pack ${templatePackKey}`,
        theme: "formal",
        version: "1.0.0",
        description: "Smoke test template pack.",
        pages: WEBSITE_TYPE_PAGES.company_profile
      }),
      "utf8"
    )
  );
  const slots = options.full ? COMPANY_PROFILE_SECTION_SLOTS : COMPANY_PROFILE_SECTION_SLOTS.slice(0, 1);
  for (const slot of slots) {
    const slotKey = options.invalidSlot ? "home.invalid_slot" : slot.slotKey;
    zip.addFile(
      `sections/${slotKey}.smoke.json`,
      Buffer.from(
        JSON.stringify({
          sectionKey: `${templatePackKey}.${slotKey}.smoke`,
          slotKey,
          websiteType: "company_profile",
          pageKey: slot.pageKey,
          name: `${getSlotLabel(slot.slotKey)} Smoke`,
          component: `${pascal(slot.slotKey)}Section`,
          variant: "smoke",
          schema: [
            { key: "title", label: "Judul Utama", type: "text", required: true },
            { key: "subtitle", label: "Deskripsi Singkat", type: "textarea", required: false }
          ],
          defaultContent: {
            title: `${getSlotLabel(slot.slotKey)} Smoke`,
            subtitle: "Konten smoke template pack."
          }
        }),
        "utf8"
      )
    );
  }
  return zip.toBuffer();
}

async function importTemplatePack(templatePackKey: string, token: string, options: { full: boolean; invalidSlot?: boolean }) {
  const form = new FormData();
  const buffer = buildTemplatePackZip(templatePackKey, options);
  form.append("file", new Blob([buffer], { type: "application/zip" }), `${templatePackKey}.zip`);
  return requestMultipart("/api/v1/internal/template-packs/import-zip", form, token);
}

async function main() {
  const unique = Date.now();

  await request("/api/v1/health");

  const internalLogin = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "internal@lenterapasar.test", password: "password123" })
  });
  const internalToken = internalLogin.data.token;
  assert(internalLogin.data.user.role === "internal_admin", "Internal demo login did not return internal_admin");

  const ownerLogin = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "owner@lenterapasar.test", password: "password123" })
  });
  const ownerToken = ownerLogin.data.token;
  assert(ownerLogin.data.user.role === "owner_admin", "Owner demo login did not return owner_admin");

  await request("/api/v1/auth/me", { headers: auth(ownerToken) });
  await request("/api/v1/internal/owners", { headers: auth(internalToken) });
  await expectStatus("/api/v1/internal/owners", 403, { headers: auth(ownerToken) });

  const createdOwner = await request("/api/v1/internal/owners", {
    method: "POST",
    headers: auth(internalToken),
    body: JSON.stringify({
      name: `Smoke Owner ${unique}`,
      email: `smoke-owner-${unique}@lenterapasar.test`,
      password: "password123",
      whatsapp: "6281234567890"
    })
  });
  assert(createdOwner.data.whatsapp === "6281234567890", "Created owner missing whatsapp");
  const smokeOwnerLogin = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: `smoke-owner-${unique}@lenterapasar.test`, password: "password123" })
  });
  const smokeOwnerToken = smokeOwnerLogin.data.token;

  const initialWebsiteList = await request("/api/v1/websites", { headers: auth(smokeOwnerToken) });
  if (initialWebsiteList.data[0]) {
    assert("statusLabel" in initialWebsiteList.data[0], "Website list item missing statusLabel");
    assert("websiteTypeLabel" in initialWebsiteList.data[0], "Website list item missing websiteTypeLabel");
  }
  const website = await request(`/api/v1/internal/owners/${createdOwner.data.id}/websites`, {
    method: "POST",
    headers: auth(internalToken),
    body: JSON.stringify({
      name: `Smoke Company ${unique}`,
      slug: `smoke-company-${unique}`,
      websiteType: "company_profile"
    })
  });
  const websiteId = website.data.id;
  const slug = website.data.slug;
  const trackingKey = website.data.trackingKey;
  assert(website.data.statusLabel === "Draft", "Created website missing draft statusLabel");
  assert(website.data.websiteTypeLabel === "Company Profile", "Created website missing websiteTypeLabel");
  const primaryOwner = await request(`/api/v1/internal/owners/${createdOwner.data.id}/primary-website`, {
    method: "PATCH",
    headers: auth(internalToken),
    body: JSON.stringify({ websiteId })
  });
  assert(primaryOwner.data.primaryWebsiteId === websiteId, "Primary website was not set");

  await expectStatus(`/api/v1/public/sites/${slug}`, 404);

  const pages = await request(`/api/v1/websites/${websiteId}/pages`, { headers: auth(smokeOwnerToken) });
  assert(pages.data.length === 7, `Expected 7 default pages, got ${pages.data.length}`);
  assert(pages.data.find((page: any) => page.pageKey === "article_detail")?.isDynamicDetailPage === true, "article_detail page missing dynamic flag");
  assert(typeof pages.data[0].sectionCount === "number", "Pages list missing sectionCount");
  assert(typeof pages.data[0].filledSectionCount === "number", "Pages list missing filledSectionCount");
  const homePage = await request(`/api/v1/websites/${websiteId}/pages/home`, { headers: auth(smokeOwnerToken) });
  assert(homePage.data.sections[0].slotLabel, "Page detail section missing slotLabel");

  const sections = await request(`/api/v1/websites/${websiteId}/sections`, { headers: auth(smokeOwnerToken) });
  assert(sections.data.length === 33, `Expected 33 default sections, got ${sections.data.length}`);
  const initialHeroSection = await request(`/api/v1/websites/${websiteId}/sections/home.hero`, { headers: auth(smokeOwnerToken) });
  assert(initialHeroSection.data.slotLabel === "Hero", "Section detail missing slotLabel");
  assert("effectiveContent" in initialHeroSection.data, "Section detail missing effectiveContent");

  const templates = await request("/api/v1/template-sections/by-slot/home.hero", { headers: auth(smokeOwnerToken) });
  assert(templates.data.length > 0, "No template sections found for home.hero. Did seed run?");
  assert(templates.data[0].slotLabel === "Hero", "Template section missing slotLabel");
  assert(templates.data.every((template: any) => template.status === "active"), "Owner template selection returned non-active template");
  assert(Array.isArray(templates.data[0].schema), "Template section missing schema array");
  assert("defaultContent" in templates.data[0], "Template section missing defaultContent");
  await request(`/api/v1/template-sections/${templates.data[0].id}`, { headers: auth(smokeOwnerToken) });
  const activeTemplates = await request("/api/v1/template-sections?websiteType=company_profile&slotKey=home.hero", { headers: auth(smokeOwnerToken) });
  assert(activeTemplates.data[0].status, "Template section missing status");
  await request("/api/v1/template-sections?websiteType=company_profile&includeDraft=true", { headers: auth(internalToken) });

  const activePackKey = `smoke-company-profile-full-${unique}`;
  const importedPack = await importTemplatePack(activePackKey, internalToken, { full: true });
  assert(importedPack.data.templatePack.status === "active", "Valid template pack did not become active");
  assert(importedPack.data.summary.expectedSlots === 33, "Template pack summary expectedSlots must be 33");
  assert(importedPack.data.summary.validSections === 33, "Valid template pack should import 33 valid sections");
  const importedPackDetail = await request(`/api/v1/internal/template-packs/${importedPack.data.templatePack.id}`, { headers: auth(internalToken) });
  assert(importedPackDetail.data.sections.length === 33, "Template pack detail missing sections");
  const ownerHeroTemplatesAfterPack = await request("/api/v1/template-sections?websiteType=company_profile&slotKey=home.hero", { headers: auth(smokeOwnerToken) });
  assert(ownerHeroTemplatesAfterPack.data.some((template: any) => template.sectionKey === `${activePackKey}.home.hero.smoke`), "Active imported template not visible to owner selection");

  const draftPackKey = `smoke-company-profile-draft-${unique}`;
  const draftPack = await importTemplatePack(draftPackKey, internalToken, { full: false });
  assert(draftPack.data.templatePack.status === "draft", "Incomplete template pack did not become draft");
  assert(draftPack.data.summary.expectedSlots === 33, "Draft pack summary expectedSlots must be 33");
  assert(draftPack.data.warnings.length > 0, "Draft pack should include missing slot warnings");
  const ownerHeroTemplatesAfterDraft = await request("/api/v1/template-sections?websiteType=company_profile&slotKey=home.hero", { headers: auth(smokeOwnerToken) });
  assert(!ownerHeroTemplatesAfterDraft.data.some((template: any) => template.sectionKey === `${draftPackKey}.home.hero.smoke`), "Draft imported template should not be visible to owner selection");

  const invalidPackKey = `smoke-company-profile-invalid-${unique}`;
  const invalidPack = await importTemplatePack(invalidPackKey, internalToken, { full: false, invalidSlot: true });
  assert(invalidPack.data.templatePack.status === "invalid", "Wrong slot template pack did not become invalid");
  assert(invalidPack.data.errors.length > 0, "Invalid pack should include validation errors");
  const invalidOwnerTemplates = await request("/api/v1/template-sections?websiteType=company_profile&slotKey=home.invalid_slot", { headers: auth(smokeOwnerToken) });
  assert(invalidOwnerTemplates.data.length === 0, "Invalid imported template should not be visible to owner selection");

  await request(`/api/v1/websites/${websiteId}/sections/home.hero/template`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ templateSectionId: templates.data[0].id })
  });
  const updatedHeroSection = await request(`/api/v1/websites/${websiteId}/sections/home.hero/content`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ contentJson: { title: "Smoke Title", subtitle: "Smoke subtitle", ctaLabel: "Hubungi Kami" } })
  });
  assert(updatedHeroSection.data.effectiveContent.title === "Smoke Title", "Section effectiveContent did not merge owner content");
  await request(`/api/v1/websites/${websiteId}/sections/home.hero/visibility`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ isVisible: true })
  });

  await request(`/api/v1/websites/${websiteId}/business-profile`, {
    method: "PUT",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({
      name: "Smoke Company",
      tagline: "Smoke tagline",
      description: "Smoke description",
      contactEmail: "smoke@example.com",
      whatsapp: "6281234567890"
    })
  });
  await request(`/api/v1/websites/${websiteId}/business-profile`, { headers: auth(smokeOwnerToken) });

  const service = await request(`/api/v1/websites/${websiteId}/services`, {
    method: "POST",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ title: "Smoke Service", description: "Smoke description", imageUrl: "https://example.com/service.jpg", sortOrder: 1, isActive: true })
  });
  await request(`/api/v1/websites/${websiteId}/services/${service.data.id}`, { headers: auth(smokeOwnerToken) });
  const patchedService = await request(`/api/v1/websites/${websiteId}/services/${service.data.id}`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ title: "Smoke Service Patched", description: "Smoke description patched", imageUrl: "https://example.com/service-patched.jpg", sortOrder: 2, isActive: false })
  });
  assert(patchedService.data.title === "Smoke Service Patched", "Service PATCH did not update title");
  await request(`/api/v1/websites/${websiteId}/services/${service.data.id}`, { method: "DELETE", headers: auth(smokeOwnerToken) });

  const portfolio = await request(`/api/v1/websites/${websiteId}/portfolios`, {
    method: "POST",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ title: "Smoke Portfolio", description: "Smoke portfolio", imageUrl: "https://example.com/portfolio.jpg", sortOrder: 1, isActive: true })
  });
  await request(`/api/v1/websites/${websiteId}/portfolios/${portfolio.data.id}`, { headers: auth(smokeOwnerToken) });
  const patchedPortfolio = await request(`/api/v1/websites/${websiteId}/portfolios/${portfolio.data.id}`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ title: "Smoke Portfolio Patched", description: "Smoke portfolio patched", imageUrl: "https://example.com/portfolio-patched.jpg", sortOrder: 2, isActive: false })
  });
  assert(patchedPortfolio.data.title === "Smoke Portfolio Patched", "Portfolio PATCH did not update title");
  await request(`/api/v1/websites/${websiteId}/portfolios/${portfolio.data.id}`, { method: "DELETE", headers: auth(smokeOwnerToken) });

  const testimonial = await request(`/api/v1/websites/${websiteId}/testimonials`, {
    method: "POST",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ name: "Smoke Client", role: "Owner", company: "Smoke Co", quote: "Smoke quote", avatarUrl: "https://example.com/avatar.jpg", sortOrder: 1, isActive: true })
  });
  await request(`/api/v1/websites/${websiteId}/testimonials/${testimonial.data.id}`, { headers: auth(smokeOwnerToken) });
  const patchedTestimonial = await request(`/api/v1/websites/${websiteId}/testimonials/${testimonial.data.id}`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ name: "Smoke Client Patched", role: "Director", company: "Smoke Co Patched", quote: "Smoke quote patched", avatarUrl: "https://example.com/avatar-patched.jpg", sortOrder: 2, isActive: false })
  });
  assert(patchedTestimonial.data.name === "Smoke Client Patched", "Testimonial PATCH did not update name");
  await request(`/api/v1/websites/${websiteId}/testimonials/${testimonial.data.id}`, { method: "DELETE", headers: auth(smokeOwnerToken) });

  const brand = await request(`/api/v1/websites/${websiteId}/brand-partners`, {
    method: "POST",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ name: "Smoke Partner", logoUrl: "https://example.com/logo.png", url: "https://example.com", sortOrder: 1, isActive: true })
  });
  await request(`/api/v1/websites/${websiteId}/brand-partners/${brand.data.id}`, { headers: auth(smokeOwnerToken) });
  const patchedBrand = await request(`/api/v1/websites/${websiteId}/brand-partners/${brand.data.id}`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ name: "Smoke Partner Patched", logoUrl: "https://example.com/logo-patched.png", url: "https://partner.example.com", sortOrder: 2, isActive: false })
  });
  assert(patchedBrand.data.name === "Smoke Partner Patched", "Brand partner PATCH did not update name");
  await request(`/api/v1/websites/${websiteId}/brand-partners/${brand.data.id}`, { method: "DELETE", headers: auth(smokeOwnerToken) });

  const article = await request(`/api/v1/websites/${websiteId}/articles`, {
    method: "POST",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({
      title: "Smoke Article",
      slug: `smoke-article-${unique}`,
      excerpt: "Smoke article excerpt",
      content: "Smoke article content",
      coverImageUrl: "https://example.com/article.jpg",
      seoTitle: "Smoke Article SEO",
      seoDescription: "Smoke article SEO description",
      status: "draft",
      sortOrder: 1
    })
  });
  const patchedArticle = await request(`/api/v1/websites/${websiteId}/articles/${article.data.id}`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ title: "Smoke Article Patched", slug: `smoke-article-patched-${unique}`, content: "Smoke article content patched" })
  });
  assert(patchedArticle.data.title === "Smoke Article Patched", "Article PATCH did not update title");
  const publishedArticle = await request(`/api/v1/websites/${websiteId}/articles/${article.data.id}`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ status: "published" })
  });
  assert(publishedArticle.data.publishedAt, "Published article missing publishedAt");

  await request(`/api/v1/websites/${websiteId}/publish`, { method: "POST", headers: auth(smokeOwnerToken) });
  const publicHome = await request(`/api/v1/public/sites/${slug}`);
  assert(publicHome.data.page.pageKey === "home", "Public site did not return home page");
  assert(publicHome.data.seo?.title, "Public renderer missing seo.title");
  assert(publicHome.data.website.websiteTypeLabel === "Company Profile", "Public renderer missing websiteTypeLabel");
  assert(publicHome.data.navigation?.navbar?.items?.length >= 1, "Public renderer missing navigation.navbar.items");
  assert(publicHome.data.navigation?.footer?.items, "Public renderer missing navigation.footer.items");
  assert(Array.isArray(publicHome.data.page.sections), "Public site did not return sections");
  assert(publicHome.data.page.sections[0].slotLabel, "Public section missing slotLabel");
  assert(publicHome.data.page.sections[0].tracking?.slotKey, "Public section missing tracking metadata");
  await request(`/api/v1/public/sites/${slug}/pages/services`);
  const publicArticles = await request(`/api/v1/public/sites/${slug}/articles`);
  assert(publicArticles.data.find((item: any) => item.slug === publishedArticle.data.slug), "Public article list missing published article");
  const publicArticle = await request(`/api/v1/public/sites/${slug}/articles/${publishedArticle.data.slug}`);
  assert(publicArticle.data.article.id === article.data.id, "Public article detail returned wrong article");
  assert(publicArticle.data.seo.title === "Smoke Article SEO", "Public article SEO title mismatch");
  const preview = await request(`/api/v1/websites/${websiteId}/preview/pages/home`, { headers: auth(smokeOwnerToken) });
  assert(preview.data.isPreview === true, "Preview response missing isPreview true");

  await request("/api/v1/public/tracking/events", {
    method: "POST",
    body: JSON.stringify({
      trackingKey,
      eventName: "page_view",
      visitorId: "smoke_visitor",
      sessionId: "smoke_session",
      pageKey: "home",
      pageSlug: "",
      referrer: "https://google.com",
      utm: { source: "google", medium: "organic" },
      metadata: {}
    })
  });
  await request("/api/v1/public/tracking/events", {
    method: "POST",
    body: JSON.stringify({
      trackingKey,
      eventName: "section_view",
      visitorId: "smoke_visitor",
      sessionId: "smoke_session",
      pageKey: "home",
      slotKey: "home.hero",
      sectionKey: templates.data[0].sectionKey,
      metadata: null
    })
  });
  await request("/api/v1/public/tracking/events", {
    method: "POST",
    body: JSON.stringify({
      trackingKey,
      eventName: "cta_click",
      visitorId: "smoke_visitor",
      sessionId: "smoke_session",
      pageKey: "home",
      slotKey: "home.hero",
      sectionKey: templates.data[0].sectionKey,
      ctaKey: "primary"
    })
  });
  await request("/api/v1/public/tracking/events", {
    method: "POST",
    body: JSON.stringify({
      trackingKey,
      eventName: "service_view",
      visitorId: "smoke_visitor",
      sessionId: "smoke_session",
      pageKey: "services",
      objectType: "service",
      objectId: service.data.id
    })
  });
  await request("/api/v1/public/tracking/events", {
    method: "POST",
    body: JSON.stringify({
      trackingKey,
      eventName: "portfolio_view",
      visitorId: "smoke_visitor",
      sessionId: "smoke_session",
      pageKey: "portfolio",
      objectType: "portfolio",
      objectId: portfolio.data.id
    })
  });
  await request("/api/v1/public/tracking/events", {
    method: "POST",
    body: JSON.stringify({
      trackingKey,
      eventName: "article_view",
      visitorId: "smoke_visitor",
      sessionId: "smoke_session",
      pageKey: "articles",
      objectType: "article",
      objectId: article.data.id
    })
  });
  await expectStatus("/api/v1/public/tracking/events", 404, {
    method: "POST",
    body: JSON.stringify({ trackingKey: "invalid_tracking_key", eventName: "page_view" })
  });

  await request(`/api/v1/public/sites/${slug}/contact`, {
    method: "POST",
    body: JSON.stringify({
      name: "Smoke Lead",
      email: "smoke-lead@example.com",
      phone: "08123456789",
      message: "Smoke contact",
      interest: "Smoke Service",
      sourcePage: "contact",
      sourceSection: "contact.contact_form",
      tracking: {
        visitorId: "smoke_visitor",
        sessionId: "smoke_session",
        referrer: "https://google.com",
        utm: { source: "google" }
      }
    })
  });

  const recentLeads = await request(`/api/v1/websites/${websiteId}/leads/recent`, { headers: auth(smokeOwnerToken) });
  assert(recentLeads.data.length > 0, "Expected at least one recent lead");
  assert(recentLeads.data[0].statusLabel, "Recent lead missing statusLabel");
  await request(`/api/v1/websites/${websiteId}/leads`, { headers: auth(smokeOwnerToken) });
  await request(`/api/v1/websites/${websiteId}/leads/${recentLeads.data[0].id}/status`, {
    method: "PATCH",
    headers: auth(smokeOwnerToken),
    body: JSON.stringify({ status: "contacted" })
  });

  const summary = await request(`/api/v1/websites/${websiteId}/insights/summary`, { headers: auth(smokeOwnerToken) });
  assert(Array.isArray(summary.data.cards), "Insight summary missing cards");
  assert(summary.data.highlights, "Insight summary missing highlights");
  assert(summary.data.cards.find((card: any) => card.key === "totalPageViews")?.value >= 1, "Expected totalPageViews card value >= 1");
  assert(summary.data.cards.find((card: any) => card.key === "totalCtaClicks")?.value >= 1, "Expected totalCtaClicks card value >= 1");
  assert(summary.data.highlights.topArticle?.total >= 1, "Expected topArticle highlight total >= 1");
  const topPages = await request(`/api/v1/websites/${websiteId}/insights/top-pages`, { headers: auth(smokeOwnerToken) });
  assert(topPages.data[0].pageLabel, "Top pages missing pageLabel");
  const topSections = await request(`/api/v1/websites/${websiteId}/insights/top-sections`, { headers: auth(smokeOwnerToken) });
  assert(topSections.data[0].slotLabel, "Top sections missing slotLabel");
  const topCtas = await request(`/api/v1/websites/${websiteId}/insights/top-ctas`, { headers: auth(smokeOwnerToken) });
  assert(topCtas.data[0].ctaLabel, "Top CTAs missing ctaLabel");
  const topServices = await request(`/api/v1/websites/${websiteId}/insights/top-services`, { headers: auth(smokeOwnerToken) });
  assert(topServices.data[0].serviceId, "Top services missing serviceId");
  const topPortfolios = await request(`/api/v1/websites/${websiteId}/insights/top-portfolios`, { headers: auth(smokeOwnerToken) });
  assert(topPortfolios.data[0].portfolioId, "Top portfolios missing portfolioId");
  const topArticles = await request(`/api/v1/websites/${websiteId}/insights/top-articles`, { headers: auth(smokeOwnerToken) });
  assert(topArticles.data[0].articleId === article.data.id, "Top articles missing smoke article");
  const trafficSources = await request(`/api/v1/websites/${websiteId}/insights/traffic-sources`, { headers: auth(smokeOwnerToken) });
  assert(trafficSources.data[0].label, "Traffic sources missing label");
  const auditLogs = await request("/api/v1/internal/audit-logs?limit=20", { headers: auth(internalToken) });
  assert(Array.isArray(auditLogs.data.items), "Audit logs endpoint missing items array");
  assert(auditLogs.data.items.length > 0, "Expected audit logs after smoke actions");
  assert(auditLogs.data.items.some((item: any) => item.action === "website.published"), "Audit logs missing website.published action");
  const auditSummary = await request("/api/v1/internal/audit-logs/summary", { headers: auth(internalToken) });
  assert(typeof auditSummary.data.total === "number", "Audit log summary missing total");

  console.log("Smoke test passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
