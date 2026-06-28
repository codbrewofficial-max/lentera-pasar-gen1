"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Globe, ArrowRight, AlertCircle, Info, Sparkles, Layout } from "lucide-react";

export default function CreateNewWebsitePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate clean slug: lowercase, replace spaces & special chars with dashes
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces/dashes
      .trim()
      .replace(/\s+/g, "-") // replace spaces with dashes
      .replace(/-+/g, "-"); // merge multi-dashes
    setSlug(generatedSlug);
  };

  const handleSlugChange = (val: string) => {
    const cleanSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") // allow lowercase alphanumeric and dashes only
      .replace(/-+/g, "-");
    setSlug(cleanSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Nama website wajib diisi.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Slug website wajib diisi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await apiCall<any>("POST", "websites", {
        name: name.trim(),
        slug: slug.trim(),
        websiteType: "company_profile"
      });

      setSuccessMsg("Website berhasil dibuat! Mengalihkan ke halaman kelola...");
      
      const newWebId = response.data?.id;
      setTimeout(() => {
        router.push(`/websites/${newWebId}/overview`);
      }, 1000);
    } catch (err: any) {
      console.error("Create website error:", err);
      if (err.error?.code === "SLUG_ALREADY_EXISTS") {
        setErrorMsg("Slug / link website ini sudah digunakan. Coba gunakan nama atau kombinasi kata lain.");
      } else {
        setErrorMsg(err.error?.message || "Gagal membuat website baru. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Buat Website Baru" 
      subtitle="Mulai rancang kehadiran bisnis Anda di dunia digital"
      showBackButton={true}
      backUrl="/websites"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="create-website-container">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-800">
            <Layout className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-sm uppercase tracking-wide text-slate-400">Pengaturan Dasar</span>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm animate-fadeIn">
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Website Name */}
            <div>
              <label htmlFor="input-web-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nama Website / Bisnis
              </label>
              <input
                id="input-web-name"
                type="text"
                required
                placeholder="Contoh: Toko Roti Sedap, Bengkel Maju Jaya"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Nama ini akan dipasang sebagai judul utama di website bisnis Anda.
              </p>
            </div>

            {/* Slug / Link */}
            <div>
              <label htmlFor="input-web-slug" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Link Website (Slug)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xs font-semibold text-slate-400 select-none bg-slate-100 border-r border-slate-200 rounded-l-xl px-3.5">
                  lenterapasar.id/
                </span>
                <input
                  id="input-web-slug"
                  type="text"
                  required
                  placeholder="roti-sedap"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full pl-[130px] pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm font-mono font-semibold"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Alamat web kustom unik Anda. Hanya huruf kecil, angka, dan tanda hubung (-).
              </p>
            </div>

            {/* Website Type (Only Company Profile Active for MVP) */}
            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-2.5">
                Pilih Tipe Tampilan Website
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Profile (Active) */}
                <div className="border-2 border-emerald-500 bg-emerald-50/25 rounded-2xl p-4 cursor-pointer relative flex flex-col justify-between h-28 hover:bg-emerald-50/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Company Profile</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Rekomendasi MVP
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Profil bisnis terstruktur: Beranda, Tentang Kami, Layanan, dan Kontak Pelanggan.
                  </p>
                </div>

                {/* Landing Page (Disabled) */}
                <div className="border border-slate-200 bg-slate-50 opacity-60 rounded-2xl p-4 relative flex flex-col justify-between h-28 select-none">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 text-sm">Online Shop / Toko</span>
                    <span className="bg-slate-200 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                      Segera Hadir
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">
                    Katalog belanja dengan integrasi keranjang belanja & form WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/websites")}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Batalkan
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-emerald-700/20 transition active:translate-y-[1px]"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Memproses Buat...</span>
                  </>
                ) : (
                  <>
                    <span>Buat Website Sekarang</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Globe className="h-40 w-40" />
            </div>
            
            <div className="relative space-y-4">
              <div className="inline-flex p-2 bg-emerald-800 rounded-xl text-emerald-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Mengapa Lentera Pasar?</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Kami merancang sistem ini untuk owner bisnis yang tidak memiliki latar belakang IT. 
                Anda tidak perlu memahami server, database, atau pemrograman. 
                Cukup isi formulir profil bisnis, pilih tampilan visual, dan website siap diakses!
              </p>
              <ul className="text-xs text-emerald-200/90 space-y-2 pt-2 border-t border-emerald-800">
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Sistem isian konten dinamis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Optimal untuk HP & Komputer</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Pelacakan lead masuk instan</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600">
              <Info className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wide">Pemberitahuan MVP</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Saat ini Lentera Pasar berada dalam tahap MVP (Minimum Viable Product). 
              Tipe website yang didukung penuh baru <strong>Company Profile</strong>. 
              Tipe Toko Online dan Portofolio akan hadir pada rilis berikutnya.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
