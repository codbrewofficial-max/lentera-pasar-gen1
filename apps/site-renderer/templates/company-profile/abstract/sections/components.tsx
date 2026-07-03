import type { ReactNode } from "react";

import { AbstractHomeHero } from "../source/sections/home/AbstractHomeHero";
import { AbstractHomeProfileSummary } from "../source/sections/home/AbstractHomeProfileSummary";
import { AbstractHomeServicePreview } from "../source/sections/home/AbstractHomeServicePreview";
import { AbstractHomePortfolioPreview } from "../source/sections/home/AbstractHomePortfolioPreview";
import { AbstractHomeTrustProof } from "../source/sections/home/AbstractHomeTrustProof";
import { AbstractHomeCtaContact } from "../source/sections/home/AbstractHomeCtaContact";

import { AbstractAboutOrganizationProfile } from "../source/sections/about/AbstractAboutOrganizationProfile";
import { AbstractAboutHistoryTimeline } from "../source/sections/about/AbstractAboutHistoryTimeline";
import { AbstractAboutVisionMission } from "../source/sections/about/AbstractAboutVisionMission";
import { AbstractAboutValueStatement } from "../source/sections/about/AbstractAboutValueStatement";
import { AbstractAboutTeamHighlight } from "../source/sections/about/AbstractAboutTeamHighlight";

import { AbstractServicesHero } from "../source/sections/services/AbstractServicesHero";
import { AbstractServicesGrid } from "../source/sections/services/AbstractServicesGrid";
import { AbstractServicesProcess } from "../source/sections/services/AbstractServicesProcess";
import { AbstractServicesBenefits } from "../source/sections/services/AbstractServicesBenefits";
import { AbstractServicesFaq } from "../source/sections/services/AbstractServicesFaq";

import { AbstractPortfolioHero } from "../source/sections/portfolio/AbstractPortfolioHero";
import { AbstractPortfolioCategory } from "../source/sections/portfolio/AbstractPortfolioCategory";
import { AbstractPortfolioGrid } from "../source/sections/portfolio/AbstractPortfolioGrid";
import { AbstractPortfolioCaseHighlight } from "../source/sections/portfolio/AbstractPortfolioCaseHighlight";
import { AbstractPortfolioCta } from "../source/sections/portfolio/AbstractPortfolioCta";

import { AbstractArticlesHero } from "../source/sections/articles/AbstractArticlesHero";
import { AbstractFeaturedArticle } from "../source/sections/articles/AbstractFeaturedArticle";
import { AbstractArticlePreview } from "../source/sections/articles/AbstractArticlePreview";

import { AbstractArticleContent } from "../source/sections/article-detail/AbstractArticleContent";
import { AbstractRelatedArticles } from "../source/sections/article-detail/AbstractRelatedArticles";
import { AbstractArticleCta } from "../source/sections/article-detail/AbstractArticleCta";

import { AbstractPortfolioDetailContent } from "../source/sections/portfolio-detail/AbstractPortfolioDetailContent";
import { AbstractRelatedPortfolios } from "../source/sections/portfolio-detail/AbstractRelatedPortfolios";
import { AbstractPortfolioDetailCta } from "../source/sections/portfolio-detail/AbstractPortfolioDetailCta";

import { AbstractContactHero } from "../source/sections/contact/AbstractContactHero";
import { AbstractContactInformation } from "../source/sections/contact/AbstractContactInformation";
import { AbstractMapsLocation } from "../source/sections/contact/AbstractMapsLocation";
import { AbstractContactFaq } from "../source/sections/contact/AbstractContactFaq";
import { AbstractContactCta } from "../source/sections/contact/AbstractContactCta";

import type { ServiceItem, PortfolioItem, ArticleItem, TeamMember, TimelineItem, FaqItem, TestimonialItem } from "../source/lib/dummy-data";
import type { CrudItem, PublicPagePayload, PublicSection } from "@/lib/types";
import { getSiteHref, resolveTargetHref, getPageHrefByKey, getPortfolioDetailHref } from "@/lib/links";

type AbstractSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };
type AbstractSectionComponent = (props: AbstractSectionProps) => ReactNode;

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

function contentImage(content: Record<string, any>, fallback = "") {
  return (
    text(content.imageUrl) ||
    text(content.coverImageUrl) ||
    text(content.heroImageUrl) ||
    text(content.backgroundImageUrl) ||
    fallback
  );
}

// pageHref() literal sudah tidak dipakai di file ini — semua link ke halaman List dan
// detail sekarang resolve dinamis lewat getPageHrefByKey / getPortfolioDetailHref /
// getArticleDetailHref dari '@/lib/links'.

function sectionHref(props: AbstractSectionProps, prefix: "cta" | "secondaryCta" | string, fallback: string) {
  return resolveTargetHref({
    siteSlug: props.siteSlug,
    navigation: props.payload.navigation,
    content: contentOf(props.section),
    prefix,
    fallback,
  });
}

// ---- Data mapping: CRUD (dashboard) -> shape Abstract AI Studio components ----

function mapService(item: CrudItem, index: number): ServiceItem {
  return {
    id: String(item.slug || item.id || `service-${index + 1}`),
    title: titleOf(item),
    description: text(item.description, "Layanan kreatif yang dieksekusi dengan pendekatan eksperimental."),
    iconName: text(item.iconName),
    category: categoryNameOf(item),
    badge: text(item.badge),
  };
}

function mapPortfolio(item: CrudItem, index: number): PortfolioItem {
  return {
    id: String(item.slug || item.id || `portfolio-${index + 1}`),
    title: titleOf(item),
    description: text(item.description, "Karya yang menunjukkan pendekatan visual berani kami."),
    imageUrl: imageOf(item, `https://picsum.photos/seed/abstract-portfolio-${index + 1}/1200/900`),
    category: categoryNameOf(item),
    year: text(item.year, "2026"),
    client: text(item.clientName, text(item.company, "Klien")),
    colorTheme: text(item.colorTheme),
  };
}

function mapTeamMember(item: CrudItem, index: number): TeamMember {
  return {
    id: String(item.id || `team-${index + 1}`),
    name: text(item.name, `Anggota Tim ${index + 1}`),
    role: text(item.role, "Tim Kreatif"),
    bio: text(item.bio, "Profil tim belum diisi."),
    imageUrl: imageOf(item, `https://picsum.photos/seed/abstract-team-${index + 1}/400/400`),
    signature: text(item.signature),
  };
}

function mapTestimonial(item: CrudItem, index: number): TestimonialItem {
  return {
    id: String(item.id || `testimonial-${index + 1}`),
    name: text(item.name, "Klien"),
    role: text(item.role, "Pelanggan"),
    company: text(item.company, "Perusahaan"),
    content: text(item.quote, "Kolaborasi dengan tim ini membantu brand kami tampil lebih berani dan berbeda dari kompetitor."),
    imageUrl: imageOf(item, `https://picsum.photos/seed/abstract-testi-${index + 1}/100/100`),
  };
}

function testimonialsFor(props: AbstractSectionProps): TestimonialItem[] | undefined {
  // home.trust_proof schema cuma punya field title/description/metric, testimoni murni
  // dari data CRUD Testimonials (sama seperti Formal & Premium).
  const rows = props.section.data?.testimonials || [];
  return rows.length ? rows.slice(0, 3).map(mapTestimonial) : undefined;
}

function mapBrand(item: CrudItem, index: number): { id: string; name: string; logoUrl?: string } {
  return {
    id: String(item.id || `brand-${index + 1}`),
    name: text(item.name, `Mitra ${index + 1}`),
    logoUrl: text(item.logoUrl, text(item.imageUrl)) || undefined,
  };
}

function brandsFor(props: AbstractSectionProps) {
  // home.trust_proof: brand/client logo murni dari data CRUD Brand Partners,
  // hanya tampil kalau owner sudah isi datanya (sama seperti Formal).
  return (props.section.data?.brands || []).map(mapBrand);
}

function mapTimeline(item: CrudItem, index: number): TimelineItem {
  return {
    id: String(item.id || `timeline-${index + 1}`),
    year: text(item.year, String(2020 + index)),
    title: text(item.title, `Milestone ${index + 1}`),
    description: text(item.description, "Cerita milestone belum diisi."),
  };
}

function mapFaq(item: CrudItem, index: number): FaqItem {
  return {
    id: String(item.id || `faq-${index + 1}`),
    question: text(item.question, titleOf(item) || `Pertanyaan ${index + 1}`),
    answer: text(item.answer, text(item.description, "Jawaban akan ditambahkan oleh pemilik bisnis.")),
  };
}

function mapArticle(item: CrudItem, payload: PublicPagePayload, index = 0): ArticleItem {
  const business = businessOf(payload);
  return {
    id: String(item.slug || item.id || `article-${index + 1}`),
    title: titleOf(item),
    description: text(item.excerpt, text(item.description, "Ringkasan artikel akan tampil di sini.")),
    content: text(item.content, "Konten artikel belum tersedia."),
    imageUrl: imageOf(item, `https://picsum.photos/seed/abstract-article-${index + 1}/1200/600`),
    publishedAt: text(item.publishedAt, text(item.createdAt, "Belum dipublikasikan")),
    category: categoryNameOf(item),
    author: {
      name: text(item.authorName, text(business.name, payload.website.name)),
      avatarUrl: text(item.authorAvatarUrl, text(business.logoUrl, "https://picsum.photos/seed/abstract-author/100/100")),
      role: text(item.authorRole, "Penulis"),
    },
    tags: Array.isArray(item.tags) ? item.tags.map((tag: unknown) => String(tag)) : [categoryNameOf(item)],
  };
}

function articlesFor(props: AbstractSectionProps): ArticleItem[] {
  return (props.section.data?.articles || []).map((item, index) => mapArticle(item, props.payload, index));
}

function currentArticleFor(props: AbstractSectionProps): ArticleItem | undefined {
  const raw = props.section.data?.article;
  return raw ? mapArticle(raw, props.payload, 0) : undefined;
}

function currentPortfolioFor(props: AbstractSectionProps): PortfolioItem | undefined {
  const sectionData = props.section.data as any;
  const raw = sectionData.portfolio;
  return raw ? mapPortfolio(raw, 0) : undefined;
}

function servicesFor(props: AbstractSectionProps): ServiceItem[] | undefined {
  const rows = props.section.data?.services || [];
  return rows.length ? rows.map(mapService) : undefined;
}

function portfoliosFor(props: AbstractSectionProps): PortfolioItem[] | undefined {
  const rows = props.section.data?.portfolios || [];
  return rows.length ? rows.map(mapPortfolio) : undefined;
}

function teamFor(props: AbstractSectionProps): TeamMember[] | undefined {
  const rows = (props.section.data?.teamMembers || []).filter((item) => item.isActive !== false);
  return rows.length ? rows.map(mapTeamMember) : undefined;
}

function timelineFor(props: AbstractSectionProps): TimelineItem[] | undefined {
  const rows = (props.section.data?.timelines || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => numberValue(a.sortOrder, 0) - numberValue(b.sortOrder, 0));
  return rows.length ? rows.map(mapTimeline) : undefined;
}

function faqsFor(props: AbstractSectionProps): FaqItem[] | undefined {
  const rows = props.section.data?.faqs || [];
  return rows.length ? rows.map(mapFaq) : undefined;
}

// ---- Home ----

export function AbstractHomeHeroSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractHomeHero
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

export function AbstractHomeProfileSummarySection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractHomeProfileSummary
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/about")}
      imageUrl={contentImage(content)}
    />
  );
}

export function AbstractHomeServicePreviewSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractHomeServicePreview
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", getPageHrefByKey(props.siteSlug, props.payload.navigation, "services", "/services"))}
      services={servicesFor(props)}
    />
  );
}

export function AbstractHomePortfolioPreviewSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractHomePortfolioPreview
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", getPageHrefByKey(props.siteSlug, props.payload.navigation, "portfolio", "/portfolio"))}
      portfolios={portfoliosFor(props)}
      portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)}
    />
  );
}

export function AbstractHomeTrustProofSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractHomeTrustProof
      title={text(content.title)}
      description={text(content.description)}
      metrics={itemsOf(props.section).map((item) => ({ value: text(item?.title as string), label: text(item?.value as string) })).filter((m) => m.label && m.value)}
      testimonials={testimonialsFor(props)}
      brands={brandsFor(props)}
    />
  );
}

export function AbstractHomeCtaContactSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractHomeCtaContact
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- About ----

export function AbstractAboutOrganizationProfileSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <AbstractAboutOrganizationProfile
      title={text(content.title)}
      description={text(content.description, text(business.description))}
      imageUrl={contentImage(content, text(business.aboutImage))}
    />
  );
}

export function AbstractAboutHistoryTimelineSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractAboutHistoryTimeline title={text(content.title)} description={text(content.description)} items={timelineFor(props)} />;
}

export function AbstractAboutVisionMissionSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <AbstractAboutVisionMission
      visionTitle={text(content.visionTitle)}
      vision={text(content.vision, text(business.vision))}
      missionTitle={text(content.missionTitle)}
      mission={text(content.mission, text(business.mission))}
    />
  );
}

export function AbstractAboutValueStatementSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractAboutValueStatement
      title={text(content.title)}
      description={text(content.description)}
      items={itemsOf(props.section)}
    />
  );
}

export function AbstractAboutTeamHighlightSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractAboutTeamHighlight
      title={text(content.title)}
      description={text(content.description)}
      imageUrl={contentImage(content)}
      members={teamFor(props)}
    />
  );
}

// ---- Services ----

export function AbstractServicesHeroSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractServicesHero title={text(content.title)} description={text(content.description)} />;
}

export function AbstractServicesGridSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractServicesGrid title={text(content.title)} description={text(content.description)} services={servicesFor(props)} />;
}

export function AbstractServicesProcessSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractServicesProcess
      title={text(content.title)}
      description={text(content.description)}
      items={itemsOf(props.section)}
    />
  );
}

export function AbstractServicesBenefitsSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractServicesBenefits
      title={text(content.title)}
      description={text(content.description)}
      items={itemsOf(props.section)}
    />
  );
}

export function AbstractServicesFaqSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractServicesFaq title={text(content.title)} description={text(content.description)} faqs={faqsFor(props)} />;
}

// ---- Portfolio ----

export function AbstractPortfolioHeroSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractPortfolioHero title={text(content.title)} description={text(content.description)} />;
}

export function AbstractPortfolioCategorySection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractPortfolioCategory title={text(content.title)} description={text(content.description)} />;
}

export function AbstractPortfolioGridSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractPortfolioGrid title={text(content.title)} description={text(content.description)} portfolios={portfoliosFor(props)} portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)} />;
}

export function AbstractPortfolioCaseHighlightSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractPortfolioCaseHighlight
      title={text(content.title)}
      description={text(content.description)}
      imageUrl={contentImage(content)}
    />
  );
}

export function AbstractPortfolioCtaSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractPortfolioCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- Articles ----

export function AbstractArticlesHeroSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractArticlesHero title={text(content.title)} description={text(content.description)} />;
}

export function AbstractFeaturedArticleSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const articles = articlesFor(props);
  const article = articles.find((item, index) => props.section.data?.articles?.[index]?.isFeatured) || articles[0];
  return <AbstractFeaturedArticle title={text(content.title)} description={text(content.description)} article={article} articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")} />;
}

export function AbstractArticlePreviewSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractArticlePreview title={text(content.title)} description={text(content.description)} articles={articlesFor(props)} articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")} />;
}

// ---- Article Detail ----

export function AbstractArticleContentSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <AbstractArticleContent
      article={currentArticleFor(props)}
      backHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")}
      businessName={text(business.name, props.payload.website.name)}
      businessLogoUrl={text(business.logoUrl as string)}
      contentMaxWidth={text(content.contentMaxWidth, "max-w-3xl")}
      showAuthor={boolValue(content.showAuthor, true) ? "true" : "false"}
      showPublishDate={boolValue(content.showPublishDate, true) ? "true" : "false"}
      showShareLink={boolValue(content.showShareLink, true) ? "true" : "false"}
    />
  );
}

export function AbstractRelatedArticlesSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const related = (props.section.data?.relatedArticles || []).map((item, index) => mapArticle(item, props.payload, index));
  return (
    <AbstractRelatedArticles
      title={text(content.title)}
      description={text(content.description)}
      articles={related.length ? related : undefined}
      articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")}
    />
  );
}

export function AbstractArticleCtaSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractArticleCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- Portfolio Detail ----

export function AbstractPortfolioDetailContentSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <AbstractPortfolioDetailContent
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

export function AbstractRelatedPortfoliosSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const current = currentPortfolioFor(props);
  const sectionData = props.section.data as any;
  const relatedRaw = sectionData.relatedPortfolios || sectionData.portfolios || [];
  const related = relatedRaw.map((item: CrudItem, index: number) => mapPortfolio(item, index));
  return (
    <AbstractRelatedPortfolios
      title={text(content.title, "Karya Terkait Lainnya")}
      description={text(content.description, "Eksplorasi proyek lain yang membawa pendekatan visual berani serupa.")}
      currentId={current?.id}
      portfolios={related.length ? related : undefined}
      portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)}
    />
  );
}

export function AbstractPortfolioDetailCtaSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractPortfolioDetailCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- Contact ----

export function AbstractContactHeroSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractContactHero title={text(content.title)} description={text(content.description)} />;
}

export function AbstractContactInformationSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const waNumber = text(business.whatsapp, text(business.phone)).replace(/[^0-9]/g, "");
  return (
    <AbstractContactInformation
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

export function AbstractMapsLocationSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <AbstractMapsLocation
      title={text(content.title)}
      description={text(content.description)}
      mapEmbedUrl={text(content.mapEmbedUrl, text(business.mapEmbedUrl, text(business.googleMapsEmbedUrl)))}
    />
  );
}

export function AbstractContactFaqSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return <AbstractContactFaq title={text(content.title)} description={text(content.description)} faqs={faqsFor(props)} />;
}

export function AbstractContactCtaSection(props: AbstractSectionProps) {
  const content = contentOf(props.section);
  return (
    <AbstractContactCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// Abstract — komponen hasil porting Google AI Studio untuk Website Type Company Profile.
// Namespace "Abstract<Slot>" mengikuti konvensi yang sama dengan tema Formal, Casual, dan
// Premium, supaya gabungan ke registry global (SectionRegistry.tsx) tidak bentrok nama.
export const abstractSectionComponents: Record<string, AbstractSectionComponent> = {
  AbstractHomeHero: AbstractHomeHeroSection,
  AbstractHomeProfileSummary: AbstractHomeProfileSummarySection,
  AbstractHomeServicePreview: AbstractHomeServicePreviewSection,
  AbstractHomePortfolioPreview: AbstractHomePortfolioPreviewSection,
  AbstractHomeTrustProof: AbstractHomeTrustProofSection,
  AbstractHomeCtaContact: AbstractHomeCtaContactSection,

  AbstractAboutOrganizationProfile: AbstractAboutOrganizationProfileSection,
  AbstractAboutHistoryTimeline: AbstractAboutHistoryTimelineSection,
  AbstractAboutVisionMission: AbstractAboutVisionMissionSection,
  AbstractAboutValueStatement: AbstractAboutValueStatementSection,
  AbstractAboutTeamHighlight: AbstractAboutTeamHighlightSection,

  AbstractServicesHero: AbstractServicesHeroSection,
  AbstractServicesGrid: AbstractServicesGridSection,
  AbstractServicesProcess: AbstractServicesProcessSection,
  AbstractServicesBenefits: AbstractServicesBenefitsSection,
  AbstractServicesFaq: AbstractServicesFaqSection,

  AbstractPortfolioHero: AbstractPortfolioHeroSection,
  AbstractPortfolioCategory: AbstractPortfolioCategorySection,
  AbstractPortfolioGrid: AbstractPortfolioGridSection,
  AbstractPortfolioCaseHighlight: AbstractPortfolioCaseHighlightSection,
  AbstractPortfolioCta: AbstractPortfolioCtaSection,

  AbstractArticlesHero: AbstractArticlesHeroSection,
  AbstractFeaturedArticle: AbstractFeaturedArticleSection,
  AbstractArticlePreview: AbstractArticlePreviewSection,

  AbstractArticleContent: AbstractArticleContentSection,
  AbstractRelatedArticles: AbstractRelatedArticlesSection,
  AbstractArticleCta: AbstractArticleCtaSection,

  AbstractPortfolioDetailContent: AbstractPortfolioDetailContentSection,
  AbstractRelatedPortfolios: AbstractRelatedPortfoliosSection,
  AbstractPortfolioDetailCta: AbstractPortfolioDetailCtaSection,

  AbstractContactHero: AbstractContactHeroSection,
  AbstractContactInformation: AbstractContactInformationSection,
  AbstractMapsLocation: AbstractMapsLocationSection,
  AbstractContactFaq: AbstractContactFaqSection,
  AbstractContactCta: AbstractContactCtaSection
};
