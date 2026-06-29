import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">404</p>
        <h1 className="mt-3 text-3xl font-black">Halaman tidak ditemukan</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Halaman ini mungkin belum dipublish, slug/link sudah berubah, atau website belum aktif.
        </p>
        <Link href="/" className="lp-btn lp-btn-primary mt-6">
          Kembali
        </Link>
      </div>
    </main>
  );
}
