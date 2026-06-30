import { FormalBadge, FormalButtonGroup, FormalCard, FormalEmpty, FormalHeading, FormalImageFrame, FormalSection, descriptionOf, imageOf, sortedByOrder, text, titleOf, type FormalSectionProps } from '../shared';

// Schema: title, description
export function FormalPortfolioHero(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection muted>
      <div className="grid items-center gap-12 md:grid-cols-[1fr_.9fr]">
        <div>
          <FormalHeading
            eyebrow="Portofolio"
            title={text(c.title, 'Rekam Jejak Pekerjaan yang Terukur')}
            description={text(c.description, 'Tampilkan contoh pekerjaan, studi kasus, atau hasil yang pernah dicapai agar calon klien lebih yakin.')}
          />
          <FormalButtonGroup {...props} />
        </div>
        <FormalImageFrame imageUrl={null} alt={text(c.title, 'Portofolio')} label="Portfolio" />
      </div>
    </FormalSection>
  );
}

// Schema: title, description
export function FormalPortfolioCategory(props: FormalSectionProps) {
  const c = props.section.content || {};
  const categories = sortedByOrder(props.section.data?.portfolioCategories || []);
  return (
    <FormalSection compact>
      <FormalHeading
        eyebrow="Kategori"
        title={text(c.title, 'Kategori Portofolio')}
        description={text(c.description, 'Kategori aktif membantu pengunjung memahami jenis pekerjaan yang pernah ditangani.')}
      />
      {categories.length ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <FormalBadge key={category.id || index}>{category.name || category.title}</FormalBadge>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <FormalEmpty title="Kategori portofolio belum tersedia" description="Tambahkan kategori aktif agar portofolio lebih mudah dipahami." />
        </div>
      )}
    </FormalSection>
  );
}

// Schema: title, description
export function FormalPortfolioGrid(props: FormalSectionProps) {
  const c = props.section.content || {};
  const items = sortedByOrder(props.section.data?.portfolios || []);
  return (
    <FormalSection>
      <FormalHeading
        eyebrow="Daftar Portofolio"
        title={text(c.title, 'Pekerjaan dan Studi Kasus Pilihan')}
        description={text(c.description, 'Semua portofolio aktif tampil di bagian ini, dengan label kategori jika tersedia.')}
      />
      {items.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const img = imageOf(item);
            return (
              <FormalCard key={item.id || index} className="overflow-hidden transition hover:-translate-y-1 hover:border-[#649FF6]/40 hover:shadow-md">
                <div className="aspect-[16/10] bg-slate-100">
                  {img
                    ? <img src={img} alt={titleOf(item)} className="h-full w-full object-cover" loading="lazy" />
                    : <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">Portfolio #{index + 1}</div>
                  }
                </div>
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.isFeatured && <FormalBadge tone="rose">Unggulan</FormalBadge>}
                    {item.category?.name && <FormalBadge>{item.category.name}</FormalBadge>}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950">{titleOf(item)}</h3>
                  <p className="mt-3 line-clamp-4 leading-7 text-slate-600">{descriptionOf(item)}</p>
                </div>
              </FormalCard>
            );
          })}
        </div>
      ) : (
        <div className="mt-8">
          <FormalEmpty title="Portofolio belum tersedia" description="Tambahkan portofolio aktif agar contoh pekerjaan tampil di website publik." />
        </div>
      )}
    </FormalSection>
  );
}

// Schema: title, description, imageUrl
export function FormalPortfolioCaseHighlight(props: FormalSectionProps) {
  const c = props.section.content || {};
  const item = sortedByOrder(props.section.data?.portfolios || [])[0];
  return (
    <FormalSection muted>
      <div className="grid items-center gap-12 md:grid-cols-[.95fr_1.05fr]">
        <FormalImageFrame
          imageUrl={text(c.imageUrl) || imageOf(item || {}) || null}
          alt={text(c.title, 'Studi kasus')}
          label="Case Study"
        />
        <div>
          <FormalHeading
            eyebrow="Studi Kasus"
            title={text(c.title, item ? titleOf(item) : 'Sorotan Portofolio')}
            description={text(c.description, item ? descriptionOf(item) : 'Sorot satu contoh pekerjaan penting untuk menjelaskan cara bisnis Anda memberi nilai.')}
          />
        </div>
      </div>
    </FormalSection>
  );
}

// Schema: title, description, ctaLabel, ctaUrl
export function FormalPortfolioCta(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection compact>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <FormalHeading
            eyebrow="Diskusi Proyek"
            title={text(c.title, 'Ingin Membahas Kebutuhan Serupa?')}
            description={text(c.description, 'Hubungi tim kami untuk melihat apakah pendekatan ini cocok dengan kebutuhan bisnis Anda.')}
          />
          <FormalButtonGroup {...props} secondary={false} />
        </div>
      </div>
    </FormalSection>
  );
}
