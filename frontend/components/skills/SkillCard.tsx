export interface SkillItem {
  name: string;
  level: "Strong" | "Working" | "Beginner";
}

export interface SkillCardProps {
  number: string;
  category: string;
  skills: SkillItem[];
}

export type SkillCategory = SkillCardProps;

export default function SkillCard({
  number,
  category,
  skills,
}: SkillCardProps) {
  return (
    <article className="bg-[#FFFBF2] dark:bg-[#151C3B] border border-black/10 dark:border-white/10 rounded-[20px] p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_rgba(20,18,31,0.04)] dark:shadow-none hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(20,18,31,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-300">
      <div>
        {/* Header: Number & Category */}
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-coral mb-2 block">
          {number} / {category.toUpperCase()}
        </span>
        <h3 className="text-2xl font-black tracking-tight text-ink dark:text-cream mb-6">
          {category}
        </h3>

        {/* Skills List */}
        <ul className="space-y-3.5">
          {skills.map((skill) => (
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
                    : skill.level === "Working"
                    ? "bg-lavender text-royal border border-[#DDD6FE] dark:bg-royal/20 dark:text-[#7888FF] dark:border-royal/30"
                    : "bg-black/5 text-muted border border-black/10 dark:bg-white/10 dark:text-[#A0A0B0] dark:border-white/10"
                }`}
              >
                {skill.level}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
