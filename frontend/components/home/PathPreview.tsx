import Link from "next/link";

export default function PathPreview() {
  return (
    <section className="relative overflow-hidden bg-lavender dark:bg-[#181C38] py-20 sm:py-28 lg:py-32 min-h-[500px] sm:min-h-[580px] flex flex-col items-center justify-center text-center transition-colors duration-300">
      {/* Subtle decorative glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/40 dark:bg-royal/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Eyebrow */}
        <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-[#C83C1A] dark:text-coral mb-4 block">
          THE PATH SO FAR
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[70px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream mb-6">
          Learning in public.
          <br />
          Building with purpose.
        </h2>

        {/* Real Content Body (No invented dates, no fake internships) */}
        <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-lg max-w-[590px] leading-relaxed mx-auto mb-9">
          A growing story of coursework, FixFlow, and hundreds of small
          improvements.
        </p>

        {/* Button to /journey */}
        <Link
          href="/journey"
          className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-ink text-ink bg-transparent hover:shadow-[0_8px_0_#FF5C38] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] font-bold text-sm sm:text-base transition-all duration-200 dark:border-cream/40 dark:text-cream dark:hover:border-cream dark:hover:shadow-[0_8px_0_#FF5C38]"
        >
          <span>Follow my journey</span>
          <span className="text-base" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
