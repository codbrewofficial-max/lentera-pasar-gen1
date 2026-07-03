"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall, apiUpload, getApiBaseUrl } from "@/lib/api";
import {
  Image as ImageIcon,
  Upload,
  X,
  Check,
  Shuffle,
  Search,
  FileImage,
  Link as LinkIcon
} from "lucide-react";

interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  altText?: string | null;
  createdAt: string;
}

interface MediaPickerInputProps {
  id?: string;
  label?: string;
  required?: boolean;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  picsumSeedPrefix?: string;
  picsumSize?: { width: number; height: number };
  aspect?: "square" | "video" | "wide";
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function MediaPickerInput({
  id,
  label,
  required = false,
  value,
  onChange,
  helperText,
  picsumSeedPrefix = "media",
  picsumSize = { width: 800, height: 600 },
  aspect = "video"
}: MediaPickerInputProps) {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [manualUrl, setManualUrl] = useState(value || "");
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setManualUrl(value || "");
  }, [value]);

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
    if (normalizedPath.startsWith("/api/v1/")) return `${apiOrigin}${normalizedPath}`;
    return `${baseUrl}${normalizedPath}`;
  };

  const fetchItems = async () => {
    if (!websiteId) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<MediaAsset[]>("GET", `websites/${websiteId}/media`);
      setItems(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal memuat media library.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchItems();
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

  const handleUpload = async () => {
    if (!selectedFile || !websiteId) return;
    setUploading(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("altText", "");
      const res = await apiUpload<MediaAsset>(`websites/${websiteId}/media`, formData);
      setSelectedFile(null);
      await fetchItems();
      if (res.data?.url) {
        applyUrl(res.data.url);
      }
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal upload media.");
    } finally {
      setUploading(false);
    }
  };

  const applyUrl = (url: string) => {
    onChange(url);
    setManualUrl(url);
    setIsOpen(false);
  };

  const handleGeneratePicsum = () => {
    const seed = `${picsumSeedPrefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const url = `https://picsum.photos/seed/${seed}/${picsumSize.width}/${picsumSize.height}`;
    applyUrl(url);
  };

  const filteredItems = items.filter((asset) =>
    (asset.originalName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (asset.altText || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <LinkIcon className="h-3.5 w-3.5" />
          </span>
          <input
            id={id}
            type="url"
            required={required}
            placeholder="https://..."
            value={manualUrl}
            onChange={(e) => {
              setManualUrl(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 hover:border-[#649FF6] hover:text-[#649FF6] text-slate-600 text-xs font-bold rounded-xl shadow-sm transition"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Media Library</span>
          </button>
          <button
            type="button"
            onClick={handleGeneratePicsum}
            title="Generate gambar acak dari Picsum Photos"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 hover:border-[#649FF6] hover:text-[#649FF6] text-slate-600 text-xs font-bold rounded-xl shadow-sm transition"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Generate</span>
          </button>
        </div>
      </div>

      {value && (
        <div className="mt-1 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48">
          <img src={value} alt="Pratinjau" className="w-full h-48 object-cover" />
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full sm:max-w-2xl border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-slideUp">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Pilih dari Media Library</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#649FF6]/60 transition cursor-pointer bg-slate-50">
                  <Upload className="h-5 w-5 mx-auto text-slate-400 mb-1.5" />
                  <span className="block text-[11px] font-bold text-slate-700">{selectedFile ? selectedFile.name : "Upload gambar baru"}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{selectedFile ? formatBytes(selectedFile.size) : "Klik untuk memilih file"}</span>
                  <input type="file" accept={ALLOWED_TYPES.join(",")} className="hidden" onChange={(e) => handleSelectFile(e.target.files?.[0] || null)} />
                </label>

                <div className="flex flex-col justify-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  {selectedFile ? (
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {uploading ? "Mengupload..." : "Upload & Gunakan"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGeneratePicsum}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-[#649FF6] hover:text-[#649FF6] text-slate-600 text-xs font-bold rounded-xl transition"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Generate dari Picsum Photos
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400 leading-relaxed text-center">Atau pilih gambar dari daftar Media Library di bawah.</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Cari media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                />
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <FileImage className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Belum ada media. Upload gambar atau generate dari Picsum.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredItems.map((asset) => {
                    const src = mediaUrl(asset.url);
                    const isBroken = brokenImageIds[asset.id];
                    const isSelected = manualUrl === asset.url || manualUrl === src;
                    return (
                      <button
                        type="button"
                        key={asset.id}
                        onClick={() => applyUrl(src)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                          isSelected ? "border-[#649FF6] ring-2 ring-[#649FF6]/30" : "border-slate-200 hover:border-[#649FF6]/50"
                        }`}
                      >
                        {isBroken ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                            <FileImage className="h-6 w-6" />
                          </div>
                        ) : (
                          <img
                            src={src}
                            alt={asset.altText || asset.originalName}
                            className="w-full h-full object-cover"
                            onError={() => setBrokenImageIds((current) => ({ ...current, [asset.id]: true }))}
                          />
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-[#649FF6] text-white flex items-center justify-center shadow">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
