import type { Metadata } from "next";
import { constructMetadata, siteUrl } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import ShortVersion from "@/components/home/ShortVersion";
import FeaturedWork from "@/components/home/FeaturedWork";
import Toolbox from "@/components/home/Toolbox";
import SkillsSection from "@/components/home/SkillsSection";
import PathPreview from "@/components/home/PathPreview";
import { getSiteSettings, getSkills, getProjects } from "@/lib/api";

const ogDescription =
  "Kohinoor Singh is a Full-Stack Developer based in Karnal, India. BCA student available for internships & junior roles, specializing in React, TypeScript, Next.js, Node.js, and MongoDB.";

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Kohinoor Singh — Full-Stack Developer",
    description: ogDescription,
    canonicalUrl: siteUrl,
    image: "/images/og-image.png",
  }),
  description:
    "Kohinoor Singh is a Full-Stack Developer from Karnal, India. BCA student building MERN apps with React, TypeScript, Next.js, Node.js & MongoDB.",
};

export default async function Home() {
  const [site, skills, projects] = await Promise.all([
    getSiteSettings(),
    getSkills(),
    getProjects(),
  ]);

  return (
    <>
      <Hero settings={site} />
      <ShortVersion settings={site} />
      <FeaturedWork projects={projects} />
      <Toolbox skills={skills} />
      <SkillsSection skills={skills} />
      <PathPreview />
    </>
  );
}
