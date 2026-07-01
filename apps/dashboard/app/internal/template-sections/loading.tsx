export default function LoadingTemplateSections() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
        <div className="h-5 w-44 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
      {[1, 2, 3].map((page) => (
        <div key={page} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map((slot) => (
              <div key={slot} className="rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-16 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
