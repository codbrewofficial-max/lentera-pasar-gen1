export default function LoadingWebsitePageDetail() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
        <div className="h-5 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />
      </div>
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="h-4 w-1/3 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
