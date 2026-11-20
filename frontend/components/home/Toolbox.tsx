import Link from "next/link";

const capabilities = [
  {
    number: "01",
    group: "Frontend",
    items: ["React", "TypeScript", "Next.js", "Tailwind"],
  },
  {
    number: "02",
    group: "Backend",
    items: ["Node.js", "Express", "REST APIs", "Auth"],
  },
  {
    number: "03",
    group: "Database",
    items: ["MongoDB", "PostgreSQL", "Mongoose"],
  },
  {
    number: "04",
    group: "Tools & DevOps",
    items: ["Git", "Docker", "Vercel", "Figma"],
  },
];

export default function Toolbox() {
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-navy py-16 sm:py-24 lg:py-32 transition-colors duration-300 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-start gap-12 lg:gap-16">
          {/* Left Column: Sticky Lead */}
          <div className="lg:sticky lg:top-32">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.08em] text-coral mb-3 block">
              THE TOOLBOX
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream mb-6 sm:mb-8">
              Built to cross the gap between idea and impact.
            </h2>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-bold text-sm sm:text-base text-ink dark:text-cream border-b-2 border-royal dark:border-[#7888FF] pb-1 hover:text-royal dark:hover:text-[#7888FF] hover:gap-3 transition-all duration-200"
            >
              <span>Explore capabilities</span>
              <span className="text-base" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          {/* Right Column: 4 Capabilities Rows */}
          <div className="border-t border-black/10 dark:border-white/10 mt-2 lg:mt-0">
            {capabilities.map((cap) => (
              <div
                key={cap.number}
                className="border-b border-black/10 dark:border-white/10 py-6 sm:py-8 grid grid-cols-[36px_1fr] sm:grid-cols-[55px_1fr_1.35fr] items-baseline sm:items-center gap-x-3 gap-y-2 sm:gap-4 transition-all duration-200 hover:bg-lavender dark:hover:bg-[#1E2650]/60 hover:px-4 sm:hover:px-6 rounded-xl group"
              >
                {/* Number */}
                <span className="font-mono text-xs sm:text-sm font-bold text-coral">
                  {cap.number}
                </span>

                {/* Group Title */}
                <h3 className="font-bold text-xl sm:text-2xl tracking-tight text-ink dark:text-cream">
                  {cap.group}
                </h3>

                {/* Items */}
                <p className="col-span-2 sm:col-span-1 pl-9 sm:pl-0 font-mono text-xs sm:text-sm text-muted dark:text-[#A8A8B8] tracking-wide leading-relaxed">
                  {cap.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
