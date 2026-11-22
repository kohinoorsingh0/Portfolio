"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteSettingsData } from "@/lib/api";

const defaultRoles = [
  "interface craftsman",
  "full-stack developer",
  "curious problem solver",
];

interface HeroProps {
  settings?: Partial<SiteSettingsData>;
}

export default function Hero({ settings }: HeroProps) {
  const customRole = settings?.role?.toLowerCase();
  const roles = customRole
    ? [customRole, "interface craftsman", "curious problem solver"]
    : defaultRoles;

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  const availabilityText =
    settings?.availability || "Available for internships & roles";
  const introText =
    settings?.tagline ||
    "I turn ambitious ideas into thoughtful digital experiences — pairing expressive interfaces with reliable, scalable code.";
  const photoUrl =
    settings?.profilePhotoUrl || "/images/kohinoor-watercolor.jpg";

  return (
    <section className="relative overflow-hidden bg-cream dark:bg-navy py-8 sm:py-14 lg:py-20 transition-colors duration-300">
      {/* Decorative blurred background blobs */}
      <div
        className="absolute top-10 -right-20 w-80 h-80 rounded-full bg-[#D8D0FF]/50 dark:bg-royal/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 sm:bottom-16 left-[34%] w-64 h-64 rounded-full bg-[#FFD7BE]/45 dark:bg-coral/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.18fr_0.82fr] items-center gap-10 lg:gap-12">
          {/* Left Column: Hero Text Content */}
          <div className="flex flex-col items-start z-10">
            {/* Green-dot pill: Available for internships & roles */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-[#182042] border border-[#E2DCF0] dark:border-white/10 shadow-[0_4px_16px_rgba(65,55,115,0.06)] dark:shadow-none mb-6">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42b883] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#42b883]" />
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.06em] text-muted dark:text-[#A0A0B0]">
                {availabilityText}
              </span>
            </div>

            {/* Eyebrow & Line */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 min-h-[28px]">
              <span className="font-mono text-xs uppercase tracking-[0.08em] font-semibold text-muted dark:text-[#A0A0B0]">
                HELLO, I&apos;M {settings?.name ? settings.name.toUpperCase() : "KOHINOOR SINGH"} —
              </span>
              <strong className="font-sans font-bold text-base sm:text-lg text-royal dark:text-[#7888FF]">
                {roles[roleIndex]}
              </strong>
            </div>

            {/* Headline */}
            <h1 className="text-[36px] xs:text-[40px] sm:text-[58px] md:text-[70px] lg:text-[84px] xl:text-[96px] font-black leading-[0.93] tracking-[-0.04em] text-ink dark:text-cream mb-6">
              {settings?.heroTitle && settings.heroTitle !== "I build fast, beautiful web products." ? (
                // Custom headline from Admin Settings
                (() => {
                  const title = settings.heroTitle;
                  const hl = (settings.heroHighlightWord || "beautiful").trim();
                  if (hl && title.toLowerCase().includes(hl.toLowerCase())) {
                    const idx = title.toLowerCase().indexOf(hl.toLowerCase());
                    const before = title.slice(0, idx);
                    const match = title.slice(idx, idx + hl.length);
                    const after = title.slice(idx + hl.length);
                    return (
                      <>
                        {before}
                        <span className="relative inline-block z-10 my-0.5">
                          <span className="relative z-10 text-ink px-1.5 sm:px-2">
                            {match}
                          </span>
                          <span
                            className="absolute inset-0 bg-lime -rotate-1 rounded-md -z-0"
                            aria-hidden="true"
                          />
                        </span>
                        {after}
                      </>
                    );
                  }
                  return title;
                })()
              ) : (
                // Signature Figma Headline
                <>
                  I build{" "}
                  <span className="relative inline-block">
                    fast,
                    {/* Hand-drawn coral circle around fast, */}
                    <svg
                      className="absolute -inset-x-2 sm:-inset-x-3 -inset-y-1.5 w-[calc(100%+16px)] sm:w-[calc(100%+24px)] h-[calc(100%+12px)] pointer-events-none text-coral -rotate-2"
                      viewBox="0 0 100 45"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <ellipse
                        cx="50"
                        cy="22.5"
                        rx="46"
                        ry="18"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                    </svg>
                  </span>
                  <br />
                  <span className="relative inline-block z-10 my-0.5">
                    <span className="relative z-10 text-ink px-1.5 sm:px-2">
                      {settings?.heroHighlightWord || "beautiful"}
                    </span>
                    <span
                      className="absolute inset-0 bg-lime -rotate-1 rounded-md -z-0"
                      aria-hidden="true"
                    />
                  </span>{" "}
                  web
                  <br />
                  products.
                </>
              )}
            </h1>

            {/* Intro paragraph */}
            <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-lg max-w-[580px] leading-relaxed mb-8">
              {introText}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-ink text-cream hover:bg-ink/90 hover:shadow-[0_8px_0_#FF5C38] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] font-bold text-sm sm:text-base transition-all duration-200 dark:bg-cream dark:text-ink dark:hover:bg-white dark:hover:shadow-[0_8px_0_#FF5C38]"
              >
                <span>Explore my work</span>
                <span className="text-lg leading-none" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-ink text-ink bg-transparent hover:shadow-[0_8px_0_#FF5C38] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] font-bold text-sm sm:text-base transition-all duration-200 dark:border-cream/40 dark:text-cream dark:hover:border-cream dark:hover:shadow-[0_8px_0_#FF5C38]"
              >
                <span>Meet the developer</span>
                <span className="text-lg leading-none" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Arched Photo & Floating Stickers */}
          <div className="relative w-full max-w-[300px] xs:max-w-[340px] sm:max-w-[420px] lg:max-w-[440px] mx-auto mt-6 lg:mt-0">
            {/* Arched Photo Frame with Watercolor Portrait */}
            <div className="relative w-full h-[360px] xs:h-[400px] sm:h-[420px] lg:h-[540px] bg-white rounded-t-[160px] sm:rounded-t-[220px] rounded-b-[24px] sm:rounded-b-[32px] overflow-hidden shadow-[12px_12px_0_#E9E5FF] sm:shadow-[16px_16px_0_#E9E5FF] dark:shadow-[12px_12px_0_#182046] sm:dark:shadow-[16px_16px_0_#182046] rotate-[1.5deg] hover:rotate-0 transition-transform duration-500 border border-[#DDD6FE] dark:border-white/10 group">
              <Image
                src={photoUrl}
                alt="Kohinoor Singh"
                fill
                priority={true}
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 440px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Sticker 1: REACT ↗ */}
            <div className="absolute top-[16%] left-0 sm:-left-6 rotate-[-8deg] z-20 bg-white dark:bg-[#182042] border border-[#DCD6EA] dark:border-white/10 rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 shadow-[3px_4px_0_rgba(20,18,31,0.12)] sm:shadow-[4px_5px_0_rgba(20,18,31,0.12)] dark:shadow-[3px_4px_0_rgba(0,0,0,0.5)] font-mono font-bold text-[11px] sm:text-sm text-royal dark:text-[#7888FF] flex items-center gap-1.5 select-none pointer-events-none sm:pointer-events-auto">
              <span>REACT</span>
              <span className="text-coral" aria-hidden="true">
                ↗
              </span>
            </div>

            {/* Floating Sticker 2: NODE.JS */}
            <div className="absolute bottom-[20%] right-0 sm:-right-6 rotate-[6deg] z-20 bg-lime border border-[#B6E338] rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 shadow-[3px_4px_0_rgba(20,18,31,0.12)] sm:shadow-[4px_5px_0_rgba(20,18,31,0.12)] font-mono font-bold text-[11px] sm:text-sm text-ink select-none pointer-events-none sm:pointer-events-auto">
              <span>NODE.JS</span>
            </div>

            {/* Floating Sticker 3: </> badge */}
            <div
              className="absolute top-[6%] right-2 sm:right-4 rotate-[6deg] z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-coral text-white flex items-center justify-center font-mono font-bold text-xs sm:text-base shadow-[3px_4px_0_rgba(20,18,31,0.14)] sm:shadow-[4px_5px_0_rgba(20,18,31,0.14)] select-none"
              aria-label="Code badge"
            >
              <span>&lt;/&gt;</span>
            </div>

            {/* Circular Stamp: DESIGN · DEVELOP · DELIVER · (Hidden on mobile < 640px) */}
            <div
              className="hidden sm:flex absolute -bottom-6 -left-7 -rotate-12 z-20 w-24 h-24 rounded-full bg-royal text-white shadow-[0_10px_25px_rgba(43,63,224,0.35)] items-center justify-center p-2 select-none"
              aria-label="Design Develop Deliver stamp"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-[spin_16s_linear_infinite]"
              >
                <path
                  id="stampCirclePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[9.5px] uppercase font-mono font-bold tracking-[0.19em] fill-white">
                  <textPath href="#stampCirclePath">
                    DESIGN · DEVELOP · DELIVER ·
                  </textPath>
                </text>
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white"
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
