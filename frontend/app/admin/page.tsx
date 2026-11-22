"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

interface DashboardCounts {
  projects: number | string;
  skills: number | string;
  journey: number | string;
  messages: number | string;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({
    projects: "—",
    skills: "—",
    journey: "—",
    messages: "—",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      try {
        const [projRes, skillRes, journeyRes, msgRes] = await Promise.all([
          fetch(`${apiUrl.replace(/\/$/, "")}/projects`).catch(() => null),
          fetch(`${apiUrl.replace(/\/$/, "")}/skills`).catch(() => null),
          fetch(`${apiUrl.replace(/\/$/, "")}/journey`).catch(() => null),
          fetch(`${apiUrl.replace(/\/$/, "")}/admin/messages`, { credentials: "include" }).catch(() => null),
        ]);

        const newCounts: DashboardCounts = {
          projects: "—",
          skills: "—",
          journey: "—",
          messages: "—",
        };

        if (projRes && projRes.ok) {
          const data = await projRes.json().catch(() => null);
          if (Array.isArray(data)) {
            newCounts.projects = data.length;
          }
        }

        if (skillRes && skillRes.ok) {
          const data = await skillRes.json().catch(() => null);
          if (Array.isArray(data)) {
            newCounts.skills = data.length;
          }
        }

        if (journeyRes && journeyRes.ok) {
          const data = await journeyRes.json().catch(() => null);
          if (Array.isArray(data)) {
            newCounts.journey = data.length;
          }
        }

        if (msgRes && msgRes.ok) {
          const data = await msgRes.json().catch(() => null);
          if (typeof data?.unreadCount === "number") {
            newCounts.messages = data.unreadCount;
          } else if (Array.isArray(data?.messages)) {
            newCounts.messages = data.messages.length;
          }
        }

        if (isMounted) {
          setCounts(newCounts);
        }
      } catch {
        // Keep fallback "—"
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Projects",
      count: counts.projects,
      description: "FixFlow & Kohinoor Tunes",
      href: "/admin/projects",
      badge: "SHOWCASE",
    },
    {
      title: "Skills",
      count: counts.skills,
      description: "Across 4 categories",
      href: "/admin/skills",
      badge: "STACK",
    },
    {
      title: "Journey Entries",
      count: counts.journey,
      description: "Experience & Education",
      href: "/admin/journey",
      badge: "TIMELINE",
    },
    {
      title: "Messages",
      count: counts.messages,
      description: "Contact inquiries",
      href: "/admin/messages",
      badge: "INBOX",
    },
  ];

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-royal dark:text-[#7888FF] mb-2 block select-none">
          OVERVIEW
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink dark:text-cream">
          Dashboard
        </h1>
        <p className="text-muted dark:text-[#A8A8B8] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Welcome to the portfolio administration center. View counts and navigate to content sections.
        </p>
      </div>

      {/* Counts Grid (1 col mobile, 2 col tablet, 4 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="p-6 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 shadow-[0_4px_16px_rgba(20,18,31,0.03)] dark:shadow-none hover:-translate-y-1 hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 group flex flex-col justify-between min-h-[170px]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted dark:text-[#A8A8B8]">
                {stat.badge}
              </span>
              <span
                className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-muted group-hover:text-royal group-hover:border-royal dark:group-hover:text-lime dark:group-hover:border-lime transition-colors"
                aria-hidden="true"
              >
                →
              </span>
            </div>

            <div className="my-2">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-ink dark:text-cream">
                {loading ? "…" : stat.count}
              </div>
              <div className="font-bold text-sm text-ink/90 dark:text-cream/90 mt-1">
                {stat.title}
              </div>
            </div>

            <div className="text-xs text-muted dark:text-[#A8A8B8] truncate">
              {stat.description}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
        <h2 className="text-lg font-bold text-ink dark:text-cream mb-4">
          Quick Management
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link
            href="/admin/settings"
            className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#FAF8F5] dark:bg-[#0B0F24] hover:bg-lavender/40 dark:hover:bg-royal/10 transition-colors"
          >
            <span className="font-semibold text-sm text-ink dark:text-cream block">
              Site Settings
            </span>
            <span className="text-xs text-muted dark:text-[#A8A8B8] mt-0.5 block">
              Bio, availability &amp; contact info
            </span>
          </Link>

          <Link
            href="/admin/projects"
            className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#FAF8F5] dark:bg-[#0B0F24] hover:bg-lavender/40 dark:hover:bg-royal/10 transition-colors"
          >
            <span className="font-semibold text-sm text-ink dark:text-cream block">
              Projects
            </span>
            <span className="text-xs text-muted dark:text-[#A8A8B8] mt-0.5 block">
              FixFlow, Kohinoor Tunes &amp; stack
            </span>
          </Link>

          <Link
            href="/admin/skills"
            className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#FAF8F5] dark:bg-[#0B0F24] hover:bg-lavender/40 dark:hover:bg-royal/10 transition-colors"
          >
            <span className="font-semibold text-sm text-ink dark:text-cream block">
              Skills
            </span>
            <span className="text-xs text-muted dark:text-[#A8A8B8] mt-0.5 block">
              Frontend, backend, DB &amp; tools
            </span>
          </Link>

          <Link
            href="/admin/journey"
            className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#FAF8F5] dark:bg-[#0B0F24] hover:bg-lavender/40 dark:hover:bg-royal/10 transition-colors"
          >
            <span className="font-semibold text-sm text-ink dark:text-cream block">
              Journey
            </span>
            <span className="text-xs text-muted dark:text-[#A8A8B8] mt-0.5 block">
              College, certification &amp; experience
            </span>
          </Link>

          <Link
            href="/admin/messages"
            className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#FAF8F5] dark:bg-[#0B0F24] hover:bg-lavender/40 dark:hover:bg-royal/10 transition-colors"
          >
            <span className="font-semibold text-sm text-ink dark:text-cream block">
              Messages
            </span>
            <span className="text-xs text-muted dark:text-[#A8A8B8] mt-0.5 block">
              Incoming contact form submissions
            </span>
          </Link>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#FAF8F5] dark:bg-[#0B0F24] hover:bg-lavender/40 dark:hover:bg-royal/10 transition-colors"
          >
            <span className="font-semibold text-sm text-royal dark:text-[#7888FF] flex items-center gap-1">
              <span>Live Public Site</span>
              <span>↗</span>
            </span>
            <span className="text-xs text-muted dark:text-[#A8A8B8] mt-0.5 block">
              Preview public portfolio in new tab
            </span>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
