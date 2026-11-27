import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata, siteUrl } from "@/lib/seo";
import CaseStudy, { CASE_STUDIES, CaseStudyData } from "@/components/projects/CaseStudy";
import { getProjectBySlug, getProjects } from "@/lib/api";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const desc = project.shortDescription || project.longDescription || "";
  const image = project.imageUrl || "/images/og-image.png";

  return constructMetadata({
    title: `${project.title} — Case Study`,
    description: desc,
    canonicalUrl: `${siteUrl}/projects/${slug}`,
    image,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbProject = await getProjectBySlug(slug);

  if (!dbProject) {
    notFound();
  }

  const dbStack = Array.isArray(dbProject.stack) ? dbProject.stack : [];
  const allProjects = await getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    allProjects.length > 1 && currentIndex !== -1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null;

  const project: CaseStudyData = {
    slug: dbProject.slug,
    title: dbProject.title,
    type: dbStack.some(
      (s) =>
        typeof s === "string" &&
        (s.toLowerCase().includes("express") ||
          s.toLowerCase().includes("node") ||
          s.toLowerCase().includes("mongo"))
    )
      ? "Full-Stack"
      : "Frontend",
    palette: CASE_STUDIES[slug]?.palette || (dbProject.featured ? "violet" : "orange"),
    year: CASE_STUDIES[slug]?.year || "2026",
    discipline:
      CASE_STUDIES[slug]?.discipline ||
      (dbProject.featured ? "FULL-STACK DEVELOPMENT" : "FRONTEND / OPEN-SOURCE"),
    desc: dbProject.shortDescription || dbProject.longDescription || "",
    role: CASE_STUDIES[slug]?.role || "Full-stack developer",
    stackText: dbStack.join(", "),
    metric: dbProject.resultText || CASE_STUDIES[slug]?.metric || "Verified Project",
    browserUrl: dbProject.githubUrl
      ? dbProject.githubUrl.replace(/^https?:\/\//, "")
      : dbProject.liveUrl
      ? dbProject.liveUrl.replace(/^https?:\/\//, "")
      : `${dbProject.slug}.app`,
    challenge: dbProject.caseStudy?.challenge || CASE_STUDIES[slug]?.challenge || "",
    solution: dbProject.caseStudy?.solution || CASE_STUDIES[slug]?.solution || "",
    outcome: dbProject.caseStudy?.outcome || CASE_STUDIES[slug]?.outcome || "",
    nextSlug: nextProject ? nextProject.slug : "projects",
    nextTitle: nextProject ? nextProject.title : "All Projects",
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    applicationCategory: "WebApplication",
    operatingSystem: "Web browser",
    description: project.desc,
    url: `${siteUrl}/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: "Kohinoor Singh",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareJsonLd),
        }}
      />
      <CaseStudy project={project} />
    </>
  );
}
