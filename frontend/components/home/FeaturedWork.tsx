import Link from "next/link";

const fixflowStack = [
  "React 19",
  "Tailwind 4",
  "Express 5",
  "MongoDB",
  "Gemini AI",
  "ImageKit",
  "PWA",
];

export default function FeaturedWork() {
  return (
    <section className="relative overflow-hidden bg-ink text-white py-20 sm:py-28 lg:py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.12em] text-lime mb-3 block">
            01 / Featured work — One project. The full story.
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-[-0.035em] text-white leading-[1.05] mb-4">
            One project. The full story.
          </h2>
          <p className="text-[#AAA6B5] text-base sm:text-lg leading-relaxed">
            A glimpse at how I think, design, and build.
          </p>
        </div>

        {/* Featured Project Card: FixFlow */}
        <article className="mt-12 sm:mt-16 bg-[#C8C1FF] text-[#14121F] rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          {/* Left Column: Project Information */}
          <div className="flex flex-col justify-between z-10">
            <div>
              {/* Badges Row */}
              <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#14121F]/70">
                  01 / FEATURED
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider border border-[#14121F] rounded-full px-3 py-1 text-[#14121F]">
                  CAMPUS WORKFLOW
                </span>
              </div>

              {/* Title */}
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#14121F] mb-4">
                FixFlow
              </h3>

              {/* Description */}
              <p className="text-[#14121F]/80 text-sm sm:text-base leading-relaxed max-w-md mb-6">
                Campus complaint workflow system with 3-tier role management, SLA
                tracking, automated duplicate detection, and AI triage powered by
                Gemini.
              </p>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {fixflowStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-white/60 border border-[#14121F]/20 text-[#14121F] font-mono text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Row */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#14121F]/15">
              <Link
                href="/projects/fixflow"
                className="font-bold text-sm sm:text-base text-[#14121F] border-b-2 border-[#14121F] pb-0.5 inline-flex items-center gap-2 hover:gap-3 transition-all duration-200"
              >
                <span>Read case study</span>
                <span className="text-base" aria-hidden="true">
                  →
                </span>
              </Link>
              <a
                href="https://github.com/FixFlow-Official/FixFlow"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sm sm:text-base text-[#14121F] border-b-2 border-[#14121F] pb-0.5 inline-flex items-center gap-2 hover:gap-3 transition-all duration-200"
              >
                <span>GitHub</span>
                <span className="text-base" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Browser / Dashboard Mockup */}
          <div className="relative flex items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-full bg-[#FDFCFA] border-[4px] sm:border-[6px] border-[#14121F] rounded-2xl overflow-hidden shadow-[14px_16px_0_rgba(20,18,31,0.22)] rotate-1 lg:rotate-[2.5deg] hover:rotate-0 transition-transform duration-500">
              {/* Browser Bar */}
              <div className="border-b-2 border-[#14121F] bg-[#F4F1EA] h-9 px-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-[#14121F] bg-[#FF5C38]" />
                  <span className="w-2 h-2 rounded-full border border-[#14121F] bg-[#FFD7BE]" />
                  <span className="w-2 h-2 rounded-full border border-[#14121F] bg-[#C8F542]" />
                </div>
                <span className="font-mono text-[10px] text-[#14121F]/70 tracking-wider">
                  fixflow.internal
                </span>
                <div className="w-6" />
              </div>

              {/* Browser UI Mockup */}
              <div className="p-4 sm:p-5 grid grid-cols-[30%_1fr] gap-3 bg-[#FDFCFA] min-h-[240px] sm:min-h-[290px]">
                {/* Mini Sidebar */}
                <div className="border-r border-[#14121F]/15 pr-3 flex flex-col gap-2">
                  <div className="h-3 w-14 bg-[#14121F] rounded-sm mb-2" />
                  <div className="h-2 w-full bg-[#14121F]/20 rounded-sm" />
                  <div className="h-2 w-4/5 bg-[#14121F]/20 rounded-sm" />
                  <div className="h-2 w-3/4 bg-[#14121F]/20 rounded-sm" />
                  <div className="mt-auto p-2 bg-[#E3DDFF] rounded-lg border border-[#14121F]/20">
                    <p className="font-mono text-[9px] font-bold text-[#14121F]">
                      SLA Tracking
                    </p>
                  </div>
                </div>

                {/* Mini Main Content Area */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#14121F]/10">
                    <div className="h-3.5 w-28 bg-[#14121F] rounded-sm" />
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-lime text-[#14121F] font-bold">
                      LIVE
                    </span>
                  </div>

                  {/* 3 Status Cards matching Figma .ui-cards */}
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div className="bg-[#E3DDFF] border border-[#14121F]/15 rounded-lg p-2.5 flex flex-col justify-between h-20 sm:h-24">
                      <span className="font-mono text-[9px] font-bold text-[#14121F]">
                        Open
                      </span>
                      <span className="font-black text-lg sm:text-xl text-[#14121F]">
                        12
                      </span>
                    </div>
                    <div className="bg-[#FFDDD4] border border-[#14121F]/15 rounded-lg p-2.5 flex flex-col justify-between h-20 sm:h-24">
                      <span className="font-mono text-[9px] font-bold text-[#14121F]">
                        Triage
                      </span>
                      <span className="font-black text-lg sm:text-xl text-[#14121F]">
                        4
                      </span>
                    </div>
                    <div className="bg-[#DFF5AD] border border-[#14121F]/15 rounded-lg p-2.5 flex flex-col justify-between h-20 sm:h-24">
                      <span className="font-mono text-[9px] font-bold text-[#14121F]">
                        Solved
                      </span>
                      <span className="font-black text-lg sm:text-xl text-[#14121F]">
                        148
                      </span>
                    </div>
                  </div>

                  {/* Incident Feed Row */}
                  <div className="mt-2 p-2 bg-[#F4F1EA] rounded border border-[#14121F]/10 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[#14121F]/80">
                      #1042 Lab 3 AC Repair
                    </span>
                    <span className="font-mono text-[9px] text-royal font-bold">
                      Assigned
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Real Metric Floating Stamp */}
            <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wide bg-white border border-[#14121F] rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-[4px_5px_0_#14121F] rotate-[-4deg] text-[#14121F] z-20 select-none">
              37,612 LOC · 183 FILES · 3 ROLES
            </div>
          </div>
        </article>

        {/* View all projects CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-lime text-[#14121F] font-bold text-sm sm:text-base border border-lime hover:shadow-[0_8px_0_#FF5C38] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>View all projects</span>
            <span className="text-base" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
