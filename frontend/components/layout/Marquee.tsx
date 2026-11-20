export default function Marquee() {
  const count = 8;
  const items = Array.from({ length: count });

  return (
    <div
      className="relative w-full overflow-hidden select-none bg-[#14121f] py-12 sm:py-16 md:py-20 border-0 m-0"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee">
        {/* Track 1 */}
        <div className="flex items-center shrink-0">
          {items.map((_, idx) => (
            <span
              key={`marquee-1-${idx}`}
              className="inline-flex items-center shrink-0"
            >
              <span className="font-sans text-[48px] sm:text-[72px] md:text-[92px] lg:text-[110px] font-black tracking-[-0.05em] leading-none text-[#FAF8F4] whitespace-nowrap">
                LET&apos;S MAKE IT HAPPEN
              </span>
              <span
                className="text-[#C8F542] text-3xl sm:text-5xl md:text-6xl lg:text-7xl mx-5 sm:mx-8 md:mx-12 inline-block select-none leading-none"
                aria-hidden="true"
              >
                ✦
              </span>
            </span>
          ))}
        </div>

        {/* Track 2 for seamless loop */}
        <div className="flex items-center shrink-0">
          {items.map((_, idx) => (
            <span
              key={`marquee-2-${idx}`}
              className="inline-flex items-center shrink-0"
            >
              <span className="font-sans text-[48px] sm:text-[72px] md:text-[92px] lg:text-[110px] font-black tracking-[-0.05em] leading-none text-[#FAF8F4] whitespace-nowrap">
                LET&apos;S MAKE IT HAPPEN
              </span>
              <span
                className="text-[#C8F542] text-3xl sm:text-5xl md:text-6xl lg:text-7xl mx-5 sm:mx-8 md:mx-12 inline-block select-none leading-none"
                aria-hidden="true"
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
