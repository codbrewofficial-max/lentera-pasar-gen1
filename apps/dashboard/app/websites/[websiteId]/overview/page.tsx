"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Briefcase, 
  Layers, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  Rocket,
  ArrowRight,
  Eye,
  HeartHandshake,
  FolderKanban,
  MessageSquare,
  Award,
  FileText,
  ShoppingBag,
  LayoutTemplate,
  Sparkles,
  HelpCircle
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

export default function WebsiteOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Default "company_profile" biar sidebar lama tetap tampil normal sementara
  // fetch belum selesai / kalau fetch gagal — tidak ada perubahan perilaku.
  const [websiteType, setWebsiteType] = useState<string>("company_profile");

  const fetchWebsite = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<Website>("GET", `websites/${websiteId}`);
      setWebsite(res.data);
      if (res.data?.websiteType) setWebsiteType(res.data.websiteType);
    } catch (err: any) {
      console.error("Fetch website detail error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat ringkasan website.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      Promise.resolve().then(() => {
        fetchWebsite();
      });
    }
  }, [websiteId]);


  const handlePublish = async () => {
    setPublishing(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiCall<Website>("POST", `websites/${websiteId}/publish`);
      setWebsite(res.data);
      setSuccessMsg("Selamat! Website Anda sekarang sudah AKTIF dan dipublikasikan.");
      // Auto clear toast after 5 seconds
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      console.error("Publish error:", err);
      setErrorMsg(err.error?.message || "Gagal mempublikasikan website.");
    } finally {
      setPublishing(false);
    }
  };

  const isCatalogProduct = websiteType === "catalog_product";

  if (loading) {
    return (
      <DashboardLayout title="Memuat Website..." showBackButton={true} backUrl="/websites">
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!website) {
    return (
      <DashboardLayout title="Website Tidak Ditemukan" showBackButton={true} backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Gagal Memuat Website</h3>
          <p className="text-sm text-slate-500">Website tidak ditemukan atau Anda tidak memiliki hak akses.</p>
          <button onClick={() => router.push("/websites")} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl">
            Kembali ke Daftar Website
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate completion percentage
  const completionPercentage = (website.sectionsCount ?? 0) > 0 
    ? Math.round(((website.filledSectionsCount ?? 0) / (website.sectionsCount ?? 0)) * 100) 
    : 0;

  return (
    <DashboardLayout 
      title={website.name} 
      subtitle={`Tipe: ${website.websiteTypeLabel} | Domain: lenterapasar.id/${website.slug}`}
      showBackButton={true}
      backUrl="/websites"
    >
      <div className="space-y-6" id="overview-content">
        
        {/* Status Alert Banner */}
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

        {/* Website Status & Quick Publish */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="overview-status-banner">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status Website Anda:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                website.status === "published"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}>
                {website.statusLabel}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {website.status === "published" 
                ? "Website Anda sudah mengudara secara publik!" 
                : "Website belum aktif (Masih berupa Draf)"}
            </h3>
            <p className="text-xs text-slate-500 max-w-xl leading-normal">
              {website.status === "published"
                ? "Hebat! Calon pelanggan sekarang dapat mengakses website Anda. Anda tetap dapat memperbarui isian profil bisnis atau memilih tampilan kapan pun diperlukan."
                : "Untuk meluncurkan website ke internet agar bisa diakses oleh calon pelanggan Anda, silakan lengkapi beberapa bagian halaman lalu tekan tombol Aktifkan Website di samping."}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {website.status === "draft" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/10 transition active:translate-y-[1px]"
                id="btn-publish-website"
              >
                <Rocket className="h-4 w-4" />
                <span>{publishing ? "Sedang Mengaktifkan..." : "Aktifkan Website Saya"}</span>
              </button>
            )}

            <button
              onClick={() => router.push(`/websites/${website.id}/preview/home`)}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-xl shadow-sm border border-emerald-200 transition active:translate-y-[1px]"
              id="btn-preview-website"
            >
              <Eye className="h-4 w-4" />
              <span>Pratinjau Website</span>
            </button>
            
            <button
              onClick={() => router.push(`/websites/${website.id}/pages`)}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md transition active:translate-y-[1px]"
            >
              <span>Edit Bagian Halaman</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="overview-stats-cards">
          {/* Progress Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kelengkapan Konten</span>
              <span className="text-emerald-600 font-bold font-mono text-sm bg-emerald-50 px-2.5 py-1 rounded-lg">
                {completionPercentage}% Selesai
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{website.filledSectionsCount ?? 0} bagian terisi</span>
                <span>Dari total {website.sectionsCount ?? 0} bagian halaman</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              {completionPercentage < 100 
                ? "Tips: Buka menu 'Halaman' untuk melihat bagian mana saja yang belum diisi kontennya. Website yang lengkap akan meningkatkan kepercayaan calon pembeli Anda."
                : "Luar biasa! Seluruh bagian halaman Anda telah diisi dengan sempurna. Website siap memberikan konversi terbaik!"}
            </p>
          </div>

          {/* Quick Info Specs */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Platform</span>
            
            <div className="space-y-1.5 my-3">
              <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">Rilis Perdana</div>
              <p className="text-xs text-slate-400 leading-normal">
                Lentera Pasar kini hadir dalam tahap akses awal! Saat ini Anda dapat membangun dan mempublikasikan website untuk keperluan demo. Fitur tingkat lanjut seperti hosting produksi, domain custom, dan paket langganan akan segera hadir pada pembaruan mendatang.
              </p>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2.5 flex justify-between items-center">
              <span>Mode: Akses Awal (Early Access)</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* 4 Quick Cards Grid */}
        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-4">Pintasan Pengelolaan</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="overview-menu-grid">
            
            {/* 1. Profil Bisnis */}
            <div 
              onClick={() => router.push(`/websites/${website.id}/profile`)}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Profil Bisnis</h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Kelola nama usaha, tagline, WhatsApp, alamat, dan jam buka.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-50">
                <span>Atur Profil</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* 2. Halaman */}
            <div 
              onClick={() => router.push(`/websites/${website.id}/pages`)}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center transition-colors group-hover:bg-sky-600 group-hover:text-white">
                  <Layers className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Halaman Website</h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Pilih tampilan (template) dan isi konten di setiap bagian halaman.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-sky-600 pt-2 border-t border-slate-50">
                <span>Kelola Halaman</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* 3. Insight */}
            {/* <div 
              onClick={() => router.push(`/websites/${website.id}/insights`)}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Insight Pengunjung</h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Pantau statistik kunjungan dan interaksi tombol WhatsApp di web Anda.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-indigo-600 pt-2 border-t border-slate-50">
                <span>Lihat Statistik</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div> */}

            {/* 4. Lead */}
            {/* <div 
              onClick={() => router.push(`/websites/${website.id}/leads`)}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <Users className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Lead Masuk</h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Hubungi calon pelanggan yang mengirimkan pesan melalui form kontak.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-amber-600 pt-2 border-t border-slate-50">
                <span>Lihat Lead</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div> */}

          </div>
        </div>

        {/* Kelola Konten Usaha Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Kelola Konten Website Anda</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Isi database konten bisnis Anda di bawah ini agar data dapat ditampilkan secara profesional dan menarik customer.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" id="overview-content-grid">
            
            {!isCatalogProduct ? (
              <>
                
                {/* 1. Layanan */}
                <div 
                  onClick={() => router.push(`/websites/${website.id}/content/services`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Daftar Layanan</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Tambahkan, edit, dan susun layanan atau produk utama yang ditawarkan bisnis Anda.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-50">
                    <span>Kelola Layanan</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 2. Portfolio */}
                <div 
                  onClick={() => router.push(`/websites/${website.id}/content/portfolio`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center transition-colors group-hover:bg-teal-600 group-hover:text-white">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Galeri Portfolio</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Pajang hasil proyek, dokumentasi kerja, atau studi kasus kesuksesan bisnis Anda.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-teal-600 pt-2 border-t border-slate-50">
                    <span>Kelola Portfolio</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 3. Testimonial */}
                <div 
                  onClick={() => router.push(`/websites/${website.id}/content/testimonials`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-colors group-hover:bg-amber-600 group-hover:text-white">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Testimoni Pelanggan</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Tampilkan ulasan positif dan tingkat kepuasan dari pelanggan setia Anda.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-amber-600 pt-2 border-t border-slate-50">
                    <span>Kelola Testimoni</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 4. Artikel (Catatan: Label komentarnya tertulis Brand/Partner, tapi isinya Artikel) */}
                <div
                  onClick={() => router.push(`/websites/${website.id}/content/articles`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center transition-colors group-hover:bg-sky-600 group-hover:text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Artikel</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Kelola artikel blog, SEO title, ringkasan, dan status publikasi.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-sky-600 pt-2 border-t border-slate-50">
                    <span>Kelola Artikel</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 5. Brand / Partner */}
                <div 
                  onClick={() => router.push(`/websites/${website.id}/content/brands`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Award className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Brand & Partner</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Kelola daftar logo klien, partner, atau merek terafiliasi yang bekerja sama dengan Anda.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-indigo-600 pt-2 border-t border-slate-50">
                    <span>Kelola Brand Partner</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

              </>
            ) : (
              <>
                {/* 1. Produk */}
                <div 
                  onClick={() => router.push(`/websites/${website.id}/content/products`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Katalog Produk</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Kelola daftar produk, gambar, deskripsi, dan kategori barang yang Anda jual.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-emerald-600 pt-2 border-t border-slate-50">
                    <span>Kelola Produk</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 2. Banner */}
                <div 
                  onClick={() => router.push(`/websites/${website.id}/content/banners`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center transition-colors group-hover:bg-teal-600 group-hover:text-white">
                      <LayoutTemplate className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Banner Promo</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Atur banner gambar utama atau promo yang akan tampil di halaman depan website.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-teal-600 pt-2 border-t border-slate-50">
                    <span>Kelola Banner</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 3. Keunggulan / USP */}
                <div 
                  onClick={() => router.push(`/websites/${websiteId}/content/value-propositions`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-colors group-hover:bg-amber-600 group-hover:text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Keunggulan Toko</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Tambahkan poin-poin nilai jual unik (USP) agar pelanggan semakin yakin berbelanja.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-amber-600 pt-2 border-t border-slate-50">
                    <span>Kelola Keunggulan</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 4. FAQ */}
                <div
                  onClick={() => router.push(`/websites/${website.id}/content/faq`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center transition-colors group-hover:bg-sky-600 group-hover:text-white">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">FAQ</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Daftar pertanyaan yang sering diajukan pelanggan beserta dengan jawabannya.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-sky-600 pt-2 border-t border-slate-50">
                    <span>Kelola FAQ</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* 5. Brand / Partner */}
                <div 
                  onClick={() => router.push(`/websites/${website.id}/content/brands`)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Award className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Brand & Partner</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Kelola daftar logo klien, partner, atau merek yang mendukung bisnis Anda.
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-indigo-600 pt-2 border-t border-slate-50">
                    <span>Kelola Brand Partner</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
