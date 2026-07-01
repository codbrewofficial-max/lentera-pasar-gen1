import { FormalBadge, FormalCard, FormalEmpty, FormalHeading, FormalImageFrame, FormalSection, contentImageOf, descriptionOf, formatDate, getArticleHref, imageOf, sortFeaturedFirst, sortedByOrder, text, titleOf, type FormalSectionProps } from '../shared';

function ArticleCard({ item, siteSlug, payload }: { item: any; siteSlug: string; payload: FormalSectionProps['payload'] }) {
  const img = imageOf(item);
  return (
    <a href={getArticleHref(siteSlug, payload, item.slug)} className="block h-full">
      <FormalCard className="h-full overflow-hidden transition hover:-translate-y-1 hover:border-[#649FF6]/40 hover:shadow-md">
        <div className="aspect-[16/10] bg-slate-100">
          {img ? <img src={img} alt={titleOf(item)} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">Artikel</div>}
        </div>
        <div className="p-6">
          <div className="mb-3 flex flex-wrap gap-2">{item.isFeatured && <FormalBadge tone="rose">Unggulan</FormalBadge>}{item.category?.name && <FormalBadge>{item.category.name}</FormalBadge>}</div>
          <h3 className="text-xl font-semibold text-slate-950">{titleOf(item)}</h3>
          <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{descriptionOf(item)}</p>
          {item.publishedAt && <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{formatDate(item.publishedAt)}</p>}
        </div>
      </FormalCard>
    </a>
  );
}

export function FormalArticlesHero(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection muted>
      <div className="grid items-center gap-12 md:grid-cols-[1fr_.9fr]">
        <div>
          <FormalHeading eyebrow="Artikel" title={text(c.title, 'Wawasan dan Informasi untuk Calon Klien')} description={text(c.description, 'Bagikan artikel yang membantu pengunjung memahami bisnis, layanan, dan sudut pandang profesional Anda.')} />
        </div>
        <FormalImageFrame imageUrl={contentImageOf(c)} alt={text(c.imageAlt || c.title, 'Artikel')} label="Articles" />
      </div>
    </FormalSection>
  );
}

export function FormalFeaturedArticle(props: FormalSectionProps) {
  const c = props.section.content || {};
  const article = sortFeaturedFirst(props.section.data?.articles || [])[0];
  return (
    <FormalSection>
      <FormalHeading eyebrow="Artikel Unggulan" title={text(c.title, 'Sorotan Artikel Terbaru')} description={text(c.description, 'Artikel unggulan membantu pengunjung melihat insight utama bisnis Anda.')} />
      {article ? (
        <a href={getArticleHref(props.siteSlug, props.payload, article.slug)} className="mt-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-[#649FF6]/40 hover:shadow-md md:grid-cols-[.95fr_1.05fr]">
          <div className="aspect-[16/11] bg-slate-100 md:aspect-auto">
            {imageOf(article) ? <img src={imageOf(article)!} alt={titleOf(article)} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full min-h-[280px] items-center justify-center text-sm font-semibold text-slate-400">Artikel Unggulan</div>}
          </div>
          <div className="p-7 md:p-10">
            <div className="flex flex-wrap gap-2">{article.category?.name && <FormalBadge>{article.category.name}</FormalBadge>}<FormalBadge tone="rose">Unggulan</FormalBadge></div>
            <h3 className="mt-5 text-2xl font-semibold text-slate-950 md:text-4xl">{titleOf(article)}</h3>
            <p className="mt-4 leading-8 text-slate-600">{descriptionOf(article)}</p>
            {article.publishedAt && <p className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">{formatDate(article.publishedAt)}</p>}
          </div>
        </a>
      ) : <div className="mt-8"><FormalEmpty title="Artikel unggulan belum tersedia" description="Tandai artikel published sebagai unggulan agar tampil di bagian ini." /></div>}
    </FormalSection>
  );
}

export function FormalArticlePreview(props: FormalSectionProps) {
  const c = props.section.content || {};
  const articles = sortedByOrder(props.section.data?.articles || []).slice(0, 9);
  return (
    <FormalSection muted>
      <FormalHeading eyebrow="Daftar Artikel" title={text(c.title, 'Artikel Terbaru')} description={text(c.description, 'Artikel published tampil dengan kategori, ringkasan, dan tautan detail.')} />
      {articles.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((item) => <ArticleCard key={item.id || item.slug} item={item} siteSlug={props.siteSlug} payload={props.payload} />)}
        </div>
      ) : <div className="mt-8"><FormalEmpty title="Artikel belum tersedia" description="Tambahkan artikel berstatus published agar tampil di website publik." /></div>}
    </FormalSection>
  );
}
