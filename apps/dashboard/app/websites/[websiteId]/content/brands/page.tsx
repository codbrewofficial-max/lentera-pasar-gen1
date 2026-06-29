"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import {
  Award,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  PlusCircle,
  ExternalLink,
  Globe
} from "lucide-react";

interface BrandItem {
  id: string | number;
  name: string;
  logoUrl: string;
  url?: string;
  websiteUrl?: string;
  isActive: boolean;
  sortOrder?: number;
}

export default function BrandCrudPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BrandItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "https://picsum.photos/seed/logo/200/100",
    websiteUrl: "",
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<BrandItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<BrandItem[]>("GET", `websites/${websiteId}/brand-partners`);
      setItems(res.data || []);
    } catch (err: any) {
      console.error("Fetch brands error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat logo partner / brand.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      Promise.resolve().then(() => {
        fetchItems();
      });
    }
  }, [websiteId]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      logoUrl: "https://picsum.photos/seed/logo-" + Math.floor(Math.random() * 500) + "/200/100",
      websiteUrl: "",
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: BrandItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      logoUrl: item.logoUrl || "https://picsum.photos/seed/logo/200/100",
      websiteUrl: item.url || item.websiteUrl || "",
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.logoUrl) {
      setErrorMsg("Nama rekanan dan URL logo wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        name: formData.name,
        logoUrl: formData.logoUrl,
        url: formData.websiteUrl,
        sortOrder: editingItem?.sortOrder ?? 0,
        isActive: formData.isActive
      };

      if (editingItem) {
        // Edit mode
        await apiCall("PATCH", `websites/${websiteId}/brand-partners/${editingItem.id}`, payload);
        showSuccess("Logo brand rekanan berhasil diperbarui!");
      } else {
        // Add mode
        await apiCall("POST", `websites/${websiteId}/brand-partners`, payload);
        showSuccess("Logo brand rekanan baru berhasil disimpan!");
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      console.error("Save brand error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan data rekanan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/brand-partners/${deletingItem.id}`);
      showSuccess("Logo brand rekanan berhasil dihapus!");
      setDeletingItem(null);
      fetchItems();
    } catch (err: any) {
      console.error("Delete brand error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus data rekanan.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Kelola Brand & Partner"
      subtitle="Tampilkan daftar logo klien, mitra strategis, rekanan bisnis, atau penghargaan usaha"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="brands-crud-root">
        {/* Alerts */}
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

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari nama brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition active:translate-y-[1px]"
            id="btn-add-brand"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Logo Rekanan</span>
          </button>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat data rekanan...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Brand Partner</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada rekanan bisnis yang cocok dengan pencarian Anda."
                : "Daftar logo brand / rekanan masih kosong. Tampilkan logo-logo klien besar yang mempercayai Anda!"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#649FF6]/10 text-[#3f6fae] border border-emerald-100 hover:bg-[#649FF6]/15 text-xs font-bold rounded-xl transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Buat Rekanan Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6" id="brands-grid-list">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        item.isActive
                          ? "bg-[#649FF6]/10 text-[#4f8be6] border border-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Draft"}
                    </span>
                  </div>

                  {/* Logo Image Preview Wrapper */}
                  <div className="h-24 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 shadow-inner overflow-hidden">
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1 text-center">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                    {(item.url || item.websiteUrl) && (
                      <a
                        href={item.url || item.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#649FF6] hover:underline font-semibold font-mono"
                      >
                        <Globe className="h-3 w-3" />
                        <span>Kunjungi Situs</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-[#649FF6] hover:bg-slate-50 rounded-lg transition"
                    title="Edit Partner"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition"
                    title="Hapus Partner"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form Dialog */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingItem ? "Edit Rekanan" : "Tambah Rekanan Baru"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="brand-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama Rekanan / Brand Mitra <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="brand-name"
                    type="text"
                    required
                    placeholder="Contoh: PT Semen Indonesia"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>

                {/* Logo URL */}
                <div className="space-y-1">
                  <label htmlFor="brand-logo" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    URL File Logo Rekanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="brand-logo"
                    type="url"
                    required
                    placeholder="Contoh: https://picsum.photos/seed/logo/200/100"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors font-mono"
                  />
                </div>

                {/* Website URL */}
                <div className="space-y-1">
                  <label htmlFor="brand-url" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Tautan Website Rekanan (Opsional)
                  </label>
                  <input
                    id="brand-url"
                    type="url"
                    placeholder="Contoh: https://www.semenindonesia.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors font-mono"
                  />
                </div>

                {/* Status Toggle */}
                <BooleanRadio
                  id="brand-active"
                  label="Tampilkan Partner di Website?"
                  value={formData.isActive}
                  onChange={(value) => setFormData({ ...formData, isActive: value })}
                  description="Pilih Ya jika brand/partner ini boleh tampil di area trust proof website."
                />

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? (editingItem ? "Memperbarui..." : "Menyimpan...") : "Simpan Rekanan"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Simple Dialog */}
        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus logo brand rekanan <strong>{deletingItem.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/10"
                >
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
