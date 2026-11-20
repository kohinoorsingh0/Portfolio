import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import ShortVersion from "@/components/home/ShortVersion";
import FeaturedWork from "@/components/home/FeaturedWork";
import Toolbox from "@/components/home/Toolbox";
import SkillsSection from "@/components/home/SkillsSection";
import PathPreview from "@/components/home/PathPreview";

export const metadata: Metadata = constructMetadata({
  image: "/images/kohinoor-watercolor.jpg",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ShortVersion />
      <FeaturedWork />
      <Toolbox />
      <SkillsSection />
      <PathPreview />
    </>
  );
}
