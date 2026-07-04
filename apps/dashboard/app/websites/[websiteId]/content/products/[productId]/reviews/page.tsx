"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import MediaPickerInput from "@/components/ui/MediaPickerInput";
import { AlertCircle, CheckCircle, Edit2, MessageSquareText, Plus, Save, Star, Trash2, X } from "lucide-react";

type ReviewItem = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  avatarUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
};

type ProductSummary = {
  id: string;
  title: string;
};

const emptyForm = {
  customerName: "",
  rating: 5,
  comment: "",
  avatarUrl: "",
  sortOrder: 0,
  isActive: true
};

function StarRatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5"
          title={`${star} bintang`}
        >
          <Star className={`h-6 w-6 transition ${star <= value ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
        </button>
      ))}
    </div>
  );
}

function StarRatingDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-3.5 w-3.5 ${star <= value ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

export default function ProductReviewsPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const productId = params?.productId as string;

  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ReviewItem | null>(null);
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
      const [productRes, reviewsRes] = await Promise.all([
        apiCall<ProductSummary>("GET", `websites/${websiteId}/products/${productId}`),
        apiCall<ReviewItem[]>("GET", `websites/${websiteId}/products/${productId}/reviews`)
      ]);
      setProduct(productRes.data || null);
      setItems((reviewsRes.data || []).slice().sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat data review.");
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

  const openEdit = (item: ReviewItem) => {
    setEditingItem(item);
    setFormData({
      customerName: item.customerName || "",
      rating: item.rating ?? 5,
      comment: item.comment || "",
      avatarUrl: item.avatarUrl || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.customerName.trim()) {
      setErrorMsg("Nama pelanggan wajib diisi.");
      return;
    }
    if (!formData.comment.trim()) {
      setErrorMsg("Isi review wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        customerName: formData.customerName,
        rating: Number(formData.rating) || 5,
        comment: formData.comment,
        avatarUrl: formData.avatarUrl || null,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive
      };

      if (editingItem) {
        await apiCall("PATCH", `websites/${websiteId}/products/${productId}/reviews/${editingItem.id}`, payload);
        showSuccess("Review berhasil diperbarui.");
      } else {
        await apiCall("POST", `websites/${websiteId}/products/${productId}/reviews`, payload);
        showSuccess("Review baru berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menyimpan review.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/products/${productId}/reviews/${deletingItem.id}`);
      setDeletingItem(null);
      showSuccess("Review berhasil dihapus.");
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menghapus review.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title={`Review Produk${product ? `: ${product.title}` : ""}`}
      subtitle="Kelola ulasan pelanggan yang tampil di halaman detail produk."
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
            {items.length} review terdaftar. Review dengan status Aktif akan tampil di halaman publik.
          </p>
          <button onClick={openAdd} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition">
            <Plus className="h-4 w-4" />
            Tambah Review
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => <div key={item} className="bg-white rounded-3xl border border-slate-200 h-32 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <MessageSquareText className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Review</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Tambahkan ulasan pelanggan untuk memperkuat kepercayaan calon pembeli terhadap produk ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.customerName} className="h-10 w-10 rounded-full object-cover border border-slate-100" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm">
                        {item.customerName?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.customerName}</h4>
                      <StarRatingDisplay value={item.rating} />
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${item.isActive ? "bg-[#649FF6]/10 text-[#4f8be6] border-[#649FF6]/20" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">{item.comment}</p>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => openEdit(item)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition" title="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">{editingItem ? "Edit Review" : "Tambah Review"}</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Pelanggan</label>
                  <input
                    placeholder="Contoh: Budi Santoso"
                    value={formData.customerName}
                    onChange={(event) => setFormData({ ...formData, customerName: event.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Rating</label>
                  <StarRatingInput value={formData.rating} onChange={(value) => setFormData({ ...formData, rating: value })} />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Isi Review</label>
                  <textarea
                    rows={4}
                    placeholder="Barangnya bagus, pengiriman cepat..."
                    value={formData.comment}
                    onChange={(event) => setFormData({ ...formData, comment: event.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <MediaPickerInput
                    id="review-avatar"
                    label="Foto Pelanggan (Opsional)"
                    value={formData.avatarUrl}
                    onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                    picsumSeedPrefix="review-avatar"
                    picsumSize={{ width: 200, height: 200 }}
                    aspect="square"
                    helperText="Kosongkan untuk pakai inisial nama sebagai avatar."
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
                <BooleanRadio id="review-is-active" label="Status" value={formData.isActive} onChange={(value) => setFormData({ ...formData, isActive: value })} />
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Menyimpan..." : "Simpan Review"}</span>
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
              <p className="text-xs text-slate-500 leading-relaxed">Hapus review dari <strong>{deletingItem.customerName}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
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
