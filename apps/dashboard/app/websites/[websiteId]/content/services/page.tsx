"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  HeartHandshake,
  Briefcase,
  Award,
  Sparkles,
  Globe,
  ShoppingBag,
  Settings,
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

interface ServiceItem {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder?: number;
  price?: number | string;
  imageUrl?: string;
}

const AVAILABLE_ICONS = [
  { value: "HeartHandshake", label: "Layanan Sosial / Kesehatan", icon: HeartHandshake },
  { value: "Briefcase", label: "Jasa Profesional / Bisnis", icon: Briefcase },
  { value: "Award", label: "Penghargaan / Kualitas", icon: Award },
  { value: "Sparkles", label: "Kecantikan / Kreatif", icon: Sparkles },
  { value: "Globe", label: "Teknologi / Online", icon: Globe },
  { value: "ShoppingBag", label: "Toko / Produk Fisik", icon: ShoppingBag },
  { value: "Settings", label: "Pemeliharaan / Teknik", icon: Settings }
];

export default function ServicesCrudPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Briefcase",
    isActive: true,
    price: "",
    imageUrl: ""
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<ServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<ServiceItem[]>("GET", `websites/${websiteId}/services`);
      setItems(res.data || []);
    } catch (err: any) {
      console.error("Fetch services error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar layanan.");
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
      title: "",
      description: "",
      icon: "Briefcase",
      isActive: true,
      price: "",
      imageUrl: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon || "Briefcase",
      isActive: item.isActive ?? true,
      price: item.price ? String(item.price) : "",
      imageUrl: item.imageUrl || ""
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setErrorMsg("Nama layanan dan deskripsi wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        sortOrder: editingItem?.sortOrder ?? 0,
        isActive: formData.isActive
      };

      if (editingItem) {
        // Edit mode
        await apiCall("PATCH", `websites/${websiteId}/services/${editingItem.id}`, payload);
        showSuccess("Layanan berhasil diperbarui!");
      } else {
        // Add mode
        await apiCall("POST", `websites/${websiteId}/services`, payload);
        showSuccess("Layanan baru berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      console.error("Save service error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan layanan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/services/${deletingItem.id}`);
      showSuccess("Layanan berhasil dihapus!");
      setDeletingItem(null);
      fetchItems();
    } catch (err: any) {
      console.error("Delete service error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus layanan.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const found = AVAILABLE_ICONS.find((i) => i.value === iconName);
    return found ? found.icon : Briefcase;
  };

  return (
    <DashboardLayout
      title="Kelola Layanan"
      subtitle="Kelola produk jasa, paket servis, atau penawaran utama usaha Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="services-crud-root">
        {/* Alerts */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
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
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition active:translate-y-[1px]"
            id="btn-add-service"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Layanan</span>
          </button>
        </div>

        {/* Items Grid/List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat data layanan...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Layanan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada layanan yang cocok dengan kata kunci pencarian Anda."
                : "Daftar layanan usaha Anda masih kosong. Tambahkan penawaran terbaik Anda sekarang juga!"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100 text-xs font-bold rounded-xl transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Buat Layanan Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="services-grid-list">
            {filteredItems.map((item) => {
              const IconComp = getIconComponent(item.icon);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      {item.price && (
                        <p className="text-xs font-bold text-emerald-600 font-mono">
                          {typeof item.price === "number" ? `Rp ${item.price.toLocaleString("id-ID")}` : item.price}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition"
                      title="Edit Layanan"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition"
                      title="Hapus Layanan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Form Dialog */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingItem ? "Edit Layanan" : "Tambah Layanan Baru"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Title */}
                <div className="space-y-1">
                  <label htmlFor="srv-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama Layanan / Produk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="srv-title"
                    type="text"
                    required
                    placeholder="Contoh: Pembuatan Website Bisnis"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label htmlFor="srv-price" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Harga / Tarif Layanan (Opsional)
                  </label>
                  <input
                    id="srv-price"
                    type="text"
                    placeholder="Contoh: 1500000 atau Hubungi Kontak"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
                  <p className="text-[10px] text-slate-400">Tulis angka saja (misal: 750000) atau teks bebas lainnya.</p>
                </div>

                {/* Icon Selection */}
                <div className="space-y-1">
                  <label htmlFor="srv-icon" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Representasi Icon
                  </label>
                  <select
                    id="srv-icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    {AVAILABLE_ICONS.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label htmlFor="srv-image" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    URL Gambar / Banner Layanan (Opsional)
                  </label>
                  <input
                    id="srv-image"
                    type="url"
                    placeholder="Contoh: https://picsum.photos/seed/service/400/300"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label htmlFor="srv-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Deskripsi Lengkap Layanan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="srv-desc"
                    rows={4}
                    required
                    placeholder="Berikan penjelasan detail mengenai apa yang ditawarkan, apa saja kelebihannya, dan hasil yang diperoleh klien..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    id="srv-active"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500/20 border-slate-300 rounded"
                  />
                  <label htmlFor="srv-active" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Aktifkan Layanan (Tampilkan di Website)
                  </label>
                </div>

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
                    className="inline-flex items-center space-x-1 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Menyimpan..." : "Simpan Layanan"}</span>
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
                Apakah Anda yakin ingin menghapus layanan <strong>{deletingItem.title}</strong>? Tindakan ini tidak dapat dibatalkan.
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
