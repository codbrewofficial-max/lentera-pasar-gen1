"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import { AlertCircle, CheckCircle, Edit2, FileText, Plus, Save, Search, Trash2, X } from "lucide-react";

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
  statusLabel?: string;
  sortOrder?: number;
  publishedAt?: string | null;
}

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
  sortOrder: 0
};

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function ArticlesCrudPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const [items, setItems] = useState<ArticleItem[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArticleItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ArticleItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        apiCall<ArticleItem[]>("GET", `websites/${websiteId}/articles`),
        apiCall<ArticleCategory[]>("GET", `websites/${websiteId}/article-categories`).catch(() => ({ data: [] as ArticleCategory[] }))
      ]);
      setItems(articlesRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat artikel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) fetchItems();
  }, [websiteId]);

  const showSuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (item: ArticleItem) => {
    setEditingItem(item);
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
      sortOrder: item.sortOrder ?? 0
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      setErrorMsg("Judul, slug, dan isi artikel wajib diisi.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
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
        sortOrder: Number(formData.sortOrder) || 0
      };
      if (editingItem) {
        await apiCall("PATCH", `websites/${websiteId}/articles/${editingItem.id}`, payload);
        showSuccess("Artikel berhasil diperbarui.");
      } else {
        await apiCall("POST", `websites/${websiteId}/articles`, payload);
        showSuccess("Artikel berhasil ditambahkan.");
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menyimpan artikel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/articles/${deletingItem.id}`);
      setDeletingItem(null);
      showSuccess("Artikel berhasil dihapus.");
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menghapus artikel.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Kelola Artikel" subtitle="Kelola artikel blog dan SEO basic website Anda" showBackButton={true} backUrl={`/websites/${websiteId}/overview`}>
      <div className="space-y-6" id="articles-crud-root">
        {successMsg && (
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
          </div>
          <button onClick={openAdd} className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition">
            <Plus className="h-4 w-4" />
            <span>Tambah Artikel</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white rounded-3xl border border-slate-200 h-40 animate-pulse" />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <FileText className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Artikel</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Belum ada artikel. Tambahkan artikel untuk membantu website lebih mudah ditemukan calon client dari pencarian.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.status === "published" ? "bg-[#649FF6]/10 text-[#4f8be6] border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      {item.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">/{item.slug}</p>
                  {item.category && <p className="text-[10px] text-[#4f8be6] font-bold">Kategori: {item.category.name}</p>}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.excerpt || item.content}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => openEdit(item)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Edit Artikel">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition" title="Hapus Artikel">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">{editingItem ? "Edit Artikel" : "Tambah Artikel"}</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Judul Artikel <span className="text-rose-500">*</span></label>
                    <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: formData.slug || slugify(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Slug <span className="text-rose-500">*</span></label>
                    <input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kategori Artikel</label>
                    <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors">
                      <option value="">Tanpa kategori</option>
                      {categories.filter((category) => category.isActive).map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400">Kelola kategori di menu Kategori Artikel.</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Ringkasan / Excerpt</label>
                    <EnhancedTextarea id="article-excerpt" minRows={2} value={formData.excerpt} onChange={(value) => setFormData({ ...formData, excerpt: value })} maxLength={180} helperText="Ringkasan pendek ini dipakai untuk daftar artikel dan fallback SEO description." />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Isi Artikel <span className="text-rose-500">*</span></label>
                    <EnhancedTextarea id="article-content" required minRows={8} value={formData.content} onChange={(value) => setFormData({ ...formData, content: value })} helperText="Gunakan paragraf pendek agar mudah dibaca di halaman publik." />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">URL Cover Image</label>
                    <input type="url" value={formData.coverImageUrl} onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">SEO Title</label>
                    <input value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan Tampil</label>
                    <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">SEO Description</label>
                    <EnhancedTextarea id="article-seo-description" minRows={2} value={formData.seoDescription} onChange={(value) => setFormData({ ...formData, seoDescription: value })} maxLength={160} helperText="Idealnya 120-160 karakter untuk snippet pencarian." />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                    <Save className="h-4 w-4" />
                    <span>{saving ? (editingItem ? "Memperbarui..." : "Menyimpan...") : "Simpan Artikel"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Apakah Anda yakin ingin menghapus artikel <strong>{deletingItem.title}</strong>?</p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition">
                  {deleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
