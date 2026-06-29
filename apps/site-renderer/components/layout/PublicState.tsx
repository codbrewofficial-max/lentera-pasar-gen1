export function PublicPageLoading({ label = 'Sedang memuat website...' }: { label?: string }) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="lp-section">
        <div className="lp-container">
          <div className="animate-pulse space-y-8">
            <div className="h-5 w-40 rounded-full bg-slate-200" />
            <div className="h-12 max-w-2xl rounded-2xl bg-slate-200" />
            <div className="h-6 max-w-xl rounded-2xl bg-slate-100" />
            <div className="grid gap-5 md:grid-cols-3">
              <div className="h-48 rounded-[28px] bg-slate-100" />
              <div className="h-48 rounded-[28px] bg-slate-100" />
              <div className="h-48 rounded-[28px] bg-slate-100" />
            </div>
          </div>
          <p className="mt-8 text-sm font-semibold text-slate-500">{label}</p>
        </div>
      </section>
    </main>
  );
}

export function PublicEmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
