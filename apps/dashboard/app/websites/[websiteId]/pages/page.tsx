"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Layers, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

interface PageItem {
  id: string;
  pageKey: string;
  pageLabel: string;
  sectionCount: number;
  filledSectionCount: number;
  isDynamicDetailPage?: boolean;
  isActive: boolean;
}

interface WebsiteInfo {
  websiteType: string;
  websiteTypeLabel?: string;
}

// Halaman dinamis sekarang bisa lebih dari satu jenis (article_detail untuk
// artikel, product_detail untuk produk di website Katalog Produk), jadi label
// & penjelasannya tidak boleh hardcode "artikel" lagi.
const dynamicDetailNoun = (pageKey: string) => {
  if (pageKey === "article_detail") return "artikel";
  if (pageKey === "product_detail") return "produk";
  return "konten";
};

const dynamicDetailBadgeLabel = (pageKey: string) => {
  if (pageKey === "article_detail") return "Template Detail Artikel";
  if (pageKey === "product_detail") return "Template Detail Produk";
  return "Template Halaman Detail";
};

const STRUCTURE_INFO_BY_TYPE: Record<string, string> = {
  company_profile: "Website tipe Company Profile memiliki 7 halaman default: Home, About Us, Service, Portfolio, Blog / Artikel, Article Detail, dan Contact.",
  catalog_product: "Website tipe Katalog Produk memiliki 7 halaman default: Home, Produk, Detail Produk, FAQ, Blog / Artikel, Article Detail, dan Contact."
};

export default function WebsitePagesPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [pages, setPages] = useState<PageItem[]>([]);
  const [website, setWebsite] = useState<WebsiteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPages = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [pagesRes, websiteRes] = await Promise.all([
        apiCall<PageItem[]>("GET", `websites/${websiteId}/pages`),
        apiCall<WebsiteInfo>("GET", `websites/${websiteId}`).catch(() => ({ data: null as WebsiteInfo | null }))
      ]);
      setPages(pagesRes.data || []);
      setWebsite(websiteRes.data || null);
    } catch (err: any) {
      console.error("Fetch pages error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      Promise.resolve().then(() => {
        fetchPages();
      });
    }
  }, [websiteId]);


  return (
    <DashboardLayout 
      title="Halaman Website" 
      subtitle="Atur tata letak bagian (sections) di setiap halaman website Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="pages-container">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-xs text-slate-500 leading-normal">
          <p>
            {STRUCTURE_INFO_BY_TYPE[website?.websiteType || "company_profile"] || STRUCTURE_INFO_BY_TYPE.company_profile}
            {" "}Setiap halaman dibentuk oleh kumpulan <strong>Bagian Website (Section)</strong> yang tumpukannya disusun berurutan dari atas ke bawah. Klik tombol kelola untuk memilih tampilan visual dan mengisi teks di setiap bagian halaman tersebut.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4" id="pages-loading-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-28 animate-pulse" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Layers className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800">Tidak Ada Halaman</h3>
            <p className="text-sm text-slate-500">Belum ada struktur halaman yang terdaftar.</p>
          </div>
        ) : (
          <div className="space-y-4" id="pages-list">
            {pages.map((p) => {
              const isComplete = p.sectionCount > 0 && p.filledSectionCount === p.sectionCount;
              const hasDraft = p.filledSectionCount < p.sectionCount;

              return (
                <div 
                  key={p.pageKey}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group cursor-pointer"
                  onClick={() => router.push(`/websites/${websiteId}/pages/${p.pageKey}`)}
                  id={`page-item-${p.pageKey}`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate text-base">
                        {p.pageLabel}
                      </h3>
                      {isComplete && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                          <CheckCircle className="h-3 w-3 shrink-0" />
                          <span>Penuh Terisi</span>
                        </span>
                      )}
                      {p.isDynamicDetailPage && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-full border border-sky-100">
                          <span>{dynamicDetailBadgeLabel(p.pageKey)}</span>
                        </span>
                      )}
                      {hasDraft && p.filledSectionCount > 0 && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>Sedang Diisi</span>
                        </span>
                      )}
                      {p.filledSectionCount === 0 && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full border border-slate-200">
                          <span>Belum Diisi</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      Key teknis: <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{p.pageKey}</span>
                    </div>

                    {/* Completion Text */}
                    <div className="text-xs text-slate-600 font-semibold pt-1">
                      Progres: <span className="text-slate-900">{p.filledSectionCount}</span> dari <span className="text-slate-900">{p.sectionCount}</span> bagian terisi template & konten
                    </div>
                    {p.isDynamicDetailPage && (
                      <p className="text-xs text-slate-500 leading-normal">
                        Halaman ini mengatur tampilan detail {dynamicDetailNoun(p.pageKey)}, bukan {dynamicDetailNoun(p.pageKey)} tertentu.
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/websites/${websiteId}/pages/${p.pageKey}`);
                      }}
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition active:translate-y-[1px]"
                    >
                      <span>Kelola Bagian</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
