"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Globe,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  PlusCircle,
  Eye,
  Settings,
  User
} from "lucide-react";

interface WebsiteItem {
  id: string | number;
  name: string;
  slug: string;
  websiteType: string;
  websiteTypeLabel?: string;
  status: "draft" | "published";
  statusLabel?: string;
  ownerId?: string | number;
  ownerName?: string;
  pagesCount?: number;
  sectionsCount?: number;
}

export default function InternalWebsitesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWeb, setEditingWeb] = useState<WebsiteItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    websiteType: "company_profile",
    status: "draft" as "draft" | "published"
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingWeb, setDeletingWeb] = useState<WebsiteItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchWebsites = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<WebsiteItem[]>("GET", "internal/websites");
      setWebsites(res.data || []);
    } catch (err: any) {
      console.error("Fetch websites error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar seluruh website.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("LP_USER");
      const token = localStorage.getItem("LP_AUTH_TOKEN");
      if (!token || !userStr) {
        router.replace("/login");
        return;
      }
      try {
        const u = JSON.parse(userStr);
        if (u.role === "internal_admin") {
          Promise.resolve().then(() => {
            setAuthorized(true);
            fetchWebsites();
          });
        } else {
          Promise.resolve().then(() => {
            setAuthorized(false);
            setLoading(false);
          });
        }
      } catch (e) {
        router.replace("/login");
      }
    }
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleOpenAdd = () => {
    setEditingWeb(null);
    setFormData({
      name: "",
      slug: "",
      websiteType: "company_profile",
      status: "draft"
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (web: WebsiteItem) => {
    setEditingWeb(web);
    setFormData({
      name: web.name,
      slug: web.slug,
      websiteType: web.websiteType || "company_profile",
      status: web.status || "draft"
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      setErrorMsg("Nama website dan subdomain slug wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      if (editingWeb) {
        setErrorMsg("Endpoint update website internal belum tersedia di backend.");
      } else {
        setErrorMsg("Endpoint buat website internal belum tersedia di backend.");
      }
    } catch (err: any) {
      console.error("Save website error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan konfigurasi website.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingWeb) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      setErrorMsg("Endpoint hapus website internal belum tersedia di backend.");
      setDeletingWeb(null);
    } catch (err: any) {
      console.error("Delete website error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus website.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredWebsites = websites.filter((web) =>
    web.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    web.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    web.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authorized === false) {
    return (
      <DashboardLayout title="Akses Ditolak" showBackButton={true} backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-sm text-slate-500">Halaman ini hanya untuk tim internal Labkerkomit.</p>
          <button onClick={() => router.push("/websites")} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl">
            Kembali ke Beranda
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Daftar Website"
      subtitle="Pantau draf, rilis publikasi, dan pengaturan slot section dari seluruh website di platform"
      showBackButton={true}
      backUrl="/internal"
    >
      <div className="space-y-6" id="internal-websites-root">
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
              placeholder="Cari website, slug, atau owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            id="btn-add-website"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Website Baru</span>
          </button>
        </div>

        {/* Website Catalog Cards */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat katalog website...</span>
          </div>
        ) : filteredWebsites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tidak Ada Website</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada website yang cocok dengan kata kunci pencarian."
                : "Belum ada website yang terdaftar dalam sistem."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="websites-grid-list">
            {filteredWebsites.map((web) => (
              <div
                key={web.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        web.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {web.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{web.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Subdomain: lenterapasar.id/{web.slug}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    {web.ownerName && (
                      <div className="flex items-center space-x-1.5">
                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{web.ownerName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                      <span>Jumlah Halaman: {web.pagesCount ?? "-"}</span>
                      <span>Section Terisi: {web.sectionsCount ?? "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => router.push(`/websites/${web.id}/overview`)}
                    className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Masuk Editor</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(web)}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition"
                    title="Edit Metadata"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingWeb(web)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition"
                    title="Hapus Website"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingWeb ? "Edit Metadata Website" : "Buat Website Baru"}
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
                  <label htmlFor="web-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama Website / Usaha <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="web-name"
                    type="text"
                    required
                    placeholder="Contoh: Toko Roti Mandiri"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label htmlFor="web-slug" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Subdomain Slug Path <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="web-slug"
                    type="text"
                    required
                    placeholder="Contoh: roti-mandiri"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                {/* Type Selection */}
                <div className="space-y-1">
                  <label htmlFor="web-type" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Tipe Website
                  </label>
                  <select
                    id="web-type"
                    value={formData.websiteType}
                    onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    <option value="company_profile">Company Profile (Profil Usaha)</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <div className="space-y-1">
                  <label htmlFor="web-status" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Status Publikasi
                  </label>
                  <select
                    id="web-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    <option value="draft">Draft (Hanya di Dashboard)</option>
                    <option value="published">Published (Tayang Publik)</option>
                  </select>
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
                    <span>{saving ? "Menyimpan..." : "Simpan Website"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Simple Dialog */}
        {deletingWeb && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus website <strong>{deletingWeb.name}</strong>? Tindakan ini akan menghapus semua konfigurasi halaman dan slot komponen secara permanen.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingWeb(null)}
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
