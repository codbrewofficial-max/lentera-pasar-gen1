export default function LoadingPageSetup() {
  return (
    <div className="space-y-4 p-6">
      <div className="h-8 w-56 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-100 border border-slate-200" />
        ))}
      </div>
    </div>
  );
}
