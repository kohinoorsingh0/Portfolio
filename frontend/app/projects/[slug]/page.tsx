import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata, siteUrl } from "@/lib/seo";
import CaseStudy, { CASE_STUDIES, CaseStudyData } from "@/components/projects/CaseStudy";
import { getProjectBySlug } from "@/lib/api";

export async function generateStaticParams() {
  return [{ slug: "fixflow" }, { slug: "kohinoor-tunes" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjectBySlug(slug)) || CASE_STUDIES[slug];

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const desc = "shortDescription" in project ? project.shortDescription : project.desc;
  const image = "imageUrl" in project && project.imageUrl ? project.imageUrl : "/images/og-image.png";

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
  const fallback = CASE_STUDIES[slug];

  if (!dbProject && !fallback) {
    notFound();
  }

  const dbStack = Array.isArray(dbProject?.stack) ? dbProject.stack : [];
  const project: CaseStudyData = dbProject
    ? {
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
        palette: fallback?.palette || "violet",
        year: fallback?.year || "2026",
        discipline: fallback?.discipline || "FULL-STACK DEVELOPMENT",
        desc: dbProject.shortDescription || dbProject.longDescription,
        role: fallback?.role || "Full-stack developer",
        stackText: dbStack.join(", "),
        metric: dbProject.resultText || fallback?.metric || "Verified Project",
        browserUrl: dbProject.githubUrl
          ? dbProject.githubUrl.replace(/^https?:\/\//, "")
          : fallback?.browserUrl || `${dbProject.slug}.app`,
        challenge: dbProject.caseStudy?.challenge || fallback?.challenge || "",
        solution: dbProject.caseStudy?.solution || fallback?.solution || "",
        outcome: dbProject.caseStudy?.outcome || fallback?.outcome || "",
        nextSlug: fallback?.nextSlug || "fixflow",
        nextTitle: fallback?.nextTitle || "FixFlow",
      }
    : fallback!;

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
