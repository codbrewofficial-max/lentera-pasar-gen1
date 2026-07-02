"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiCall } from "@/lib/api";
import { MailCheck, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500 font-medium">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent mb-4" />
          <span>Memeriksa status verifikasi...</span>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

type VerifyState = "checking" | "success" | "error" | "pending";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [state, setState] = useState<VerifyState>(token ? "checking" : "pending");
  const [errorMsg, setErrorMsg] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setState("pending");
      return;
    }
    const verify = async () => {
      try {
        await apiCall("POST", "auth/verify-email", { token });
        setState("success");
      } catch (err: any) {
        console.error("Verify email error:", err);
        setErrorMsg(err.error?.message || "Tautan verifikasi tidak valid atau sudah kedaluwarsa.");
        setState("error");
      }
    };
    verify();
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    try {
      await apiCall("POST", "auth/resend-verification");
      setResendMsg("Email verifikasi baru sudah dikirim. Cek kotak masuk (dan folder spam) kamu.");
    } catch (err: any) {
      console.error("Resend verification error:", err);
      if (err.error?.code === "UNAUTHORIZED") {
        setResendMsg("Silakan login dulu untuk mengirim ulang email verifikasi.");
      } else {
        setResendMsg(err.error?.message || "Gagal mengirim ulang email verifikasi.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 md:p-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 md:p-8 text-center">
        <div className="mb-4 flex justify-center">
          <BrandMark />
        </div>

        {state === "checking" && (
          <div className="space-y-4 py-4">
            <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-[#649FF6] border-t-transparent" />
            <p className="text-sm text-slate-500">Memverifikasi email kamu...</p>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-4 py-2">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Email Terverifikasi!</h2>
            <p className="text-sm text-slate-500">Terima kasih, email kamu sudah berhasil diverifikasi.</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#649FF6] hover:bg-[#4f8be6] text-white font-semibold rounded-xl transition"
            >
              Lanjut ke Login
            </Link>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4 py-2">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Verifikasi Gagal</h2>
            <p className="text-sm text-slate-500">{errorMsg}</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
            </button>
            {resendMsg && <p className="text-xs text-slate-500">{resendMsg}</p>}
          </div>
        )}

        {state === "pending" && (
          <div className="space-y-4 py-2">
            <MailCheck className="h-12 w-12 text-[#649FF6] mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Cek Email Kamu</h2>
            <p className="text-sm text-slate-500">
              Kami sudah mengirim tautan verifikasi ke email kamu. Buka email tersebut dan klik
              tautannya untuk mengaktifkan akun.
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
            </button>
            {resendMsg && <p className="text-xs text-slate-500">{resendMsg}</p>}
          </div>
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
