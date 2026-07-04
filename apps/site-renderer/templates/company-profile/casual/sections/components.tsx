import type { ReactNode } from "react";

import { CasualHomeHero } from "../source/sections/home/CasualHomeHero";
import { CasualHomeProfileSummary } from "../source/sections/home/CasualHomeProfileSummary";
import { CasualHomeServicePreview } from "../source/sections/home/CasualHomeServicePreview";
import { CasualHomePortfolioPreview } from "../source/sections/home/CasualHomePortfolioPreview";
import { CasualHomeTrustProof } from "../source/sections/home/CasualHomeTrustProof";
import { CasualHomeCtaContact } from "../source/sections/home/CasualHomeCtaContact";

import { CasualAboutOrganizationProfile } from "../source/sections/about/CasualAboutOrganizationProfile";
import { CasualAboutHistoryTimeline } from "../source/sections/about/CasualAboutHistoryTimeline";
import { CasualAboutVisionMission } from "../source/sections/about/CasualAboutVisionMission";
import { CasualAboutValueStatement } from "../source/sections/about/CasualAboutValueStatement";
import { CasualAboutTeamHighlight } from "../source/sections/about/CasualAboutTeamHighlight";

import { CasualServicesHero } from "../source/sections/services/CasualServicesHero";
import { CasualServicesGrid } from "../source/sections/services/CasualServicesGrid";
import { CasualServicesProcess } from "../source/sections/services/CasualServicesProcess";
import { CasualServicesBenefits } from "../source/sections/services/CasualServicesBenefits";
import { CasualServicesFaq } from "../source/sections/services/CasualServicesFaq";

import { CasualPortfolioHero } from "../source/sections/portfolio/CasualPortfolioHero";
import { CasualPortfolioCategory } from "../source/sections/portfolio/CasualPortfolioCategory";
import { CasualPortfolioGrid } from "../source/sections/portfolio/CasualPortfolioGrid";
import { CasualPortfolioCaseHighlight } from "../source/sections/portfolio/CasualPortfolioCaseHighlight";
import { CasualPortfolioCta } from "../source/sections/portfolio/CasualPortfolioCta";

import { CasualArticlesHero } from "../source/sections/articles/CasualArticlesHero";
import { CasualFeaturedArticle } from "../source/sections/articles/CasualFeaturedArticle";
import { CasualArticlePreview } from "../source/sections/articles/CasualArticlePreview";

import { CasualArticleContent } from "../source/sections/article-detail/CasualArticleContent";
import { CasualRelatedArticles } from "../source/sections/article-detail/CasualRelatedArticles";
import { CasualArticleCta } from "../source/sections/article-detail/CasualArticleCta";

import { CasualContactHero } from "../source/sections/contact/CasualContactHero";
import { CasualContactInformation } from "../source/sections/contact/CasualContactInformation";
import { CasualMapsLocation } from "../source/sections/contact/CasualMapsLocation";
import { CasualContactFaq } from "../source/sections/contact/CasualContactFaq";
import { CasualContactCta } from "../source/sections/contact/CasualContactCta";

import { CasualPortfolioDetailContent } from "../source/sections/portfolio-detail/CasualPortfolioDetailContent";
import { CasualRelatedPortfolios } from "../source/sections/portfolio-detail/CasualRelatedPortfolios";
import { CasualPortfolioDetailCta } from "../source/sections/portfolio-detail/CasualPortfolioDetailCta";

import type { ServiceItem, PortfolioItem, ArticleItem, TeamMember, TimelineItem, FaqItem } from "../source/lib/dummy-data";
import type { CrudItem, PublicPagePayload, PublicSection } from "@/lib/types";
import { getSiteHref, resolveTargetHref, getPageHrefByKey, getPortfolioDetailHref } from "@/lib/links";

type CasualSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };
type CasualSectionComponent = (props: CasualSectionProps) => ReactNode;

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function boolValue(value: unknown, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "ya", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "tidak", "off"].includes(normalized)) return false;
  return fallback;
}

function numberValue(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function contentOf(section: PublicSection) {
  return section.content || {};
}

// Field "items" adalah tipe repeater (lihat schema Template Pack) — array bebas jumlah,
// dipakai oleh value_statement/service_benefits/service_process/trust_proof.
function itemsOf(section: PublicSection): Array<{ title?: string; value?: string }> {
  const raw = contentOf(section).items;
  return Array.isArray(raw) ? raw : [];
}

function businessOf(payload: PublicPagePayload) {
  return payload.businessProfile || {};
}

function titleOf(item: CrudItem) {
  return item.title || item.name || "Item";
}

function categoryNameOf(item: CrudItem) {
  return text(item.category?.name, text(item.categoryName, typeof item.category === "string" ? item.category : "Umum"));
}

function imageOf(item: CrudItem, fallback: string) {
  return text(item.imageUrl, text(item.coverImageUrl, fallback));
}

function mapBrand(item: CrudItem, index: number): { id: string; name: string; logoUrl?: string } {
  return {
    id: String(item.id || `brand-${index + 1}`),
    name: text(item.name, `Mitra ${index + 1}`),
    logoUrl: text(item.logoUrl, text(item.imageUrl)) || undefined,
  };
}

function brandsFor(props: CasualSectionProps) {
  // home.trust_proof: brand/client logo murni dari data CRUD Brand Partners,
  // hanya tampil kalau owner sudah isi datanya (sama seperti Formal).
  return (props.section.data?.brands || []).map(mapBrand);
}

function contentImage(content: Record<string, any>, fallback = "") {
  return (
    text(content.imageUrl) ||
    text(content.coverImageUrl) ||
    text(content.heroImageUrl) ||
    text(content.backgroundImageUrl) ||
    fallback
  );
}

function whatsappHref(payload: PublicPagePayload) {
  const business = businessOf(payload);
  const raw = text(business.whatsapp) || text(business.phone);
  const numbers = raw.replace(/[^0-9]/g, "");
  return numbers ? `https://wa.me/${numbers}` : getSiteHref(payload.website.slug, "/contact");
}

// pageHref() literal sudah tidak dipakai di file ini — semua link ke halaman List dan
// detail sekarang resolve dinamis lewat getPageHrefByKey / getPortfolioDetailHref /
// getArticleDetailHref dari '@/lib/links'.

function sectionHref(props: CasualSectionProps, prefix: "cta" | "secondaryCta" | string, fallback: string) {
  return resolveTargetHref({
    siteSlug: props.siteSlug,
    navigation: props.payload.navigation,
    content: contentOf(props.section),
    prefix,
    fallback,
  });
}

// ---- Data mapping: CRUD (dashboard) -> shape Casual AI Studio components ----

function mapService(item: CrudItem, index: number): ServiceItem {
  return {
    id: String(item.slug || item.id || `service-${index + 1}`),
    title: titleOf(item),
    shortDesc: text(item.description, "Layanan yang siap bantu kebutuhan bisnismu."),
    iconName: text(item.iconName, ["Sparkles", "Instagram", "Laptop", "Camera"][index % 4]),
    color: text(item.color, ["#649FF6", "#F56B71", "#B283AF", "#649FF6"][index % 4]),
    price: text(item.price, "Hubungi Kami"),
  };
}

function mapPortfolio(item: CrudItem, index: number): PortfolioItem {
  return {
    id: String(item.slug || item.id || `portfolio-${index + 1}`),
    title: titleOf(item),
    category: categoryNameOf(item),
    imageUrl: imageOf(item, `https://picsum.photos/seed/casual-portfolio-${index + 1}/800/500`),
    description: text(item.description, "Project yang udah kita kerjain bareng klien."),
    client: text(item.clientName, text(item.company, "Klien")),
    year: text(item.year, "2026"),
  };
}

function mapTeamMember(item: CrudItem, index: number): TeamMember {
  return {
    id: String(item.id || `team-${index + 1}`),
    name: text(item.name, `Anggota Tim ${index + 1}`),
    role: text(item.role, "Tim Kreatif"),
    imageUrl: imageOf(item, `https://picsum.photos/seed/casual-team-${index + 1}/400/400`),
    bio: text(item.bio, "Profil tim belum diisi."),
  };
}

function mapTimeline(item: CrudItem, index: number): TimelineItem {
  return {
    year: text(item.year, String(2020 + index)),
    title: text(item.title, `Milestone ${index + 1}`),
    desc: text(item.description, "Cerita milestone belum diisi."),
  };
}

function mapFaq(item: CrudItem, index: number): FaqItem {
  return {
    question: text(item.question, titleOf(item) || `Pertanyaan ${index + 1}`),
    answer: text(item.answer, text(item.description, "Jawaban akan ditambahkan oleh pemilik bisnis.")),
  };
}

function mapArticle(item: CrudItem, payload: PublicPagePayload, index = 0): ArticleItem {
  const business = businessOf(payload);
  return {
    id: String(item.id || `article-${index + 1}`),
    slug: String(item.slug || item.id || `article-${index + 1}`),
    title: titleOf(item),
    excerpt: text(item.excerpt, text(item.description, "Ringkasan artikel akan tampil di sini.")),
    content: text(item.content, "Konten artikel belum tersedia."),
    imageUrl: imageOf(item, `https://picsum.photos/seed/casual-article-${index + 1}/1200/600`),
    publishedAt: text(item.publishedAt, text(item.createdAt, "Belum dipublikasikan")),
    author: {
      name: text(item.authorName, text(business.name, payload.website.name)),
      avatar: text(item.authorAvatarUrl, text(business.logoUrl, "https://picsum.photos/seed/casual-author/100/100")),
      role: text(item.authorRole, "Penulis"),
    },
    tags: Array.isArray(item.tags) ? item.tags.map((tag: unknown) => String(tag)) : [categoryNameOf(item)],
  };
}

function articlesFor(props: CasualSectionProps): ArticleItem[] {
  return (props.section.data?.articles || []).map((item, index) => mapArticle(item, props.payload, index));
}

function currentArticleFor(props: CasualSectionProps): ArticleItem | undefined {
  const raw = props.section.data?.article;
  return raw ? mapArticle(raw, props.payload, 0) : undefined;
}

function currentPortfolioFor(props: CasualSectionProps): PortfolioItem | undefined {
  const sectionData = props.section.data as any;
  const raw = sectionData.portfolio;
  return raw ? mapPortfolio(raw, 0) : undefined;
}

function servicesFor(props: CasualSectionProps): ServiceItem[] | undefined {
  const rows = props.section.data?.services || [];
  return rows.length ? rows.map(mapService) : undefined;
}

function portfoliosFor(props: CasualSectionProps): PortfolioItem[] | undefined {
  const rows = props.section.data?.portfolios || [];
  return rows.length ? rows.map(mapPortfolio) : undefined;
}

function teamFor(props: CasualSectionProps): TeamMember[] | undefined {
  const rows = (props.section.data?.teamMembers || []).filter((item) => item.isActive !== false);
  return rows.length ? rows.map(mapTeamMember) : undefined;
}

function timelineFor(props: CasualSectionProps): TimelineItem[] | undefined {
  const rows = (props.section.data?.timelines || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => numberValue(a.sortOrder, 0) - numberValue(b.sortOrder, 0));
  return rows.length ? rows.map(mapTimeline) : undefined;
}

function faqsFor(props: CasualSectionProps): FaqItem[] | undefined {
  const rows = props.section.data?.faqs || [];
  return rows.length ? rows.map(mapFaq) : undefined;
}

// ---- Home ----

export function CasualHomeHeroSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualHomeHero
      eyebrow={text(content.badge)}
      title={text(content.title)}
      subtitle={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
      secondaryCtaLabel={text(content.secondaryCtaLabel)}
      secondaryCtaUrl={sectionHref(props, "secondaryCta", "/portfolio")}
      imageUrl={contentImage(content)}
    />
  );
}

export function CasualHomeProfileSummarySection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualHomeProfileSummary
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/about")}
      imageUrl={contentImage(content)}
    />
  );
}

export function CasualHomeServicePreviewSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualHomeServicePreview
      title={text(content.title)}
      description={text(content.description)}
      badge={text(content.badge)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", getPageHrefByKey(props.siteSlug, props.payload.navigation, "services", "/services"))}
      services={servicesFor(props)}
      imageUrl={contentImage(content)}
    />
  );
}

export function CasualHomePortfolioPreviewSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualHomePortfolioPreview
      title={text(content.title)}
      description={text(content.description)}
      badge={text(content.badge)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", getPageHrefByKey(props.siteSlug, props.payload.navigation, "portfolio", "/portfolio"))}
      portfolios={portfoliosFor(props)}
      portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)}
      imageUrl={contentImage(content)}
    />
  );
}

export function CasualHomeTrustProofSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const testimonialRows = props.section.data?.testimonials || [];
  const testimonials = testimonialRows.length
    ? testimonialRows.slice(0, 5).map((item) => ({
        quote: text(item.quote, "Layanan yang membantu kami."),
        author: text(item.name, "Klien"),
        role: [text(item.role), text(item.company)].filter(Boolean).join(" - ") || "Pelanggan",
        avatar: imageOf(item, "https://picsum.photos/seed/casual-testi/100/100"),
      }))
    : undefined;
  return (
    <CasualHomeTrustProof
      title={text(content.title)}
      description={text(content.description)}
      badge={text(content.badge)}
      metrics={itemsOf(props.section).map((item) => ({ label: text(item?.value as string), value: text(item?.title as string) })).filter((m) => m.label && m.value)}
      testimonials={testimonials}
      brands={brandsFor(props)}
      imageUrl={contentImage(content)}
      ctaLabel={text(content.ctaLabel)}
      ctaHref={sectionHref(props, "cta", "/contact")}
    />
  );
}

export function CasualHomeCtaContactSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualHomeCtaContact
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
      imageUrl={contentImage(content)}
    />
  );
}

// ---- About ----

export function CasualAboutOrganizationProfileSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <CasualAboutOrganizationProfile
      title={text(content.title)}
      description={text(content.description, text(business.description))}
      imageUrl={contentImage(content, text(business.aboutImage))}
    />
  );
}

export function CasualAboutHistoryTimelineSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualAboutHistoryTimeline title={text(content.title)} description={text(content.description)} badge={text(content.badge)} items={timelineFor(props)} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

export function CasualAboutVisionMissionSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <CasualAboutVisionMission
      title={text(content.title)}
      description={text(content.description)}
      badge={text(content.badge)}
      visionTitle={text(content.visionTitle)}
      vision={text(content.vision, text(business.vision))}
      missionTitle={text(content.missionTitle)}
      mission={text(content.mission, text(business.mission))}
      imageUrl={contentImage(content)}
      ctaLabel={text(content.ctaLabel)}
      ctaHref={sectionHref(props, "cta", "/contact")}
    />
  );
}

export function CasualAboutValueStatementSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualAboutValueStatement
      title={text(content.title)}
      description={text(content.description)}
      badge={text(content.badge)}
      items={itemsOf(props.section)}
      imageUrl={contentImage(content)}
      ctaLabel={text(content.ctaLabel)}
      ctaHref={sectionHref(props, "cta", "/contact")}
    />
  );
}

export function CasualAboutTeamHighlightSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualAboutTeamHighlight
      title={text(content.title)}
      description={text(content.description)}
      imageUrl={contentImage(content)}
      members={teamFor(props)}
    />
  );
}

// ---- Services ----

export function CasualServicesHeroSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualServicesHero title={text(content.title)} description={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)} />;
}

export function CasualServicesGridSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualServicesGrid title={text(content.title)} description={text(content.description)} badge={text(content.badge)} services={servicesFor(props)} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

export function CasualServicesProcessSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualServicesProcess
      title={text(content.title)}
      description={text(content.description)}
      items={itemsOf(props.section)}
    />
  );
}

export function CasualServicesBenefitsSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualServicesBenefits
      title={text(content.title)}
      description={text(content.description)}
      items={itemsOf(props.section)}
    />
  );
}

export function CasualServicesFaqSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualServicesFaq title={text(content.title)} description={text(content.description)} badge={text(content.badge)} faqs={faqsFor(props)} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

// ---- Portfolio ----

export function CasualPortfolioHeroSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualPortfolioHero title={text(content.title)} description={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)} />;
}

export function CasualPortfolioCategorySection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const categories = [...new Set((props.section.data?.portfolioCategories || []).map((item) => titleOf(item)))];
  return (
    <CasualPortfolioCategory
      title={text(content.title)}
      description={text(content.description)}
      badge={text(content.badge)}
      categories={categories}
      imageUrl={contentImage(content)}
      ctaLabel={text(content.ctaLabel)}
      ctaHref={sectionHref(props, "cta", "/contact")}
    />
  );
}

export function CasualPortfolioGridSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualPortfolioGrid
      title={text(content.title)}
      description={text(content.description)}
      badge={text(content.badge)}
      portfolios={portfoliosFor(props)}
      portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)}
      imageUrl={contentImage(content)}
      ctaLabel={text(content.ctaLabel)}
      ctaHref={sectionHref(props, "cta", "/contact")}
    />
  );
}

export function CasualPortfolioCaseHighlightSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualPortfolioCaseHighlight
      title={text(content.title)}
      description={text(content.description)}
      imageUrl={contentImage(content)}
    />
  );
}

export function CasualPortfolioCtaSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualPortfolioCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
      imageUrl={contentImage(content)}
    />
  );
}

// ---- Articles ----

export function CasualArticlesHeroSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualArticlesHero title={text(content.title)} description={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)} />;
}

export function CasualFeaturedArticleSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const articles = articlesFor(props);
  const article = articles.find((item, index) => props.section.data?.articles?.[index]?.isFeatured) || articles[0];
  return <CasualFeaturedArticle title={text(content.title)} description={text(content.description)} badge={text(content.badge)} article={article} articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} />;
}

export function CasualArticlePreviewSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualArticlePreview title={text(content.title)} description={text(content.description)} badge={text(content.badge)} articles={articlesFor(props)} articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} />;
}

// ---- Article Detail ----

export function CasualArticleContentSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <CasualArticleContent
      contentMaxWidth={text(content.contentMaxWidth, "max-w-3xl")}
      showAuthor={boolValue(content.showAuthor, true) ? "true" : "false"}
      showPublishDate={boolValue(content.showPublishDate, true) ? "true" : "false"}
      showShareLink={boolValue(content.showShareLink, true) ? "true" : "false"}
      backHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")}
      businessName={text(business.name, props.payload.website.name)}
      businessLogoUrl={text(business.logoUrl as string)}
      article={currentArticleFor(props)}
    />
  );
}

export function CasualRelatedArticlesSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const current = currentArticleFor(props);
  const related = (props.section.data?.relatedArticles || []).map((item, index) => mapArticle(item, props.payload, index));
  return (
    <CasualRelatedArticles
      title={text(content.title)}
      description={text(content.description)}
      currentSlug={current?.slug}
      articles={related.length ? related : undefined}
      articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")}
    />
  );
}

export function CasualArticleCtaSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualArticleCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
      imageUrl={contentImage(content)}
    />
  );
}

// ---- Portfolio Detail ----

export function CasualPortfolioDetailContentSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <CasualPortfolioDetailContent
      project={currentPortfolioFor(props)}
      badge={text(content.badge, "Studi Kasus")}
      backHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "portfolio", "/portfolio")}
      businessName={text(business.name, props.payload.website.name)}
      businessLogoUrl={text(business.logoUrl as string)}
      contentMaxWidth={text(content.contentMaxWidth, "max-w-3xl")}
      showAuthor={boolValue(content.showAuthor, true) ? "true" : "false"}
      showPublishDate={boolValue(content.showPublishDate, true) ? "true" : "false"}
      showShareLink={boolValue(content.showShareLink, true) ? "true" : "false"}
    />
  );
}

export function CasualRelatedPortfoliosSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const current = currentPortfolioFor(props);
  const sectionData = props.section.data as any;
  const relatedRaw = sectionData.relatedPortfolios || sectionData.portfolios || [];
  const related = relatedRaw.map((item: CrudItem, index: number) => mapPortfolio(item, index));
  return (
    <CasualRelatedPortfolios
      title={text(content.title, "Proyek Lain yang Mungkin Kamu Suka")}
      description={text(content.description, "Intip beberapa kolaborasi seru kami lainnya bareng pemilik UMKM keren.")}
      currentId={current?.id}
      portfolios={related.length ? related : undefined}
      portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)}
    />
  );
}

export function CasualPortfolioDetailCtaSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualPortfolioDetailCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
      imageUrl={contentImage(content)}
    />
  );
}

// ---- Contact ----

export function CasualContactHeroSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualContactHero title={text(content.title)} description={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)} />;
}

export function CasualContactInformationSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const waNumber = text(business.whatsapp, text(business.phone)).replace(/[^0-9]/g, "");
  return (
    <CasualContactInformation
      title={text(content.title)}
      description={text(content.description)}
      showWhatsapp={Boolean(text(business.whatsapp as string) || text(business.phone as string)) ? "true" : "false"}
      showEmail={Boolean(text(business.contactEmail as string)) ? "true" : "false"}
      showAddress={Boolean(text(business.address as string)) ? "true" : "false"}
      siteSlug={props.siteSlug}
      pageKey={props.payload.page.pageKey}
      slotKey={props.section.slotKey}
      whatsappHref={waNumber ? `https://wa.me/${waNumber}` : undefined}
      whatsappLabel={text(business.whatsapp, text(business.phone)) || undefined}
      email={text(business.contactEmail as string) || undefined}
      address={text(business.address as string) || undefined}
    />
  );
}

export function CasualMapsLocationSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <CasualMapsLocation
      title={text(content.title)}
      description={text(content.description)}
      mapEmbedUrl={text(content.mapEmbedUrl, text(business.mapEmbedUrl, text(business.googleMapsEmbedUrl)))}
    />
  );
}

export function CasualContactFaqSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return <CasualContactFaq title={text(content.title)} description={text(content.description)} badge={text(content.badge)} faqs={faqsFor(props)} imageUrl={contentImage(content)} />;
}

export function CasualContactCtaSection(props: CasualSectionProps) {
  const content = contentOf(props.section);
  return (
    <CasualContactCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
      imageUrl={contentImage(content)}
    />
  );
}

// Casual — komponen hasil porting Google AI Studio untuk Website Type Company Profile.
// Namespace "Casual<Slot>" mengikuti konvensi yang sama dengan tema Formal, supaya
// gabungan ke registry global (SectionRegistry.tsx) tidak bentrok nama.
// ---- Global Chrome (Navbar & Footer) ----
// Slot "global.navbar" / "global.footer" — section biasa supaya bisa dipilih & di-preview
// lintas tema lewat mekanisme "Pilih Tampilan Section" yang sama seperti section lain.
import { Header as CasualSiteHeader } from "../source/shared/Header";
import { Footer as CasualSiteFooter } from "../source/shared/Footer";

export function CasualGlobalNavbar(props: CasualSectionProps) {
  const business = businessOf(props.payload);
  const navbarItems = props.payload.navigation?.navbar?.items || [];
  const cta = props.payload.navigation?.navbar?.cta;
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);
  return (
    <CasualSiteHeader
      siteSlug={props.siteSlug}
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      taglineLabel={text(business.tagline as string)}
      logoUrl={text(business.logoUrl as string) || undefined}
      navItems={navbarItems.length > 0 ? navbarItems : undefined}
      ctaLabel={cta?.label || "Hubungi Kami"}
      ctaPath={cta?.path || "/contact"}
    />
  );
}

export function CasualGlobalFooter(props: CasualSectionProps) {
  const business = businessOf(props.payload);
  const footerItems = props.payload.navigation?.footer?.items || [];
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);
  return (
    <CasualSiteFooter
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      taglineLabel={text(business.tagline as string) || "Company Profile"}
      logoUrl={text(business.logoUrl as string) || undefined}
      description={text(business.description as string, "Website company profile yang menampilkan profil, layanan, portofolio, artikel, dan kontak bisnis.")}
      establishedYear={text(business.establishedYear as string) || undefined}
      founderName={text(business.founderName as string) || undefined}
      address={text(business.address as string)}
      email={text(business.contactEmail as string)}
      phone={text(business.phone as string)}
      workingHours={text(business.workingHours as string, text(business.operationalHours as string))}
      instagramUrl={text(business.instagramUrl as string) || undefined}
      facebookUrl={text(business.facebookUrl as string) || undefined}
      linkedinUrl={text(business.linkedinUrl as string) || undefined}
      twitterUrl={text(business.twitterUrl as string) || undefined}
      websiteUrl={text(business.websiteUrl as string) || undefined}
      navItems={footerItems.length > 0 ? footerItems : undefined}
    />
  );
}

export const casualSectionComponents: Record<string, CasualSectionComponent> = {
  CasualHomeHero: CasualHomeHeroSection,
  CasualHomeProfileSummary: CasualHomeProfileSummarySection,
  CasualHomeServicePreview: CasualHomeServicePreviewSection,
  CasualHomePortfolioPreview: CasualHomePortfolioPreviewSection,
  CasualHomeTrustProof: CasualHomeTrustProofSection,
  CasualHomeCtaContact: CasualHomeCtaContactSection,

  CasualAboutOrganizationProfile: CasualAboutOrganizationProfileSection,
  CasualAboutHistoryTimeline: CasualAboutHistoryTimelineSection,
  CasualAboutVisionMission: CasualAboutVisionMissionSection,
  CasualAboutValueStatement: CasualAboutValueStatementSection,
  CasualAboutTeamHighlight: CasualAboutTeamHighlightSection,

  CasualServicesHero: CasualServicesHeroSection,
  CasualServicesGrid: CasualServicesGridSection,
  CasualServicesProcess: CasualServicesProcessSection,
  CasualServicesBenefits: CasualServicesBenefitsSection,
  CasualServicesFaq: CasualServicesFaqSection,

  CasualPortfolioHero: CasualPortfolioHeroSection,
  CasualPortfolioCategory: CasualPortfolioCategorySection,
  CasualPortfolioGrid: CasualPortfolioGridSection,
  CasualPortfolioCaseHighlight: CasualPortfolioCaseHighlightSection,
  CasualPortfolioCta: CasualPortfolioCtaSection,

  CasualArticlesHero: CasualArticlesHeroSection,
  CasualFeaturedArticle: CasualFeaturedArticleSection,
  CasualArticlePreview: CasualArticlePreviewSection,

  CasualArticleContent: CasualArticleContentSection,
  CasualRelatedArticles: CasualRelatedArticlesSection,
  CasualArticleCta: CasualArticleCtaSection,

  CasualPortfolioDetailContent: CasualPortfolioDetailContentSection,
  CasualRelatedPortfolios: CasualRelatedPortfoliosSection,
  CasualPortfolioDetailCta: CasualPortfolioDetailCtaSection,

  CasualContactHero: CasualContactHeroSection,
  CasualContactInformation: CasualContactInformationSection,
  CasualMapsLocation: CasualMapsLocationSection,
  CasualContactFaq: CasualContactFaqSection,
  CasualContactCta: CasualContactCtaSection,
  CasualGlobalNavbar,
  CasualGlobalFooter
};
