import type { Metadata } from "next";
import Approach from "@/components/about/Approach";

export const metadata: Metadata = {
  title: "About — Kohinoor Singh",
  description:
    "The person behind the pixels: a product-minded developer who believes the best digital work feels both beautiful and dependable.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page Hero matching Figma .page-hero */}
      <section className="relative overflow-hidden bg-cream dark:bg-navy pt-8 sm:pt-14 pb-16 sm:pb-20 border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-royal dark:text-[#7888FF] mb-4 block">
            01 / ABOUT
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-black tracking-[-0.04em] leading-[0.95] text-ink dark:text-cream mb-6 max-w-4xl">
            Curiosity, craft &amp;
            <br />
            <span className="text-royal dark:text-[#7888FF] relative inline-block">
              a lot of code.
            </span>
          </h1>
          <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-xl max-w-2xl leading-relaxed">
            The person behind the pixels: a product-minded developer who believes
            the best digital work feels both beautiful and dependable.
          </p>
        </div>
      </section>

      {/* Section 01: My Approach */}
      <Approach />
    </>
  );
}
