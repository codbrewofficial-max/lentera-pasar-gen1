import type { ReactNode } from "react";
import { motion } from "motion/react";
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
import { AbstractCatalogSiteHeader } from "../layout/AbstractCatalogSiteHeader";
import { AbstractCatalogSiteFooter } from "../layout/AbstractCatalogSiteFooter";

export type AbstractCatalogProductSectionProps = CatalogSectionProps;
export type AbstractCatalogProductSectionComponent = (props: AbstractCatalogProductSectionProps) => ReactNode;

// ---------------------------------------------------------------------------
// Helper visual khas Abstract: alternating dark (#151515) / light (white)
// section, badge lowercase font-mono, rounded-2xl/3xl, gradient blob
// biru/koral/ungu, bold sans headline, aksen motion di Hero.
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

function AbstractBadge({ label, light = false }: { label: string; light?: boolean }) {
  if (!label) return null;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs lowercase tracking-wide ${light ? "bg-white/10 text-neutral-200" : "bg-neutral-900/5 text-neutral-600"}`}>
      <Sparkles className="h-3.5 w-3.5 text-[#649FF6]" />
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
      {badge && <AbstractBadge label={badge} light={light} />}
      <h2 className={`mt-4 text-3xl font-extrabold tracking-tight md:text-4xl ${light ? "text-white" : "text-neutral-900"}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-7 ${light ? "text-neutral-300" : "text-neutral-600"}`}>{description}</p>}
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

function AbstractButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-full bg-[#649FF6] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#5389e0]">
      <span>{label}</span>
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function ProductCard({ siteSlug, payload, product, light = false }: { siteSlug: string; payload: PublicPagePayload; product: ProductSummary; light?: boolean }) {
  const href = getProductDetailHref(siteSlug, payload.navigation, product.slug);
  const image = primaryImage(product, `https://picsum.photos/seed/${product.id}/480/480`);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <a href={href} className={`group block overflow-hidden rounded-3xl transition ${light ? "bg-white/5 hover:bg-white/10" : "border border-neutral-100 bg-white shadow-sm hover:shadow-lg"}`}>
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img src={image} alt={product.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
        {product.isNewArrival && <span className="absolute left-3 top-3 rounded-full bg-[#649FF6] px-3 py-1 text-[11px] font-bold text-white">baru</span>}
        {hasDiscount && <span className="absolute right-3 top-3 rounded-full bg-[#F56B71] px-3 py-1 text-[11px] font-bold text-white">promo</span>}
      </div>
      <div className="space-y-1.5 p-4">
        {product.category?.name && <p className={`font-mono text-[11px] lowercase tracking-wide ${light ? "text-[#649FF6]" : "text-[#649FF6]"}`}>{product.category.name}</p>}
        <h3 className={`line-clamp-2 text-sm font-bold ${light ? "text-white" : "text-neutral-900"}`}>{product.title}</h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className={`text-base font-extrabold ${light ? "text-white" : "text-neutral-900"}`}>{formatIDR(product.price)}</span>
          {hasDiscount && <span className="text-xs text-neutral-400 line-through">{formatIDR(product.compareAtPrice)}</span>}
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Home — 6 section (alternating dark/light)
// ---------------------------------------------------------------------------

export function AbstractCatalogHomeHero(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const banners = (props.section.data?.banners || []) as CrudItem[];
  const activeBanner = banners[0];

  const badge = pick(content.badge, business.tagline, "katalog produk masa kini");
  const title = pick(content.title, activeBanner?.title, `belanja lebih seru di ${pick(business.name, props.payload.website.name, "toko kami")}`);
  const description = pick(content.description, activeBanner?.subtitle, business.description, "Produk pilihan dengan tampilan yang segar dan pengalaman belanja yang menyenangkan.");
  const ctaLabel = pick(content.ctaLabel, activeBanner?.ctaLabel, "mulai belanja");
  const ctaHref = activeBanner?.ctaUrl ? getSiteHref(props.siteSlug, activeBanner.ctaUrl) : sectionHref(props, "cta", "/products");
  const image = contentImage(content, pick(activeBanner?.imageUrl, "https://picsum.photos/seed/abstract-catalog-hero/900/650"));

  return (
    <section className="relative overflow-hidden bg-[#151515] py-24 text-white md:py-28">
      <div className="pointer-events-none absolute right-10 top-20 h-96 w-96 rounded-full bg-[#649FF6] opacity-25 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-96 w-96 rounded-full bg-[#F56B71] opacity-20 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 rounded-full bg-[#B283AF] opacity-10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12">
        <div className="space-y-7 lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <AbstractBadge label={badge} light />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl font-sans text-base leading-relaxed text-neutral-300 sm:text-lg">
            {description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <CtaLink
              href={ctaHref}
              label={ctaLabel}
              className="inline-flex items-center gap-2 rounded-full bg-[#649FF6] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#5389e0]"
              trackingKey={props.payload.website.trackingKey}
              pageKey={props.payload.page.pageKey}
              pageSlug={props.payload.page.slug}
              slotKey={props.section.slotKey}
              sectionKey={props.section.sectionKey}
              ctaKey="primary"
            />
          </motion.div>
        </div>
        <div className="relative mt-10 lg:col-span-5 lg:mt-0">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-neutral-900 sm:aspect-square">
            <img src={image} alt={title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#151515]/40 via-transparent to-[#649FF6]/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AbstractCatalogHomeCategoryShowcase(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const badge = text(content.badge, "jelajahi kategori");
  const title = text(content.title, "Kategori Favorit");
  const description = text(content.description, "Temukan produk berdasarkan kategori kesukaanmu.");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center />
        {categories.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((category) => (
              <a key={category.id} href={`${getSiteHref(props.siteSlug, "/products")}?categoryId=${category.id}`} className="group flex flex-col items-center gap-3 rounded-3xl border border-neutral-100 bg-neutral-50 px-4 py-6 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#649FF6]/15 text-lg font-extrabold text-[#649FF6]">{(category.name || "?").slice(0, 1).toUpperCase()}</span>
                <span className="line-clamp-2 text-sm font-bold text-neutral-800">{category.name}</span>
              </a>
            ))}
          </div>
        ) : (
          <EmptyBlock title="Kategori produk belum ditambahkan" description="Kelola kategori produk lewat menu Kategori Produk di dashboard." />
        )}
      </div>
    </section>
  );
}

export function AbstractCatalogHomeFeaturedProducts(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);
  const list = featured.length ? featured : products.slice(0, 8);
  const badge = text(content.badge, "paling laris");
  const title = text(content.title, "Produk Unggulan");
  const description = text(content.description, "Favorit pelanggan yang paling sering dipilih.");

  return (
    <section className="lp-section bg-[#151515] text-white">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} light />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-sm font-bold text-[#649FF6] hover:underline">Lihat Semua <ArrowRight className="h-4 w-4" /></a>
        </div>
        {list.length ? (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((product) => (<ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} light />))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada produk unggulan" description="Tandai produk sebagai 'Unggulan' lewat menu Produk di dashboard." />
        )}
      </div>
    </section>
  );
}

export function AbstractCatalogHomeNewArrivals(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 8);
  const list = newArrivals.length ? newArrivals : products.slice(0, 8);
  const badge = text(content.badge, "baru datang");
  const title = text(content.title, "Produk Terbaru");
  const description = text(content.description, "Koleksi segar yang baru saja kami tambahkan.");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-sm font-bold text-[#649FF6] hover:underline">Lihat Semua <ArrowRight className="h-4 w-4" /></a>
        </div>
        {list.length ? (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((product) => (<ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />))}
          </div>
        ) : (
          <EmptyBlock title="Belum ada produk terbaru" description="Tandai produk sebagai 'Baru' lewat menu Produk di dashboard." />
        )}
      </div>
    </section>
  );
}

export function AbstractCatalogHomeValueProposition(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const items = (props.section.data?.valuePropositions || []) as CrudItem[];
  const badge = text(content.badge, "kenapa pilih kami");
  const title = text(content.title, "Belanja Makin Nyaman");
  const description = text(content.description, "");

  return (
    <section className="lp-section bg-[#151515] text-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center light />
        {items.length ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const Icon = valueIcon(item.icon);
              return (
                <div key={item.id} className="rounded-3xl bg-white/5 p-6 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#649FF6]/20 text-[#649FF6]"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm text-neutral-300">{item.description}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl"><PublicEmptyState title="Keunggulan belum diisi" description="Tambahkan Keunggulan/USP lewat dashboard, contoh: Garansi Resmi, Bisa COD, Pengiriman Cepat." /></div>
        )}
      </div>
    </section>
  );
}

export function AbstractCatalogHomeBrandTrust(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "dipercaya banyak orang");
  const title = text(content.title, `kenapa pelanggan suka ${pick(business.name, props.payload.website.name, "kami")}`);
  const description = pick(content.description, business.description, "Kami senang bisa bantu kebutuhan belanjamu dengan produk berkualitas dan tampilan yang segar.");
  const metrics = [1, 2, 3]
    .map((n) => ({ label: text(content[metricKey(n, "Label")]), value: text(content[metricKey(n, "Value")]) }))
    .filter((metric) => metric.label && metric.value);
  const image = contentImage(content, pick(business.aboutImage, "https://picsum.photos/seed/abstract-catalog-trust/800/600"));

  return (
    <section className="lp-section bg-white">
      <div className="lp-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-neutral-100">
            <img src={image} alt={title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="lg:col-span-6">
          <SectionHeading badge={badge} title={title} description={description} />
          {metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6">
              {metrics.map((metric, index) => (
                <div key={index}>
                  <p className="text-2xl font-extrabold text-[#649FF6]">{metric.value}</p>
                  <p className="mt-1 font-mono text-xs lowercase tracking-wide text-neutral-500">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Products (list) — 4 section
// ---------------------------------------------------------------------------

export function AbstractCatalogProductsBreadcrumbs(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const filters = props.section.data?.filters || {};
  const activeCategory = categories.find((category) => category.id === filters.categoryId);
  const title = filters.q ? `hasil pencarian: "${filters.q}"` : text(content.title, activeCategory ? activeCategory.name : "Semua Produk");
  const description = text(content.description, "Jelajahi seluruh katalog produk kami.");

  return (
    <section className="border-b border-neutral-100 bg-neutral-50 py-8">
      <div className="lp-container">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs lowercase tracking-wide text-neutral-400">
          <a href={getSiteHref(props.siteSlug, "/")} className="hover:text-[#649FF6]">home</a>
          <span>/</span>
          <a href={getSiteHref(props.siteSlug, "/products")} className={activeCategory ? "hover:text-[#649FF6]" : "text-[#649FF6]"}>produk</a>
          {activeCategory && (<><span>/</span><span className="text-[#649FF6]">{activeCategory.name}</span></>)}
        </nav>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-neutral-600">{description}</p>}
      </div>
    </section>
  );
}

export function AbstractCatalogProductsFilterSidebar(props: AbstractCatalogProductSectionProps) {
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const filters = props.section.data?.filters || {};
  const productsPath = getSiteHref(props.siteSlug, "/products");
  const sortOptions = [
    { value: "featured", label: "rekomendasi" },
    { value: "newest", label: "terbaru" },
    { value: "price_asc", label: "harga terendah" },
    { value: "price_desc", label: "harga tertinggi" }
  ];

  return (
    <section className="border-b border-neutral-100 bg-white py-6">
      <div className="lp-container flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <a href={productsPath} className={`rounded-full px-4 py-2 text-sm font-bold transition ${!filters.categoryId ? "bg-[#649FF6] text-white" : "border border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}>semua</a>
          {categories.map((category) => (
            <a key={category.id} href={`${productsPath}?categoryId=${category.id}`} className={`rounded-full px-4 py-2 text-sm font-bold transition ${filters.categoryId === category.id ? "bg-[#649FF6] text-white" : "border border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}>{category.name}</a>
          ))}
        </div>
        <form method="get" action={productsPath} className="flex flex-wrap items-center gap-3">
          {filters.categoryId && <input type="hidden" name="categoryId" value={filters.categoryId} />}
          {filters.q && <input type="hidden" name="q" value={filters.q} />}
          <input type="number" name="minPrice" min={0} defaultValue={filters.minPrice || ""} placeholder="min" className="w-24 rounded-full border border-neutral-200 px-4 py-2 text-sm" />
          <span className="text-neutral-400">—</span>
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice || ""} placeholder="maks" className="w-24 rounded-full border border-neutral-200 px-4 py-2 text-sm" />
          <select name="sort" defaultValue={filters.sort || "featured"} className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700">
            {sortOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
          <button type="submit" className="rounded-full bg-[#649FF6] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#5389e0]">terapkan</button>
        </form>
      </div>
    </section>
  );
}

export function AbstractCatalogProductsGrid(props: AbstractCatalogProductSectionProps) {
  const products = (props.section.data?.products || []) as ProductSummary[];
  return (
    <section className="lp-section bg-white !pt-10">
      <div className="lp-container">
        {products.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (<ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />))}
          </div>
        ) : (
          <EmptyBlock title="Produk tidak ditemukan" description="Coba ubah filter kategori atau rentang harga, atau kelola produk lewat menu Produk di dashboard." />
        )}
      </div>
    </section>
  );
}

export function AbstractCatalogProductsPagination(props: AbstractCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  const filters = props.section.data?.filters || {};
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="lp-container pb-4">
      <PublicPagination
        siteSlug={props.siteSlug}
        basePath="/products"
        pagination={pagination}
        extraQuery={{ categoryId: filters.categoryId, minPrice: filters.minPrice ? String(filters.minPrice) : undefined, maxPrice: filters.maxPrice ? String(filters.maxPrice) : undefined, sort: filters.sort, q: filters.q }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Detail — 5 section
// ---------------------------------------------------------------------------

export function AbstractCatalogProductDetailCoreInfo(props: AbstractCatalogProductSectionProps) {
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
          <div className="aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <img src={mainImage.url} alt={product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((image) => (<div key={image.id} className="aspect-square overflow-hidden rounded-2xl bg-neutral-100"><img src={image.url} alt={image.altText || product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" /></div>))}
            </div>
          )}
        </div>
        <div className="lg:col-span-6">
          {product.category?.name && <p className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">{product.category.name}</p>}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">{product.title}</h1>
          {product.sku && <p className="mt-1 text-xs text-neutral-400">SKU: {product.sku}</p>}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-neutral-900">{formatIDR(product.price)}</span>
            {hasDiscount && <span className="text-base text-neutral-400 line-through">{formatIDR(product.compareAtPrice)}</span>}
          </div>
          {product.shortDescription && <p className="mt-4 text-sm leading-7 text-neutral-600">{product.shortDescription}</p>}
          {variants.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-xs lowercase tracking-wide text-neutral-500">pilihan varian</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <span key={variant.id} className={`rounded-full border px-4 py-2 text-sm font-bold ${variant.stock && variant.stock > 0 ? "border-neutral-200 text-neutral-700" : "border-neutral-100 text-neutral-300 line-through"}`}>
                    {variant.name}{typeof variant.priceOverride === "number" && ` (${formatIDR(variant.priceOverride)})`}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            <CtaLink
              href={cta.href}
              label={cta.label}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#649FF6] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#5389e0] sm:w-auto"
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

export function AbstractCatalogProductDetailTabs(props: AbstractCatalogProductSectionProps) {
  const product = props.section.data?.product;
  if (!product) return null;
  return (
    <section className="lp-section bg-neutral-50">
      <div className="lp-container grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="text-xl font-extrabold text-neutral-900">Deskripsi Produk</h2>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600">{text(product.description, text(product.shortDescription, "Deskripsi produk belum ditambahkan."))}</div>
        </div>
        <div className="lg:col-span-4">
          <h2 className="text-xl font-extrabold text-neutral-900">Spesifikasi</h2>
          <dl className="mt-4 divide-y divide-neutral-200 rounded-3xl bg-white p-2">
            <div className="flex justify-between px-4 py-3 text-sm"><dt className="text-neutral-500">Kategori</dt><dd className="font-bold text-neutral-800">{text(product.category?.name, "Umum")}</dd></div>
            {product.sku && <div className="flex justify-between px-4 py-3 text-sm"><dt className="text-neutral-500">SKU</dt><dd className="font-bold text-neutral-800">{product.sku}</dd></div>}
            <div className="flex justify-between px-4 py-3 text-sm"><dt className="text-neutral-500">Status</dt><dd className="font-bold text-neutral-800">{product.isNewArrival ? "Produk Baru" : "Tersedia"}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function AbstractCatalogProductDetailRecommendation(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const related = (props.section.data?.relatedProducts || []) as ProductSummary[];
  if (!related.length) return null;
  const title = text(content.title, "Produk Terkait");
  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {related.map((product) => (<ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />))}
        </div>
      </div>
    </section>
  );
}

export function AbstractCatalogProductDetailReviews(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const product = props.section.data?.product;
  const reviews = (product?.reviews || []).filter((review) => review.isActive !== false);
  const title = text(content.title, "Ulasan Pelanggan");
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0;

  return (
    <section className="lp-section bg-neutral-50">
      <div className="lp-container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-600">
              <span className="text-[#F56B71]">{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</span>
              <span>{averageRating.toFixed(1)} dari {reviews.length} ulasan</span>
            </div>
          )}
        </div>
        {reviews.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  {review.avatarUrl ? (<img src={review.avatarUrl} alt={review.customerName} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#649FF6]/15 text-sm font-extrabold text-[#649FF6]">{review.customerName.slice(0, 1).toUpperCase()}</span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{review.customerName}</p>
                    <span className="text-xs text-[#F56B71]">{"★".repeat(Math.round(review.rating))}{"☆".repeat(5 - Math.round(review.rating))}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{review.comment}</p>
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

export function AbstractCatalogProductDetailFaq(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "product_detail");
  const faqs = (scoped.length ? scoped : allFaqs).slice(0, 8);
  if (!faqs.length) return null;
  const title = text(content.title, "Pertanyaan Seputar Produk Ini");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.id} className="group rounded-3xl bg-neutral-50 p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-neutral-900">
                {faq.question}
                <span className="ml-4 text-[#649FF6] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ — 3 section
// ---------------------------------------------------------------------------

export function AbstractCatalogFaqHeroSearch(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "pusat bantuan");
  const title = text(content.title, "Ada yang Bisa Kami Bantu?");
  const description = text(content.description, "Temukan jawaban cepat seputar cara pesan, pembayaran, dan pengiriman.");

  return (
    <section className="bg-[#151515] py-16 text-white md:py-20">
      <div className="lp-container text-center">
        <div className="mx-auto w-fit"><AbstractBadge label={badge} light /></div>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-300">{description}</p>
        <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white/10 px-2 py-2">
          <Search className="ml-3 h-4 w-4 text-neutral-400" />
          <input type="search" placeholder="cari pertanyaan..." aria-label="Cari pertanyaan" className="w-full bg-transparent px-2 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none" />
        </div>
      </div>
    </section>
  );
}

export function AbstractCatalogFaqAccordion(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "faq");
  const faqs = scoped.length ? scoped : allFaqs;
  const title = text(content.title, "Pertanyaan yang Sering Diajukan");

  return (
    <section className="lp-section bg-white">
      <div className="lp-container max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
        {faqs.length ? (
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.id} className="group rounded-3xl bg-neutral-50 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-neutral-900">
                  {faq.question}
                  <span className="shrink-0 text-[#649FF6] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-neutral-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        ) : (
          <EmptyBlock title="FAQ belum ditambahkan" description="Tambahkan pertanyaan & jawaban lewat menu FAQ di dashboard." />
        )}
      </div>
    </section>
  );
}

export function AbstractCatalogFaqContactCta(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const title = text(content.title, "Masih Bingung?");
  const description = text(content.description, "Tim kami siap bantu jawab pertanyaanmu.");
  const ctaLabel = text(content.ctaLabel, "Chat via WhatsApp");
  const ctaHref = whatsappHref(props.payload) || sectionHref(props, "cta", "/contact");

  return (
    <section className="border-t border-neutral-100 bg-neutral-50 py-16">
      <div className="lp-container text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 md:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600">{description}</p>
        <div className="mt-8 flex justify-center"><AbstractButton href={ctaHref} label={ctaLabel} /></div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Articles — 5 section
// ---------------------------------------------------------------------------

export function AbstractCatalogArticlesBlogHero(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "jurnal & tips");
  const title = text(content.title, "Jurnal & Tips Terbaru");
  const description = text(content.description, "Kumpulan artikel seputar produk, tips, dan info terbaru dari kami.");

  return (
    <section className="bg-[#151515] py-16 text-white md:py-20">
      <div className="lp-container text-center">
        <div className="mx-auto w-fit"><AbstractBadge label={badge} light /></div>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-300">{description}</p>
      </div>
    </section>
  );
}

export function AbstractCatalogArticlesFeaturedPost(props: AbstractCatalogProductSectionProps) {
  const articles = (props.section.data?.articles || []) as CrudItem[];
  const featured = articles.find((article) => article.isFeatured) || articles[0];
  if (!featured) return null;
  const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, featured.slug);
  const image = articleImage(featured, `https://picsum.photos/seed/${featured.id}/900/600`);
  const date = formatArticleDate(featured.publishedAt);

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <a href={href} className="group grid grid-cols-1 gap-8 overflow-hidden rounded-[2rem] border border-neutral-100 lg:grid-cols-2">
          <div className="aspect-[16/10] overflow-hidden bg-neutral-100 lg:aspect-auto">
            <img src={image} alt={featured.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col justify-center p-8">
            {featured.category?.name && <p className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">{featured.category.name}</p>}
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 md:text-3xl">{featured.title}</h2>
            {featured.excerpt && <p className="mt-3 text-sm leading-7 text-neutral-600">{featured.excerpt}</p>}
            <div className="mt-5 flex items-center gap-3 font-mono text-xs lowercase tracking-wide text-neutral-400">
              {date && <span>{date}</span>}
              <span className="text-[#649FF6] group-hover:underline">baca selengkapnya →</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

export function AbstractCatalogArticlesCategoryFilter(props: AbstractCatalogProductSectionProps) {
  const categories = (props.section.data?.articleCategories || []) as CrudItem[];
  if (!categories.length) return null;
  return (
    <section className="border-b border-neutral-100 bg-neutral-50 py-6">
      <div className="lp-container flex flex-wrap justify-center gap-2">
        <span className="rounded-full bg-[#649FF6] px-4 py-2 text-sm font-bold text-white">semua</span>
        {categories.map((category) => (<span key={category.id} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-600">{category.name}</span>))}
      </div>
    </section>
  );
}

export function AbstractCatalogArticlesGrid(props: AbstractCatalogProductSectionProps) {
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
                <a key={article.id} href={href} className="group block overflow-hidden rounded-3xl border border-neutral-100 bg-white transition hover:shadow-lg">
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img src={image} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-3 font-mono text-[11px] lowercase tracking-wide text-neutral-400">
                      {date && <span>{date}</span>}
                      {article.category?.name && <span className="text-[#649FF6]">{article.category.name}</span>}
                    </div>
                    <h3 className="line-clamp-2 text-base font-bold text-neutral-900">{article.title}</h3>
                    {article.excerpt && <p className="line-clamp-2 text-sm text-neutral-600">{article.excerpt}</p>}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <EmptyBlock title="Artikel belum tersedia" description="Tambahkan artikel lewat menu Artikel di dashboard." />
        )}
      </div>
    </section>
  );
}

export function AbstractCatalogArticlesPagination(props: AbstractCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="lp-container pb-16">
      <PublicPagination siteSlug={props.siteSlug} basePath="/articles" pagination={pagination} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article Detail — 5 section
// ---------------------------------------------------------------------------

export function AbstractCatalogArticleDetailHeaderMeta(props: AbstractCatalogProductSectionProps) {
  const article = props.section.data?.article as CrudItem | undefined;
  if (!article) return null;
  const date = formatArticleDate(article.publishedAt);
  return (
    <section className="border-b border-neutral-100 bg-neutral-50 py-12">
      <div className="lp-container max-w-3xl">
        {article.category?.name && <p className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">{article.category.name}</p>}
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">{article.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs lowercase tracking-wide text-neutral-400">
          {date && <span>{date}</span>}
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text(article.title))}`} target="_blank" rel="noopener noreferrer" className="text-[#649FF6] hover:underline">bagikan</a>
        </div>
      </div>
    </section>
  );
}

export function AbstractCatalogArticleDetailMainContent(props: AbstractCatalogProductSectionProps) {
  const article = props.section.data?.article as CrudItem | undefined;
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!article) return null;

  return (
    <section className="lp-section bg-white">
      <div className="lp-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {article.coverImageUrl && (<div className="mb-8 aspect-[16/9] overflow-hidden rounded-3xl bg-neutral-100"><img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" /></div>)}
          <RichHtml html={article.content} className="prose prose-neutral max-w-none prose-headings:font-extrabold prose-a:text-[#649FF6]" emptyFallback={<p className="text-sm text-neutral-500">Isi artikel belum ditambahkan.</p>} />
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-3xl bg-neutral-50 p-6">
            <h3 className="font-mono text-xs lowercase tracking-wide text-neutral-400">artikel populer</h3>
            <div className="mt-4 space-y-4">
              {relatedArticles.length ? relatedArticles.slice(0, 4).map((related) => (
                <a key={related.id} href={getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug)} className="group block">
                  <p className="line-clamp-2 text-sm font-bold text-neutral-800 group-hover:text-[#649FF6]">{related.title}</p>
                </a>
              )) : <p className="text-sm text-neutral-500">Belum ada artikel lain.</p>}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function AbstractCatalogArticleDetailProductCta(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = ((props.section.data?.products || []) as ProductSummary[]).filter((product) => product.isFeatured).slice(0, 3);
  const list = products.length ? products : ((props.section.data?.products || []) as ProductSummary[]).slice(0, 3);
  if (!list.length) return null;
  const title = text(content.title, "Rekomendasi Produk Terkait Artikel Ini");
  return (
    <section className="lp-section bg-neutral-50">
      <div className="lp-container">
        <h2 className="text-xl font-extrabold text-neutral-900">{title}</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {list.map((product) => (<ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />))}
        </div>
      </div>
    </section>
  );
}

export function AbstractCatalogArticleDetailRelatedArticles(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!relatedArticles.length) return null;
  const title = text(content.title, "Artikel Terkait");
  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {relatedArticles.slice(0, 3).map((related) => {
            const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug);
            const image = articleImage(related, `https://picsum.photos/seed/${related.id}/640/420`);
            return (
              <a key={related.id} href={href} className="group block overflow-hidden rounded-3xl border border-neutral-100 bg-white transition hover:shadow-lg">
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100"><img src={image} alt={related.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" /></div>
                <div className="p-5"><h3 className="line-clamp-2 text-sm font-bold text-neutral-900">{related.title}</h3></div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AbstractCatalogArticleDetailComments() {
  return (
    <section className="border-t border-neutral-100 bg-neutral-50 py-12">
      <div className="lp-container max-w-3xl">
        <PublicEmptyState title="Kolom komentar belum diaktifkan" description="Fitur komentar untuk artikel ini belum diaktifkan oleh pemilik website." />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact — 3 section
// ---------------------------------------------------------------------------

export function AbstractCatalogContactInfoCards(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "hubungi kami");
  const title = text(content.title, "Info Kontak & Toko");
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
        <SectionHeading badge={badge} title={title} description={description} center />
        {cards.length ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-3xl bg-neutral-50 p-6 text-center">
                <p className="font-mono text-[11px] lowercase tracking-wide text-neutral-400">{card.label}</p>
                <p className="mt-2 text-sm font-bold text-neutral-800">{card.value}</p>
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

export function AbstractCatalogContactInquiryForm(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "request a quote");
  const title = text(content.title, "Minta Penawaran Harga");
  const description = text(content.description, "Isi formulir berikut, tim kami akan menghubungimu dengan penawaran terbaik.");

  return (
    <section className="lp-section bg-neutral-50">
      <div className="lp-container max-w-2xl">
        <SectionHeading badge={badge} title={title} description={description} center />
        <div className="mt-10"><ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} /></div>
      </div>
    </section>
  );
}

export function AbstractCatalogContactMapsLocation(props: AbstractCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "lokasi");
  const title = text(content.title, "Lokasi Toko Kami");
  const mapEmbedUrl = text(content.mapEmbedUrl, text(business.mapEmbedUrl));

  return (
    <section className="lp-section bg-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} center />
        <div className="mx-auto mt-8 aspect-[16/7] max-w-5xl overflow-hidden rounded-3xl bg-neutral-100">
          {mapEmbedUrl ? (
            <iframe src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" title="Lokasi" />
          ) : (
            <div className="flex h-full items-center justify-center"><PublicEmptyState title="Peta belum ditautkan" description="Tambahkan link Google Maps embed lewat Profil Bisnis di dashboard." /></div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Global Chrome — 3 slot
// ---------------------------------------------------------------------------

export function AbstractCatalogGlobalNavbar(props: AbstractCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const navbarItems = props.payload.navigation?.navbar?.items || [];
  const cta = props.payload.navigation?.navbar?.cta;
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <AbstractCatalogSiteHeader
      siteSlug={props.siteSlug}
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      logoUrl={text(business.logoUrl as string) || undefined}
      navItems={navbarItems.length > 0 ? navbarItems : undefined}
      ctaLabel={cta?.label || "mulai belanja"}
      ctaPath={cta?.path || "/products"}
    />
  );
}

export function AbstractCatalogGlobalFooter(props: AbstractCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const footerItems = props.payload.navigation?.footer?.items || [];
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <AbstractCatalogSiteFooter
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      logoUrl={text(business.logoUrl as string) || undefined}
      description={text(business.description as string, "Katalog produk dengan tampilan segar untuk pengalaman belanja yang menyenangkan.")}
      address={text(business.address as string)}
      email={text(business.contactEmail as string)}
      phone={text(business.phone as string)}
      instagramUrl={text(business.instagramUrl as string) || undefined}
      facebookUrl={text(business.facebookUrl as string) || undefined}
      navItems={footerItems.length > 0 ? footerItems : undefined}
    />
  );
}

export function AbstractCatalogGlobalWhatsappFab(props: AbstractCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const whatsapp = whatsappHref(props.payload);
  if (!whatsapp) return <PublicEmptyState title="Nomor WhatsApp belum diisi" description="Lengkapi nomor WhatsApp lewat Profil Bisnis di dashboard supaya tombol ini aktif." />;
  return (
    <div className="relative flex h-40 items-center justify-center bg-neutral-50">
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat via WhatsApp" className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
        <span className="text-xs font-bold">{text(business.whatsapp, "WA")}</span>
      </a>
    </div>
  );
}

export const abstractCatalogProductSectionComponents: Record<string, AbstractCatalogProductSectionComponent> = {
  AbstractCatalogHomeHero,
  AbstractCatalogHomeCategoryShowcase,
  AbstractCatalogHomeFeaturedProducts,
  AbstractCatalogHomeNewArrivals,
  AbstractCatalogHomeValueProposition,
  AbstractCatalogHomeBrandTrust,

  AbstractCatalogProductsBreadcrumbs,
  AbstractCatalogProductsFilterSidebar,
  AbstractCatalogProductsGrid,
  AbstractCatalogProductsPagination,

  AbstractCatalogProductDetailCoreInfo,
  AbstractCatalogProductDetailTabs,
  AbstractCatalogProductDetailRecommendation,
  AbstractCatalogProductDetailReviews,
  AbstractCatalogProductDetailFaq,

  AbstractCatalogFaqHeroSearch,
  AbstractCatalogFaqAccordion,
  AbstractCatalogFaqContactCta,

  AbstractCatalogArticlesBlogHero,
  AbstractCatalogArticlesFeaturedPost,
  AbstractCatalogArticlesCategoryFilter,
  AbstractCatalogArticlesGrid,
  AbstractCatalogArticlesPagination,

  AbstractCatalogArticleDetailHeaderMeta,
  AbstractCatalogArticleDetailMainContent,
  AbstractCatalogArticleDetailProductCta,
  AbstractCatalogArticleDetailRelatedArticles,
  AbstractCatalogArticleDetailComments,

  AbstractCatalogContactInfoCards,
  AbstractCatalogContactInquiryForm,
  AbstractCatalogContactMapsLocation,

  AbstractCatalogGlobalNavbar,
  AbstractCatalogGlobalFooter,
  AbstractCatalogGlobalWhatsappFab
};
