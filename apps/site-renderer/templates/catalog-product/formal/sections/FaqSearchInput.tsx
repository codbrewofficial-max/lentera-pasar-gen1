'use client';

// Memfilter daftar pertanyaan di section Accordion (slot berbeda, dirender terpisah oleh
// RenderSections) lewat DOM query sederhana (data-faq-item / data-faq-question), bukan lewat
// React state — karena Hero dan Accordion adalah dua komponen section independen tanpa
// parent React yang sama.
export function FaqSearchInput() {
  return (
    <div className="mx-auto mt-8 max-w-xl">
      <input
        type="search"
        placeholder="Cari pertanyaan, mis. cara pesan, retur, pembayaran..."
        aria-label="Cari pertanyaan"
        onChange={(event) => {
          const query = event.currentTarget.value.trim().toLowerCase();
          document.querySelectorAll<HTMLElement>('[data-faq-item]').forEach((element) => {
            const question = (element.getAttribute('data-faq-question') || '').toLowerCase();
            element.style.display = !query || question.includes(query) ? '' : 'none';
          });
        }}
        className="w-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-slate-400 focus:border-white/50 focus:outline-none"
      />
    </div>
  );
}
