export default function LoadingWebsites() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="h-5 w-2/3 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
