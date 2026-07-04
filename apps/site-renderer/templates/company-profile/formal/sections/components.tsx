import type { ReactNode } from "react";

import { Hero as AiHomeHero } from "../source/sections/home/Hero";
import { ProfileSummary as AiHomeProfileSummary } from "../source/sections/home/ProfileSummary";
import { ServicePreview as AiHomeServicePreview } from "../source/sections/home/ServicePreview";
import { PortfolioPreview as AiHomePortfolioPreview } from "../source/sections/home/PortfolioPreview";
import { TrustProof as AiHomeTrustProof } from "../source/sections/home/TrustProof";
import { CtaContact as AiHomeCtaContact } from "../source/sections/home/CtaContact";

import { OrganizationProfile as AiAboutOrganizationProfile } from "../source/sections/about/OrganizationProfile";
import { HistoryTimeline as AiAboutHistoryTimeline } from "../source/sections/about/HistoryTimeline";
import { VisionMission as AiAboutVisionMission } from "../source/sections/about/VisionMission";
import { ValueStatement as AiAboutValueStatement } from "../source/sections/about/ValueStatement";
import { TeamHighlight as AiAboutTeamHighlight } from "../source/sections/about/TeamHighlight";

import { ServiceHero as AiServicesHero } from "../source/sections/services/ServiceHero";
import { ServiceGrid as AiServicesGrid } from "../source/sections/services/ServiceGrid";
import { ServiceProcess as AiServicesProcess } from "../source/sections/services/ServiceProcess";
import { ServiceBenefits as AiServicesBenefits } from "../source/sections/services/ServiceBenefits";
import { ServiceFaq as AiServicesFaq } from "../source/sections/services/ServiceFaq";

import { PortfolioHero as AiPortfolioHero } from "../source/sections/portfolio/PortfolioHero";
import { PortfolioCategory as AiPortfolioCategory } from "../source/sections/portfolio/PortfolioCategory";
import { PortfolioGrid as AiPortfolioGrid } from "../source/sections/portfolio/PortfolioGrid";
import { CaseHighlight as AiPortfolioCaseHighlight } from "../source/sections/portfolio/CaseHighlight";
import { PortfolioCta as AiPortfolioCta } from "../source/sections/portfolio/PortfolioCta";

import { ArticleHero as AiArticlesHero } from "../source/sections/articles/ArticleHero";
import { FeaturedArticle as AiFeaturedArticle } from "../source/sections/articles/FeaturedArticle";
import { ArticlePreview as AiArticlePreview } from "../source/sections/articles/ArticlePreview";

import { ArticleContent as AiArticleContent } from "../source/sections/article-detail/ArticleContent";
import { RelatedArticles as AiRelatedArticles } from "../source/sections/article-detail/RelatedArticles";
import { ArticleCta as AiArticleCta } from "../source/sections/article-detail/ArticleCta";

import { ContactHero as AiContactHero } from "../source/sections/contact/ContactHero";
import { ContactInformation as AiContactInformation } from "../source/sections/contact/ContactInformation";
import { MapsLocation as AiMapsLocation } from "../source/sections/contact/MapsLocation";
import { ContactFaq as AiContactFaq } from "../source/sections/contact/ContactFaq";
import { ContactCta as AiContactCta } from "../source/sections/contact/ContactCta";

import type {
  ArticleItem,
  BenefitItem,
  BrandItem,
  CompanyData,
  FaqItem,
  PortfolioItem,
  ProcessStep,
  ServiceItem,
  StatItem,
  TeamItem,
  TestimonialItem,
  TimelineItem,
  ValueItem,
} from "../source/lib/types";
import type { CrudItem, PublicPagePayload, PublicSection } from "@/lib/types";
import { getSiteHref, resolveTargetHref, getPageHrefByKey, getPortfolioDetailHref } from "@/lib/links";

type FormalSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };
type FormalSectionComponent = (props: FormalSectionProps) => ReactNode;

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
    text(content.illustrationImageUrl) ||
    text(content.photoUrl) ||
    text(content.thumbnailUrl) ||
    fallback
  );
}

function whatsappHref(payload: PublicPagePayload) {
  const business = businessOf(payload);
  const raw = text(business.whatsapp) || text(business.phone);
  const numbers = raw.replace(/[^0-9]/g, "");
  return numbers ? `https://wa.me/${numbers}` : getSiteHref(payload.website.slug, "/contact");
}

// Catatan: pageHref() literal (getSiteHref(siteSlug, path) apa adanya) sudah tidak dipakai
// lagi di file ini — semua link ke halaman List (services/portfolio/articles) dan link
// detail (portfolio/:id, articles/:slug) sekarang resolve dinamis lewat getPageHrefByKey /
// getPortfolioDetailHref / getArticleDetailHref dari '@/lib/links', supaya tetap sinkron
// kalau owner mengubah slug halaman lewat menu Halaman & Sections di dashboard.

function sectionHref(props: FormalSectionProps, prefix: "cta" | "secondaryCta" | string, fallback: string) {
  return resolveTargetHref({
    siteSlug: props.siteSlug,
    navigation: props.payload.navigation,
    content: contentOf(props.section),
    prefix,
    fallback,
  });
}

function splitHeroHeading(rawHeading: string, businessName: string, tagline: string) {
  const heading = text(rawHeading);
  if (!heading) {
    return {
      headingLine1: businessName || "Profil Perusahaan",
      headingHighlight: tagline || "Solusi Profesional",
      headingLine3: "Untuk Bisnis Anda",
    };
  }

  const words = heading.replace(/\s+/g, " ").trim().split(" ");
  if (words.length <= 4) {
    return {
      headingLine1: words.join(" "),
      headingHighlight: tagline || "Solusi Profesional",
      headingLine3: "Untuk Bisnis Anda",
    };
  }

  return {
    headingLine1: words.slice(0, Math.ceil(words.length / 3)).join(" "),
    headingHighlight: words.slice(Math.ceil(words.length / 3), Math.ceil((words.length * 2) / 3)).join(" "),
    headingLine3: words.slice(Math.ceil((words.length * 2) / 3)).join(" "),
  };
}

function serviceIconName(index: number) {
  return ["Shield", "TrendingUp", "Briefcase", "Activity", "Globe", "Award"][index % 6];
}

function mapService(item: CrudItem, index: number): ServiceItem {
  const featureSource = Array.isArray(item.features) ? item.features : [];
  return {
    id: String(item.slug || item.id || `service-${index + 1}`),
    title: titleOf(item),
    description: text(item.description, "Layanan profesional yang disiapkan untuk kebutuhan bisnis Anda."),
    iconName: text(item.iconName, serviceIconName(index)),
    features: featureSource.length
      ? featureSource.map((entry) => String(entry))
      : ["Konsultasi kebutuhan", "Pendampingan proses", "Laporan dan rekomendasi"],
  };
}

function yearFromDate(value: unknown) {
  const raw = text(value);
  if (!raw) return "2026";
  const match = raw.match(/\d{4}/);
  return match ? match[0] : "2026";
}

function mapPortfolio(item: CrudItem, index: number): PortfolioItem {
  return {
    id: String(item.slug || item.id || `portfolio-${index + 1}`),
    title: titleOf(item),
    category: categoryNameOf(item),
    clientName: text(item.clientName, text(item.company, "Klien")),
    year: text(item.year, yearFromDate(item.createdAt || item.updatedAt)),
    description: text(item.description, "Portofolio pekerjaan yang dikelola oleh bisnis ini."),
    imageUrl: imageOf(item, `https://picsum.photos/seed/formal-portfolio-${index + 1}/800/500`),
    challenge: text(item.challenge, "Tantangan utama proyek ini membutuhkan perencanaan yang rapi dan eksekusi yang terukur."),
    solution: text(item.solution, "Tim menyusun pendekatan kerja yang sistematis sesuai kebutuhan klien."),
    result: text(item.result, "Hasil pekerjaan membantu klien mendapatkan proses yang lebih jelas dan terarah."),
    slug: text(item.slug),
  };
}
function mapBrand(item: CrudItem, index: number): BrandItem {
  return {
    id: String(item.id || `brand-${index + 1}`),
    name: text(item.name, titleOf(item) || `Mitra ${index + 1}`),
    logoUrl: text(item.logoUrl, text(item.imageUrl)),
  };
}

function mapTestimonial(item: CrudItem, index: number): TestimonialItem {
  return {
    id: String(item.id || `testimonial-${index + 1}`),
    name: text(item.name, "Klien"),
    role: text(item.role, "Pelanggan"),
    company: text(item.company, "Perusahaan"),
    quote: text(item.quote, "Layanan yang diberikan membantu kami memahami kebutuhan dan mengambil keputusan dengan lebih yakin."),
    rating: numberValue(item.rating, 5),
    logoUrl: text(item.logoUrl, text(item.avatarUrl)),
  };
}

function mapFaq(item: CrudItem, index: number): FaqItem {
  return {
    question: text(item.question, titleOf(item) || `Pertanyaan ${index + 1}`),
    answer: text(item.answer, text(item.description, "Informasi detail akan ditambahkan oleh pemilik website.")),
  };
}

function mapArticle(item: CrudItem, payload: PublicPagePayload, index = 0): ArticleItem {
  const business = businessOf(payload);
  const authorName = text(item.authorName, text(business.name, payload.website.name));
  return {
    slug: String(item.slug || item.id || `article-${index + 1}`),
    title: titleOf(item),
    category: categoryNameOf(item),
    publishDate: text(item.publishedAt, text(item.createdAt, "Belum dipublikasikan")),
    author: {
      name: authorName,
      role: text(item.authorRole, "Penulis"),
      avatarUrl: text(item.authorAvatarUrl, text(business.logoUrl, "https://picsum.photos/seed/formal-author/100/100")),
    },
    summary: text(item.excerpt, text(item.description, "Ringkasan artikel akan tampil di sini.")),
    content: text(item.content, "<p>Konten artikel belum tersedia.</p>"),
    coverImageUrl: imageOf(item, `https://picsum.photos/seed/formal-article-${index + 1}/1200/600`),
    readTime: text(item.readTime, "5 menit membaca"),
  };
}

function companyDataFor(payload: PublicPagePayload): CompanyData {
  const business = businessOf(payload);
  return {
    name: text(business.name, payload.website.name || "Profil Perusahaan"),
    tagline: text(business.tagline, "Mitra profesional untuk kebutuhan bisnis Anda"),
    description: text(business.description, "Website company profile profesional untuk memperkenalkan profil, layanan, portofolio, dan kontak bisnis."),
    logoUrl: text(business.logoUrl, "/assets/images/logo.png"),
    establishedYear: text(business.establishedYear, ""),
    founderName: text(business.founderName, "Tim Pendiri"),
    aboutImage: text(business.aboutImage, text(business.logoUrl, "https://picsum.photos/seed/formal-about/800/600")),
    vision: text(business.vision, "Menjadi mitra terpercaya yang membantu pelanggan mengambil keputusan bisnis dengan lebih jelas, aman, dan terarah."),
    mission: Array.isArray(business.mission)
      ? business.mission.map((item: unknown) => String(item))
      : [
          text(business.missionOne, "Memberikan layanan yang profesional, transparan, dan mudah dipahami."),
          text(business.missionTwo, "Membantu pelanggan menyelesaikan kebutuhan dengan proses yang rapi dan terukur."),
          text(business.missionThree, "Menjaga kepercayaan pelanggan melalui komunikasi yang jelas dan bertanggung jawab."),
        ],
    contact: {
      address: text(business.address, "Alamat bisnis belum diisi."),
      email: text(business.contactEmail, "email@contoh.com"),
      phone: text(business.phone, "-"),
      whatsapp: text(business.whatsapp, "-"),
      workingHours: text(business.workingHours, text(business.operationalHours, "Jam operasional belum diisi.")),
      mapEmbedUrl: text(business.mapEmbedUrl, text(business.googleMapsEmbedUrl, "")),
    },
  };
}

function timelineFor(section: PublicSection): TimelineItem[] | undefined {
  // about.history_timeline schema cuma punya field title & description (tidak ada
  // konfigurasi isi timeline per item), jadi isi timeline murni dari data CRUD
  // BusinessTimeline. Kalau belum ada data, biarkan komponen Formal pakai default
  // bawaan Google AI Studio sendiri (jangan invent field content baru).
  const timelineRows = (section.data?.timelines || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => numberValue(a.sortOrder, 0) - numberValue(b.sortOrder, 0));

  if (!timelineRows.length) return undefined;

  return timelineRows.map((item, index) => ({
    year: text(item.year, String(index + 1).padStart(2, "0")),
    title: text(item.title, `Milestone ${index + 1}`),
    description: text(item.description, "Deskripsi milestone belum diisi."),
  }));
}

// Field "items" adalah tipe repeater (lihat schema Template Pack) — array bebas jumlah,
// tiap item punya {title, value}. Sebelumnya section ini pakai field tetap valueOne..Four
// yang menyebabkan slot 1-3 selalu hardcode dummy data kalau schema section tidak
// mendefinisikan field itu (lihat riwayat perbaikan). Sekarang murni dari input owner.
function itemsOf(section: PublicSection): Array<{ title?: string; value?: string }> {
  const content = contentOf(section);
  const raw = content.items;
  return Array.isArray(raw) ? raw : [];
}

function valuesFor(section: PublicSection): ValueItem[] | undefined {
  const icons = ["Shield", "Award", "Users", "TrendingUp"];
  const items = itemsOf(section)
    .map((item, index) => {
      const title = text(item?.title as string);
      return title ? { title, description: text(item?.value as string), iconName: icons[index % icons.length] } : null;
    })
    .filter(Boolean) as ValueItem[];
  return items.length ? items : undefined;
}

function stepsFor(section: PublicSection): ProcessStep[] | undefined {
  const items = itemsOf(section)
    .map((item, index) => {
      const title = text(item?.title as string);
      return title ? { step: String(index + 1).padStart(2, "0"), title, description: text(item?.value as string) } : null;
    })
    .filter(Boolean) as ProcessStep[];
  return items.length ? items : undefined;
}

function benefitsFor(section: PublicSection): BenefitItem[] | undefined {
  const icons = ["Shield", "Compass", "Users", "CheckCircle"];
  const items = itemsOf(section)
    .map((item, index) => {
      const title = text(item?.title as string);
      return title ? { title, description: text(item?.value as string), iconName: icons[index % icons.length] } : null;
    })
    .filter(Boolean) as BenefitItem[];
  return items.length ? items : undefined;
}

function teamFor(section: PublicSection): TeamItem[] | undefined {
  // about.team_highlight schema cuma punya title, description, imageUrl (tidak ada
  // konfigurasi daftar anggota tim lewat content), jadi anggota tim murni dari data
  // CRUD TeamMember. Kalau belum ada data, biarkan default bawaan AI Studio yang tampil.
  const teamRows = (section.data?.teamMembers || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => numberValue(a.sortOrder, 0) - numberValue(b.sortOrder, 0));

  if (!teamRows.length) return undefined;

  return teamRows.map((item, index) => ({
    id: String(item.id || `team-${index + 1}`),
    name: text(item.name, `Anggota Tim ${index + 1}`),
    role: text(item.role, "Tim Profesional"),
    bio: text(item.bio, "Profil tim belum diisi."),
    imageUrl: text(item.imageUrl, `https://picsum.photos/seed/formal-team-${index + 1}/400/400`),
    social: {
      linkedin: text(item.linkedinUrl, text(item.linkedin)),
      twitter: text(item.twitterUrl, text(item.twitter)),
    },
  }));
}



function faqsFor(section: PublicSection, fallback: CrudItem[] = []) {
  return (section.data?.faqs?.length ? section.data.faqs : fallback).slice(0, 10).map(mapFaq);
}

function articlesFor(props: FormalSectionProps) {
  return (props.section.data?.articles || []).map((item, index) => mapArticle(item, props.payload, index));
}

function currentArticleFor(props: FormalSectionProps) {
  return mapArticle(props.section.data?.article || ({} as CrudItem), props.payload, 0);
}


function faqsForPage(props: FormalSectionProps, pages: string[]): FaqItem[] {
  return (props.section.data?.faqs || [])
    .filter((item) => {
      const page = text(item.pageKey, text(item.page, "general"));
      return pages.includes(page);
    })
    .map(mapFaq);
}
export function FormalHomeHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const businessName = text(business.name, props.payload.website.name || "Profil Perusahaan");
  const tagline = text(business.tagline, "Solusi Profesional");
  const headingParts = splitHeroHeading(text(content.title), businessName, tagline);

  return (
    <AiHomeHero
      eyebrow={text(content.badge, tagline || "Mitra Korporat Terpercaya Indonesia")}
      headingLine1={headingParts.headingLine1}
      headingHighlight={headingParts.headingHighlight}
      headingLine3={headingParts.headingLine3}
      description={text(content.description, text(business.description, props.payload.page.purpose || "Website company profile profesional untuk memperkenalkan bisnis, layanan, portofolio, dan informasi kontak kepada calon klien."))}
      primaryCtaLabel={text(content.ctaLabel)}
      primaryCtaHref={sectionHref(props, "cta", "/services")}
      secondaryCtaLabel={text(content.secondaryCtaLabel)}
      secondaryCtaHref={sectionHref(props, "secondaryCta", "/contact")}
      imageUrl={contentImage(content, text(business.heroImageUrl, text(business.logoUrl, "https://picsum.photos/seed/integra-hero/600/600")))}
      imageAlt={text(business.logoAlt, businessName)}
    />
  );
}

export function FormalHomeProfileSummary(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const businessName = text(business.name, props.payload.website.name || "Profil Perusahaan");

  return (
    <AiHomeProfileSummary
      imageUrl={contentImage(content, text(business.aboutImage, text(business.logoUrl, "https://picsum.photos/seed/integra-about/800/600")))}
      imageAlt={businessName}
      title={text(content.title, `Mengenal ${businessName}`)}
      badge={text(content.badge)}
      description={text(content.description, text(business.description, "Ceritakan profil bisnis Anda agar calon pelanggan memahami layanan, pengalaman, dan alasan untuk menghubungi Anda."))}
      ctaLabel={text(content.ctaLabel)}
      ctaHref={sectionHref(props, "cta", "/about")}
    />
  );
}

export function FormalHomeServicePreview(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const services = (props.section.data?.services || []).slice(0, 3).map(mapService);

  return (
    <AiHomeServicePreview
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      services={services}
      allServicesHref={sectionHref(props, "cta", getPageHrefByKey(props.siteSlug, props.payload.navigation, "services", "/services"))}
      allServicesLabel={text(content.ctaLabel)}
      imageUrl={contentImage(content)}
    />
  );
}

export function FormalHomePortfolioPreview(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const portfolios = (props.section.data?.portfolios || []).slice(0, 3).map(mapPortfolio);

  return (
    <AiHomePortfolioPreview
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      portfolios={portfolios}
      allPortfolioHref={sectionHref(props, "cta", getPageHrefByKey(props.siteSlug, props.payload.navigation, "portfolio", "/portfolio"))}
      allPortfolioLabel={text(content.ctaLabel)}
      portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)}
      imageUrl={contentImage(content)}
    />
  );
}

export function FormalHomeTrustProof(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const testimonialRows = props.section.data?.testimonials || [];
  // Prioritaskan testimoni yang ditandai featured/unggulan dari CRUD, baru sisanya,
  // maksimal 3 total sesuai instruksi QA.
  const featuredRows = testimonialRows.filter((item) => item.isFeatured);
  const restRows = testimonialRows.filter((item) => !item.isFeatured);
  const testimonials = [...featuredRows, ...restRows].slice(0, 3).map(mapTestimonial);
  const brands = (props.section.data?.brands || []).map(mapBrand);
  const metrics = itemsOf(props.section)
    .map((item) => ({ value: text(item?.title as string), label: text(item?.value as string) }))
    .filter((m) => m.label && m.value);

  return (
    <AiHomeTrustProof
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      testimonials={testimonials}
      metrics={metrics}
      brands={brands}
    />
  );
}

export function FormalHomeCtaContact(props: FormalSectionProps) {
  const content = contentOf(props.section);

  return (
    <AiHomeCtaContact
      title={text(content.title)}
      description={text(content.description)}
      primaryCtaLabel={text(content.ctaLabel)}
      primaryCtaHref={sectionHref(props, "cta", "/contact")}
      imageUrl={contentImage(content)}
    />
  );
}

export function FormalAboutOrganizationProfile(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const company = companyDataFor(props.payload);
  return (
    <AiAboutOrganizationProfile
      company={company}
      title={text(content.title, `Membangun Kepercayaan Bersama ${company.name}`)}
      badge={text(content.badge)}
      paragraphs={[text(content.description, company.description)]}
      imageUrl={contentImage(content, company.aboutImage)}
      imageAlt={company.name}
    />
  );
}

export function FormalAboutHistoryTimeline(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return (
    <AiAboutHistoryTimeline
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      items={timelineFor(props.section)}
    />
  );
}

export function FormalAboutVisionMission(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const company = companyDataFor(props.payload);
  const business = businessOf(props.payload);
  const missionFallback = text(business.mission) || company.mission.join(" ");
  return (
    <AiAboutVisionMission
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      visionTitle={text(content.visionTitle)}
      missionTitle={text(content.missionTitle)}
      vision={text(content.vision, company.vision)}
      mission={text(content.mission, missionFallback)}
    />
  );
}

export function FormalAboutValueStatement(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return (
    <AiAboutValueStatement
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      values={valuesFor(props.section)}
    />
  );
}

export function FormalAboutTeamHighlight(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return (
    <AiAboutTeamHighlight
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      members={teamFor(props.section)}
      imageUrl={contentImage(content)}
    />
  );
}

export function FormalServicesHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesHero title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)}/>;
}

export function FormalServicesGrid(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesGrid title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} services={(props.section.data?.services || []).map(mapService)} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

export function FormalServicesProcess(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesProcess title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} steps={stepsFor(props.section)} />;
}

export function FormalServicesBenefits(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesBenefits title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} benefits={benefitsFor(props.section)} />;
}

export function FormalServicesFaq(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesFaq title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} faqs={faqsForPage(props, ["services", "service", "general", "umum"]).length > 0 ? faqsForPage(props, ["services", "service", "general", "umum"]) : faqsFor(props.section)} />;
}

export function FormalPortfolioHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiPortfolioHero title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)}/>;
}

export function FormalPortfolioCategory(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const categories = [...new Set((props.section.data?.portfolioCategories || []).map((item) => titleOf(item)))];
  if (categories.length === 0) return null;
  return <AiPortfolioCategory categories={categories} title={text(content.title)} subtitle={text(content.description)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

export function FormalPortfolioGrid(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiPortfolioGrid portfolios={(props.section.data?.portfolios || []).map(mapPortfolio)} activeCategory="Semua" title={text(content.title)} subtitle={text(content.description)} portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

export function FormalPortfolioCaseHighlight(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const caseProject = (props.section.data?.portfolios || []).find((item) => item.isFeatured) || props.section.data?.portfolios?.[0];
  const project = caseProject ? mapPortfolio(caseProject, 0) : undefined;
  return <AiPortfolioCaseHighlight title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} project={project} imageUrl={contentImage(content)} />;
}

export function FormalPortfolioCta(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiPortfolioCta title={text(content.title)} description={text(content.description)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} imageUrl={contentImage(content)} />;
}

export function FormalArticlesHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiArticlesHero title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)}/>;
}

export function FormalFeaturedArticle(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const articles = articlesFor(props);
  const article = articles.find((item, index) => props.section.data?.articles?.[index]?.isFeatured) || articles[0];
  const business = businessOf(props.payload);
  return article ? <AiFeaturedArticle article={article} articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")} title={text(content.title)} subtitle={text(content.description)} businessLogoUrl={text(business.logoUrl)} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} /> : null;
}

export function FormalArticlePreview(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiArticlePreview articles={articlesFor(props)} articlesHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")} title={text(content.title)} subtitle={text(content.description)} imageUrl={contentImage(content)} ctaLabel={text(content.ctaLabel)} />;
}

export function FormalArticleContent(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  return (
    <AiArticleContent
      article={currentArticleFor(props)}
      backHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")}
      businessName={text(business.name, props.payload.website.name)}
      businessLogoUrl={text(business.logoUrl)}
      contentMaxWidth={text(content.contentMaxWidth, "normal")}
      showAuthor={boolValue(content.showAuthor, true)}
      showPublishDate={boolValue(content.showPublishDate, true)}
      showShareLink={boolValue(content.showShareLink, true)}
    />
  );
}

export function FormalRelatedArticles(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const article = currentArticleFor(props);
  const related = (props.section.data?.relatedArticles || []).map((item, index) => mapArticle(item, props.payload, index));
  return <AiRelatedArticles articles={related} currentSlug={article.slug} baseHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "articles", "/articles")} title={text(content.title)} subtitle={text(content.description)} />;
}

export function FormalArticleCta(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiArticleCta title={text(content.title)} description={text(content.description)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} imageUrl={contentImage(content)} />;
}

export function FormalContactHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiContactHero title={text(content.title)} subtitle={text(content.description)} badge={text(content.badge)} imageUrl={contentImage(content)}/>;
}

export function FormalContactInformation(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  // showAddress/showEmail/showWhatsapp sudah tidak ada lagi di schema section (field itu
  // dihapus supaya tidak dobel sumber data dengan Business Profile) — sekarang otomatis
  // mengikuti aturan "kosong = hilang": kalau field itu memang belum diisi di Business
  // Profile, blok terkait tidak ditampilkan sama sekali, bukan menampilkan teks placeholder.
  return (
    <AiContactInformation
      title={text(content.title)}
      subtitle={text(content.description)}
      badge={text(content.badge)}
      company={companyDataFor(props.payload)}
      showAddress={Boolean(text(business.address as string))}
      showEmail={Boolean(text(business.contactEmail as string))}
      showWhatsapp={Boolean(text(business.whatsapp as string))}
    />
  );
}

export function FormalMapsLocation(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const company = companyDataFor(props.payload);
  // mapEmbedUrl di schema adalah field section-level resmi: pakai itu kalau diisi,
  // baru fallback ke mapEmbedUrl di Profil Bisnis.
  const companyWithMapOverride = {
    ...company,
    contact: { ...company.contact, mapEmbedUrl: text(content.mapEmbedUrl, company.contact.mapEmbedUrl) }
  };
  return <AiMapsLocation title={text(content.title)} subtitle={text(content.description)} company={companyWithMapOverride} />;
}

export function FormalContactFaq(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiContactFaq title={text(content.title)} subtitle={text(content.description)} faqs={faqsFor(props.section)} siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />;
}

export function FormalContactCta(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiContactCta title={text(content.title)} description={text(content.description)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} imageUrl={contentImage(content)} />;
}


// ---- Portfolio Detail ----

import { PortfolioDetailContent as AiPortfolioDetailContent } from "../source/sections/portfolio-detail/PortfolioDetailContent";
import { PortfolioDetailCta as AiPortfolioDetailCta } from "../source/sections/portfolio-detail/PortfolioDetailCta";
import { RelatedPortfolios as AiRelatedPortfolios } from "../source/sections/portfolio-detail/RelatedPortfolios";

export function FormalPortfolioDetailContent(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const sectionData = props.section.data as any;
  const project = sectionData.portfolio
  ? mapPortfolio(sectionData.portfolio, 0)
  : (props.section.data?.portfolios?.[0] ? mapPortfolio(props.section.data.portfolios[0], 0) : undefined);
  return (
    <AiPortfolioDetailContent
      project={project}
      badge={text(content.badge)}
      backHref={getPageHrefByKey(props.siteSlug, props.payload.navigation, "portfolio", "/portfolio")}
      businessName={text(business.name, props.payload.website.name)}
      businessLogoUrl={text(business.logoUrl)}
      contentMaxWidth={text(content.contentMaxWidth, "normal")}
      showAuthor={boolValue(content.showAuthor, true)}
      showPublishDate={boolValue(content.showPublishDate, true)}
      showShareLink={boolValue(content.showShareLink, true)}
    />
  );
}

export function FormalPortfolioDetailCta(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiPortfolioDetailCta title={text(content.title)} description={text(content.description)} ctaLabel={text(content.ctaLabel)} ctaHref={sectionHref(props, "cta", "/contact")} imageUrl={contentImage(content)} />;
}

export function FormalRelatedPortfolios(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const sectionData = props.section.data as any;
  const currentProject = sectionData?.portfolio ? mapPortfolio(sectionData.portfolio, 0) : undefined;
  const relatedRaw = sectionData?.relatedPortfolios || sectionData?.portfolios || [];
  const related = relatedRaw.map((item: CrudItem, index: number) => mapPortfolio(item, index));
  return (
    <AiRelatedPortfolios
      portfolios={related}
      currentSlug={currentProject?.slug}
      title={text(content.title)}
      subtitle={text(content.description)}
      portfolioDetailHref={(id: string) => getPortfolioDetailHref(props.siteSlug, props.payload.navigation, id)}
    />
  );
}

// ---- Global Chrome (Navbar & Footer) ----
// Slot "global.navbar" / "global.footer" — dibuat sebagai section biasa (bukan hardcode
// di SiteShell) supaya bisa dipilih & di-preview lewat mekanisme "Pilih Tampilan Section"
// yang sama seperti section lain, termasuk lintas tema. Tidak ada field owner-editable
// (schema-nya kosong) karena isinya (nav items, logo, kontak) sudah otomatis dari
// Halaman & Menu + Business Profile.
import { FormalSiteHeader } from "../source/layout/FormalSiteHeader";
import { FormalSiteFooter } from "../source/layout/FormalSiteFooter";

export function FormalGlobalNavbar(props: FormalSectionProps) {
  const business = businessOf(props.payload);
  const navbarItems = props.payload.navigation?.navbar?.items || [];
  const cta = props.payload.navigation?.navbar?.cta;
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);
  return (
    <FormalSiteHeader
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

export function FormalGlobalFooter(props: FormalSectionProps) {
  const business = businessOf(props.payload);
  const footerItems = props.payload.navigation?.footer?.items || [];
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);
  return (
    <FormalSiteFooter
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

export const formalSectionComponents: Record<string, FormalSectionComponent> = {
  FormalHomeHero,
  FormalHomeProfileSummary,
  FormalHomeServicePreview,
  FormalHomePortfolioPreview,
  FormalHomeTrustProof,
  FormalHomeCtaContact,
  FormalAboutOrganizationProfile,
  FormalAboutHistoryTimeline,
  FormalAboutVisionMission,
  FormalAboutValueStatement,
  FormalAboutTeamHighlight,
  FormalServicesHero,
  FormalServicesGrid,
  FormalServicesProcess,
  FormalServicesBenefits,
  FormalServicesFaq,
  FormalPortfolioHero,
  FormalPortfolioCategory,
  FormalPortfolioGrid,
  FormalPortfolioCaseHighlight,
  FormalPortfolioCta,
  FormalArticlesHero,
  FormalFeaturedArticle,
  FormalArticlePreview,
  FormalArticleContent,
  FormalRelatedArticles,
  FormalArticleCta,
  FormalContactHero,
  FormalContactInformation,
  FormalMapsLocation,
  FormalContactFaq,
  FormalContactCta,

  FormalPortfolioDetailContent,
  FormalRelatedPortfolios,
  FormalPortfolioDetailCta,

  FormalGlobalNavbar,
  FormalGlobalFooter,
};
