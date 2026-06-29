import type { ReactNode } from 'react';
import type { ArticleDetailPayload, CrudItem, PublicPagePayload, PublicSection } from '@/lib/types';
import { resolveTargetHref, getSiteHref } from '@/lib/links';
import { CtaLink } from '@/components/tracking/CtaLink';
import { PublicEmptyState } from '@/components/layout/PublicState';
import { ContactForm } from './ContactForm';

type SectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };
type SectionComponent = (props: SectionProps) => ReactNode;

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function titleOf(item: CrudItem) {
  return item.title || item.name || 'Item';
}

function imageOf(item: CrudItem) {
  return item.imageUrl || item.coverImageUrl || null;
}

function sortFeaturedFirst(items: CrudItem[]) {
  return [...items].sort((a, b) => {
    const featuredDelta = Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
    if (featuredDelta !== 0) return featuredDelta;
    const featuredOrderDelta = Number(a.featuredOrder || 0) - Number(b.featuredOrder || 0);
    if (featuredOrderDelta !== 0) return featuredOrderDelta;
    return Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
  });
}

function pickPreviewItems(items: CrudItem[], options?: { featuredOnly?: boolean; limit?: number }) {
  const sorted = sortFeaturedFirst(items);
  const filtered = options?.featuredOnly ? sorted.filter((item) => item.isFeatured) : sorted;
  return filtered.slice(0, options?.limit || 6);
}

function metricKey(n: number, field: 'Label' | 'Value') {
  return `metric${['', 'One', 'Two', 'Three'][n]}${field}`;
}

function Heading({
  title,
  description,
  center = false
}: {
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{description}</p>}
    </div>
  );
}

function CtaButtons({ siteSlug, payload, section, secondary = true }: SectionProps & { secondary?: boolean }) {
  const content = section.content || {};
  const primaryLabel = text(content.ctaLabel, 'Hubungi Kami');
  const primaryHref = resolveTargetHref({
    siteSlug,
    navigation: payload.navigation,
    content,
    prefix: 'cta',
    fallback: '/contact'
  });

  const secondaryLabel = text(content.secondaryCtaLabel, 'Lihat Selengkapnya');
  const secondaryHref = resolveTargetHref({
    siteSlug,
    navigation: payload.navigation,
    content,
    prefix: 'secondaryCta',
    fallback: '/services'
  });

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <CtaLink
        href={primaryHref}
        label={primaryLabel}
        className="lp-btn lp-btn-primary"
        trackingKey={payload.website.trackingKey}
        pageKey={payload.page.pageKey}
        pageSlug={payload.page.slug}
        slotKey={section.slotKey}
        sectionKey={section.sectionKey}
        ctaKey="primary"
      />
      {secondary && (
        <CtaLink
          href={secondaryHref}
          label={secondaryLabel}
          className="lp-btn lp-btn-secondary"
          trackingKey={payload.website.trackingKey}
          pageKey={payload.page.pageKey}
          pageSlug={payload.page.slug}
          slotKey={section.slotKey}
          sectionKey={section.sectionKey}
          ctaKey="secondary"
        />
      )}
    </div>
  );
}

function EmptySection({ section }: { section: PublicSection }) {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <PublicEmptyState
          title="Template section belum tersedia"
          description={`Component "${section.component || section.slotKey}" belum ada di registry renderer. Section tetap aman ditampilkan sebagai fallback agar halaman tidak blank.`}
        />
      </div>
    </section>
  );
}

function PreviewCards({
  items,
  type,
  siteSlug,
  payload,
  emptyTitle,
  emptyDescription,
  featuredOnly = false,
  limit = 6
}: {
  items: CrudItem[];
  type: 'services' | 'portfolios' | 'articles' | 'testimonials' | 'brands';
  siteSlug: string;
  payload?: PublicPagePayload;
  emptyTitle?: string;
  emptyDescription?: string;
  featuredOnly?: boolean;
  limit?: number;
}) {
  const limited = pickPreviewItems(items, { featuredOnly, limit });

  if (!limited.length) {
    return (
      <div className="mt-10">
        <PublicEmptyState
          title={emptyTitle || 'Data belum tersedia'}
          description={emptyDescription || 'Data untuk bagian ini belum diisi oleh owner bisnis.'}
        />
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {limited.map((item, index) => {
        const img = imageOf(item);
        const href = type === 'articles' ? getArticleDetailHref(siteSlug, payload, item.slug) : '#';

        const body = (
          <article className="lp-card h-full overflow-hidden">
            <div className="aspect-[16/10] bg-slate-100">
              {img ? (
                <img src={img} alt={titleOf(item)} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                  {type} #{index + 1}
                </div>
              )}
            </div>
            <div className="p-5">
              {item.isFeatured && (
                <span className="mb-3 inline-flex rounded-full bg-rose-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-rose-600">Unggulan</span>
              )}
              <h3 className="text-lg font-black text-slate-950">{titleOf(item)}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                {item.description || item.excerpt || item.quote || 'Informasi singkat akan tampil di sini.'}
              </p>
            </div>
          </article>
        );

        return type === 'articles' ? (
          <a key={item.id || index} href={href} className="block h-full">
            {body}
          </a>
        ) : (
          <div key={item.id || index}>{body}</div>
        );
      })}
    </div>
  );
}

function getArticleDetailHref(siteSlug: string, payload: PublicPagePayload | undefined, articleSlug?: string | null) {
  const articlesTarget = payload?.navigation?.availableTargets?.find(
    (item) => item.type === 'page' && item.pageKey === 'articles'
  );
  const basePath = articlesTarget?.path || '/articles';
  const cleanBase = basePath.replace(/\/$/, '') || '/articles';
  return getSiteHref(siteSlug, `${cleanBase}/${articleSlug || ''}`);
}

function HeroSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 py-16 md:py-24">
      <div className="lp-container grid items-center gap-10 md:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="lp-eyebrow">{text(c.eyebrow, 'Company Profile')}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            {text(c.title, props.payload.website.name)}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{text(c.subtitle, props.payload.businessProfile?.tagline || '')}</p>
          <CtaButtons {...props} />
        </div>
        <div className="lp-card overflow-hidden bg-slate-100">
          {c.imageUrl ? (
            <img src={c.imageUrl} alt={text(c.title, props.payload.website.name)} className="aspect-[4/3] w-full object-cover" />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center p-8 text-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Lentera Pasar</p>
                <p className="mt-3 text-3xl font-black text-slate-950">{props.payload.website.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProfileSummarySection(props: SectionProps) {
  const c = props.section.content || {};
  const bp = props.payload.businessProfile || {};
  return (
    <section className="lp-section">
      <div className="lp-container grid items-center gap-10 md:grid-cols-2">
        <div>
          <Heading
            title={text(c.title, bp.name || 'Tentang Bisnis Kami')}
            description={text(c.description, bp.description || '')}
          />
          <CtaButtons {...props} secondary={false} />
        </div>
        <div className="lp-card bg-slate-50 p-8">
          <p className="text-lg font-bold leading-8 text-slate-700">
            {bp.tagline || 'Profil bisnis akan tampil di sini setelah owner melengkapinya di dashboard.'}
          </p>
        </div>
      </div>
    </section>
  );
}

function ServicePreviewSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container">
        <Heading title={text(c.title, 'Layanan yang Kami Tawarkan')} description={text(c.description, '')} />
        <PreviewCards
          items={props.section.data?.services || []}
          type="services"
          siteSlug={props.siteSlug}
          featuredOnly
          limit={3}
          emptyTitle="Belum ada layanan unggulan"
          emptyDescription="Tandai maksimal beberapa layanan sebagai unggulan di dashboard agar 3 layanan prioritas tampil di halaman utama."
        />
        <CtaButtons {...props} secondary={false} />
      </div>
    </section>
  );
}

function PortfolioPreviewSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section">
      <div className="lp-container">
        <Heading title={text(c.title, 'Portofolio Pilihan')} description={text(c.description, '')} />
        <PreviewCards
          items={props.section.data?.portfolios || []}
          type="portfolios"
          siteSlug={props.siteSlug}
          featuredOnly
          limit={3}
          emptyTitle="Belum ada portofolio unggulan"
          emptyDescription="Tandai portofolio pilihan sebagai unggulan di dashboard agar 3 portofolio terbaik tampil di halaman utama."
        />
        <CtaButtons {...props} secondary={false} />
      </div>
    </section>
  );
}

function TrustProofSection(props: SectionProps) {
  const c = props.section.content || {};
  const testimonials = props.section.data?.testimonials || [];
  const brands = props.section.data?.brands || [];

  return (
    <section className="lp-section bg-slate-950 text-white">
      <div className="lp-container">
        <div className="grid gap-10 md:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="lp-eyebrow text-blue-300">Trust Proof</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">{text(c.title, 'Dipercaya untuk Kebutuhan Bisnis')}</h2>
            <p className="mt-4 leading-8 text-slate-300">{text(c.description, '')}</p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-3xl bg-white/10 p-4">
                  <div className="text-2xl font-black">{c[metricKey(n, 'Value')] || '-'}</div>
                  <div className="mt-1 text-xs text-slate-300">{c[metricKey(n, 'Label')] || 'Metric'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {testimonials.length > 0 ? (
              testimonials.slice(0, 2).map((item, i) => (
                <blockquote key={item.id || i} className="rounded-3xl bg-white p-6 text-slate-950">
                  <p className="text-lg font-bold">“{item.quote || item.description || 'Testimonial client akan tampil di sini.'}”</p>
                  <footer className="mt-4 text-sm text-slate-500">
                    {item.name} {item.company ? `— ${item.company}` : ''}
                  </footer>
                </blockquote>
              ))
            ) : (
              <div className="rounded-3xl bg-white/10 p-6 text-sm leading-7 text-slate-300">
                Testimonial belum ditambahkan. Bagian ini tetap tampil sebagai bukti kepercayaan ketika data tersedia.
              </div>
            )}

            {brands.length > 0 && (
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm font-bold text-slate-300">Partner / Brand</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brands.slice(0, 6).map((brand, i) => (
                    <span key={brand.id || i} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-800">
                      {brand.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaContactSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="rounded-[32px] bg-blue-600 p-8 text-white md:p-12">
          <Heading title={text(c.title, 'Siap Mendiskusikan Kebutuhan Anda?')} description={text(c.description, '')} />
          <CtaButtons {...props} secondary={false} />
        </div>
      </div>
    </section>
  );
}

function TextImageSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section">
      <div className="lp-container grid items-center gap-10 md:grid-cols-2">
        <div>
          <Heading
            title={text(c.title || c.visionTitle, props.section.slotLabel || 'Section')}
            description={text(c.description || c.vision || c.mission, '')}
          />
        </div>
        <div className="lp-card bg-slate-50 p-8">
          <p className="text-lg leading-8 text-slate-600">
            {text(c.valueOne || c.stepOne || c.benefitOne || c.missionTitle, 'Konten pendukung akan tampil di sini.')}
          </p>
          <p className="mt-3 text-lg leading-8 text-slate-600">{text(c.valueTwo || c.stepTwo || c.benefitTwo || c.mission, '')}</p>
          <p className="mt-3 text-lg leading-8 text-slate-600">{text(c.valueThree || c.stepThree || c.benefitThree, '')}</p>
        </div>
      </div>
    </section>
  );
}

function PageHeroSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="lp-container">
        <Heading
          center
          title={text(c.title, props.payload.page.navLabel || props.payload.page.title || 'Halaman')}
          description={text(c.description, props.payload.page.purpose || '')}
        />
      </div>
    </section>
  );
}

function ServiceGridSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section">
      <div className="lp-container">
        <Heading title={text(c.title, 'Daftar Layanan')} description={text(c.description, '')} />
        <PreviewCards
          items={props.section.data?.services || []}
          type="services"
          siteSlug={props.siteSlug}
          emptyTitle="Belum ada layanan"
          emptyDescription="Daftar layanan akan tampil setelah owner menambahkannya di dashboard."
        />
      </div>
    </section>
  );
}

function PortfolioGridSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section">
      <div className="lp-container">
        <Heading title={text(c.title, 'Daftar Portofolio')} description={text(c.description, '')} />
        <PreviewCards
          items={props.section.data?.portfolios || []}
          type="portfolios"
          siteSlug={props.siteSlug}
          emptyTitle="Belum ada portofolio"
          emptyDescription="Daftar portofolio akan tampil setelah owner menambahkannya di dashboard."
        />
      </div>
    </section>
  );
}

function ArticlePreviewSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section">
      <div className="lp-container">
        <Heading title={text(c.title, 'Daftar Artikel')} description={text(c.description, '')} />
        <PreviewCards
          items={props.section.data?.articles || []}
          type="articles"
          siteSlug={props.siteSlug}
          payload={props.payload}
          emptyTitle="Belum ada artikel published"
          emptyDescription="Artikel yang sudah published akan tampil di sini untuk mendukung SEO dan edukasi calon client."
        />
      </div>
    </section>
  );
}

function FeaturedArticleSection(props: SectionProps) {
  const articles = sortFeaturedFirst(props.section.data?.articles || []);
  const article = articles.find((item) => item.isFeatured) || articles[0];
  const c = props.section.content || {};

  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container">
        <Heading title={text(c.title, 'Artikel Pilihan')} description={text(c.description, '')} />
        {article ? (
          <a href={getArticleDetailHref(props.siteSlug, props.payload, article.slug)} className="mt-10 block">
            <article className="lp-card grid overflow-hidden md:grid-cols-[.9fr_1.1fr]">
              <div className="bg-slate-100">
                {imageOf(article) ? (
                  <img src={imageOf(article)!} alt={titleOf(article)} className="h-full min-h-[260px] w-full object-cover" />
                ) : null}
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black">{titleOf(article)}</h3>
                <p className="mt-3 leading-7 text-slate-600">{article.excerpt || article.description}</p>
              </div>
            </article>
          </a>
        ) : (
          <div className="mt-8">
            <PublicEmptyState
              title="Belum ada artikel pilihan"
              description="Tambahkan dan publish artikel agar bagian ini dapat menampilkan konten SEO utama."
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleDetailHeroSection(props: SectionProps) {
  const article = props.section.data?.article;
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="lp-container max-w-4xl">
        <p className="lp-eyebrow">Artikel</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
          {article?.title || props.payload.seo?.title || 'Detail Artikel'}
        </h1>
        {article?.excerpt && <p className="mt-5 text-lg leading-8 text-slate-600">{article.excerpt}</p>}
        {article?.coverImageUrl && (
          <img src={article.coverImageUrl} alt={article.title} className="mt-10 aspect-[16/8] w-full rounded-[32px] object-cover" />
        )}
      </div>
    </section>
  );
}

function ArticleContentSection(props: SectionProps) {
  const article = props.section.data?.article;
  return (
    <section className="lp-section">
      <article className="lp-container max-w-3xl prose-lite whitespace-pre-line text-slate-700">
        {article?.content || 'Konten artikel belum tersedia.'}
      </article>
    </section>
  );
}

function RelatedArticlesSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container">
        <Heading title={text(c.title, 'Artikel Terkait')} description={text(c.description, '')} />
        <PreviewCards
          items={props.section.data?.relatedArticles || props.section.data?.articles || []}
          type="articles"
          siteSlug={props.siteSlug}
          payload={props.payload}
          emptyTitle="Belum ada artikel terkait"
          emptyDescription="Artikel terkait akan tampil ketika ada artikel published lain."
        />
      </div>
    </section>
  );
}

function ArticleCtaSection(props: SectionProps) {
  return <CtaContactSection {...props} />;
}

function ContactInformationSection(props: SectionProps) {
  const bp = props.payload.businessProfile || {};
  const c = props.section.content || {};
  const email = bp.contactEmail || bp.email;

  return (
    <section className="lp-section">
      <div className="lp-container grid gap-8 md:grid-cols-2">
        <div>
          <Heading title={text(c.title, 'Informasi Kontak')} description={text(c.description, '')} />
          <div className="mt-8 grid gap-3 text-slate-700">
            {bp.whatsapp && <p><b>WhatsApp:</b> {bp.whatsapp}</p>}
            {email && <p><b>Email:</b> {email}</p>}
            {bp.address && <p><b>Alamat:</b> {bp.address}</p>}
            {!bp.whatsapp && !email && !bp.address && (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Informasi kontak belum dilengkapi.</p>
            )}
          </div>
        </div>
        <ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />
      </div>
    </section>
  );
}

function MapsLocationSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section bg-slate-50">
      <div className="lp-container">
        <Heading title={text(c.title, 'Lokasi Kami')} description={text(c.description, '')} />
        {c.mapEmbedUrl ? (
          <iframe src={c.mapEmbedUrl} className="mt-8 h-[360px] w-full rounded-[32px] border-0" loading="lazy" />
        ) : (
          <div className="mt-8 rounded-[32px] border border-dashed border-slate-300 p-12 text-center text-slate-500">
            Embed Google Maps belum diisi.
          </div>
        )}
      </div>
    </section>
  );
}

function ContactCtaSection(props: SectionProps) {
  const c = props.section.content || {};
  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Heading title={text(c.title, 'Kirim Kebutuhan Anda Sekarang')} description={text(c.description, '')} />
          </div>
          <ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />
        </div>
      </div>
    </section>
  );
}

const registry: Record<string, SectionComponent> = {
  HeroSection,
  ProfileSummarySection,
  ServicePreviewSection,
  PortfolioPreviewSection,
  TrustProofSection,
  CtaContactSection,
  OrganizationProfileSection: TextImageSection,
  HistoryTimelineSection: TextImageSection,
  VisionMissionSection: TextImageSection,
  ValueStatementSection: TextImageSection,
  TeamHighlightSection: TextImageSection,
  ServiceHeroSection: PageHeroSection,
  ServiceGridSection,
  ServiceProcessSection: TextImageSection,
  ServiceBenefitsSection: TextImageSection,
  ServiceFaqSection: TextImageSection,
  PortfolioHeroSection: PageHeroSection,
  PortfolioCategorySection: TextImageSection,
  PortfolioGridSection,
  CaseHighlightSection: TextImageSection,
  PortfolioCtaSection: CtaContactSection,
  ArticleHeroSection: PageHeroSection,
  FeaturedArticleSection,
  ArticlePreviewSection,
  ArticleDetailHeroSection,
  ArticleContentSection,
  RelatedArticlesSection,
  ArticleCtaSection,
  ContactHeroSection: PageHeroSection,
  ContactInformationSection,
  MapsLocationSection,
  ContactFaqSection: TextImageSection,
  ContactCtaSection,
};

export function RenderSections({ siteSlug, payload }: { siteSlug: string; payload: PublicPagePayload }) {
  const sections = payload.page.sections || [];

  if (!sections.length) {
    return (
      <section className="lp-section">
        <div className="lp-container">
          <PublicEmptyState
            title="Section belum dipilih"
            description="Pilih template section dari dashboard agar halaman ini tampil lengkap."
          />
        </div>
      </section>
    );
  }

  return (
    <>
      {sections.map((section) => {
        const Component = section.component ? registry[section.component] : null;
        return Component ? (
          <Component key={section.id || section.slotKey} siteSlug={siteSlug} payload={payload} section={section} />
        ) : (
          <EmptySection key={section.id || section.slotKey} section={section} />
        );
      })}
    </>
  );
}

export function RenderArticleDetail({ siteSlug, detail }: { siteSlug: string; detail: ArticleDetailPayload }) {
  const payload: PublicPagePayload = {
    website: detail.website,
    seo: detail.seo,
    businessProfile: detail.businessProfile,
    navigation: detail.navigation,
    page: {
      pageKey: 'article_detail',
      title: detail.article.title,
      slug: detail.article.slug,
      sections: []
    }
  };

  const heroSection: PublicSection = {
    id: 'article-detail-hero',
    slotKey: 'article_detail.article_detail_hero',
    component: 'ArticleDetailHeroSection',
    content: {},
    data: { article: detail.article, relatedArticles: detail.relatedArticles }
  };

  const contentSection: PublicSection = {
    id: 'article-content',
    slotKey: 'article_detail.article_content',
    component: 'ArticleContentSection',
    content: {},
    data: { article: detail.article, relatedArticles: detail.relatedArticles }
  };

  const relatedSection: PublicSection = {
    id: 'related-articles',
    slotKey: 'article_detail.related_articles',
    component: 'RelatedArticlesSection',
    content: { title: 'Artikel Terkait' },
    data: { article: detail.article, relatedArticles: detail.relatedArticles }
  };

  return (
    <>
      <ArticleDetailHeroSection siteSlug={siteSlug} payload={payload} section={heroSection} />
      <ArticleContentSection siteSlug={siteSlug} payload={payload} section={contentSection} />
      <RelatedArticlesSection siteSlug={siteSlug} payload={payload} section={relatedSection} />
    </>
  );
}
