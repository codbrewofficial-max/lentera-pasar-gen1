"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Globe, 
  Eye, 
  Code, 
  Layout, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  ExternalLink,
  Smartphone,
  Monitor,
  CheckCircle2
} from "lucide-react";

interface PreviewPayload {
  isPreview: boolean;
  website: {
    id: string;
    name: string;
    slug: string;
    websiteType: string;
    websiteTypeLabel: string;
    status: string;
    trackingKey: string;
    theme: Record<string, any>;
  };
  seo: {
    title: string;
    description: string;
  };
  businessProfile: Record<string, any>;
  navigation: Array<{ label: string; href: string }>;
  page: {
    pageKey: string;
    title: string;
    slug: string;
    sections: Array<{
      id: string;
      slotKey: string;
      slotLabel: string;
      sectionKey: string;
      component: string;
      variant: string;
      content: Record<string, any>;
      tracking: {
        slotKey: string;
        sectionKey: string;
      };
      data: {
        services: any[];
        portfolios: any[];
        testimonials: any[];
        brands: any[];
      };
    }>;
  };
}

export default function WebsitePreviewPage() {
  const router = useRouter();
  const params = useParams();
  
  const websiteId = params?.websiteId as string;
  const pageKey = params?.pageKey as string;

  const [preview, setPreview] = useState<PreviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  const availablePages = [
    { key: "home", label: "Home" },
    { key: "about", label: "About Us" },
    { key: "services", label: "Service" },
    { key: "portfolio", label: "Portfolio" },
    { key: "articles", label: "Blog / Artikel" },
    { key: "article_detail", label: "Article Detail" },
    { key: "contact", label: "Contact" }
  ];

  const fetchPreviewData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<PreviewPayload>("GET", `websites/${websiteId}/preview/pages/${pageKey}`);
      setPreview(res.data);
    } catch (err: any) {
      console.error("Fetch preview error:", err);
      setErrorMsg(
        err.error?.message || 
        "Gagal memuat data preview. Pastikan Anda telah memilih template pada bagian halaman ini."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId && pageKey) {
      Promise.resolve().then(() => {
        fetchPreviewData();
      });
    }
  }, [websiteId, pageKey]);

  const handlePageChange = (targetPageKey: string) => {
    router.push(`/websites/${websiteId}/preview/${targetPageKey}`);
  };

  return (
    <DashboardLayout 
      title="Pratinjau Website" 
      subtitle="Melihat struktur konten dan payload data dari website bisnis Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="preview-page-root">
        {/* Page Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {availablePages.map((pg) => (
              <button
                key={pg.key}
                onClick={() => handlePageChange(pg.key)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  pg.key === pageKey
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {pg.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setActiveTab("visual")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                  activeTab === "visual"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Layout className="h-3.5 w-3.5" />
                <span>Visual</span>
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                  activeTab === "json"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>JSON Payload</span>
              </button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Gagal Menampilkan Pratinjau</p>
              <p className="text-xs text-rose-700">{errorMsg}</p>
              <button 
                onClick={() => router.push(`/websites/${websiteId}/pages/${pageKey}`)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-800 underline hover:text-rose-950"
              >
                <span>Kelola Bagian Halaman Sekarang</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-sm font-medium text-slate-500">Menyusun struktur preview...</span>
          </div>
        ) : preview ? (
          <div>
            {activeTab === "visual" ? (
              <div className="space-y-4">
                {/* Visual Simulator Frame */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                  {/* Simulator Header */}
                  <div className="bg-slate-900 text-slate-400 px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                        <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                      </div>
                      <span className="text-xs font-mono pl-4 text-slate-500">
                        lenterapasar.id/{preview.website?.slug || websiteId}/{preview.page?.pageKey || pageKey}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => setDeviceMode("desktop")}
                        className={`p-1.5 rounded-lg transition ${
                          deviceMode === "desktop" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800 hover:text-white"
                        }`}
                        title="Tampilan Desktop"
                      >
                        <Monitor className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeviceMode("mobile")}
                        className={`p-1.5 rounded-lg transition ${
                          deviceMode === "mobile" ? "bg-slate-800 text-emerald-400" : "hover:bg-slate-800 hover:text-white"
                        }`}
                        title="Tampilan Mobile"
                      >
                        <Smartphone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Simulated Body */}
                  <div className={`bg-slate-50 p-6 mx-auto transition-all duration-300 ${deviceMode === "mobile" ? "max-w-md border-x border-slate-200 bg-slate-100" : "w-full"}`}>
                    
                    {/* Website Title Header */}
                    <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Website Name</div>
                        <h1 className="text-lg font-bold text-slate-800">{preview.website?.name || "Lentera Website"}</h1>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 text-left md:text-right">SEO Page Title</div>
                        <div className="text-xs font-semibold text-slate-600 text-left md:text-right">{preview.seo?.title || "Home"}</div>
                      </div>
                    </div>

                    {!preview.page?.sections || preview.page.sections.length === 0 ? (
                      <div className="py-16 text-center space-y-4">
                        <div className="inline-flex p-3.5 bg-amber-50 rounded-2xl text-amber-600">
                          <AlertCircle className="h-8 w-8" />
                        </div>
                        <div className="max-w-sm mx-auto">
                          <h4 className="font-bold text-slate-800">Halaman Kosong</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Belum ada bagian/section aktif yang dikonfigurasi untuk halaman ini. Silakan tambahkan bagian di editor.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {preview.page.sections.map((sec, idx) => (
                          <div 
                            key={sec.id || idx} 
                            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative group"
                          >
                            {/* Section Metadata Header Badge */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] bg-slate-900 text-white font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                  {sec.slotKey}
                                </span>
                                <span className="text-[11px] font-bold text-slate-700">
                                  {sec.slotLabel} ({sec.component})
                                </span>
                              </div>
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3 shrink-0" />
                                <span>Konten Siap ({sec.variant})</span>
                              </span>
                            </div>

                            {/* Simulated rendering of keys and values */}
                            <div className="space-y-4">
                              {Object.entries(sec.content || {}).map(([key, val]) => (
                                <div key={key} className="space-y-1">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                                    {key}
                                  </span>
                                  {typeof val === "string" && val.startsWith("http") ? (
                                    val.match(/\.(jpeg|jpg|gif|png|webp)/i) || val.includes("picsum") ? (
                                      <div className="space-y-1">
                                        {/* Image preview box */}
                                        <div className="relative h-28 w-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                                          <img 
                                            src={val} 
                                            alt={key} 
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                              // Fallback plain box if error
                                              (e.target as HTMLElement).style.display = "none";
                                            }}
                                          />
                                        </div>
                                        <span className="text-[10px] font-mono text-blue-600 truncate block max-w-md">{val}</span>
                                      </div>
                                    ) : (
                                      <a 
                                        href={val} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-mono text-blue-600 hover:underline inline-flex items-center gap-1"
                                      >
                                        <span>{val}</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )
                                  ) : (
                                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                                      {String(val)}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

                {/* Info Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-xs text-amber-800 flex items-start space-x-3.5">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Informasi Penayangan Visual</p>
                    <p className="leading-relaxed">
                      Penayangan visual di atas adalah representasi pemetaan isian data profil dan teks section Anda ke komponen website. 
                      Untuk menjaga kestabilan dan kecepatan editing, rendering penuh berbasis CSS layout publik dapat diakses langsung setelah tim internal melakukan rilis publikasi domain final.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* JSON Raw Contract Data */
              <div className="space-y-4">
                <div className="bg-slate-900 text-white rounded-3xl p-6 font-mono text-xs overflow-x-auto shadow-lg border border-slate-800 relative">
                  <span className="absolute top-4 right-4 bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold">
                    application/json
                  </span>
                  <pre className="text-slate-200 leading-normal selection:bg-emerald-600">
                    {JSON.stringify({ data: preview }, null, 2)}
                  </pre>
                </div>

                <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Payload JSON di atas adalah struktur kontrak data resmi yang dikirimkan oleh API Lentera Pasar ke mesin <strong>Site Renderer</strong> untuk dirender secara dinamis menjadi website publik yang super cepat.
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
