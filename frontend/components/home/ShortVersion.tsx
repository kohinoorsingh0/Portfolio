import Link from "next/link";

export default function ShortVersion() {
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-navy py-16 sm:py-24 lg:py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[100px_1.25fr_0.85fr] items-start gap-8 lg:gap-12">
          {/* Column 1: Vertical Side Label (Desktop) / Pill on Mobile */}
          <div className="flex lg:justify-start">
            <span className="lg:[writing-mode:vertical-rl] lg:rotate-180 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-muted dark:text-[#A0A0B0] select-none">
              THE SHORT VERSION
            </span>
          </div>

          {/* Column 2: Eyebrow + Headline Line */}
          <div>
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.08em] text-coral mb-3 block">
              A DEVELOPER WHO THINKS IN PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream">
              Logic in the backend.
              <br />
              <span className="text-coral">Feeling in the frontend.</span>
            </h2>
          </div>

          {/* Column 3: Intro Copy + Link */}
          <div className="flex flex-col items-start justify-between h-full pt-1 lg:pt-8">
            <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
              I&apos;m a BCA student who enjoys the whole product journey — from
              untangling the problem to polishing the final pixel. I care about
              clean architecture, honest feedback, and interfaces that feel
              effortless.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-bold text-sm sm:text-base text-ink dark:text-cream border-b-2 border-royal dark:border-[#7888FF] pb-1 hover:text-royal dark:hover:text-[#7888FF] hover:gap-3 transition-all duration-200"
            >
              <span>More about me</span>
              <span className="text-base" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
