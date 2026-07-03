import type { ReactNode } from "react";

import { PremiumHomeHero } from "../source/sections/home/PremiumHomeHero";
import { PremiumHomeProfileSummary } from "../source/sections/home/PremiumHomeProfileSummary";
import { PremiumHomeServicePreview } from "../source/sections/home/PremiumHomeServicePreview";
import { PremiumHomePortfolioPreview } from "../source/sections/home/PremiumHomePortfolioPreview";
import { PremiumHomeTrustProof } from "../source/sections/home/PremiumHomeTrustProof";
import { PremiumHomeCtaContact } from "../source/sections/home/PremiumHomeCtaContact";

import { PremiumAboutOrganizationProfile } from "../source/sections/about/PremiumAboutOrganizationProfile";
import { PremiumAboutHistoryTimeline } from "../source/sections/about/PremiumAboutHistoryTimeline";
import { PremiumAboutVisionMission } from "../source/sections/about/PremiumAboutVisionMission";
import { PremiumAboutValueStatement } from "../source/sections/about/PremiumAboutValueStatement";
import { PremiumAboutTeamHighlight } from "../source/sections/about/PremiumAboutTeamHighlight";

import { PremiumServicesHero } from "../source/sections/services/PremiumServicesHero";
import { PremiumServicesGrid } from "../source/sections/services/PremiumServicesGrid";
import { PremiumServicesProcess } from "../source/sections/services/PremiumServicesProcess";
import { PremiumServicesBenefits } from "../source/sections/services/PremiumServicesBenefits";
import { PremiumServicesFaq } from "../source/sections/services/PremiumServicesFaq";

import { PremiumPortfolioHero } from "../source/sections/portfolio/PremiumPortfolioHero";
import { PremiumPortfolioCategory } from "../source/sections/portfolio/PremiumPortfolioCategory";
import { PremiumPortfolioGrid } from "../source/sections/portfolio/PremiumPortfolioGrid";
import { PremiumPortfolioCaseHighlight } from "../source/sections/portfolio/PremiumPortfolioCaseHighlight";
import { PremiumPortfolioCta } from "../source/sections/portfolio/PremiumPortfolioCta";

import { PremiumArticlesHero } from "../source/sections/articles/PremiumArticlesHero";
import { PremiumFeaturedArticle } from "../source/sections/articles/PremiumFeaturedArticle";
import { PremiumArticlePreview } from "../source/sections/articles/PremiumArticlePreview";

import { PremiumArticleDetailHero } from "../source/sections/article-detail/PremiumArticleDetailHero";
import { PremiumArticleContent } from "../source/sections/article-detail/PremiumArticleContent";
import { PremiumRelatedArticles } from "../source/sections/article-detail/PremiumRelatedArticles";
import { PremiumArticleCta } from "../source/sections/article-detail/PremiumArticleCta";

import { PremiumPortfolioDetailHero } from "../source/sections/portfolio-detail/PremiumPortfolioDetailHero";
import { PremiumPortfolioDetailContent } from "../source/sections/portfolio-detail/PremiumPortfolioDetailContent";
import { PremiumRelatedPortfolios } from "../source/sections/portfolio-detail/PremiumRelatedPortfolios";
import { PremiumPortfolioDetailCta } from "../source/sections/portfolio-detail/PremiumPortfolioDetailCta";

import { PremiumContactHero } from "../source/sections/contact/PremiumContactHero";
import { PremiumContactInformation } from "../source/sections/contact/PremiumContactInformation";
import { PremiumMapsLocation } from "../source/sections/contact/PremiumMapsLocation";
import { PremiumContactFaq } from "../source/sections/contact/PremiumContactFaq";
import { PremiumContactCta } from "../source/sections/contact/PremiumContactCta";

import type { ServiceItem, PortfolioItem, ArticleItem, TeamMember, TimelineItem, FaqItem, TestimonialItem } from "../source/lib/dummy-data";
import type { CrudItem, PublicPagePayload, PublicSection } from "@/lib/types";
import { getSiteHref, resolveTargetHref } from "@/lib/links";

type PremiumSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };
type PremiumSectionComponent = (props: PremiumSectionProps) => ReactNode;

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

function whatsappHref(payload: PublicPagePayload) {
  const business = businessOf(payload);
  const raw = text(business.whatsapp) || text(business.phone);
  const numbers = raw.replace(/[^0-9]/g, "");
  return numbers ? `https://wa.me/${numbers}` : getSiteHref(payload.website.slug, "/contact");
}

function pageHref(siteSlug: string, path: string) {
  return getSiteHref(siteSlug, path);
}

function sectionHref(props: PremiumSectionProps, prefix: "cta" | "secondaryCta" | string, fallback: string) {
  return resolveTargetHref({
    siteSlug: props.siteSlug,
    navigation: props.payload.navigation,
    content: contentOf(props.section),
    prefix,
    fallback,
  });
}

// ---- Data mapping: CRUD (dashboard) -> shape Premium AI Studio components ----

function mapService(item: CrudItem, index: number): ServiceItem {
  return {
    id: String(item.slug || item.id || `service-${index + 1}`),
    title: titleOf(item),
    description: text(item.description, "Layanan premium yang disiapkan dengan standar kualitas tertinggi."),
    longDescription: text(item.longDescription),
    priceRange: text(item.price, text(item.priceRange)),
    iconName: text(item.iconName),
  };
}

function mapPortfolio(item: CrudItem, index: number): PortfolioItem {
  return {
    id: String(item.slug || item.id || `portfolio-${index + 1}`),
    title: titleOf(item),
    description: text(item.description, "Karya pilihan yang menunjukkan standar kualitas kami."),
    category: categoryNameOf(item),
    year: text(item.year, "2026"),
    client: text(item.clientName, text(item.company, "Klien")),
    imageUrl: imageOf(item, `https://picsum.photos/seed/premium-portfolio-${index + 1}/1200/800`),
    tags: Array.isArray(item.tags) ? item.tags.map((tag: unknown) => String(tag)) : [categoryNameOf(item)],
    location: text(item.location),
  };
}

function mapTeamMember(item: CrudItem, index: number): TeamMember {
  return {
    id: String(item.id || `team-${index + 1}`),
    name: text(item.name, `Anggota Tim ${index + 1}`),
    role: text(item.role, "Tim Profesional"),
    bio: text(item.bio, "Profil tim belum diisi."),
    imageUrl: imageOf(item, `https://picsum.photos/seed/premium-team-${index + 1}/400/400`),
    linkedinUrl: text(item.linkedinUrl, text(item.linkedin)),
  };
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

function mapTestimonial(item: CrudItem, index: number): TestimonialItem {
  return {
    id: String(item.id || `testimonial-${index + 1}`),
    name: text(item.name, "Klien"),
    company: text(item.company, "Perusahaan"),
    role: text(item.role, "Pelanggan"),
    feedback: text(item.quote, "Layanan yang diberikan membantu kami mendapatkan hasil terbaik."),
    avatarUrl: text(item.avatarUrl, text(item.logoUrl)),
  };
}

function mapArticle(item: CrudItem, payload: PublicPagePayload, index = 0): ArticleItem {
  const business = businessOf(payload);
  return {
    id: String(item.slug || item.id || `article-${index + 1}`),
    title: titleOf(item),
    description: text(item.excerpt, text(item.description, "Ringkasan artikel akan tampil di sini.")),
    content: text(item.content, "Konten artikel belum tersedia."),
    publishedDate: text(item.publishedAt, text(item.createdAt, "Belum dipublikasikan")),
    readTime: text(item.readTime, "5 Menit Baca"),
    imageUrl: imageOf(item, `https://picsum.photos/seed/premium-article-${index + 1}/1200/600`),
    author: text(item.authorName, text(business.name, payload.website.name)),
    authorRole: text(item.authorRole, "Penulis"),
    category: categoryNameOf(item),
  };
}

function articlesFor(props: PremiumSectionProps): ArticleItem[] {
  return (props.section.data?.articles || []).map((item, index) => mapArticle(item, props.payload, index));
}

function currentArticleFor(props: PremiumSectionProps): ArticleItem | undefined {
  const raw = props.section.data?.article;
  return raw ? mapArticle(raw, props.payload, 0) : undefined;
}

function currentPortfolioFor(props: PremiumSectionProps): PortfolioItem | undefined {
  const sectionData = props.section.data as any;
  const raw = sectionData.portfolio;
  return raw ? mapPortfolio(raw, 0) : undefined;
}

function servicesFor(props: PremiumSectionProps): ServiceItem[] | undefined {
  const rows = props.section.data?.services || [];
  return rows.length ? rows.map(mapService) : undefined;
}

function portfoliosFor(props: PremiumSectionProps): PortfolioItem[] | undefined {
  const rows = props.section.data?.portfolios || [];
  return rows.length ? rows.map(mapPortfolio) : undefined;
}

function teamFor(props: PremiumSectionProps): TeamMember[] | undefined {
  const rows = (props.section.data?.teamMembers || []).filter((item) => item.isActive !== false);
  return rows.length ? rows.map(mapTeamMember) : undefined;
}

function timelineFor(props: PremiumSectionProps): TimelineItem[] | undefined {
  const rows = (props.section.data?.timelines || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => numberValue(a.sortOrder, 0) - numberValue(b.sortOrder, 0));
  return rows.length ? rows.map(mapTimeline) : undefined;
}

function faqsFor(props: PremiumSectionProps): FaqItem[] | undefined {
  const rows = props.section.data?.faqs || [];
  return rows.length ? rows.map(mapFaq) : undefined;
}

function testimonialsFor(props: PremiumSectionProps): TestimonialItem[] | undefined {
  const rows = props.section.data?.testimonials || [];
  return rows.length ? rows.slice(0, 5).map(mapTestimonial) : undefined;
}

function mapBrand(item: CrudItem, index: number): { id: string; name: string; logoUrl?: string } {
  return {
    id: String(item.id || `brand-${index + 1}`),
    name: text(item.name, `Mitra ${index + 1}`),
    logoUrl: text(item.logoUrl, text(item.imageUrl)) || undefined,
  };
}

function brandsFor(props: PremiumSectionProps) {
  // home.trust_proof: brand/client logo murni dari data CRUD Brand Partners,
  // hanya tampil kalau owner sudah isi datanya (sama seperti Formal).
  return (props.section.data?.brands || []).map(mapBrand);
}

// ---- Home ----

export function PremiumHomeHeroSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumHomeHero
      eyebrow={text(content.eyebrow)}
      title={text(content.title)}
      subtitle={text(content.subtitle)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
      secondaryCtaLabel={text(content.secondaryCtaLabel)}
      secondaryCtaUrl={sectionHref(props, "secondaryCta", "/portfolio")}
      imageUrl={contentImage(content)}
    />
  );
}

export function PremiumHomeProfileSummarySection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumHomeProfileSummary
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/about")}
      imageUrl={contentImage(content)}
    />
  );
}

export function PremiumHomeServicePreviewSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumHomeServicePreview
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={pageHref(props.siteSlug, "/services")}
      services={servicesFor(props)}
    />
  );
}

export function PremiumHomePortfolioPreviewSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumHomePortfolioPreview
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={pageHref(props.siteSlug, "/portfolio")}
      portfolios={portfoliosFor(props)}
    />
  );
}

export function PremiumHomeTrustProofSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumHomeTrustProof
      title={text(content.title)}
      description={text(content.description)}
      metricOneLabel={text(content.metricOneLabel)}
      metricOneValue={text(content.metricOneValue)}
      metricTwoLabel={text(content.metricTwoLabel)}
      metricTwoValue={text(content.metricTwoValue)}
      metricThreeLabel={text(content.metricThreeLabel)}
      metricThreeValue={text(content.metricThreeValue)}
      testimonials={testimonialsFor(props)}
      brands={brandsFor(props)}
    />
  );
}

export function PremiumHomeCtaContactSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumHomeCtaContact
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- About ----

export function PremiumAboutOrganizationProfileSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <PremiumAboutOrganizationProfile
      title={text(content.title)}
      description={text(content.description, text(business.description))}
      imageUrl={contentImage(content, text(business.aboutImage))}
    />
  );
}

export function PremiumAboutHistoryTimelineSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumAboutHistoryTimeline title={text(content.title)} description={text(content.description)} items={timelineFor(props)} />;
}

export function PremiumAboutVisionMissionSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <PremiumAboutVisionMission
      visionTitle={text(content.visionTitle)}
      vision={text(content.vision, text(business.vision))}
      missionTitle={text(content.missionTitle)}
      mission={text(content.mission, text(business.mission))}
    />
  );
}

export function PremiumAboutValueStatementSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumAboutValueStatement
      title={text(content.title)}
      description={text(content.description)}
      valueOne={text(content.valueOne)}
      valueTwo={text(content.valueTwo)}
      valueThree={text(content.valueThree)}
    />
  );
}

export function PremiumAboutTeamHighlightSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumAboutTeamHighlight
      title={text(content.title)}
      description={text(content.description)}
      imageUrl={contentImage(content)}
      members={teamFor(props)}
    />
  );
}

// ---- Services ----

export function PremiumServicesHeroSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumServicesHero title={text(content.title)} description={text(content.description)} />;
}

export function PremiumServicesGridSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumServicesGrid title={text(content.title)} description={text(content.description)} services={servicesFor(props)} />;
}

export function PremiumServicesProcessSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumServicesProcess
      title={text(content.title)}
      description={text(content.description)}
      stepOne={text(content.stepOne)}
      stepTwo={text(content.stepTwo)}
      stepThree={text(content.stepThree)}
    />
  );
}

export function PremiumServicesBenefitsSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumServicesBenefits
      title={text(content.title)}
      description={text(content.description)}
      benefitOne={text(content.benefitOne)}
      benefitTwo={text(content.benefitTwo)}
      benefitThree={text(content.benefitThree)}
    />
  );
}

export function PremiumServicesFaqSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumServicesFaq title={text(content.title)} description={text(content.description)} faqs={faqsFor(props)} />;
}

// ---- Portfolio ----

export function PremiumPortfolioHeroSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumPortfolioHero title={text(content.title)} description={text(content.description)} />;
}

export function PremiumPortfolioCategorySection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumPortfolioCategory title={text(content.title)} description={text(content.description)} />;
}

export function PremiumPortfolioGridSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumPortfolioGrid title={text(content.title)} description={text(content.description)} portfolios={portfoliosFor(props)} />;
}

export function PremiumPortfolioCaseHighlightSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumPortfolioCaseHighlight
      title={text(content.title)}
      description={text(content.description)}
      imageUrl={contentImage(content)}
    />
  );
}

export function PremiumPortfolioCtaSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumPortfolioCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- Articles ----

export function PremiumArticlesHeroSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumArticlesHero title={text(content.title)} description={text(content.description)} />;
}

export function PremiumFeaturedArticleSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  const articles = articlesFor(props);
  const article = articles.find((item, index) => props.section.data?.articles?.[index]?.isFeatured) || articles[0];
  return <PremiumFeaturedArticle title={text(content.title)} description={text(content.description)} article={article} />;
}

export function PremiumArticlePreviewSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumArticlePreview title={text(content.title)} description={text(content.description)} articles={articlesFor(props)} />;
}

// ---- Article Detail ----

export function PremiumArticleDetailHeroSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumArticleDetailHero
      showPublishedDate={boolValue(content.showPublishedDate, true) ? "true" : "false"}
      showCoverImage={boolValue(content.showCoverImage, true) ? "true" : "false"}
      article={currentArticleFor(props)}
    />
  );
}

export function PremiumArticleContentSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumArticleContent
      contentMaxWidth={text(content.contentMaxWidth, "max-w-2xl")}
      showShareHint={boolValue(content.showShareHint, true) ? "true" : "false"}
      article={currentArticleFor(props)}
    />
  );
}

export function PremiumRelatedArticlesSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  const related = (props.section.data?.relatedArticles || []).map((item, index) => mapArticle(item, props.payload, index));
  return (
    <PremiumRelatedArticles
      title={text(content.title)}
      description={text(content.description)}
      relatedArticles={related.length ? related : undefined}
    />
  );
}

export function PremiumArticleCtaSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumArticleCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- Portfolio Detail ----

export function PremiumPortfolioDetailHeroSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumPortfolioDetailHero
      showCoverImage={boolValue(content.showCoverImage, true) ? "true" : "false"}
      badge={text(content.badge, "Studi Kasus")}
      project={currentPortfolioFor(props)}
    />
  );
}

export function PremiumPortfolioDetailContentSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumPortfolioDetailContent
      contentMaxWidth={text(content.contentMaxWidth, "max-w-2xl")}
      showShareHint={boolValue(content.showShareHint, true) ? "true" : "false"}
      project={currentPortfolioFor(props)}
    />
  );
}

export function PremiumRelatedPortfoliosSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  const current = currentPortfolioFor(props);
  const sectionData = props.section.data as any;
  const relatedRaw = sectionData.relatedPortfolios || sectionData.portfolios || [];
  const related = relatedRaw.map((item: CrudItem, index: number) => mapPortfolio(item, index));
  return (
    <PremiumRelatedPortfolios
      title={text(content.title, "Karya Pilihan Lainnya")}
      description={text(content.description, "Jelajahi rangkaian karya lain dari portofolio kami yang menonjolkan standar kualitas dan detail yang sama.")}
      currentId={current?.id}
      portfolios={related.length ? related : undefined}
    />
  );
}

export function PremiumPortfolioDetailCtaSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumPortfolioDetailCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// ---- Contact ----

export function PremiumContactHeroSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumContactHero title={text(content.title)} description={text(content.description)} />;
}

export function PremiumContactInformationSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <PremiumContactInformation
      title={text(content.title)}
      description={text(content.description)}
      showWhatsapp={boolValue(content.showWhatsapp, true) ? "true" : "false"}
      showEmail={boolValue(content.showEmail, true) ? "true" : "false"}
      showAddress={boolValue(content.showAddress, true) ? "true" : "false"}
      siteSlug={props.siteSlug}
      pageKey={props.payload.page.pageKey}
      slotKey={props.section.slotKey}
      whatsappHref={whatsappHref(props.payload)}
      whatsappLabel={text(business.whatsapp, text(business.phone)) || undefined}
      email={text(business.email) || undefined}
      address={text(business.address) || undefined}
    />
  );
}

export function PremiumMapsLocationSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <PremiumMapsLocation
      title={text(content.title)}
      description={text(content.description)}
      mapEmbedUrl={text(content.mapEmbedUrl, text(business.mapEmbedUrl, text(business.googleMapsEmbedUrl)))}
    />
  );
}

export function PremiumContactFaqSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return <PremiumContactFaq title={text(content.title)} description={text(content.description)} faqs={faqsFor(props)} />;
}

export function PremiumContactCtaSection(props: PremiumSectionProps) {
  const content = contentOf(props.section);
  return (
    <PremiumContactCta
      title={text(content.title)}
      description={text(content.description)}
      ctaLabel={text(content.ctaLabel)}
      ctaUrl={sectionHref(props, "cta", "/contact")}
    />
  );
}

// Premium — komponen hasil porting Google AI Studio untuk Website Type Company Profile.
// Namespace "Premium<Slot>" mengikuti konvensi yang sama dengan tema Formal dan Casual,
// supaya gabungan ke registry global (SectionRegistry.tsx) tidak bentrok nama.
export const premiumSectionComponents: Record<string, PremiumSectionComponent> = {
  PremiumHomeHero: PremiumHomeHeroSection,
  PremiumHomeProfileSummary: PremiumHomeProfileSummarySection,
  PremiumHomeServicePreview: PremiumHomeServicePreviewSection,
  PremiumHomePortfolioPreview: PremiumHomePortfolioPreviewSection,
  PremiumHomeTrustProof: PremiumHomeTrustProofSection,
  PremiumHomeCtaContact: PremiumHomeCtaContactSection,

  PremiumAboutOrganizationProfile: PremiumAboutOrganizationProfileSection,
  PremiumAboutHistoryTimeline: PremiumAboutHistoryTimelineSection,
  PremiumAboutVisionMission: PremiumAboutVisionMissionSection,
  PremiumAboutValueStatement: PremiumAboutValueStatementSection,
  PremiumAboutTeamHighlight: PremiumAboutTeamHighlightSection,

  PremiumServicesHero: PremiumServicesHeroSection,
  PremiumServicesGrid: PremiumServicesGridSection,
  PremiumServicesProcess: PremiumServicesProcessSection,
  PremiumServicesBenefits: PremiumServicesBenefitsSection,
  PremiumServicesFaq: PremiumServicesFaqSection,

  PremiumPortfolioHero: PremiumPortfolioHeroSection,
  PremiumPortfolioCategory: PremiumPortfolioCategorySection,
  PremiumPortfolioGrid: PremiumPortfolioGridSection,
  PremiumPortfolioCaseHighlight: PremiumPortfolioCaseHighlightSection,
  PremiumPortfolioCta: PremiumPortfolioCtaSection,

  PremiumArticlesHero: PremiumArticlesHeroSection,
  PremiumFeaturedArticle: PremiumFeaturedArticleSection,
  PremiumArticlePreview: PremiumArticlePreviewSection,

  PremiumArticleDetailHero: PremiumArticleDetailHeroSection,
  PremiumArticleContent: PremiumArticleContentSection,
  PremiumRelatedArticles: PremiumRelatedArticlesSection,
  PremiumArticleCta: PremiumArticleCtaSection,

  PremiumPortfolioDetailHero: PremiumPortfolioDetailHeroSection,
  PremiumPortfolioDetailContent: PremiumPortfolioDetailContentSection,
  PremiumRelatedPortfolios: PremiumRelatedPortfoliosSection,
  PremiumPortfolioDetailCta: PremiumPortfolioDetailCtaSection,

  PremiumContactHero: PremiumContactHeroSection,
  PremiumContactInformation: PremiumContactInformationSection,
  PremiumMapsLocation: PremiumMapsLocationSection,
  PremiumContactFaq: PremiumContactFaqSection,
  PremiumContactCta: PremiumContactCtaSection
};
