import { FormalBadge, FormalButtonGroup, FormalCard, FormalEmpty, FormalHeading, FormalImageFrame, FormalSection, boolValue, descriptionOf, formatDate, getArticleHref, imageOf, maxWidthClass, text, titleOf, type FormalSectionProps } from '../shared';

export function FormalArticleDetailHero(props: FormalSectionProps) {
  const c = props.section.content || {};
  const article = props.section.data?.article || {};
  const showCover = boolValue(c.showCoverImage, true);
  const showDate = boolValue(c.showPublishedDate, true);
  return (
    <FormalSection muted>
      <div className="mx-auto max-w-4xl text-center">
        <div className="flex justify-center gap-2">{article.category?.name && <FormalBadge>{article.category.name}</FormalBadge>}</div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">{text(c.title, titleOf(article))}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{text(c.description, descriptionOf(article))}</p>
        {showDate && article.publishedAt && <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{formatDate(article.publishedAt)}</p>}
      </div>
      {showCover && imageOf(article) && <div className="mx-auto mt-10 max-w-5xl"><FormalImageFrame imageUrl={imageOf(article)} alt={titleOf(article)} label="Article Cover" /></div>}
    </FormalSection>
  );
}

export function FormalArticleContent(props: FormalSectionProps) {
  const c = props.section.content || {};
  const article = props.section.data?.article || {};
  const showShare = boolValue(c.showShareCta, true);
  const paragraphs = String(article.content || article.description || article.excerpt || '').split(/\n{2,}/).filter(Boolean);
  return (
    <FormalSection>
      <article className={`mx-auto ${maxWidthClass(c.maxContentWidth)} text-slate-700`}>
        {paragraphs.length ? paragraphs.map((paragraph, index) => <p key={index} className="mt-6 first:mt-0 text-lg leading-9">{paragraph}</p>) : <FormalEmpty title="Konten artikel belum tersedia" description="Isi konten artikel di dashboard agar detail artikel tampil lengkap." />}
        {showShare && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-950">Bagikan artikel ini</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Salin tautan halaman ini dari browser untuk membagikan artikel kepada calon klien atau rekan kerja.</p>
          </div>
        )}
      </article>
    </FormalSection>
  );
}

export function FormalRelatedArticles(props: FormalSectionProps) {
  const c = props.section.content || {};
  const items = (props.section.data?.relatedArticles || []).slice(0, 3);
  return (
    <FormalSection muted>
      <FormalHeading eyebrow="Artikel Terkait" title={text(c.title, 'Bacaan yang Masih Relevan')} description={text(c.description, 'Artikel terkait diprioritaskan dari kategori yang sama, lalu artikel published terbaru.')} />
      {items.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <a key={item.id || item.slug || index} href={getArticleHref(props.siteSlug, props.payload, item.slug)} className="block h-full">
              <FormalCard className="h-full p-6 transition hover:-translate-y-1 hover:border-[#649FF6]/40 hover:shadow-md">
                <div className="mb-3 flex flex-wrap gap-2">{item.category?.name && <FormalBadge>{item.category.name}</FormalBadge>}</div>
                <h3 className="text-xl font-semibold text-slate-950">{titleOf(item)}</h3>
                <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{descriptionOf(item)}</p>
              </FormalCard>
            </a>
          ))}
        </div>
      ) : <div className="mt-8"><FormalEmpty title="Belum ada artikel terkait" description="Artikel terkait akan tampil ketika ada artikel published lain." /></div>}
    </FormalSection>
  );
}

export function FormalArticleCta(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection compact>
      <div className="rounded-3xl bg-slate-950 p-8 text-white md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <FormalHeading inverse eyebrow="Tindak Lanjut" title={text(c.title, 'Butuh Bantuan Setelah Membaca Artikel Ini?')} description={text(c.description, 'Hubungi tim kami untuk mendiskusikan kebutuhan Anda secara lebih terarah.')} />
          <FormalButtonGroup {...props} secondary={false} />
        </div>
      </div>
    </FormalSection>
  );
}
