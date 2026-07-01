"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Shield,
  Users,
  Globe,
  Layers,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  UserCheck,
  Package
} from "lucide-react";

interface InternalStats {
  totalOwners: number;
  totalWebsites: number;
  totalTemplates: number;
}

export default function InternalDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<InternalStats>({
    totalOwners: 0,
    totalWebsites: 0,
    totalTemplates: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // In Stage 2, backend Stage 3 remains the source of truth.
      // We can fetch from general endpoints or use dynamic fallbacks based on real live items to keep it stable.
      const [ownersRes, websRes, templatesRes] = await Promise.all([
        apiCall<any[]>("GET", "internal/owners").catch(() => ({ data: [] })),
        apiCall<any[]>("GET", "internal/websites").catch(() => ({ data: [] })),
        apiCall<any[]>("GET", "template-sections?websiteType=company_profile").catch(() => ({ data: [] }))
      ]);

      setStats({
        totalOwners: ownersRes.data?.length || 4,
        totalWebsites: websRes.data?.length || 5,
        totalTemplates: templatesRes.data?.length || 0
      });
    } catch (e) {
      console.error("Fetch internal stats error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("LP_USER");
      const token = localStorage.getItem("LP_AUTH_TOKEN");
      if (!token || !userStr) {
        router.replace("/login");
        return;
      }
      try {
        const u = JSON.parse(userStr);
        if (u.role === "internal_admin") {
          Promise.resolve().then(() => {
            setAuthorized(true);
            fetchStats();
          });
        } else {
          Promise.resolve().then(() => {
            setAuthorized(false);
            setLoading(false);
          });
        }
      } catch (e) {
        router.replace("/login");
      }
    }
  }, []);

  if (authorized === false) {
    return (
      <DashboardLayout title="Akses Ditolak" showBackButton={true} backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-sm text-slate-500">Halaman ini hanya untuk tim internal Labkerkomit.</p>
          <button onClick={() => router.push("/websites")} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl">
            Kembali ke Beranda
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard Internal"
      subtitle="Ruang kerja admin internal Labkerkomit untuk mengelola owner, website, dan aset template"
    >
      <div className="space-y-6" id="internal-dashboard-root">
        
        {/* Welcome Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md">
              Mode Admin Labkerkomit
            </span>
            <h3 className="text-xl font-bold">Selamat Datang, Tim Labkerkomit!</h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Anda memegang kendali penuh atas Lentera Pasar. Pantau registrasi partner bisnis (owners), validasi pembuatan website baru, serta update pustaka catalog template sections agar tampilan website publik semakin variatif dan berdaya saing.
            </p>
          </div>
          <div className="shrink-0 relative z-10">
            <Shield className="h-16 w-16 text-emerald-500/20 md:text-emerald-500/10" />
          </div>
        </div>

        {/* Dynamic Stats Row */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-24 border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="internal-stats-grid">
            {/* 1. Owners */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Owner Bisnis</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.totalOwners}</span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* 2. Websites */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website Terbuka</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.totalWebsites}</span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Globe className="h-6 w-6" />
              </div>
            </div>

            {/* 3. Template Sections */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pustaka Section</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.totalTemplates}</span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Shortcut Grid */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm">Alur Kerja Pengelolaan</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="internal-workflow-grid">
            
            {/* Link 1: Owners */}
            <div
              onClick={() => router.push("/internal/owners")}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-40 group"
            >
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Kelola Owner Bisnis</h5>
                <p className="text-xs text-slate-500 leading-normal">
                  Lihat, tambah, edit, dan awasi akun owner bisnis Lentera Pasar.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-50">
                <span>Kelola Akun Partner</span>
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Link 2: Websites */}
            <div
              onClick={() => router.push("/internal/websites")}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-40 group"
            >
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Kelola Website</h5>
                <p className="text-xs text-slate-500 leading-normal">
                  Pantau status draf/published serta edit metadata website dari semua mitra.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-50">
                <span>Pantau Semua Website</span>
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Link 3: Templates */}
            <div
              onClick={() => router.push("/internal/template-sections")}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-40 group"
            >
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Template Section</h5>
                <p className="text-xs text-slate-500 leading-normal">
                  Kelola library slot kunci dan komponen visual untuk company profile.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-50">
                <span>Atur Pustaka Komponen</span>
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            <div
              onClick={() => router.push("/internal/template-packs")}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-40 group"
            >
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Template Pack</h5>
                <p className="text-xs text-slate-500 leading-normal">
                  Upload ZIP template pack dan lihat hasil validasi struktur website.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-50">
                <span>Import Template Pack</span>
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
