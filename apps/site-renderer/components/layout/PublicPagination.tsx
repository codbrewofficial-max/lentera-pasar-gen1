import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSiteHref } from '@/lib/links';
import type { PaginationMeta } from '@/lib/api';

/**
 * Pagination untuk halaman listing publik (Portfolio Grid & Articles Grid). Sengaja dibuat
 * netral (tidak mengikuti gaya "kaku" Formal atau tema lain) supaya konsisten dipakai di
 * semua tema tanpa perlu diduplikasi 4x. Navigasi murni lewat query string ?page=N (server
 * component, tanpa JS di client) supaya tetap cepat dan SEO-friendly.
 */
export function PublicPagination({
  siteSlug,
  basePath,
  pagination,
  extraQuery
}: {
  siteSlug: string;
  basePath: string;
  pagination: PaginationMeta;
  extraQuery?: Record<string, string | undefined>;
}) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const hrefForPage = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(extraQuery || {}).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (targetPage > 1) params.set('page', String(targetPage));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return `${getSiteHref(siteSlug, basePath)}${suffix}`;
  };

  const pageNumbers = buildPageWindow(page, totalPages);

  return (
    <nav aria-label="Navigasi halaman" className="mt-12 flex items-center justify-center gap-1.5">
      <Link
        href={hrefForPage(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`inline-flex h-10 w-10 items-center justify-center border text-sm font-semibold transition-colors ${
          page <= 1
            ? 'pointer-events-none border-slate-100 text-slate-300'
            : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pageNumbers.map((entry, idx) =>
        entry === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-sm text-slate-400">
            &hellip;
          </span>
        ) : (
          <Link
            key={entry}
            href={hrefForPage(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={`inline-flex h-10 w-10 items-center justify-center border text-sm font-semibold transition-colors ${
              entry === page
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            {entry}
          </Link>
        )
      )}

      <Link
        href={hrefForPage(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`inline-flex h-10 w-10 items-center justify-center border text-sm font-semibold transition-colors ${
          page >= totalPages
            ? 'pointer-events-none border-slate-100 text-slate-300'
            : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

function buildPageWindow(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('ellipsis');
    result.push(p);
    prev = p;
  }
  return result;
}
