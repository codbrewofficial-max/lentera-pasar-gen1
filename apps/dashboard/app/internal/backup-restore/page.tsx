"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiCall, apiDownload, getApiBaseUrl, getAuthToken } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Archive,
  Search,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  X,
  Loader2
} from "lucide-react";

type LifecycleStatus = "active" | "suspended" | "nonactive";

interface WebsiteItem {
  id: string;
  name: string;
  slug: string;
  websiteType: string;
  websiteTypeLabel?: string;
  status: "draft" | "published";
  statusLabel?: string;
  lifecycleStatus: LifecycleStatus;
  lifecycleStatusLabel?: string;
  ownerName?: string;
  isUnassigned?: boolean;
}

interface RestoreSummary {
  servicesRestored: number;
  portfoliosRestored: number;
  testimonialsRestored: number;
  brandPartnersRestored: number;
  articlesRestored: number;
  faqsRestored: number;
  productsRestored: number;
  bannersRestored: number;
  valuePropositionsRestored: number;
  leadsRestored: number;
  mediaAssetsRestored: number;
  sectionsRestored: number;
}

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

export default function InternalBackupRestorePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [backingUpId, setBackingUpId] = useState<string | null>(null);

  const [restoreTarget, setRestoreTarget] = useState<WebsiteItem | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreConfirmed, setRestoreConfirmed] = useState(false);
  const [restoreResult, setRestoreResult] = useState<RestoreSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchWebsites = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<WebsiteItem[]>("GET", "internal/websites");
      setWebsites(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal memuat daftar website.");
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
          setAuthorized(true);
          fetchWebsites();
        } else {
          setAuthorized(false);
          setLoading(false);
        }
      } catch {
        router.replace("/login");
      }
    }
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleBackup = async (website: WebsiteItem) => {
    setBackingUpId(website.id);
    setErrorMsg("");
    try {
      await apiDownload(`internal/websites/${website.id}/backup`, `backup-${website.slug}.zip`);
      showSuccess(`Backup "${website.name}" berhasil diunduh.`);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal mengunduh backup website.");
    } finally {
      setBackingUpId(null);
    }
  };

  const handleOpenRestore = (website: WebsiteItem) => {
    setRestoreTarget(website);
    setRestoreFile(null);
    setRestoreConfirmed(false);
    setRestoreResult(null);
  };

  const handleCloseRestore = () => {
    if (restoring) return;
    setRestoreTarget(null);
    setRestoreFile(null);
    setRestoreConfirmed(false);
    setRestoreResult(null);
  };

  const handlePickFile = (file: File | null) => {
    setErrorMsg("");
    if (!file) {
      setRestoreFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErrorMsg("File backup harus berformat .zip");
      return;
    }
    setRestoreFile(file);
  };

  const handleRunRestore = async () => {
    if (!restoreTarget || !restoreFile) return;
    setRestoring(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", restoreFile);
      const baseUrl = getApiBaseUrl();
      const token = getAuthToken();
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/internal/websites/${restoreTarget.id}/restore`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw json || { error: { message: `Restore gagal (Status: ${res.status})` } };
      }
      setRestoreResult(json.data as RestoreSummary);
      showSuccess(`Website "${restoreTarget.name}" berhasil dipulihkan dari backup.`);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memulihkan website dari file backup.");
    } finally {
      setRestoring(false);
    }
  };

  const filteredWebsites = websites.filter(
    (w) =>
      w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authorized === false) {
    return (
      <DashboardLayout title="Akses Ditolak" showBackButton backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-sm text-slate-500">Halaman ini hanya untuk tim internal LabKerKomIT.</p>
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
    <DashboardLayout title="Backup & Restore" subtitle="Unduh backup atau pulihkan data tiap website">
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
            <strong>Backup</strong> mengunduh 1 file ZIP berisi seluruh konten website (section, CRUD, business
            profile, dan file media). <strong>Restore</strong> mengunggah file ZIP backup dan langsung mengganti
            seluruh konten website tujuan dengan isi dari file tersebut — struktur halaman & pilihan tampilan
            section tidak berubah, cuma isinya yang dipulihkan. Daftar di bawah ini menampilkan semua website baik
            yang aktif maupun tidak aktif.
          </p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, slug, atau owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-20 animate-pulse" />
            ))}
          </div>
        ) : filteredWebsites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-2">
            <Archive className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500">Belum ada website yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredWebsites.map((website) => (
                <div key={website.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{website.name}</h4>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${lifecycleBadgeClass(
                          website.lifecycleStatus
                        )}`}
                      >
                        {lifecycleIcon(website.lifecycleStatus)}
                        {website.lifecycleStatusLabel || website.lifecycleStatus}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-slate-50 text-slate-500 border-slate-200">
                        {website.statusLabel || website.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                      <span>/{website.slug}</span>
                      <span>{website.websiteTypeLabel || website.websiteType}</span>
                      {website.ownerName && <span>Owner: {website.ownerName}</span>}
                      {website.isUnassigned && <span className="text-amber-600">Belum ada owner</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleBackup(website)}
                      disabled={backingUpId === website.id}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 disabled:opacity-50"
                    >
                      {backingUpId === website.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      Backup
                    </button>
                    <button
                      onClick={() => handleOpenRestore(website)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Restore */}
      {restoreTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Restore Website</h3>
                <p className="text-xs text-slate-400 mt-0.5">{restoreTarget.name} · /{restoreTarget.slug}</p>
              </div>
              <button type="button" onClick={handleCloseRestore} disabled={restoring} className="text-slate-400 hover:text-slate-600 disabled:opacity-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            {restoreResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <span>Restore berhasil. Ringkasan data yang dipulihkan:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.servicesRestored}</strong>Layanan</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.portfoliosRestored}</strong>Portfolio</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.testimonialsRestored}</strong>Testimoni</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.brandPartnersRestored}</strong>Brand/Partner</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.articlesRestored}</strong>Artikel</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.faqsRestored}</strong>FAQ</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.productsRestored}</strong>Produk</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.bannersRestored}</strong>Banner</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.valuePropositionsRestored}</strong>USP</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.leadsRestored}</strong>Lead</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.mediaAssetsRestored}</strong>Media</div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><strong className="block text-slate-700">{restoreResult.sectionsRestored}</strong>Section terisi</div>
                </div>
                <button
                  onClick={handleCloseRestore}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed">
                  Restore akan <strong>mengganti seluruh</strong> Portfolio, Artikel, Layanan, Testimoni, Produk,
                  Banner, USP, FAQ, Brand/Partner, Lead, dan media milik website ini dengan isi dari file backup.
                  Data yang ada sekarang akan hilang dan tidak bisa dikembalikan kecuali kamu backup dulu sebelumnya.
                </div>

                <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-slate-400 transition cursor-pointer bg-slate-50">
                  <Upload className="h-7 w-7 mx-auto text-slate-400 mb-2" />
                  <span className="block text-xs font-bold text-slate-700">{restoreFile ? restoreFile.name : "Pilih file backup .zip"}</span>
                  <span className="block text-[10px] text-slate-400 mt-1">Klik untuk memilih file</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip,application/zip"
                    className="hidden"
                    onChange={(e) => handlePickFile(e.target.files?.[0] || null)}
                  />
                </label>

                <label className="flex items-start gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={restoreConfirmed}
                    onChange={(e) => setRestoreConfirmed(e.target.checked)}
                    className="mt-0.5"
                  />
                  Saya mengerti data yang ada di website ini sekarang akan diganti sepenuhnya oleh isi file backup.
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseRestore}
                    disabled={restoring}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleRunRestore}
                    disabled={!restoreFile || !restoreConfirmed || restoring}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {restoring && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {restoring ? "Memulihkan..." : "Mulai Restore"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
