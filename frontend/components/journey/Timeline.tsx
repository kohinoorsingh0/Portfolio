export interface TimelineEntry {
  type: "EXPERIENCE" | "EDUCATION" | "CERTIFICATION";
  year?: string;
  title: string;
  organisation: string;
  body: string;
}

export const JOURNEY_ENTRIES: TimelineEntry[] = [
  {
    type: "EXPERIENCE",
    year: "2026",
    title: "Full-Stack Developer",
    organisation: "FixFlow · Campus Complaint System (College Project)",
    body: "Architected and built an end-to-end campus complaint workflow system (37,612 lines of code, 183 files, 43 tests). Built 3 roles (student, staff, admin), OTP email verification, SLA tracking, AI triage with duplicate detection, campus heatmap, and PWA capabilities.",
  },
  {
    type: "CERTIFICATION",
    year: "2026",
    title: "Full Stack Development with AI",
    organisation: "PW Skills",
    body: "Completed comprehensive certification on 27 September 2026. Covered full-stack architecture, React, Node.js, Express, MongoDB, REST APIs, and generative AI system integration.",
  },
  {
    type: "EDUCATION",
    title: "Bachelor of Computer Applications (B.C.A.)",
    organisation: "Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal",
    body: "B.C.A. Web Development. Specializing in computer science fundamentals, data structures, algorithms, web technologies, and database management systems. Currently pursuing.",
  },
];

interface TimelineProps {
  entries?: TimelineEntry[];
}

export default function Timeline({ entries = JOURNEY_ENTRIES }: TimelineProps) {
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-navy py-16 sm:py-24 lg:py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 sm:mb-20">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral mb-3 block">
            01 / Experience &amp; education
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream mb-4">
            The path so far.
          </h2>
          <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-lg leading-relaxed">
            Not a straight line, but a deliberate one—guided by curiosity and
            strengthened through real work.
          </p>
        </div>

        {/* Desktop Timeline (md:block) matching Figma */}
        <div className="hidden md:block relative">
          {/* Vertical Gradient Line connecting the dots */}
          <div
            className="absolute top-8 bottom-8 left-[calc(28%+36px)] w-[2px] bg-gradient-to-b from-royal via-royal/70 to-coral dark:from-[#7888FF] dark:to-coral"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {entries.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="grid grid-cols-[28%_74px_1fr] items-center group"
              >
                {/* Column 1: Big Stroke Year */}
                <div className="text-right pr-8">
                  {item.year ? (
                    <span className="font-sans font-black text-4xl lg:text-[52px] tracking-tight text-transparent [-webkit-text-stroke:1.5px_#5A5A66] dark:[-webkit-text-stroke:1.5px_#8E8E9E] select-none block">
                      {item.year}
                    </span>
                  ) : (
                    <span className="block h-6" aria-hidden="true" />
                  )}
                </div>

                {/* Column 2: Numbered Dot */}
                <div className="flex items-center justify-center relative z-10">
                  <div className="w-12 h-12 rounded-full border-2 border-royal dark:border-[#7888FF] bg-cream dark:bg-[#151C3B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <span className="font-mono text-xs font-bold text-royal dark:text-[#7888FF]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Column 3: Timeline Card */}
                <div className="bg-white dark:bg-[#151C3B] border border-black/10 dark:border-white/10 rounded-[22px] p-7 lg:p-8 shadow-[7px_7px_0_#e2d7cf] dark:shadow-[7px_7px_0_#0a0e22] hover:-translate-y-1 hover:shadow-[9px_9px_0_#d8ccc2] dark:hover:shadow-[9px_9px_0_#050814] transition-all duration-300">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-coral block mb-2">
                    {item.type}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-ink dark:text-cream mb-1">
                    {item.title}
                  </h3>
                  <strong className="block font-semibold text-xs sm:text-sm text-royal dark:text-[#7888FF] mb-3">
                    {item.organisation}
                  </strong>
                  <p className="text-muted dark:text-[#A8A8B8] text-sm sm:text-base leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile Stacked Timeline (block md:hidden) */}
        <div className="block md:hidden relative">
          {/* Vertical Gradient Line */}
          <div
            className="absolute top-5 bottom-5 left-[21px] w-[2px] bg-gradient-to-b from-royal via-royal/70 to-coral dark:from-[#7888FF] dark:to-coral"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {entries.map((item, index) => (
              <article
                key={`mobile-${item.title}-${index}`}
                className="relative flex items-start gap-4"
              >
                {/* Numbered Dot */}
                <div className="w-11 h-11 shrink-0 rounded-full border-2 border-royal dark:border-[#7888FF] bg-cream dark:bg-[#151C3B] flex items-center justify-center shadow-xs relative z-10">
                  <span className="font-mono text-[11px] font-bold text-royal dark:text-[#7888FF]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content Block */}
                <div className="flex-1 min-w-0">
                  {/* Year if present */}
                  {item.year && (
                    <div className="font-sans font-black text-2xl tracking-tight text-transparent [-webkit-text-stroke:1.2px_#5A5A66] dark:[-webkit-text-stroke:1.2px_#8E8E9E] mb-2 select-none">
                      {item.year}
                    </div>
                  )}

                  {/* Card */}
                  <div className="bg-white dark:bg-[#151C3B] border border-black/10 dark:border-white/10 rounded-[20px] p-5 shadow-[5px_5px_0_#e2d7cf] dark:shadow-[5px_5px_0_#0a0e22]">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-coral block mb-1.5">
                      {item.type}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-ink dark:text-cream mb-1">
                      {item.title}
                    </h3>
                    <strong className="block font-semibold text-xs text-royal dark:text-[#7888FF] mb-2.5">
                      {item.organisation}
                    </strong>
                    <p className="text-muted dark:text-[#A8A8B8] text-xs sm:text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
