"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  PlusCircle,
  Grid
} from "lucide-react";

interface TemplateSection {
  id: string | number;
  slotKey: string;
  slotLabel: string;
  component: string;
  variant: string;
  isActive: boolean;
}

const DEFAULT_SLOT_KEYS = [
  { value: "hero", label: "Hero (Header Beranda)" },
  { value: "about", label: "About (Profil Tentang Kami)" },
  { value: "services", label: "Services (Daftar Layanan)" },
  { value: "portfolio", label: "Portfolio (Galeri Karya/Proyek)" },
  { value: "testimonials", label: "Testimonials (Review Pelanggan)" },
  { value: "brands", label: "Brands (Partner & Klien)" },
  { value: "footer", label: "Footer (Kaki Halaman)" }
];

export default function InternalTemplateSectionsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [templates, setTemplates] = useState<TemplateSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateSection | null>(null);
  const [formData, setFormData] = useState({
    slotKey: "hero",
    slotLabel: "Hero Beranda",
    component: "",
    variant: "default",
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingTemplate, setDeletingTemplate] = useState<TemplateSection | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<TemplateSection[]>("GET", "template-sections?websiteType=company_profile");
      setTemplates(res.data || []);
    } catch (err: any) {
      console.error("Fetch templates error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat pustaka template section.");
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
            fetchTemplates();
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
    setEditingTemplate(null);
    setFormData({
      slotKey: "hero",
      slotLabel: "Hero Beranda",
      component: "",
      variant: "default",
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tpl: TemplateSection) => {
    setEditingTemplate(tpl);
    setFormData({
      slotKey: tpl.slotKey,
      slotLabel: tpl.slotLabel,
      component: tpl.component,
      variant: tpl.variant || "default",
      isActive: tpl.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.component || !formData.slotLabel) {
      setErrorMsg("Nama komponen dan label slot wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      if (editingTemplate) {
        await apiCall("PUT", `template-sections/${editingTemplate.id}`, formData);
        showSuccess("Template section berhasil diperbarui!");
      } else {
        await apiCall("POST", "template-sections", formData);
        showSuccess("Template section baru berhasil disimpan!");
      }
      setIsFormOpen(false);
      fetchTemplates();
    } catch (err: any) {
      console.error("Save template error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan data template section.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTemplate) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `template-sections/${deletingTemplate.id}`);
      showSuccess("Template section berhasil dihapus.");
      setDeletingTemplate(null);
      fetchTemplates();
    } catch (err: any) {
      console.error("Delete template error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus template section.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredTemplates = templates.filter((tpl) =>
    tpl.component?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpl.slotKey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpl.slotLabel?.toLowerCase().includes(searchQuery.toLowerCase())
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
      title="Template Section"
      subtitle="Atur daftar slot kunci dan jenis komponen HTML/React yang tersedia untuk dirilis ke editor pengguna"
      showBackButton={true}
      backUrl="/internal"
    >
      <div className="space-y-6" id="internal-templates-root">
        
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
              placeholder="Cari slot key, komponen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            id="btn-add-template"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Komponen Section</span>
          </button>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat library components...</span>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Library Kosong</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada komponen section yang cocok dengan pencarian Anda."
                : "Belum ada jenis komponen visual terdaftar di library template."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="templates-grid-list">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded uppercase tracking-wider">
                      {tpl.slotKey}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        tpl.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {tpl.isActive ? "Aktif" : "Draft"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{tpl.slotLabel}</h4>
                    <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                      <p>React Class: {tpl.component}</p>
                      <p>Varian Variabel: {tpl.variant || "default"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => handleOpenEdit(tpl)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition"
                    title="Edit Komponen"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingTemplate(tpl)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition"
                    title="Hapus Komponen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col max-h-[95vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingTemplate ? "Edit Komponen Section" : "Tambah Komponen Baru"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Slot Key Select */}
                <div className="space-y-1">
                  <label htmlFor="tpl-slot" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Tujuan Slot Kunci
                  </label>
                  <select
                    id="tpl-slot"
                    value={formData.slotKey}
                    onChange={(e) => {
                      const sel = DEFAULT_SLOT_KEYS.find((k) => k.value === e.target.value);
                      setFormData({
                        ...formData,
                        slotKey: e.target.value,
                        slotLabel: sel ? sel.label : "Kustom Slot"
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    {DEFAULT_SLOT_KEYS.map((k) => (
                      <option key={k.value} value={k.value}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slot Label */}
                <div className="space-y-1">
                  <label htmlFor="tpl-label" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama/Label Slot Tampilan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="tpl-label"
                    type="text"
                    required
                    placeholder="Contoh: Hero Elegan Kiri"
                    value={formData.slotLabel}
                    onChange={(e) => setFormData({ ...formData, slotLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Component Name */}
                <div className="space-y-1">
                  <label htmlFor="tpl-comp" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama Komponen Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="tpl-comp"
                    type="text"
                    required
                    placeholder="Contoh: HeroSimple, AboutSplit, ServicesGrid"
                    value={formData.component}
                    onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                {/* Variant */}
                <div className="space-y-1">
                  <label htmlFor="tpl-variant" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Varian Desain
                  </label>
                  <input
                    id="tpl-variant"
                    type="text"
                    placeholder="Contoh: default, minimal, modern"
                    value={formData.variant}
                    onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    id="tpl-active"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500/20 border-slate-300 rounded"
                  />
                  <label htmlFor="tpl-active" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Aktifkan (Sediakan di Editor Website)
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
                    <span>{saving ? "Menyimpan..." : "Simpan Komponen"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Simple Dialog */}
        {deletingTemplate && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus komponen <strong>{deletingTemplate.component}</strong>? Tindakan ini akan mengeluarkannya dari pustaka komponen yang tersedia di editor.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingTemplate(null)}
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
