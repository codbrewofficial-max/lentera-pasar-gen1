'use client';

import { useEffect } from 'react';
import { submitTracking } from '@/lib/api';
import type { ArticleDetailPayload, PortfolioDetailPayload, ProductDetailPayload, PublicPagePayload } from '@/lib/types';

function getOrCreateStorageValue(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(key, value);
  return value;
}

function trackingContext() {
  return {
    visitorId: getOrCreateStorageValue('LP_VISITOR_ID', 'visitor'),
    sessionId: getOrCreateStorageValue('LP_SESSION_ID', 'session'),
    referrer: document.referrer || null,
    utm: Object.fromEntries(new URLSearchParams(window.location.search).entries())
  };
}

export function PageTracking({ payload }: { payload: PublicPagePayload }) {
  useEffect(() => {
    if (!payload.website.trackingKey) return;

    const base = trackingContext();
    const pageKey = payload.page.pageKey;
    const pageSlug = payload.page.slug || '';
    const path = window.location.pathname;

    submitTracking({
      trackingKey: payload.website.trackingKey,
      eventName: 'page_view',
      ...base,
      pageKey,
      pageSlug,
      metadata: { path }
    });

    // Hindari mengirim terlalu banyak request sekaligus pada render pertama.
    // Tetap mencatat section_view, tetapi dijeda singkat per section.
    const timers = (payload.page.sections || []).map((section, index) =>
      window.setTimeout(() => {
        submitTracking({
          trackingKey: payload.website.trackingKey,
          eventName: 'section_view',
          ...base,
          pageKey,
          pageSlug,
          slotKey: section.slotKey,
          sectionKey: section.sectionKey || null,
          metadata: { path }
        });
      }, 150 + index * 80)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [payload]);

  return null;
}

export function ArticleTracking({ detail }: { detail: ArticleDetailPayload }) {
  useEffect(() => {
    if (!detail.trackingKey) return;

    submitTracking({
      trackingKey: detail.trackingKey,
      eventName: 'article_view',
      ...trackingContext(),
      pageKey: 'article_detail',
      pageSlug: detail.article.slug,
      objectType: 'article',
      objectId: detail.article.id,
      metadata: {
        path: window.location.pathname,
        title: detail.article.title
      }
    });
  }, [detail]);

  return null;
}

export function PortfolioTracking({ detail }: { detail: PortfolioDetailPayload }) {
  useEffect(() => {
    if (!detail.trackingKey) return;

    submitTracking({
      trackingKey: detail.trackingKey,
      eventName: 'portfolio_view',
      ...trackingContext(),
      pageKey: 'portfolio_detail',
      pageSlug: detail.portfolio.id,
      objectType: 'portfolio',
      objectId: detail.portfolio.id,
      metadata: {
        path: window.location.pathname,
        title: detail.portfolio.title
      }
    });
  }, [detail]);

  return null;
}

export function ProductTracking({ detail }: { detail: ProductDetailPayload }) {
  useEffect(() => {
    if (!detail.trackingKey) return;

    submitTracking({
      trackingKey: detail.trackingKey,
      eventName: 'product_view',
      ...trackingContext(),
      pageKey: 'product_detail',
      pageSlug: detail.product.slug,
      objectType: 'product',
      objectId: detail.product.id,
      metadata: {
        path: window.location.pathname,
        title: detail.product.title,
        price: detail.product.price
      }
    });
  }, [detail]);

  return null;
}