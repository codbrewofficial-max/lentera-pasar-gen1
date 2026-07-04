import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, Clock, Gift, Headphones, ShieldCheck, Sparkles, Truck, Wallet } from "lucide-react";

import type { CrudItem, ProductSummary, PublicPagePayload, PublicSection } from "@/lib/types";
import { getSiteHref, resolveTargetHref, getProductDetailHref, getArticleDetailHref } from "@/lib/links";
import { CtaLink } from "@/components/tracking/CtaLink";
import { PublicEmptyState } from "@/components/layout/PublicState";
import { PublicPagination } from "@/components/layout/PublicPagination";
import { RichHtml } from "@/components/content/RichHtml";
import { ContactForm } from "@/components/sections/ContactForm";
import { FaqSearchInput } from "./FaqSearchInput";
import { ArticleSearchInput, ArticleCategoryFilter } from "./ArticleFilters";
import { FormalCatalogSiteHeader } from "../layout/FormalCatalogSiteHeader";
import { FormalCatalogSiteFooter } from "../layout/FormalCatalogSiteFooter";

export type FormalCatalogProductSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };
export type FormalCatalogProductSectionComponent = (props: FormalCatalogProductSectionProps) => ReactNode;

// ---------------------------------------------------------------------------
// Helper kecil, konvensinya niru persis apps/site-renderer/templates/company-profile/
// formal/sections/components.tsx (text/contentOf/businessOf/contentImage/sectionHref),
// supaya gampang dirawat orang yang sudah familiar dengan pola Formal Company Profile.
// ---------------------------------------------------------------------------

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

// Ambil string pertama yang tidak kosong dari beberapa sumber (content -> data CRUD ->
// default hardcoded). Dipakai di section yang punya lebih dari 2 lapis fallback, mis.
// Hero yang bisa ambil judul dari content ATAU dari Banner aktif ATAU default.
function pick(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function contentOf(section: PublicSection) {
  return section.content || {};
}

function businessOf(payload: PublicPagePayload) {
  return payload.businessProfile || {};
}

function contentImage(content: Record<string, any>, fallback = "") {
  return (
    text(content.imageUrl) ||
    text(content.coverImageUrl) ||
    text(content.backgroundImageUrl) ||
    fallback
  );
}

function sectionHref(props: FormalCatalogProductSectionProps, prefix: string, fallback: string) {
  return resolveTargetHref({
    siteSlug: props.siteSlug,
    navigation: props.payload.navigation,
    content: contentOf(props.section),
    prefix,
    fallback
  });
}

function formatIDR(value?: number | null) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function primaryImage(product: ProductSummary, fallback: string) {
  const images = product.images || [];
  const primary = images.find((image) => image.isPrimary) || images[0];
  return primary?.url || fallback;
}

const VALUE_ICON_MAP: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck,
  garansi: ShieldCheck,
  resmi: ShieldCheck,
  original: BadgeCheck,
  asli: BadgeCheck,
  badge: BadgeCheck,
  truck: Truck,
  kirim: Truck,
  pengiriman: Truck,
  wallet: Wallet,
  cod: Wallet,
  bayar: Wallet,
  cicilan: Wallet,
  support: Headphones,
  cs: Headphones,
  bantuan: Headphones,
  headset: Headphones,
  clock: Clock,
  cepat: Clock,
  respon: Clock,
  gift: Gift,
  bonus: Gift,
  hadiah: Gift
};

function valueIcon(rawIcon?: string | null) {
  const key = text(rawIcon).toLowerCase();
  for (const [needle, Icon] of Object.entries(VALUE_ICON_MAP)) {
    if (key.includes(needle)) return Icon;
  }
  return Sparkles;
}

function FormalSectionBadge({ label }: { label: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-none border border-[#1E3A5F]/20 bg-[#1E3A5F]/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E3A5F]">
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
      {badge && <FormalSectionBadge label={badge} />}
      <h2 className={`mt-4 text-3xl font-semibold tracking-tight md:text-4xl ${light ? "text-white" : "text-slate-950"}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-7 ${light ? "text-slate-300" : "text-slate-600"}`}>{description}</p>}
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

function ProductCard({ siteSlug, payload, product }: { siteSlug: string; payload: PublicPagePayload; product: ProductSummary }) {
  const href = getProductDetailHref(siteSlug, payload.navigation, product.slug);
  const image = primaryImage(product, `https://picsum.photos/seed/${product.id}/480/480`);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <a href={href} className="group block overflow-hidden border border-slate-200 bg-white transition hover:border-[#1E3A5F]/40 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img src={image} alt={product.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
        {product.isNewArrival && (
          <span className="absolute left-3 top-3 bg-[#1E3A5F] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Baru</span>
        )}
        {hasDiscount && (
          <span className="absolute right-3 top-3 bg-[#8A6D3B] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Promo</span>
        )}
      </div>
      <div className="space-y-1.5 p-4">
        {product.category?.name && <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{product.category.name}</p>}
        <h3 className="line-clamp-2 text-sm font-bold text-slate-950">{product.title}</h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-black text-[#1E3A5F]">{formatIDR(product.price)}</span>
          {hasDiscount && <span className="text-xs text-slate-400 line-through">{formatIDR(product.compareAtPrice)}</span>}
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Halaman Home — 6 section sesuai PAGE_SECTION_RULES.catalog_product.home
// ---------------------------------------------------------------------------

export function FormalCatalogHomeHero(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const banners = (props.section.data?.banners || []) as CrudItem[];
  const activeBanner = banners[0];

  const badge = pick(content.badge, business.tagline, "Katalog Produk Terpercaya");
  const title = pick(content.title, activeBanner?.title, `Belanja Kebutuhan Anda di ${pick(business.name, props.payload.website.name, "Toko Kami")}`);
  const description = pick(content.description, activeBanner?.subtitle, business.description, "Temukan produk pilihan dengan kualitas terbaik dan harga bersaing.");
  const ctaLabel = pick(content.ctaLabel, activeBanner?.ctaLabel, "Lihat Semua Produk");
  const ctaHref = activeBanner?.ctaUrl ? getSiteHref(props.siteSlug, activeBanner.ctaUrl) : sectionHref(props, "cta", "/products");
  const image = contentImage(content, pick(activeBanner?.imageUrl, "https://picsum.photos/seed/catalog-hero/900/700"));

  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] opacity-10 [background-size:24px_24px]" />
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-none bg-[#1E3A5F] opacity-20 blur-[150px]" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-none bg-[#8A6D3B] opacity-10 blur-[150px]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="flex flex-col space-y-6 lg:col-span-7">
          <FormalSectionBadge label={badge} />
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="max-w-xl text-base font-light leading-relaxed text-slate-300 sm:text-lg">{description}</p>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <CtaLink
              href={ctaHref}
              label={ctaLabel}
              className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              trackingKey={props.payload.website.trackingKey}
              pageKey={props.payload.page.pageKey}
              pageSlug={props.payload.page.slug}
              slotKey={props.section.slotKey}
              sectionKey={props.section.sectionKey}
              ctaKey="primary"
            />
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-md overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl lg:max-w-none">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-slate-900">
              <img src={image} alt={title} className="h-full w-full object-cover opacity-90" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogHomeCategoryShowcase(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const badge = text(content.badge, "Jelajahi Kategori");
  const title = text(content.title, "Kategori Produk");
  const description = text(content.description, "Temukan produk berdasarkan kategori favorit Anda.");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} />
        {categories.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((category) => (
              <a
                key={category.id}
                href={`${getSiteHref(props.siteSlug, "/products")}?categoryId=${category.id}`}
                className="group flex flex-col items-center gap-3 border border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-[#1E3A5F]/40 hover:bg-white hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-lg font-black text-[#1E3A5F]">
                  {(category.name || "?").slice(0, 1).toUpperCase()}
                </span>
                <span className="line-clamp-2 text-sm font-bold text-slate-800">{category.name}</span>
              </a>
            ))}
          </div>
        ) : (
          <EmptyBlock title="Kategori produk belum ditambahkan" description="Kelola kategori produk lewat menu Kategori Produk di dashboard supaya muncul di sini." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogHomeFeaturedProducts(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);
  const list = featured.length ? featured : products.slice(0, 8);
  const badge = text(content.badge, "Best Seller");
  const title = text(content.title, "Produk Unggulan");
  const description = text(content.description, "Produk paling laku dan paling banyak dicari pelanggan kami.");

  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-sm font-bold text-[#1E3A5F] hover:underline">
            Lihat Semua Produk <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {list.length ? (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((product) => (
              <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
            ))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada produk unggulan" description="Tandai produk sebagai 'Unggulan' lewat menu Produk di dashboard supaya tampil di sini." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogHomeNewArrivals(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 8);
  const list = newArrivals.length ? newArrivals : products.slice(0, 8);
  const badge = text(content.badge, "Baru Rilis");
  const title = text(content.title, "Produk Terbaru");
  const description = text(content.description, "Koleksi produk yang baru saja kami tambahkan ke katalog.");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-sm font-bold text-[#1E3A5F] hover:underline">
            Lihat Semua Produk <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {list.length ? (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((product) => (
              <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
            ))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada produk terbaru" description="Tandai produk sebagai 'Baru' lewat menu Produk di dashboard supaya tampil di sini." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogHomeValueProposition(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const items = (props.section.data?.valuePropositions || []) as CrudItem[];
  const badge = text(content.badge, "Keunggulan Kami");
  const title = text(content.title, "Kenapa Belanja di Sini?");
  const description = text(content.description, "");

  return (
    <section className="lp-section bg-slate-900 text-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center light />
        {items.length ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const Icon = valueIcon(item.icon);
              return (
                <div key={item.id} className="border border-white/10 bg-white/5 p-6 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8A6D3B]/20 text-[#fbe4bd]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm text-slate-300">{item.description}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl">
            <PublicEmptyState
              title="Keunggulan belum diisi"
              description="Tambahkan Keunggulan/USP lewat dashboard, contoh: Garansi Resmi, Bisa COD, Pengiriman Cepat."
            />
          </div>
        )}
      </div>
    </section>
  );
}

function metricKey(n: number, field: "Label" | "Value") {
  return `metric${["", "One", "Two", "Three"][n]}${field}`;
}

export function FormalCatalogHomeBrandTrust(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "Dipercaya Pelanggan");
  const title = text(content.title, `Kenapa Memilih ${pick(business.name, props.payload.website.name, "Kami")}?`);
  const description = pick(
    content.description,
    business.description,
    "Kami berkomitmen menghadirkan produk berkualitas dan pelayanan terbaik untuk setiap pelanggan."
  );
  const metrics = [1, 2, 3]
    .map((n) => ({ label: text(content[metricKey(n, "Label")]), value: text(content[metricKey(n, "Value")]) }))
    .filter((metric) => metric.label && metric.value);
  const image = contentImage(content, pick(business.aboutImage, "https://picsum.photos/seed/catalog-trust/800/600"));

  return (
    <section className="lp-section bg-white">
      <div className="lp-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] overflow-hidden border border-slate-200 bg-slate-100">
            <img src={image} alt={title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="lg:col-span-6">
          <SectionHeading badge={badge} title={title} description={description} />
          {metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              {metrics.map((metric, index) => (
                <div key={index}>
                  <p className="text-2xl font-black text-[#1E3A5F]">{metric.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function whatsappHref(payload: PublicPagePayload) {
  const business = businessOf(payload);
  const raw = text(business.whatsapp) || text(business.phone);
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

function RatingStars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <span className="inline-flex items-center gap-0.5 text-[#8A6D3B]" aria-label={`Rating ${rounded} dari 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < rounded ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Halaman Products (list) — 4 section sesuai PAGE_SECTION_RULES.catalog_product.products
// ---------------------------------------------------------------------------

export function FormalCatalogProductsBreadcrumbs(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const filters = props.section.data?.filters || {};
  const activeCategory = categories.find((category) => category.id === filters.categoryId);
  const title = filters.q ? `Hasil pencarian: "${filters.q}"` : text(content.title, activeCategory ? activeCategory.name : "Semua Produk");
  const description = text(content.description, "Jelajahi seluruh katalog produk kami.");

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-8">
      <div className="lp-container">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <a href={getSiteHref(props.siteSlug, "/")} className="hover:text-[#1E3A5F]">Home</a>
          <span>/</span>
          <a href={getSiteHref(props.siteSlug, "/products")} className={activeCategory ? "hover:text-[#1E3A5F]" : "text-[#1E3A5F]"}>Produk</a>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-[#1E3A5F]">{activeCategory.name}</span>
            </>
          )}
        </nav>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>}
      </div>
    </section>
  );
}

export function FormalCatalogProductsFilterSidebar(props: FormalCatalogProductSectionProps) {
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
    <section className="border-b border-slate-200 bg-white py-6">
      <div className="lp-container flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <a
            href={productsPath}
            className={`px-4 py-2 text-sm font-semibold transition ${!filters.categoryId ? "bg-[#1E3A5F] text-white" : "border border-slate-300 text-slate-600 hover:border-slate-400"}`}
          >
            Semua Kategori
          </a>
          {categories.map((category) => (
            <a
              key={category.id}
              href={`${productsPath}?categoryId=${category.id}`}
              className={`px-4 py-2 text-sm font-semibold transition ${filters.categoryId === category.id ? "bg-[#1E3A5F] text-white" : "border border-slate-300 text-slate-600 hover:border-slate-400"}`}
            >
              {category.name}
            </a>
          ))}
        </div>

        <form method="get" action={productsPath} className="flex flex-wrap items-center gap-3">
          {filters.categoryId && <input type="hidden" name="categoryId" value={filters.categoryId} />}
          {filters.q && <input type="hidden" name="q" value={filters.q} />}
          <input type="number" name="minPrice" min={0} defaultValue={filters.minPrice || ""} placeholder="Harga min" className="w-28 border border-slate-300 px-3 py-2 text-sm" />
          <span className="text-slate-400">—</span>
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice || ""} placeholder="Harga maks" className="w-28 border border-slate-300 px-3 py-2 text-sm" />
          <select name="sort" defaultValue={filters.sort || "featured"} className="border border-slate-300 px-3 py-2 text-sm text-slate-700">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button type="submit" className="bg-[#1E3A5F] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#1E3A5F]/90">
            Terapkan
          </button>
        </form>
      </div>
    </section>
  );
}

export function FormalCatalogProductsGrid(props: FormalCatalogProductSectionProps) {
  const products = (props.section.data?.products || []) as ProductSummary[];

  return (
    <section className="lp-section bg-white !pt-10">
      <div className="lp-container">
        {products.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
            ))}
          </div>
        ) : (
          <EmptyBlock title="Produk tidak ditemukan" description="Coba ubah filter kategori atau rentang harga, atau kelola produk lewat menu Produk di dashboard." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogProductsPagination(props: FormalCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  const filters = props.section.data?.filters || {};
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="lp-container pb-4">
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
// Halaman Product Detail — 5 section sesuai PAGE_SECTION_RULES.catalog_product.product_detail
// ---------------------------------------------------------------------------

export function FormalCatalogProductDetailCoreInfo(props: FormalCatalogProductSectionProps) {
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
      <div className="lp-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-square overflow-hidden border border-slate-200 bg-slate-100">
            <img src={mainImage.url} alt={product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((image) => (
                <div key={image.id} className="aspect-square overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={image.url} alt={image.altText || product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-6">
          {product.category?.name && <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{product.category.name}</p>}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{product.title}</h1>
          {product.sku && <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#1E3A5F]">{formatIDR(product.price)}</span>
            {hasDiscount && <span className="text-base text-slate-400 line-through">{formatIDR(product.compareAtPrice)}</span>}
          </div>
          {product.shortDescription && <p className="mt-4 text-sm leading-7 text-slate-600">{product.shortDescription}</p>}

          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilihan Varian</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <span
                    key={variant.id}
                    className={`border px-3.5 py-2 text-sm font-semibold ${
                      variant.stock && variant.stock > 0 ? "border-slate-300 text-slate-700" : "border-slate-100 text-slate-300 line-through"
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
              className="inline-flex w-full items-center justify-center gap-2 bg-[#1E3A5F] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1E3A5F]/90 sm:w-auto"
              trackingKey={props.payload.website.trackingKey}
              pageKey={props.payload.page.pageKey}
              pageSlug={props.payload.page.slug}
              slotKey={props.section.slotKey}
              sectionKey={props.section.sectionKey}
              ctaKey="primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogProductDetailTabs(props: FormalCatalogProductSectionProps) {
  const product = props.section.data?.product;
  if (!product) return null;

  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="text-xl font-bold text-slate-950">Deskripsi Produk</h2>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
            {text(product.description, text(product.shortDescription, "Deskripsi produk belum ditambahkan."))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <h2 className="text-xl font-bold text-slate-950">Spesifikasi</h2>
          <dl className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-slate-500">Kategori</dt>
              <dd className="font-semibold text-slate-800">{text(product.category?.name, "Umum")}</dd>
            </div>
            {product.sku && (
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-slate-500">SKU</dt>
                <dd className="font-semibold text-slate-800">{product.sku}</dd>
              </div>
            )}
            <div className="flex justify-between py-3 text-sm">
              <dt className="text-slate-500">Status</dt>
              <dd className="font-semibold text-slate-800">{product.isNewArrival ? "Produk Baru" : "Tersedia"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogProductDetailRecommendation(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const related = (props.section.data?.relatedProducts || []) as ProductSummary[];
  const title = text(content.title, "Produk Terkait");

  if (!related.length) return null;

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {related.map((product) => (
            <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogProductDetailReviews(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const product = props.section.data?.product;
  const reviews = (product?.reviews || []).filter((review) => review.isActive !== false);
  const title = text(content.title, "Ulasan Pelanggan");
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0;

  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <RatingStars rating={averageRating} />
              <span className="text-sm font-semibold text-slate-600">{averageRating.toFixed(1)} dari {reviews.length} ulasan</span>
            </div>
          )}
        </div>
        {reviews.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  {review.avatarUrl ? (
                    <img src={review.avatarUrl} alt={review.customerName} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-sm font-black text-[#1E3A5F]">
                      {review.customerName.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900">{review.customerName}</p>
                    <RatingStars rating={review.rating} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada ulasan" description="Ulasan pelanggan untuk produk ini akan tampil di sini." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogProductDetailFaq(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "product_detail");
  const faqs = (scoped.length ? scoped : allFaqs).slice(0, 8);
  const title = text(content.title, "Pertanyaan Seputar Produk Ini");

  if (!faqs.length) return null;

  return (
    <section className="lp-section bg-white">
      <div className="lp-container max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <div className="mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-slate-900">
                {faq.question}
                <span className="ml-4 text-[#1E3A5F] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Halaman FAQ / Help Center — 3 section sesuai PAGE_SECTION_RULES.catalog_product.faq
// ---------------------------------------------------------------------------

// Search box di Hero memfilter daftar pertanyaan di section Accordion secara client-side
// lewat DOM query sederhana (data-faq-item / data-faq-question) — bukan lewat React state,
// karena kedua section ini dirender independen oleh RenderSections (component per slot,
// tidak berbagi parent React yang sama). Komponennya sendiri ada di file terpisah
// (FaqSearchInput.tsx) dengan "use client" karena butuh onChange handler — file
// components.tsx ini sendiri tetap Server Component.

export function FormalCatalogFaqHeroSearch(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "Pusat Bantuan");
  const title = text(content.title, "Ada yang Bisa Kami Bantu?");
  const description = text(content.description, "Temukan jawaban cepat seputar cara pesan, pembayaran, dan pengiriman.");

  return (
    <section className="bg-slate-900 py-16 text-white md:py-20">
      <div className="lp-container text-center">
        <FormalSectionBadge label={badge} />
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">{description}</p>
        <FaqSearchInput />
      </div>
    </section>
  );
}

export function FormalCatalogFaqAccordion(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "faq");
  const faqs = scoped.length ? scoped : allFaqs;
  const title = text(content.title, "Pertanyaan yang Sering Diajukan");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {faqs.length ? (
          <div className="mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.id} data-faq-item data-faq-question={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-900">
                  {faq.question}
                  <span className="shrink-0 text-[#1E3A5F] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        ) : (
          <EmptyBlock title="FAQ belum ditambahkan" description="Tambahkan pertanyaan & jawaban lewat menu FAQ di dashboard supaya muncul di sini." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogFaqContactCta(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const title = text(content.title, "Masih Ada Pertanyaan Lain?");
  const description = text(content.description, "Tim kami siap membantu menjawab pertanyaan Anda secara langsung.");
  const ctaLabel = text(content.ctaLabel, "Hubungi via WhatsApp");
  const ctaHref = whatsappHref(props.payload) || sectionHref(props, "cta", "/contact");

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16">
      <div className="lp-container text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
        <div className="mt-8 flex justify-center">
          <CtaLink
            href={ctaHref}
            label={ctaLabel}
            className="inline-flex items-center justify-center gap-2 bg-[#1E3A5F] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1E3A5F]/90"
            trackingKey={props.payload.website.trackingKey}
            pageKey={props.payload.page.pageKey}
            pageSlug={props.payload.page.slug}
            slotKey={props.section.slotKey}
            sectionKey={props.section.sectionKey}
            ctaKey="primary"
          />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Halaman Articles (Blog list) — 5 section sesuai
// PAGE_SECTION_RULES.catalog_product.articles
// ---------------------------------------------------------------------------

function articleImage(article: CrudItem, fallback: string) {
  return text(article.coverImageUrl, fallback);
}

function formatArticleDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(date);
}

export function FormalCatalogArticlesBlogHero(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "Jurnal & Tips");
  const title = text(content.title, "Jurnal & Tips Terbaru");
  const description = text(content.description, "Kumpulan artikel seputar produk, tips, dan info terbaru dari kami.");

  return (
    <section className="bg-slate-900 py-16 text-white md:py-20">
      <div className="lp-container text-center">
        <FormalSectionBadge label={badge} />
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">{description}</p>
        <ArticleSearchInput />
      </div>
    </section>
  );
}

export function FormalCatalogArticlesFeaturedPost(props: FormalCatalogProductSectionProps) {
  const articles = (props.section.data?.articles || []) as CrudItem[];
  const featured = articles.find((article) => article.isFeatured) || articles[0];
  if (!featured) return null;

  const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, featured.slug);
  const image = articleImage(featured, `https://picsum.photos/seed/${featured.id}/900/600`);
  const date = formatArticleDate(featured.publishedAt);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <a href={href} className="group grid grid-cols-1 gap-8 overflow-hidden border border-slate-200 lg:grid-cols-2">
          <div className="aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto">
            <img src={image} alt={featured.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col justify-center p-8">
            {featured.category?.name && <p className="text-xs font-semibold uppercase tracking-wider text-[#1E3A5F]">{featured.category.name}</p>}
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{featured.title}</h2>
            {featured.excerpt && <p className="mt-3 text-sm leading-7 text-slate-600">{featured.excerpt}</p>}
            <div className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {date && <span>{date}</span>}
              <span className="text-[#1E3A5F] group-hover:underline">Baca Selengkapnya →</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

export function FormalCatalogArticlesCategoryFilter(props: FormalCatalogProductSectionProps) {
  const categories = (props.section.data?.articleCategories || []) as CrudItem[];
  if (!categories.length) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-6">
      <div className="lp-container">
        <ArticleCategoryFilter categories={categories} />
      </div>
    </section>
  );
}

export function FormalCatalogArticlesGrid(props: FormalCatalogProductSectionProps) {
  const articles = (props.section.data?.articles || []) as CrudItem[];

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        {articles.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, article.slug);
              const image = articleImage(article, `https://picsum.photos/seed/${article.id}/640/420`);
              const date = formatArticleDate(article.publishedAt);
              return (
                <a
                  key={article.id}
                  href={href}
                  data-article-item
                  data-article-title={article.title}
                  data-article-category={article.categoryId || ""}
                  className="group block overflow-hidden border border-slate-200 bg-white transition hover:border-[#1E3A5F]/40 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={image} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {date && <span>{date}</span>}
                      {article.category?.name && <span className="text-[#1E3A5F]">{article.category.name}</span>}
                    </div>
                    <h3 className="line-clamp-2 text-base font-bold text-slate-950">{article.title}</h3>
                    {article.excerpt && <p className="line-clamp-2 text-sm text-slate-600">{article.excerpt}</p>}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <EmptyBlock title="Artikel belum tersedia" description="Tambahkan artikel lewat menu Artikel di dashboard supaya muncul di sini." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogArticlesPagination(props: FormalCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="lp-container pb-16">
      <PublicPagination siteSlug={props.siteSlug} basePath="/articles" pagination={pagination} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Halaman Article Detail — 5 section sesuai
// PAGE_SECTION_RULES.catalog_product.article_detail
// ---------------------------------------------------------------------------

export function FormalCatalogArticleDetailHeaderMeta(props: FormalCatalogProductSectionProps) {
  const article = props.section.data?.article as CrudItem | undefined;
  if (!article) return null;
  const date = formatArticleDate(article.publishedAt);

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12">
      <div className="lp-container max-w-3xl">
        {article.category?.name && <p className="text-xs font-semibold uppercase tracking-wider text-[#1E3A5F]">{article.category.name}</p>}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{article.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {date && <span>{date}</span>}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text(article.title))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1E3A5F] hover:underline"
          >
            Bagikan
          </a>
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogArticleDetailMainContent(props: FormalCatalogProductSectionProps) {
  const article = props.section.data?.article as CrudItem | undefined;
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!article) return null;

  return (
    <section className="lp-section bg-white">
      <div className="lp-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {article.coverImageUrl && (
            <div className="mb-8 aspect-[16/9] overflow-hidden bg-slate-100">
              <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          <RichHtml
            html={article.content}
            className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-[#1E3A5F]"
            emptyFallback={<p className="text-sm text-slate-500">Isi artikel belum ditambahkan.</p>}
          />
        </div>
        <aside className="lg:col-span-4">
          <div className="border border-slate-200 p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Artikel Populer</h3>
            <div className="mt-4 space-y-4">
              {relatedArticles.length ? (
                relatedArticles.slice(0, 4).map((related) => (
                  <a key={related.id} href={getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug)} className="block group">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-[#1E3A5F]">{related.title}</p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-slate-500">Belum ada artikel lain.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function FormalCatalogArticleDetailProductCta(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = ((props.section.data?.products || []) as ProductSummary[]).filter((product) => product.isFeatured).slice(0, 3);
  const list = products.length ? products : ((props.section.data?.products || []) as ProductSummary[]).slice(0, 3);
  if (!list.length) return null;
  const title = text(content.title, "Rekomendasi Produk Terkait Artikel Ini");

  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container">
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogArticleDetailRelatedArticles(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!relatedArticles.length) return null;
  const title = text(content.title, "Artikel Terkait");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {relatedArticles.slice(0, 3).map((related) => {
            const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug);
            const image = articleImage(related, `https://picsum.photos/seed/${related.id}/640/420`);
            return (
              <a key={related.id} href={href} className="group block overflow-hidden border border-slate-200 bg-white transition hover:border-[#1E3A5F]/40 hover:shadow-lg">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={image} alt={related.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 text-sm font-bold text-slate-950">{related.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogArticleDetailComments() {
  // Sesuai catatan kebijakan konten hardcode: tidak menampilkan komentar palsu/statis.
  // Kolom komentar (integrasi pihak ketiga seperti Disqus) sifatnya opsional di blueprint
  // dan belum dikonfigurasi — tampilkan status apa adanya, bukan data buatan.
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="lp-container max-w-3xl">
        <PublicEmptyState
          title="Kolom komentar belum diaktifkan"
          description="Fitur komentar untuk artikel ini belum diaktifkan oleh pemilik website."
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Halaman Contact — 3 section sesuai PAGE_SECTION_RULES.catalog_product.contact
// ---------------------------------------------------------------------------

export function FormalCatalogContactInfoCards(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "Hubungi Kami");
  const title = text(content.title, "Info Kontak & Gudang/Toko");
  const description = text(content.description, "Kunjungi atau hubungi kami lewat kanal berikut.");

  const cards = [
    { label: "Alamat", value: text(business.address) },
    { label: "Telepon / WhatsApp", value: text(business.whatsapp, text(business.phone)) },
    { label: "Email", value: text(business.contactEmail, text(business.email)) },
    { label: "Jam Operasional", value: text(business.workingHours, text(business.operationalHours)) }
  ].filter((card) => card.value);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} />
        {cards.length ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="border border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{card.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyBlock title="Info kontak belum dilengkapi" description="Lengkapi alamat, telepon, email, dan jam operasional lewat Profil Bisnis di dashboard." />
        )}
      </div>
    </section>
  );
}

export function FormalCatalogContactInquiryForm(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "Request a Quote");
  const title = text(content.title, "Minta Penawaran Harga");
  const description = text(content.description, "Isi formulir berikut, tim kami akan menghubungi Anda dengan penawaran terbaik.");

  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container max-w-2xl">
        <SectionHeading badge={badge} title={title} description={description} center />
        <div className="mt-10">
          <ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />
        </div>
      </div>
    </section>
  );
}

export function FormalCatalogContactMapsLocation(props: FormalCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "Lokasi");
  const title = text(content.title, "Lokasi Toko / Gudang Kami");
  const mapEmbedUrl = text(content.mapEmbedUrl, text(business.mapEmbedUrl));

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} />
        <div className="mt-8 aspect-[16/7] overflow-hidden border border-slate-200 bg-slate-100">
          {mapEmbedUrl ? (
            <iframe src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" title="Lokasi" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <PublicEmptyState title="Peta belum ditautkan" description="Tambahkan link Google Maps embed lewat Profil Bisnis di dashboard." />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Global Chrome (Navbar/Footer/WhatsApp FAB) — 3 slot sesuai
// PAGE_SECTION_RULES.catalog_product.global. Section ini HANYA dipakai untuk preview
// section satu-per-satu di dashboard ("Pilih Tampilan"); chrome yang benar-benar tampil di
// setiap halaman publik dirender oleh SiteShell.tsx (lihat cabang websiteType ===
// 'catalog_product' di sana), bukan lewat RenderSections — sama persis pola
// FormalGlobalNavbar/FormalGlobalFooter di company-profile/formal/sections/components.tsx.
// ---------------------------------------------------------------------------

export function FormalCatalogGlobalNavbar(props: FormalCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const navbarItems = props.payload.navigation?.navbar?.items || [];
  const cta = props.payload.navigation?.navbar?.cta;
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <FormalCatalogSiteHeader
      siteSlug={props.siteSlug}
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      taglineLabel={text(business.tagline as string) || "Katalog Produk"}
      logoUrl={text(business.logoUrl as string) || undefined}
      navItems={navbarItems.length > 0 ? navbarItems : undefined}
      ctaLabel={cta?.label || "Lihat Produk"}
      ctaPath={cta?.path || "/products"}
    />
  );
}

export function FormalCatalogGlobalFooter(props: FormalCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const footerItems = props.payload.navigation?.footer?.items || [];
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <FormalCatalogSiteFooter
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      taglineLabel={text(business.tagline as string) || "Katalog Produk"}
      logoUrl={text(business.logoUrl as string) || undefined}
      description={text(business.description as string, "Katalog produk online untuk memudahkan Anda berbelanja kebutuhan sehari-hari.")}
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

export function FormalCatalogGlobalWhatsappFab(props: FormalCatalogProductSectionProps) {
  // Sama seperti navbar/footer: FAB yang benar-benar tampil di halaman publik sudah
  // dirender otomatis oleh SiteShell.tsx (FloatingWhatsApp, nyala saat navbarTheme
  // "formal"). Slot ini cuma buat preview di dashboard supaya konsisten dengan slot
  // lain yang bisa di-preview satu-per-satu.
  const business = businessOf(props.payload);
  const whatsapp = whatsappHref(props.payload);
  if (!whatsapp) {
    return <PublicEmptyState title="Nomor WhatsApp belum diisi" description="Lengkapi nomor WhatsApp lewat Profil Bisnis di dashboard supaya tombol ini aktif." />;
  }
  return (
    <div className="relative flex h-40 items-center justify-center bg-slate-50">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
      >
        <span className="text-xs font-bold">{text(business.whatsapp, "WA")}</span>
      </a>
    </div>
  );
}

// Semua 34 slot catalog_product sudah dibangun untuk tema Formal:
// Home (6) -> Products+Detail (9) -> FAQ (3) -> Articles+Detail (10) -> Contact+Global (6).
export const formalCatalogProductSectionComponents: Record<string, FormalCatalogProductSectionComponent> = {
  FormalCatalogHomeHero,
  FormalCatalogHomeCategoryShowcase,
  FormalCatalogHomeFeaturedProducts,
  FormalCatalogHomeNewArrivals,
  FormalCatalogHomeValueProposition,
  FormalCatalogHomeBrandTrust,

  FormalCatalogProductsBreadcrumbs,
  FormalCatalogProductsFilterSidebar,
  FormalCatalogProductsGrid,
  FormalCatalogProductsPagination,

  FormalCatalogProductDetailCoreInfo,
  FormalCatalogProductDetailTabs,
  FormalCatalogProductDetailRecommendation,
  FormalCatalogProductDetailReviews,
  FormalCatalogProductDetailFaq,

  FormalCatalogFaqHeroSearch,
  FormalCatalogFaqAccordion,
  FormalCatalogFaqContactCta,

  FormalCatalogArticlesBlogHero,
  FormalCatalogArticlesFeaturedPost,
  FormalCatalogArticlesCategoryFilter,
  FormalCatalogArticlesGrid,
  FormalCatalogArticlesPagination,

  FormalCatalogArticleDetailHeaderMeta,
  FormalCatalogArticleDetailMainContent,
  FormalCatalogArticleDetailProductCta,
  FormalCatalogArticleDetailRelatedArticles,
  FormalCatalogArticleDetailComments,

  FormalCatalogContactInfoCards,
  FormalCatalogContactInquiryForm,
  FormalCatalogContactMapsLocation,

  FormalCatalogGlobalNavbar,
  FormalCatalogGlobalFooter,
  FormalCatalogGlobalWhatsappFab
};
