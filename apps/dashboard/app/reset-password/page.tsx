"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiCall } from "@/lib/api";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500 font-medium">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent mb-4" />
          <span>Menyiapkan halaman reset password...</span>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Tautan reset password tidak valid. Minta tautan baru lewat halaman lupa kata sandi.");
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
      await apiCall("POST", "auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.error?.code === "INVALID_OR_EXPIRED_TOKEN") {
        setErrorMsg("Tautan reset password tidak valid atau sudah kedaluwarsa. Minta tautan baru.");
      } else {
        setErrorMsg(err.error?.message || "Gagal mengatur ulang kata sandi. Coba lagi.");
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
          <p className="mt-2 text-sm text-slate-500">Buat kata sandi baru untuk akun Anda.</p>
        </div>

        {!token && (
          <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Tautan tidak lengkap (token tidak ditemukan). Buka tautan dari email reset password,
              atau minta tautan baru.
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {done ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800 text-sm">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <span>Kata sandi berhasil diubah! Mengalihkan ke halaman login...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                Kata Sandi Baru
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
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="confirm-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Ulangi kata sandi baru"
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
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Simpan Kata Sandi Baru</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-[#649FF6] hover:text-[#4f8be6]">
            Kembali ke login
          </Link>
        </p>
      </div>
    </main>
  );
}
