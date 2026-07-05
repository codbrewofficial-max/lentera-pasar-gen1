import type { CrudItem, ProductSummary, PublicPagePayload, PublicSection } from "@/lib/types";
import { resolveTargetHref } from "@/lib/links";

export type CatalogSectionProps = { siteSlug: string; payload: PublicPagePayload; section: PublicSection };

export function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

// Ambil string pertama yang tidak kosong dari beberapa sumber (content -> data CRUD ->
// default hardcoded).
export function pick(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function contentOf(section: PublicSection) {
  return section.content || {};
}

export function businessOf(payload: PublicPagePayload) {
  return payload.businessProfile || {};
}

export function contentImage(content: Record<string, any>, fallback = "") {
  return (
    text(content.imageUrl) ||
    text(content.coverImageUrl) ||
    text(content.backgroundImageUrl) ||
    fallback
  );
}

export function sectionHref(props: CatalogSectionProps, prefix: string, fallback: string) {
  return resolveTargetHref({
    siteSlug: props.siteSlug,
    navigation: props.payload.navigation,
    content: contentOf(props.section),
    prefix,
    fallback
  });
}

export function formatIDR(value?: number | null) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function primaryImage(product: ProductSummary, fallback: string) {
  const images = product.images || [];
  const primary = images.find((image) => image.isPrimary) || images[0];
  return primary?.url || fallback;
}

export function articleImage(article: CrudItem, fallback: string) {
  return text(article.coverImageUrl, fallback);
}

export function formatArticleDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(date);
}

export function metricKey(n: number, field: "Label" | "Value") {
  return `metric${["", "One", "Two", "Three"][n]}${field}`;
}

export function whatsappHref(payload: PublicPagePayload) {
  const business = businessOf(payload);
  const raw = text(business.whatsapp) || text(business.phone);
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}
