"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertCircle, CheckCircle, Edit2, FileText, Plus, Search, Trash2 } from "lucide-react";

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
  status: "draft" | "published";
  sortOrder?: number;
  isFeatured?: boolean;
  featuredOrder?: number;
}

const stripHtml = (html: string) => {
  if (!html) return "";
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
};

export default function ArticlesListPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const [items, setItems] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ArticleItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const articlesRes = await apiCall<ArticleItem[]>("GET", `websites/${websiteId}/articles`);
      setItems(articlesRes.data || []);
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
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3 animate-fadeIn">
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
          <button
            onClick={() => router.push(`/websites/${websiteId}/content/articles/new`)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition"
          >
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
                  <div className="flex flex-wrap gap-2">
                    {item.category && <span className="text-[10px] text-[#4f8be6] font-bold">Kategori: {item.category.name}</span>}
                    {item.isFeatured && <span className="text-[10px] text-[#F56B71] font-bold">Artikel Unggulan</span>}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.excerpt || stripHtml(item.content)}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => router.push(`/websites/${websiteId}/content/articles/${item.id}/edit`)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Edit Artikel">
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

        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-xl w-full sm:max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Apakah Anda yakin ingin menghapus artikel <strong>{deletingItem.title}</strong>?</p>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button onClick={() => setDeletingItem(null)} className="px-4 py-2.5 sm:py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                <button onClick={handleDelete} disabled={deleting} className="px-4 py-2.5 sm:py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition">
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
