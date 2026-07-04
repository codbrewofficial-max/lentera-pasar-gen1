"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { AlertCircle, CheckCircle, Edit2, Plus, Save, Search, Tags, Trash2, X } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder?: number;
  isActive: boolean;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true
};

export default function ProductCategoryCrudPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const endpoint = "product-categories";
  const title = "Kategori Produk";
  const subtitle = "Kelola kategori agar produk lebih mudah dikelompokkan dan difilter pengunjung.";
  const emptyText = "Belum ada kategori produk. Tambahkan kategori seperti Makanan, Pakaian, Elektronik, atau Aksesoris.";

  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ pageSize: 12, total: 0, totalPages: 1 });

  const fetchItems = async (targetPage = page) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<CategoryItem[]>("GET", `websites/${websiteId}/${endpoint}?page=${targetPage}&pageSize=${pageMeta.pageSize}`);
      setItems(res.data || []);
      if (res.meta?.pagination) {
        setPageMeta({
          pageSize: res.meta.pagination.pageSize,
          total: res.meta.pagination.total,
          totalPages: res.meta.pagination.totalPages
        });
      }
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || `Gagal memuat ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) fetchItems(page);
  }, [websiteId, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const showSuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (item: CategoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      slug: item.slug || "",
      description: item.description || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.slug) {
      setErrorMsg("Nama dan slug kategori wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive
      };

      if (editingItem) {
        await apiCall("PATCH", `websites/${websiteId}/${endpoint}/${editingItem.id}`, payload);
        showSuccess(`${title} berhasil diperbarui.`);
      } else {
        await apiCall("POST", `websites/${websiteId}/${endpoint}`, payload);
        showSuccess(`${title} berhasil ditambahkan.`);
      }

      setIsFormOpen(false);
      fetchItems(page);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || `Gagal menyimpan ${title.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/${endpoint}/${deletingItem.id}`);
      setDeletingItem(null);
      showSuccess(`${title} berhasil dihapus.`);
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchItems(page);
      }
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || `Gagal menghapus ${title.toLowerCase()}.`);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title={title} subtitle={subtitle} showBackButton backUrl={`/websites/${websiteId}/content/products`}>
      <div className="space-y-6">
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
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
            />
          </div>
          <button onClick={openAdd} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => <div key={item} className="bg-white rounded-3xl border border-slate-200 h-32 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <Tags className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Kategori</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">{emptyText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">/{item.slug}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.isActive ? "bg-[#649FF6]/10 text-[#4f8be6] border-[#649FF6]/20" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {item.description && <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.description}</p>}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => openEdit(item)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Edit">
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

        {!loading && filtered.length > 0 && (
          <Pagination
            page={page}
            totalPages={pageMeta.totalPages}
            total={pageMeta.total}
            pageSize={pageMeta.pageSize}
            onPageChange={handlePageChange}
            itemLabel="kategori"
          />
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">{editingItem ? "Edit Kategori" : "Tambah Kategori"}</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Kategori</label>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value, slug: slugify(event.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Slug</label>
                  <input
                    value={formData.slug}
                    onChange={(event) => setFormData({ ...formData, slug: slugify(event.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                  />
                  <p className="text-[10px] text-slate-400">Slug otomatis mengikuti nama kategori. Anda tetap bisa mengedit slug manual bila diperlukan.</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Deskripsi</label>
                  <RichTextEditor id={`${endpoint}-description`} minHeight={110} value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} helperText="Deskripsi singkat untuk membantu pengelolaan konten." />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(event) => setFormData({ ...formData, sortOrder: Number(event.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                  />
                </div>
                <BooleanRadio id={`${endpoint}-is-active`} label="Status" value={formData.isActive} onChange={(value) => setFormData({ ...formData, isActive: value })} />
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Menyimpan..." : "Simpan Kategori"}</span>
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
              <p className="text-xs text-slate-500 leading-relaxed">Hapus kategori <strong>{deletingItem.name}</strong>? Produk yang memakai kategori ini akan kehilangan kategori.</p>
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
