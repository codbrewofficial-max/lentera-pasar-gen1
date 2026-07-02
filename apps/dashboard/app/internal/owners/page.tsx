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
  AlertCircle,
  CheckCircle,
  Save,
  X,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Ban,
  Skull,
  Link2,
  Sparkles
} from "lucide-react";

type AccountStatus = "active" | "non_active" | "suspended" | "banned" | "blacklisted";

interface OwnerUser {
  id: string | number;
  name: string;
  email: string;
  whatsapp?: string;
  primaryWebsiteId?: string | null;
  primaryWebsite?: WebsiteItem | null;
  websitesCount?: number;
  role: string;
  accountStatus: AccountStatus;
  accountStatusLabel?: string;
}

interface WebsiteItem {
  id: string | number;
  name: string;
  slug: string;
  ownerId?: string | number;
  owner?: { id?: string | number };
  websiteType: string;
  ownerRole?: string;
  isUnassigned?: boolean;
}

const STATUS_OPTIONS: { value: AccountStatus; label: string }[] = [
  { value: "active", label: "Aktif" },
  { value: "non_active", label: "Non-Aktif" },
  { value: "suspended", label: "Ditangguhkan" },
  { value: "banned", label: "Diblokir" },
  { value: "blacklisted", label: "Daftar Hitam" }
];

const statusBadgeClass = (status: AccountStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "non_active":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "suspended":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "banned":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "blacklisted":
      return "bg-slate-900 text-white border-slate-900";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const statusIcon = (status: AccountStatus) => {
  switch (status) {
    case "active":
      return <ShieldCheck className="h-3.5 w-3.5" />;
    case "non_active":
      return <ShieldOff className="h-3.5 w-3.5" />;
    case "suspended":
      return <ShieldAlert className="h-3.5 w-3.5" />;
    case "banned":
      return <Ban className="h-3.5 w-3.5" />;
    case "blacklisted":
      return <Skull className="h-3.5 w-3.5" />;
    default:
      return <ShieldOff className="h-3.5 w-3.5" />;
  }
};

export default function InternalOwnersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [owners, setOwners] = useState<OwnerUser[]>([]);
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Create/Edit owner form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<OwnerUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: ""
  });
  const [saving, setSaving] = useState(false);

  // +Website modal state (2 mode: pilih existing / buat baru)
  const [websiteModalOwner, setWebsiteModalOwner] = useState<OwnerUser | null>(null);
  const [websiteModalMode, setWebsiteModalMode] = useState<"assign" | "create">("assign");
  const [websiteFormData, setWebsiteFormData] = useState({ name: "", slug: "" });
  const [selectedUnassignedId, setSelectedUnassignedId] = useState<string>("");
  const [creatingWebsite, setCreatingWebsite] = useState(false);
  const [assigningWebsite, setAssigningWebsite] = useState(false);
  const [primarySavingId, setPrimarySavingId] = useState<string | number | null>(null);

  // Status change state
  const [statusConfirm, setStatusConfirm] = useState<{ owner: OwnerUser; status: AccountStatus } | null>(null);
  const [statusSavingId, setStatusSavingId] = useState<string | number | null>(null);

  const fetchOwners = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<OwnerUser[]>("GET", "internal/owners");
      setOwners(res.data || []);
      const webRes = await apiCall<WebsiteItem[]>("GET", "internal/websites").catch(() => ({
        data: [] as WebsiteItem[]
      }));
      setWebsites(webRes.data || []);
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
    setFormData({ name: "", email: "", whatsapp: "", password: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (owner: OwnerUser) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      email: owner.email,
      whatsapp: owner.whatsapp || "",
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
        email: formData.email,
        whatsapp: formData.whatsapp || null
      };

      if (editingOwner) {
        await apiCall("PATCH", `internal/owners/${editingOwner.id}`, payload);
        showSuccess("Data owner berhasil diperbarui!");
      } else {
        if (!formData.password) {
          setErrorMsg("Password wajib diisi untuk akun owner baru.");
          setSaving(false);
          return;
        }
        payload.password = formData.password;
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

  const handleConfirmStatusChange = async () => {
    if (!statusConfirm) return;
    setStatusSavingId(statusConfirm.owner.id);
    setErrorMsg("");
    try {
      await apiCall("PATCH", `internal/owners/${statusConfirm.owner.id}/status`, {
        status: statusConfirm.status
      });
      const label = STATUS_OPTIONS.find((o) => o.value === statusConfirm.status)?.label;
      showSuccess(`Status owner "${statusConfirm.owner.name}" berhasil diubah menjadi ${label}.`);
      setStatusConfirm(null);
      fetchOwners();
    } catch (err: any) {
      console.error("Change owner status error:", err);
      setErrorMsg(err.error?.message || "Gagal mengubah status owner.");
    } finally {
      setStatusSavingId(null);
    }
  };

  const ownerWebsites = (owner: OwnerUser) =>
    websites.filter((web) => String(web.ownerId || web.owner?.id || "") === String(owner.id));

  const unassignedWebsites = websites.filter((web) => web.isUnassigned || web.ownerRole === "internal_admin");

  const handleOpenCreateWebsite = (owner: OwnerUser) => {
    setWebsiteModalOwner(owner);
    setWebsiteModalMode(unassignedWebsites.length > 0 ? "assign" : "create");
    setWebsiteFormData({ name: "", slug: "" });
    setSelectedUnassignedId("");
  };

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteModalOwner || !websiteFormData.name || !websiteFormData.slug) {
      setErrorMsg("Nama website dan slug wajib diisi.");
      return;
    }
    setCreatingWebsite(true);
    setErrorMsg("");
    try {
      await apiCall("POST", `internal/owners/${websiteModalOwner.id}/websites`, {
        name: websiteFormData.name,
        slug: websiteFormData.slug,
        websiteType: "company_profile"
      });
      setWebsiteModalOwner(null);
      showSuccess("Website baru untuk owner berhasil dibuat.");
      fetchOwners();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal membuat website untuk owner.");
    } finally {
      setCreatingWebsite(false);
    }
  };

  const handleAssignWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteModalOwner || !selectedUnassignedId) {
      setErrorMsg("Pilih salah satu website yang belum ada owner-nya.");
      return;
    }
    setAssigningWebsite(true);
    setErrorMsg("");
    try {
      await apiCall("PATCH", `internal/websites/${selectedUnassignedId}/assign-owner`, {
        ownerId: websiteModalOwner.id
      });
      setWebsiteModalOwner(null);
      showSuccess("Website berhasil di-assign ke owner ini.");
      fetchOwners();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal meng-assign website ke owner.");
    } finally {
      setAssigningWebsite(false);
    }
  };

  const handleSetPrimaryWebsite = async (owner: OwnerUser, websiteId: string) => {
    setPrimarySavingId(owner.id);
    setErrorMsg("");
    try {
      await apiCall("PATCH", `internal/owners/${owner.id}/primary-website`, { websiteId });
      showSuccess("Website utama berhasil diperbarui.");
      fetchOwners();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal mengatur website utama.");
    } finally {
      setPrimarySavingId(null);
    }
  };

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.whatsapp?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authorized === false) {
    return (
      <DashboardLayout title="Akses Ditolak" showBackButton={true} backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-sm text-slate-500">Halaman ini hanya untuk tim internal Labkerkomit.</p>
          <button
            onClick={() => router.push("/websites")}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            Kembali ke Beranda
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Owner Bisnis" subtitle="Kelola akun pemilik website dan status aksesnya">
      <div className="space-y-6">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-800 text-sm">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-xs text-slate-500 leading-normal">
          <p>
            Akun owner tidak bisa dihapus permanen agar riwayat website & data lead tetap utuh. Gunakan status{" "}
            <strong>Non-Aktif</strong>, <strong>Ditangguhkan</strong>, <strong>Diblokir</strong>, atau{" "}
            <strong>Daftar Hitam</strong> untuk mencegah owner login. Tombol <strong>+ Website</strong> sekarang
            bisa meng-assign website yang sudah dibuat internal tapi belum ada owner-nya (
            {unassignedWebsites.length} tersedia), atau tetap bisa buat website baru langsung.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau whatsapp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="h-4 w-4" /> Tambah Owner
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-28 animate-pulse" />
            ))}
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-2">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500">Belum ada owner yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredOwners.map((owner) => (
                <div key={owner.id} className="p-5 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{owner.name}</h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClass(
                            owner.accountStatus
                          )}`}
                        >
                          {statusIcon(owner.accountStatus)}
                          {owner.accountStatusLabel ||
                            STATUS_OPTIONS.find((o) => o.value === owner.accountStatus)?.label ||
                            owner.accountStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {owner.email}
                        </span>
                        {owner.whatsapp && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {owner.whatsapp}
                          </span>
                        )}
                        <span>{owner.websitesCount ?? ownerWebsites(owner).length} website</span>
                      </div>
                      {owner.primaryWebsite && (
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Website utama: {owner.primaryWebsite.name}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(owner)}
                        className="px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleOpenCreateWebsite(owner)}
                        className="px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                      >
                        + Website
                      </button>
                    </div>
                  </div>

                  {/* Kontrol status */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">Ubah status:</span>
                    {STATUS_OPTIONS.filter((o) => o.value !== owner.accountStatus).map((option) => (
                      <button
                        key={option.value}
                        disabled={statusSavingId === owner.id}
                        onClick={() => setStatusConfirm({ owner, status: option.value })}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 disabled:opacity-50"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Set primary website (kalau owner punya lebih dari 1 website) */}
                  {ownerWebsites(owner).length > 1 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 font-medium mr-1">Website utama:</span>
                      {ownerWebsites(owner).map((web) => (
                        <button
                          key={web.id}
                          disabled={primarySavingId === owner.id || owner.primaryWebsiteId === web.id}
                          onClick={() => handleSetPrimaryWebsite(owner, String(web.id))}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${
                            owner.primaryWebsiteId === web.id
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                          } disabled:opacity-50`}
                        >
                          {web.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Create/Edit Owner */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-800">
                {editingOwner ? "Edit Owner" : "Tambah Owner Baru"}
              </h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="6281234567890"
                />
              </div>
              {!editingOwner && (
                <div>
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 flex items-center gap-1"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal +Website: 2 mode — assign existing / buat baru */}
      {websiteModalOwner && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-800">
                + Website untuk {websiteModalOwner.name}
              </h3>
              <button
                type="button"
                onClick={() => setWebsiteModalOwner(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setWebsiteModalMode("assign")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                  websiteModalMode === "assign" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                Pilih yang Sudah Ada
                {unassignedWebsites.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-slate-900 text-white rounded-full text-[10px]">
                    {unassignedWebsites.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setWebsiteModalMode("create")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                  websiteModalMode === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Buat Baru
              </button>
            </div>

            {websiteModalMode === "assign" ? (
              unassignedWebsites.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                  Belum ada website yang menunggu di-assign. Buat website tanpa owner dulu di halaman{" "}
                  <strong>Daftar Website</strong>, atau langsung buat baru untuk owner ini lewat tab "Buat
                  Baru".
                </div>
              ) : (
                <form onSubmit={handleAssignWebsite} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Website yang Belum Ada Owner
                    </label>
                    <select
                      value={selectedUnassignedId}
                      onChange={(e) => setSelectedUnassignedId(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      required
                    >
                      <option value="">-- Pilih website --</option>
                      {unassignedWebsites.map((web) => (
                        <option key={web.id} value={web.id}>
                          {web.name} (/{web.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setWebsiteModalOwner(null)}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={assigningWebsite || !selectedUnassignedId}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
                    >
                      {assigningWebsite ? "Meng-assign..." : "Assign ke Owner Ini"}
                    </button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handleCreateWebsite} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Nama Website</label>
                  <input
                    type="text"
                    value={websiteFormData.name}
                    onChange={(e) => setWebsiteFormData({ ...websiteFormData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Slug</label>
                  <input
                    type="text"
                    value={websiteFormData.slug}
                    onChange={(e) => setWebsiteFormData({ ...websiteFormData, slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="nama-usaha"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setWebsiteModalOwner(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={creatingWebsite}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
                  >
                    {creatingWebsite ? "Membuat..." : "Buat Website"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal konfirmasi ubah status owner */}
      {statusConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-800">Ubah Status Owner</h3>
              <button onClick={() => setStatusConfirm(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Ubah status owner <strong>{statusConfirm.owner.name}</strong> menjadi{" "}
              <strong>{STATUS_OPTIONS.find((o) => o.value === statusConfirm.status)?.label}</strong>?
              {statusConfirm.status !== "active" && (
                <> Owner ini tidak akan bisa login ke dashboard selama status ini aktif.</>
              )}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusConfirm(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={statusSavingId === statusConfirm.owner.id}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
              >
                {statusSavingId === statusConfirm.owner.id ? "Menyimpan..." : "Ya, Ubah Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
