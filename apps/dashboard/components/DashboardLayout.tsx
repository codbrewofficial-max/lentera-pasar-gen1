"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Database,
  User,
  Shield,
  HeartHandshake,
  FolderKanban,
  MessageSquare,
  Award,
  FileText,
  Package
} from "lucide-react";

function getRoleLabel(role: string) {
  if (role === "internal_admin") return "Tim Internal";
  if (role === "owner_admin") return "Owner Bisnis";
  return "Pengguna";
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
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      const userStr = window.localStorage.getItem("LP_USER");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.name || "Owner Bisnis";
        } catch (e) {}
      }
    }
    return "Pengguna";
  });
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      const userStr = window.localStorage.getItem("LP_USER");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.role || "owner_admin";
        } catch (e) {}
      }
    }
    return "owner_admin";
  });

  useEffect(() => {
    // Check local storage for authenticated user
    const token = localStorage.getItem("LP_AUTH_TOKEN");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);


  const handleLogout = () => {
    localStorage.removeItem("LP_AUTH_TOKEN");
    localStorage.removeItem("LP_USER");
    router.replace("/login");
  };

  // Build the list of sidebar menu links
  const menuItems = [
    {
      label: "Website Saya",
      icon: Globe,
      href: "/websites",
      active: pathname === "/websites" || pathname === "/websites/new"
    }
  ];

  // Specific tab items if managing a single website
  const localTabs = websiteId ? [
    {
      label: "Ringkasan",
      icon: LayoutDashboard,
      href: `/websites/${websiteId}/overview`,
      active: pathname === `/websites/${websiteId}/overview`
    },
    {
      label: "Profil Bisnis",
      icon: Briefcase,
      href: `/websites/${websiteId}/profile`,
      active: pathname === `/websites/${websiteId}/profile`
    },
    {
      label: "Halaman & Menu",
      icon: Menu,
      href: `/websites/${websiteId}/page-setup`,
      active: pathname?.includes(`/websites/${websiteId}/page-setup`)
    },
    {
      label: "Halaman",
      icon: Layers,
      href: `/websites/${websiteId}/pages`,
      active: pathname?.includes(`/websites/${websiteId}/pages`) || pathname?.includes(`/websites/${websiteId}/sections`)
    },
    {
      label: "Layanan",
      icon: HeartHandshake,
      href: `/websites/${websiteId}/content/services`,
      active: pathname?.includes(`/websites/${websiteId}/content/services`)
    },
    {
      label: "Portfolio",
      icon: FolderKanban,
      href: `/websites/${websiteId}/content/portfolio`,
      active: pathname?.includes(`/websites/${websiteId}/content/portfolio`)
    },
    {
      label: "Testimoni",
      icon: MessageSquare,
      href: `/websites/${websiteId}/content/testimonials`,
      active: pathname?.includes(`/websites/${websiteId}/content/testimonials`)
    },
    {
      label: "Artikel",
      icon: FileText,
      href: `/websites/${websiteId}/content/articles`,
      active: pathname?.includes(`/websites/${websiteId}/content/articles`)
    },
    {
      label: "Brand / Partner",
      icon: Award,
      href: `/websites/${websiteId}/content/brands`,
      active: pathname?.includes(`/websites/${websiteId}/content/brands`)
    },
    {
      label: "Insight",
      icon: TrendingUp,
      href: `/websites/${websiteId}/insights`,
      active: pathname?.includes(`/websites/${websiteId}/insights`)
    },
    {
      label: "Lead",
      icon: Users,
      href: `/websites/${websiteId}/leads`,
      active: pathname?.includes(`/websites/${websiteId}/leads`)
    }
  ] : [];

  // Internal menu items for internal_admin
  const internalMenuItems = userRole === "internal_admin" ? [
    {
      label: "Dashboard Internal",
      icon: Shield,
      href: "/internal",
      active: pathname === "/internal"
    },
    {
      label: "Owner Bisnis",
      icon: Users,
      href: "/internal/owners",
      active: pathname === "/internal/owners"
    },
    {
      label: "Daftar Website",
      icon: Globe,
      href: "/internal/websites",
      active: pathname === "/internal/websites"
    },
    {
      label: "Template Section",
      icon: Layers,
      href: "/internal/template-sections",
      active: pathname === "/internal/template-sections"
    },
    {
      label: "Template Pack",
      icon: Package,
      href: "/internal/template-packs",
      active: pathname === "/internal/template-packs"
    }
  ] : [];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans" id="dashboard-root">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen" id="desktop-sidebar">
        {/* Brand / Logo */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-lg">
            <Sparkles className="h-6 w-6" />
            <span>Lentera Pasar</span>
          </div>
        </div>

        {/* Global Navigation */}
        <div className="flex-1 px-4 py-6 space-y-7 overflow-y-auto">
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Utama
            </span>
            <nav className="space-y-1">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    item.active
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${item.active ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Website Local Navigation */}
          {websiteId && (
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Kelola Website
              </span>
              <nav className="space-y-1">
                {localTabs.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      item.active
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${item.active ? "text-emerald-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Internal Admin Navigation */}
          {userRole === "internal_admin" && (
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Menu Internal
              </span>
              <nav className="space-y-1">
                {internalMenuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      item.active
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${item.active ? "text-emerald-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          {/* User Info */}
          <div className="flex items-center space-x-3 px-2">
            <div className="h-8 w-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {userName.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                {getRoleLabel(userRole)}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE TOP BAR */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-20" id="mobile-header">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-1 text-emerald-600 font-bold text-base">
              <Sparkles className="h-5 w-5" />
              <span>Lentera Pasar</span>
            </div>
          </div>

          {/* User circle shortcut */}
          <div className="h-8 w-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xs uppercase">
            {userName.substring(0, 2)}
          </div>
        </header>

        {/* MOBILE SIDEBAR DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Content */}
            <div className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl p-6 border-r border-slate-200 animate-slideRight">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Tutup menu navigasi"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-lg mb-8">
                <Sparkles className="h-6 w-6" />
                <span>Lentera Pasar</span>
              </div>

              {/* Navigation lists */}
              <div className="flex-1 space-y-6 overflow-y-auto">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Utama
                  </span>
                  <nav className="space-y-1">
                    {menuItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          router.push(item.href);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                          item.active
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {websiteId && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Kelola Website
                    </span>
                    <nav className="space-y-1">
                      {localTabs.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push(item.href);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                            item.active
                              ? "bg-emerald-50 text-emerald-700 font-semibold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                {userRole === "internal_admin" && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Menu Internal
                    </span>
                    <nav className="space-y-1">
                      {internalMenuItems.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push(item.href);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                            item.active
                              ? "bg-emerald-50 text-emerald-700 font-semibold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </div>

              {/* User session panel */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                    {userName.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{userName}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{getRoleLabel(userRole)}</p>
                  </div>
                </div>

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

        {/* 3. MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Top Info Bar: Navigation Breadcrumbs & Back Button */}
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0" id="workspace-header">
            <div className="flex items-center space-x-3">
              {(showBackButton || backUrl) && (
                <button
                  onClick={() => {
                    if (backUrl) router.push(backUrl);
                    else router.back();
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:translate-y-[1px] transition shrink-0"
                  aria-label="Kembali ke halaman sebelumnya"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div>
                {/* Breadcrumb path */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium mb-1">
                  <span>Dashboard</span>
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  {websiteId ? (
                    <>
                      <span className="cursor-pointer hover:text-emerald-600 truncate max-w-[120px]" onClick={() => router.push("/websites")}>
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

          {/* Inner children area with responsive styling */}
          <div className="animate-fadeIn pb-12" id="inner-workspace">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
