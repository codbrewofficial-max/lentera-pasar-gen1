"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500 font-medium">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent mb-4" />
        <span>Menyiapkan portal masuk...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Check if redirect contains unauthorized
    if (searchParams?.get("unauthorized") === "true") {
      Promise.resolve().then(() => {
        setErrorMsg("Sesi Anda telah berakhir. Silakan masuk kembali.");
      });
    }
  }, [searchParams]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await apiCall<{ token: string; user: any }>("POST", "auth/login", {
        email,
        password
      });

      setSuccessMsg("Masuk berhasil! Mengalihkan ke dashboard...");
      
      // Save local states (already done in apiCall helper but we can confirm)
      if (response.data.token) {
        localStorage.setItem("LP_AUTH_TOKEN", response.data.token);
        localStorage.setItem("LP_USER", JSON.stringify(response.data.user));
      }

      setTimeout(() => {
        router.push("/websites");
      }, 800);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.error?.code === "INVALID_CREDENTIALS") {
        setErrorMsg("Email atau kata sandi Anda salah. Pastikan menggunakan kredensial demo.");
      } else {
        setErrorMsg(err.error?.message || "Terjadi kesalahan sistem. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMsg("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 md:p-8" id="login-container">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 md:p-8" id="login-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <BrandMark />
          </div>
          <h1 className="sr-only" id="login-title">Lentera Pasar</h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola website bisnis Anda dengan mudah, pantau lead, dan baca insight pengunjung.
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B283AF]">
            LabKerKomIT Community
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm animate-fadeIn" id="login-error">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-xl text-[#3f6fae] text-sm" id="login-success">
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="••••••••"
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

          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white font-semibold rounded-xl shadow-md shadow-[#649FF6]/10 hover:shadow-[#649FF6]/20 active:translate-y-[1px] transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Accounts */}
        <div className="mt-8 pt-6 border-t border-slate-100" id="demo-accounts-container">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
            Gunakan Akun Demo
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("owner@lenterapasar.test")}
              className="flex flex-col items-start p-2.5 text-left bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition group"
            >
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#649FF6] transition-colors">
                Owner Bisnis (Demo)
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate w-full">
                owner@lenterapasar.test
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("internal@lenterapasar.test")}
              className="flex flex-col items-start p-2.5 text-left bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition group"
            >
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#649FF6] transition-colors">
                Internal Tim (Demo)
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate w-full">
                internal@lenterapasar.test
              </span>
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Kata sandi untuk demo: <strong className="font-mono text-slate-600">password123</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
