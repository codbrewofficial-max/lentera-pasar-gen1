"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall, getApiBaseUrl, getAuthToken } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertCircle, CheckCircle, FileArchive, Package, Upload } from "lucide-react";

interface TemplatePack {
  id: string;
  templatePackKey: string;
  websiteType: string;
  websiteTypeLabel?: string;
  name: string;
  theme: string;
  version: string;
  description?: string | null;
  status: "draft" | "active" | "invalid";
  statusLabel?: string;
  validationSummary?: any;
  sectionsCount?: number;
}

interface ImportReport {
  templatePack: TemplatePack;
  summary: {
    expectedPages: number;
    expectedSlots: number;
    foundSections: number;
    validSections: number;
    draftSections: number;
    invalidSections: number;
  };
  errors: Array<{ level: string; file?: string; slotKey?: string; message: string }>;
  warnings: Array<{ level: string; file?: string; slotKey?: string; message: string }>;
}

export default function InternalTemplatePacksPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [packs, setPacks] = useState<TemplatePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [report, setReport] = useState<ImportReport | null>(null);

  const fetchPacks = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<TemplatePack[]>("GET", "internal/template-packs");
      setPacks(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat template pack.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("LP_USER");
    const token = localStorage.getItem("LP_AUTH_TOKEN");
    if (!token || !userStr) {
      router.replace("/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role === "internal_admin") {
        setAuthorized(true);
        fetchPacks();
      } else {
        setAuthorized(false);
        setLoading(false);
      }
    } catch {
      router.replace("/login");
    }
  }, []);

  const statusClass = (status?: string) => {
    if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "invalid") return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Pilih file ZIP template pack terlebih dahulu.");
      return;
    }
    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setReport(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch(`${getApiBaseUrl()}/internal/template-packs/import-zip`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: formData
      });
      const json = await response.json();
      if (!response.ok) throw json;
      setReport(json.data);
      setSuccessMsg("Template pack selesai diunggah dan divalidasi.");
      setSelectedFile(null);
      await fetchPacks();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal mengunggah template pack.");
    } finally {
      setUploading(false);
    }
  };

  if (authorized === false) {
    return (
      <DashboardLayout title="Akses Ditolak" showBackButton={true} backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-sm text-slate-500">Halaman ini hanya untuk tim internal Labkerkomit.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Template Pack"
      subtitle="Upload ZIP template pack dan validasi terhadap struktur website source of truth"
      showBackButton={true}
      backUrl="/internal"
    >
      <div className="space-y-6" id="internal-template-packs-root">
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileArchive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Upload Template Pack ZIP</h3>
              <p className="text-xs text-slate-500">File harus berisi manifest.json dan sections/*.json.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept=".zip,application/zip"
              disabled={uploading}
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Sedang mengunggah dan memvalidasi..." : "Upload"}</span>
            </button>
          </div>
        </form>

        {report && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hasil Validasi</span>
                <h3 className="font-bold text-slate-900 text-base">{report.templatePack.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusClass(report.templatePack.status)}`}>
                {report.templatePack.statusLabel || report.templatePack.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {Object.entries(report.summary).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{key}</div>
                  <div className="text-lg font-bold text-slate-900">{String(value)}</div>
                </div>
              ))}
            </div>
            {[...report.errors, ...report.warnings].length > 0 && (
              <div className="space-y-2">
                {[...report.errors, ...report.warnings].map((item, idx) => (
                  <div key={idx} className={`text-xs rounded-xl border p-3 ${item.level === "error" ? "bg-rose-50 border-rose-100 text-rose-800" : "bg-amber-50 border-amber-100 text-amber-800"}`}>
                    <span className="font-bold uppercase">{item.level}</span>
                    {item.file && <span className="font-mono"> · {item.file}</span>}
                    {item.slotKey && <span className="font-mono"> · {item.slotKey}</span>}
                    <span> · {item.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => <div key={item} className="bg-white rounded-3xl border border-slate-200 h-36 animate-pulse" />)}
          </div>
        ) : packs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <Package className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Template Pack</h3>
            <p className="text-xs text-slate-500">Upload ZIP template pack Company Profile untuk mulai mengisi pustaka template.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packs.map((pack) => (
              <div key={pack.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{pack.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{pack.templatePackKey} · v{pack.version}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusClass(pack.status)}`}>
                    {pack.statusLabel || pack.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{pack.description || "Tidak ada deskripsi."}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Type</div>
                    <div className="font-semibold text-slate-700">{pack.websiteTypeLabel || pack.websiteType}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Theme</div>
                    <div className="font-semibold text-slate-700 capitalize">{pack.theme}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Section</div>
                    <div className="font-semibold text-slate-700">{pack.sectionsCount ?? 0}</div>
                  </div>
                </div>
                {pack.validationSummary && (
                  <div className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 font-mono overflow-x-auto">
                    {JSON.stringify(pack.validationSummary, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
