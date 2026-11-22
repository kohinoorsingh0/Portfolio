import Link from "next/link";

export interface CaseStudyData {
  slug: string;
  title: string;
  type: string;
  palette: "violet" | "orange" | "green";
  year: string;
  discipline: string;
  desc: string;
  role: string;
  stackText: string;
  metric: string;
  browserUrl: string;
  challenge: string;
  solution: string;
  outcome: string;
  nextSlug: string;
  nextTitle: string;
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  fixflow: {
    slug: "fixflow",
    title: "FixFlow",
    type: "Full-Stack",
    palette: "violet",
    year: "2026",
    discipline: "DESIGN + DEVELOPMENT",
    desc: "Campus complaint workflow system with automated triage, duplicate detection, and role-based resolution paths.",
    role: "Product design / Full-stack development",
    stackText: "Next.js, Node, MongoDB, Express 5, React 19, Gemini AI, Tailwind CSS",
    metric: "37,612 lines · 183 files · 43 tests",
    browserUrl: "github.com/FixFlow-Official/FixFlow",
    challenge:
      "Campus facilities, student hostels, and department complaints were previously scattered across handwritten registers, informal messages, and untracked emails. Issues were routinely lost, duplicate complaints overwhelmed maintenance staff, and students had zero visibility into resolution progress or service level agreements (SLAs).",
    solution:
      "I built FixFlow with a dedicated 3-role workflow for students, staff, and campus administrators. The system features OTP email verification, automated Gemini AI triage to classify tickets and detect duplicates instantly, room-level QR code scanning, campus heatmap tracking, and real-time push notifications to keep everyone informed without friction.",
    outcome:
      "A verified production-grade system spanning 37,612 lines of code across 183 files and 43 automated tests. With progressive web app (PWA) offline capabilities, automated SLA breach escalation, and trending upvotes, FixFlow was architected from day one to operate reliably under real institutional demand.",
    nextSlug: "kohinoor-tunes",
    nextTitle: "Kohinoor Tunes",
  },
  "kohinoor-tunes": {
    slug: "kohinoor-tunes",
    title: "Kohinoor Tunes",
    type: "Frontend",
    palette: "orange",
    year: "2026",
    discipline: "MOBILE / OPEN-SOURCE",
    desc: "Free open-source music streaming application customized for friends with an optimized audio player interface.",
    role: "Mobile UI design / Frontend development",
    stackText: "React Native, TypeScript, Expo, Audio API",
    metric: "ArchiveTune Fork · Open Source",
    browserUrl: "github.com/kohinoorsingh0/KohinoorTunes",
    challenge:
      "Streaming music applications frequently suffer from intrusive advertisements, heavy battery drain, and cluttered interfaces that get in the way of straightforward listening. The goal was to build a clean, lightweight personal player for music listening without overhead.",
    solution:
      "Forked and rebranded ArchiveTune into Kohinoor Tunes, refining the playback interface, optimizing the mobile audio streaming queue, and creating a hassle-free personal listening experience for myself and friend circles.",
    outcome:
      "A dependable open-source mobile player with streamlined playlist navigation, zero distractions, and native audio performance across Android devices.",
    nextSlug: "fixflow",
    nextTitle: "FixFlow",
  },
};

export default function CaseStudy({ project }: { project: CaseStudyData }) {
  const paletteClasses = {
    violet: "bg-[#C8C1FF] text-[#14121F]",
    orange: "bg-[#FFB49D] text-[#14121F]",
    green: "bg-[#C8F169] text-[#14121F]",
  }[project.palette];

  return (
    <div className="w-full">
      {/* 00 / CASE HERO */}
      <section
        className={`w-full ${paletteClasses} pt-12 sm:pt-20 pb-16 sm:pb-28 px-4 sm:px-8 lg:px-16 relative overflow-hidden`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-[13px] font-bold text-[#14121F] border-b-2 border-[#14121F] pb-1 hover:opacity-75 transition-opacity mb-10 sm:mb-14 cursor-pointer"
          >
            ← ALL PROJECTS
          </Link>

          {/* Meta Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
            <span className="font-mono text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-[#14121F]/40 bg-white/30 text-[#14121F]">
              {project.type}
            </span>
            <span className="font-mono text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-[#14121F]/40 bg-white/30 text-[#14121F]">
              {project.year}
            </span>
            <span className="font-mono text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-[#14121F]/40 bg-white/30 text-[#14121F]">
              {project.discipline}
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="font-sans text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[124px] font-black tracking-[-0.06em] leading-[0.92] text-[#14121F] mb-6 sm:mb-8 break-words">
            {project.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-xl text-[#14121F]/85 max-w-2xl leading-relaxed mb-12 sm:mb-16">
            {project.desc}
          </p>

          {/* Hero Tilted Browser Mockup */}
          <div className="relative w-full max-w-3xl mx-auto mt-6">
            <div className="w-full bg-[#FDFCF9] rounded-2xl border-[4px] sm:border-[5px] border-[#14121F] shadow-[14px_16px_0_rgba(20,18,31,0.22)] overflow-hidden">
              {/* Browser Bar */}
              <div className="h-10 bg-[#F4F0EA] border-b-2 border-[#14121F] px-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border border-[#14121F] bg-[#14121F]/20" />
                <span className="w-2.5 h-2.5 rounded-full border border-[#14121F] bg-[#14121F]/20" />
                <span className="w-2.5 h-2.5 rounded-full border border-[#14121F] bg-[#14121F]/20" />
                <span className="font-mono text-[10px] sm:text-xs text-[#14121F]/75 mx-auto font-medium">
                  {project.browserUrl}
                </span>
              </div>

              {/* Browser Content */}
              <div className="grid grid-cols-[26%_1fr] h-[240px] sm:h-[300px] md:h-[340px]">
                {/* Sidebar */}
                <div className="bg-[#F3F0FF] border-r border-[#14121F]/15 p-4 flex flex-col gap-2.5">
                  <span className="w-full h-2.5 bg-[#14121F]/15 rounded-xs" />
                  <span className="w-4/5 h-2.5 bg-[#14121F]/10 rounded-xs" />
                  <span className="w-3/5 h-2.5 bg-[#14121F]/10 rounded-xs" />
                  <div className="mt-auto space-y-2">
                    <span className="w-full h-2 bg-[#14121F]/10 rounded-xs block" />
                    <span className="w-2/3 h-2 bg-[#14121F]/10 rounded-xs block" />
                  </div>
                </div>

                {/* Main UI */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-block w-12 h-2.5 bg-[#FF5C38] rounded-xs mb-3" />
                    <p className="font-sans font-black text-2xl sm:text-3xl text-[#14121F] tracking-tight mb-2" aria-hidden="true">
                      {project.title}
                    </p>
                    <p className="text-xs sm:text-sm text-[#14121F]/70 max-w-md line-clamp-2">
                      {project.desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-14 sm:h-20 rounded-lg bg-[#E3DDFF] border border-[#14121F]/10 flex items-center justify-center">
                      <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#14121F]/70">
                        ROLES
                      </span>
                    </div>
                    <div className="h-14 sm:h-20 rounded-lg bg-[#FFDDD4] border border-[#14121F]/10 flex items-center justify-center">
                      <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#14121F]/70">
                        AI TRIAGE
                      </span>
                    </div>
                    <div className="h-14 sm:h-20 rounded-lg bg-[#DFF5AD] border border-[#14121F]/10 flex items-center justify-center">
                      <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#14121F]/70">
                        SLA MAP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric pill */}
            <div className="absolute -bottom-3 -right-2 sm:right-4 z-20 font-mono text-[10px] sm:text-xs font-bold text-[#14121F] bg-white border-[1.5px] border-[#14121F] rounded-full px-4 py-2 shadow-[3px_4px_0_#14121F] transform -rotate-3 select-none">
              {project.metric}
            </div>
          </div>
        </div>
      </section>

      {/* 01 / OVERVIEW */}
      <section className="w-full bg-cream dark:bg-navy py-16 sm:py-24 px-4 sm:px-8 lg:px-16 border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.25fr_1fr_0.65fr] gap-8 lg:gap-14 items-start">
          {/* Index label */}
          <div className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral">
            01 / OVERVIEW
          </div>

          {/* Lead Headline */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-ink dark:text-cream leading-[1.12]">
              Good products begin with a better understanding of the problem.
            </h2>
          </div>

          {/* Spec details dl */}
          <dl className="space-y-6 pt-2">
            <div className="border-b border-black/10 dark:border-white/10 pb-4">
              <dt className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted dark:text-[#A8A8B8] mb-1.5">
                ROLE
              </dt>
              <dd className="font-bold text-sm sm:text-base text-ink dark:text-cream leading-snug">
                Product design
                <br />
                Full-stack development
              </dd>
            </div>

            <div className="border-b border-black/10 dark:border-white/10 pb-4">
              <dt className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted dark:text-[#A8A8B8] mb-1.5">
                STACK
              </dt>
              <dd className="font-semibold text-xs sm:text-sm text-ink/90 dark:text-cream/90 leading-relaxed">
                {project.stackText}
              </dd>
            </div>

            <div className="border-b border-black/10 dark:border-white/10 pb-4">
              <dt className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted dark:text-[#A8A8B8] mb-1.5">
                RESULT
              </dt>
              <dd className="font-bold text-xs sm:text-sm text-ink dark:text-cream leading-relaxed">
                {project.metric}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 02, 03, 04 / CHAPTERS */}
      <section className="w-full bg-lavender dark:bg-[#161B36] transition-colors duration-300">
        {/* Chapter 02: The Challenge */}
        <article className="border-b border-black/5 dark:border-white/10 py-16 sm:py-24 px-4 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.25fr_0.8fr_0.75fr] gap-6 lg:gap-12 items-start">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral">
              02 / THE CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.04em] leading-[1.02] text-ink dark:text-cream">
              Finding the real friction.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted dark:text-[#C5C4D8] leading-relaxed">
              {project.challenge}
            </p>
          </div>
        </article>

        {/* Chapter 03: The Solution (Accent chapter: royal blue) */}
        <article className="bg-royal text-white py-16 sm:py-24 px-4 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.25fr_0.8fr_0.75fr] gap-6 lg:gap-12 items-start">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-lime">
              03 / THE SOLUTION
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.04em] leading-[1.02] text-white">
              Clarity over complexity.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </article>

        {/* Chapter 04: The Outcome */}
        <article className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.25fr_0.8fr_0.75fr] gap-6 lg:gap-12 items-start">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral">
              04 / THE OUTCOME
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.04em] leading-[1.02] text-ink dark:text-cream">
              Built to hold up beyond the demo.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted dark:text-[#C5C4D8] leading-relaxed">
              {project.outcome}
            </p>
          </div>
        </article>
      </section>

      {/* DETAIL / INTERACTION & GALLERY SECTION */}
      <section className="w-full bg-[#0F1530] text-[#FAF8F4] py-16 sm:py-24 px-4 sm:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-10 items-stretch">
          {/* Left Gallery Shot */}
          <div
            className={`rounded-[28px] ${paletteClasses} p-8 sm:p-12 flex flex-col justify-center items-center relative overflow-hidden`}
          >
            <div className="w-full max-w-md bg-[#FDFCF9] rounded-xl border-[4px] border-[#14121F] p-4 shadow-xl">
              <div className="flex items-center gap-1.5 pb-3 border-b border-[#14121F]/15 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#14121F]/30" />
                <span className="w-2 h-2 rounded-full bg-[#14121F]/30" />
                <span className="w-2 h-2 rounded-full bg-[#14121F]/30" />
                <span className="font-mono text-[9px] text-[#14121F]/60 ml-auto">
                  verified repository
                </span>
              </div>
              <h3 className="font-sans font-black text-xl text-[#14121F] mb-1">
                {project.title}
              </h3>
              <p className="text-xs text-[#14121F]/70 mb-4">{project.metric}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-[#E3DDFF] p-2 rounded font-bold text-[#14121F]">
                  ✓ 3 User Roles
                </div>
                <div className="bg-[#DFF5AD] p-2 rounded font-bold text-[#14121F]">
                  ✓ Gemini AI Triage
                </div>
                <div className="bg-[#FFDDD4] p-2 rounded font-bold text-[#14121F]">
                  ✓ SLA Tracking
                </div>
                <div className="bg-white/80 p-2 rounded font-bold text-[#14121F]">
                  ✓ PWA Offline
                </div>
              </div>
            </div>
            <div className="mt-6 font-mono text-[11px] font-bold text-[#14121F] bg-white border border-[#14121F] px-4 py-1.5 rounded-full shadow-md">
              Verified Production Architecture
            </div>
          </div>

          {/* Right Detail / Interaction Shot matching Figma .detail-shot */}
          <div className="rounded-[28px] bg-[#1A1829] border border-white/10 p-6 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-coral block mb-4">
                DETAIL / INTERACTION
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-8">
                Every state considered.
              </h3>
            </div>

            {/* Simulated UI state blocks matching Figma: .detail-ui */}
            <div className="space-y-4">
              <div className="h-14 rounded-xl bg-[#E9E5FF]/10 border border-[#E9E5FF]/20 px-4 sm:px-5 flex items-center justify-between">
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-white/90 truncate mr-2">
                  01 / Role-Based Authentication
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-lime shrink-0">
                  OTP VERIFIED
                </span>
              </div>
              <div className="h-14 rounded-xl bg-lime/10 border border-lime/30 px-4 sm:px-5 ml-0 sm:ml-[8%] flex items-center justify-between">
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-white/90 truncate mr-2">
                  02 / AI Triage &amp; Duplicate Check
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-lime shrink-0">
                  AUTOMATED
                </span>
              </div>
              <div className="h-14 rounded-xl bg-coral/10 border border-coral/30 px-4 sm:px-5 w-full sm:w-[90%] flex items-center justify-between">
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-white/90 truncate mr-2">
                  03 / SLA Breach Escalation
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-coral shrink-0">
                  REAL-TIME
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT CASE STUDY matching Figma: .next-case */}
      <Link
        href={`/projects/${project.nextSlug}`}
        className="group w-full bg-[#FFF3E8] dark:bg-[#1E1715] text-[#14121F] dark:text-cream py-16 sm:py-24 px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors duration-300 border-t border-black/5 dark:border-white/5 cursor-pointer"
      >
        <div className="max-w-4xl">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral block mb-3">
            NEXT CASE STUDY
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-black tracking-[-0.05em] leading-[0.95] text-ink dark:text-cream group-hover:text-royal dark:group-hover:text-lime transition-colors">
            {project.nextTitle}
          </h2>
        </div>

        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-ink dark:border-cream flex items-center justify-center shrink-0 group-hover:bg-coral group-hover:border-coral group-hover:text-white transition-all duration-200">
          <span
            className="text-2xl sm:text-3xl transform group-hover:translate-x-1.5 transition-transform"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </Link>
    </div>
  );
}
