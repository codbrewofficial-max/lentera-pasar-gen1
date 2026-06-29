"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import {
  MessageSquare,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  PlusCircle,
  Star,
  Quote,
  Building
} from "lucide-react";

interface TestimonialItem {
  id: string | number;
  name: string;
  role: string;
  company?: string;
  avatarUrl?: string;
  rating: number;
  quote: string;
  isActive: boolean;
  sortOrder?: number;
}

export default function TestimonialCrudPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    avatarUrl: "",
    rating: 5,
    quote: "",
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<TestimonialItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<TestimonialItem[]>("GET", `websites/${websiteId}/testimonials`);
      setItems(res.data || []);
    } catch (err: any) {
      console.error("Fetch testimonials error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat testimoni pelanggan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      Promise.resolve().then(() => {
        fetchItems();
      });
    }
  }, [websiteId]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      avatarUrl: "",
      rating: 5,
      quote: "",
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company || "",
      avatarUrl: item.avatarUrl || "",
      rating: item.rating ?? 5,
      quote: item.quote,
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.quote) {
      setErrorMsg("Nama, jabatan/status, dan isi ulasan wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        name: formData.name,
        role: formData.role,
        company: formData.company,
        quote: formData.quote,
        avatarUrl: formData.avatarUrl,
        sortOrder: editingItem?.sortOrder ?? 0,
        isActive: formData.isActive
      };

      if (editingItem) {
        // Edit mode
        await apiCall("PATCH", `websites/${websiteId}/testimonials/${editingItem.id}`, payload);
        showSuccess("Testimoni berhasil diperbarui!");
      } else {
        // Add mode
        await apiCall("POST", `websites/${websiteId}/testimonials`, payload);
        showSuccess("Testimoni baru berhasil disimpan!");
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      console.error("Save testimonial error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan testimoni.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/testimonials/${deletingItem.id}`);
      showSuccess("Testimoni berhasil dihapus!");
      setDeletingItem(null);
      fetchItems();
    } catch (err: any) {
      console.error("Delete testimonial error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus testimoni.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.quote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Kelola Testimoni"
      subtitle="Publikasikan kesan positif, testimoni kepuasan, atau ulasan nyata pelanggan Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="testimonials-crud-root">
        {/* Alerts */}
        {successMsg && (
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari testimoni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition active:translate-y-[1px]"
            id="btn-add-testimonial"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Testimoni</span>
          </button>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat data testimoni...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Testimoni</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada testimoni pelanggan yang cocok dengan pencarian Anda."
                : "Ulasan dari pelanggan masih kosong. Tampilkan pembuktian kualitas sosial usaha Anda!"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#649FF6]/10 text-[#3f6fae] border border-emerald-100 hover:bg-[#649FF6]/15 text-xs font-bold rounded-xl transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Buat Testimoni Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="testimonials-grid-list">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all gap-4 relative overflow-hidden"
              >
                {/* Quote Decorative Icon */}
                <Quote className="absolute right-6 top-6 h-12 w-12 text-slate-50 opacity-[0.06] pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    {/* User Initials or Avatar */}
                    <div className="flex items-center space-x-3">
                      {item.avatarUrl ? (
                        <div className="h-11 w-11 rounded-full overflow-hidden border border-slate-200 bg-slate-50">
                          <img
                            src={item.avatarUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-[#649FF6]/15 text-[#3f6fae] flex items-center justify-center font-bold text-sm uppercase">
                          {item.name.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {item.role} {item.company ? `@ ${item.company}` : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.isActive
                          ? "bg-[#649FF6]/10 text-[#4f8be6] border border-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Draft"}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 fill-current ${
                          i < (item.rating ?? 5) ? "text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-line">
                    &quot;{item.quote}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition"
                    title="Edit Testimoni"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition"
                    title="Hapus Testimoni"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form Dialog */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="test-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Nama Pelanggan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="test-name"
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                    />
                  </div>

                  {/* Role / Job */}
                  <div className="space-y-1">
                    <label htmlFor="test-role" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Pekerjaan / Jabatan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="test-role"
                      type="text"
                      required
                      placeholder="Contoh: CEO, Ibu Rumah Tangga"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1">
                    <label htmlFor="test-comp" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Perusahaan / Instansi (Opsional)
                    </label>
                    <input
                      id="test-comp"
                      type="text"
                      placeholder="Contoh: PT Kreatif Nusantara"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-1">
                  <label htmlFor="test-avatar" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    URL Gambar Profil / Avatar (Opsional)
                  </label>
                  <input
                    id="test-avatar"
                    type="url"
                    placeholder="Contoh: https://i.pravatar.cc/150?img=12"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors font-mono"
                  />
                </div>

                {/* Rating selection (1-5) */}
                <div className="space-y-1">
                  <label htmlFor="test-rating" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Rating Bintang ({formData.rating} / 5)
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className="p-1 focus:outline-none text-amber-400"
                      >
                        <Star
                          className={`h-6 w-6 fill-current transition-colors ${
                            num <= formData.rating ? "text-amber-400" : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label htmlFor="test-review" className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Isi Review / Kalimat Testimoni <span className="text-rose-500">*</span>
                  </label>
                  <EnhancedTextarea
                    id="test-review"
                    required
                    minRows={4}
                    placeholder="Tuliskan pengalaman nyata pelanggan yang sangat mengesankan setelah menggunakan produk atau jasa Anda..."
                    value={formData.quote}
                    onChange={(value) => setFormData({ ...formData, quote: value })}
                    helperText="Testimoni yang spesifik biasanya lebih dipercaya daripada kalimat terlalu umum."
                  />
                </div>

                {/* Status Toggle */}
                <BooleanRadio
                  id="test-active"
                  label="Tampilkan Testimoni di Website?"
                  value={formData.isActive}
                  onChange={(value) => setFormData({ ...formData, isActive: value })}
                  description="Pilih Ya jika testimoni ini boleh tampil sebagai bukti kepercayaan."
                />

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? (editingItem ? "Memperbarui..." : "Menyimpan...") : "Simpan Testimoni"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Simple Dialog */}
        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus testimoni dari <strong>{deletingItem.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/10"
                >
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
