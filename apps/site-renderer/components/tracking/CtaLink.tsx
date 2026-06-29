'use client';
import Link from 'next/link';
import { submitTracking } from '@/lib/api';
type Props = { href: string; label: string; className?: string; trackingKey?: string; pageKey?: string; pageSlug?: string; slotKey?: string; sectionKey?: string | null; ctaKey?: string };
export function CtaLink({ href, label, className, trackingKey, pageKey, pageSlug, slotKey, sectionKey, ctaKey = 'primary' }: Props) {
  const onClick = () => { if (!trackingKey) return; const visitorId = window.localStorage.getItem('LP_VISITOR_ID') || undefined; const sessionId = window.localStorage.getItem('LP_SESSION_ID') || undefined; submitTracking({ trackingKey, eventName: href.includes('wa.me') ? 'whatsapp_click' : 'cta_click', visitorId, sessionId, pageKey, pageSlug, slotKey, sectionKey, ctaKey, referrer: document.referrer || '', utm: Object.fromEntries(new URLSearchParams(window.location.search).entries()), metadata: { href, path: window.location.pathname } }); };
  if (/^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return <a href={href} onClick={onClick} className={className}>{label}</a>;
  return <Link href={href} onClick={onClick} className={className}>{label}</Link>;
}
