import {
  FormalBadge,
  FormalButtonGroup,
  FormalCard,
  FormalEmpty,
  FormalHeading,
  FormalImageFrame,
  FormalSection,
  FormalStatGrid,
  contentImageOf,
  descriptionOf,
  formalIcons,
  imageOf,
  pickFeatured,
  text,
  titleOf,
  type FormalSectionProps
} from '../shared';

function FormalMiniCard({ title, description, index }: { title: string; description: string; index: number }) {
  return (
    <FormalCard className="p-5 transition hover:-translate-y-1 hover:border-[#649FF6]/40 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-sm font-bold text-[#649FF6]">{String(index).padStart(2, '0')}</div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p>
    </FormalCard>
  );
}

export function FormalHomeHero(props: FormalSectionProps) {
  const c = props.section.content || {};
  const bp = props.payload.businessProfile || {};
  const imageUrl = contentImageOf(c) || bp.coverImageUrl || bp.logoUrl || null;

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(100,159,246,.28),transparent_36%),linear-gradient(135deg,rgba(255,255,255,.08),transparent_45%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1.08fr_.92fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">{text(c.eyebrow, 'Company Profile Formal')}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">{text(c.title || c.heading, props.payload.website.name)}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{text(c.subtitle || c.description, bp.tagline || bp.description || 'Profil bisnis profesional yang membantu calon klien memahami layanan, portofolio, dan cara menghubungi Anda.')}</p>
          <FormalButtonGroup {...props} />
          <div className="mt-8 max-w-2xl">
            <FormalStatGrid content={c} />
          </div>
        </div>
        <div>
          <FormalImageFrame imageUrl={imageUrl} alt={text(c.imageAlt || c.title, props.payload.website.name)} label="Formal Company Profile" />
        </div>
      </div>
    </section>
  );
}

export function FormalHomeProfileSummary(props: FormalSectionProps) {
  const c = props.section.content || {};
  const bp = props.payload.businessProfile || {};
  const imageUrl = contentImageOf(c) || bp.logoUrl || null;
  return (
    <FormalSection>
      <div className="grid items-center gap-12 md:grid-cols-[.9fr_1.1fr]">
        <FormalImageFrame imageUrl={imageUrl} alt={text(c.imageAlt || bp.name, 'Profil bisnis')} label="Tentang Kami" />
        <div>
          <FormalHeading eyebrow="Profil Singkat" title={text(c.title, bp.name || 'Tentang Bisnis Kami')} description={text(c.description, bp.description || 'Lengkapi profil bisnis di dashboard agar bagian ini menampilkan narasi yang lebih relevan.')} />
          <div className="mt-6 rounded-2xl border-l-4 border-[#649FF6] bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {text(c.highlightText, bp.tagline || 'Kami membantu calon klien memahami keunggulan, layanan, dan kredibilitas bisnis Anda secara ringkas.')}
          </div>
          <FormalButtonGroup {...props} secondary={false} />
        </div>
      </div>
    </FormalSection>
  );
}

export function FormalHomeServicePreview(props: FormalSectionProps) {
  const c = props.section.content || {};
  const items = pickFeatured(props.section.data?.services || [], 3);
  return (
    <FormalSection muted>
      <FormalHeading eyebrow="Layanan Unggulan" title={text(c.title, 'Layanan Prioritas untuk Kebutuhan Bisnis')} description={text(c.description, 'Tiga layanan unggulan yang dipilih owner akan tampil di halaman utama.')} />
      {items.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => <FormalMiniCard key={item.id || index} title={titleOf(item)} description={descriptionOf(item)} index={index + 1} />)}
        </div>
      ) : (
        <div className="mt-8"><FormalEmpty title="Belum ada layanan unggulan" description="Tandai 3 layanan sebagai unggulan di dashboard agar tampil di halaman utama." /></div>
      )}
      <FormalButtonGroup {...props} secondary={false} />
    </FormalSection>
  );
}

export function FormalHomePortfolioPreview(props: FormalSectionProps) {
  const c = props.section.content || {};
  const items = pickFeatured(props.section.data?.portfolios || [], 3);
  return (
    <FormalSection>
      <FormalHeading eyebrow="Portofolio Pilihan" title={text(c.title, 'Bukti Pekerjaan yang Membantu Membangun Kepercayaan')} description={text(c.description, 'Tiga portofolio unggulan teratas akan tampil sebagai ringkasan di halaman utama.')} />
      {items.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => {
            const img = imageOf(item);
            return (
              <FormalCard key={item.id || index} className="overflow-hidden transition hover:-translate-y-1 hover:border-[#649FF6]/40 hover:shadow-md">
                <div className="aspect-[16/10] bg-slate-100">
                  {img ? <img src={img} alt={titleOf(item)} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">Portofolio #{index + 1}</div>}
                </div>
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap gap-2"><FormalBadge tone="slate">Unggulan</FormalBadge>{item.category?.name && <FormalBadge>{item.category.name}</FormalBadge>}</div>
                  <h3 className="text-lg font-semibold text-slate-950">{titleOf(item)}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{descriptionOf(item)}</p>
                </div>
              </FormalCard>
            );
          })}
        </div>
      ) : (
        <div className="mt-8"><FormalEmpty title="Belum ada portofolio unggulan" description="Tandai 3 portofolio sebagai unggulan agar tampil di halaman utama." /></div>
      )}
      <FormalButtonGroup {...props} secondary={false} />
    </FormalSection>
  );
}

export function FormalHomeTrustProof(props: FormalSectionProps) {
  const c = props.section.content || {};
  const testimonials = (props.section.data?.testimonials || []).slice(0, 5);
  const brands = props.section.data?.brands || [];
  const { Quote, Star } = formalIcons;
  return (
    <FormalSection muted>
      <div className="grid gap-10 md:grid-cols-[.85fr_1.15fr]">
        <div>
          <FormalHeading eyebrow="Kepercayaan" title={text(c.title, 'Dipercaya untuk Kebutuhan Profesional')} description={text(c.description, 'Testimoni aktif teratas dan partner bisnis akan tampil sebagai bukti kepercayaan.')} />
          <div className="mt-8"><FormalStatGrid content={c} /></div>
        </div>
        <div className="space-y-4">
          {testimonials.length ? testimonials.map((item, index) => (
            <FormalCard key={item.id || index} className="p-6">
              <Quote className="h-7 w-7 text-[#649FF6]" />
              <p className="mt-3 text-base font-medium leading-8 text-slate-800">“{item.quote || item.description}”</p>
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div><p className="font-semibold text-slate-950">{item.name}</p><p className="text-sm text-slate-500">{item.role}{item.company ? ` · ${item.company}` : ''}</p></div>
                <div className="flex text-[#F56B71]">{[0, 1, 2, 3, 4].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}</div>
              </div>
            </FormalCard>
          )) : <FormalEmpty title="Testimoni belum tersedia" description="Tambahkan testimoni aktif agar bagian bukti kepercayaan lebih kuat." />}
          {brands.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {brands.slice(0, 6).map((brand, index) => <FormalBadge key={brand.id || index} tone="purple">{brand.name}</FormalBadge>)}
            </div>
          )}
        </div>
      </div>
    </FormalSection>
  );
}

export function FormalHomeCtaContact(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection compact>
      <div className="rounded-3xl bg-slate-950 p-8 text-white md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <FormalHeading inverse eyebrow="Diskusi Kebutuhan" title={text(c.title, 'Siap Membahas Kebutuhan Bisnis Anda?')} description={text(c.description, 'Hubungi tim kami untuk mendapatkan arahan awal yang jelas dan profesional.')} />
          <FormalButtonGroup {...props} secondary={false} />
        </div>
      </div>
    </FormalSection>
  );
}
