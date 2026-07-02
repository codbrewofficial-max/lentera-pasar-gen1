"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import RichTextEditor from "@/components/ui/RichTextEditor";
import MediaPickerInput from "@/components/ui/MediaPickerInput";
import {
  Save,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";

interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface PortfolioItem {
  id: string;
  categoryId?: string | null;
  category?: PortfolioCategory | null;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  sortOrder?: number;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isValidSlug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export default function PortfolioFormPage({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const portfolioId = params?.portfolioId as string | undefined;

  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    imageUrl: "",
    isActive: true,
    isFeatured: false,
    featuredOrder: 0
  });

  useEffect(() => {
    if (!websiteId) return;

    const load = async () => {
      try {
        const categoriesRes = await apiCall<PortfolioCategory[]>(
          "GET",
          `websites/${websiteId}/portfolio-categories`
        ).catch(() => ({ data: [] as PortfolioCategory[] }));
        setCategories(categoriesRes.data || []);

        if (mode === "edit" && portfolioId) {
          setLoading(true);
          const res = await apiCall<PortfolioItem>("GET", `websites/${websiteId}/portfolios/${portfolioId}`);
          const item = res.data;
          if (item) {
            setFormData({
              title: item.title || "",
              slug: item.slug || "",
              description: item.description || "",
              categoryId: item.categoryId || "",
              imageUrl: item.imageUrl || "",
              isActive: item.isActive ?? true,
              isFeatured: item.isFeatured ?? false,
              featuredOrder: item.featuredOrder ?? 0
            });
            setSortOrder(item.sortOrder ?? 0);
            setSlugTouched(true);
          }
        }
      } catch (err: any) {
        console.error("Load portfolio form error:", err);
        setErrorMsg(err.error?.message || "Gagal memuat data portfolio.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [websiteId, portfolioId, mode]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value)
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setFormData((prev) => ({ ...prev, slug: slugify(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.title.trim()) {
      setErrorMsg("Judul proyek wajib diisi.");
      return;
    }
    if (!formData.imageUrl.trim()) {
      setErrorMsg("URL gambar dokumentasi wajib diisi.");
      return;
    }
    if (!formData.slug.trim() || !isValidSlug(formData.slug)) {
      setErrorMsg("Slug wajib diisi dan hanya boleh huruf kecil, angka, dan tanda hubung (contoh: redesign-aplikasi-bank-abc).");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        categoryId: formData.categoryId || null,
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        imageUrl: formData.imageUrl,
        sortOrder,
        isFeatured: formData.isFeatured,
        featuredOrder: Number(formData.featuredOrder) || 0,
        isActive: formData.isActive
      };

      if (mode === "edit" && portfolioId) {
        await apiCall("PATCH", `websites/${websiteId}/portfolios/${portfolioId}`, payload);
      } else {
        await apiCall("POST", `websites/${websiteId}/portfolios`, payload);
      }

      setSuccessMsg(mode === "edit" ? "Portfolio berhasil diperbarui!" : "Portfolio baru berhasil ditambahkan!");
      setTimeout(() => {
        router.push(`/websites/${websiteId}/content/portfolio`);
      }, 700);
    } catch (err: any) {
      console.error("Save portfolio error:", err);
      const code = err?.error?.code;
      if (code === "PORTFOLIO_SLUG_EXISTS") {
        setErrorMsg("Slug ini sudah dipakai portfolio lain di website Anda. Silakan gunakan slug lain.");
      } else if (code === "VALIDATION_ERROR") {
        setErrorMsg("Slug hanya boleh huruf kecil, angka, dan tanda hubung (contoh: redesign-aplikasi-bank-abc), dan tidak boleh kosong.");
      } else {
        setErrorMsg(err.error?.message || "Gagal menyimpan portfolio.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title={mode === "edit" ? "Memuat Portfolio..." : "Tambah Portfolio"}
        showBackButton
        backUrl={`/websites/${websiteId}/content/portfolio`}
      >
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={mode === "edit" ? "Edit Item Portfolio" : "Tambah Item Portfolio Baru"}
      subtitle="Isi detail hasil kerja atau studi kasus proyek Anda"
      showBackButton
      backUrl={`/websites/${websiteId}/content/portfolio`}
    >
      <div className="space-y-6 max-w-3xl">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="port-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Nama / Judul Proyek <span className="text-rose-500">*</span>
            </label>
            <input
              id="port-title"
              type="text"
              required
              placeholder="Contoh: Redesign Aplikasi Mobile Bank ABC"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label htmlFor="port-slug" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Slug <span className="text-rose-500">*</span>
            </label>
            <input
              id="port-slug"
              type="text"
              required
              placeholder="redesign-aplikasi-mobile-bank-abc"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
            <p className="text-[10px] text-slate-400">
              Slug otomatis mengikuti judul. Hanya huruf kecil, angka, dan tanda hubung (-). Dipakai sebagai bagian URL halaman detail portfolio ini.
            </p>
          </div>

          {/* Category Selection */}
          <div className="space-y-1">
            <label htmlFor="port-cat" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Kategori Portfolio
            </label>
            <select
              id="port-cat"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            >
              <option value="">Tanpa kategori</option>
              {categories.filter((category) => category.isActive).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400">Kelola pilihan ini di menu Kategori Portfolio.</p>
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <MediaPickerInput
              id="port-image"
              label="URL Gambar Dokumentasi Kerja"
              required
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              picsumSeedPrefix="portfolio"
              picsumSize={{ width: 800, height: 600 }}
              aspect="video"
              helperText="Pilih dari Media Library, generate otomatis, atau tempel URL gambar dokumentasi kerja."
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="port-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Detail Pekerjaan / Studi Kasus <span className="text-rose-500">*</span>
            </label>
            <RichTextEditor
              id="port-desc"
              required
              minHeight={200}
              placeholder="Tuliskan latar belakang masalah klien, solusi yang Anda tawarkan, tantangan, dan bagaimana keberhasilan proyek ini dicapai..."
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              helperText="Tulis cerita singkat agar portfolio terasa lebih meyakinkan bagi calon client."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <BooleanRadio
              id="port-featured"
              label="Jadikan Portfolio Unggulan?"
              value={formData.isFeatured}
              onChange={(value) => setFormData({ ...formData, isFeatured: value })}
              description="Pilih Ya agar portfolio ini bisa muncul di Home. Home hanya mengambil 3 portfolio unggulan teratas."
            />
            {formData.isFeatured && (
              <div className="space-y-1">
                <label htmlFor="port-featured-order" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan Unggulan</label>
                <input
                  id="port-featured-order"
                  type="number"
                  min="0"
                  value={formData.featuredOrder}
                  onChange={(e) => setFormData({ ...formData, featuredOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                />
                <p className="text-[10px] text-slate-400">Angka kecil tampil lebih dulu. Untuk Home, sistem hanya mengambil maksimal 3 portfolio unggulan.</p>
              </div>
            )}
          </div>

          {/* Status Toggle */}
          <BooleanRadio
            id="port-active"
            label="Tampilkan Portfolio di Website?"
            value={formData.isActive}
            onChange={(value) => setFormData({ ...formData, isActive: value })}
            description="Pilih Ya jika portfolio ini boleh tampil di halaman publik."
          />

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/websites/${websiteId}/content/portfolio`)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="h-4 w-4" />
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? (mode === "edit" ? "Memperbarui..." : "Menyimpan...") : "Simpan Item"}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
