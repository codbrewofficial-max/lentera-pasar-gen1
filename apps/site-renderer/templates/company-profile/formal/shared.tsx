import type { ReactNode } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Handshake,
  Layers,
  Mail,
  MapPin,
  Phone,
  Quote,
  Scale,
  ShieldCheck,
  Star,
  Target,
  Users
} from 'lucide-react';
import type { CrudItem, PublicPagePayload, PublicSection } from '@/lib/types';
import { getSiteHref, resolveTargetHref } from '@/lib/links';
import { CtaLink } from '@/components/tracking/CtaLink';
import { PublicEmptyState } from '@/components/layout/PublicState';

export type FormalSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };

export function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function boolValue(value: unknown, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'ya', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'tidak', 'off'].includes(normalized)) return false;
  return fallback;
}

export function titleOf(item: CrudItem) {
  return item.title || item.name || 'Item';
}

export function descriptionOf(item: CrudItem) {
  return item.description || item.excerpt || item.quote || item.summary || 'Informasi singkat akan tampil di sini.';
}

export function imageOf(item: CrudItem) {
  return item.imageUrl || item.coverImageUrl || item.logoUrl || item.thumbnailUrl || null;
}

export function categoryNameOf(item: CrudItem) {
  return item.category?.name || item.categoryName || item.category || null;
}

export function contentImageOf(content: Record<string, any>) {
  return (
    text(content.imageUrl) ||
    text(content.coverImageUrl) ||
    text(content.heroImageUrl) ||
    text(content.backgroundImageUrl) ||
    text(content.illustrationImageUrl) ||
    text(content.photoUrl) ||
    text(content.thumbnailUrl) ||
    ''
  );
}

export function sortedByOrder(items: CrudItem[]) {
  return [...items].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

export function sortFeaturedFirst(items: CrudItem[]) {
  return [...items].sort((a, b) => {
    const featuredDelta = Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
    if (featuredDelta !== 0) return featuredDelta;
    const featuredOrderDelta = Number(a.featuredOrder || 0) - Number(b.featuredOrder || 0);
    if (featuredOrderDelta !== 0) return featuredOrderDelta;
    return Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
  });
}

export function pickFeatured(items: CrudItem[], limit: number) {
  return sortFeaturedFirst(items).filter((item) => item.isFeatured).slice(0, limit);
}

export function pickActive(items: CrudItem[], limit: number) {
  return sortedByOrder(items).slice(0, limit);
}

export function pickFaqs(items: CrudItem[], pageKey: string, limit = 10) {
  const sorted = sortedByOrder(items);
  const exact = sorted.filter((item) => item.pageKey === pageKey || item.category === pageKey);
  return (exact.length ? exact : sorted).slice(0, limit);
}

export function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(date);
}

export function getArticleHref(siteSlug: string, payload: PublicPagePayload, articleSlug?: string | null) {
  const articlePage = payload.navigation?.availableTargets?.find((item) => item.type === 'page' && item.pageKey === 'articles');
  const base = (articlePage?.path || '/articles').replace(/\/$/, '') || '/articles';
  return getSiteHref(siteSlug, `${base}/${articleSlug || ''}`);
}

export function maxWidthClass(value: unknown) {
  const normalized = String(value || '').toLowerCase();
  if (['narrow', 'sempit', 'small'].includes(normalized)) return 'max-w-2xl';
  if (['wide', 'lebar', 'large'].includes(normalized)) return 'max-w-5xl';
  return 'max-w-3xl';
}

export function FormalSection({ children, muted = false, compact = false }: { children: ReactNode; muted?: boolean; compact?: boolean }) {
  return (
    <section className={`${muted ? 'bg-slate-50' : 'bg-white'} ${compact ? 'py-12 md:py-16' : 'py-16 md:py-24'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function FormalEyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#649FF6]">{children}</p>;
}

export function FormalHeading({
  eyebrow,
  title,
  description,
  center = false,
  inverse = false
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <FormalEyebrow>{eyebrow}</FormalEyebrow>}
      <h2 className={`mt-3 text-3xl font-semibold tracking-tight md:text-5xl ${inverse ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-8 md:text-lg ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>}
    </div>
  );
}

export function FormalButtonGroup({ siteSlug, payload, section, secondary = true }: FormalSectionProps & { secondary?: boolean }) {
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
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <CtaLink
        href={primaryHref}
        label={primaryLabel}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[#649FF6] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-[#649FF6] focus:ring-offset-2"
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
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-[#649FF6] hover:text-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6] focus:ring-offset-2"
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

export function FormalCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function FormalEmpty({ title, description }: { title: string; description: string }) {
  return <PublicEmptyState title={title} description={description} />;
}

export function FormalBadge({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'rose' | 'slate' | 'purple' }) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    purple: 'bg-purple-50 text-purple-700 ring-purple-100'
  }[tone];
  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ring-1 ${toneClass}`}>{children}</span>;
}

export function FormalImageFrame({ imageUrl, alt, label }: { imageUrl?: string | null; alt: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="aspect-[16/11] w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex aspect-[16/11] items-center justify-center p-8 text-center">
          <div>
            <ShieldCheck className="mx-auto h-10 w-10 text-[#649FF6]" />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{label || 'Company Profile'}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Visual bisnis akan tampil di sini</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FormalStatGrid({ content }: { content: Record<string, any> }) {
  const items = [
    { label: text(content.metricOneLabel, 'Tahun Pengalaman'), value: text(content.metricOneValue, '5+') },
    { label: text(content.metricTwoLabel, 'Proyek Selesai'), value: text(content.metricTwoValue, '50+') },
    { label: text(content.metricThreeLabel, 'Klien Terbantu'), value: text(content.metricThreeValue, '30+') }
  ];
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {items.map((item) => (
        <div key={item.label} className="p-4 text-center md:p-6">
          <div className="text-2xl font-semibold text-slate-950 md:text-3xl">{item.value}</div>
          <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export const formalIcons = {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Handshake,
  Layers,
  Mail,
  MapPin,
  Phone,
  Quote,
  Scale,
  ShieldCheck,
  Star,
  Target,
  Users
};
