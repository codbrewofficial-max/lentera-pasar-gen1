"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  Tag,
  Sparkles
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface ProductItem {
  id: string;
  categoryId?: string | null;
  category?: ProductCategory | null;
  title: string;
  slug: string;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  isActive: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  featuredOrder?: number;
  sortOrder?: number;
  images?: ProductImage[];
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

export default function ProductListPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ pageSize: 12, total: 0, totalPages: 1 });

  const [deletingItem, setDeletingItem] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async (targetPage = page) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<ProductItem[]>("GET", `websites/${websiteId}/products?page=${targetPage}&pageSize=${pageMeta.pageSize}`);
      setItems(res.data || []);
      if (res.meta?.pagination) {
        setPageMeta({
          pageSize: res.meta.pagination.pageSize,
          total: res.meta.pagination.total,
          totalPages: res.meta.pagination.totalPages
        });
      }
    } catch (err: any) {
      console.error("Fetch products error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat daftar produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId) {
      fetchItems(page);
    }
  }, [websiteId, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await apiCall("DELETE", `websites/${websiteId}/products/${deletingItem.id}`);
      showSuccess("Produk berhasil dihapus!");
      setDeletingItem(null);
      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchItems(page);
      }
    } catch (err: any) {
      console.error("Delete product error:", err);
      setErrorMsg(err.error?.message || "Gagal menghapus produk.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.sku || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Kelola Produk"
      subtitle="Atur katalog produk yang dijual di website Anda"
      showBackButton={true}
      backUrl={`/websites/${websiteId}/overview`}
    >
      <div className="space-y-6" id="products-crud-root">
        {successMsg && (
          <div className="p-4 bg-[#649FF6]/10 border border-[#649FF6]/25 rounded-2xl text-[#3f6fae] text-sm flex items-start space-x-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 text-[#649FF6] mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start space-x-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors"
            />
          </div>

          <button
            onClick={() => router.push(`/websites/${websiteId}/content/products/new`)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 transition active:translate-y-[1px]"
            id="btn-add-product"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk</span>
          </button>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat data produk...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Belum Ada Produk</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "Tidak ada produk yang cocok dengan pencarian Anda."
                : "Katalog produk Anda masih kosong. Mari tambahkan produk pertama Anda!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push(`/websites/${websiteId}/content/products/new`)}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#649FF6]/10 text-[#3f6fae] border border-emerald-100 hover:bg-[#649FF6]/15 text-xs font-bold rounded-xl transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Tambah Produk Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="products-grid-list">
            {filteredItems.map((item) => {
              const primaryImage = item.images?.find((img) => img.isPrimary) || item.images?.[0];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-slate-100 border-b border-slate-100 overflow-hidden group">
                      {primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag className="h-10 w-10" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                            item.isActive ? "bg-[#649FF6] text-white" : "bg-slate-700 text-slate-200"
                          }`}
                        >
                          {item.isActive ? "Aktif" : "Draft"}
                        </span>
                        {item.isFeatured && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F56B71]/10 text-[#F56B71] border border-[#F56B71]/20">Unggulan</span>
                        )}
                        {item.isNewArrival && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            <Sparkles className="h-3 w-3" /> Baru
                          </span>
                        )}
                      </div>
                      {item.category && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                          <Tag className="h-3 w-3 text-emerald-400" />
                          <span>{item.category?.name}</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">/{item.slug}{item.sku ? ` · SKU: ${item.sku}` : ""}</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-black text-slate-900">{formatRupiah(item.price)}</span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <span className="text-xs text-slate-400 line-through">{formatRupiah(item.compareAtPrice)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/websites/${websiteId}/content/products/${item.id}/edit`)}
                      className="p-2 text-slate-500 hover:text-[#649FF6] hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-slate-100"
                      title="Edit Produk"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-slate-100"
                      title="Hapus Produk"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <Pagination
            page={page}
            totalPages={pageMeta.totalPages}
            total={pageMeta.total}
            pageSize={pageMeta.pageSize}
            onPageChange={handlePageChange}
            itemLabel="produk"
          />
        )}

        {deletingItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-xl w-full sm:max-w-sm border border-slate-100 space-y-4 animate-scaleUp">
              <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus produk <strong>{deletingItem.title}</strong>? Gambar, varian, dan review produk ini akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2.5 sm:py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2.5 sm:py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/10"
                >
                  {deleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
