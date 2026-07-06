"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/ui/RichTextEditor";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import { 
  Briefcase, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Compass,
  ArrowRight
} from "lucide-react";

interface BusinessProfile {
  id: string;
  websiteId: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  logoAlt?: string | null;
  vision?: string | null;
  mission?: string | null;
  timelineJson?: {
    items?: Array<{
      year?: string;
      title?: string;
      description?: string;
    }>;
  } | null;
  contactEmail?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
}

export default function BusinessProfilePage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoAlt, setLogoAlt] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Default "company_profile" biar sidebar lama tetap tampil normal sementara
  // fetch belum selesai / kalau fetch gagal — tidak ada perubahan perilaku.
  const [websiteType, setWebsiteType] = useState<string>("company_profile");

  useEffect(() => {
      if (!websiteId) return;
      apiCall<{ websiteType: string }>("GET", `websites/${websiteId}`)
        .then((res) => {
          if (res.data?.websiteType) setWebsiteType(res.data.websiteType);
        })
        .catch(() => {
          // Diamkan saja — sidebar fallback ke company_profile, halaman lain
          // yang butuh data website tetap fetch sendiri-sendiri seperti biasa.
        });
    }, [websiteId]);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<BusinessProfile>("GET", `websites/${websiteId}/business-profile`);
      const data = res.data;
      if (data) {
        setProfile(data);
        setName(data.name || "");
        setTagline(data.tagline || "");
        setDescription(data.description || "");
        setLogoUrl(data.logoUrl || "");
        setLogoAlt(data.logoAlt || "");
        setVision(data.vision || "");
        setMission(data.mission || "");
        setEmail(data.contactEmail || "");
        setPhone(data.phone || "");
        setWhatsapp(data.whatsapp || "");
        setAddress(data.address || "");
      }
    } catch (err: any) {
      console.error("Fetch profile error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat profil bisnis Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      Promise.resolve().then(() => {
        fetchProfile();
      });
    }
  }, [websiteId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      name,
      tagline,
      description,
      logoUrl: logoUrl || null,
      logoAlt: logoAlt || null,
      vision,
      mission,
      contactEmail: email,
      phone,
      whatsapp,
      address
    };

    try {
      await apiCall<BusinessProfile>("PUT", `websites/${websiteId}/business-profile`, payload);
      setSuccessMsg("Profil bisnis berhasil diperbarui dan disimpan.");
      
      // Auto clear success message
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("Save profile error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan perubahan profil bisnis.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Memuat Profil..." showBackButton={true} backUrl={`/websites/${websiteId}/overview`}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  const isCatalogProduct = websiteType === "catalog_product";

  return (
    <DashboardLayout 
      title="Profil Bisnis" 
      subtitle="Sesuaikan isian profil dasar yang akan disinkronkan ke seluruh template halaman website Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="profile-container">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Global info sync banner */}
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 flex items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">Sinkronisasi Otomatis Profil</h3>
            <p className="text-xs text-slate-300 leading-normal max-w-2xl">
              Hebatnya Lentera Pasar: Data yang Anda isi di bawah ini (misalnya No WhatsApp, Alamat, atau Email) akan <strong>otomatis terintegrasi</strong> ke dalam semua template halaman yang aktif. Anda tidak perlu mengetik ulang kontak di beranda maupun di halaman hubungi kami!
            </p>
          </div>
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-slate-800 text-[#B283AF] flex items-center justify-center hidden sm:flex">
            <Compass className="h-5 w-5" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" id="profile-form">
          
          {/* Card 1: Informasi Dasar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3">
              <Briefcase className="h-5 w-5 text-[#649FF6]" />
              <span className="font-bold text-sm uppercase tracking-wide text-slate-400">Informasi Dasar Usaha</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="prof-name" className="block text-sm font-semibold text-slate-700">Nama Bisnis</label>
                <input
                  id="prof-name"
                  type="text"
                  required
                  placeholder="Contoh: Toko Roti Sedap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="prof-tagline" className="block text-sm font-semibold text-slate-700">Tagline / Moto Bisnis</label>
                <input
                  id="prof-tagline"
                  type="text"
                  placeholder="Contoh: Lezat, Bergizi, dan Hangat Setiap Hari"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                />
              </div>


              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="prof-logo-url" className="block text-sm font-semibold text-slate-700">URL Logo Bisnis</label>
                <input
                  id="prof-logo-url"
                  type="url"
                  placeholder="Tempel URL dari Media Library, contoh: http://localhost:4000/api/v1/public/media/media_xxx"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                />
                <p className="text-xs text-slate-400 mt-1">Upload logo di Media Library, lalu salin URL-nya ke field ini. Logo akan tampil di navbar dan footer website publik.</p>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="prof-logo-alt" className="block text-sm font-semibold text-slate-700">Alt Text Logo</label>
                <input
                  id="prof-logo-alt"
                  type="text"
                  placeholder="Contoh: Logo Toko Roti Sedap"
                  value={logoAlt}
                  onChange={(e) => setLogoAlt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                />
              </div>

              {logoUrl && (
                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Preview Logo</p>
                  <img src={logoUrl} alt={logoAlt || name || 'Logo bisnis'} className="max-h-20 rounded-xl bg-white object-contain p-2" />
                </div>
              )}

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="prof-desc" className="block text-sm font-semibold text-slate-700">Deskripsi Lengkap Bisnis</label>
                <RichTextEditor
                  id="prof-desc"
                  minHeight={140}
                  placeholder="Tulis penjelasan mendalam mengenai produk, keunikan, dan apa yang membuat bisnis Anda menonjol..."
                  value={description}
                  onChange={setDescription}
                  helperText="Deskripsi ini menjadi sumber utama untuk beberapa section dan SEO dasar website."
                />
              </div>
            </div>
          </div>

          {!isCatalogProduct ? (
            // {/* Card 2: Visi, Misi & Sejarah */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3">
                <Compass className="h-5 w-5 text-[#649FF6]" />
                <span className="font-bold text-sm uppercase tracking-wide text-slate-400">Visi, Misi & Sejarah</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="prof-vision" className="block text-sm font-semibold text-slate-700">Visi Perusahaan</label>
                  <RichTextEditor
                    id="prof-vision"
                    minHeight={100}
                    placeholder="Contoh: Menjadi produsen roti keluarga nomor satu di wilayah Jabodetabek"
                    value={vision}
                    onChange={setVision}
                    helperText="Tulis visi perusahaan secara ringkas dan jelas."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prof-mission" className="block text-sm font-semibold text-slate-700">Misi Perusahaan</label>
                  <RichTextEditor
                    id="prof-mission"
                    minHeight={120}
                    placeholder="Contoh: Menggunakan bahan lokal berkualitas, menjaga sanitasi pabrik, melayani pesanan tepat waktu..."
                    value={mission}
                    onChange={setMission}
                    helperText="Gunakan daftar poin agar misi mudah dibaca di website publik."
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-700">Sejarah Singkat / Milestones</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Kelola timeline sejarah dan milestone bisnis Anda (per tahun) di halaman khusus Timeline.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/websites/${websiteId}/content/timeline`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-[#649FF6] hover:text-[#649FF6] text-slate-600 text-xs font-bold rounded-xl shadow-sm transition shrink-0"
                  >
                    Kelola Timeline
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Card 3: Kontak & Lokasi */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3">
              <MapPin className="h-5 w-5 text-[#649FF6]" />
              <span className="font-bold text-sm uppercase tracking-wide text-slate-400">Kontak Penghubung & Lokasi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="prof-email" className="block text-sm font-semibold text-slate-700">Email Bisnis</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="prof-email"
                    type="email"
                    placeholder="kontak@bisnis.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prof-phone" className="block text-sm font-semibold text-slate-700">Nomor Telepon Kantor</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    id="prof-phone"
                    type="tel"
                    placeholder="Contoh: 0217654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="prof-wa" className="block text-sm font-semibold text-slate-700">Nomor WhatsApp Bisnis</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <input
                    id="prof-wa"
                    type="text"
                    required
                    placeholder="Contoh: 081298765432 (Gunakan nomor tanpa spasi/tanda hubung)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors font-mono font-semibold"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Penting: Nomor WhatsApp ini akan dipasang langsung ke dalam tombol pintas aksi &quot;Hubungi Kami&quot; di website Anda agar terhubung langsung dengan chat customer.
                </p>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="prof-address" className="block text-sm font-semibold text-slate-700">Alamat Lengkap Kantor / Toko</label>
                <EnhancedTextarea
                  id="prof-address"
                  minRows={3}
                  placeholder="Tuliskan nama jalan, nomor, RT/RW, kelurahan, kecamatan, kabupaten/kota, dan kode pos toko utama Anda..."
                  value={address}
                  onChange={setAddress}
                  helperText="Alamat ini dapat dipakai oleh section kontak dan footer website."
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => router.push(`/websites/${websiteId}/overview`)}
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md shadow-[#649FF6]/10 hover:shadow-[#649FF6]/20 transition active:translate-y-[1px]"
              id="btn-save-profile"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sedang Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Profil Bisnis</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
