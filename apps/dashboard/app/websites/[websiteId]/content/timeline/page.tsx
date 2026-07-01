"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import BooleanRadio from "@/components/ui/BooleanRadio";
import {
  CalendarDays, Plus, Edit2, Trash2,
  AlertCircle, CheckCircle, Save, X, PlusCircle
} from "lucide-react";

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function TimelineCrudPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    sortOrder: 0,
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [deletingItem, setDeletingItem] = useState<TimelineItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<TimelineItem[]>("GET", `websites/${websiteId}/timelines`);
      setItems(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal memuat data perjalanan bisnis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) fetchItems();
  }, [websiteId]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ year: String(new Date().getFullYear()), title: "", description: "", sortOrder: items.length, isActive: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description || "",
      sortOrder: item.sortOrder,
      isActive: item.isActive
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.year || !formData.title) {
      setErrorMsg("Tahun dan judul wajib diisi.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        year: formData.year,
        title: formData.title,
        description: formData.description || null,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive
      };
      if (editingItem) {
        await apiCall("PATCH", `websites/${websiteId}/timelines/${editingItem.id}`, payload);
        showSuccess("Perjalanan bisnis berhasil diperbarui!");
      } else {
        await apiCall("POST", `websites/${websiteId}/timelines`, payload);
        showSuccess("Perjalanan bisnis berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      await apiCall("DELETE", `websites/${websiteId}/timelines/${deletingItem.id}`);
      showSuccess("Item berhasil dihapus!");
      setDeletingItem(null);
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal menghapus item.");
    } finally {
      setDeleting(false);
    }
  };

  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <DashboardLayout
      title="Perjalanan Bisnis"
      subtitle="Tampilkan tonggak perkembangan penting bisnis Anda secara kronologis"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
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

        {/* Info banner */}
        <div className="rounded-3xl border border-[#649FF6]/25 bg-[#649FF6]/10 p-4 sm:p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#3f6fae]">Catatan</p>
          <p className="mt-1 text-sm font-black text-slate-900">Ditampilkan di halaman About — section Perjalanan Bisnis.</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Urutkan berdasarkan tahun (angka sortOrder kecil tampil lebih dulu). Maksimal 3–5 item disarankan agar tampilan rapi.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex justify-end bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Milestone</span>
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent mx-auto" />
            <p className="mt-3 text-xs text-slate-500">Memuat data...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Perjalanan Bisnis</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Tambahkan tonggak penting seperti tahun berdiri, pencapaian, atau transformasi bisnis.</p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-[#649FF6]/10 text-[#3f6fae] text-xs font-bold rounded-xl transition hover:bg-[#649FF6]/15"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Tambah Milestone Pertama</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-5 flex items-start gap-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex-none text-2xl font-black text-[#649FF6] w-16 text-center pt-1">{item.year}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.isActive ? "bg-[#649FF6]/10 text-[#4f8be6]" : "bg-slate-100 text-slate-500"}`}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                  <p className="mt-1 text-[10px] text-slate-400">Urutan: {item.sortOrder}</p>
                </div>
                <div className="flex gap-1 flex-none">
                  <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition" title="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">
                  {editingItem ? "Edit Milestone" : "Tambah Milestone Baru"}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Tahun <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2024"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan Tampil</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Judul Milestone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fondasi Awal, Ekspansi Layanan"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Deskripsi Singkat</label>
                  <EnhancedTextarea
                    id="timeline-description"
                    minRows={3}
                    placeholder="Jelaskan pencapaian atau momen penting di tahun ini..."
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    helperText="Opsional. Singkat dan padat, 1–2 kalimat cukup."
                  />
                </div>

                <BooleanRadio
                  id="timeline-active"
                  label="Tampilkan di Website?"
                  value={formData.isActive}
                  onChange={(value) => setFormData({ ...formData, isActive: value })}
                  description="Pilih Ya agar milestone ini tampil di halaman About."
                />

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">
                    Batal
                  </button>
                  <button type="submit" disabled={saving} className="inline-flex items-center space-x-1 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Menyimpan..." : "Simpan"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hapus milestone <strong>{deletingItem.year} — {deletingItem.title}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setDeletingItem(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition">
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
