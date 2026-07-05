"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, 
  MessageSquare, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Clock,
  Filter,
  ExternalLink,
  Lock
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  interest: string;
  status: 'new' | 'contacted' | 'closed' | 'lost';
  statusLabel: string;
  sourcePageLabel: string;
  sourceSectionLabel: string;
  createdAt: string;
}

function getStatusClass(status: Lead["status"]) {
  switch (status) {
    case "new": 
      return "bg-amber-50 text-amber-800 border border-amber-100";
    case "contacted": 
      return "bg-blue-50 text-blue-800 border border-blue-100";
    case "closed": 
      return "bg-emerald-50 text-emerald-800 border border-emerald-100";
    case "lost": 
      return "bg-rose-50 text-rose-800 border border-rose-100";
    default: 
      return "bg-slate-50 text-slate-800 border border-slate-100";
  }
}

function getAccentClass(status: Lead["status"]) {
  switch (status) {
    case "new": return "bg-amber-400";
    case "contacted": return "bg-blue-500";
    case "closed": return "bg-emerald-500";
    case "lost": return "bg-rose-500";
    default: return "bg-slate-400";
  }
}

export default function LeadsPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [selfServiceOpen, setSelfServiceOpen] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<Lead[]>("GET", `websites/${websiteId}/leads`);
      setLeads(res.data || []);
    } catch (err: any) {
      console.error("Fetch leads error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar lead masuk.");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (websiteId) {
      Promise.resolve().then(() => {
        fetchLeads();
      });
    }
  }, [websiteId]);


  const handleUpdateStatus = async (leadId: string, nextStatus: 'contacted' | 'closed' | 'lost') => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiCall<Lead>("PATCH", `websites/${websiteId}/leads/${leadId}/status`, {
        status: nextStatus
      });

      // Update local state with patched lead data
      setLeads(prev => prev.map(l => 
        l.id === leadId 
          ? { ...l, status: res.data.status, statusLabel: res.data.statusLabel } 
          : l
      ));

      setSuccessMsg("Status lead berhasil diperbarui.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Update lead status error:", err);
      setErrorMsg(err.error?.message || "Gagal memperbarui status lead.");
    }
  };

  const filteredLeads = leads.filter(l => {
    if (filterStatus === "all") return true;
    return l.status === filterStatus;
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) + " WIB";
    } catch (e) {
      return dateStr;
    }
  };

  const getWhatsAppLink = (lead: Lead) => {
    // Sanitize phone number (replace +62 or 0 at start with 62)
    let cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.substring(1);
    }
    
    const text = encodeURIComponent(
      `Halo ${lead.name},\n\nTerima kasih telah meninggalkan pesan di website kami mengenai "${lead.interest}".\n\nSaya perwakilan dari Lentera Pasar ingin menindaklanjuti pesan Anda: "${lead.message}"`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <DashboardLayout 
      title="Lead Masuk" 
      subtitle="Hubungi calon pelanggan potensial yang mendaftarkan formulir kontak di website Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >

      {!selfServiceOpen ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 max-w-2xl mx-auto text-center space-y-5">
          <div className="h-14 w-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            {/* Gunakan Lock atau ShieldAlert sesuai preferensi */}
            <Lock className="h-7 w-7" /> 
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-800">Akses Halaman Leads Dibatasi</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Fitur untuk melihat prospek dan pesan masuk calon pelanggan saat ini terkunci. Anda membutuhkan persetujuan dari Owner Platform untuk mengakses halaman ini.
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-start gap-3 text-left">
            <Mail className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Jika Anda merasa membutuhkan akses ke data Leads untuk website ini, silakan hubungi Owner Platform agar izin akses dapat segera dibuka.
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
        <div className="space-y-6" id="leads-container">
        
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-start space-x-3 animate-fadeIn">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm" id="leads-filters">
            <div className="flex items-center space-x-2 text-slate-700">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Saring Lead:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "Semua Lead" },
                { key: "new", label: "Baru" },
                { key: "contacted", label: "Sudah Dihubungi" },
                { key: "closed", label: "Closing" },
                { key: "lost", label: "Tidak Lanjut" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    filterStatus === tab.key
                      ? "bg-emerald-600 text-white shadow-sm font-bold"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Leads card list */}
          {loading ? (
            <div className="space-y-4" id="leads-loading-list">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 h-44 animate-pulse" />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3" id="leads-empty-state">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <Users className="h-8 w-8" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-sm font-bold text-slate-800">Belum Ada Lead</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tidak ada data calon pelanggan yang masuk untuk penyaringan status ini.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6" id="leads-list">
              {filteredLeads.map((lead) => (
                <div 
                  key={lead.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                  id={`lead-card-${lead.id}`}
                >
                  {/* Visual Accent for Status */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${getAccentClass(lead.status)}`} />

                  <div className="space-y-4">
                    {/* Card Header Info */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{lead.name}</h3>
                        <div className="flex items-center text-[10px] text-slate-400 font-medium space-x-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Masuk pada: {formatDate(lead.createdAt)}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusClass(lead.status)}`}>
                        {lead.statusLabel}
                      </span>
                    </div>

                    {/* Message & Interest */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="md:col-span-2 space-y-1 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">Pesan Inkuiri</span>
                        <p className="text-slate-700 italic font-medium leading-relaxed">
                          &ldquo;{lead.message}&rdquo;
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">Minat Produk / Layanan</span>
                          <span className="font-bold text-slate-800">{lead.interest}</span>
                        </div>
                        <div>
                          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">Sumber Halaman Web</span>
                          <span className="text-slate-500 font-medium">{lead.sourcePageLabel} ({lead.sourceSectionLabel})</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center space-x-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl font-mono">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </div>

                      <div className="flex items-center space-x-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl font-mono">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operations Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
                    {/* Status Toggle buttons */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">Ubah Status:</span>
                      {lead.status !== "contacted" && (
                        <button
                          onClick={() => handleUpdateStatus(lead.id, "contacted")}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 rounded-xl font-semibold transition"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          <span>Hubungi</span>
                        </button>
                      )}
                      {lead.status !== "closed" && (
                        <button
                          onClick={() => handleUpdateStatus(lead.id, "closed")}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 rounded-xl font-semibold transition"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Closing</span>
                        </button>
                      )}
                      {lead.status !== "lost" && (
                        <button
                          onClick={() => handleUpdateStatus(lead.id, "lost")}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 rounded-xl font-semibold transition"
                        >
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Tidak Lanjut</span>
                        </button>
                      )}
                    </div>

                    {/* Reach prospect directly */}
                    <div className="flex items-center gap-2">
                      {lead.phone && (
                        <a
                          href={getWhatsAppLink(lead)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition active:translate-y-[1px]"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>WhatsApp Pelanggan</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
