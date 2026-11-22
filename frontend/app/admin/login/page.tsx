import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin — Kohinoor Singh",
  description: "Administrative login portal for Kohinoor Singh portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
      <div className="w-full max-w-md bg-white dark:bg-[#151C3B] rounded-3xl p-8 sm:p-10 border border-black/10 dark:border-white/10 shadow-[0_16px_40px_rgba(20,18,31,0.06)] dark:shadow-none transition-colors duration-300">
        {/* Header kicker */}
        <div className="text-center mb-8">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-royal dark:text-[#7888FF] px-3 py-1 rounded-full bg-lavender dark:bg-royal/20 border border-[#DDD6FE] dark:border-royal/30 inline-block mb-3.5 select-none">
            SECURE PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink dark:text-cream">
            Admin — Kohinoor Singh
          </h1>
          <p className="text-muted dark:text-[#A8A8B8] text-xs sm:text-sm mt-2">
            Enter your credentials to access portfolio administration.
          </p>
        </div>

        {/* Login Form */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
