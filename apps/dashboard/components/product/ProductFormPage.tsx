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
  X,
  Plus,
  Trash2,
  Star,
  Image as ImageIcon,
  Palette,
  MessageSquareText,
  ArrowRight,
  Lock
} from "lucide-react";

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductItem {
  id: string;
  categoryId?: string | null;
  category?: ProductCategory | null;
  title: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  isFeatured?: boolean;
  featuredOrder?: number;
  isNewArrival?: boolean;
  isActive: boolean;
  sortOrder?: number;
  images?: ProductImage[];
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

export default function ProductFormPage({ mode }: { mode: "create" | "edit" }) {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const routeProductId = params?.productId as string | undefined;

  // productId internal dipakai supaya begitu produk baru berhasil dibuat, halaman
  // langsung "berubah" ke mode edit tanpa reload, dan galeri gambar bisa langsung aktif.
  const [productId, setProductId] = useState<string | undefined>(routeProductId);
  const isEditing = Boolean(productId);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    sku: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    price: 0,
    compareAtPrice: "" as number | "",
    ctaLabel: "",
    ctaUrl: "",
    isActive: true,
    isFeatured: false,
    featuredOrder: 0,
    isNewArrival: false
  });

  // --- Galeri Gambar (hanya aktif setelah produk punya productId) ---
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [addingImage, setAddingImage] = useState(false);
  const [imageActionId, setImageActionId] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const loadImages = async (pid: string) => {
    setLoadingImages(true);
    try {
      const res = await apiCall<ProductImage[]>("GET", `websites/${websiteId}/products/${pid}/images`);
      setImages((res.data || []).slice().sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err: any) {
      console.error("Load product images error:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (!websiteId) return;

    const load = async () => {
      try {
        const categoriesRes = await apiCall<ProductCategory[]>(
          "GET",
          `websites/${websiteId}/product-categories`
        ).catch(() => ({ data: [] as ProductCategory[] }));
        setCategories(categoriesRes.data || []);

        if (mode === "edit" && routeProductId) {
          setLoading(true);
          const res = await apiCall<ProductItem>("GET", `websites/${websiteId}/products/${routeProductId}`);
          const item = res.data;
          if (item) {
            setFormData({
              title: item.title || "",
              slug: item.slug || "",
              sku: item.sku || "",
              categoryId: item.categoryId || "",
              shortDescription: item.shortDescription || "",
              description: item.description || "",
              price: item.price || 0,
              compareAtPrice: item.compareAtPrice ?? "",
              ctaLabel: item.ctaLabel || "",
              ctaUrl: item.ctaUrl || "",
              isActive: item.isActive ?? true,
              isFeatured: item.isFeatured ?? false,
              featuredOrder: item.featuredOrder ?? 0,
              isNewArrival: item.isNewArrival ?? false
            });
            setSortOrder(item.sortOrder ?? 0);
            setSlugTouched(true);
            setImages((item.images || []).slice().sort((a, b) => a.sortOrder - b.sortOrder));
          }
        }
      } catch (err: any) {
        console.error("Load product form error:", err);
        setErrorMsg(err.error?.message || "Gagal memuat data produk.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [websiteId, routeProductId, mode]);

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
      setErrorMsg("Nama produk wajib diisi.");
      return;
    }
    if (!formData.slug.trim() || !isValidSlug(formData.slug)) {
      setErrorMsg("Slug wajib diisi dan hanya boleh huruf kecil, angka, dan tanda hubung (contoh: kaos-polos-hitam).");
      return;
    }
    if (!formData.price || Number(formData.price) < 0) {
      setErrorMsg("Harga wajib diisi dan tidak boleh negatif.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        categoryId: formData.categoryId || null,
        title: formData.title,
        slug: formData.slug,
        sku: formData.sku || null,
        shortDescription: formData.shortDescription || null,
        description: formData.description || null,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice === "" ? null : Number(formData.compareAtPrice),
        ctaLabel: formData.ctaLabel || null,
        ctaUrl: formData.ctaUrl || null,
        sortOrder,
        isFeatured: formData.isFeatured,
        featuredOrder: Number(formData.featuredOrder) || 0,
        isNewArrival: formData.isNewArrival,
        isActive: formData.isActive
      };

      if (isEditing && productId) {
        await apiCall("PATCH", `websites/${websiteId}/products/${productId}`, payload);
        showSuccess("Produk berhasil diperbarui!");
      } else {
        const res = await apiCall<ProductItem>("POST", `websites/${websiteId}/products`, payload);
        showSuccess("Produk baru berhasil ditambahkan! Sekarang Anda bisa menambahkan gambar produk.");
        if (res.data?.id) {
          setProductId(res.data.id);
          // Pindah ke URL edit tanpa reload penuh, supaya galeri gambar langsung aktif
          // dan tombol Kelola Varian/Review muncul.
          router.replace(`/websites/${websiteId}/content/products/${res.data.id}/edit`);
          return;
        }
      }
    } catch (err: any) {
      console.error("Save product error:", err);
      const code = err?.error?.code;
      if (code === "PRODUCT_SLUG_EXISTS") {
        setErrorMsg("Slug ini sudah dipakai produk lain di website Anda. Silakan gunakan slug lain.");
      } else if (code === "VALIDATION_ERROR") {
        setErrorMsg("Ada input yang belum valid. Cek kembali slug dan harga.");
      } else {
        setErrorMsg(err.error?.message || "Gagal menyimpan produk.");
      }
    } finally {
      setSaving(false);
    }
  };

  // --- Handler Galeri Gambar ---
  const handleAddImage = async () => {
    if (!productId || !newImageUrl.trim()) return;
    setAddingImage(true);
    setErrorMsg("");
    try {
      const res = await apiCall<ProductImage>("POST", `websites/${websiteId}/products/${productId}/images`, {
        url: newImageUrl.trim(),
        altText: newImageAlt.trim() || null,
        isPrimary: images.length === 0,
        sortOrder: images.length
      });
      if (res.data) {
        setImages((prev) => [...prev, res.data]);
      }
      setNewImageUrl("");
      setNewImageAlt("");
      showSuccess("Gambar berhasil ditambahkan.");
    } catch (err: any) {
      console.error("Add product image error:", err);
      setErrorMsg(err.error?.message || "Gagal menambahkan gambar.");
    } finally {
      setAddingImage(false);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!productId) return;
    setImageActionId(imageId);
    setErrorMsg("");
    try {
      const previousPrimary = images.find((img) => img.isPrimary && img.id !== imageId);
      await apiCall("PATCH", `websites/${websiteId}/products/${productId}/images/${imageId}`, { isPrimary: true });
      if (previousPrimary) {
        await apiCall("PATCH", `websites/${websiteId}/products/${productId}/images/${previousPrimary.id}`, { isPrimary: false });
      }
      setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })));
    } catch (err: any) {
      console.error("Set primary image error:", err);
      setErrorMsg(err.error?.message || "Gagal menjadikan gambar utama.");
    } finally {
      setImageActionId(null);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!productId) return;
    setImageActionId(imageId);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/products/${productId}/images/${imageId}`);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      showSuccess("Gambar berhasil dihapus.");
    } catch (err: any) {
      console.error("Delete product image error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus gambar.");
    } finally {
      setImageActionId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title={isEditing ? "Memuat Produk..." : "Tambah Produk"}
        showBackButton
        backUrl={`/websites/${websiteId}/content/products`}
      >
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEditing ? "Edit Produk" : "Tambah Produk Baru"}
      subtitle="Isi detail produk yang akan dijual di website Anda"
      showBackButton
      backUrl={`/websites/${websiteId}/content/products`}
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
            <label htmlFor="prod-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Nama Produk <span className="text-rose-500">*</span>
            </label>
            <input
              id="prod-title"
              type="text"
              required
              placeholder="Contoh: Kaos Polos Premium Hitam"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
          </div>

          {/* Slug & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="prod-slug" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Slug <span className="text-rose-500">*</span>
              </label>
              <input
                id="prod-slug"
                type="text"
                required
                placeholder="kaos-polos-premium-hitam"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="prod-sku" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                SKU (Opsional)
              </label>
              <input
                id="prod-sku"
                type="text"
                placeholder="KPH-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="prod-cat" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Kategori Produk
            </label>
            <select
              id="prod-cat"
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
            <p className="text-[10px] text-slate-400">Kelola pilihan ini di menu Kategori Produk.</p>
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="prod-price" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                id="prod-price"
                type="number"
                min="0"
                required
                placeholder="150000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="prod-compare-price" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Harga Coret (Opsional)
              </label>
              <input
                id="prod-compare-price"
                type="number"
                min="0"
                placeholder="200000"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
              <p className="text-[10px] text-slate-400">Isi kalau produk sedang diskon, akan tampil dicoret di halaman publik.</p>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label htmlFor="prod-short-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Deskripsi Singkat
            </label>
            <input
              id="prod-short-desc"
              type="text"
              placeholder="Bahan katun combed 30s, nyaman dan adem"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
            <p className="text-[10px] text-slate-400">Tampil di kartu produk pada halaman daftar produk.</p>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="prod-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Deskripsi Lengkap
            </label>
            <RichTextEditor
              id="prod-desc"
              minHeight={180}
              placeholder="Jelaskan detail produk, bahan, ukuran, cara perawatan, dsb..."
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              helperText="Tampil di halaman detail produk."
            />
          </div>

          {/* CTA Override */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="space-y-1">
              <label htmlFor="prod-cta-label" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Label Tombol CTA (Opsional)
              </label>
              <input
                id="prod-cta-label"
                type="text"
                placeholder="Pesan via WhatsApp"
                value={formData.ctaLabel}
                onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="prod-cta-url" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Link Tombol CTA (Opsional)
              </label>
              <input
                id="prod-cta-url"
                type="text"
                placeholder="https://wa.me/62..."
                value={formData.ctaUrl}
                onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
              />
              <p className="text-[10px] text-slate-400 sm:col-span-2">Kosongkan untuk pakai WhatsApp default dari Profil Bisnis.</p>
            </div>
          </div>

          {/* Featured / New Arrival */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <BooleanRadio
              id="prod-featured"
              label="Jadikan Produk Unggulan?"
              value={formData.isFeatured}
              onChange={(value) => setFormData({ ...formData, isFeatured: value })}
              description="Tampil di section Produk Unggulan/Best Seller di Home."
            />
            {formData.isFeatured && (
              <div className="space-y-1">
                <label htmlFor="prod-featured-order" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan Unggulan</label>
                <input
                  id="prod-featured-order"
                  type="number"
                  min="0"
                  value={formData.featuredOrder}
                  onChange={(e) => setFormData({ ...formData, featuredOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                />
                <p className="text-[10px] text-slate-400">Angka kecil tampil lebih dulu.</p>
              </div>
            )}
            <BooleanRadio
              id="prod-new-arrival"
              label="Tandai sebagai Produk Baru?"
              value={formData.isNewArrival}
              onChange={(value) => setFormData({ ...formData, isNewArrival: value })}
              description="Tampil di section Produk Terbaru di Home."
            />
          </div>

          {/* Status Toggle */}
          <BooleanRadio
            id="prod-active"
            label="Tampilkan Produk di Website?"
            value={formData.isActive}
            onChange={(value) => setFormData({ ...formData, isActive: value })}
            description="Pilih Ya jika produk ini boleh tampil di halaman publik."
          />

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/websites/${websiteId}/content/products`)}
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
              <span>{saving ? (isEditing ? "Memperbarui..." : "Menyimpan...") : isEditing ? "Simpan Perubahan" : "Simpan & Lanjut Tambah Gambar"}</span>
            </button>
          </div>
        </form>

        {/* Galeri Gambar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[#649FF6]" />
            <h3 className="font-bold text-slate-900 text-sm">Galeri Gambar Produk</h3>
          </div>

          {!isEditing ? (
            <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center flex flex-col items-center gap-2">
              <Lock className="h-5 w-5 text-slate-300" />
              <p className="text-xs text-slate-500 max-w-sm">
                Simpan produk terlebih dahulu (tombol di atas) untuk mulai menambahkan gambar.
              </p>
            </div>
          ) : (
            <>
              {loadingImages ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative rounded-2xl border border-slate-200 overflow-hidden group">
                      <img src={img.url} alt={img.altText || ""} className="w-full h-28 object-cover" />
                      {img.isPrimary && (
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-amber-900 shadow-sm">
                          <Star className="h-2.5 w-2.5 fill-current" /> Utama
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 backdrop-blur-sm p-1.5 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.id)}
                            disabled={imageActionId === img.id}
                            title="Jadikan gambar utama"
                            className="p-1 text-white hover:text-amber-300 transition"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          disabled={imageActionId === img.id}
                          title="Hapus gambar"
                          className="p-1 text-white hover:text-rose-300 transition ml-auto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                <p className="text-xs font-bold text-slate-600">Tambah Gambar Baru</p>
                <MediaPickerInput
                  id="prod-new-image"
                  value={newImageUrl}
                  onChange={setNewImageUrl}
                  picsumSeedPrefix="product"
                  picsumSize={{ width: 800, height: 800 }}
                  aspect="square"
                  helperText="Pilih dari Media Library, generate otomatis, atau tempel URL gambar produk."
                />
                <input
                  type="text"
                  placeholder="Teks alternatif gambar (opsional)"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={addingImage || !newImageUrl.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>{addingImage ? "Menambahkan..." : "Tambah Gambar"}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Link ke Varian & Review */}
        {isEditing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => router.push(`/websites/${websiteId}/content/products/${productId}/variants`)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-3 hover:border-[#649FF6]/40 hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#649FF6]/10 text-[#3f6fae] flex items-center justify-center">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Kelola Varian</p>
                  <p className="text-[11px] text-slate-500">Warna, ukuran, stok per varian</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300" />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/websites/${websiteId}/content/products/${productId}/reviews`)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-3 hover:border-[#649FF6]/40 hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#649FF6]/10 text-[#3f6fae] flex items-center justify-center">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Kelola Review</p>
                  <p className="text-[11px] text-slate-500">Ulasan pelanggan untuk produk ini</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300" />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
