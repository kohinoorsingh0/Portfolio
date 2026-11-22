import Image from "next/image";
import { ProjectData, SiteSettingsData } from "@/lib/api";

const defaultStats = [
  { value: "37,612", label: "Lines in FixFlow" },
  { value: "183", label: "Files in FixFlow" },
  { value: "43", label: "Tests in FixFlow" },
  { value: "3", label: "Roles in FixFlow" },
];

interface ApproachProps {
  settings?: Partial<SiteSettingsData>;
  projects?: ProjectData[];
}

export default function Approach({ settings }: ApproachProps) {
  const stats = defaultStats;
  const photoUrl = settings?.profilePhotoUrl || "/images/profile.jpg";
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-navy py-16 sm:py-24 lg:py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Story Grid: Left Story Copy, Right Tilted Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-12 lg:gap-16">
          {/* Left Column: Story Copy */}
          <div className="flex flex-col items-start">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.12em] text-coral mb-3 block">
              MY APPROACH
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream mb-6 sm:mb-8">
              Equal parts logic and{" "}
              <span className="text-coral">imagination.</span>
            </h2>
            <div className="space-y-5 text-muted dark:text-[#A8A8B8] text-base sm:text-lg leading-relaxed max-w-xl">
              <p>
                I got into development because it lets me build useful things
                from nothing more than an idea. I stayed because every project
                asks better questions: Who is this for? What should feel
                effortless? What can be simpler?
              </p>
              <p>
                Today I work across the stack, moving comfortably from a rough
                interface sketch to an API contract, data model, and polished
                responsive build.
              </p>
            </div>
          </div>

          {/* Right Column: Tilted Photo Card */}
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] bg-lime p-3.5 sm:p-4 pb-12 sm:pb-14 rotate-[1.5deg] sm:rotate-[2.5deg] hover:rotate-0 transition-transform duration-500 shadow-[8px_10px_0_#111111] sm:shadow-[14px_16px_0_#111111] dark:shadow-[8px_10px_0_#050814] sm:dark:shadow-[14px_16px_0_#050814]">
              {/* Image Frame with object-top to guarantee full head is visible */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-lavender dark:bg-[#1E2650]">
                <Image
                  src={photoUrl}
                  alt="Kohinoor Singh"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 320px, 380px"
                  className="object-cover object-top"
                />
              </div>

              {/* Tilted Card Bottom Stamp / Label */}
              <span className="absolute bottom-3.5 left-3 sm:left-5 font-mono text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#14121F] uppercase select-none">
                BASED IN INDIA · WORKING EVERYWHERE
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Stats Grid: Verified FixFlow Numbers Only */}
        <div className="mt-16 sm:mt-24 bg-white dark:bg-[#151C3B] border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`p-6 sm:p-8 flex flex-col justify-center ${
                idx < stats.length - 1
                  ? "border-b sm:border-b-0 lg:border-r border-black/10 dark:border-white/10"
                  : ""
              } ${
                idx === 1
                  ? "sm:border-r-0 lg:border-r"
                  : idx === 0
                  ? "sm:border-r"
                  : idx === 2
                  ? "sm:border-r"
                  : ""
              }`}
            >
              <strong className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-[-0.04em] text-ink dark:text-cream leading-tight">
                {stat.value}
              </strong>
              <p className="text-muted dark:text-[#A8A8B8] text-xs sm:text-sm font-medium mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
