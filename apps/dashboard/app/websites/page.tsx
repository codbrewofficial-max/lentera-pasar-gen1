"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Globe, 
  Settings, 
  Eye, 
  Plus, 
  Search, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Lock,
  ChevronRight,
  AlertCircle
} from "lucide-react";

interface Website {
  id: string;
  name: string;
  slug: string;
  websiteType: string;
  websiteTypeLabel: string;
  status: 'draft' | 'published';
  statusLabel: string;
  previewPath: string;
  pagesCount: number;
  sectionsCount: number;
  filledSectionsCount: number;
}

export default function WebsitesPage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchWebsites = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<Website[]>("GET", "websites");
      setWebsites(res.data || []);
    } catch (err: any) {
      console.error("Fetch websites error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar website Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchWebsites();
    });
  }, []);



  const filteredWebsites = websites.filter(web => 
    web.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    web.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout 
      title="Website Saya" 
      subtitle="Daftar website usaha Anda yang terdaftar di Lentera Pasar"
    >
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm" id="websites-actions-header">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Cari nama website atau slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          onClick={() => router.push("/websites/new")}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-emerald-700/20 active:translate-y-[1px] transition shrink-0"
          id="btn-create-website"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Website Baru</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Website Cards Grid */}
      {loading ? (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6" id="websites-loading-grid">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 w-36 bg-slate-200 rounded-md" />
                <div className="h-6 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="h-4 w-24 bg-slate-200 rounded-md" />
              <div className="h-8 w-full bg-slate-200 rounded-md" />
              <div className="flex space-x-3 pt-2">
                <div className="h-10 flex-1 bg-slate-200 rounded-xl" />
                <div className="h-10 flex-1 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredWebsites.length === 0 ? (
        <div className="mt-5 flex flex-col items-center justify-center text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4" id="websites-empty-state">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <Globe className="h-12 w-12" />
          </div>
          <div className="max-w-sm">
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Website</h3>
            <p className="text-sm text-slate-500 mt-1">
              Anda belum membuat website bisnis apapun. Ayo mulai bangun identitas online Anda sekarang juga!
            </p>
          </div>
          <button
            onClick={() => router.push("/websites/new")}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <span>Mulai Buat Website</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6" id="websites-grid">
          {filteredWebsites.map((web) => (
            <div 
              key={web.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group"
              id={`web-card-${web.id}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors truncate">
                    {web.name}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                    web.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {web.statusLabel}
                  </span>
                </div>

                <div className="mt-1 flex items-center text-xs text-slate-400 font-mono">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold mr-2">
                    {web.websiteTypeLabel}
                  </span>
                  <span>/{web.slug}</span>
                </div>

                {/* Progress Mini Info */}
                <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-500">Progress Isian Konten</span>
                    <span className="text-slate-800 font-bold font-mono">
                      {web.filledSectionsCount ?? 0} / {web.sectionsCount ?? 0} Bagian
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(web.sectionsCount ?? 0) > 0 ? ((web.filledSectionsCount ?? 0) / (web.sectionsCount ?? 0)) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Mencakup {web.pagesCount ?? 0} halaman terdaftar.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-2 border-t border-slate-100">
                <button
                  onClick={() => router.push(`/websites/${web.id}/overview`)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition active:translate-y-[1px]"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Kelola Website</span>
                </button>

                <button
                  onClick={() => router.push(`/websites/${web.id}/preview/home`)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-sm transition active:translate-y-[1px]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview Website</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
}
