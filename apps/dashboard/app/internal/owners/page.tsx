"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  PlusCircle,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";

interface OwnerUser {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  role: string;
}

export default function InternalOwnersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [owners, setOwners] = useState<OwnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<OwnerUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    password: "" // optional for edit, required for add
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingOwner, setDeletingOwner] = useState<OwnerUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOwners = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<OwnerUser[]>("GET", "internal/owners");
      setOwners(res.data || []);
    } catch (err: any) {
      console.error("Fetch owners error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar owner bisnis.");
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
            fetchOwners();
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
    setEditingOwner(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      businessName: "",
      password: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (owner: OwnerUser) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone || "",
      businessName: owner.businessName || "",
      password: ""
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMsg("Nama dan email wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingOwner) {
        await apiCall("PATCH", `internal/owners/${editingOwner.id}`, payload);
        showSuccess("Data owner berhasil diperbarui!");
      } else {
        if (!formData.password) {
          setErrorMsg("Password wajib diisi untuk akun owner baru.");
          setSaving(false);
          return;
        }
        await apiCall("POST", "internal/owners", payload);
        showSuccess("Akun owner baru berhasil didaftarkan!");
      }
      setIsFormOpen(false);
      fetchOwners();
    } catch (err: any) {
      console.error("Save owner error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan akun owner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingOwner) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      setErrorMsg("Endpoint hapus owner belum tersedia di backend.");
      setDeletingOwner(null);
    } catch (err: any) {
      console.error("Delete owner error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus akun owner.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredOwners = owners.filter((owner) =>
    owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
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
      title="Kelola Owner Bisnis"
      subtitle="Daftar akun partner usaha mikro dan kecil yang menggunakan platform Lentera Pasar"
      showBackButton={true}
      backUrl="/internal"
    >
      <div className="space-y-6" id="internal-owners-root">
        
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
              placeholder="Cari owner, email, atau usaha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition"
            id="btn-add-owner"
          >
            <Plus className="h-4 w-4" />
            <span>Daftarkan Owner Baru</span>
          </button>
        </div>

        {/* Owners Card Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat data owner...</span>
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tidak Ada Akun Owner</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada akun owner yang cocok dengan kata kunci pencarian."
                : "Belum ada akun owner yang terdaftar dalam sistem."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="owners-grid-list">
            {filteredOwners.map((owner) => (
              <div
                key={owner.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-11 w-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm uppercase">
                        {owner.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-none">{owner.name}</h4>
                        <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                          {owner.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">{owner.email}</span>
                    </div>
                    {owner.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{owner.phone}</span>
                      </div>
                    )}
                    {owner.businessName && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{owner.businessName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(owner)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition"
                    title="Edit Data Owner"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingOwner(owner)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition"
                    title="Hapus Akun Owner"
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
                  {editingOwner ? "Edit Owner Akun" : "Daftarkan Owner Baru"}
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
                  <label htmlFor="owner-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="owner-name"
                    type="text"
                    required
                    placeholder="Contoh: Budi Gunawan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="owner-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="owner-email"
                    type="email"
                    required
                    placeholder="budi@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="owner-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    id="owner-phone"
                    type="tel"
                    placeholder="Contoh: 0812345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Business Name */}
                <div className="space-y-1">
                  <label htmlFor="owner-biz" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Nama Usaha Utama
                  </label>
                  <input
                    id="owner-biz"
                    type="text"
                    placeholder="Contoh: Keripik Tempe Jaya"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="owner-pass" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Password {editingOwner && "(Kosongkan jika tidak diubah)"} {!editingOwner && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    id="owner-pass"
                    type="password"
                    required={!editingOwner}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-mono"
                  />
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
                    <span>{saving ? "Menyimpan..." : "Simpan Akun"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Simple Dialog */}
        {deletingOwner && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun owner <strong>{deletingOwner.name}</strong>? Tindakan ini tidak dapat dibatalkan dan akan mencabut hak akses login.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingOwner(null)}
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
