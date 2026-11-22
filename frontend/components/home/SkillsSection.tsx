import SkillCard, { SkillCategory } from "@/components/skills/SkillCard";
import { SkillData } from "@/lib/api";

const defaultCategories: SkillCategory[] = [
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
      { name: "Antigravity", level: "Working" },
    ],
  },
];

interface SkillsSectionProps {
  skills?: SkillData[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const categories: SkillCategory[] = skills && skills.length > 0
    ? [
        {
          number: "01",
          category: "Frontend" as const,
          skills: skills
            .filter((s) => s.category === "Frontend" && s.visible !== false)
            .map((s) => ({ name: s.name, level: s.level === "Beginner" ? "Working" : s.level })),
        },
        {
          number: "02",
          category: "Backend" as const,
          skills: skills
            .filter((s) => s.category === "Backend" && s.visible !== false)
            .map((s) => ({ name: s.name, level: s.level === "Beginner" ? "Working" : s.level })),
        },
        {
          number: "03",
          category: "Database" as const,
          skills: skills
            .filter((s) => s.category === "Database" && s.visible !== false)
            .map((s) => ({ name: s.name, level: s.level === "Beginner" ? "Working" : s.level })),
        },
        {
          number: "04",
          category: "Tools & DevOps" as const,
          skills: skills
            .filter((s) => s.category === "Tools & DevOps" && s.visible !== false)
            .map((s) => ({ name: s.name, level: s.level === "Beginner" ? "Working" : s.level })),
        },
      ].map((cat, idx) => ({
        ...cat,
        skills: cat.skills.length > 0 ? cat.skills : defaultCategories[idx].skills,
      }))
    : defaultCategories;
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-navy py-16 sm:py-24 lg:py-32 transition-colors duration-300">
      {/* Decorative background glow matching Figma cream/lavender style */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-lavender/40 dark:bg-royal/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 sm:mb-16">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-[#C83C1A] dark:text-coral mb-3 block">
            THE SKILLS SECTION
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-[76px] font-black tracking-[-0.04em] leading-[0.96] text-ink dark:text-cream">
            SKILLS THAT SHIP.
          </h2>
        </div>

        {/* 4 Category Cards: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {categories.map((cat) => (
            <SkillCard
              key={cat.category}
              number={cat.number}
              category={cat.category}
              skills={cat.skills}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
