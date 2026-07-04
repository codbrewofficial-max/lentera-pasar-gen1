"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import Pagination from "@/components/ui/Pagination";
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  PlusCircle
} from "lucide-react";

interface ValuePropositionItem {
  id: string;
  icon?: string | null;
  title: string;
  description?: string | null;
  isActive: boolean;
  sortOrder?: number;
}

const emptyForm = {
  icon: "",
  title: "",
  description: "",
  isActive: true
};

export default function ValuePropositionCrudPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<ValuePropositionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ pageSize: 12, total: 0, totalPages: 1 });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ValuePropositionItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deletingItem, setDeletingItem] = useState<ValuePropositionItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async (targetPage = page) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<ValuePropositionItem[]>("GET", `websites/${websiteId}/value-propositions?page=${targetPage}&pageSize=${pageMeta.pageSize}`);
      setItems(res.data || []);
      if (res.meta?.pagination) {
        setPageMeta({
          pageSize: res.meta.pagination.pageSize,
          total: res.meta.pagination.total,
          totalPages: res.meta.pagination.totalPages
        });
      }
    } catch (err: any) {
      console.error("Fetch value propositions error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat data keunggulan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) fetchItems(page);
  }, [websiteId, page]);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ValuePropositionItem) => {
    setEditingItem(item);
    setFormData({
      icon: item.icon || "",
      title: item.title || "",
      description: item.description || "",
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("Judul keunggulan wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        icon: formData.icon || null,
        title: formData.title,
        description: formData.description || null,
        sortOrder: editingItem?.sortOrder ?? items.length,
        isActive: formData.isActive
      };

      if (editingItem) {
        await apiCall("PATCH", `websites/${websiteId}/value-propositions/${editingItem.id}`, payload);
        showSuccess("Keunggulan berhasil diperbarui!");
      } else {
        await apiCall("POST", `websites/${websiteId}/value-propositions`, payload);
        showSuccess("Keunggulan baru berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      fetchItems(page);
    } catch (err: any) {
      console.error("Save value proposition error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan keunggulan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/value-propositions/${deletingItem.id}`);
      showSuccess("Keunggulan berhasil dihapus!");
      setDeletingItem(null);
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchItems(page);
      }
    } catch (err: any) {
      console.error("Delete value proposition error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus keunggulan.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Kelola Keunggulan / USP"
      subtitle="Poin-poin keunggulan toko yang tampil di section Value Proposition Home"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="value-propositions-crud-root">
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
              placeholder="Cari keunggulan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition active:translate-y-[1px]"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Keunggulan</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat data keunggulan...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Keunggulan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada keunggulan yang cocok dengan pencarian Anda."
                : "Tambahkan poin keunggulan seperti Gratis Ongkir, Garansi 30 Hari, atau Pembayaran Aman."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#649FF6]/10 text-[#3f6fae] border border-emerald-100 hover:bg-[#649FF6]/15 text-xs font-bold rounded-xl transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Tambah Keunggulan Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#649FF6]/10 text-[#3f6fae] flex items-center justify-center text-xl">
                    {item.icon || <Sparkles className="h-5 w-5" />}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.isActive ? "bg-[#649FF6]/10 text-[#4f8be6] border-[#649FF6]/20" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                {item.description && <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.description}</p>}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition" title="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <Pagination
            page={page}
            totalPages={pageMeta.totalPages}
            total={pageMeta.total}
            pageSize={pageMeta.pageSize}
            onPageChange={handlePageChange}
            itemLabel="keunggulan"
          />
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">{editingItem ? "Edit Keunggulan" : "Tambah Keunggulan Baru"}</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-1">
                  <label htmlFor="usp-icon" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Ikon / Emoji (Opsional)
                  </label>
                  <input
                    id="usp-icon"
                    type="text"
                    placeholder="🚚"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                  <p className="text-[10px] text-slate-400">Bisa tempel emoji langsung (contoh: 🚚, ✅, 💳).</p>
                </div>
                <div className="space-y-1">
                  <label htmlFor="usp-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Judul <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="usp-title"
                    type="text"
                    required
                    placeholder="Gratis Ongkir Se-Indonesia"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="usp-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Deskripsi Singkat (Opsional)
                  </label>
                  <textarea
                    id="usp-desc"
                    rows={3}
                    placeholder="Untuk pembelian di atas Rp100.000"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors resize-none"
                  />
                </div>
                <BooleanRadio
                  id="usp-active"
                  label="Tampilkan di Website?"
                  value={formData.isActive}
                  onChange={(value) => setFormData({ ...formData, isActive: value })}
                  description="Pilih Ya jika poin keunggulan ini boleh tampil di Home."
                />
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Menyimpan..." : "Simpan Keunggulan"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hapus keunggulan <strong>{deletingItem.title}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/10">
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
