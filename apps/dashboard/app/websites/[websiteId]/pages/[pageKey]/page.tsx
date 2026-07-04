"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Eye, 
  EyeOff, 
  LayoutTemplate, 
  Edit3, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  Clock,
  ArrowLeft,
  Sparkles
} from "lucide-react";

interface Section {
  slotKey: string;
  slotLabel: string;
  slotDescription: string;
  isVisible: boolean;
  hasTemplate: boolean;
  hasContent: boolean;
  isAutoManaged?: boolean;
  autoManagedSource?: string | null;
  templateSection: {
    id: string;
    name: string;
  } | null;
}

interface PageDetail {
  pageKey: string;
  title: string;
  slug: string;
  pageLabel?: string;
  isDynamicDetailPage?: boolean;
  sections: Section[];
}

// Halaman dinamis sekarang bisa lebih dari satu jenis (article_detail untuk
// artikel, product_detail untuk produk di website Katalog Produk).
const dynamicDetailNoun = (pageKey: string) => {
  if (pageKey === "article_detail") return "artikel";
  if (pageKey === "product_detail") return "produk";
  return "konten";
};

export default function PageSectionsPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const pageKey = params?.pageKey as string;

  const [sections, setSections] = useState<Section[]>([]);
  const [pageDetail, setPageDetail] = useState<PageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const currentPageLabel = pageDetail?.pageLabel ? `Halaman ${pageDetail.pageLabel}` : `Halaman ${pageKey}`;

  const fetchSections = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<PageDetail>("GET", `websites/${websiteId}/pages/${pageKey}`);
      setPageDetail(res.data || null);
      setSections(res.data?.sections || []);
    } catch (err: any) {
      console.error("Fetch sections error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat bagian halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId && pageKey) {
      Promise.resolve().then(() => {
        fetchSections();
      });
    }
  }, [websiteId, pageKey]);


  const handleToggleVisibility = async (slotKey: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    const targetSec = sections.find(s => s.slotKey === slotKey);
    if (!targetSec) return;
    const nextVisible = !targetSec.isVisible;
    try {
      const res = await apiCall<any>("PATCH", `websites/${websiteId}/sections/${slotKey}/visibility`, {
        isVisible: nextVisible
      });
      const updatedVisible = typeof res.data?.isVisible === "boolean" ? res.data.isVisible : nextVisible;
      
      // Update local state visible value
      setSections(prev => prev.map(sec => 
        sec.slotKey === slotKey 
          ? { ...sec, isVisible: updatedVisible } 
          : sec
      ));
      
      setSuccessMsg(res.message || "Pengaturan keterlihatan bagian berhasil diperbarui.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Toggle visibility error:", err);
      setErrorMsg(err.error?.message || "Gagal memperbarui keterlihatan bagian website.");
    }
  };

  return (
    <DashboardLayout 
      title={currentPageLabel} 
      subtitle="Kelola susunan, tampilan, dan isi konten untuk halaman ini"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/pages`}
    >
      <div className="space-y-6" id="sections-container">
        
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dynamic Section Builder Tip */}
        {pageDetail?.isDynamicDetailPage && (
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-sky-800 text-sm flex items-start space-x-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-sky-600 mt-0.5" />
            <span>Halaman ini mengatur tampilan detail {dynamicDetailNoun(pageDetail?.pageKey || "")}, bukan {dynamicDetailNoun(pageDetail?.pageKey || "")} tertentu.</span>
          </div>
        )}

        {/* Dynamic Section Builder Tip */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base">Alur Pengisian Bagian Website</h3>
            <p className="text-xs text-slate-400 leading-normal max-w-xl">
              1. Klik <strong>Pilih Tampilan</strong> untuk memilih visual section yang Anda sukai.<br/>
              2. Klik <strong>Isi Konten</strong> untuk menulis teks, tautan tombol, dan gambar sesuai bisnis Anda.<br/>
              3. Gunakan ikon mata untuk menyembunyikan sementara bagian tersebut jika belum siap dipublikasikan.
            </p>
          </div>
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4" id="sections-loading-list">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-36 animate-pulse" />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <LayoutTemplate className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">Tidak Ada Bagian</h3>
            <p className="text-sm text-slate-500">Belum ada rancangan bagian website untuk halaman ini.</p>
          </div>
        ) : (
          <div className="space-y-6" id="sections-list">
            {sections.map((sec, idx) => (
              <div 
                key={sec.slotKey}
                className={`bg-white rounded-3xl border shadow-sm p-6 relative flex flex-col justify-between transition-all ${
                  sec.isVisible 
                    ? "border-slate-200 hover:border-slate-300" 
                    : "border-slate-200 bg-slate-50/70 opacity-70"
                }`}
                id={`section-item-${sec.slotKey}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200">
                        BAGIAN {idx + 1}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">
                        {sec.slotLabel}
                      </h3>
                      {!sec.isVisible && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full border border-rose-100">
                          <EyeOff className="h-3 w-3 shrink-0" />
                          <span>Disembunyikan</span>
                        </span>
                      )}
                      {sec.isAutoManaged && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#649FF6]/10 text-[#3f6fae] text-[10px] font-bold rounded-full border border-[#649FF6]/20">
                          <Sparkles className="h-3 w-3 shrink-0" />
                          <span>Otomatis dari Profil Bisnis</span>
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-normal max-w-2xl">
                      {sec.slotDescription}
                    </p>

                    {/* Status Mapped badges */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3">
                      {sec.hasTemplate ? (
                        <span className="inline-flex items-center space-x-1 text-xs text-slate-700 font-semibold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>Tampilan: <strong className="text-emerald-800 font-bold">{sec.templateSection?.name}</strong></span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-xs text-slate-500 font-medium bg-amber-50 px-3 py-1 rounded-xl border border-amber-100/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>Tampilan: <strong className="text-amber-800 font-bold">Belum dipilih</strong></span>
                        </span>
                      )}

                      {sec.hasTemplate && !sec.isAutoManaged && (
                        sec.hasContent ? (
                          <span className="inline-flex items-center space-x-1 text-xs text-slate-700 font-semibold bg-blue-50 px-3 py-1 rounded-xl border border-blue-100/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>Konten: <strong className="text-blue-800 font-bold">Sudah terisi</strong></span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs text-slate-500 font-medium bg-amber-50 px-3 py-1 rounded-xl border border-amber-100/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>Konten: <strong className="text-amber-800 font-bold">Belum diisi</strong></span>
                          </span>
                        )
                      )}

                      {sec.hasTemplate && sec.isAutoManaged && (
                        <span className="inline-flex items-center space-x-1 text-xs text-slate-700 font-semibold bg-[#649FF6]/10 px-3 py-1 rounded-xl border border-[#649FF6]/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#649FF6] shrink-0" />
                          <span>Konten: <strong className="text-[#3f6fae] font-bold">Otomatis (Isi Visi &amp; Misi di Profil Bisnis)</strong></span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                    <button
                      onClick={() => handleToggleVisibility(sec.slotKey)}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
                        sec.isVisible 
                          ? "bg-white hover:bg-slate-50 text-slate-500 border-slate-200" 
                          : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                      }`}
                      title={sec.isVisible ? "Sembunyikan bagian ini" : "Tampilkan bagian ini"}
                      aria-label={sec.isVisible ? "Sembunyikan bagian ini" : "Tampilkan bagian ini"}
                    >
                      {sec.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => router.push(`/websites/${websiteId}/sections/${sec.slotKey}/choose`)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition active:translate-y-[1px]"
                  >
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    <span>{sec.hasTemplate ? "Ganti Tampilan" : "Pilih Tampilan"}</span>
                  </button>

                  <button
                    onClick={() =>
                      sec.isAutoManaged
                        ? router.push(`/websites/${websiteId}/profile`)
                        : router.push(`/websites/${websiteId}/sections/${sec.slotKey}/edit`)
                    }
                    disabled={!sec.hasTemplate}
                    className={`flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 text-xs font-bold rounded-xl shadow-sm transition active:translate-y-[1px] ${
                      sec.hasTemplate
                        ? "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                        : "bg-slate-100 text-slate-400 border border-slate-100 cursor-not-allowed"
                    }`}
                  >
                    {sec.isAutoManaged ? <Sparkles className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                    <span>{sec.isAutoManaged ? "Kelola di Profil Bisnis" : "Isi Konten"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
