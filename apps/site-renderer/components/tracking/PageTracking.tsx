'use client';
import { useEffect } from 'react';
import { submitTracking } from '@/lib/api';
import type { ArticleDetailPayload, PublicPagePayload } from '@/lib/types';
function getOrCreateStorageValue(key: string, prefix: string) { const existing = window.localStorage.getItem(key); if (existing) return existing; const value = `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`; window.localStorage.setItem(key, value); return value; }
function trackingContext() { return { visitorId: getOrCreateStorageValue('LP_VISITOR_ID', 'visitor'), sessionId: getOrCreateStorageValue('LP_SESSION_ID', 'session'), referrer: document.referrer || '', utm: Object.fromEntries(new URLSearchParams(window.location.search).entries()) }; }
export function PageTracking({ payload }: { payload: PublicPagePayload }) {
  useEffect(() => { if (!payload.website.trackingKey) return; const base = trackingContext(); submitTracking({ trackingKey: payload.website.trackingKey, eventName: 'page_view', ...base, pageKey: payload.page.pageKey, pageSlug: payload.page.slug || '', metadata: { path: window.location.pathname } }); for (const section of payload.page.sections || []) { submitTracking({ trackingKey: payload.website.trackingKey, eventName: 'section_view', ...base, pageKey: payload.page.pageKey, pageSlug: payload.page.slug || '', slotKey: section.slotKey, sectionKey: section.sectionKey, metadata: { path: window.location.pathname } }); } }, [payload]);
  return null;
}
export function ArticleTracking({ detail }: { detail: ArticleDetailPayload }) {
  useEffect(() => { if (!detail.trackingKey) return; submitTracking({ trackingKey: detail.trackingKey, eventName: 'article_view', ...trackingContext(), pageKey: 'article_detail', pageSlug: detail.article.slug, objectType: 'article', objectId: detail.article.id, metadata: { path: window.location.pathname, title: detail.article.title } }); }, [detail]);
  return null;
}
