"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Save, AlertCircle, CheckCircle, X } from "lucide-react";

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface ArticleItem {
  id: string;
  categoryId?: string | null;
  category?: ArticleCategory | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: "draft" | "published";
  sortOrder?: number;
  isFeatured?: boolean;
  featuredOrder?: number;
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const isValidSlug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const emptyForm = {
  categoryId: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  seoTitle: "",
  seoDescription: "",
  status: "draft" as "draft" | "published",
  sortOrder: 0,
  isFeatured: false,
  featuredOrder: 0
};

export default function ArticleFormPage({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const articleId = params?.articleId as string | undefined;

  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!websiteId) return;

    const load = async () => {
      try {
        const categoriesRes = await apiCall<ArticleCategory[]>(
          "GET",
          `websites/${websiteId}/article-categories`
        ).catch(() => ({ data: [] as ArticleCategory[] }));
        setCategories(categoriesRes.data || []);

        if (mode === "edit" && articleId) {
          setLoading(true);
          const res = await apiCall<ArticleItem>("GET", `websites/${websiteId}/articles/${articleId}`);
          const item = res.data;
          if (item) {
            setFormData({
              categoryId: item.categoryId || "",
              title: item.title || "",
              slug: item.slug || "",
              excerpt: item.excerpt || "",
              content: item.content || "",
              coverImageUrl: item.coverImageUrl || "",
              seoTitle: item.seoTitle || "",
              seoDescription: item.seoDescription || "",
              status: item.status || "draft",
              sortOrder: item.sortOrder ?? 0,
              isFeatured: item.isFeatured ?? false,
              featuredOrder: item.featuredOrder ?? 0
            });
            setSlugTouched(true);
          }
        }
      } catch (err: any) {
        console.error("Load article form error:", err);
        setErrorMsg(err.error?.message || "Gagal memuat data artikel.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [websiteId, articleId, mode]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value)
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setFormData((prev) => ({ ...prev, slug: slugify(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.title.trim()) {
      setErrorMsg("Judul artikel wajib diisi.");
      return;
    }
    if (!formData.slug.trim() || !isValidSlug(formData.slug)) {
      setErrorMsg("Slug wajib diisi dan hanya boleh huruf kecil, angka, dan tanda hubung.");
      return;
    }
    if (!formData.content || formData.content === "<p></p>") {
      setErrorMsg("Isi artikel wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        categoryId: formData.categoryId || null,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        coverImageUrl: formData.coverImageUrl || null,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
        status: formData.status,
        sortOrder: Number(formData.sortOrder) || 0,
        isFeatured: formData.isFeatured,
        featuredOrder: Number(formData.featuredOrder) || 0
      };

      if (mode === "edit" && articleId) {
        await apiCall("PATCH", `websites/${websiteId}/articles/${articleId}`, payload);
      } else {
        await apiCall("POST", `websites/${websiteId}/articles`, payload);
      }

      setSuccessMsg(mode === "edit" ? "Artikel berhasil diperbarui!" : "Artikel baru berhasil ditambahkan!");
      setTimeout(() => {
        router.push(`/websites/${websiteId}/content/articles`);
      }, 700);
    } catch (err: any) {
      console.error("Save article error:", err);
      const code = err?.error?.code;
      if (code === "ARTICLE_SLUG_EXISTS") {
        setErrorMsg("Slug ini sudah dipakai artikel lain di website Anda. Silakan gunakan slug lain.");
      } else if (code === "VALIDATION_ERROR") {
        setErrorMsg("Slug hanya boleh huruf kecil, angka, dan tanda hubung, dan isi artikel tidak boleh kosong.");
      } else {
        setErrorMsg(err.error?.message || "Gagal menyimpan artikel.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title={mode === "edit" ? "Memuat Artikel..." : "Tambah Artikel"}
        showBackButton
        backUrl={`/websites/${websiteId}/content/articles`}
      >
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={mode === "edit" ? "Edit Artikel" : "Tambah Artikel Baru"}
      subtitle="Tulis artikel blog untuk membantu website lebih mudah ditemukan calon client"
      showBackButton
      backUrl={`/websites/${websiteId}/content/articles`}
    >
      <div className="space-y-6 max-w-3xl">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Judul Artikel <span className="text-rose-500">*</span>
              </label>
              <input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Slug <span className="text-rose-500">*</span>
              </label>
              <input
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kategori Artikel</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              >
                <option value="">Tanpa kategori</option>
                {categories.filter((category) => category.isActive).map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Kelola kategori di menu Kategori Artikel.</p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Ringkasan / Excerpt</label>
              <EnhancedTextarea
                id="article-excerpt"
                minRows={2}
                value={formData.excerpt}
                onChange={(value) => setFormData({ ...formData, excerpt: value })}
                maxLength={180}
                helperText="Ringkasan pendek ini dipakai untuk daftar artikel dan fallback SEO description."
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Isi Artikel <span className="text-rose-500">*</span>
              </label>
              <RichTextEditor
                id="article-content"
                required
                minHeight={280}
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                helperText="Gunakan heading dan paragraf pendek agar mudah dibaca di halaman publik."
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">URL Cover Image</label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
              {formData.coverImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-56">
                  <img src={formData.coverImageUrl} alt="Pratinjau cover" className="w-full h-56 object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">SEO Title</label>
              <input
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan Tampil</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan Unggulan</label>
              <input
                type="number"
                value={formData.featuredOrder}
                onChange={(e) => setFormData({ ...formData, featuredOrder: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
              <p className="text-[10px] text-slate-400">Angka kecil tampil lebih dulu jika artikel dijadikan unggulan.</p>
            </div>

            <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <BooleanRadio
                id="article-featured"
                label="Jadikan Artikel Unggulan?"
                value={formData.isFeatured}
                onChange={(value) => setFormData({ ...formData, isFeatured: value })}
                description="Artikel unggulan akan diprioritaskan di section Featured Article dan daftar artikel."
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">SEO Description</label>
              <EnhancedTextarea
                id="article-seo-description"
                minRows={2}
                value={formData.seoDescription}
                onChange={(value) => setFormData({ ...formData, seoDescription: value })}
                maxLength={160}
                helperText="Idealnya 120-160 karakter untuk snippet pencarian."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/websites/${websiteId}/content/articles`)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="h-4 w-4" />
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? (mode === "edit" ? "Memperbarui..." : "Menyimpan...") : "Simpan Artikel"}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
