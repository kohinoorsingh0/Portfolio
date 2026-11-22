import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import Timeline from "@/components/journey/Timeline";

export const metadata: Metadata = constructMetadata({
  title: "Journey — Kohinoor Singh",
  description:
    "Learning by doing. Growing by sharing. The coursework, code reviews, and small wins shaping the developer I'm becoming.",
});

const principles = [
  {
    number: "01",
    title: "Stay curious",
    description:
      "Ask the extra question. Read the docs. Understand the why, not just the how.",
  },
  {
    number: "02",
    title: "Make it clear",
    description:
      "Great code and great interfaces share one quality: the next step feels obvious.",
  },
  {
    number: "03",
    title: "Own the outcome",
    description:
      "The job is not finished when the code runs. It is finished when it works for people.",
  },
];

export default function JourneyPage() {
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
          {/* Eyebrow kicker with circular badge matching Figma */}
          <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C8F542] text-[#2B3FE0] font-mono text-xs sm:text-sm font-bold flex items-center justify-center select-none shadow-xs">
              03
            </span>
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-muted dark:text-[#A8A8B8]">
              / JOURNEY
            </span>
          </div>

          {/* Headline matching Figma: clamp(66px, 8.2vw, 124px) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] font-black tracking-[-0.05em] leading-[0.94] text-ink dark:text-cream mb-6 sm:mb-8 max-w-4xl">
            Learning by doing.
            <br />
            <span className="text-royal dark:text-[#7888FF] relative inline-block">
              Growing by sharing.
            </span>
          </h1>

          {/* Intro Paragraph from Figma */}
          <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-xl max-w-2xl leading-relaxed">
            The coursework, code reviews, architectural decisions, and small
            wins that are shaping the developer I&apos;m becoming.
          </p>
        </div>
      </section>

      {/* Section 01: Experience & Education Timeline */}
      <Timeline />

      {/* Section 02: Working Principles matching Figma: .principles */}
      <section className="w-full bg-[#111111] dark:bg-[#0B0F24] text-[#FAF8F4] py-16 sm:py-24 lg:py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section 02 Heading */}
          <div className="max-w-2xl mb-12 sm:mb-16">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-lime mb-3 block">
              02 / Working principles
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.035em] leading-[1.04] text-white mb-4">
              How I show up.
            </h2>
            <p className="text-[#AAA7B7] text-base sm:text-lg leading-relaxed">
              Software is built by people, for people. These are the core standards
              I hold myself to every single day.
            </p>
          </div>

          {/* Principles Grid matching Figma: 1 col mobile, 3 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {principles.map((p) => (
              <article
                key={p.number}
                className="bg-[#181C38]/50 dark:bg-[#14182E]/70 border border-[#3D3948] dark:border-white/10 rounded-[25px] p-7 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[310px] hover:-translate-y-1 hover:border-white/20 transition-all duration-300 group"
              >
                <span className="font-mono text-xs font-bold text-coral">
                  {p.number}
                </span>

                <div className="mt-auto pt-6">
                  <h3 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-3">
                    {p.title}
                  </h3>
                  <p className="text-[#AAA7B7] text-sm sm:text-base leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 03 Testimonials: DO NOT RENDER IT — hidden until real testimonials exist in DB (Hard Rule #2) */}
    </>
  );
}
