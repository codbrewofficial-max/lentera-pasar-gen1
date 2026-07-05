"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall, apiUpload, getApiBaseUrl } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertCircle, CheckCircle, Copy, FileImage, HardDrive, Image, Info, RefreshCw, Trash2, Upload } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

type MediaAsset = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  altText?: string | null;
  createdAt: string;
};

type StorageUsage = {
  usedBytes: number;
  quotaBytes: number;
  remainingBytes: number;
};

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function MediaLibraryPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, boolean>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ pageSize: 12, total: 0, totalPages: 1 });
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);

  const baseUrl = useMemo(() => getApiBaseUrl().replace(/\/$/, ""), []);
  const apiOrigin = useMemo(() => {
    try {
      return new URL(baseUrl).origin;
    } catch {
      return baseUrl.replace(/\/api\/v1\/?$/, "");
    }
  }, [baseUrl]);

  const mediaUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;

    const normalizedPath = url.startsWith("/") ? url : `/${url}`;

    if (normalizedPath.startsWith("/api/v1/")) {
      return `${apiOrigin}${normalizedPath}`;
    }

    if (normalizedPath.startsWith("/public/")) {
      return `${baseUrl}${normalizedPath}`;
    }

    return `${baseUrl}${normalizedPath}`;
  };

  const fetchItems = async (targetPage = page) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<MediaAsset[]>("GET", `websites/${websiteId}/media?page=${targetPage}&pageSize=${pageMeta.pageSize}`);
      setItems(res.data || []);
      if (res.meta?.pagination) {
        setPageMeta({
          pageSize: res.meta.pagination.pageSize,
          total: res.meta.pagination.total,
          totalPages: res.meta.pagination.totalPages
        });
      }
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat media library.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageUsage = async () => {
    try {
      const res = await apiCall<StorageUsage>("GET", "me/storage-usage");
      if (res.data) setStorageUsage(res.data);
    } catch {
      // Non-blocking: kalau gagal load usage, upload tetap jalan (validasi utama tetap di server).
    }
  };

  useEffect(() => {
    if (websiteId) fetchItems(page);
  }, [websiteId, page]);

  useEffect(() => {
    fetchStorageUsage();
  }, [websiteId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const showSuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleSelectFile = (file: File | null) => {
    setErrorMsg("");
    setSelectedFile(null);
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg("Format tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setErrorMsg(`Ukuran gambar terlalu besar. Maksimal ${formatBytes(MAX_FILE_BYTES)}.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Pilih file gambar terlebih dahulu.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("altText", altText.trim());
      await apiUpload<MediaAsset>(`websites/${websiteId}/media`, formData);
      setSelectedFile(null);
      setAltText("");
      showSuccess("Media berhasil diupload dan siap dipakai di field gambar/URL.");
      fetchStorageUsage();
      if (page !== 1) {
        setPage(1);
      } else {
        fetchItems(1);
      }
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal upload media. Cek ukuran, format, dan log backend.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm(`Hapus media ${asset.originalName}?`)) return;
    setDeletingId(asset.id);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/media/${asset.id}`);
      showSuccess("Media berhasil dihapus.");
      fetchStorageUsage();
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchItems(page);
      }
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menghapus media.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = async (url: string) => {
    const fullUrl = mediaUrl(url);
    await navigator.clipboard.writeText(fullUrl);
    showSuccess("URL media disalin. Tempel URL ini ke field gambar, logo, cover, atau section.");
  };

  return (
    <DashboardLayout title="Media Library" subtitle="Bank gambar website: upload, salin URL, lalu pakai di logo, artikel, portfolio, layanan, atau section" showBackButton backUrl={`/websites/${websiteId}/overview`}>
      <div className="space-y-6">
        {successMsg && (
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {storageUsage && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <HardDrive className="h-4 w-4 text-slate-400" />
                Kuota Storage Akun
              </span>
              <span className="text-slate-500">
                {formatBytes(storageUsage.usedBytes)} / {formatBytes(storageUsage.quotaBytes)} terpakai
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  storageUsage.usedBytes / storageUsage.quotaBytes > 0.9
                    ? "bg-rose-500"
                    : storageUsage.usedBytes / storageUsage.quotaBytes > 0.7
                    ? "bg-amber-500"
                    : "bg-[#649FF6]"
                }`}
                style={{ width: `${Math.min(100, (storageUsage.usedBytes / storageUsage.quotaBytes) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Kuota ini dipakai bersama di semua website yang kamu punya, bukan cuma website ini. Sisa:{" "}
              {formatBytes(storageUsage.remainingBytes)}.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <form onSubmit={handleUpload} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Media</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Upload gambar sekali, lalu salin URL-nya untuk dipakai di field logo, cover artikel, gambar portfolio, layanan, atau section.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <label className="lg:col-span-1 border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-[#649FF6]/60 transition cursor-pointer bg-slate-50">
                <Upload className="h-7 w-7 mx-auto text-slate-400 mb-2" />
                <span className="block text-xs font-bold text-slate-700">{selectedFile ? selectedFile.name : "Pilih gambar"}</span>
                <span className="block text-[10px] text-slate-400 mt-1">{selectedFile ? formatBytes(selectedFile.size) : "Klik untuk memilih file"}</span>
                <input type="file" accept={ALLOWED_TYPES.join(",")} className="hidden" onChange={(event) => handleSelectFile(event.target.files?.[0] || null)} />
              </label>

              <div className="lg:col-span-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-500">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <strong className="block text-slate-700">Format</strong>
                    JPG, PNG, WEBP, GIF
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <strong className="block text-slate-700">Maksimal</strong>
                    {formatBytes(MAX_FILE_BYTES)} per file
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <strong className="block text-slate-700">Saran</strong>
                    WEBP/JPG terkompres
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Alt Text</label>
                  <input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Contoh: Foto kegiatan pelatihan dakwah digital" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]" />
                  <p className="text-[10px] text-slate-400">Alt text membantu aksesibilitas dan SEO gambar.</p>
                </div>

                <button type="submit" disabled={uploading || !selectedFile} className="inline-flex items-center gap-2 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Mengupload..." : "Upload Media"}
                </button>
              </div>
            </div>
          </form>

          <div className="bg-[#649FF6]/10 border border-[#649FF6]/20 rounded-3xl p-6 text-sm text-[#315f99] space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-[#649FF6]">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="font-black text-slate-900">Cara Pakai</h3>
            <ol className="list-decimal pl-4 space-y-1 text-xs leading-relaxed">
              <li>Upload gambar dari komputer.</li>
              <li>Klik tombol copy pada kartu media.</li>
              <li>Tempel URL ke field gambar/logo/cover di konten atau section.</li>
            </ol>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Saat deploy Docker, folder <code className="font-mono">apps/api/storage/uploads</code> wajib dijadikan volume agar gambar tidak hilang saat rebuild.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Media</h3>
            <p className="text-[10px] text-slate-400">{items.length} media tersimpan</p>
          </div>
          <button onClick={() => fetchItems(page)} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-[#649FF6] hover:bg-white rounded-xl transition">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-56 bg-white rounded-3xl border border-slate-200 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <Image className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Media</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">Upload gambar agar bisa digunakan untuk logo, artikel, portfolio, layanan, atau section website.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((asset) => {
              const src = mediaUrl(asset.url);
              const isBroken = brokenImageIds[asset.id];
              return (
                <div key={asset.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="aspect-video bg-slate-100 overflow-hidden flex items-center justify-center">
                    {isBroken ? (
                      <div className="text-center text-slate-400 p-4">
                        <FileImage className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-[10px] leading-relaxed">Preview gagal dimuat. Cek file storage backend atau volume upload.</p>
                      </div>
                    ) : (
                      <img src={src} alt={asset.altText || asset.originalName} className="w-full h-full object-cover" onError={() => setBrokenImageIds((current) => ({ ...current, [asset.id]: true }))} />
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{asset.originalName}</h4>
                      <p className="text-[10px] text-slate-400">{asset.mimeType} · {formatBytes(asset.sizeBytes)}</p>
                    </div>
                    {asset.altText && <p className="text-[10px] text-slate-500 line-clamp-2">{asset.altText}</p>}
                    <p className="text-[10px] text-slate-400 font-mono truncate">{asset.url}</p>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button onClick={() => copyUrl(asset.url)} className="inline-flex items-center gap-1 px-3 py-2 text-[10px] font-bold text-slate-600 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Copy URL">
                        <Copy className="h-4 w-4" />
                        Copy URL
                      </button>
                      <button onClick={() => handleDelete(asset)} disabled={deletingId === asset.id} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition" title="Hapus">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && items.length > 0 && (
          <Pagination
            page={page}
            totalPages={pageMeta.totalPages}
            total={pageMeta.total}
            pageSize={pageMeta.pageSize}
            onPageChange={handlePageChange}
            itemLabel="media"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
