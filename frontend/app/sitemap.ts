import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getProjects } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes = ["", "/about", "/projects", "/journey", "/contact"];
  const now = new Date();

  // Static core routes
  const staticEntries: MetadataRoute.Sitemap = baseRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic project routes fetched from database
  let dynamicProjectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjects();
    const slugs = new Set<string>();

    if (Array.isArray(projects) && projects.length > 0) {
      projects.forEach((p) => {
        if (p?.slug) slugs.add(p.slug);
      });
    }

    // Ensure verified real projects are always indexed
    slugs.add("fixflow");
    slugs.add("kohinoor-tunes");

    dynamicProjectEntries = Array.from(slugs).map((slug) => ({
      url: `${siteUrl}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Resilient fallback if DB is unreachable during build
    dynamicProjectEntries = ["fixflow", "kohinoor-tunes"].map((slug) => ({
      url: `${siteUrl}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  }

  // Combine and strictly exclude any admin paths (Hard Rule 8)
  return [...staticEntries, ...dynamicProjectEntries].filter(
    (entry) => !entry.url.includes("/admin")
  );
}
