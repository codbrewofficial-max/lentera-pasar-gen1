export default function InternalAuditLogsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="h-5 w-64 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
