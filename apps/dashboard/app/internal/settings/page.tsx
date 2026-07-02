"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertCircle, CheckCircle, Globe, Lock, Unlock, ShieldAlert } from "lucide-react";

export default function InternalSettingsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmingChange, setConfirmingChange] = useState<boolean | null>(null);

  const fetchSetting = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<{ enabled: boolean }>("GET", "settings/public-activation");
      setEnabled(!!res.data?.enabled);
    } catch (err: any) {
      console.error("Fetch public activation error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat status aktivasi publik.");
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
            fetchSetting();
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

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleConfirmToggle = async () => {
    if (confirmingChange === null) return;
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await apiCall<{ enabled: boolean }>("PATCH", "internal/settings/public-activation", {
        enabled: confirmingChange
      });
      setEnabled(!!res.data?.enabled);
      showSuccess(
        confirmingChange
          ? "Aktivasi publik berhasil DINYALAKAN. Pendaftaran mandiri dan pembuatan website oleh owner sekarang terbuka."
          : "Aktivasi publik berhasil DIMATIKAN. Pendaftaran mandiri dan pembuatan website oleh owner sekarang terkunci."
      );
      setConfirmingChange(null);
    } catch (err: any) {
      console.error("Toggle public activation error:", err);
      setErrorMsg(err.error?.message || "Gagal mengubah pengaturan aktivasi publik.");
    } finally {
      setSaving(false);
    }
  };

  if (authorized === false) {
    return (
      <DashboardLayout title="Akses Ditolak" showBackButton={true} backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-sm text-slate-500">Halaman ini hanya untuk tim internal Labkerkomit.</p>
          <button
            onClick={() => router.push("/websites")}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            Kembali ke Beranda
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Pengaturan Publik"
      subtitle="Kontrol siapa yang bisa mendaftar mandiri dan membuat website sendiri"
    >
      <div className="space-y-6 max-w-2xl">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-800 text-sm">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 h-40 animate-pulse" />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {enabled ? <Unlock className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Aktivasi Publik</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-md">
                    Kalau <strong>mati (default)</strong>: halaman pendaftaran (
                    <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/register</code>) dan
                    pembuatan website mandiri oleh owner terkunci. Owner cuma bisa pakai akun & website
                    yang dibuatkan tim internal lewat panel Owner Bisnis / Daftar Website.
                    <br />
                    <br />
                    Kalau <strong>nyala</strong>: siapa saja bisa daftar sendiri, dan owner bisa membuat
                    website sendiri lewat dashboard-nya.
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setConfirmingChange(!enabled)}
                className={`relative shrink-0 inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  enabled ? "bg-emerald-500" : "bg-slate-300"
                }`}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    enabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 text-sm ${
                enabled
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              {enabled ? <Globe className="h-5 w-5 shrink-0 mt-0.5" /> : <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />}
              <span>
                Status saat ini: <strong>{enabled ? "NYALA — terbuka untuk publik" : "MATI — hanya akun/website buatan internal"}</strong>
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 space-y-1">
              <p>Yang terdampak toggle ini:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Halaman <code className="bg-slate-100 px-1 py-0.5 rounded">/register</code> (pendaftaran akun role "user")</li>
                <li>Tombol "Buat Website Baru" milik owner di dashboard (<code className="bg-slate-100 px-1 py-0.5 rounded">/websites/new</code>)</li>
              </ul>
              <p className="pt-1">
                Panel internal (Owner Bisnis, Daftar Website) <strong>tidak terpengaruh</strong> — tim
                internal selalu bisa bikin akun owner & website kapan saja, toggle ini atau tidak.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal konfirmasi toggle */}
      {confirmingChange !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              {confirmingChange ? "Nyalakan Aktivasi Publik?" : "Matikan Aktivasi Publik?"}
            </h3>
            <p className="text-sm text-slate-500">
              {confirmingChange
                ? "Setelah dinyalakan, siapa saja bisa mendaftar mandiri lewat /register, dan owner bisa membuat website sendiri tanpa perlu dibuatkan internal."
                : "Setelah dimatikan, halaman /register akan menolak pendaftaran baru, dan owner tidak bisa lagi membuat website sendiri — hanya bisa pakai yang dibuatkan internal."}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmingChange(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : confirmingChange ? "Ya, Nyalakan" : "Ya, Matikan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
