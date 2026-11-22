"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CtaBanner() {
  const pathname = usePathname();

  // Do not render CTA banner on the contact page or admin routes
  if (pathname === "/contact" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <section className="w-full bg-[#FF5C38] py-20 sm:py-24 md:py-32 text-center relative overflow-hidden transition-none border-0 m-0">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        {/* Eyebrow: small mono, uppercase in ink #111111 */}
        <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#111111] mb-4 sm:mb-6 block select-none">
          HAVE A PROJECT OR AN OPEN ROLE?
        </span>

        {/* Headline: huge bold tight — line 1 in ink #111111, line 2 in white #FFFFFF */}
        <h2 className="text-[32px] xs:text-[36px] sm:text-[56px] md:text-[68px] lg:text-[78px] font-black tracking-[-0.045em] leading-[0.98] text-[#111111] mb-8 sm:mb-10 max-w-4xl mx-auto">
          Let&apos;s build something
          <br />
          <span className="text-white">remarkable.</span>
        </h2>

        {/* Button: dark navy/black in light mode, crisp white pill in dark mode (matching Figma) */}
        <Link
          href="/contact"
          className="inline-flex items-center justify-center min-h-[48px] gap-2.5 px-8 sm:px-9 py-4 sm:py-4.5 rounded-full bg-[#111111] text-white dark:bg-[#FAF8F4] dark:text-[#111111] font-bold text-sm sm:text-base hover:bg-black/90 dark:hover:bg-white hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-lg cursor-pointer"
        >
          <span>Start a conversation</span>
          <span className="text-base sm:text-lg" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
