"use client";

import Link from "next/link";
import { useState } from "react";
import { ProjectData } from "@/lib/api";

export interface ProjectItem {
  slug: string;
  number: string;
  title: string;
  type: string;
  categories: string[];
  featured?: boolean;
  palette: "violet" | "orange" | "green";
  metric: string;
  desc: string;
  stack: string[];
  github: string;
  live?: string;
  browserUrl: string;
}

export const SEEDED_PROJECTS: ProjectItem[] = [
  {
    slug: "fixflow",
    number: "01",
    title: "FixFlow",
    type: "Full-Stack",
    categories: ["Full-Stack", "Backend", "Frontend"],
    featured: true,
    palette: "violet",
    metric: "37,612 lines · 183 files · 43 tests",
    desc: "Campus complaint workflow system, MERN. Role-based routing for students, staff, and admins with OTP verification, SLA tracking, AI triage, automated duplicate detection, and real-time push notifications.",
    stack: [
      "React 19",
      "TypeScript",
      "Express 5",
      "MongoDB",
      "Tailwind 4",
      "Gemini AI",
    ],
    github: "https://github.com/FixFlow-Official/FixFlow",
    browserUrl: "github.com/FixFlow-Official/FixFlow",
  },
  {
    slug: "kohinoor-tunes",
    number: "02",
    title: "Kohinoor Tunes",
    type: "Frontend",
    categories: ["Frontend"],
    featured: false,
    palette: "orange",
    metric: "ArchiveTune Fork · Open Source",
    desc: "Free open-source music streaming application, customized and rebranded from ArchiveTune for personal and friend circles with an optimized audio player interface.",
    stack: ["React Native", "TypeScript", "Expo", "Audio API"],
    github: "https://github.com/kohinoorsingh0/KohinoorTunes",
    browserUrl: "github.com/kohinoorsingh0/KohinoorTunes",
  },
];

const FILTER_OPTIONS = ["All", "Full-Stack", "Frontend", "Backend"] as const;

export default function ProjectCard({ project }: { project: ProjectItem }) {
  // Figma colour palette backgrounds
  const paletteClasses = {
    violet: "bg-[#C8C1FF] text-[#14121F]",
    orange: "bg-[#FFB49D] text-[#14121F]",
    green: "bg-[#C8F169] text-[#14121F]",
  }[project.palette];

  return (
    <article
      className={`group relative rounded-[24px] sm:rounded-[28px] ${paletteClasses} p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr] gap-8 sm:gap-12 lg:gap-14 overflow-hidden transition-all duration-300 hover:shadow-2xl`}
    >
      {/* Left Column: Project Info */}
      <div className="flex flex-col justify-between z-10">
        <div>
          {/* Header Row: Number / Featured & Type pill */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <span className="font-mono text-xs sm:text-[13px] font-bold tracking-[0.14em] text-[#14121F]/80 uppercase">
              {project.number} {project.featured ? "/ FEATURED" : ""}
            </span>
            <span className="font-mono text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-[#14121F]/40 text-[#14121F] bg-white/30 backdrop-blur-xs">
              {project.type}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-sans text-3xl xs:text-4xl sm:text-5xl lg:text-[62px] font-black tracking-[-0.05em] leading-[0.98] text-[#14121F] mb-4 sm:mb-5">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#14121F]/85 leading-relaxed max-w-lg mb-6 sm:mb-8">
            {project.desc}
          </p>

          {/* Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-full bg-white/50 text-[#14121F] border border-[#14121F]/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links: Read case study + GitHub (Real URLs only, no fake live link) */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#14121F]/15 mt-auto">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 font-bold text-sm sm:text-base text-[#14121F] border-b-2 border-[#14121F] pb-0.5 hover:opacity-75 transition-opacity cursor-pointer"
          >
            <span>Read case study</span>
            <span className="text-lg" aria-hidden="true">
              →
            </span>
          </Link>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-sm sm:text-base text-[#14121F] border-b-2 border-[#14121F] pb-0.5 hover:opacity-75 transition-opacity cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </a>

          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-sm sm:text-base text-[#14121F] border-b-2 border-[#14121F] pb-0.5 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <span>Live Demo</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Tilted Browser Mock-up matching Figma */}
      <div className="relative flex items-center justify-center pt-4 lg:pt-0">
        <div className="w-full max-w-[500px] h-[280px] sm:h-[320px] md:h-[340px] bg-[#FDFCF9] rounded-2xl border-[4px] sm:border-[5px] border-[#14121F] shadow-[12px_14px_0_rgba(20,18,31,0.18)] sm:shadow-[18px_20px_0_rgba(20,18,31,0.22)] overflow-hidden transition-all duration-500 ease-out transform lg:rotate-[2.5deg] group-hover:rotate-0 group-hover:-translate-y-2 group-hover:scale-[1.02]">
          {/* Browser Top Bar */}
          <div className="h-9 bg-[#F4F0EA] border-b-2 border-[#14121F] px-3 sm:px-4 flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-[#14121F] bg-[#14121F]/20 inline-block" />
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-[#14121F] bg-[#14121F]/20 inline-block" />
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-[#14121F] bg-[#14121F]/20 inline-block" />
            <span className="font-mono text-[9px] sm:text-[10px] text-[#14121F]/75 mx-auto font-medium truncate max-w-[200px] sm:max-w-[260px]">
              {project.browserUrl}
            </span>
          </div>

          {/* Browser Simulated Content UI */}
          <div className="grid grid-cols-[24%_1fr] h-[calc(100%-36px)]">
            {/* Sidebar */}
            <div className="bg-[#F3F0FF] border-r border-[#14121F]/15 p-3 flex flex-col gap-2">
              <span className="w-full h-2 bg-[#14121F]/15 rounded-xs" />
              <span className="w-4/5 h-2 bg-[#14121F]/10 rounded-xs" />
              <span className="w-3/5 h-2 bg-[#14121F]/10 rounded-xs" />
              <div className="mt-auto space-y-1.5">
                <span className="w-full h-2 bg-[#14121F]/10 rounded-xs block" />
                <span className="w-2/3 h-2 bg-[#14121F]/10 rounded-xs block" />
              </div>
            </div>

            {/* Main Area */}
            <div className="p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="inline-block w-10 sm:w-12 h-2 bg-[#FF5C38] rounded-xs mb-2" />
                <p className="font-sans font-black text-lg sm:text-2xl text-[#14121F] tracking-tight leading-none mb-2" aria-hidden="true">
                  {project.title}
                </p>
                <div className="space-y-1.5">
                  <span className="block w-4/5 h-1.5 bg-[#14121F]/15 rounded-xs" />
                  <span className="block w-3/5 h-1.5 bg-[#14121F]/10 rounded-xs" />
                </div>
              </div>

              {/* Mini UI Cards preview */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="h-12 sm:h-16 rounded-md bg-[#E3DDFF] border border-[#14121F]/10 flex items-center justify-center">
                  <span className="font-mono text-[8px] font-bold text-[#14121F]/60">
                    UI
                  </span>
                </div>
                <div className="h-12 sm:h-16 rounded-md bg-[#FFDDD4] border border-[#14121F]/10 flex items-center justify-center">
                  <span className="font-mono text-[8px] font-bold text-[#14121F]/60">
                    API
                  </span>
                </div>
                <div className="h-12 sm:h-16 rounded-md bg-[#DFF5AD] border border-[#14121F]/10 flex items-center justify-center">
                  <span className="font-mono text-[8px] font-bold text-[#14121F]/60">
                    DB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Stats Metric Badge attached to the mock-up */}
        <div className="absolute -bottom-2 sm:-bottom-3 -right-1 sm:right-2 z-20 font-mono text-[10px] sm:text-xs font-bold text-[#14121F] bg-white border-[1.5px] border-[#14121F] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-[3px_4px_0_#14121F] transform -rotate-3 select-none">
          {project.metric}
        </div>
      </div>
    </article>
  );
}

interface ProjectsListProps {
  projects?: ProjectData[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const projectItems: ProjectItem[] =
    projects && projects.length > 0
      ? projects.map((p, idx) => {
          const stackList = Array.isArray(p.stack) ? p.stack : [];
          const isFullStack = stackList.some(
            (s) =>
              typeof s === "string" &&
              (s.toLowerCase().includes("express") ||
                s.toLowerCase().includes("node") ||
                s.toLowerCase().includes("mongo"))
          );
          const type = isFullStack ? "Full-Stack" : "Frontend";
          const categories = isFullStack
            ? ["Full-Stack", "Backend", "Frontend"]
            : ["Frontend"];
          const palette: "violet" | "orange" | "green" =
            idx % 3 === 0 ? "violet" : idx % 3 === 1 ? "orange" : "green";

          return {
            slug: p.slug,
            number: String(idx + 1).padStart(2, "0"),
            title: p.title,
            type,
            categories,
            featured: p.featured,
            palette,
            metric: p.resultText || (p.featured ? "Featured Project" : "Open Source"),
            desc: p.shortDescription || p.longDescription,
            stack: stackList,
            github: p.githubUrl,
            live: p.liveUrl || undefined,
            browserUrl: p.githubUrl
              ? p.githubUrl.replace(/^https?:\/\//, "")
              : `${p.slug}.app`,
          };
        })
      : projects && projects.length === 0
      ? []
      : SEEDED_PROJECTS;

  const filteredProjects = projectItems.filter((project) => {
    if (activeFilter === "All") return true;
    if (project.type.toLowerCase() === activeFilter.toLowerCase()) return true;
    if (
      project.categories.some(
        (cat) => cat.toLowerCase() === activeFilter.toLowerCase()
      )
    ) {
      return true;
    }
    return false;
  });

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Work Page Top Bar: Intro note + Interactive Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <p className="text-sm sm:text-base text-[#B9B5C4] max-w-lg leading-relaxed">
          Each project is a chance to make something clearer, faster, and more
          useful than it was before.
        </p>

        {/* Filter Bar matching Figma: .filter-bar */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
          role="group"
          aria-label="Filter projects by category"
        >
          {FILTER_OPTIONS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={isActive}
                className={`whitespace-nowrap min-h-[44px] inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-lime focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-[#C8F542] text-[#14121F] border border-[#C8F542] shadow-sm font-bold"
                    : "text-[#AAA5B5] border border-[#45404F] hover:bg-[#C8F542] hover:text-[#14121F] hover:border-[#C8F542] bg-transparent"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-8 sm:space-y-10">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))
        ) : (
          <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5 text-[#AAA5B5]">
            <p className="text-base font-medium">
              {projectItems.length === 0
                ? "Content coming soon"
                : `No projects found for category "${activeFilter}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
