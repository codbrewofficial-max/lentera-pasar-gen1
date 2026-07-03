"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import { AlertCircle, CheckCircle, ExternalLink, Info, Save } from "lucide-react";

type PageSetupItem = {
  id: string;
  pageKey: string;
  title: string;
  navLabel?: string | null;
  footerLabel?: string | null;
  slug: string;
  publicPath?: string | null;
  purpose?: string | null;
  pageLabel: string;
  isDynamicDetailPage?: boolean;
  isPublished?: boolean;
  isVisibleInNavbar?: boolean;
  isVisibleInFooter?: boolean;
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  oldSlugsCount?: number;
};

type PageSetupResponse = {
  pages: PageSetupItem[];
  navbarItems: Array<{ pageKey: string; label: string; path: string }>;
  footerItems: Array<{ pageKey: string; label: string; path: string }>;
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

export default function PageSetupPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [pages, setPages] = useState<PageSetupItem[]>([]);
  const [navbarCount, setNavbarCount] = useState(0);
  const [footerCount, setFooterCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<PageSetupResponse>("GET", `websites/${websiteId}/page-setup`);
      setPages(res.data.pages || []);
      setNavbarCount(res.data.navbarItems?.length || 0);
      setFooterCount(res.data.footerItems?.length || 0);
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal memuat pengaturan halaman dan menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) load();
  }, [websiteId]);

  const updatePage = (pageKey: string, patch: Partial<PageSetupItem>) => {
    setPages((current) => current.map((page) => (page.pageKey === pageKey ? { ...page, ...patch } : page)));
  };

  const savePage = async (page: PageSetupItem) => {
    setSavingKey(page.pageKey);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload = {
        title: page.title,
        navLabel: page.navLabel || page.title,
        footerLabel: page.footerLabel || page.navLabel || page.title,
        slug: page.pageKey === "home" ? "" : normalizeSlug(page.slug || ""),
        purpose: page.purpose || null,
        isPublished: Boolean(page.isPublished),
        isVisibleInNavbar: page.isDynamicDetailPage ? false : Boolean(page.isVisibleInNavbar),
        isVisibleInFooter: page.isDynamicDetailPage ? false : Boolean(page.isVisibleInFooter),
        sortOrder: Number(page.sortOrder || 0),
        seoTitle: page.seoTitle || null,
        seoDescription: page.seoDescription || null
      };
      const res = await apiCall<PageSetupItem>("PATCH", `websites/${websiteId}/pages/${page.pageKey}/setup`, payload);
      updatePage(page.pageKey, res.data);
      setSuccessMsg(`Pengaturan halaman ${res.data.navLabel || res.data.title} berhasil disimpan.`);
      await load();
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal menyimpan pengaturan halaman.");
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Memuat Halaman & Menu" showBackButton backUrl={`/websites/${websiteId}/overview`}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Halaman & Menu"
      subtitle="Atur label menu, link halaman, publish, navbar, footer, dan SEO dasar."
      showBackButton
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#649FF6]/25 bg-[#649FF6]/10 p-5 text-sm text-emerald-900">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold">Struktur halaman tetap dikunci agar website rapi.</p>
              <p>
                Anda boleh mengubah nama menu, link/slug halaman, urutan, tampil di navbar/footer, dan SEO. Jika slug berubah,
                sistem menyimpan riwayat redirect lama ke baru untuk menjaga SEO.
              </p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#649FF6]/25 bg-[#649FF6]/10 p-4 text-sm text-[#3f6fae]">
            <CheckCircle className="h-5 w-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Navbar Aktif</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{navbarCount}/6</p>
            <p className="mt-1 text-xs text-slate-500">Maksimal 6 menu agar tampilan tetap rapi.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Footer Aktif</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{footerCount}</p>
            <p className="mt-1 text-xs text-slate-500">Menu bantuan di bagian bawah website.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Total Halaman Internal</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{pages.length}</p>
            <p className="mt-1 text-xs text-slate-500">Termasuk template detail artikel.</p>
          </div>
        </div>

        <div className="space-y-5">
          {pages.map((page) => {
            const isSaving = savingKey === page.pageKey;
            const isHome = page.pageKey === "home";
            const dynamic = Boolean(page.isDynamicDetailPage);
            return (
              <div key={page.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">{page.pageLabel}</h2>
                      {dynamic && <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">Template Detail Artikel</span>}
                      {!page.isPublished && <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">Tidak Dipublish</span>}
                    </div>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">{page.purpose}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Public path: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">{page.publicPath || (isHome ? "/" : `/${page.slug}`)}</code>
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-600">Label Navbar</span>
                    <input
                      value={page.navLabel || ""}
                      onChange={(e) => updatePage(page.pageKey, { navLabel: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-600">Label Footer</span>
                    <input
                      value={page.footerLabel || ""}
                      onChange={(e) => updatePage(page.pageKey, { footerLabel: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-600">Slug / Link Halaman</span>
                    <input
                      value={page.slug || ""}
                      disabled={isHome}
                      onChange={(e) => updatePage(page.pageKey, { slug: normalizeSlug(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
                    />
                    <p className="text-[11px] text-slate-400">Tanpa slash. Contoh: layanan-kami. Home selalu memakai /.</p>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-600">Urutan Menu</span>
                    <input
                      type="number"
                      value={page.sortOrder}
                      onChange={(e) => updatePage(page.pageKey, { sortOrder: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
                    />
                  </label>
                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-xs font-bold text-slate-600">Penjelasan Fungsi Halaman</span>
                    <EnhancedTextarea
                      id={`purpose-${page.pageKey}`}
                      minRows={3}
                      value={page.purpose || ""}
                      onChange={(value) => updatePage(page.pageKey, { purpose: value })}
                      helperText="Jelaskan fungsi halaman ini dengan bahasa yang mudah dipahami owner dan tim internal."
                    />
                  </label>
                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-xs font-bold text-slate-600">SEO Title</span>
                    <input
                      value={page.seoTitle || ""}
                      onChange={(e) => updatePage(page.pageKey, { seoTitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
                    />
                  </label>
                  <label className="space-y-1.5 md:col-span-2">
                    <span className="text-xs font-bold text-slate-600">SEO Description</span>
                    <EnhancedTextarea
                      id={`seo-description-${page.pageKey}`}
                      minRows={2}
                      value={page.seoDescription || ""}
                      onChange={(value) => updatePage(page.pageKey, { seoDescription: value })}
                      maxLength={160}
                      helperText="Idealnya 120-160 karakter agar lebih rapi untuk SEO/snippet pencarian."
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <BooleanRadio
                    id={`published-${page.pageKey}`}
                    label="Publish Halaman"
                    value={Boolean(page.isPublished)}
                    onChange={(value) => updatePage(page.pageKey, { isPublished: value })}
                    description="Jika Tidak, halaman tidak tampil di website publik."
                  />
                  <BooleanRadio
                    id={`navbar-${page.pageKey}`}
                    label="Tampil di Navbar"
                    value={!dynamic && Boolean(page.isVisibleInNavbar)}
                    onChange={(value) => updatePage(page.pageKey, { isVisibleInNavbar: value })}
                    disabled={dynamic}
                    description={dynamic ? "Detail artikel tidak masuk navbar." : "Pilih Ya jika menu ini tampil di atas website."}
                  />
                  <BooleanRadio
                    id={`footer-${page.pageKey}`}
                    label="Tampil di Footer"
                    value={!dynamic && Boolean(page.isVisibleInFooter)}
                    onChange={(value) => updatePage(page.pageKey, { isVisibleInFooter: value })}
                    disabled={dynamic}
                    description={dynamic ? "Detail artikel tidak masuk footer." : "Pilih Ya jika menu ini tampil di footer."}
                  />
                </div>

                {dynamic && (
                  <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
                    Halaman detail artikel digunakan otomatis ketika pengunjung membuka artikel tertentu, jadi tidak dimasukkan ke navbar/footer.
                  </p>
                )}

                <div className="my-5 flex justify-end">
                  <button
                    onClick={() => savePage(page)}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#649FF6] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#4f8be6] disabled:bg-[#8bb8fb]"
                  >
                    {isSaving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
                    {isSaving ? "Menyimpan..." : "Simpan Halaman"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
