import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig = {
  name: "Kohinoor Singh",
  title: "Kohinoor Singh — Full-Stack Developer",
  description:
    "Kohinoor Singh is a Full-Stack Developer based in Karnal, India. BCA student available for internships & junior roles, specializing in React, TypeScript, Next.js, Node.js, Express, and MongoDB.",
  url: siteUrl,
  ogImage: `${siteUrl}/images/og-image.png`,
  links: {
    github: "https://github.com/kohinoorsingh0",
    linkedin: "https://www.linkedin.com/in/kohinoor-singh-5137b9413/",
  },
  location: {
    city: "Karnal",
    region: "Haryana",
    country: "India",
    latitude: 29.6857,
    longitude: 76.9905,
  },
};

/**
 * JSON-LD Schema: Person
 * Rich structured snippet for Google, Bing, and AI search engines
 */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kohinoor Singh",
  givenName: "Kohinoor",
  familyName: "Singh",
  jobTitle: "Full-Stack Developer",
  description:
    "Full-Stack Developer based in Karnal, India. BCA student specializing in React, Next.js, TypeScript, Node.js, and MongoDB.",
  url: siteUrl,
  image: `${siteUrl}/images/profile.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karnal",
    addressRegion: "Haryana",
    addressCountry: "India",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 29.6857,
    longitude: 76.9905,
  },
  sameAs: [
    "https://github.com/kohinoorsingh0",
    "https://www.linkedin.com/in/kohinoor-singh-5137b9413/",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal",
    description: "Bachelor of Computer Applications (B.C.A.) Web Development",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Full Stack Development with AI",
      credentialCategory: "Certificate",
      recognizedBy: {
        "@type": "Organization",
        name: "PW Skills",
      },
      dateCreated: "2026-09-27",
    },
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "PostgreSQL",
    "Tailwind CSS",
    "REST APIs",
    "Authentication (JWT/OTP)",
    "Full-Stack Web Development",
  ],
};

/**
 * JSON-LD Schema: WebSite
 */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kohinoor Singh — Full-Stack Developer",
  alternateName: "Kohinoor Singh Portfolio",
  url: siteUrl,
  description:
    "Official portfolio of Kohinoor Singh, Full-Stack Developer based in Karnal, India. Showcasing full-stack web applications, campus workflow systems, and software engineering projects.",
  author: {
    "@type": "Person",
    name: "Kohinoor Singh",
  },
  inLanguage: "en-US",
};

/**
 * JSON-LD Schema: FAQPage for About Page
 * Grounded strictly in Real Content (Hard Rule 2)
 */
export const aboutFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Kohinoor Singh build?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kohinoor Singh builds responsive, performant full-stack web applications with intuitive interfaces and scalable backends. His projects include FixFlow (a campus complaint workflow system with MERN stack, ImageKit, Gmail OAuth2, and Gemini AI triage) and Kohinoor Tunes (an open-source music streaming web app).",
      },
    },
    {
      "@type": "Question",
      name: "Is Kohinoor Singh available for internships or junior roles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Kohinoor is currently pursuing his B.C.A. in Web Development at Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal, and is actively available for software engineering internships and junior full-stack developer roles.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies and stack does Kohinoor use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kohinoor's core frontend stack is React, TypeScript, Next.js, and Tailwind CSS. For backend development, he specializes in Node.js, Express, REST APIs, and MongoDB/Mongoose, along with PostgreSQL, Git, GitHub, Docker, and Vercel.",
      },
    },
    {
      "@type": "Question",
      name: "What formal training or certifications does Kohinoor hold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kohinoor completed the 'Full Stack Development with AI' certification from PW Skills on September 27, 2026, alongside his ongoing B.C.A. coursework.",
      },
    },
  ],
};

/**
 * JSON-LD Schema: FAQPage for Contact Page
 * Grounded strictly in Real Content (Hard Rule 2)
 */
export const contactFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I contact Kohinoor Singh?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can send a message through the contact form on this site, connect via LinkedIn at linkedin.com/in/kohinoor-singh-5137b9413, or reach out on GitHub at github.com/kohinoorsingh0.",
      },
    },
    {
      "@type": "Question",
      name: "What roles and opportunities is Kohinoor open to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kohinoor is open to full-stack, frontend, and backend software engineering internships, junior developer roles, and collaborative web development projects.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Kohinoor Singh located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kohinoor is based in Karnal, Haryana, India, and is open to remote roles as well as on-site positions.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly does Kohinoor respond to messages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Thoughtful messages sent through the contact form or email receive a response within 24 hours.",
      },
    },
  ],
};

/**
 * Helper to construct complete, consistent metadata for each Next.js route
 */
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
    other: {
      "geo.region": "IN-HR",
      "geo.placename": "Karnal",
      "geo.position": "29.6857;76.9905",
      ICBM: "29.6857, 76.9905",
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
          url: image.startsWith("http") ? image : `${siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: `${title} — Kohinoor Singh`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : `${siteUrl}${image}`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
