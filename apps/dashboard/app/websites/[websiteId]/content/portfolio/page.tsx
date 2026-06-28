"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  FolderKanban,
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
  Tag,
  User
} from "lucide-react";

interface PortfolioItem {
  id: string | number;
  title: string;
  description: string;
  category?: string;
  imageUrl: string;
  projectUrl?: string;
  clientName?: string;
  isActive: boolean;
  sortOrder?: number;
}

const DEFAULT_PORTFOLIO_CATEGORIES = [
  "Desain & Kreatif",
  "Teknologi & IT",
  "Konstruksi & Properti",
  "Konsultasi",
  "Pendidikan",
  "Event Organizer",
  "Lainnya"
];

export default function PortfolioCrudPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Desain & Kreatif",
    imageUrl: "https://picsum.photos/seed/portfolio/800/600",
    projectUrl: "",
    clientName: "",
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Endpoint is plural as seen in preview payload structure: data.portfolios
      const res = await apiCall<PortfolioItem[]>("GET", `websites/${websiteId}/portfolios`);
      setItems(res.data || []);
    } catch (err: any) {
      console.error("Fetch portfolios error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar portfolio.");
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
      category: "Desain & Kreatif",
      imageUrl: "https://picsum.photos/seed/" + Math.floor(Math.random() * 1000) + "/800/600",
      projectUrl: "",
      clientName: "",
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category || "Desain & Kreatif",
      imageUrl: item.imageUrl || "https://picsum.photos/seed/portfolio/800/600",
      projectUrl: item.projectUrl || "",
      clientName: item.clientName || "",
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.imageUrl) {
      setErrorMsg("Judul, deskripsi, dan URL gambar wajib diisi.");
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
        await apiCall("PATCH", `websites/${websiteId}/portfolios/${editingItem.id}`, payload);
        showSuccess("Item portfolio berhasil diperbarui!");
      } else {
        // Add mode
        await apiCall("POST", `websites/${websiteId}/portfolios`, payload);
        showSuccess("Item portfolio baru berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      console.error("Save portfolio error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan portfolio.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/portfolios/${deletingItem.id}`);
      showSuccess("Item portfolio berhasil dihapus!");
      setDeletingItem(null);
      fetchItems();
    } catch (err: any) {
      console.error("Delete portfolio error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus portfolio.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Kelola Portfolio"
      subtitle="Pajang galeri hasil kerja, riwayat proyek selesai, atau karya terbaik Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="portfolio-crud-root">
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
              placeholder="Cari portfolio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition active:translate-y-[1px]"
            id="btn-add-portfolio"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Item Kerja</span>
          </button>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat data portfolio...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Portfolio</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada item kerja yang cocok dengan pencarian Anda."
                : "Galeri hasil kerja bisnis Anda masih kosong. Mari pamerkan hasil karya atau proyek hebat Anda!"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100 text-xs font-bold rounded-xl transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Buat Item Portfolio Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="portfolios-grid-list">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Portfolio Image */}
                  <div className="relative h-48 bg-slate-100 border-b border-slate-100 overflow-hidden group">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                          item.isActive
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        {item.isActive ? "Aktif" : "Draft"}
                      </span>
                    </div>

                    {item.category && (
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm font-sans uppercase tracking-wider">
                        <Tag className="h-3 w-3 text-emerald-400" />
                        <span>{item.category}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1 text-[11px] text-slate-400 font-medium">
                      {item.clientName && (
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>Klien: {item.clientName}</span>
                        </div>
                      )}
                      {item.projectUrl && (
                        <a
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Link Proyek</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-slate-100"
                    title="Edit Item"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-slate-100"
                    title="Hapus Item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form Dialog */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingItem ? "Edit Item Portfolio" : "Tambah Item Portfolio Baru"}
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
                  <label htmlFor="port-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama / Judul Proyek <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="port-title"
                    type="text"
                    required
                    placeholder="Contoh: Redesign Aplikasi Mobile Bank ABC"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label htmlFor="port-cat" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Kategori Bidang Proyek
                  </label>
                  <select
                    id="port-cat"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    {DEFAULT_PORTFOLIO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Client Name */}
                <div className="space-y-1">
                  <label htmlFor="port-client" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama Klien (Opsional)
                  </label>
                  <input
                    id="port-client"
                    type="text"
                    placeholder="Contoh: PT Bank Tabungan Negara"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label htmlFor="port-image" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    URL Gambar Dokumentasi Kerja <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="port-image"
                    type="url"
                    required
                    placeholder="Contoh: https://picsum.photos/seed/portfolio/800/600"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                {/* Project URL */}
                <div className="space-y-1">
                  <label htmlFor="port-url" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    URL Tautan Hasil Proyek (Opsional)
                  </label>
                  <input
                    id="port-url"
                    type="url"
                    placeholder="Contoh: https://www.behance.net/portfolio-saya"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label htmlFor="port-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Detail Pekerjaan / Studi Kasus <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="port-desc"
                    rows={4}
                    required
                    placeholder="Tuliskan latar belakang masalah klien, solusi yang Anda tawarkan, tantangan, dan bagaimana keberhasilan proyek ini dicapai..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    id="port-active"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500/20 border-slate-300 rounded"
                  />
                  <label htmlFor="port-active" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Aktifkan (Tampilkan di Galeri Website)
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
                    <span>{saving ? "Menyimpan..." : "Simpan Item"}</span>
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
                Apakah Anda yakin ingin menghapus item portfolio <strong>{deletingItem.title}</strong>? Tindakan ini tidak dapat dibatalkan.
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
