interface CapabilityGroup {
  number: string;
  category: string;
  skills: { name: string; level: "Strong" | "Working" }[];
}

const capabilitiesData: CapabilityGroup[] = [
  {
    number: "01",
    category: "Frontend",
    skills: [
      { name: "React", level: "Strong" },
      { name: "TypeScript", level: "Strong" },
      { name: "Next.js", level: "Working" },
      { name: "Tailwind CSS", level: "Strong" },
    ],
  },
  {
    number: "02",
    category: "Backend",
    skills: [
      { name: "Node.js", level: "Strong" },
      { name: "Express", level: "Strong" },
      { name: "REST APIs", level: "Strong" },
      { name: "Auth (JWT/OTP)", level: "Working" },
    ],
  },
  {
    number: "03",
    category: "Database",
    skills: [
      { name: "MongoDB", level: "Strong" },
      { name: "Mongoose", level: "Strong" },
      { name: "PostgreSQL", level: "Working" },
    ],
  },
  {
    number: "04",
    category: "Tools & DevOps",
    skills: [
      { name: "Git & GitHub", level: "Strong" },
      { name: "Docker", level: "Working" },
      { name: "Vercel", level: "Strong" },
      { name: "Figma", level: "Working" },
    ],
  },
];

export default function Capabilities() {
  return (
    <section className="relative overflow-hidden bg-lavender dark:bg-[#181C38] py-16 sm:py-24 lg:py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral mb-3 block">
            02 / Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream mb-4">
            A stack built for shipping.
          </h2>
          <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-lg leading-relaxed">
            Tools are only useful when they serve the idea. These are the ones I
            trust to do both.
          </p>
        </div>

        {/* 4 Cards: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {capabilitiesData.map((item) => (
            <article
              key={item.category}
              className="bg-white dark:bg-[#151C3B] border border-black/10 dark:border-white/10 rounded-[22px] p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_rgba(20,18,31,0.04)] dark:shadow-none hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(20,18,31,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-300 group"
            >
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-coral mb-2 block">
                  {item.number}
                </span>
                <h3 className="text-2xl font-black tracking-tight text-ink dark:text-cream mb-6">
                  {item.category}
                </h3>

                <ul className="space-y-3.5">
                  {item.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5 last:border-b-0 last:pb-0"
                    >
                      <span className="font-semibold text-sm sm:text-base text-ink dark:text-cream">
                        {skill.name}
                      </span>
                      <span
                        className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full select-none ${
                          skill.level === "Strong"
                            ? "bg-lime/30 text-ink border border-lime/60 dark:bg-lime/20 dark:text-lime dark:border-lime/40"
                            : "bg-lavender text-royal border border-[#DDD6FE] dark:bg-royal/20 dark:text-[#7888FF] dark:border-royal/30"
                        }`}
                      >
                        {skill.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
