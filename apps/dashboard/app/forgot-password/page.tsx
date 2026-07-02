"use client";

import { useState } from "react";
import Link from "next/link";
import { apiCall } from "@/lib/api";
import { Mail, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Email wajib diisi.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await apiCall("POST", "auth/forgot-password", { email });
      setSent(true);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setErrorMsg(err.error?.message || "Gagal mengirim permintaan reset password. Coba lagi.");
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
          <p className="mt-2 text-sm text-slate-500">
            Masukkan email akun Anda, kami akan kirim tautan untuk mengatur ulang kata sandi.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {sent ? (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800 text-sm">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>
                Kalau email <strong>{email}</strong> terdaftar, instruksi reset password sudah kami
                kirimkan. Cek juga folder spam kalau belum masuk.
              </span>
            </div>
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white font-semibold rounded-xl shadow-md shadow-[#649FF6]/10 hover:shadow-[#649FF6]/20 active:translate-y-[1px] transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>Kirim Instruksi Reset</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Ingat kata sandi Anda?{" "}
          <Link href="/login" className="font-semibold text-[#649FF6] hover:text-[#4f8be6]">
            Kembali ke login
          </Link>
        </p>
      </div>
    </main>
  );
}
