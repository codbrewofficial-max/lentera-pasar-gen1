"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  LayoutTemplate, 
  Check, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface TemplateSection {
  id: string;
  name: string;
  websiteTypeLabel: string;
  slotKey: string;
  slotLabel: string;
  variant: string;
  component: string;
  schema: Array<{
    key: string;
    label: string;
    type: "text" | "textarea" | "image_url" | "url";
    required?: boolean;
    placeholder?: string | null;
    helpText?: string | null;
  }>;
}

export default function ChooseTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const slotKey = params?.slotKey as string;

  const [templates, setTemplates] = useState<TemplateSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const currentPageKey = slotKey.includes(".") ? slotKey.split(".")[0] : "home";

  const fetchTemplates = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<TemplateSection[]>("GET", `template-sections/by-slot/${slotKey}`);
      setTemplates(res.data || []);
    } catch (err: any) {
      console.error("Fetch templates error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat template tampilan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slotKey) {
      Promise.resolve().then(() => {
        fetchTemplates();
      });
    }
  }, [slotKey]);



  const handleSelectTemplate = async (templateId: string) => {
    setSavingId(templateId);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiCall<any>("PATCH", `websites/${websiteId}/sections/${slotKey}/template`, {
        templateSectionId: templateId
      });

      setSuccessMsg("Tampilan section berhasil disimpan!");
      setTimeout(() => {
        router.push(`/websites/${websiteId}/pages/${currentPageKey}`);
      }, 800);
    } catch (err: any) {
      console.error("Select template error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan pilihan tampilan.");
      setSavingId(null);
    }
  };

  const getSlotLabel = () => {
    if (templates.length > 0) return templates[0].slotLabel;
    return slotKey;
  };

  return (
    <DashboardLayout 
      title="Pilih Tampilan Section" 
      subtitle={`Bagian: ${getSlotLabel()} | Key: ${slotKey}`}
      showBackButton={true}
      backUrl={`/websites/${websiteId}/pages/${currentPageKey}`}
    >
      <div className="space-y-6" id="choose-container">
        
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="choose-loading-grid">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-56 animate-pulse" />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <LayoutTemplate className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">Tampilan Belum Tersedia</h3>
            <p className="text-sm text-slate-500">
              Belum ada pilihan template layout yang didaftarkan untuk bagian <strong className="text-slate-700">{slotKey}</strong>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="templates-grid">
            {templates.map((tpl) => (
              <div 
                key={tpl.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all p-6 flex flex-col justify-between"
                id={`template-card-${tpl.id}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{tpl.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Tipe Variant: {tpl.variant}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                      {tpl.component}
                    </span>
                  </div>

                  {/* Visual Preview Box */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center items-center h-28 text-center text-xs text-slate-400">
                    <Sparkles className="h-5 w-5 text-emerald-500 mb-2" />
                    <span>Visual layout template render preview</span>
                    <span className="text-[10px] text-slate-300 font-mono mt-1">({tpl.component} component)</span>
                  </div>

                  {/* Fields list / schema preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Data Yang Perlu Diisi:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.schema.map((f, fIdx) => (
                        <span 
                          key={fIdx}
                          className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-[10px] font-semibold border border-slate-200/50"
                        >
                          {f.label} <span className="text-slate-400 font-normal">({f.type})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectTemplate(tpl.id)}
                  disabled={savingId !== null}
                  className="w-full mt-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md transition active:translate-y-[1px] flex items-center justify-center space-x-1.5"
                >
                  {savingId === tpl.id ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sedang Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Pilih Tampilan Ini</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
