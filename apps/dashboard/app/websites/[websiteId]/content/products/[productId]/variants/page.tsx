"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import { AlertCircle, CheckCircle, Edit2, Palette, Plus, Save, Trash2, X } from "lucide-react";

type VariantItem = {
  id: string;
  name: string;
  sku?: string | null;
  priceOverride?: number | null;
  stock: number;
  sortOrder: number;
  isActive: boolean;
};

type ProductSummary = {
  id: string;
  title: string;
};

const emptyForm = {
  name: "",
  sku: "",
  priceOverride: "" as number | "",
  stock: 0,
  sortOrder: 0,
  isActive: true
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

export default function ProductVariantsPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params?.websiteId as string;
  const productId = params?.productId as string;

  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [items, setItems] = useState<VariantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VariantItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<VariantItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showSuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [productRes, variantsRes] = await Promise.all([
        apiCall<ProductSummary>("GET", `websites/${websiteId}/products/${productId}`),
        apiCall<VariantItem[]>("GET", `websites/${websiteId}/products/${productId}/variants`)
      ]);
      setProduct(productRes.data || null);
      setItems((variantsRes.data || []).slice().sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat data varian.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId && productId) fetchData();
  }, [websiteId, productId]);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ ...emptyForm, sortOrder: items.length });
    setIsFormOpen(true);
  };

  const openEdit = (item: VariantItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      sku: item.sku || "",
      priceOverride: item.priceOverride ?? "",
      stock: item.stock ?? 0,
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Nama varian wajib diisi (contoh: Merah - L).");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku || null,
        priceOverride: formData.priceOverride === "" ? null : Number(formData.priceOverride),
        stock: Number(formData.stock) || 0,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive
      };

      if (editingItem) {
        await apiCall("PATCH", `websites/${websiteId}/products/${productId}/variants/${editingItem.id}`, payload);
        showSuccess("Varian berhasil diperbarui.");
      } else {
        await apiCall("POST", `websites/${websiteId}/products/${productId}/variants`, payload);
        showSuccess("Varian baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menyimpan varian.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/products/${productId}/variants/${deletingItem.id}`);
      setDeletingItem(null);
      showSuccess("Varian berhasil dihapus.");
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menghapus varian.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title={`Varian Produk${product ? `: ${product.title}` : ""}`}
      subtitle="Atur pilihan warna, ukuran, stok, dan harga khusus per varian."
      showBackButton
      backUrl={`/websites/${websiteId}/content/products/${productId}/edit`}
    >
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

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500">
            {items.length} varian terdaftar. Kalau produk tidak punya pilihan warna/ukuran, halaman ini boleh dikosongkan.
          </p>
          <button onClick={openAdd} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition">
            <Plus className="h-4 w-4" />
            Tambah Varian
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => <div key={item} className="bg-white rounded-3xl border border-slate-200 h-24 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <Palette className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Varian</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Tambahkan varian seperti "Merah - S", "Merah - M", "Biru - L" lengkap dengan stok masing-masing.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Nama Varian</th>
                  <th className="text-left px-5 py-3 font-bold">SKU</th>
                  <th className="text-left px-5 py-3 font-bold">Harga Khusus</th>
                  <th className="text-left px-5 py-3 font-bold">Stok</th>
                  <th className="text-left px-5 py-3 font-bold">Status</th>
                  <th className="text-right px-5 py-3 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3 font-bold text-slate-800">{item.name}</td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">{item.sku || "-"}</td>
                    <td className="px-5 py-3 text-slate-600">{item.priceOverride ? formatRupiah(item.priceOverride) : <span className="text-slate-300">Ikut harga produk</span>}</td>
                    <td className="px-5 py-3 text-slate-600">{item.stock}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.isActive ? "bg-[#649FF6]/10 text-[#4f8be6] border-[#649FF6]/20" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-white rounded-xl transition" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl transition" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">{editingItem ? "Edit Varian" : "Tambah Varian"}</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Varian</label>
                  <input
                    placeholder="Contoh: Merah - L"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">SKU (Opsional)</label>
                    <input
                      value={formData.sku}
                      onChange={(event) => setFormData({ ...formData, sku: event.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Stok</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(event) => setFormData({ ...formData, stock: Number(event.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Harga Khusus Varian (Opsional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Kosongkan untuk ikut harga produk utama"
                    value={formData.priceOverride}
                    onChange={(event) => setFormData({ ...formData, priceOverride: event.target.value === "" ? "" : Number(event.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(event) => setFormData({ ...formData, sortOrder: Number(event.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                  />
                </div>
                <BooleanRadio id="variant-is-active" label="Status" value={formData.isActive} onChange={(value) => setFormData({ ...formData, isActive: value })} />
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Menyimpan..." : "Simpan Varian"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Hapus varian <strong>{deletingItem.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/10">
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
