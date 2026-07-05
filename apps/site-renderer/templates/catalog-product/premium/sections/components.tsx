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
import { PremiumCatalogSiteHeader } from "../layout/PremiumCatalogSiteHeader";
import { PremiumCatalogSiteFooter } from "../layout/PremiumCatalogSiteFooter";

export type PremiumCatalogProductSectionProps = CatalogSectionProps;
export type PremiumCatalogProductSectionComponent = (props: PremiumCatalogProductSectionProps) => ReactNode;

// ---------------------------------------------------------------------------
// Helper visual khas Premium: gelap #0E0E0F/#09090A, serif font-light, label
// uppercase tracking-[0.25em], border tipis white/10, gradient aksen
// biru->ungu->koral (#649FF6 -> #B283AF -> #F56B71).
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

function PremiumEyebrow({ label }: { label: string }) {
  if (!label) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-[#F56B71]" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#649FF6] md:text-xs">{label}</span>
    </div>
  );
}

function SectionHeading({
  badge,
  title,
  description,
  center = false,
  dark = true
}: {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {badge && (center ? <div className="mx-auto w-fit"><PremiumEyebrow label={badge} /></div> : <PremiumEyebrow label={badge} />)}
      <h2 className={`mt-4 font-serif text-3xl font-light tracking-tight md:text-4xl ${dark ? "text-white" : "text-[#09090A]"}`}>{title}</h2>
      {description && <p className={`mt-4 text-sm leading-7 ${dark ? "text-stone-400" : "text-stone-600"}`}>{description}</p>}
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

function PremiumButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="group relative inline-flex items-center justify-between gap-4 bg-gradient-to-r from-[#649FF6] to-[#B283AF] px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-black/40 transition-all hover:opacity-90">
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
    </a>
  );
}

function ProductCard({ siteSlug, payload, product }: { siteSlug: string; payload: PublicPagePayload; product: ProductSummary }) {
  const href = getProductDetailHref(siteSlug, payload.navigation, product.slug);
  const image = primaryImage(product, `https://picsum.photos/seed/${product.id}/480/480`);
  const hasDiscount = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <a href={href} className="group block overflow-hidden border border-white/5 bg-[#121214]/60 backdrop-blur transition hover:border-[#649FF6]/40">
      <div className="relative aspect-square overflow-hidden bg-[#09090A]">
        <img src={image} alt={product.title} className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100" referrerPolicy="no-referrer" />
        {product.isNewArrival && <span className="absolute left-3 top-3 bg-[#649FF6] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Baru</span>}
        {hasDiscount && <span className="absolute right-3 top-3 bg-[#F56B71] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Promo</span>}
      </div>
      <div className="space-y-1.5 p-4">
        {product.category?.name && <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#649FF6]">{product.category.name}</p>}
        <h3 className="line-clamp-2 font-serif text-sm font-light text-white">{product.title}</h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-serif text-base text-white">{formatIDR(product.price)}</span>
          {hasDiscount && <span className="text-xs text-stone-500 line-through">{formatIDR(product.compareAtPrice)}</span>}
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Home — 6 section
// ---------------------------------------------------------------------------

export function PremiumCatalogHomeHero(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const banners = (props.section.data?.banners || []) as CrudItem[];
  const activeBanner = banners[0];

  const badge = pick(content.badge, business.tagline, "KOLEKSI PILIHAN TERKURASI");
  const title = pick(content.title, activeBanner?.title, `Belanja Bermakna di ${pick(business.name, props.payload.website.name, "Toko Kami")}`);
  const description = pick(content.description, activeBanner?.subtitle, business.description, "Produk pilihan dengan kualitas dan detail yang kami jaga untuk Anda.");
  const ctaLabel = pick(content.ctaLabel, activeBanner?.ctaLabel, "Lihat Koleksi");
  const ctaHref = activeBanner?.ctaUrl ? getSiteHref(props.siteSlug, activeBanner.ctaUrl) : sectionHref(props, "cta", "/products");
  const image = contentImage(content, pick(activeBanner?.imageUrl, "https://picsum.photos/seed/premium-catalog-hero/1600/1000"));

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-[#09090A] py-16 text-white md:py-24">
      <div className="absolute inset-0 z-0">
        <img src={image} alt={title} className="h-full w-full scale-105 object-cover opacity-35" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090A] via-[#09090A]/85 to-transparent" />
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#649FF6]/5 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-[#B283AF]/10 blur-[150px]" />
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <PremiumEyebrow label={badge} />
          <h1 className="font-serif text-4xl font-light leading-[1.1] tracking-tight text-white md:text-6xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-stone-300 md:text-base">{description}</p>
          <div className="pt-4">
            <CtaLink
              href={ctaHref}
              label={ctaLabel}
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-[#649FF6] to-[#B283AF] px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-black/40 transition-all hover:opacity-90"
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
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

export function PremiumCatalogHomeCategoryShowcase(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const badge = text(content.badge, "JELAJAHI KATEGORI");
  const title = text(content.title, "Kategori Pilihan");
  const description = text(content.description, "Temukan produk berdasarkan kategori favorit Anda.");

  return (
    <section className="bg-[#0E0E0F] py-20 text-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} />
        {categories.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((category) => (
              <a key={category.id} href={`${getSiteHref(props.siteSlug, "/products")}?categoryId=${category.id}`} className="group flex flex-col items-center gap-3 border border-white/5 bg-[#121214]/60 px-4 py-6 text-center transition hover:border-[#649FF6]/40">
                <span className="flex h-12 w-12 items-center justify-center border border-white/10 font-serif text-lg font-light text-[#649FF6]">
                  {(category.name || "?").slice(0, 1).toUpperCase()}
                </span>
                <span className="line-clamp-2 text-xs font-semibold uppercase tracking-wider text-stone-300">{category.name}</span>
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

export function PremiumCatalogHomeFeaturedProducts(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);
  const list = featured.length ? featured : products.slice(0, 8);
  const badge = text(content.badge, "PILIHAN TERBAIK");
  const title = text(content.title, "Produk Unggulan");
  const description = text(content.description, "Produk yang paling dicari dan disukai pelanggan kami.");

  return (
    <section className="bg-[#09090A] py-20 text-white">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#649FF6] hover:underline">
            Lihat Semua <ArrowRight className="h-4 w-4" />
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

export function PremiumCatalogHomeNewArrivals(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = (props.section.data?.products || []) as ProductSummary[];
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 8);
  const list = newArrivals.length ? newArrivals : products.slice(0, 8);
  const badge = text(content.badge, "KOLEKSI TERBARU");
  const title = text(content.title, "Produk Terbaru");
  const description = text(content.description, "Koleksi terbaru yang baru saja hadir di katalog kami.");

  return (
    <section className="bg-[#0E0E0F] py-20 text-white">
      <div className="lp-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading badge={badge} title={title} description={description} />
          <a href={sectionHref(props, "cta", "/products")} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#649FF6] hover:underline">
            Lihat Semua <ArrowRight className="h-4 w-4" />
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

export function PremiumCatalogHomeValueProposition(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const items = (props.section.data?.valuePropositions || []) as CrudItem[];
  const badge = text(content.badge, "KEUNGGULAN KAMI");
  const title = text(content.title, "Kenapa Memilih Kami");
  const description = text(content.description, "");

  return (
    <section className="bg-[#09090A] py-20 text-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center />
        {items.length ? (
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const Icon = valueIcon(item.icon);
              return (
                <div key={item.id} className="relative bg-[#0E0E0F] p-8 text-center">
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-[#F56B71]" />
                  <span className="mx-auto flex h-11 w-11 items-center justify-center border border-white/10 text-[#649FF6]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-serif text-base font-light text-white">{item.title}</h3>
                  {item.description && <p className="mt-2 text-xs leading-relaxed text-stone-400">{item.description}</p>}
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

export function PremiumCatalogHomeBrandTrust(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "DIPERCAYA PELANGGAN");
  const title = text(content.title, `Kenapa Memilih ${pick(business.name, props.payload.website.name, "Kami")}`);
  const description = pick(content.description, business.description, "Kami berkomitmen menghadirkan produk berkualitas tinggi dengan pelayanan yang personal.");
  const metrics = [1, 2, 3]
    .map((n) => ({ label: text(content[metricKey(n, "Label")]), value: text(content[metricKey(n, "Value")]) }))
    .filter((metric) => metric.label && metric.value);
  const image = contentImage(content, pick(business.aboutImage, "https://picsum.photos/seed/premium-catalog-trust/900/700"));

  return (
    <section className="bg-[#0E0E0F] py-20 text-white">
      <div className="lp-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] overflow-hidden border border-white/5">
            <img src={image} alt={title} className="h-full w-full object-cover opacity-90" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="lg:col-span-6">
          <SectionHeading badge={badge} title={title} description={description} />
          {metrics.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {metrics.map((metric, index) => (
                <div key={index}>
                  <p className="font-serif text-2xl font-light text-[#649FF6]">{metric.value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">{metric.label}</p>
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

export function PremiumCatalogProductsBreadcrumbs(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const categories = (props.section.data?.productCategories || []) as CrudItem[];
  const filters = props.section.data?.filters || {};
  const activeCategory = categories.find((category) => category.id === filters.categoryId);
  const title = filters.q ? `Hasil pencarian: "${filters.q}"` : text(content.title, activeCategory ? activeCategory.name : "Semua Produk");
  const description = text(content.description, "Jelajahi seluruh katalog produk kami.");

  return (
    <section className="border-b border-white/5 bg-[#09090A] py-8 text-white">
      <div className="lp-container">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          <a href={getSiteHref(props.siteSlug, "/")} className="hover:text-[#649FF6]">Home</a>
          <span>/</span>
          <a href={getSiteHref(props.siteSlug, "/products")} className={activeCategory ? "hover:text-[#649FF6]" : "text-[#649FF6]"}>Produk</a>
          {activeCategory && (<><span>/</span><span className="text-[#649FF6]">{activeCategory.name}</span></>)}
        </nav>
        <h1 className="mt-3 font-serif text-2xl font-light tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-stone-400">{description}</p>}
      </div>
    </section>
  );
}

export function PremiumCatalogProductsFilterSidebar(props: PremiumCatalogProductSectionProps) {
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
    <section className="border-b border-white/5 bg-[#0E0E0F] py-6 text-white">
      <div className="lp-container flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <a href={productsPath} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${!filters.categoryId ? "bg-[#649FF6] text-white" : "border border-white/10 text-stone-300 hover:border-white/30"}`}>Semua</a>
          {categories.map((category) => (
            <a key={category.id} href={`${productsPath}?categoryId=${category.id}`} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${filters.categoryId === category.id ? "bg-[#649FF6] text-white" : "border border-white/10 text-stone-300 hover:border-white/30"}`}>{category.name}</a>
          ))}
        </div>
        <form method="get" action={productsPath} className="flex flex-wrap items-center gap-3">
          {filters.categoryId && <input type="hidden" name="categoryId" value={filters.categoryId} />}
          {filters.q && <input type="hidden" name="q" value={filters.q} />}
          <input type="number" name="minPrice" min={0} defaultValue={filters.minPrice || ""} placeholder="Min" className="w-24 border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-stone-500" />
          <span className="text-stone-500">—</span>
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice || ""} placeholder="Maks" className="w-24 border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-stone-500" />
          <select name="sort" defaultValue={filters.sort || "featured"} className="border border-white/10 bg-[#0E0E0F] px-3 py-2 text-sm text-stone-300">
            {sortOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
          <button type="submit" className="bg-gradient-to-r from-[#649FF6] to-[#B283AF] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white">Terapkan</button>
        </form>
      </div>
    </section>
  );
}

export function PremiumCatalogProductsGrid(props: PremiumCatalogProductSectionProps) {
  const products = (props.section.data?.products || []) as ProductSummary[];
  return (
    <section className="bg-[#09090A] py-16 text-white">
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

export function PremiumCatalogProductsPagination(props: PremiumCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  const filters = props.section.data?.filters || {};
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="bg-[#09090A] pb-16">
      <div className="lp-container">
        <PublicPagination
          siteSlug={props.siteSlug}
          basePath="/products"
          pagination={pagination}
          extraQuery={{ categoryId: filters.categoryId, minPrice: filters.minPrice ? String(filters.minPrice) : undefined, maxPrice: filters.maxPrice ? String(filters.maxPrice) : undefined, sort: filters.sort, q: filters.q }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Detail — 5 section
// ---------------------------------------------------------------------------

export function PremiumCatalogProductDetailCoreInfo(props: PremiumCatalogProductSectionProps) {
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
    <section className="bg-[#09090A] py-16 text-white">
      <div className="lp-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-square overflow-hidden border border-white/5 bg-[#0E0E0F]">
            <img src={mainImage.url} alt={product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((image) => (<div key={image.id} className="aspect-square overflow-hidden border border-white/5 bg-[#0E0E0F]"><img src={image.url} alt={image.altText || product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" /></div>))}
            </div>
          )}
        </div>
        <div className="lg:col-span-6">
          {product.category?.name && <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#649FF6]">{product.category.name}</p>}
          <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-white">{product.title}</h1>
          {product.sku && <p className="mt-1 text-xs text-stone-500">SKU: {product.sku}</p>}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-light text-white">{formatIDR(product.price)}</span>
            {hasDiscount && <span className="text-base text-stone-500 line-through">{formatIDR(product.compareAtPrice)}</span>}
          </div>
          {product.shortDescription && <p className="mt-4 text-sm leading-7 text-stone-400">{product.shortDescription}</p>}
          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Pilihan Varian</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <span key={variant.id} className={`border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider ${variant.stock && variant.stock > 0 ? "border-white/15 text-stone-200" : "border-white/5 text-stone-600 line-through"}`}>
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
              className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#649FF6] to-[#B283AF] px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-black/40 sm:w-auto"
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

export function PremiumCatalogProductDetailTabs(props: PremiumCatalogProductSectionProps) {
  const product = props.section.data?.product;
  if (!product) return null;
  return (
    <section className="bg-[#0E0E0F] py-16 text-white">
      <div className="lp-container grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="font-serif text-xl font-light text-white">Deskripsi Produk</h2>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-400">{text(product.description, text(product.shortDescription, "Deskripsi produk belum ditambahkan."))}</div>
        </div>
        <div className="lg:col-span-4">
          <h2 className="font-serif text-xl font-light text-white">Spesifikasi</h2>
          <dl className="mt-4 divide-y divide-white/5 border-t border-white/5">
            <div className="flex justify-between py-3 text-sm"><dt className="text-stone-500">Kategori</dt><dd className="font-semibold text-stone-200">{text(product.category?.name, "Umum")}</dd></div>
            {product.sku && <div className="flex justify-between py-3 text-sm"><dt className="text-stone-500">SKU</dt><dd className="font-semibold text-stone-200">{product.sku}</dd></div>}
            <div className="flex justify-between py-3 text-sm"><dt className="text-stone-500">Status</dt><dd className="font-semibold text-stone-200">{product.isNewArrival ? "Produk Baru" : "Tersedia"}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function PremiumCatalogProductDetailRecommendation(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const related = (props.section.data?.relatedProducts || []) as ProductSummary[];
  if (!related.length) return null;
  const title = text(content.title, "Produk Terkait");
  return (
    <section className="bg-[#09090A] py-16 text-white">
      <div className="lp-container">
        <h2 className="font-serif text-2xl font-light tracking-tight">{title}</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {related.map((product) => (<ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />))}
        </div>
      </div>
    </section>
  );
}

export function PremiumCatalogProductDetailReviews(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const product = props.section.data?.product;
  const reviews = (product?.reviews || []).filter((review) => review.isActive !== false);
  const title = text(content.title, "Ulasan Pelanggan");
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0;

  return (
    <section className="bg-[#0E0E0F] py-16 text-white">
      <div className="lp-container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-light tracking-tight">{title}</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <span className="text-[#F56B71]">{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</span>
              <span>{averageRating.toFixed(1)} dari {reviews.length} ulasan</span>
            </div>
          )}
        </div>
        {reviews.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="border border-white/5 bg-[#121214]/60 p-6">
                <div className="flex items-center gap-3">
                  {review.avatarUrl ? (<img src={review.avatarUrl} alt={review.customerName} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />) : (
                    <span className="flex h-10 w-10 items-center justify-center border border-white/10 font-serif text-sm text-[#649FF6]">{review.customerName.slice(0, 1).toUpperCase()}</span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-stone-100">{review.customerName}</p>
                    <span className="text-xs text-[#F56B71]">{"★".repeat(Math.round(review.rating))}{"☆".repeat(5 - Math.round(review.rating))}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-400">{review.comment}</p>
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

export function PremiumCatalogProductDetailFaq(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "product_detail");
  const faqs = (scoped.length ? scoped : allFaqs).slice(0, 8);
  if (!faqs.length) return null;
  const title = text(content.title, "Pertanyaan Seputar Produk Ini");

  return (
    <section className="bg-[#09090A] py-16 text-white">
      <div className="lp-container max-w-3xl">
        <h2 className="font-serif text-2xl font-light tracking-tight">{title}</h2>
        <div className="mt-8 divide-y divide-white/5 border-t border-b border-white/5">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-stone-100">
                {faq.question}
                <span className="ml-4 text-[#649FF6] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-stone-400">{faq.answer}</p>
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

export function PremiumCatalogFaqHeroSearch(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "PUSAT BANTUAN");
  const title = text(content.title, "Ada yang Bisa Kami Bantu?");
  const description = text(content.description, "Temukan jawaban cepat seputar cara pesan, pembayaran, dan pengiriman.");

  return (
    <section className="bg-[#09090A] py-16 text-white md:py-20">
      <div className="lp-container text-center">
        <div className="mx-auto w-fit"><PremiumEyebrow label={badge} /></div>
        <h1 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-light tracking-tight md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">{description}</p>
        <div className="mx-auto mt-8 flex max-w-xl items-center border border-white/10 bg-white/5">
          <Search className="ml-4 h-4 w-4 text-stone-500" />
          <input type="search" placeholder="Cari pertanyaan..." aria-label="Cari pertanyaan" className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-stone-500 focus:outline-none" />
        </div>
      </div>
    </section>
  );
}

export function PremiumCatalogFaqAccordion(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const allFaqs = (props.section.data?.faqs || []) as CrudItem[];
  const scoped = allFaqs.filter((faq) => faq.pageKey === "faq");
  const faqs = scoped.length ? scoped : allFaqs;
  const title = text(content.title, "Pertanyaan yang Sering Diajukan");

  return (
    <section className="bg-[#0E0E0F] py-16 text-white">
      <div className="lp-container max-w-3xl">
        <h2 className="font-serif text-2xl font-light tracking-tight">{title}</h2>
        {faqs.length ? (
          <div className="mt-8 divide-y divide-white/5 border-t border-b border-white/5">
            {faqs.map((faq) => (
              <details key={faq.id} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-stone-100">
                  {faq.question}
                  <span className="shrink-0 text-[#649FF6] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-stone-400">{faq.answer}</p>
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

export function PremiumCatalogFaqContactCta(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const title = text(content.title, "Masih Ada Pertanyaan?");
  const description = text(content.description, "Tim kami siap membantu menjawab pertanyaan Anda.");
  const ctaLabel = text(content.ctaLabel, "Hubungi via WhatsApp");
  const ctaHref = whatsappHref(props.payload) || sectionHref(props, "cta", "/contact");

  return (
    <section className="border-t border-white/5 bg-[#09090A] py-16 text-white">
      <div className="lp-container text-center">
        <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">{description}</p>
        <div className="mt-8 flex justify-center"><PremiumButton href={ctaHref} label={ctaLabel} /></div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Articles — 5 section
// ---------------------------------------------------------------------------

export function PremiumCatalogArticlesBlogHero(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "JURNAL & WAWASAN");
  const title = text(content.title, "Jurnal & Wawasan Terbaru");
  const description = text(content.description, "Kumpulan artikel seputar produk, tips, dan info terbaru dari kami.");

  return (
    <section className="bg-[#09090A] py-16 text-white md:py-20">
      <div className="lp-container text-center">
        <div className="mx-auto w-fit"><PremiumEyebrow label={badge} /></div>
        <h1 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-light tracking-tight md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">{description}</p>
      </div>
    </section>
  );
}

export function PremiumCatalogArticlesFeaturedPost(props: PremiumCatalogProductSectionProps) {
  const articles = (props.section.data?.articles || []) as CrudItem[];
  const featured = articles.find((article) => article.isFeatured) || articles[0];
  if (!featured) return null;
  const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, featured.slug);
  const image = articleImage(featured, `https://picsum.photos/seed/${featured.id}/900/600`);
  const date = formatArticleDate(featured.publishedAt);

  return (
    <section className="bg-[#0E0E0F] py-16 text-white">
      <div className="lp-container">
        <a href={href} className="group grid grid-cols-1 gap-8 overflow-hidden border border-white/5 lg:grid-cols-2">
          <div className="aspect-[16/10] overflow-hidden bg-[#09090A] lg:aspect-auto">
            <img src={image} alt={featured.title} className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col justify-center p-8">
            {featured.category?.name && <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#649FF6]">{featured.category.name}</p>}
            <h2 className="mt-3 font-serif text-2xl font-light tracking-tight md:text-3xl">{featured.title}</h2>
            {featured.excerpt && <p className="mt-3 text-sm leading-7 text-stone-400">{featured.excerpt}</p>}
            <div className="mt-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              {date && <span>{date}</span>}
              <span className="text-[#649FF6] group-hover:underline">Baca Selengkapnya →</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

export function PremiumCatalogArticlesCategoryFilter(props: PremiumCatalogProductSectionProps) {
  const categories = (props.section.data?.articleCategories || []) as CrudItem[];
  if (!categories.length) return null;
  return (
    <section className="border-b border-white/5 bg-[#09090A] py-6">
      <div className="lp-container flex flex-wrap justify-center gap-2">
        <span className="bg-[#649FF6] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">Semua</span>
        {categories.map((category) => (<span key={category.id} className="border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-300">{category.name}</span>))}
      </div>
    </section>
  );
}

export function PremiumCatalogArticlesGrid(props: PremiumCatalogProductSectionProps) {
  const articles = (props.section.data?.articles || []) as CrudItem[];
  return (
    <section className="bg-[#0E0E0F] py-16 text-white">
      <div className="lp-container">
        {articles.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, article.slug);
              const image = articleImage(article, `https://picsum.photos/seed/${article.id}/640/420`);
              const date = formatArticleDate(article.publishedAt);
              return (
                <a key={article.id} href={href} className="group block overflow-hidden border border-white/5 bg-[#121214]/60 transition hover:border-[#649FF6]/40">
                  <div className="aspect-[16/10] overflow-hidden bg-[#09090A]">
                    <img src={image} alt={article.title} className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      {date && <span>{date}</span>}
                      {article.category?.name && <span className="text-[#649FF6]">{article.category.name}</span>}
                    </div>
                    <h3 className="line-clamp-2 font-serif text-base font-light text-white">{article.title}</h3>
                    {article.excerpt && <p className="line-clamp-2 text-sm text-stone-400">{article.excerpt}</p>}
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

export function PremiumCatalogArticlesPagination(props: PremiumCatalogProductSectionProps) {
  const pagination = props.section.data?.pagination;
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="bg-[#0E0E0F] pb-16">
      <div className="lp-container">
        <PublicPagination siteSlug={props.siteSlug} basePath="/articles" pagination={pagination} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article Detail — 5 section
// ---------------------------------------------------------------------------

export function PremiumCatalogArticleDetailHeaderMeta(props: PremiumCatalogProductSectionProps) {
  const article = props.section.data?.article as CrudItem | undefined;
  if (!article) return null;
  const date = formatArticleDate(article.publishedAt);
  return (
    <section className="border-b border-white/5 bg-[#09090A] py-12 text-white">
      <div className="lp-container max-w-3xl">
        {article.category?.name && <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#649FF6]">{article.category.name}</p>}
        <h1 className="mt-3 font-serif text-3xl font-light tracking-tight md:text-4xl">{article.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          {date && <span>{date}</span>}
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text(article.title))}`} target="_blank" rel="noopener noreferrer" className="text-[#649FF6] hover:underline">Bagikan</a>
        </div>
      </div>
    </section>
  );
}

export function PremiumCatalogArticleDetailMainContent(props: PremiumCatalogProductSectionProps) {
  const article = props.section.data?.article as CrudItem | undefined;
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!article) return null;

  return (
    <section className="bg-[#0E0E0F] py-16 text-white">
      <div className="lp-container grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {article.coverImageUrl && (<div className="mb-8 aspect-[16/9] overflow-hidden border border-white/5"><img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover opacity-90" referrerPolicy="no-referrer" /></div>)}
          <RichHtml html={article.content} className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:font-light prose-a:text-[#649FF6]" emptyFallback={<p className="text-sm text-stone-500">Isi artikel belum ditambahkan.</p>} />
        </div>
        <aside className="lg:col-span-4">
          <div className="border border-white/5 bg-[#121214]/60 p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">Artikel Populer</h3>
            <div className="mt-4 space-y-4">
              {relatedArticles.length ? relatedArticles.slice(0, 4).map((related) => (
                <a key={related.id} href={getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug)} className="group block">
                  <p className="line-clamp-2 text-sm font-semibold text-stone-200 group-hover:text-[#649FF6]">{related.title}</p>
                </a>
              )) : <p className="text-sm text-stone-500">Belum ada artikel lain.</p>}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function PremiumCatalogArticleDetailProductCta(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const products = ((props.section.data?.products || []) as ProductSummary[]).filter((product) => product.isFeatured).slice(0, 3);
  const list = products.length ? products : ((props.section.data?.products || []) as ProductSummary[]).slice(0, 3);
  if (!list.length) return null;
  const title = text(content.title, "Rekomendasi Produk Terkait Artikel Ini");
  return (
    <section className="bg-[#09090A] py-16 text-white">
      <div className="lp-container">
        <h2 className="font-serif text-xl font-light">{title}</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {list.map((product) => (<ProductCard key={product.id} siteSlug={props.siteSlug} payload={props.payload} product={product} />))}
        </div>
      </div>
    </section>
  );
}

export function PremiumCatalogArticleDetailRelatedArticles(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const relatedArticles = (props.section.data?.relatedArticles || []) as CrudItem[];
  if (!relatedArticles.length) return null;
  const title = text(content.title, "Artikel Terkait");
  return (
    <section className="bg-[#0E0E0F] py-16 text-white">
      <div className="lp-container">
        <h2 className="font-serif text-2xl font-light tracking-tight">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {relatedArticles.slice(0, 3).map((related) => {
            const href = getArticleDetailHref(props.siteSlug, props.payload.navigation, related.slug);
            const image = articleImage(related, `https://picsum.photos/seed/${related.id}/640/420`);
            return (
              <a key={related.id} href={href} className="group block overflow-hidden border border-white/5 bg-[#121214]/60 transition hover:border-[#649FF6]/40">
                <div className="aspect-[16/10] overflow-hidden bg-[#09090A]"><img src={image} alt={related.title} className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" /></div>
                <div className="p-5"><h3 className="line-clamp-2 text-sm font-semibold text-stone-100">{related.title}</h3></div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PremiumCatalogArticleDetailComments() {
  return (
    <section className="border-t border-white/5 bg-[#09090A] py-12 text-white">
      <div className="lp-container max-w-3xl">
        <PublicEmptyState title="Kolom komentar belum diaktifkan" description="Fitur komentar untuk artikel ini belum diaktifkan oleh pemilik website." />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact — 3 section
// ---------------------------------------------------------------------------

export function PremiumCatalogContactInfoCards(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "HUBUNGI KAMI");
  const title = text(content.title, "Info Kontak & Studio");
  const description = text(content.description, "Kunjungi atau hubungi kami lewat kanal berikut.");
  const cards = [
    { label: "Alamat", value: text(business.address) },
    { label: "Telepon / WhatsApp", value: text(business.whatsapp, text(business.phone)) },
    { label: "Email", value: text(business.contactEmail, text(business.email)) },
    { label: "Jam Operasional", value: text(business.workingHours, text(business.operationalHours)) }
  ].filter((card) => card.value);

  return (
    <section className="bg-[#09090A] py-20 text-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} description={description} center />
        {cards.length ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="border border-white/5 bg-[#121214]/60 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{card.label}</p>
                <p className="mt-2 text-sm font-semibold text-stone-100">{card.value}</p>
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

export function PremiumCatalogContactInquiryForm(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const badge = text(content.badge, "REQUEST A QUOTE");
  const title = text(content.title, "Minta Penawaran Harga");
  const description = text(content.description, "Isi formulir berikut, tim kami akan menghubungi Anda dengan penawaran terbaik.");

  return (
    <section className="bg-[#0E0E0F] py-20 text-white">
      <div className="lp-container max-w-2xl">
        <SectionHeading badge={badge} title={title} description={description} center />
        <div className="mt-10 bg-white p-1 text-slate-950">
          <ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />
        </div>
      </div>
    </section>
  );
}

export function PremiumCatalogContactMapsLocation(props: PremiumCatalogProductSectionProps) {
  const content = contentOf(props.section);
  const business = businessOf(props.payload);
  const badge = text(content.badge, "LOKASI");
  const title = text(content.title, "Lokasi Studio Kami");
  const mapEmbedUrl = text(content.mapEmbedUrl, text(business.mapEmbedUrl));

  return (
    <section className="bg-[#09090A] py-20 text-white">
      <div className="lp-container">
        <SectionHeading badge={badge} title={title} center />
        <div className="mx-auto mt-8 aspect-[16/7] max-w-5xl overflow-hidden border border-white/5">
          {mapEmbedUrl ? (
            <iframe src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" title="Lokasi" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#121214]"><PublicEmptyState title="Peta belum ditautkan" description="Tambahkan link Google Maps embed lewat Profil Bisnis di dashboard." /></div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Global Chrome — 3 slot
// ---------------------------------------------------------------------------

export function PremiumCatalogGlobalNavbar(props: PremiumCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const navbarItems = props.payload.navigation?.navbar?.items || [];
  const cta = props.payload.navigation?.navbar?.cta;
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <PremiumCatalogSiteHeader
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      logoUrl={text(business.logoUrl as string) || undefined}
      navItems={navbarItems.length > 0 ? navbarItems : undefined}
      ctaLabel={cta?.label || "Lihat Koleksi"}
      ctaPath={cta?.path || "/products"}
    />
  );
}

export function PremiumCatalogGlobalFooter(props: PremiumCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const footerItems = props.payload.navigation?.footer?.items || [];
  const getHref = (path: string) => getSiteHref(props.siteSlug, path);

  return (
    <PremiumCatalogSiteFooter
      getHref={getHref}
      businessName={text(business.name, props.payload.website.name)}
      logoUrl={text(business.logoUrl as string) || undefined}
      description={text(business.description as string, "Katalog produk premium untuk Anda yang menghargai kualitas dan detail.")}
      address={text(business.address as string)}
      email={text(business.contactEmail as string)}
      phone={text(business.phone as string)}
      navItems={footerItems.length > 0 ? footerItems : undefined}
    />
  );
}

export function PremiumCatalogGlobalWhatsappFab(props: PremiumCatalogProductSectionProps) {
  const business = businessOf(props.payload);
  const whatsapp = whatsappHref(props.payload);
  if (!whatsapp) return <PublicEmptyState title="Nomor WhatsApp belum diisi" description="Lengkapi nomor WhatsApp lewat Profil Bisnis di dashboard supaya tombol ini aktif." />;
  return (
    <div className="relative flex h-40 items-center justify-center bg-[#0E0E0F]">
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat via WhatsApp" className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
        <span className="text-xs font-bold">{text(business.whatsapp, "WA")}</span>
      </a>
    </div>
  );
}

export const premiumCatalogProductSectionComponents: Record<string, PremiumCatalogProductSectionComponent> = {
  PremiumCatalogHomeHero,
  PremiumCatalogHomeCategoryShowcase,
  PremiumCatalogHomeFeaturedProducts,
  PremiumCatalogHomeNewArrivals,
  PremiumCatalogHomeValueProposition,
  PremiumCatalogHomeBrandTrust,

  PremiumCatalogProductsBreadcrumbs,
  PremiumCatalogProductsFilterSidebar,
  PremiumCatalogProductsGrid,
  PremiumCatalogProductsPagination,

  PremiumCatalogProductDetailCoreInfo,
  PremiumCatalogProductDetailTabs,
  PremiumCatalogProductDetailRecommendation,
  PremiumCatalogProductDetailReviews,
  PremiumCatalogProductDetailFaq,

  PremiumCatalogFaqHeroSearch,
  PremiumCatalogFaqAccordion,
  PremiumCatalogFaqContactCta,

  PremiumCatalogArticlesBlogHero,
  PremiumCatalogArticlesFeaturedPost,
  PremiumCatalogArticlesCategoryFilter,
  PremiumCatalogArticlesGrid,
  PremiumCatalogArticlesPagination,

  PremiumCatalogArticleDetailHeaderMeta,
  PremiumCatalogArticleDetailMainContent,
  PremiumCatalogArticleDetailProductCta,
  PremiumCatalogArticleDetailRelatedArticles,
  PremiumCatalogArticleDetailComments,

  PremiumCatalogContactInfoCards,
  PremiumCatalogContactInquiryForm,
  PremiumCatalogContactMapsLocation,

  PremiumCatalogGlobalNavbar,
  PremiumCatalogGlobalFooter,
  PremiumCatalogGlobalWhatsappFab
};
