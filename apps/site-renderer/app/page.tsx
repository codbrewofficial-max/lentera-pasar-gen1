export default function RendererIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="lp-eyebrow">Lentera Pasar</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">Site Renderer aktif.</h1>
        <p className="mt-4 text-slate-600">
          Buka website publik dengan format lokal: <code className="rounded bg-slate-100 px-2 py-1">/site-slug</code>,
          misalnya <code className="rounded bg-slate-100 px-2 py-1">/lentera-demo</code>.
        </p>
      </section>
    </main>
  );
}
