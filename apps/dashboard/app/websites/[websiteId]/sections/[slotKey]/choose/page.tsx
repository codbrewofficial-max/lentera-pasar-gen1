"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Check,
  AlertCircle,
  CheckCircle,
  Monitor,
  List,
  Expand,
  X
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

const RENDERER_BASE =
  process.env.NEXT_PUBLIC_SITE_RENDERER_URL || "http://localhost:3001";

function SectionPreviewFrame({
  component,
  height = 280,
}: {
  component: string;
  height?: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const src = `${RENDERER_BASE}/preview/section/${encodeURIComponent(component)}`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200"
      style={{ height }}
    >
      {/* Scale wrapper: renders at full 1280px then scales down to fit the card */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{ transform: "scale(0.38)", width: "263%", height: "263%" }}
      >
        {!error && (
          <iframe
            ref={iframeRef}
            src={src}
            title={`Preview ${component}`}
            width={1280}
            height={Math.round(height / 0.38)}
            scrolling="no"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className="block border-0"
          />
        )}
      </div>

      {/* Loading overlay */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-2">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-[10px] text-slate-400 font-mono">
            Memuat preview...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-2">
          <Monitor className="w-8 h-8 text-slate-300" />
          <span className="text-[11px] text-slate-400 text-center font-medium px-4">
            Preview tidak tersedia
          </span>
          <span className="text-[9px] text-slate-300 font-mono">{component}</span>
        </div>
      )}

      {/* Top label badge */}
      {loaded && (
        <div className="absolute top-2 right-2 z-20">
          <span className="text-[9px] font-mono font-semibold bg-black/30 backdrop-blur-sm text-white/80 px-2 py-0.5 rounded">
            Preview
          </span>
        </div>
      )}
    </div>
  );
}

function FullscreenPreview({
  component,
  name,
  onClose,
}: {
  component: string;
  name: string;
  onClose: () => void;
}) {
  const src = `${RENDERER_BASE}/preview/section/${encodeURIComponent(component)}`;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-white/10">
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-[10px] font-mono text-slate-400">{component}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* iframe */}
      <div className="flex-1 overflow-hidden bg-white">
        <iframe
          src={src}
          title={`Fullscreen Preview ${component}`}
          className="w-full h-full border-0"
          scrolling="auto"
        />
      </div>
    </div>
  );
}

export default function ChooseTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const slotKey = params?.slotKey as string;

  const [templates, setTemplates] = useState<TemplateSection[]>([]);
  const [websiteType, setWebsiteType] = useState<string>("company_profile");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual");
  const [fullscreenTpl, setFullscreenTpl] = useState<TemplateSection | null>(null);

  const currentPageKey = slotKey?.includes(".")
    ? slotKey.split(".")[0]
    : "home";
  // Slot "global.navbar" / "global.footer" bukan bagian dari halaman sungguhan (lihat
  // catatan isGlobalChromePage di shared/website-structure.ts) — arahkan balik ke
  // "Halaman & Menu" (page-setup), bukan ke /pages/global yang tidak ada.
  const backDestination = currentPageKey === "global" ? `/websites/${websiteId}/page-setup` : `/websites/${websiteId}/pages/${currentPageKey}`;

  const fetchTemplates = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const websiteRes = await apiCall<{ websiteType: string }>("GET", `websites/${websiteId}`).catch(() => ({ data: null as { websiteType: string } | null }));
      const currentWebsiteType = websiteRes.data?.websiteType || "company_profile";
      setWebsiteType(currentWebsiteType);
      const res = await apiCall<TemplateSection[]>(
        "GET",
        `template-sections/by-slot/${slotKey}?websiteType=${encodeURIComponent(currentWebsiteType)}`
      );
      setTemplates(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal memuat template tampilan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slotKey) Promise.resolve().then(fetchTemplates);
  }, [slotKey]);

  const handleSelectTemplate = async (templateId: string) => {
    setSavingId(templateId);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await apiCall<any>(
        "PATCH",
        `websites/${websiteId}/sections/${slotKey}/template`,
        { templateSectionId: templateId }
      );
      setSuccessMsg("Tampilan section berhasil disimpan!");
      setTimeout(() => {
        router.push(backDestination);
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.error?.message || "Gagal menyimpan pilihan tampilan.");
      setSavingId(null);
    }
  };

  const getSlotLabel = () =>
    templates.length > 0 ? templates[0].slotLabel : slotKey;

  return (
    <DashboardLayout
      title="Pilih Tampilan Section"
      subtitle={`Bagian: ${getSlotLabel()} · ${templates.length} pilihan tersedia`}
      showBackButton={true}
      backUrl={backDestination}
    >
      <div className="space-y-5" id="choose-container">
        {/* Alerts */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Toolbar */}
        {!loading && templates.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Pilih salah satu tampilan di bawah untuk digunakan pada section ini.
            </p>
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("visual")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  viewMode === "visual"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Visual
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Daftar
              </button>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden"
              >
                <div className="h-[280px] bg-slate-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-9 bg-slate-100 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && templates.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Monitor className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">Tampilan Belum Tersedia</h3>
            <p className="text-sm text-slate-500">
              Belum ada pilihan template yang didaftarkan untuk bagian{" "}
              <strong className="text-slate-700">{slotKey}</strong>.
            </p>
          </div>
        )}

        {/* VISUAL MODE */}
        {!loading && templates.length > 0 && viewMode === "visual" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="templates-grid">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all overflow-hidden flex flex-col"
                id={`template-card-${tpl.id}`}
              >
                {/* Preview iframe */}
                <div className="relative group">
                  <SectionPreviewFrame component={tpl.component} height={280} />
                  {/* Expand button */}
                  <button
                    onClick={() => setFullscreenTpl(tpl)}
                    className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"
                  >
                    <Expand className="w-3 h-3" />
                    Lihat Full
                  </button>
                </div>

                {/* Card footer */}
                <div className="p-5 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{tpl.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {tpl.variant} · {tpl.schema.length} field konten
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectTemplate(tpl.id)}
                    disabled={savingId !== null}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-sm transition active:translate-y-[1px]"
                    id={`btn-select-${tpl.id}`}
                  >
                    {savingId === tpl.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Pilih
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIST MODE */}
        {!loading && templates.length > 0 && viewMode === "list" && (
          <div className="space-y-3" id="templates-list">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                    <div
                      className="absolute inset-0 origin-top-left pointer-events-none"
                      style={{ transform: "scale(0.078)", width: "1282%", height: "1282%" }}
                    >
                      <iframe
                        src={`${RENDERER_BASE}/preview/section/${encodeURIComponent(tpl.component)}`}
                        title={`Thumb ${tpl.component}`}
                        width={1280}
                        height={720}
                        scrolling="no"
                        className="block border-0"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{tpl.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{tpl.component}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tpl.schema.slice(0, 4).map((f) => (
                        <span key={f.key} className="bg-slate-100 text-slate-600 text-[9px] font-semibold px-1.5 py-0.5 rounded border border-slate-200">
                          {f.label}
                        </span>
                      ))}
                      {tpl.schema.length > 4 && (
                        <span className="text-[9px] text-slate-400">+{tpl.schema.length - 4} lainnya</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setFullscreenTpl(tpl)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                    title="Lihat Preview"
                  >
                    <Expand className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(tpl.id)}
                    disabled={savingId !== null}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    {savingId === tpl.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Pilih
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {fullscreenTpl && (
        <FullscreenPreview
          component={fullscreenTpl.component}
          name={fullscreenTpl.name}
          onClose={() => setFullscreenTpl(null)}
        />
      )}
    </DashboardLayout>
  );
}
