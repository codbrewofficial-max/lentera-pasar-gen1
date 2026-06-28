"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  AlertCircle, 
  Sparkles, 
  Layers, 
  MousePointer, 
  Share2, 
  HelpCircle,
  FileText,
  BarChart3
} from "lucide-react";

interface InsightCard {
  key: string;
  label: string;
  value: number;
  helpText?: string;
}

interface InsightHighlightItem {
  label: string;
  value: string | null;
  total: number;
}

interface SummaryData {
  cards: InsightCard[];
  highlights: {
    topPage?: InsightHighlightItem | null;
    topService?: InsightHighlightItem | null;
    topPortfolio?: InsightHighlightItem | null;
  };
}

interface PageStat {
  pageKey: string;
  pageLabel: string;
  pageSlug: string;
  total: number;
}

interface SectionStat {
  slotKey: string;
  slotLabel: string;
  sectionKey: string;
  sectionName: string;
  total: number;
}

interface CtaStat {
  ctaKey: string;
  ctaLabel: string;
  slotKey: string;
  slotLabel: string;
  total: number;
}

interface TrafficStat {
  source: string;
  label: string;
  total: number;
}

export default function InsightsPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topPages, setTopPages] = useState<PageStat[]>([]);
  const [topSections, setTopSections] = useState<SectionStat[]>([]);
  const [topCtas, setTopCtas] = useState<CtaStat[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficStat[]>([]);

  const fetchAllInsights = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Fetch summary
      const summaryRes = await apiCall<SummaryData>("GET", `websites/${websiteId}/insights/summary`);
      setSummary(summaryRes.data);

      // 2. Fetch top pages
      try {
        const pagesRes = await apiCall<PageStat[]>("GET", `websites/${websiteId}/insights/top-pages`);
        setTopPages(pagesRes.data || []);
      } catch (e) { console.error("Error loading top-pages", e); }

      // 3. Fetch top sections
      try {
        const sectionsRes = await apiCall<SectionStat[]>("GET", `websites/${websiteId}/insights/top-sections`);
        setTopSections(sectionsRes.data || []);
      } catch (e) { console.error("Error loading top-sections", e); }

      // 4. Fetch top ctas
      try {
        const ctasRes = await apiCall<CtaStat[]>("GET", `websites/${websiteId}/insights/top-ctas`);
        setTopCtas(ctasRes.data || []);
      } catch (e) { console.error("Error loading top-ctas", e); }

      // 5. Fetch traffic sources
      try {
        const trafficRes = await apiCall<TrafficStat[]>("GET", `websites/${websiteId}/insights/traffic-sources`);
        setTrafficSources(trafficRes.data || []);
      } catch (e) { console.error("Error loading traffic-sources", e); }

    } catch (err: any) {
      console.error("Fetch all insights error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat insight pengunjung.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      Promise.resolve().then(() => {
        fetchAllInsights();
      });
    }
  }, [websiteId]);


  if (loading) {
    return (
      <DashboardLayout title="Memuat Analitik..." showBackButton={true} backUrl={`/websites/${websiteId}/overview`}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  // Find max values for percentages
  const maxViews = topPages.length > 0 ? Math.max(...topPages.map(p => p.total)) : 100;
  const maxSectionClicks = topSections.length > 0 ? Math.max(...topSections.map(s => s.total)) : 100;
  const maxCtaClicks = topCtas.length > 0 ? Math.max(...topCtas.map(c => c.total)) : 100;
  const maxReferrals = trafficSources.length > 0 ? Math.max(...trafficSources.map(t => t.total)) : 100;

  // Extract highlights array from backend highlights dictionary
  const highlightList = summary?.highlights 
    ? Object.values(summary.highlights).filter((h): h is InsightHighlightItem => h !== null && h !== undefined)
    : [];

  return (
    <DashboardLayout 
      title="Insight Pengunjung" 
      subtitle="Analisis performa, kunjungan halaman, dan rasio konversi tombol kontak website Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="insights-container">
        
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Metric Cards Grid */}
        {summary && summary.cards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="metric-cards">
            {summary.cards.map((card) => (
              <div 
                key={card.key} 
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <div className="my-2.5">
                  <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                    {card.value.toLocaleString()}
                  </span>
                </div>
                {card.helpText && (
                  <div className="text-[11px] text-slate-500 italic mt-1 leading-normal flex items-start gap-1">
                    <BarChart3 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <span>{card.helpText}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Smart Highlights */}
        {highlightList.length > 0 && (
          <div className="bg-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4" id="ai-insights-box">
            <div className="flex items-center space-x-2 text-emerald-300">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wide">Temuan & Rekomendasi Pintar</span>
            </div>
            
            <div className="space-y-3.5">
              {highlightList.map((h, hIdx) => (
                <div key={hIdx} className="flex items-start space-x-3 text-xs leading-relaxed text-emerald-100">
                  <span className="h-5 w-5 rounded-lg bg-emerald-800 text-emerald-300 font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    {hIdx + 1}
                  </span>
                  <span>
                    <strong>{h.label}</strong>: {h.value || "N/A"} <span className="text-emerald-300">({h.total.toLocaleString()} interaksi)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Split Grid for charts lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="insights-analytics-lists">
          
          {/* 1. Halaman Terpopuler */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-sm uppercase tracking-wide">Halaman Terpopuler</h3>
            </div>

            {topPages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Data halaman belum terekam.</p>
            ) : (
              <div className="space-y-4">
                {topPages.map((p, idx) => {
                  const pct = maxViews > 0 ? (p.total / maxViews) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-800">{p.pageLabel} <span className="text-[10px] text-slate-400 font-mono">({p.pageSlug})</span></span>
                        <span className="text-slate-900 font-mono">{p.total.toLocaleString()} views</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Sumber Trafik */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3">
              <Share2 className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-sm uppercase tracking-wide">Sumber Trafik Terbesar</h3>
            </div>

            {trafficSources.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Data sumber trafik belum terekam.</p>
            ) : (
              <div className="space-y-4">
                {trafficSources.map((t, idx) => {
                  const pct = maxReferrals > 0 ? (t.total / maxReferrals) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-800">{t.label || t.source}</span>
                        <span className="text-slate-900 font-mono">{t.total.toLocaleString()} rujukan</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Bagian Paling Menarik */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3">
              <Layers className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-sm uppercase tracking-wide">Bagian (Section) Terpopuler</h3>
            </div>

            {topSections.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Data interaksi bagian belum terekam.</p>
            ) : (
              <div className="space-y-4">
                {topSections.map((s, idx) => {
                  const pct = maxSectionClicks > 0 ? (s.total / maxSectionClicks) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-800">{s.slotLabel} <span className="text-[10px] text-slate-400 font-mono">({s.sectionName})</span></span>
                        <span className="text-slate-900 font-mono">{s.total.toLocaleString()} interaksi</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Tombol Aksi Tersukses */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3">
              <MousePointer className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-sm uppercase tracking-wide">Tombol Aksi (CTA) Tersukses</h3>
            </div>

            {topCtas.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Data klik CTA belum terekam.</p>
            ) : (
              <div className="space-y-4">
                {topCtas.map((c, idx) => {
                  const pct = maxCtaClicks > 0 ? (c.total / maxCtaClicks) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-800">{c.ctaLabel} <span className="text-[10px] text-slate-400 font-mono">({c.slotLabel})</span></span>
                        <span className="text-slate-900 font-mono">{c.total.toLocaleString()} klik</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Small Notice */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-2.5 text-xs text-slate-500">
          <HelpCircle className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
          <span>
            Data insight diperbarui dari aktivitas pengunjung yang berhasil terekam.
          </span>
        </div>

      </div>
    </DashboardLayout>
  );
}
