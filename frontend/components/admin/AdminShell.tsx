"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface AdminShellProps {
  children: ReactNode;
  title?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: (active: boolean) => ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (active: boolean) => (
      <svg
        className={`w-5 h-5 ${active ? "text-white" : "text-current"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    label: "Site Settings",
    href: "/admin/settings",
    icon: (active: boolean) => (
      <svg
        className={`w-5 h-5 ${active ? "text-white" : "text-current"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: (active: boolean) => (
      <svg
        className={`w-5 h-5 ${active ? "text-white" : "text-current"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: (active: boolean) => (
      <svg
        className={`w-5 h-5 ${active ? "text-white" : "text-current"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
  },
  {
    label: "Journey",
    href: "/admin/journey",
    icon: (active: boolean) => (
      <svg
        className={`w-5 h-5 ${active ? "text-white" : "text-current"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: (active: boolean) => (
      <svg
        className={`w-5 h-5 ${active ? "text-white" : "text-current"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    ),
  },
];

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Authenticate admin session on load via GET /api/admin/me; redirect to /admin/login on 401
  useEffect(() => {
    let isMounted = true;
    const verifyAuth = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.email) {
            setAdminEmail(data.email);
          }
        }
      } catch {
        // If server is unreachable, allow user to stay or reload
      }
    };

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${apiUrl.replace(/\/$/, "")}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Continue redirect on error
    }
    window.location.href = "/admin/login";
  };

  const isRouteActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-[#FAF8F5] dark:bg-[#0B0F24] text-ink dark:text-cream overflow-hidden">
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR (Desktop: lg:flex) */}
      {/* ============================================================== */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-black/10 dark:border-white/10 bg-white dark:bg-[#121730] shrink-0">
        {/* Brand Kicker */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-black text-xl tracking-tight text-ink dark:text-cream"
          >
            <span>KS.</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-lime/30 text-ink dark:bg-lime/20 dark:text-lime border border-lime/40">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto" aria-label="Admin Navigation">
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none ${
                  active
                    ? "bg-royal text-white shadow-xs"
                    : "text-ink/75 dark:text-cream/75 hover:bg-black/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-cream"
                }`}
              >
                {item.icon(active)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Logged in email & Logout button */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-3">
          {adminEmail && (
            <div className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted dark:text-[#A8A8B8] block">
                Signed in as
              </span>
              <span className="font-mono text-xs font-semibold text-ink dark:text-cream truncate block" title={adminEmail}>
                {adminEmail}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors select-none cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN WORKSPACE (Top Bar + Scrollable Content) */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 lg:h-18 px-4 sm:px-6 lg:px-8 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#121730]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          {/* Left: Mobile hamburger & title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <span className="font-sans font-bold text-base sm:text-lg text-ink dark:text-cream tracking-tight">
              Kohinoor Singh — Admin
            </span>
          </div>

          {/* Right: ThemeToggle + View site link */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-black/15 dark:border-white/15 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 font-semibold text-xs sm:text-sm text-ink dark:text-cream transition-colors cursor-pointer select-none"
            >
              <span>View site</span>
              <span className="text-royal dark:text-lime font-bold" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </header>

        {/* MOBILE MENU DROPDOWN (Collapses on mobile) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#121730] px-4 py-4 space-y-1 shadow-lg shrink-0 animate-in fade-in duration-200">
            {NAV_ITEMS.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center min-h-[44px] gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-royal text-white"
                      : "text-ink/80 dark:text-cream/80 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {item.icon(active)}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
