"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { apiCall } from "@/lib/api";
import {
  AlertCircle,
  Clock,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Globe,
  FileText
} from "lucide-react";

type AuditActor = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type AuditWebsite = {
  id: string;
  name: string;
  slug: string;
  status: string;
} | null;

type AuditLogItem = {
  id: string;
  category: "audit" | "security" | "system" | string;
  action: string;
  actorUserId: string | null;
  actorRole: string | null;
  actor: AuditActor;
  websiteId: string | null;
  website: AuditWebsite;
  entityType: string | null;
  entityId: string | null;
  summary: string;
  metadata: unknown;
  ipHash: string | null;
  userAgent: string | null;
  requestId: string | null;
  createdAt: string;
};

type AuditResponse = {
  items: AuditLogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const categoryOptions = [
  { value: "", label: "Semua kategori" },
  { value: "security", label: "Security" },
  { value: "audit", label: "Audit" },
  { value: "system", label: "System" }
];

function categoryLabel(category: string) {
  if (category === "security") return "Security";
  if (category === "audit") return "Audit";
  if (category === "system") return "System";
  return category;
}

function categoryClass(category: string) {
  if (category === "security") return "bg-rose-50 text-rose-700 border-rose-100";
  if (category === "system") return "bg-sky-50 text-sky-700 border-sky-100";
  return "bg-emerald-50 text-emerald-700 border-emerald-100";
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function metadataPreview(value: unknown) {
  if (!value) return null;
  try {
    const text = JSON.stringify(value, null, 2);
    return text.length > 700 ? `${text.slice(0, 700)}\n...` : text;
  } catch {
    return String(value);
  }
}

export default function InternalAuditLogsPage() {
  const [items, setItems] = useState<AuditLogItem[]>([]);
  const [pagination, setPagination] = useState<AuditResponse["pagination"]>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1
  });
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", String(pagination.limit || 50));
    params.set("page", String(pagination.page || 1));
    if (category) params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    if (action.trim()) params.set("action", action.trim());
    return params.toString();
  }, [category, query, action, pagination.limit, pagination.page]);

  const loadLogs = async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);

    setError(null);
    try {
      const res = await apiCall<AuditResponse>("GET", `internal/audit-logs?${queryString}`);
      setItems(res.data.items || []);
      setPagination(res.data.pagination || { page: 1, limit: 50, total: 0, totalPages: 1 });
    } catch (err: any) {
      setError(err?.error?.message || err?.message || "Audit log belum berhasil dimuat.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs("initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const resetFilters = () => {
    setCategory("");
    setQuery("");
    setAction("");
    setPagination((current) => ({ ...current, page: 1 }));
  };

  return (
    <DashboardLayout
      title="Audit Log"
      subtitle="Riwayat aktivitas penting dan security event untuk kebutuhan monitoring internal."
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Database Audit Log
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Aktivitas penting sistem</h3>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Halaman ini menyimpan event penting seperti login, publish website, perubahan halaman/menu,
                upload template, dan perubahan konten. Request log teknis tetap berada di terminal/Docker logs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadLogs("refresh")}
              disabled={refreshing || loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Memuat ulang..." : "Refresh Data"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="h-4 w-4 text-slate-400" />
            Filter Audit Log
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Kategori</span>
              <select
                value={category}
                onChange={(event) => {
                  setPagination((current) => ({ ...current, page: 1 }));
                  setCategory(event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Action persis</span>
              <input
                value={action}
                onChange={(event) => {
                  setPagination((current) => ({ ...current, page: 1 }));
                  setAction(event.target.value);
                }}
                placeholder="website.published"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
              />
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-semibold text-slate-500">Cari ringkasan/action</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => {
                    setPagination((current) => ({ ...current, page: 1 }));
                    setQuery(event.target.value);
                  }}
                  placeholder="Cari publish, login, template, halaman..."
                  className="w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Total data: <span className="font-semibold text-slate-800">{pagination.total}</span>
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Reset Filter
            </button>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Audit log belum bisa dimuat.</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="space-y-4 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-100 p-4">
                  <div className="h-4 w-32 rounded bg-slate-100" />
                  <div className="mt-3 h-5 w-2/3 rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center">
              <Clock className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">Belum ada audit log</h3>
              <p className="mt-1 text-sm text-slate-500">
                Aktivitas penting akan muncul setelah ada login, publish, perubahan konten, atau upload template.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const preview = metadataPreview(item.metadata);
                return (
                  <article key={item.id} className="p-5 transition hover:bg-slate-50/60">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${categoryClass(item.category)}`}>
                            {categoryLabel(item.category)}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                            {item.action}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        <h3 className="mt-3 text-sm font-bold text-slate-900 md:text-base">{item.summary}</h3>

                        <div className="mt-2 grid gap-2 text-xs text-slate-500 md:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              Aktor:{" "}
                              <strong className="text-slate-700">
                                {item.actor ? `${item.actor.name} (${item.actor.email})` : "System / Public"}
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              Website:{" "}
                              <strong className="text-slate-700">
                                {item.website ? `${item.website.name} / ${item.website.slug}` : "-"}
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              Entity:{" "}
                              <strong className="text-slate-700">
                                {item.entityType || "-"} {item.entityId ? `(${item.entityId.slice(0, 8)}...)` : ""}
                              </strong>
                            </span>
                          </div>
                          <div className="text-slate-400">Request ID: {item.requestId || "-"}</div>
                        </div>

                        {preview && (
                          <details className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                            <summary className="cursor-pointer text-xs font-bold text-slate-600">Lihat metadata</summary>
                            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                              {preview}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={pagination.page <= 1 || loading}
            onClick={() => setPagination((current) => ({ ...current, page: Math.max(current.page - 1, 1) }))}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <p className="text-xs text-slate-500">
            Halaman {pagination.page} dari {pagination.totalPages}
          </p>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => setPagination((current) => ({ ...current, page: Math.min(current.page + 1, current.totalPages) }))}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
