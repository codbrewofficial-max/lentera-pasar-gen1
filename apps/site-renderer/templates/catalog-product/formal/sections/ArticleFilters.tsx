'use client';

import type { CrudItem } from '@/lib/types';

// Sama pola dengan FaqSearchInput: memfilter kartu artikel di slot Article Grid (section
// terpisah) lewat DOM query (data-article-item / data-article-title / data-article-category),
// bukan lewat React state. Beroperasi hanya pada artikel yang sudah dimuat di halaman saat
// ini (per-halaman paginasi), bukan pencarian/filter global lintas seluruh artikel.
export function ArticleSearchInput() {
  return (
    <div className="mx-auto mt-6 max-w-lg">
      <input
        type="search"
        placeholder="Cari judul artikel di halaman ini..."
        aria-label="Cari artikel"
        onChange={(event) => {
          const query = event.currentTarget.value.trim().toLowerCase();
          document.querySelectorAll<HTMLElement>('[data-article-item]').forEach((element) => {
            const title = (element.getAttribute('data-article-title') || '').toLowerCase();
            element.style.display = !query || title.includes(query) ? '' : 'none';
          });
        }}
        className="w-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-slate-400 focus:border-white/50 focus:outline-none"
      />
    </div>
  );
}

export function ArticleCategoryFilter({ categories }: { categories: CrudItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        data-article-filter-all
        onClick={() => {
          document.querySelectorAll<HTMLElement>('[data-article-item]').forEach((element) => {
            element.style.display = '';
          });
        }}
        className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => {
            document.querySelectorAll<HTMLElement>('[data-article-item]').forEach((element) => {
              const categoryId = element.getAttribute('data-article-category');
              element.style.display = categoryId === category.id ? '' : 'none';
            });
          }}
          className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
