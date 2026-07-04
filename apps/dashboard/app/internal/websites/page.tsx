"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import WebsiteTypeSelector, { WebsiteTypeValue } from "@/components/ui/WebsiteTypeSelector";
import {
  Globe,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  User,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  UserX
} from "lucide-react";

type LifecycleStatus = "active" | "suspended" | "nonactive";

interface WebsiteItem {
  id: string | number;
  name: string;
  slug: string;
  websiteType: string;
  websiteTypeLabel?: string;
  status: "draft" | "published";
  statusLabel?: string;
  lifecycleStatus: LifecycleStatus;
  lifecycleStatusLabel?: string;
  ownerId?: string | number;
  ownerName?: string;
  ownerRole?: string;
  isUnassigned?: boolean;
  pagesCount?: number;
  sectionsCount?: number;
}

interface SyncResult {
  pagesAdded: number;
  sectionsAdded: number;
  totalPages: number;
  totalSections: number;
}

const LIFECYCLE_OPTIONS: { value: LifecycleStatus; label: string }[] = [
  { value: "active", label: "Aktif" },
  { value: "suspended", label: "Ditangguhkan" },
  { value: "nonactive", label: "Non-Aktif" }
];

const lifecycleBadgeClass = (status: LifecycleStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "suspended":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "nonactive":
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const lifecycleIcon = (status: LifecycleStatus) => {
  switch (status) {
    case "active":
      return <ShieldCheck className="h-3.5 w-3.5" />;
    case "suspended":
      return <ShieldAlert className="h-3.5 w-3.5" />;
    case "nonactive":
    default:
      return <ShieldOff className="h-3.5 w-3.5" />;
  }
};

export default function InternalWebsitesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Status change state
  const [statusConfirm, setStatusConfirm] = useState<{ web: WebsiteItem; status: LifecycleStatus } | null>(null);
  const [statusSavingId, setStatusSavingId] = useState<string | number | null>(null);

  // Sync state
  const [syncingId, setSyncingId] = useState<string | number | null>(null);
  const [syncConfirmWeb, setSyncConfirmWeb] = useState<WebsiteItem | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  // Pre-provisioning (buat website tanpa owner) state
  const [isPreProvisionOpen, setIsPreProvisionOpen] = useState(false);
  const [preProvisionForm, setPreProvisionForm] = useState<{ name: string; slug: string; websiteType: WebsiteTypeValue }>({
    name: "",
    slug: "",
    websiteType: "company_profile"
  });
  const [preProvisioning, setPreProvisioning] = useState(false);

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

  const handleConfirmStatusChange = async () => {
    if (!statusConfirm) return;
    setStatusSavingId(statusConfirm.web.id);
    setErrorMsg("");
    try {
      await apiCall("PATCH", `internal/websites/${statusConfirm.web.id}/status`, {
        status: statusConfirm.status
      });
      const label = LIFECYCLE_OPTIONS.find((o) => o.value === statusConfirm.status)?.label;
      showSuccess(`Status website "${statusConfirm.web.name}" berhasil diubah menjadi ${label}.`);
      setStatusConfirm(null);
      fetchWebsites();
    } catch (err: any) {
      console.error("Change website status error:", err);
      setErrorMsg(err.error?.message || "Gagal mengubah status website.");
    } finally {
      setStatusSavingId(null);
    }
  };

  const handleSync = async () => {
    if (!syncConfirmWeb) return;
    setSyncingId(syncConfirmWeb.id);
    setSyncConfirmWeb(null);
    setErrorMsg("");
    try {
      const res = await apiCall<SyncResult>("POST", `internal/websites/${syncConfirmWeb.id}/sync-structure`);
      setSyncResult(res.data || null);
      const added = (res.data?.pagesAdded || 0) + (res.data?.sectionsAdded || 0);
      showSuccess(
        added > 0
          ? `Sinkronisasi berhasil! ${res.data?.pagesAdded} halaman baru + ${res.data?.sectionsAdded} section baru ditambahkan ke website ${syncConfirmWeb.name}.`
          : `Website ${syncConfirmWeb.name} sudah sinkron — tidak ada halaman atau section yang perlu ditambahkan.`
      );
      fetchWebsites();
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal menyinkronkan struktur website.");
    } finally {
      setSyncingId(null);
    }
  };

  const handlePreProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preProvisionForm.name || !preProvisionForm.slug) {
      setErrorMsg("Nama website dan slug wajib diisi.");
      return;
    }
    setPreProvisioning(true);
    setErrorMsg("");
    try {
      await apiCall("POST", "internal/websites", preProvisionForm);
      setIsPreProvisionOpen(false);
      setPreProvisionForm({ name: "", slug: "", websiteType: "company_profile" });
      showSuccess("Website tanpa owner berhasil dibuat. Assign ke owner lewat halaman Owner Bisnis.");
      fetchWebsites();
    } catch (err: any) {
      console.error("Pre-provision website error:", err);
      setErrorMsg(err.error?.message || "Gagal membuat website.");
    } finally {
      setPreProvisioning(false);
    }
  };

  const filteredWebsites = websites.filter(
    (web) =>
      web.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      web.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      web.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unassignedCount = websites.filter((w) => w.isUnassigned || w.ownerRole === "internal_admin").length;

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
    <DashboardLayout
      title="Daftar Website"
      subtitle="Pantau seluruh website yang dibuat owner dan kelola status aksesnya"
    >
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
            Website di panel ini tidak bisa dihapus permanen. Untuk membatasi akses sebuah website,
            gunakan status <strong>Ditangguhkan</strong> atau <strong>Non-Aktif</strong>. Kamu juga bisa
            pre-provisioning website tanpa owner dulu di sini ({unassignedCount} menunggu assign), lalu
            di-assign ke owner bisnis tertentu lewat halaman <strong>Owner Bisnis</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, slug, atau owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          <button
            onClick={() => setIsPreProvisionOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="h-4 w-4" /> Buat Website Tanpa Owner
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-24 animate-pulse" />
            ))}
          </div>
        ) : filteredWebsites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-2">
            <Globe className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500">Belum ada website yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredWebsites.map((web) => {
                const isUnassigned = web.isUnassigned || web.ownerRole === "internal_admin";
                return (
                  <div key={web.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{web.name}</h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${lifecycleBadgeClass(
                            web.lifecycleStatus
                          )}`}
                        >
                          {lifecycleIcon(web.lifecycleStatus)}
                          {web.lifecycleStatusLabel ||
                            LIFECYCLE_OPTIONS.find((o) => o.value === web.lifecycleStatus)?.label ||
                            web.lifecycleStatus}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                          {web.statusLabel || web.status}
                        </span>
                        {isUnassigned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-violet-50 text-violet-700 border-violet-200">
                            <UserX className="h-3 w-3" /> Belum Ada Owner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">/{web.slug}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        {web.ownerName && !isUnassigned && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {web.ownerName}
                          </span>
                        )}
                        {typeof web.pagesCount === "number" && <span>{web.pagesCount} halaman</span>}
                        {typeof web.sectionsCount === "number" && <span>{web.sectionsCount} section</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {LIFECYCLE_OPTIONS.filter((o) => o.value !== web.lifecycleStatus).map((option) => (
                        <button
                          key={option.value}
                          disabled={statusSavingId === web.id}
                          onClick={() => setStatusConfirm({ web, status: option.value })}
                          className="px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 disabled:opacity-50"
                        >
                          Jadikan {option.label}
                        </button>
                      ))}
                      <button
                        disabled={syncingId === web.id}
                        onClick={() => setSyncConfirmWeb(web)}
                        className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 flex items-center gap-1"
                      >
                        <RefreshCw className={`h-3 w-3 ${syncingId === web.id ? "animate-spin" : ""}`} />
                        Sync
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal buat website tanpa owner */}
      {isPreProvisionOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handlePreProvision} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-800">Buat Website Tanpa Owner</h3>
              <button
                type="button"
                onClick={() => setIsPreProvisionOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Website ini akan dibuat sebagai "mengambang" dulu (belum ada owner bisnis). Nanti bisa
              di-assign ke owner tertentu lewat halaman Owner Bisnis.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Nama Website</label>
                <input
                  type="text"
                  value={preProvisionForm.name}
                  onChange={(e) => setPreProvisionForm({ ...preProvisionForm, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Slug</label>
                <input
                  type="text"
                  value={preProvisionForm.slug}
                  onChange={(e) => setPreProvisionForm({ ...preProvisionForm, slug: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="nama-usaha"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Tipe Website</label>
                <div className="mt-1">
                  <WebsiteTypeSelector
                    value={preProvisionForm.websiteType}
                    onChange={(value) => setPreProvisionForm({ ...preProvisionForm, websiteType: value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPreProvisionOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={preProvisioning}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
              >
                {preProvisioning ? "Membuat..." : "Buat Website"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal konfirmasi ubah status */}
      {statusConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-800">Ubah Status Website</h3>
              <button onClick={() => setStatusConfirm(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Ubah status website <strong>{statusConfirm.web.name}</strong> menjadi{" "}
              <strong>{LIFECYCLE_OPTIONS.find((o) => o.value === statusConfirm.status)?.label}</strong>?
              {statusConfirm.status !== "active" && (
                <> Website ini akan langsung berhenti bisa diakses publik selama status ini aktif.</>
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
                disabled={statusSavingId === statusConfirm.web.id}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
              >
                {statusSavingId === statusConfirm.web.id ? "Menyimpan..." : "Ya, Ubah Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal konfirmasi sync */}
      {syncConfirmWeb && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-800">Sinkronkan Struktur</h3>
              <button onClick={() => setSyncConfirmWeb(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500">
              Tambahkan halaman/section default terbaru ke website <strong>{syncConfirmWeb.name}</strong> yang
              belum ada? Data yang sudah diisi owner tidak akan tertimpa.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSyncConfirmWeb(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleSync}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
              >
                Ya, Sinkronkan
              </button>
            </div>
          </div>
        </div>
      )}

      {syncResult && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center">
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Sinkronisasi Selesai</h3>
            <p className="text-sm text-slate-500">
              {syncResult.pagesAdded} halaman baru dan {syncResult.sectionsAdded} section baru ditambahkan.
            </p>
            <button
              onClick={() => setSyncResult(null)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
