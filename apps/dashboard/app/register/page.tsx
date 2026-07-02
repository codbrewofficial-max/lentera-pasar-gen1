"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiCall } from "@/lib/api";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

export default function RegisterPage() {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await apiCall<{ enabled: boolean }>("GET", "settings/public-activation");
        setRegistrationOpen(!!res.data?.enabled);
      } catch (err) {
        console.error("Check public activation error:", err);
        // Kalau gagal cek (mis. offline), aman-nya anggap tertutup dulu.
        setRegistrationOpen(false);
      } finally {
        setCheckingAccess(false);
      }
    };
    checkAccess();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Nama, email, dan kata sandi wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const response = await apiCall<{ token: string; user: any; debugVerificationToken?: string }>(
        "POST",
        "auth/register",
        { name, email, password }
      );

      if (response.data.token) {
        localStorage.setItem("LP_AUTH_TOKEN", response.data.token);
        localStorage.setItem("LP_USER", JSON.stringify(response.data.user));
      }

      router.push("/verify-email");
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.error?.code === "PUBLIC_REGISTRATION_DISABLED") {
        setRegistrationOpen(false);
        setErrorMsg(err.error?.message || "Pendaftaran publik belum dibuka.");
      } else if (err.error?.code === "EMAIL_ALREADY_REGISTERED" || err.error?.code === "CONFLICT") {
        setErrorMsg("Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.");
      } else {
        setErrorMsg(err.error?.message || "Gagal mendaftar. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 md:p-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 md:p-8">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <BrandMark />
          </div>
          <p className="mt-2 text-sm text-slate-500">Buat akun baru untuk mulai menjelajahi Lentera Pasar.</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B283AF]">
            LabKerKomIT Community
          </p>
        </div>

        {checkingAccess ? (
          <div className="py-10 flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent" />
            <p className="text-sm text-slate-400">Memeriksa status pendaftaran...</p>
          </div>
        ) : !registrationOpen ? (
          <div className="space-y-5">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-800 text-sm">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Pendaftaran mandiri belum dibuka untuk umum saat ini. Lentera Pasar masih dalam tahap uji
                coba terbatas — akun dan website hanya dibuatkan langsung oleh tim kami.
              </span>
            </div>
            <p className="text-sm text-slate-500 text-center">
              Sudah punya akun dari tim kami?{" "}
              <Link href="/login" className="font-semibold text-[#649FF6] hover:text-[#4f8be6]">
                Masuk di sini
              </Link>
            </p>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 leading-relaxed">
              Akun yang didaftarkan lewat halaman ini adalah akun pengguna umum. Untuk akun pemilik
              website (owner bisnis), hubungi tim internal Lentera Pasar.
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="name-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="confirm-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white font-semibold rounded-xl shadow-md shadow-[#649FF6]/10 hover:shadow-[#649FF6]/20 active:translate-y-[1px] transition flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Membuat Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-[#649FF6] hover:text-[#4f8be6]">
                Masuk di sini
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
