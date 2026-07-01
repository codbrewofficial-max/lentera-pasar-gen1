// Catatan: cn() di sini sengaja TIDAK pakai dependency clsx/tailwind-merge
// (paket itu tidak terdaftar di package.json apps/site-renderer) supaya tidak perlu
// menambah dependency baru. Tidak ada komponen Premium yang benar-benar memanggil cn()
// saat ini, fungsi ini disediakan sebagai utility cadangan saja, mengikuti pola yang
// sama dengan formal/source/lib/utils.ts dan casual/source/lib/utils.ts.
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
