"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertCircle, CheckCircle, Layers, Search } from "lucide-react";

interface TemplateSection {
  id: string | number;
  pageKey?: string | null;
  pageLabel?: string | null;
  slotKey: string;
  slotLabel: string;
  component: string;
  variant?: string | null;
  name?: string | null;
  status?: "draft" | "active" | "invalid";
  statusLabel?: string;
  validationErrors?: any;
  templatePack?: {
    id: string | number;
    templatePackKey: string;
    name: string;
    status: string;
  } | null;
}

const pageOrder = ["home", "about", "services", "portfolio", "articles", "article_detail", "contact"];

export default function InternalTemplateSectionsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [templates, setTemplates] = useState<TemplateSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTemplates = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<TemplateSection[]>("GET", "template-sections?websiteType=company_profile&includeDraft=true");
      setTemplates(res.data || []);
    } catch (err: any) {
      setErrorMsg(err.error?.message || err.message || "Gagal memuat pustaka template section.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("LP_USER");
    const token = localStorage.getItem("LP_AUTH_TOKEN");
    if (!token || !userStr) {
      router.replace("/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role === "internal_admin") {
        setAuthorized(true);
        fetchTemplates();
      } else {
        setAuthorized(false);
        setLoading(false);
      }
    } catch {
      router.replace("/login");
    }
  }, []);

  const filteredTemplates = templates.filter((tpl) => {
    const q = searchQuery.toLowerCase();
    return (
      tpl.slotKey?.toLowerCase().includes(q) ||
      tpl.slotLabel?.toLowerCase().includes(q) ||
      tpl.component?.toLowerCase().includes(q) ||
      tpl.name?.toLowerCase().includes(q)
    );
  });

  const groupedPages = useMemo(() => {
    const pageMap = new Map<string, { pageKey: string; pageLabel: string; slots: Map<string, TemplateSection[]> }>();
    for (const tpl of filteredTemplates) {
      const pageKey = tpl.pageKey || tpl.slotKey.split(".")[0];
      const pageLabel = tpl.pageLabel || pageKey;
      if (!pageMap.has(pageKey)) pageMap.set(pageKey, { pageKey, pageLabel, slots: new Map() });
      const page = pageMap.get(pageKey)!;
      if (!page.slots.has(tpl.slotKey)) page.slots.set(tpl.slotKey, []);
      page.slots.get(tpl.slotKey)!.push(tpl);
    }
    return Array.from(pageMap.values()).sort((a, b) => pageOrder.indexOf(a.pageKey) - pageOrder.indexOf(b.pageKey));
  }, [filteredTemplates]);

  const statusClass = (status?: string) => {
    if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "invalid") return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  if (authorized === false) {
    return (
      <DashboardLayout title="Akses Ditolak" showBackButton={true} backUrl="/websites">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-sm text-slate-500">Halaman ini hanya untuk tim internal Labkerkomit.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Template Section"
      subtitle="Browser pustaka template berdasarkan Tipe Website, Halaman, Section, dan Template Variant"
      showBackButton={true}
      backUrl="/internal"
    >
      <div className="space-y-6" id="internal-templates-root">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipe Website</span>
              <div className="mt-1 inline-flex px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
                Company Profile
              </div>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Cari section, komponen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-3xl border border-slate-200 h-32 animate-pulse" />)}
          </div>
        ) : groupedPages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <Layers className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Template Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500">Tidak ada template section yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedPages.map((page) => (
              <div key={page.pageKey} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Halaman</span>
                    <h3 className="font-bold text-slate-900 text-base">{page.pageLabel}</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                    {page.pageKey}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {Array.from(page.slots.entries()).map(([slotKey, slotTemplates]) => (
                    <div key={slotKey} className="p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section</span>
                          <h4 className="font-bold text-slate-800 text-sm">{slotTemplates[0]?.slotLabel || slotKey}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{slotKey}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Template Tersedia: {slotTemplates.length}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {slotTemplates.map((tpl) => (
                          <div key={tpl.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h5 className="text-sm font-bold text-slate-900">{tpl.name || tpl.component}</h5>
                                <p className="text-[10px] text-slate-400 font-mono">{tpl.component} / {tpl.variant || "default"}</p>
                                {tpl.templatePack && (
                                  <p className="text-[10px] text-slate-500 mt-1">
                                    Template Pack: <span className="font-semibold text-slate-700">{tpl.templatePack.name}</span>
                                  </p>
                                )}
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusClass(tpl.status)}`}>
                                {tpl.statusLabel || tpl.status || "Draft"}
                              </span>
                            </div>
                            {tpl.validationErrors && (
                              <div className="text-[10px] text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-2">
                                {typeof tpl.validationErrors === "string" ? tpl.validationErrors : JSON.stringify(tpl.validationErrors)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
