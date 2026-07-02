"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Globe, ArrowRight, AlertCircle, Info, Sparkles, Layout, ShieldAlert, Mail } from "lucide-react";

export default function CreateNewWebsitePage() {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [selfServiceOpen, setSelfServiceOpen] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await apiCall<{ enabled: boolean }>("GET", "settings/public-activation");
        setSelfServiceOpen(!!res.data?.enabled);
      } catch (err) {
        console.error("Check public activation error:", err);
        setSelfServiceOpen(false);
      } finally {
        setCheckingAccess(false);
      }
    };
    checkAccess();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generatedSlug);
  };

  const handleSlugChange = (val: string) => {
    const cleanSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
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
      if (err.error?.code === "SELF_SERVICE_WEBSITE_DISABLED") {
        setSelfServiceOpen(false);
        setErrorMsg(err.error?.message || "Pembuatan website mandiri belum dibuka.");
      } else if (err.error?.code === "SLUG_ALREADY_EXISTS") {
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
      {checkingAccess ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Memeriksa akses pembuatan website...</p>
        </div>
      ) : !selfServiceOpen ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 max-w-2xl mx-auto text-center space-y-5">
          <div className="h-14 w-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Pembuatan Website Mandiri Belum Dibuka</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Lentera Pasar saat ini masih dalam tahap uji coba terbatas. Website untuk akun Anda
              hanya bisa dibuatkan langsung oleh tim internal Lentera Pasar.
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-start gap-3 text-left">
            <Mail className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Kalau Anda butuh website baru atau ada perubahan, hubungi tim internal Lentera Pasar —
              kami akan bantu buatkan langsung.
            </span>
          </div>
          <button
            onClick={() => router.push("/websites")}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Kembali ke Website Saya
          </button>
        </div>
      ) : (
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

              <div>
                <label htmlFor="input-web-slug" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Slug / Link Website
                </label>
                <input
                  id="input-web-slug"
                  type="text"
                  required
                  placeholder="toko-roti-sedap"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Dipakai sebagai alamat unik website Anda. Terisi otomatis dari nama, bisa diubah manual.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-500">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Tipe website yang tersedia saat ini: <strong>Company Profile</strong>. Setelah dibuat,
                  Anda bisa langsung mulai mengisi konten halaman.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Membuat Website...</span>
                  </>
                ) : (
                  <>
                    <span>Buat Website</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Column */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit">
            <div className="flex items-center gap-2 text-slate-800">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-sm">Setelah Dibuat</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <Globe className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>Website otomatis berisi 7 halaman default Company Profile.</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>Status awal <strong>Draft</strong> — belum tampil ke publik sampai Anda klik Aktifkan Website.</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>Anda bisa isi konten tiap bagian halaman kapan saja lewat menu Halaman.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
