import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/seo";
import CaseStudy, { CASE_STUDIES } from "@/components/projects/CaseStudy";

export async function generateStaticParams() {
  return [{ slug: "fixflow" }, { slug: "kohinoor-tunes" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = CASE_STUDIES[slug];

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return constructMetadata({
    title: `${project.title} — Case Study | Kohinoor Singh`,
    description: project.desc,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = CASE_STUDIES[slug];

  if (!project) {
    notFound();
  }

  return <CaseStudy project={project} />;
}
