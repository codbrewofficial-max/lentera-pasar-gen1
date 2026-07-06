"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import {
  Globe,
  LayoutDashboard,
  Briefcase,
  Layers,
  TrendingUp,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Shield,
  HeartHandshake,
  FolderKanban,
  MessageSquare,
  Award,
  FileText,
  Package,
  ScrollText,
  HelpCircle,
  Image as ImageIcon,
  Tags,
  CalendarDays,
  Lock,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  LayoutTemplate,
  Archive
} from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";
import BrandSignature from "@/components/brand/BrandSignature";
import { apiCall } from "@/lib/api";

type UserRole = "internal_admin" | "owner_admin" | string;

type SubNavItem = {
  label: string;
  href: string;
  active: boolean;
};

type NavItem = {
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active: boolean;
  children?: SubNavItem[]; // Ditambahkan untuk struktur submenu
};

type NavGroup = {
  title: string;
  description?: string;
  items: NavItem[];
};

function getRoleLabel(role: string) {
  if (role === "internal_admin") return "Tim Internal";
  if (role === "owner_admin") return "Owner Bisnis";
  return "Pengguna";
}

function userInitials(name: string) {
  return (name || "Pengguna")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "PG";
}

function NavButton({ item, onClick }: { item: NavItem; onClick: (href: string) => void }) {
  // Mengecek apakah salah satu anak menu sedang aktif berdasarkan kecocokan awal URL
  const hasActiveChild = item.children?.some((child) => child.active) || false;
  const [isOpen, setIsOpen] = useState(hasActiveChild);

  // Otomatis buka sidebar group jika ada child yang aktif saat page reload / navigasi
  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  const handleParentClick = () => {
    if (item.children) {
      setIsOpen(!isOpen);
    } else {
      onClick(item.href);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleParentClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition ${
          item.active || hasActiveChild
            ? "bg-[#649FF6]/10 text-[#3f6fae] ring-1 ring-[#649FF6]/15"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <item.icon className={`h-4 w-4 shrink-0 ${item.active || hasActiveChild ? "text-[#649FF6]" : "text-slate-400"}`} />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold leading-5">{item.label}</span>
          {item.description && (
            <span className="mt-0.5 block text-[10px] leading-4 text-slate-400 truncate">
              {item.description}
            </span>
          )}
        </span>
        {item.children && (
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#649FF6]" : ""
            }`}
          />
        )}
      </button>

      {/* Render Submenu */}
      {item.children && isOpen && (
        <div className="pl-9 pr-2 space-y-1 border-l-2 border-slate-100 ml-5 animate-fadeIn">
          {item.children.map((child) => (
            <button
              key={child.href}
              onClick={() => onClick(child.href)}
              className={`w-full text-left block px-3 py-1.5 text-[11px] font-semibold rounded-lg transition ${
                child.active
                  ? "text-[#3f6fae] font-bold bg-slate-50"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavGroupBlock({ group, onNavigate }: { group: NavGroup; onNavigate: (href: string) => void }) {
  return (
    <div>
      <div className="px-3 mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.16em] block">
          {group.title}
        </span>
        {group.description && <p className="mt-1 text-[10px] leading-4 text-slate-400">{group.description}</p>}
      </div>
      <nav className="space-y-1">
        {group.items.map((item) => (
          <NavButton key={item.href} item={item} onClick={onNavigate} />
        ))}
      </nav>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  backUrl
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const websiteId = params?.websiteId as string | undefined;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Pengguna");
  const [userRole, setUserRole] = useState<UserRole>("owner_admin");
  // Default "company_profile" biar sidebar lama tetap tampil normal sementara
  // fetch belum selesai / kalau fetch gagal — tidak ada perubahan perilaku.
  const [websiteType, setWebsiteType] = useState<string>("company_profile");

  useEffect(() => {
    if (!websiteId) return;
    apiCall<{ websiteType: string }>("GET", `websites/${websiteId}`)
      .then((res) => {
        if (res.data?.websiteType) setWebsiteType(res.data.websiteType);
      })
      .catch(() => {
        // Diamkan saja — sidebar fallback ke company_profile, halaman lain
        // yang butuh data website tetap fetch sendiri-sendiri seperti biasa.
      });
  }, [websiteId]);

  useEffect(() => {
    const token = window.localStorage.getItem("LP_AUTH_TOKEN");
    if (!token) {
      router.replace("/login");
      return;
    }

    const userStr = window.localStorage.getItem("LP_USER");
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      setUserName(user.name || "Pengguna");
      setUserRole(user.role || "owner_admin");
    } catch {
      setUserName("Pengguna");
      setUserRole("owner_admin");
    }
  }, [router]);

  const handleLogout = () => {
    window.localStorage.removeItem("LP_AUTH_TOKEN");
    window.localStorage.removeItem("LP_USER");
    router.replace("/login");
  };

  const globalGroups: NavGroup[] = [
    {
      title: "Utama",
      description: "Pilih website yang ingin dikelola.",
      items: [
        {
          label: "Website Saya",
          description: "Daftar website owner dan akses pengelolaannya.",
          icon: Globe,
          href: "/websites",
          active: pathname === "/websites" || pathname === "/websites/new"
        }
      ]
    }
  ];

  // Group "Isi Konten Utama" & "Lengkapi Pendukung" beda tergantung Website Type.
  // Company Profile: Layanan, Portfolio, Testimoni, Timeline, Anggota Tim.
  // Katalog Produk: Produk (+ Kategori Produk), Keunggulan/USP, Banner.
  // Item yang dipakai bersama (Artikel, Media Library, Brand/Partner, FAQ) tetap sama.
  const isCatalogProduct = websiteType === "catalog_product";

  const mainContentGroup: NavGroup = isCatalogProduct
    ? {
        title: "3. Isi Konten Utama",
        description: "Konten yang paling sering dilihat calon pelanggan.",
        items: [
          {
            label: "Produk",
            description: "Katalog produk/layanan yang dijual, lengkap dengan gambar.",
            icon: ShoppingBag,
            href: `/websites/${websiteId}/content/products`,
            active: pathname?.includes(`/websites/${websiteId}/content/products`) || false,
            children: [
              {
                label: "Semua Produk",
                href: `/websites/${websiteId}/content/products`,
                active: (pathname?.includes(`/websites/${websiteId}/content/products`) && !pathname?.includes(`product-categories`)) || false
              },
              {
                label: "Kategori Produk",
                href: `/websites/${websiteId}/content/product-categories`,
                active: pathname?.includes(`/websites/${websiteId}/content/product-categories`) || false
              }
            ]
          },
          {
            label: "Artikel",
            description: "Tulisan edukasi, berita, insight, dan SEO.",
            icon: FileText,
            href: `/websites/${websiteId}/content/articles`,
            active: pathname?.includes(`/websites/${websiteId}/content/articles`) || false,
            children: [
              {
                label: "Semua Artikel",
                href: `/websites/${websiteId}/content/articles`,
                active: (pathname?.includes(`/websites/${websiteId}/content/articles`) && !pathname?.includes(`article-categories`)) || false
              },
              {
                label: "Kategori Artikel",
                href: `/websites/${websiteId}/content/article-categories`,
                active: pathname?.includes(`/websites/${websiteId}/content/article-categories`) || false
              }
            ]
          }
        ]
      }
    : {
        title: "3. Isi Konten Utama",
        description: "Konten yang paling sering dilihat calon pelanggan.",
        items: [
          {
            label: "Layanan",
            description: "Daftar layanan/jasa yang ditawarkan.",
            icon: HeartHandshake,
            href: `/websites/${websiteId}/content/services`,
            active: pathname?.includes(`/websites/${websiteId}/content/services`) || false
          },
          {
            label: "Portfolio",
            description: "Hasil kerja, kegiatan, project, atau studi kasus.",
            icon: FolderKanban,
            href: `/websites/${websiteId}/content/portfolio`,
            // Menggunakan penanda utama kelompok portfolio
            active: pathname?.includes(`/websites/${websiteId}/content/portfolio`) || false,
            children: [
              {
                label: "Semua Portfolio",
                href: `/websites/${websiteId}/content/portfolio`,
                // Aktif jika berada di halaman list, create, maupun edit portfolio, tapi BUKAN halaman kategori
                active: (pathname?.includes(`/websites/${websiteId}/content/portfolio`) && !pathname?.includes(`portfolio-categories`)) || false
              },
              {
                label: "Kategori Portfolio",
                href: `/websites/${websiteId}/content/portfolio-categories`,
                active: pathname?.includes(`/websites/${websiteId}/content/portfolio-categories`) || false
              }
            ]
          },
          {
            label: "Artikel",
            description: "Tulisan edukasi, berita, insight, dan SEO.",
            icon: FileText,
            href: `/websites/${websiteId}/content/articles`,
            active: pathname?.includes(`/websites/${websiteId}/content/articles`) || false,
            children: [
              {
                label: "Semua Artikel",
                href: `/websites/${websiteId}/content/articles`,
                // Aktif jika berada di halaman list, create, maupun edit artikel, tapi BUKAN halaman kategori
                active: (pathname?.includes(`/websites/${websiteId}/content/articles`) && !pathname?.includes(`article-categories`)) || false
              },
              {
                label: "Kategori Artikel",
                href: `/websites/${websiteId}/content/article-categories`,
                active: pathname?.includes(`/websites/${websiteId}/content/article-categories`) || false
              }
            ]
          }
        ]
      };

  const supportingContentGroup: NavGroup = isCatalogProduct
    ? {
        title: "4. Lengkapi Pendukung",
        description: "Data bantu agar konten lebih rapi dan meyakinkan.",
        items: [
          {
            label: "Media Library",
            description: "Bank gambar untuk logo, produk, artikel, dan section.",
            icon: ImageIcon,
            href: `/websites/${websiteId}/content/media`,
            active: pathname?.includes(`/websites/${websiteId}/content/media`) || false
          },
          {
            label: "Keunggulan / USP",
            description: "Poin keunggulan toko yang tampil di Home.",
            icon: Sparkles,
            href: `/websites/${websiteId}/content/value-propositions`,
            active: pathname?.includes(`/websites/${websiteId}/content/value-propositions`) || false
          },
          {
            label: "Banner",
            description: "Banner promo untuk Hero Section Home.",
            icon: LayoutTemplate,
            href: `/websites/${websiteId}/content/banners`,
            active: pathname?.includes(`/websites/${websiteId}/content/banners`) || false
          },
          {
            label: "Brand / Partner",
            description: "Logo brand atau partner untuk penguat kepercayaan.",
            icon: Award,
            href: `/websites/${websiteId}/content/brands`,
            active: pathname?.includes(`/websites/${websiteId}/content/brands`) || false
          },
          {
            label: "FAQ",
            description: "Pertanyaan umum untuk halaman FAQ dan produk.",
            icon: HelpCircle,
            href: `/websites/${websiteId}/content/faq`,
            active: pathname?.includes(`/websites/${websiteId}/content/faq`) || false
          }
        ]
      }
    : {
        title: "4. Lengkapi Pendukung",
        description: "Data bantu agar konten lebih rapi dan meyakinkan.",
        items: [
          {
            label: "Media Library",
            description: "Bank gambar untuk logo, artikel, portfolio, dan section.",
            icon: ImageIcon,
            href: `/websites/${websiteId}/content/media`,
            active: pathname?.includes(`/websites/${websiteId}/content/media`) || false
          },
          {
            label: "Perjalanan Bisnis",
            description: "Milestone/sejarah yang tampil di halaman About.",
            icon: CalendarDays,
            href: `/websites/${websiteId}/content/timeline`,
            active: pathname?.includes(`/websites/${websiteId}/content/timeline`) || false
          },
          {
            label: "Anggota Tim",
            description: "Profil tim inti yang tampil di halaman About.",
            icon: Users,
            href: `/websites/${websiteId}/content/team-members`,
            active: pathname?.includes(`/websites/${websiteId}/content/team-members`) || false
          },
          {
            label: "Testimoni",
            description: "Cerita pelanggan/klien untuk memperkuat trust.",
            icon: MessageSquare,
            href: `/websites/${websiteId}/content/testimonials`,
            active: pathname?.includes(`/websites/${websiteId}/content/testimonials`) || false
          },
          {
            label: "Brand / Partner",
            description: "Logo partner, brand, komunitas, atau kolaborator.",
            icon: Award,
            href: `/websites/${websiteId}/content/brands`,
            active: pathname?.includes(`/websites/${websiteId}/content/brands`) || false
          },
          {
            label: "FAQ",
            description: "Pertanyaan umum untuk halaman layanan dan kontak.",
            icon: HelpCircle,
            href: `/websites/${websiteId}/content/faq`,
            active: pathname?.includes(`/websites/${websiteId}/content/faq`) || false
          }
        ]
      };

  const websiteGroups: NavGroup[] = websiteId
    ? [
        {
          title: "1. Mulai dari Dasar",
          description: "Identitas dan ringkasan kondisi website.",
          items: [
            {
              label: "Ringkasan",
              description: "Status website, progres isi, dan akses cepat.",
              icon: LayoutDashboard,
              href: `/websites/${websiteId}/overview`,
              active: pathname === `/websites/${websiteId}/overview`
            },
            {
              label: "Profil Bisnis",
              description: "Nama, kontak, alamat, dan cerita bisnis.",
              icon: Briefcase,
              href: `/websites/${websiteId}/profile`,
              active: pathname === `/websites/${websiteId}/profile`
            }
          ]
        },
        {
          title: "2. Susun Website",
          description: "Atur halaman, menu, section, dan target tombol.",
          items: [
            {
              label: "Halaman & Menu",
              description: "Label navbar/footer, slug halaman, dan SEO dasar.",
              icon: Menu,
              href: `/websites/${websiteId}/page-setup`,
              active: pathname?.includes(`/websites/${websiteId}/page-setup`) || false
            },
            {
              label: "Halaman & Section",
              description: "Isi tiap bagian halaman sesuai template terpilih.",
              icon: Layers,
              href: `/websites/${websiteId}/pages`,
              active: pathname?.includes(`/websites/${websiteId}/pages`) || pathname?.includes(`/websites/${websiteId}/sections`) || false
            }
          ]
        },
        mainContentGroup,
        supportingContentGroup,
        {
          title: "5. Pantau Hasil",
          description: "Lihat minat pengunjung dan tindak lanjuti prospek.",
          items: [
            {
              label: "Insight",
              description: "Aktivitas pengunjung dan konten yang menarik perhatian.",
              icon: TrendingUp,
              href: `/websites/${websiteId}/insights`,
              active: pathname?.includes(`/websites/${websiteId}/insights`) || false
            },
            {
              label: "Lead",
              description: "Pesan masuk dari form kontak calon pelanggan.",
              icon: Users,
              href: `/websites/${websiteId}/leads`,
              active: pathname?.includes(`/websites/${websiteId}/leads`) || false
            }
          ]
        }
      ]
    : [];

  const internalGroups: NavGroup[] =
    userRole === "internal_admin"
      ? [
          {
            title: "Internal LabKerKomIT",
            description: "Operasional platform dan audit aktivitas.",
            items: [
              {
                label: "Dashboard Internal",
                description: "Ringkasan kerja tim internal.",
                icon: Shield,
                href: "/internal",
                active: pathname === "/internal"
              },
              {
                label: "Audit Log",
                description: "Riwayat aktivitas penting dan security event.",
                icon: ScrollText,
                href: "/internal/audit-logs",
                active: pathname === "/internal/audit-logs"
              },
              {
                label: "Owner Bisnis",
                description: "Kelola akun pemilik website.",
                icon: Users,
                href: "/internal/owners",
                active: pathname === "/internal/owners"
              },
              {
                label: "Daftar Website",
                description: "Pantau website yang dibuat owner.",
                icon: Globe,
                href: "/internal/websites",
                active: pathname === "/internal/websites"
              },
              {
                label: "Backup & Restore",
                description: "Unduh backup atau pulihkan data per website.",
                icon: Archive,
                href: "/internal/backup-restore",
                active: pathname === "/internal/backup-restore"
              },
              {
                label: "Template Section",
                description: "Library section yang bisa dipilih owner.",
                icon: Layers,
                href: "/internal/template-sections",
                active: pathname === "/internal/template-sections"
              },
              {
                label: "Template Pack",
                description: "Upload dan validasi paket template full website.",
                icon: Package,
                href: "/internal/template-packs",
                active: pathname === "/internal/template-packs"
              },
              {
                label: "Pengaturan Publik",
                description: "Buka/tutup pendaftaran mandiri & pembuatan website owner.",
                icon: Lock,
                href: "/internal/settings",
                active: pathname === "/internal/settings"
              }
            ]
          }
        ]
      : [];

  const renderGroups = (groups: NavGroup[], closeMobile = false) =>
    groups.map((group) => (
      <NavGroupBlock
        key={group.title}
        group={group}
        onNavigate={(href) => {
          if (closeMobile) setMobileMenuOpen(false);
          router.push(href);
        }}
      />
    ));

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans" id="dashboard-root">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen" id="desktop-sidebar">
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <BrandMark />
        </div>

        <div className="flex-1 px-4 py-6 space-y-7 overflow-y-auto">
          {renderGroups(globalGroups)}
          {websiteGroups.length > 0 && renderGroups(websiteGroups)}
          {internalGroups.length > 0 && renderGroups(internalGroups)}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-8 w-8 bg-[#649FF6]/15 text-[#3f6fae] rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {userInitials(userName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">{getRoleLabel(userRole)}</p>
            </div>
          </div>

          <BrandSignature />

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-20" id="mobile-header">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-6 w-6" />
            </button>
            <BrandMark compact />
          </div>
          <div className="h-8 w-8 bg-[#649FF6]/15 text-[#3f6fae] rounded-full flex items-center justify-center font-bold text-xs uppercase">
            {userInitials(userName)}
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative flex flex-col w-80 max-w-[86vw] bg-white h-full shadow-2xl p-6 border-r border-slate-200 animate-slideRight">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Tutup menu navigasi"
              >
                <X className="h-5 w-5" />
              </button>

              <BrandMark className="mb-8" />

              <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                {renderGroups(globalGroups, true)}
                {websiteGroups.length > 0 && renderGroups(websiteGroups, true)}
                {internalGroups.length > 0 && renderGroups(internalGroups, true)}
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-[#649FF6]/15 text-[#3f6fae] rounded-full flex items-center justify-center font-bold text-xs uppercase">
                    {userInitials(userName)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{userName}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{getRoleLabel(userRole)}</p>
                  </div>
                </div>

                <BrandSignature />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar Sesi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0" id="workspace-header">
            <div className="flex items-center space-x-3">
              {(showBackButton || backUrl) && (
                <button
                  onClick={() => {
                    if (backUrl) router.push(backUrl);
                    else router.back();
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 active:translate-y-[1px] transition shrink-0"
                  aria-label="Kembali ke halaman sebelumnya"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium mb-1">
                  <span>Dashboard</span>
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  {websiteId ? (
                    <>
                      <span className="cursor-pointer hover:text-[#649FF6] truncate max-w-[120px]" onClick={() => router.push("/websites")}>
                        Website Saya
                      </span>
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span className="text-slate-500 truncate max-w-[150px]">{title}</span>
                    </>
                  ) : (
                    <span className="text-slate-500">{title}</span>
                  )}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{title}</h2>
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
              </div>
            </div>
          </div>

          <div className="animate-fadeIn pb-12" id="inner-workspace">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}