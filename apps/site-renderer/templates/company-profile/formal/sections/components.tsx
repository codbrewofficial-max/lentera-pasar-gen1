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

import { ArticleDetailHero as AiArticleDetailHero } from "../source/sections/article-detail/ArticleDetailHero";
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
import { getSiteHref, resolveTargetHref } from "@/lib/links";

type FormalSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };
type FormalSectionComponent = (props: FormalSectionProps) => ReactNode;

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
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

function pageHref(siteSlug: string, path: string) {
  return getSiteHref(siteSlug, path);
}

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

function statsFor(payload: PublicPagePayload, section: PublicSection): StatItem[] {
  const content = contentOf(section);
  const services = section.data?.services || [];
  const portfolios = section.data?.portfolios || [];
  const testimonials = section.data?.testimonials || [];
  const configured = [1, 2, 3, 4]
    .map((n) => {
      const word = ["", "One", "Two", "Three", "Four"][n];
      const label = text(content[`metric${word}Label`]);
      const value = text(content[`metric${word}Value`]);
      return label && value ? { label, value } : null;
    })
    .filter(Boolean) as StatItem[];

  if (configured.length) return configured;
  const business = businessOf(payload);
  const establishedYear = text(business.establishedYear || content.establishedYear);
  const yearMetric = establishedYear ? [{ label: "Tahun Berdiri", value: establishedYear }] : [];
  return [
    ...yearMetric,
    { label: "Layanan", value: String(services.length) },
    { label: "Portofolio", value: String(portfolios.length) },
    { label: "Testimoni", value: String(testimonials.length) },
  ].slice(0, 4);
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
      email: text(business.email, "email@contoh.com"),
      phone: text(business.phone, "-"),
      whatsapp: text(business.whatsapp, "-"),
      workingHours: text(business.workingHours, text(business.operationalHours, "Jam operasional belum diisi.")),
      mapEmbedUrl: text(business.mapEmbedUrl, text(business.googleMapsEmbedUrl, "")),
    },
  };
}

function timelineFor(payload: PublicPagePayload, section: PublicSection): TimelineItem[] {
  const content = contentOf(section);
  const business = businessOf(payload);
  if (Array.isArray(content.timeline)) {
    return content.timeline.map((item: any, index: number) => ({
      year: text(item.year, String(index + 1).padStart(2, "0")),
      title: text(item.title, `Milestone ${index + 1}`),
      description: text(item.description, "Deskripsi milestone belum diisi."),
    }));
  }
  return [
    {
      year: text(business.establishedYear, text(content.yearOne, "Awal")),
      title: text(content.titleOne, "Awal Perjalanan"),
      description: text(content.descriptionOne, `Perjalanan ${text(business.name, payload.website.name)} dimulai dengan komitmen melayani pelanggan secara profesional.`),
    },
    {
      year: text(content.yearTwo, "Kini"),
      title: text(content.titleTwo, "Pertumbuhan Layanan"),
      description: text(content.descriptionTwo, "Layanan terus dikembangkan agar semakin relevan dengan kebutuhan pelanggan."),
    },
  ];
}

function valuesFor(section: PublicSection): ValueItem[] {
  const content = contentOf(section);
  if (Array.isArray(content.values)) {
    return content.values.map((item: any, index: number) => ({
      title: text(item.title, `Nilai ${index + 1}`),
      description: text(item.description, "Deskripsi nilai belum diisi."),
      iconName: text(item.iconName, ["Shield", "Award", "Users", "TrendingUp"][index % 4]),
    }));
  }
  return [
    { title: text(content.valueOneTitle, "Integritas"), description: text(content.valueOneDescription, "Menjaga kepercayaan melalui proses kerja yang jujur dan bertanggung jawab."), iconName: "Shield" },
    { title: text(content.valueTwoTitle, "Profesional"), description: text(content.valueTwoDescription, "Mengutamakan kualitas, ketelitian, dan komunikasi yang jelas."), iconName: "Award" },
    { title: text(content.valueThreeTitle, "Kolaboratif"), description: text(content.valueThreeDescription, "Bekerja bersama pelanggan untuk menemukan solusi yang realistis."), iconName: "Users" },
    { title: text(content.valueFourTitle, "Adaptif"), description: text(content.valueFourDescription, "Terus menyesuaikan pendekatan sesuai perubahan kebutuhan bisnis."), iconName: "TrendingUp" },
  ];
}

function teamFor(payload: PublicPagePayload, section: PublicSection): TeamItem[] {
  const content = contentOf(section);
  const business = businessOf(payload);
  if (Array.isArray(content.team)) {
    return content.team.map((item: any, index: number) => ({
      id: text(item.id, `team-${index + 1}`),
      name: text(item.name, `Anggota Tim ${index + 1}`),
      role: text(item.role, "Tim Profesional"),
      bio: text(item.bio, "Profil tim belum diisi."),
      imageUrl: text(item.imageUrl, `https://picsum.photos/seed/formal-team-${index + 1}/400/400`),
      social: { linkedin: text(item.linkedin), twitter: text(item.twitter) },
    }));
  }
  return [
    {
      id: "team-main",
      name: text(business.ownerName, text(business.founderName, `Tim ${text(business.name, payload.website.name)}`)),
      role: text(business.ownerRole, "Tim Utama"),
      bio: text(content.teamDescription, "Tim kami membantu pelanggan memahami kebutuhan, memilih solusi yang tepat, dan menjalankan proses dengan lebih rapi."),
      imageUrl: text(business.ownerImageUrl, text(business.logoUrl, "https://picsum.photos/seed/formal-team-main/400/400")),
      social: { linkedin: text(business.linkedinUrl) },
    },
  ];
}

function stepsFor(section: PublicSection): ProcessStep[] {
  const content = contentOf(section);
  if (Array.isArray(content.steps)) {
    return content.steps.map((item: any, index: number) => ({
      step: text(item.step, String(index + 1).padStart(2, "0")),
      title: text(item.title, `Tahap ${index + 1}`),
      description: text(item.description, "Deskripsi tahap belum diisi."),
    }));
  }
  return [
    { step: "01", title: text(content.stepOneTitle, "Konsultasi Awal"), description: text(content.stepOneDescription, "Memahami kebutuhan dan tujuan pelanggan secara ringkas."), },
    { step: "02", title: text(content.stepTwoTitle, "Analisis Kebutuhan"), description: text(content.stepTwoDescription, "Menyusun gambaran solusi berdasarkan data dan prioritas."), },
    { step: "03", title: text(content.stepThreeTitle, "Pelaksanaan"), description: text(content.stepThreeDescription, "Menjalankan pekerjaan dengan alur yang jelas dan terukur."), },
    { step: "04", title: text(content.stepFourTitle, "Evaluasi"), description: text(content.stepFourDescription, "Meninjau hasil dan memberikan rekomendasi lanjutan."), },
  ];
}

function benefitsFor(section: PublicSection): BenefitItem[] {
  const content = contentOf(section);
  if (Array.isArray(content.benefits)) {
    return content.benefits.map((item: any, index: number) => ({
      title: text(item.title, `Manfaat ${index + 1}`),
      description: text(item.description, "Deskripsi manfaat belum diisi."),
      iconName: text(item.iconName, ["Shield", "Compass", "Users", "CheckCircle"][index % 4]),
    }));
  }
  return [
    { title: text(content.benefitOneTitle, "Proses Lebih Jelas"), description: text(content.benefitOneDescription, "Pelanggan memahami alur layanan sejak awal."), iconName: "Shield" },
    { title: text(content.benefitTwoTitle, "Pendekatan Terarah"), description: text(content.benefitTwoDescription, "Solusi disesuaikan dengan kebutuhan prioritas."), iconName: "Compass" },
    { title: text(content.benefitThreeTitle, "Komunikasi Mudah"), description: text(content.benefitThreeDescription, "Setiap proses dijelaskan dengan bahasa yang mudah dipahami."), iconName: "Users" },
    { title: text(content.benefitFourTitle, "Hasil Terukur"), description: text(content.benefitFourDescription, "Rekomendasi dan tindakan dibuat agar dapat ditindaklanjuti."), iconName: "CheckCircle" },
  ];
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

export function FormalHomeHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const businessName = text(business.name, props.payload.website.name || "Profil Perusahaan");
  const tagline = text(business.tagline, "Solusi Profesional");
  const headingParts = splitHeroHeading(text(content.heading), businessName, tagline);

  return (
    <AiHomeHero
      eyebrow={text(content.eyebrow, tagline || "Mitra Korporat Terpercaya Indonesia")}
      headingLine1={text(content.headingLine1, headingParts.headingLine1)}
      headingHighlight={text(content.headingHighlight, headingParts.headingHighlight)}
      headingLine3={text(content.headingLine3, headingParts.headingLine3)}
      description={text(content.description, text(business.description, props.payload.page.purpose || "Website company profile profesional untuk memperkenalkan bisnis, layanan, portofolio, dan informasi kontak kepada calon klien."))}
      primaryCtaLabel={text(content.ctaLabel, "Lihat Layanan")}
      primaryCtaHref={sectionHref(props, "cta", "/services")}
      secondaryCtaLabel={text(content.secondaryCtaLabel, "Hubungi Kami")}
      secondaryCtaHref={sectionHref(props, "secondaryCta", "/contact")}
      imageUrl={contentImage(content, text(business.heroImageUrl, text(business.logoUrl, "https://picsum.photos/seed/integra-hero/600/600")))}
      imageAlt={text(content.imageAlt, text(business.logoAlt, businessName))}
      visualLabel={text(content.visualLabel, "Lokasi Bisnis")}
      visualText={text(content.visualText, text(business.address, businessName))}
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
      imageAlt={text(content.imageAlt, businessName)}
      establishedYear={text(content.establishedYear, text(business.establishedYear, ""))}
      historyLabel={text(content.historyLabel, "Sejarah Kami")}
      historyText={text(content.historyText)}
      title={text(content.heading, `Mengenal ${businessName}`)}
      subtitle={text(content.subheading, text(business.tagline, "Profil singkat tentang bisnis, pengalaman, dan nilai yang kami bawa untuk pelanggan."))}
      badge={text(content.eyebrow, "Profil Singkat")}
      description={text(content.description, text(business.description, "Ceritakan profil bisnis Anda agar calon pelanggan memahami layanan, pengalaman, dan alasan untuk menghubungi Anda."))}
      stats={statsFor(props.payload, props.section)}
      ctaLabel={text(content.ctaLabel, "Pelajari Profil Kami")}
      ctaHref={sectionHref(props, "cta", "/about")}
    />
  );
}

export function FormalHomeServicePreview(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const services = (props.section.data?.services || []).slice(0, 3).map(mapService);

  return (
    <AiHomeServicePreview
      title={text(content.heading, "Layanan Utama Kami")}
      subtitle={text(content.description, "Pilih layanan unggulan yang paling ingin ditampilkan di halaman utama.")}
      badge={text(content.eyebrow, "Fokus Solusi")}
      services={services}
      allServicesHref={pageHref(props.siteSlug, "/services")}
      allServicesLabel={text(content.ctaLabel, "Lihat Semua Layanan")}
    />
  );
}

export function FormalHomePortfolioPreview(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const portfolios = (props.section.data?.portfolios || []).slice(0, 3).map(mapPortfolio);

  return (
    <AiHomePortfolioPreview
      title={text(content.heading, "Portofolio Pilihan")}
      subtitle={text(content.description, "Tampilkan portofolio unggulan agar calon pelanggan melihat bukti pekerjaan Anda.")}
      badge={text(content.eyebrow, "Rekam Jejak")}
      portfolios={portfolios}
      allPortfolioHref={pageHref(props.siteSlug, "/portfolio")}
      allPortfolioLabel={text(content.ctaLabel, "Lihat Semua Portofolio")}
    />
  );
}

export function FormalHomeTrustProof(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const testimonials = (props.section.data?.testimonials || []).slice(0, 5).map(mapTestimonial);

  return (
    <AiHomeTrustProof
      title={text(content.heading, "Dipercaya oleh Pelanggan Kami")}
      subtitle={text(content.description, "Testimoni aktif akan tampil maksimal 5 item di bagian ini.")}
      badge={text(content.eyebrow, "Jaminan Mutu")}
      testimonials={testimonials}
    />
  );
}

export function FormalHomeCtaContact(props: FormalSectionProps) {
  const content = contentOf(props.section);

  return (
    <AiHomeCtaContact
      title={text(content.heading, "Siap Berdiskusi dengan Kami?")}
      description={text(content.description, "Hubungi kami untuk konsultasi awal atau informasi lebih lanjut tentang layanan yang tersedia.")}
      primaryCtaLabel={text(content.ctaLabel, "Hubungi Kami")}
      primaryCtaHref={sectionHref(props, "cta", "/contact")}
      whatsappLabel={text(content.secondaryCtaLabel, "Hubungi via WhatsApp")}
      whatsappHref={whatsappHref(props.payload)}
      footnote={text(content.footnote, "Respons sesuai jam operasional bisnis")}
    />
  );
}

export function FormalAboutOrganizationProfile(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const company = companyDataFor(props.payload);
  return (
    <AiAboutOrganizationProfile
      company={company}
      title={text(content.heading, `Membangun Kepercayaan Bersama ${company.name}`)}
      subtitle={text(content.description, company.tagline)}
      badge={text(content.eyebrow, "Profil Organisasi")}
      paragraphs={[
        text(content.paragraphOne, `${company.name} hadir untuk membantu pelanggan memahami layanan, proses kerja, dan nilai profesional yang ditawarkan.`),
        text(content.paragraphTwo, company.description),
        text(content.paragraphThree, "Kami berkomitmen menjaga komunikasi yang jelas, proses yang rapi, dan hasil kerja yang dapat dipertanggungjawabkan."),
      ]}
      imageUrl={contentImage(content, company.aboutImage)}
      imageAlt={text(content.imageAlt, company.name)}
      locationTitle={text(content.locationTitle, "Alamat Bisnis")}
      locationValue={text(content.locationValue, company.contact.address)}
      certificationTitle={text(content.certificationTitle, "Komitmen Layanan")}
      certificationValue={text(content.certificationValue, "Profesional & Terpercaya")}
      accentLabel={text(content.accentLabel, "Formal Profile")}
    />
  );
}

export function FormalAboutHistoryTimeline(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return (
    <AiAboutHistoryTimeline
      title={text(content.heading, "Milestone & Sejarah Perkembangan")}
      subtitle={text(content.description, "Ikuti perjalanan bisnis dan perkembangan layanan dari waktu ke waktu.")}
      badge={text(content.eyebrow, "Linimasa")}
      items={timelineFor(props.payload, props.section)}
    />
  );
}

export function FormalAboutVisionMission(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const company = companyDataFor(props.payload);
  return (
    <AiAboutVisionMission
      title={text(content.heading, "Visi dan Misi Kami")}
      subtitle={text(content.description, "Arah kerja yang menjadi dasar pelayanan kami kepada pelanggan.")}
      badge={text(content.eyebrow, "Arah Strategis")}
      vision={text(content.vision, company.vision)}
      mission={Array.isArray(content.mission) ? content.mission.map((item: unknown) => String(item)) : company.mission}
    />
  );
}

export function FormalAboutValueStatement(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return (
    <AiAboutValueStatement
      title={text(content.heading, "Nilai yang Kami Pegang")}
      subtitle={text(content.description, "Prinsip kerja yang menjaga kualitas layanan dan kepercayaan pelanggan.")}
      badge={text(content.eyebrow, "Nilai Inti")}
      values={valuesFor(props.section)}
    />
  );
}

export function FormalAboutTeamHighlight(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return (
    <AiAboutTeamHighlight
      title={text(content.heading, "Tim Profesional Kami")}
      subtitle={text(content.description, "Orang-orang di balik layanan yang membantu pelanggan mendapatkan solusi terbaik.")}
      badge={text(content.eyebrow, "Tim Kami")}
      members={teamFor(props.payload, props.section)}
    />
  );
}

export function FormalServicesHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesHero title={text(content.heading, "Layanan Profesional untuk Kebutuhan Bisnis")} subtitle={text(content.description, "Pilih layanan yang paling sesuai dengan kebutuhan pelanggan Anda.")} badge={text(content.eyebrow, "Layanan Kami")} />;
}

export function FormalServicesGrid(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesGrid title={text(content.heading, "Layanan Terintegrasi Sesuai Kebutuhan Bisnis")} subtitle={text(content.description, "Setiap layanan disusun agar mudah dipahami dan relevan dengan kebutuhan pelanggan.")} badge={text(content.eyebrow, "Portofolio Layanan")} services={(props.section.data?.services || []).map(mapService)} />;
}

export function FormalServicesProcess(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesProcess title={text(content.heading, "Alur Kerja yang Jelas dan Terukur")} subtitle={text(content.description, "Setiap pekerjaan dijalankan melalui tahapan yang rapi agar pelanggan memahami proses sejak awal.")} badge={text(content.eyebrow, "Proses Kerja")} steps={stepsFor(props.section)} />;
}

export function FormalServicesBenefits(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesBenefits title={text(content.heading, "Manfaat Menggunakan Layanan Kami")} subtitle={text(content.description, "Keunggulan yang membantu pelanggan mengambil keputusan dengan lebih yakin.")} badge={text(content.eyebrow, "Manfaat Layanan")} benefits={benefitsFor(props.section)} />;
}

export function FormalServicesFaq(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiServicesFaq title={text(content.heading, "Tanya Jawab Seputar Layanan")} subtitle={text(content.description, "Temukan jawaban cepat atas pertanyaan umum tentang layanan kami.")} badge={text(content.eyebrow, "Pertanyaan Umum")} faqs={faqsFor(props.section)} />;
}

export function FormalPortfolioHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiPortfolioHero title={text(content.heading, "Portofolio dan Studi Kasus")} subtitle={text(content.description, "Lihat contoh pekerjaan, pengalaman, dan hasil yang pernah kami tangani.")} badge={text(content.eyebrow, "Portofolio Kami")} />;
}

export function FormalPortfolioCategory(props: FormalSectionProps) {
  const categories = ["Semua", ...new Set((props.section.data?.portfolioCategories || []).map((item) => titleOf(item)))];
  return <AiPortfolioCategory categories={categories.length > 1 ? categories : ["Semua"]} activeCategory="Semua" />;
}

export function FormalPortfolioGrid(props: FormalSectionProps) {
  return <AiPortfolioGrid portfolios={(props.section.data?.portfolios || []).map(mapPortfolio)} activeCategory="Semua" />;
}

export function FormalPortfolioCaseHighlight(props: FormalSectionProps) {
  const content = contentOf(props.section);
  const project = props.section.data?.portfolios?.[0] ? mapPortfolio(props.section.data.portfolios[0], 0) : undefined;
  return <AiPortfolioCaseHighlight title={text(content.heading, "Studi Kasus Pilihan")} subtitle={text(content.description, "Sorotan pekerjaan yang menunjukkan pendekatan dan hasil layanan kami.")} badge={text(content.eyebrow, "Case Highlight")} project={project} />;
}

export function FormalPortfolioCta(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiPortfolioCta title={text(content.heading, "Ingin Mendiskusikan Kebutuhan Anda?")} description={text(content.description, "Hubungi kami untuk membahas kebutuhan dan rencana pekerjaan Anda.")} ctaLabel={text(content.ctaLabel, "Hubungi Kami")} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

export function FormalArticlesHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiArticlesHero title={text(content.heading, "Artikel dan Insight")} subtitle={text(content.description, "Baca informasi terbaru, panduan, dan pemikiran yang relevan untuk pelanggan.")} badge={text(content.eyebrow, "Publikasi")}/>;
}

export function FormalFeaturedArticle(props: FormalSectionProps) {
  const articles = articlesFor(props);
  const article = articles.find((item, index) => props.section.data?.articles?.[index]?.isFeatured) || articles[0];
  return article ? <AiFeaturedArticle article={article} articlesHref={pageHref(props.siteSlug, "/articles")} /> : null;
}

export function FormalArticlePreview(props: FormalSectionProps) {
  return <AiArticlePreview articles={articlesFor(props)} articlesHref={pageHref(props.siteSlug, "/articles")} />;
}

export function FormalArticleDetailHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiArticleDetailHero article={currentArticleFor(props)} backHref={pageHref(props.siteSlug, "/articles")} showPublishedDate={content.showPublishedDate !== false} />;
}

export function FormalArticleContent(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiArticleContent article={currentArticleFor(props)} maxWidth={text(content.maxContentWidth, text(content.contentWidth, "normal"))} showShareCta={content.showShareCta === true || content.showShare === true} showCoverImage={content.showCoverImage !== false} />;
}

export function FormalRelatedArticles(props: FormalSectionProps) {
  const article = currentArticleFor(props);
  const related = (props.section.data?.relatedArticles || []).map((item, index) => mapArticle(item, props.payload, index));
  return <AiRelatedArticles articles={related} currentSlug={article.slug} baseHref={pageHref(props.siteSlug, "/articles")} />;
}

export function FormalArticleCta(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiArticleCta title={text(content.heading, "Butuh Bantuan Lebih Lanjut?")} description={text(content.description, "Hubungi kami untuk membahas kebutuhan Anda secara langsung.")} ctaLabel={text(content.ctaLabel, "Hubungi Kami")} ctaHref={sectionHref(props, "cta", "/contact")} />;
}

export function FormalContactHero(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiContactHero title={text(content.heading, "Hubungi Kami")} subtitle={text(content.description, "Sampaikan kebutuhan Anda dan tim kami akan membantu memberi arahan awal.")} badge={text(content.eyebrow, "Kontak Bisnis")} />;
}

export function FormalContactInformation(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiContactInformation title={text(content.heading, "Saluran Hubung Resmi")} subtitle={text(content.description, "Gunakan informasi kontak resmi untuk menghubungi bisnis ini.")} badge={text(content.eyebrow, "Informasi Kontak")} company={companyDataFor(props.payload)} />;
}

export function FormalMapsLocation(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiMapsLocation title={text(content.heading, "Lokasi Bisnis")} subtitle={text(content.description, "Temukan lokasi bisnis melalui informasi peta berikut.")} badge={text(content.eyebrow, "Akses Lokasi")} company={companyDataFor(props.payload)} mapsHref={text(content.mapsHref, "https://maps.google.com")} />;
}

export function FormalContactFaq(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiContactFaq title={text(content.heading, "Kirim Pesan dan Pertanyaan Umum")} subtitle={text(content.description, "Ajukan pertanyaan melalui form kontak dan lihat jawaban cepat yang sering ditanyakan.")} badge={text(content.eyebrow, "FAQ Kontak")} faqs={faqsFor(props.section)} siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />;
}

export function FormalContactCta(props: FormalSectionProps) {
  const content = contentOf(props.section);
  return <AiContactCta title={text(content.heading, "Siap Menghubungi Kami?")} description={text(content.description, "Gunakan tombol berikut untuk menuju saluran kontak utama bisnis.")} ctaLabel={text(content.ctaLabel, "Hubungi Sekarang")} ctaHref={sectionHref(props, "cta", "/contact")} secondaryLabel={text(content.secondaryCtaLabel, "WhatsApp")} secondaryHref={whatsappHref(props.payload)} />;
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
  FormalArticleDetailHero,
  FormalArticleContent,
  FormalRelatedArticles,
  FormalArticleCta,
  FormalContactHero,
  FormalContactInformation,
  FormalMapsLocation,
  FormalContactFaq,
  FormalContactCta,
};
