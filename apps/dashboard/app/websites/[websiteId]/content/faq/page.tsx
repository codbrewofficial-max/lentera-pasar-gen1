"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import { AlertCircle, CheckCircle, Edit2, HelpCircle, Plus, Save, Search, Trash2, X } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  pageKey?: string | null;
  pageLabel?: string | null;
  sortOrder?: number;
  isActive: boolean;
};

const pageOptions = [
  { value: "", label: "Umum" },
  { value: "services", label: "Layanan" },
  { value: "contact", label: "Kontak" },
  { value: "about", label: "Profil" },
  { value: "articles", label: "Artikel" }
];

const emptyForm = {
  question: "",
  answer: "",
  pageKey: "",
  sortOrder: 0,
  isActive: true
};

export default function FaqCrudPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FaqItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<FaqItem[]>("GET", `websites/${websiteId}/faqs`);
      setItems(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat FAQ.");
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

  const openAdd = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question || "",
      answer: item.answer || "",
      pageKey: item.pageKey || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.question || !formData.answer) {
      setErrorMsg("Pertanyaan dan jawaban FAQ wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        pageKey: formData.pageKey || null,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive
      };

      if (editingItem) {
        await apiCall("PATCH", `websites/${websiteId}/faqs/${editingItem.id}`, payload);
        showSuccess("FAQ berhasil diperbarui.");
      } else {
        await apiCall("POST", `websites/${websiteId}/faqs`, payload);
        showSuccess("FAQ berhasil ditambahkan.");
      }

      setIsFormOpen(false);
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menyimpan FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/faqs/${deletingItem.id}`);
      setDeletingItem(null);
      showSuccess("FAQ berhasil dihapus.");
      fetchItems();
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal menghapus FAQ.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = items.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="FAQ" subtitle="Kelola pertanyaan umum untuk halaman layanan dan kontak" showBackButton backUrl={`/websites/${websiteId}/overview`}>
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
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input type="text" placeholder="Cari FAQ..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]" />
          </div>
          <button onClick={openAdd} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md transition">
            <Plus className="h-4 w-4" />
            Tambah FAQ
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => <div key={item} className="bg-white rounded-3xl border border-slate-200 h-36 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Belum Ada FAQ</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">Tambahkan FAQ agar calon client bisa mendapat jawaban cepat sebelum menghubungi bisnis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.question}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{item.pageLabel || "Umum"}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.isActive ? "bg-[#649FF6]/10 text-[#4f8be6] border-[#649FF6]/20" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 whitespace-pre-line">{item.answer}</p>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => openEdit(item)} className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-slate-50 rounded-xl transition" title="Edit FAQ">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeletingItem(item)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition" title="Hapus FAQ">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">{editingItem ? "Edit FAQ" : "Tambah FAQ"}</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Pertanyaan</label>
                  <input value={formData.question} onChange={(event) => setFormData({ ...formData, question: event.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Jawaban</label>
                  <EnhancedTextarea id="faq-answer" required minRows={5} value={formData.answer} onChange={(value) => setFormData({ ...formData, answer: value })} helperText="Gunakan jawaban ringkas dan jelas. Line break akan tetap dibaca di public renderer." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Konteks Halaman</label>
                    <select value={formData.pageKey} onChange={(event) => setFormData({ ...formData, pageKey: event.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]">
                      {pageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan</label>
                    <input type="number" value={formData.sortOrder} onChange={(event) => setFormData({ ...formData, sortOrder: Number(event.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6]" />
                  </div>
                  <BooleanRadio id="faq-is-active" label="Status" value={formData.isActive} onChange={(value) => setFormData({ ...formData, isActive: value })} />
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Batal</button>
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md transition">
                    <Save className="h-4 w-4" />
                    {saving ? "Menyimpan..." : "Simpan FAQ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Hapus FAQ <strong>{deletingItem.question}</strong>?</p>
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
