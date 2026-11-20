import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig = {
  name: "Kohinoor Singh",
  title: "Kohinoor Singh — Full-Stack Developer",
  description:
    "Kohinoor Singh is a Full-Stack Developer based in Karnal, India. BCA student available for internships & junior roles, specializing in React, TypeScript, Next.js, Node.js, and MongoDB.",
  url: siteUrl,
  ogImage: `${siteUrl}/images/og-image.png`,
  links: {
    github: "https://github.com/kohinoorsingh0",
    linkedin: "https://www.linkedin.com/in/kohinoor-singh-5137b9413/",
  },
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kohinoor Singh",
  jobTitle: "Full-Stack Developer",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karnal",
    addressCountry: "India",
  },
  sameAs: [
    "https://github.com/kohinoorsingh0",
    "https://www.linkedin.com/in/kohinoor-singh-5137b9413/",
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "Tailwind CSS",
    "Full-Stack Web Development",
  ],
};

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonicalUrl = siteUrl,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | Kohinoor Singh",
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Kohinoor Singh Portfolio",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Kohinoor Singh — Full-Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}
