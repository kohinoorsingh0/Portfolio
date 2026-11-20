"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Journey", href: "/journey" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <nav
          aria-label="Main Navigation"
          className="relative flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full bg-cream/90 dark:bg-navy/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm transition-colors duration-200"
        >
          {/* Logo "KS." */}
          <Link
            href="/"
            className="flex items-center text-xl font-black tracking-tight text-ink dark:text-cream hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-royal rounded-md"
            aria-label="Home"
          >
            KS.
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors hover:text-royal focus-visible:outline-2 focus-visible:outline-royal rounded-sm ${
                    active
                      ? "text-royal dark:text-lime font-semibold"
                      : "text-ink/80 dark:text-cream/80"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-royal dark:bg-lime rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-coral hover:bg-coral-hover active:scale-95 transition-all duration-150 rounded-full shadow-sm hover:shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-royal"
            >
              Hire me →
            </Link>
          </div>

          {/* Mobile Right Controls: Toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-ink dark:text-cream hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-royal cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mt-2 p-4 rounded-3xl bg-cream/95 dark:bg-navy/95 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center min-h-[44px] px-4 rounded-2xl text-base font-medium transition-colors ${
                      active
                        ? "bg-royal/10 dark:bg-lime/10 text-royal dark:text-lime font-semibold"
                        : "text-ink dark:text-cream hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-black/10 dark:border-white/10">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[44px] w-full px-5 py-3 text-sm font-semibold text-white bg-coral hover:bg-coral-hover active:scale-98 transition-all rounded-full shadow-sm text-center"
                >
                  Hire me →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
