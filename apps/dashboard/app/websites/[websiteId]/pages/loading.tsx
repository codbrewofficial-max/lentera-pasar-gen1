export default function LoadingWebsitePages() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
        <div className="h-5 w-56 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="h-5 w-1/2 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
