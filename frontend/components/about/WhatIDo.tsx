const services = [
  {
    number: "01",
    title: "Web app development",
    description:
      "Fast, accessible products that scale from first user to first million.",
  },
  {
    number: "02",
    title: "API & backend systems",
    description:
      "Secure, well-structured APIs and data models built for change.",
  },
  {
    number: "03",
    title: "UI implementation",
    description:
      "Pixel-sharp, responsive interfaces with delightful motion and feel.",
  },
  {
    number: "04",
    title: "Deploy & optimize",
    description:
      "Reliable releases, observability, and performance that stays fast.",
  },
];

export default function WhatIDo() {
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-navy py-16 sm:py-24 lg:py-32 transition-colors duration-300 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral mb-3 block">
            03 / What I do
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream mb-4">
            From &ldquo;what if?&rdquo; to &ldquo;it&apos;s live.&rdquo;
          </h2>
          <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-lg leading-relaxed">
            How I partner with teams and turn requirements into robust production
            software.
          </p>
        </div>

        {/* Services Cards: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((service) => (
            <article
              key={service.number}
              className="border border-black/10 dark:border-white/10 bg-white dark:bg-[#151C3B] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[295px] transition-all duration-300 hover:bg-royal hover:text-white dark:hover:bg-royal shadow-[0_10px_30px_rgba(20,18,31,0.03)] dark:shadow-none hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(20,18,31,0.12)] group"
            >
              <span className="font-mono text-xs font-bold text-coral group-hover:text-lime transition-colors">
                {service.number}
              </span>

              <div className="mt-auto pt-6">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-cream group-hover:text-white mb-2 transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted dark:text-[#A8A8B8] text-xs sm:text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                  {service.description}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center ml-auto mt-5 group-hover:bg-lime group-hover:text-ink group-hover:border-lime group-hover:-rotate-45 transition-all duration-300">
                <span className="text-sm font-bold" aria-hidden="true">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
