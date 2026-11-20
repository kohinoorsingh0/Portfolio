import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="w-full px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto rounded-3xl bg-cream-card dark:bg-navy/80 border border-black/10 dark:border-white/10 p-8 sm:p-12 md:p-16 text-center shadow-sm">
        <span className="mono-label text-xs sm:text-sm font-bold text-royal dark:text-lime tracking-wider block mb-3">
          HAVE A PROJECT OR AN OPEN ROLE?
        </span>
        <h2 className="headline text-3xl sm:text-4xl md:text-5xl font-black text-ink dark:text-cream tracking-tight max-w-2xl mx-auto mb-8">
          Let&apos;s build something remarkable.
        </h2>
        <div className="flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-coral hover:bg-coral-hover active:scale-95 transition-all duration-150 rounded-full shadow-md hover:shadow-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-royal"
          >
            Start a conversation →
          </Link>
        </div>
      </div>
    </section>
  );
}
