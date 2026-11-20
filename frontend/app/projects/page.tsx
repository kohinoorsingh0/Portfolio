import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { ProjectsList } from "@/components/projects/ProjectCard";

export const metadata: Metadata = constructMetadata({
  title: "Projects — Kohinoor Singh",
  description:
    "A collection of product stories spanning interface craft, full-stack systems, and the details that make software feel considered.",
});

export default function ProjectsPage() {
  return (
    <>
      {/* Page Hero matching Figma: .page-hero */}
      <section className="relative overflow-hidden bg-cream dark:bg-navy pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        {/* Soft Radial Orb Background Decoration */}
        <div
          className="absolute top-12 -right-24 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-br from-white/70 via-[#D9D2FF]/40 to-transparent dark:from-royal/10 dark:via-royal/5 dark:to-transparent blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Eyebrow kicker with circular badge */}
          <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C8F542] text-[#2B3FE0] font-mono text-xs sm:text-sm font-bold flex items-center justify-center select-none shadow-xs">
              02
            </span>
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-muted dark:text-[#A8A8B8]">
              / SELECTED WORK
            </span>
          </div>

          {/* Headline matching Figma: clamp(66px, 8.2vw, 124px) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] font-black tracking-[-0.05em] leading-[0.94] text-ink dark:text-cream mb-6 sm:mb-8 max-w-4xl">
            Built with intent.
            <br />
            <span className="text-royal dark:text-[#7888FF] relative inline-block">
              Shipped with pride.
            </span>
          </h1>

          {/* Intro Paragraph from Figma */}
          <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-xl max-w-2xl leading-relaxed">
            A collection of product stories spanning interface craft, full-stack
            systems, and the details that make software feel considered.
          </p>
        </div>
      </section>

      {/* Projects Work Section matching Figma: .work.work-page bg-[#0F1530] */}
      <section className="w-full bg-[#0F1530] text-[#FAF8F4] py-16 sm:py-20 md:py-24 border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsList />
        </div>
      </section>
    </>
  );
}
