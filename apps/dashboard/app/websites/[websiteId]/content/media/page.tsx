"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall, apiUpload, getApiBaseUrl } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertCircle, CheckCircle, Copy, Image, RefreshCw, Trash2, Upload } from "lucide-react";

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
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const baseUrl = useMemo(() => getApiBaseUrl().replace(/\/$/, ""), []);

  const mediaUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<MediaAsset[]>("GET", `websites/${websiteId}/media`);
      setItems(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat media library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) fetchItems();
  }, [websiteId]);

  const showSuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 4000);
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
      if (altText) formData.append("altText", altText);
      await apiUpload<MediaAsset>(`websites/${websiteId}/media`, formData);
      setSelectedFile(null);
      setAltText("");
      showSuccess("Media berhasil diupload.");
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal upload media.");
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
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menghapus media.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = async (url: string) => {
    const fullUrl = mediaUrl(url);
    await navigator.clipboard.writeText(fullUrl);
    showSuccess("URL media disalin.");
  };

  return (
    <DashboardLayout title="Media Library" subtitle="Upload dan kelola gambar untuk logo, artikel, portfolio, layanan, dan section" showBackButton backUrl={`/websites/${websiteId}/overview`}>
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

        <form onSubmit={handleUpload} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upload Media</h3>
            <p className="text-xs text-slate-500 mt-1">Format yang didukung: JPG, PNG, WEBP, GIF. Gunakan gambar yang sudah dioptimasi untuk website.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <label className="lg:col-span-1 border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-[#649FF6]/60 transition cursor-pointer bg-slate-50">
              <Upload className="h-7 w-7 mx-auto text-slate-400 mb-2" />
              <span className="block text-xs font-bold text-slate-700">{selectedFile ? selectedFile.name : "Pilih gambar"}</span>
              <span className="block text-[10px] text-slate-400 mt-1">{selectedFile ? formatBytes(selectedFile.size) : "Klik untuk memilih file"}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
            </label>
            <div className="lg:col-span-2 space-y-3">
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

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Daftar Media</h3>
          <button onClick={fetchItems} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-[#649FF6] hover:bg-white rounded-xl transition">
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
            {items.map((asset) => (
              <div key={asset.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img src={mediaUrl(asset.url)} alt={asset.altText || asset.originalName} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{asset.originalName}</h4>
                    <p className="text-[10px] text-slate-400">{asset.mimeType} · {formatBytes(asset.sizeBytes)}</p>
                  </div>
                  {asset.altText && <p className="text-[10px] text-slate-500 line-clamp-2">{asset.altText}</p>}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => copyUrl(asset.url)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Copy URL">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(asset)} disabled={deletingId === asset.id} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition" title="Hapus">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
