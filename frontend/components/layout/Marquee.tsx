export default function Marquee() {
  const item = "LET'S MAKE IT HAPPEN ✦ ";
  const items = Array(8).fill(item);

  return (
    <div
      className="relative w-full overflow-hidden py-6 sm:py-8 select-none border-y border-black/10 dark:border-white/10 bg-cream-card/50 dark:bg-navy/50"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee">
        {/* Track 1 */}
        <div className="flex items-center shrink-0">
          {items.map((text, idx) => (
            <span
              key={`marquee-1-${idx}`}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink/20 dark:text-cream/20 whitespace-pre pr-8"
            >
              {text}
            </span>
          ))}
        </div>
        {/* Track 2 for seamless loop */}
        <div className="flex items-center shrink-0">
          {items.map((text, idx) => (
            <span
              key={`marquee-2-${idx}`}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink/20 dark:text-cream/20 whitespace-pre pr-8"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
