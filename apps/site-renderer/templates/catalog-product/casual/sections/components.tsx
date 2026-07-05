import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, Clock, Gift, Headphones, Search, ShieldCheck, Sparkles, Truck, Wallet } from "lucide-react";

import type { CrudItem, ProductSummary, PublicPagePayload, PublicSection } from "@/lib/types";
import { getSiteHref, getProductDetailHref, getArticleDetailHref } from "@/lib/links";
import { CtaLink } from "@/components/tracking/CtaLink";
import { PublicEmptyState } from "@/components/layout/PublicState";
import { PublicPagination } from "@/components/layout/PublicPagination";
import { RichHtml } from "@/components/content/RichHtml";
import { ContactForm } from "@/components/sections/ContactForm";
import {
  text,
  pick,
  contentOf,
  businessOf,
  contentImage,
  sectionHref,
  formatIDR,
  primaryImage,
  articleImage,
  formatArticleDate,
  metricKey,
  whatsappHref,
  type CatalogSectionProps
} from "../../shared/helpers";
import { CasualCatalogSiteHeader } from "../layout/CasualCatalogSiteHeader";
import { CasualCatalogSiteFooter } from "../layout/CasualCatalogSiteFooter";

export type CasualCatalogProductSectionProps = CatalogSectionProps;
export type CasualCatalogProductSectionComponent = (props: CasualCatalogProductSectionProps) => ReactNode;

// ---------------------------------------------------------------------------
// Helper visual khas Casual: pill rounded-full, gradient blob biru/ungu/koral
// (#649FF6 / #B283AF / #F56B71), kartu rounded-[28px], tombol rounded-full.
// ---------------------------------------------------------------------------

const VALUE_ICON_MAP: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck, garansi: ShieldCheck, resmi: ShieldCheck,
  original: BadgeCheck, asli: BadgeCheck, badge: BadgeCheck,
  truck: Truck, kirim: Truck, pengiriman: Truck,
  wallet: Wallet, cod: Wallet, bayar: Wallet, cicilan: Wallet,
  support: Headphones, cs: Headphones, bantuan: Headphones, headset: Headphones,
  clock: Clock, cepat: Clock, respon: Clock,
  gift: Gift, bonus: Gift, hadiah: Gift
};

function valueIcon(rawIcon?: string | null) {
  const key = text(rawIcon).toLowerCase();
  for (const [needle, Icon] of Object.entries(VALUE_ICON_MAP)) {
    if (key.includes(needle)) return Icon;
  }
  return Sparkles;
}

function CasualBadge({ label }: { label: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#649FF6]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#649FF6]">
      <Sparkles className="h-3.5 w-3.5 fill-[#649FF6]" />
      {label}
    </span>
  );
}

function SectionHeading({
  badge,
  title,
  description,
  center = false,
  light = false
}: {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {badge && <CasualBadge label={badge} />}
      <h2 className={`mt-4 text-3xl font-extrabold tracking-tight md:text-4xl ${light ? "text-white" : "text-gray-950"}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-7 ${light ? "text-white/80" : "text-gray-600"}`}>{description}</p>}
    </div>
  );
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-10">
      <PublicEmptyState title={title} description={description} />
    </div>
  );
}

// Tombol CTA generik & opsional — HANYA render kalau owner benar-benar mengisi
// content.ctaLabel di dashboard, supaya section utilitas tidak tiba-tiba muncul tombol
// kosong secara default.
function OptionalCta({ props, fallbackPath }: { props: CasualCatalogProductSectionProps; fallbackPath: string }) {
  const content = contentOf(props.section);
  const ctaLabel = text(content.ctaLabel);
  if (!ctaLabel) return null;
  const ctaHref = sectionHref(props, "cta", fallbackPath);
  return (
    <div className="mt-6">
      <PrimaryButton href={ctaHref} label={ctaLabel} />
    </div>
  );
}

// Header ringkas & opsional — HANYA render kalau salah satu field diisi owner.
function OptionalIntro({ props, center = false }: { props: CasualCatalogProductSectionProps; center?: boolean }) {
  const content = contentOf(props.section);
  const badge = text(content.badge);
  const title = text(content.title);
  const subtitle = text(content.subtitle);
  if (!badge && !title && !subtitle) return null;
  return (
    <div className={center ? "mx-auto mb-8 max-w-2xl text-center" : "mb-8 max-w-2xl"}>
      {badge && <CasualBadge label={badge} />}
      {title && <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950">{title}</h2>}
      {subtitle && <p className="mt-2 text-sm leading-7 text-gray-600">{subtitle}</p>}
    </div>
  );
}

function PrimaryButton({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <a href={href} className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#F56B71] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F56B71]/20 transition-all hover:scale-[1.02] hover:bg-[#F56B71]/90 ${className}`}>
      {label}
    </a>
  );
}

function ProductCard({ siteSlug, payload, product }: { siteSlug: string; payload: PublicPagePayload; product: ProductSummary }) {
  const href = getProductDetailHref(siteSlug, payload.navigation, product.slug);
  const image = primaryImage(product, `https://picsum.photos/seed/${product.id}/480/480`);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <a href={href} className="group block overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={image} alt={product.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
        {product.isNewArrival && (
          <span className="absolute left-3 top-3 rounded-full bg-[#649FF6] px-3 py-1 text-[11px] font-bold text-white">Baru</span>
        )}
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-[#F56B71] px-3 py-1 text-[11px] font-bold text-white">Promo</span>
        )}
      </div>
      <div className="space-y-1.5 p-4">
        {product.category?.name && <p className="text-[11px] font-bold uppercase tracking-wide text-[#649FF6]">{product.category.name}</p>}
        <h3 className="line-clamp-2 text-sm font-bold text-gray-950">{product.title}</h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-extrabold text-gray-950">{formatIDR(product.price)}</span>
          {hasDiscount && <span className="text-xs text-gray-400 line-through">{formatIDR(product.compareAtPrice)}</span>}
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Home — 6 section
// ---------------------------------------------------------------------------

export function CasualCatalogHomeHero(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const banners = (props.section.data?.banners || []) as CrudItem[];
  const activeBanner = banners[0];

  const badge = pick(content.badge, business.tagline, "✨ Belanja Ceria & Terpercaya");
  const title = pick(content.title, activeBanner?.title, `Belanja Kebutuhan Kamu di ${pick(business.name, props.payload.website.name, "Toko Kami")}!`);
  const description = pick(content.subtitle, activeBanner?.subtitle, business.description, "Produk pilihan, kualitas terjamin, dan harga bersahabat buat kamu.");
  const ctaLabel = pick(content.ctaLabel, activeBanner?.ctaLabel, "Belanja Sekarang");
  const ctaHref = activeBanner?.ctaUrl ? getSiteHref(props.siteSlug, activeBanner.ctaUrl) : sectionHref(props, "cta", "/products");
  const image = contentImage(content, pick(activeBanner?.imageUrl, "https://picsum.photos/seed/casual-catalog-hero/800/600"));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#649FF6]/10 via-[#B283AF]/5 to-transparent py-16 md:py-24">
      <div className="pointer-events-none absolute left-10 top-1/4 h-24 w-24 rounded-full bg-[#649FF6]/20 blur-2xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/3 h-32 w-32 rounded-full bg-[#F56B71]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-[#B283AF]/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <CasualBadge label={badge} />
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg lg:mx-0">{description}</p>
            <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <CtaLink
                href={ctaHref}
                label={ctaLabel}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F56B71] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F56B71]/20 transition-all hover:scale-[1.03] hover:bg-[#F56B71]/90"
                trackingKey={props.payload.website.trackingKey}
                pageKey={props.payload.page.pageKey}
                pageSlug={props.payload.page.slug}
                slotKey={props.section.slotKey}
                sectionKey={props.section.sectionKey}
                ctaKey="primary"
              />
            </div>
          </div>
          <div className="relative flex justify-center lg:col-span-5">
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-[#649FF6] to-[#B283AF] opacity-10 blur-xl" />
            <div className="w-full max-w-md rotate-2 overflow-hidden rounded-[36px] border-8 border-white bg-gray-100 shadow-2xl transition-all duration-500 hover:rotate-0">
              <img src={image} alt={title} className="aspect-[4/3] h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CasualCatalogHomeCategoryShowcase(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const badge = text(content.badge, "Jelajahi Kategori");
  const title = text(content.title, "Kategori Favorit");
  const description = text(content.subtitle, "Yuk temukan produk berdasarkan kategori kesukaanmu.");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center />
        {categories.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((category) => (
              <a
                key={category.id}
                href={`${getSiteHref(props.siteSlug, "/products")}?categoryId=${category.id}`}
                className="group flex flex-col items-center gap-3 rounded-[28px] border border-gray-100 bg-gray-50 px-4 py-6 text-center shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#649FF6]/15 text-lg font-extrabold text-[#649FF6]">
                  {(category.name || "?").slice(0, 1).toUpperCase()}
                </span>
                <span className="line-clamp-2 text-sm font-bold text-gray-800">{category.name}</span>
              </a>
            ))}
          </div>
        ) : (
          <EmptyBlock title="Kategori produk belum ditambahkan" description="Kelola kategori produk lewat menu Kategori Produk di dashboard." />
        )}
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogHomeFeaturedProducts(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);
  const list = featured.length ? featured : products.slice(0, 8);
  const badge = text(content.badge, "Paling Laris");
  const title = text(content.title, "Produk Unggulan");
  const description = text(content.subtitle, "Favorit pelanggan yang paling sering dibeli.");

  return (
    <section className="lp-section bg-gray-50">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-sm font-bold text-[#649FF6] hover:underline">
            {text(content.ctaLabel, "Lihat Semua")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {list.length ? (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((product) => (
              <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
            ))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada produk unggulan" description="Tandai produk sebagai 'Unggulan' lewat menu Produk di dashboard." />
        )}
      </div>
    </section>
  );
}

export function CasualCatalogHomeNewArrivals(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 8);
  const list = newArrivals.length ? newArrivals : products.slice(0, 8);
  const badge = text(content.badge, "Baru Datang");
  const title = text(content.title, "Produk Terbaru");
  const description = text(content.subtitle, "Koleksi segar yang baru saja kami tambahkan.");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-sm font-bold text-[#649FF6] hover:underline">
            {text(content.ctaLabel, "Lihat Semua")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {list.length ? (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((product) => (
              <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
            ))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada produk terbaru" description="Tandai produk sebagai 'Baru' lewat menu Produk di dashboard." />
        )}
      </div>
    </section>
  );
}

export function CasualCatalogHomeValueProposition(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const items = (props.section.data?.valuePropositions || []) as CrudItem[];
  const badge = text(content.badge, "Kenapa Pilih Kami");
  const title = text(content.title, "Belanja Makin Tenang");
  const description = text(content.subtitle, "");

  return (
    <section className="lp-section bg-gradient-to-b from-[#649FF6]/10 via-white to-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center />
        {items.length ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const Icon = valueIcon(item.icon);
              return (
                <div key={item.id} className="rounded-[28px] border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F56B71]/15 text-[#F56B71]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-gray-950">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm text-gray-600">{item.description}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl">
            <PublicEmptyState title="Keunggulan belum diisi" description="Tambahkan Keunggulan/USP lewat dashboard, contoh: Garansi Resmi, Bisa COD, Pengiriman Cepat." />
          </div>
        )}
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogHomeBrandTrust(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "Dipercaya Banyak Orang");
  const title = text(content.title, `Kenapa Pelanggan Suka ${pick(business.name, props.payload.website.name, "Kami")}?`);
  const description = pick(content.subtitle, business.description, "Kami senang bisa bantu kebutuhan belanja kamu dengan produk berkualitas dan pelayanan ramah.");
  const metrics = (Array.isArray(content.metrics) ? content.metrics : [])
    .map((metric: any) => ({ label: text(metric?.label), value: text(metric?.value) }))
    .filter((metric: { label: string; value: string }) => metric.label && metric.value);
  const image = contentImage(content, pick(business.aboutImage, "https://picsum.photos/seed/casual-catalog-trust/800/600"));

  return (
    <section className="lp-section bg-white">
      <div className="lp-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] overflow-hidden rounded-[28px] border-8 border-white bg-gray-100 shadow-xl">
            <img src={image} alt={title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="lg:col-span-6">
          <SectionHeading badge={badge} title={title} description={description} />
          {metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              {metrics.map((metric: { label: string; value: string }, index: number) => (
                <div key={index}>
                  <p className="text-2xl font-extrabold text-[#649FF6]">{metric.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
          <OptionalCta props={props} fallbackPath="/products" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Products (list) — 4 section
// ---------------------------------------------------------------------------

export function CasualCatalogProductsBreadcrumbs(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const filters = props.section.data?.filters || {};
  const activeCategory = categories.find((category) => category.id === filters.categoryId);
  const badge = text(content.badge);
  const title = filters.q ? `Hasil pencarian: "${filters.q}"` : text(content.title, activeCategory ? activeCategory.name : "Semua Produk");
  const description = text(content.subtitle, "Jelajahi seluruh katalog produk kami.");

  return (
    <section className="border-b border-gray-100 bg-gray-50 py-8">
      <div className="lp-container">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400">
          <a href={getSiteHref(props.siteSlug, "/")} className="hover:text-[#649FF6]">Home</a>
          <span>/</span>
          <a href={getSiteHref(props.siteSlug, "/products")} className={activeCategory ? "hover:text-[#649FF6]" : "text-[#649FF6]"}>Produk</a>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-[#649FF6]">{activeCategory.name}</span>
            </>
          )}
        </nav>
        {badge && <CasualBadge label={badge} />}
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-gray-600">{description}</p>}
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogProductsFilterSidebar(props: CasualCatalogProductSectionProps) {
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const filters = props.section.data?.filters || {};
  const productsPath = getSiteHref(props.siteSlug, "/products");

  const sortOptions = [
    { value: "featured", label: "Rekomendasi" },
    { value: "newest", label: "Terbaru" },
    { value: "price_asc", label: "Harga Terendah" },
    { value: "price_desc", label: "Harga Tertinggi" }
  ];

  return (
    <section className="border-b border-gray-100 bg-white py-6">
      <div className="lp-container">
        <OptionalIntro props={props} />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <a href={productsPath} className={`rounded-full px-4 py-2 text-sm font-bold transition ${!filters.categoryId ? "bg-[#649FF6] text-white" : "border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            Semua Kategori
          </a>
          {categories.map((category) => (
            <a
              key={category.id}
              href={`${productsPath}?categoryId=${category.id}`}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${filters.categoryId === category.id ? "bg-[#649FF6] text-white" : "border border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              {category.name}
            </a>
          ))}
        </div>

        <form method="get" action={productsPath} className="flex flex-wrap items-center gap-3">
          {filters.categoryId && <input type="hidden" name="categoryId" value={filters.categoryId} />}
          {filters.q && <input type="hidden" name="q" value={filters.q} />}
          <input type="number" name="minPrice" min={0} defaultValue={filters.minPrice || ""} placeholder="Harga min" className="w-28 rounded-full border border-gray-200 px-4 py-2 text-sm" />
          <span className="text-gray-400">—</span>
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice || ""} placeholder="Harga maks" className="w-28 rounded-full border border-gray-200 px-4 py-2 text-sm" />
          <select name="sort" defaultValue={filters.sort || "featured"} className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button type="submit" className="rounded-full bg-[#F56B71] px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-[#F56B71]/90">
            Terapkan
          </button>
        </form>
      </div>
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogProductsGrid(props: CasualCatalogProductSectionProps) {
  const products = (props.section.data?.products || []) as ProductSummary[];

  return (
    <section className="lp-section bg-white !pt-10">
      <div className="lp-container">
        <OptionalIntro props={props} />
        {products.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
            ))}
          </div>
        ) : (
          <EmptyBlock title="Produk tidak ditemukan" description="Coba ubah filter kategori atau rentang harga, atau kelola produk lewat menu Produk di dashboard." />
        )}
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogProductsPagination(props: CasualCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  const filters = props.section.data?.filters || {};
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="lp-container pb-4">
      <OptionalIntro props={props} />
      <PublicPagination
        siteSlug={props.siteSlug}
        basePath="/products"
        pagination={pagination}
        extraQuery={{
          categoryId: filters.categoryId,
          minPrice: filters.minPrice ? String(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? String(filters.maxPrice) : undefined,
          sort: filters.sort,
          q: filters.q
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Detail — 5 section
// ---------------------------------------------------------------------------

export function CasualCatalogProductDetailCoreInfo(props: CasualCatalogProductSectionProps) {
  const product = props.section.data?.product;
  if (!product) return <EmptyBlock title="Produk tidak ditemukan" description="Data produk belum tersedia." />;

  const images = product.images?.length ? product.images : [{ id: "placeholder", url: `https://picsum.photos/seed/${product.id}/900/900`, productId: product.id }];
  const mainImage = images[0];
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const cta = product.ctaUrl
    ? { label: product.ctaLabel || "Pesan Sekarang", href: getSiteHref(props.siteSlug, product.ctaUrl) }
    : { label: "Tanya via WhatsApp", href: whatsappHref(props.payload) || getSiteHref(props.siteSlug, "/contact") };
  const variants = (product.variants || []).filter((variant) => variant.isActive !== false);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <OptionalIntro props={props} />
      </div>
      <div className="lp-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-square overflow-hidden rounded-[28px] border border-gray-100 bg-gray-50 shadow-sm">
            <img src={mainImage.url} alt={product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((image) => (
                <div key={image.id} className="aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  <img src={image.url} alt={image.altText || product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-6">
          {product.category?.name && <p className="text-xs font-bold uppercase tracking-wide text-[#649FF6]">{product.category.name}</p>}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950">{product.title}</h1>
          {product.sku && <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-950">{formatIDR(product.price)}</span>
            {hasDiscount && <span className="text-base text-gray-400 line-through">{formatIDR(product.compareAtPrice)}</span>}
          </div>
          {product.shortDescription && <p className="mt-4 text-sm leading-7 text-gray-600">{product.shortDescription}</p>}

          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Pilihan Varian</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <span
                    key={variant.id}
                    className={`rounded-full border px-4 py-2 text-sm font-bold ${
                      variant.stock && variant.stock > 0 ? "border-gray-200 text-gray-700" : "border-gray-100 text-gray-300 line-through"
                    }`}
                  >
                    {variant.name}
                    {typeof variant.priceOverride === "number" && ` (${formatIDR(variant.priceOverride)})`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <CtaLink
              href={cta.href}
              label={cta.label}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F56B71] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F56B71]/20 transition-all hover:scale-[1.02] hover:bg-[#F56B71]/90 sm:w-auto"
              trackingKey={props.payload.website.trackingKey}
              pageKey={props.payload.page.pageKey}
              pageSlug={props.payload.page.slug}
              slotKey={props.section.slotKey}
              sectionKey={props.section.sectionKey}
              ctaKey="primary"
            />
          </div>
          <OptionalCta props={props} fallbackPath="/contact" />
        </div>
      </div>
    </section>
  );
}

export function CasualCatalogProductDetailTabs(props: CasualCatalogProductSectionProps) {
  const product = props.section.data?.product;
  if (!product) return null;

  return (
    <section className="lp-section bg-gray-50">
      <div className="lp-container">
        <OptionalIntro props={props} />
      </div>
      <div className="lp-container grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="text-xl font-extrabold text-gray-950">Deskripsi Produk</h2>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
            {text(product.description, text(product.shortDescription, "Deskripsi produk belum ditambahkan."))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <h2 className="text-xl font-extrabold text-gray-950">Spesifikasi</h2>
          <dl className="mt-4 divide-y divide-gray-200 rounded-[28px] border border-gray-100 bg-white p-2">
            <div className="flex justify-between px-4 py-3 text-sm">
              <dt className="text-gray-500">Kategori</dt>
              <dd className="font-bold text-gray-800">{text(product.category?.name, "Umum")}</dd>
            </div>
            {product.sku && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <dt className="text-gray-500">SKU</dt>
                <dd className="font-bold text-gray-800">{product.sku}</dd>
              </div>
            )}
            <div className="flex justify-between px-4 py-3 text-sm">
              <dt className="text-gray-500">Status</dt>
              <dd className="font-bold text-gray-800">{product.isNewArrival ? "Produk Baru" : "Tersedia"}</dd>
            </div>
          </dl>
          <OptionalCta props={props} fallbackPath="/products" />
        </div>
      </div>
    </section>
  );
}

export function CasualCatalogProductDetailRecommendation(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const related = (props.section.data?.relatedProducts || []) as ProductSummary[];
  const badge = text(content.badge);
  const title = text(content.title, "Produk Terkait");
  const subtitle = text(content.subtitle);
  if (!related.length) return null;

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        {badge && <CasualBadge label={badge} />}
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {related.map((product) => (
            <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
          ))}
        </div>
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogProductDetailReviews(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const product = props.section.data?.product;
  const reviews = (product?.reviews || []).filter((review) => review.isActive !== false);
  const badge = text(content.badge);
  const title = text(content.title, "Ulasan Pelanggan");
  const subtitle = text(content.subtitle);
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0;

  return (
    <section className="lp-section bg-gray-50">
      <div className="lp-container">
        {badge && <CasualBadge label={badge} />}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
              <span className="text-[#F56B71]">{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</span>
              <span>{averageRating.toFixed(1)} dari {reviews.length} ulasan</span>
            </div>
          )}
        </div>
        {reviews.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  {review.avatarUrl ? (
                    <img src={review.avatarUrl} alt={review.customerName} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#649FF6]/15 text-sm font-extrabold text-[#649FF6]">
                      {review.customerName.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">{review.customerName}</p>
                    <span className="text-xs text-[#F56B71]">{"★".repeat(Math.round(review.rating))}{"☆".repeat(5 - Math.round(review.rating))}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada ulasan" description="Ulasan pelanggan untuk produk ini akan tampil di sini." />
        )}
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogProductDetailFaq(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "product_detail");
  const faqs = (scoped.length ? scoped : allFaqs).slice(0, 8);
  const badge = text(content.badge);
  const title = text(content.title, "Pertanyaan Seputar Produk Ini");
  const subtitle = text(content.subtitle);
  if (!faqs.length) return null;

  return (
    <section className="lp-section bg-white">
      <div className="lp-container max-w-3xl">
        {badge && <CasualBadge label={badge} />}
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.id} className="group rounded-[24px] border border-gray-100 bg-gray-50 p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-gray-900">
                {faq.question}
                <span className="ml-4 text-[#649FF6] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
        <OptionalCta props={props} fallbackPath="/contact" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ — 3 section
// ---------------------------------------------------------------------------

export function CasualCatalogFaqHeroSearch(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "Pusat Bantuan");
  const title = text(content.title, "Ada yang Bisa Kami Bantu?");
  const description = text(content.subtitle, "Temukan jawaban cepat seputar cara pesan, pembayaran, dan pengiriman.");
  const backgroundImage = contentImage(content);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#649FF6]/10 to-white py-16 md:py-20">
      {backgroundImage && (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white" />
        </>
      )}
      <div className="relative lp-container text-center">
        <CasualBadge label={badge} />
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600">{description}</p>
        <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-2 shadow-sm">
          <Search className="ml-3 h-4 w-4 text-gray-400" />
          <input type="search" placeholder="Cari pertanyaan..." aria-label="Cari pertanyaan" className="w-full bg-transparent px-2 py-2 text-sm text-gray-700 focus:outline-none" />
        </div>
        <OptionalCta props={props} fallbackPath="/contact" />
      </div>
    </section>
  );
}

export function CasualCatalogFaqAccordion(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "faq");
  const faqs = scoped.length ? scoped : allFaqs;
  const badge = text(content.badge);
  const title = text(content.title, "Pertanyaan yang Sering Diajukan");
  const subtitle = text(content.subtitle);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container max-w-3xl">
        {badge && <CasualBadge label={badge} />}
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        {faqs.length ? (
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.id} className="group rounded-[24px] border border-gray-100 bg-gray-50 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-gray-900">
                  {faq.question}
                  <span className="shrink-0 text-[#649FF6] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        ) : (
          <EmptyBlock title="FAQ belum ditambahkan" description="Tambahkan pertanyaan & jawaban lewat menu FAQ di dashboard." />
        )}
        <OptionalCta props={props} fallbackPath="/contact" />
      </div>
    </section>
  );
}

export function CasualCatalogFaqContactCta(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge);
  const title = text(content.title, "Masih Bingung?");
  const description = text(content.subtitle, "Tim kami siap bantu jawab pertanyaan kamu.");
  const ctaLabel = text(content.ctaLabel, "Chat via WhatsApp");
  const ctaHref = whatsappHref(props.payload) || sectionHref(props, "cta", "/contact");
  const backgroundImage = contentImage(content);

  return (
    <section className="relative overflow-hidden border-t border-gray-100 bg-gray-50 py-16">
      {backgroundImage && (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/60 to-gray-50" />
        </>
      )}
      <div className="relative lp-container text-center">
        {badge && <CasualBadge label={badge} />}
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600">{description}</p>
        <div className="mt-8 flex justify-center">
          <PrimaryButton href={ctaHref} label={ctaLabel} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Articles — 5 section
// ---------------------------------------------------------------------------

export function CasualCatalogArticlesBlogHero(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "Jurnal & Tips");
  const title = text(content.title, "Jurnal & Tips Terbaru");
  const description = text(content.subtitle, "Kumpulan artikel seputar produk, tips, dan info terbaru dari kami.");
  const backgroundImage = contentImage(content);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#649FF6]/10 to-white py-16 md:py-20">
      {backgroundImage && (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white" />
        </>
      )}
      <div className="relative lp-container text-center">
        <CasualBadge label={badge} />
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600">{description}</p>
        <OptionalCta props={props} fallbackPath="/articles" />
      </div>
    </section>
  );
}

export function CasualCatalogArticlesFeaturedPost(props: CasualCatalogProductSectionProps) {
  const articles = (props.section.data?.articles || []) as CrudItem[];
  const featured = articles.find((article) => article.isFeatured) || articles[0];
  if (!featured) return null;

  const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, featured.slug);
  const image = articleImage(featured, `https://picsum.photos/seed/${featured.id}/900/600`);
  const date = formatArticleDate(featured.publishedAt);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <OptionalIntro props={props} />
        <a href={href} className="group grid grid-cols-1 gap-8 overflow-hidden rounded-[32px] border border-gray-100 shadow-sm lg:grid-cols-2">
          <div className="aspect-[16/10] overflow-hidden bg-gray-50 lg:aspect-auto">
            <img src={image} alt={featured.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col justify-center p-8">
            {featured.category?.name && <p className="text-xs font-bold uppercase tracking-wide text-[#649FF6]">{featured.category.name}</p>}
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">{featured.title}</h2>
            {featured.excerpt && <p className="mt-3 text-sm leading-7 text-gray-600">{featured.excerpt}</p>}
            <div className="mt-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-gray-400">
              {date && <span>{date}</span>}
              <span className="text-[#649FF6] group-hover:underline">Baca Selengkapnya →</span>
            </div>
          </div>
        </a>
        <OptionalCta props={props} fallbackPath="/articles" />
      </div>
    </section>
  );
}

export function CasualCatalogArticlesCategoryFilter(props: CasualCatalogProductSectionProps) {
  const categories = (props.section.data?.articleCategories || []) as CrudItem[];
  if (!categories.length) return null;

  return (
    <section className="border-b border-gray-100 bg-gray-50 py-6">
      <div className="lp-container">
        <OptionalIntro props={props} center />
        <div className="flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-[#649FF6] px-4 py-2 text-sm font-bold text-white">Semua</span>
          {categories.map((category) => (
            <span key={category.id} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600">
              {category.name}
            </span>
          ))}
        </div>
        <OptionalCta props={props} fallbackPath="/articles" />
      </div>
    </section>
  );
}

export function CasualCatalogArticlesGrid(props: CasualCatalogProductSectionProps) {
  const articles = (props.section.data?.articles || []) as CrudItem[];

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <OptionalIntro props={props} />
        {articles.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, article.slug);
              const image = articleImage(article, `https://picsum.photos/seed/${article.id}/640/420`);
              const date = formatArticleDate(article.publishedAt);
              return (
                <a key={article.id} href={href} className="group block overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-50">
                    <img src={image} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      {date && <span>{date}</span>}
                      {article.category?.name && <span className="text-[#649FF6]">{article.category.name}</span>}
                    </div>
                    <h3 className="line-clamp-2 text-base font-bold text-gray-950">{article.title}</h3>
                    {article.excerpt && <p className="line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <EmptyBlock title="Artikel belum tersedia" description="Tambahkan artikel lewat menu Artikel di dashboard." />
        )}
        <OptionalCta props={props} fallbackPath="/articles" />
      </div>
    </section>
  );
}

export function CasualCatalogArticlesPagination(props: CasualCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="lp-container pb-16">
      <OptionalIntro props={props} />
      <PublicPagination siteSlug={props.siteSlug} basePath="/articles" pagination={pagination} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article Detail — 5 section
// ---------------------------------------------------------------------------

export function CasualCatalogArticleDetailHeaderMeta(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const article = props.section.data?.article as CrudItem | undefined;
  if (!article) return null;
  const date = formatArticleDate(article.publishedAt);
  const badge = text(content.badge);
  const subtitle = text(content.subtitle);
  const backgroundImage = contentImage(content);

  return (
    <section className="relative overflow-hidden border-b border-gray-100 bg-gray-50 py-12">
      {backgroundImage && (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/60 to-gray-50" />
        </>
      )}
      <div className="relative lp-container max-w-3xl">
        {badge ? <CasualBadge label={badge} /> : article.category?.name && <p className="text-xs font-bold uppercase tracking-wide text-[#649FF6]">{article.category.name}</p>}
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">{article.title}</h1>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wide text-gray-400">
          {date && <span>{date}</span>}
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text(article.title))}`} target="_blank" rel="noopener noreferrer" className="text-[#649FF6] hover:underline">
            Bagikan
          </a>
        </div>
        <OptionalCta props={props} fallbackPath="/articles" />
      </div>
    </section>
  );
}

export function CasualCatalogArticleDetailMainContent(props: CasualCatalogProductSectionProps) {
  const article = props.section.data?.article as CrudItem | undefined;
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!article) return null;

  return (
    <section className="lp-section bg-white">
      <div className="lp-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <OptionalIntro props={props} />
          {article.coverImageUrl && (
            <div className="mb-8 aspect-[16/9] overflow-hidden rounded-[28px] bg-gray-50">
              <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          <RichHtml html={article.content} className="prose prose-slate max-w-none prose-headings:font-extrabold prose-a:text-[#649FF6]" emptyFallback={<p className="text-sm text-gray-500">Isi artikel belum ditambahkan.</p>} />
          <OptionalCta props={props} fallbackPath="/articles" />
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-[28px] border border-gray-100 bg-gray-50 p-6">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">Artikel Populer</h3>
            <div className="mt-4 space-y-4">
              {relatedArticles.length ? (
                relatedArticles.slice(0, 4).map((related) => (
                  <a key={related.id} href={getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug)} className="group block">
                    <p className="line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-[#649FF6]">{related.title}</p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada artikel lain.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function CasualCatalogArticleDetailProductCta(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = ((props.section.data?.products || []) as ProductSummary[]).filter((product) => product.isFeatured).slice(0, 3);
  const list = products.length ? products : ((props.section.data?.products || []) as ProductSummary[]).slice(0, 3);
  if (!list.length) return null;
  const badge = text(content.badge);
  const title = text(content.title, "Rekomendasi Produk Terkait Artikel Ini");
  const subtitle = text(content.subtitle);

  return (
    <section className="lp-section bg-gray-50">
      <div className="lp-container">
        {badge && <CasualBadge label={badge} />}
        <h2 className="mt-3 text-xl font-extrabold text-gray-950">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
          ))}
        </div>
        <OptionalCta props={props} fallbackPath="/products" />
      </div>
    </section>
  );
}

export function CasualCatalogArticleDetailRelatedArticles(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!relatedArticles.length) return null;
  const badge = text(content.badge);
  const title = text(content.title, "Artikel Terkait");
  const subtitle = text(content.subtitle);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        {badge && <CasualBadge label={badge} />}
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {relatedArticles.slice(0, 3).map((related) => {
            const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug);
            const image = articleImage(related, `https://picsum.photos/seed/${related.id}/640/420`);
            return (
              <a key={related.id} href={href} className="group block overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
                <div className="aspect-[16/10] overflow-hidden bg-gray-50">
                  <img src={image} alt={related.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 text-sm font-bold text-gray-950">{related.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
        <OptionalCta props={props} fallbackPath="/articles" />
      </div>
    </section>
  );
}

export function CasualCatalogArticleDetailComments(props: CasualCatalogProductSectionProps) {
  return (
    <section className="border-t border-gray-100 bg-gray-50 py-12">
      <div className="lp-container max-w-3xl">
        <OptionalIntro props={props} />
        <PublicEmptyState title="Kolom komentar belum diaktifkan" description="Fitur komentar untuk artikel ini belum diaktifkan oleh pemilik website." />
        <OptionalCta props={props} fallbackPath="/contact" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact — 3 section
// ---------------------------------------------------------------------------

export function CasualCatalogContactInfoCards(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "Hubungi Kami");
  const title = text(content.title, "Info Kontak & Toko");
  const description = text(content.subtitle, "Kunjungi atau hubungi kami lewat kanal berikut.");

  const cards = [
    { label: "Alamat", value: text(business.address) },
    { label: "Telepon / WhatsApp", value: text(business.whatsapp, text(business.phone)) },
    { label: "Email", value: text(business.contactEmail, text(business.email)) },
    { label: "Jam Operasional", value: text(business.workingHours, text(business.operationalHours)) }
  ].filter((card) => card.value);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center />
        {cards.length ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-[28px] border border-gray-100 bg-gray-50 p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{card.label}</p>
                <p className="mt-2 text-sm font-bold text-gray-800">{card.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyBlock title="Info kontak belum dilengkapi" description="Lengkapi alamat, telepon, email, dan jam operasional lewat Profil Bisnis di dashboard." />
        )}
        <OptionalCta props={props} fallbackPath="/contact" />
      </div>
    </section>
  );
}

export function CasualCatalogContactInquiryForm(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "Request a Quote");
  const title = text(content.title, "Minta Penawaran Harga");
  const description = text(content.subtitle, "Isi formulir berikut, tim kami akan menghubungi kamu dengan penawaran terbaik.");

  return (
    <section className="lp-section bg-gray-50">
      <div className="lp-container max-w-2xl">
        <SectionHeading badge={badge} title={title} description={description} center />
        <div className="mt-10">
          <ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />
        </div>
        <OptionalCta props={props} fallbackPath="/contact" />
      </div>
    </section>
  );
}

export function CasualCatalogContactMapsLocation(props: CasualCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "Lokasi");
  const title = text(content.title, "Lokasi Toko Kami");
  const subtitle = text(content.subtitle);
  const mapEmbedUrl = text(content.mapEmbedUrl, text(business.mapEmbedUrl));

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={subtitle} center />
        <div className="mx-auto mt-8 aspect-[16/7] max-w-5xl overflow-hidden rounded-[28px] border border-gray-100 bg-gray-50">
          {mapEmbedUrl ? (
            <iframe src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" title="Lokasi" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <PublicEmptyState title="Peta belum ditautkan" description="Tambahkan link Google Maps embed lewat Profil Bisnis di dashboard." />
            </div>
          )}
        </div>
        <OptionalCta props={props} fallbackPath="/contact" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Global Chrome — 3 slot (preview saja, chrome sungguhan dirender SiteShell.tsx)
// ---------------------------------------------------------------------------

export function CasualCatalogGlobalNavbar(props: CasualCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const navbarItems = props.payload.navigation?.navbar?.items || [];
  const cta = props.payload.navigation?.navbar?.cta;
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <CasualCatalogSiteHeader
      siteSlug={props.siteSlug}
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      logoUrl={text(business.logoUrl as string) || undefined}
      navItems={navbarItems.length > 0 ? navbarItems : undefined}
      ctaLabel={cta?.label || "Belanja Sekarang"}
      ctaPath={cta?.path || "/products"}
    />
  );
}

export function CasualCatalogGlobalFooter(props: CasualCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const footerItems = props.payload.navigation?.footer?.items || [];
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <CasualCatalogSiteFooter
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      logoUrl={text(business.logoUrl as string) || undefined}
      description={text(business.description as string, "Katalog produk online untuk memudahkan kamu berbelanja kebutuhan sehari-hari.")}
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

export function CasualCatalogGlobalWhatsappFab(props: CasualCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const whatsapp = whatsappHref(props.payload);
  if (!whatsapp) {
    return <PublicEmptyState title="Nomor WhatsApp belum diisi" description="Lengkapi nomor WhatsApp lewat Profil Bisnis di dashboard supaya tombol ini aktif." />;
  }
  return (
    <div className="relative flex h-40 items-center justify-center bg-gray-50">
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat via WhatsApp" className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
        <span className="text-xs font-bold">{text(business.whatsapp, "WA")}</span>
      </a>
    </div>
  );
}

export const casualCatalogProductSectionComponents: Record<string, CasualCatalogProductSectionComponent> = {
  CasualCatalogHomeHero,
  CasualCatalogHomeCategoryShowcase,
  CasualCatalogHomeFeaturedProducts,
  CasualCatalogHomeNewArrivals,
  CasualCatalogHomeValueProposition,
  CasualCatalogHomeBrandTrust,

  CasualCatalogProductsBreadcrumbs,
  CasualCatalogProductsFilterSidebar,
  CasualCatalogProductsGrid,
  CasualCatalogProductsPagination,

  CasualCatalogProductDetailCoreInfo,
  CasualCatalogProductDetailTabs,
  CasualCatalogProductDetailRecommendation,
  CasualCatalogProductDetailReviews,
  CasualCatalogProductDetailFaq,

  CasualCatalogFaqHeroSearch,
  CasualCatalogFaqAccordion,
  CasualCatalogFaqContactCta,

  CasualCatalogArticlesBlogHero,
  CasualCatalogArticlesFeaturedPost,
  CasualCatalogArticlesCategoryFilter,
  CasualCatalogArticlesGrid,
  CasualCatalogArticlesPagination,

  CasualCatalogArticleDetailHeaderMeta,
  CasualCatalogArticleDetailMainContent,
  CasualCatalogArticleDetailProductCta,
  CasualCatalogArticleDetailRelatedArticles,
  CasualCatalogArticleDetailComments,

  CasualCatalogContactInfoCards,
  CasualCatalogContactInquiryForm,
  CasualCatalogContactMapsLocation,

  CasualCatalogGlobalNavbar,
  CasualCatalogGlobalFooter,
  CasualCatalogGlobalWhatsappFab
};
