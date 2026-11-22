import type { Metadata } from "next";
import { constructMetadata, siteUrl, contactFaqJsonLd } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import CopyEmailButton from "@/components/contact/CopyEmailButton";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = constructMetadata({
  title: "Contact",
  description:
    "Have a good idea? I'd love to hear it. Get in touch with Kohinoor Singh for internships, junior roles, or collaborative projects.",
  canonicalUrl: `${siteUrl}/contact`,
  image: "/images/og-image.png",
});

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <section className="relative overflow-hidden bg-[#FF5C38] text-ink min-h-[calc(100vh-6rem)] pt-8 sm:pt-14 pb-20 sm:pb-32 transition-colors duration-300">
      {/* FAQ Schema for Contact Page (Rich Results & AEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactFaqJsonLd),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Top Hero matching Figma */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#FF5C38] font-mono text-xs sm:text-sm font-bold flex items-center justify-center select-none shadow-xs">
              04
            </span>
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#5B1B0D] select-none">
              / LET&apos;S TALK
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] font-black tracking-[-0.05em] leading-[0.94] text-[#111111] mb-6 sm:mb-8">
            Have a good idea?
            <br />
            <span className="text-white relative inline-block">
              I&apos;d love to hear it.
            </span>
          </h1>

          <p className="text-[#14121F]/80 text-base sm:text-xl max-w-2xl leading-relaxed">
            Tell me about the role, the project, or the problem you are trying
            to solve. Thoughtful messages always get a thoughtful reply.
          </p>
        </div>

        {/* Contact Grid: Left details + Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start mt-12 sm:mt-16">
          {/* Left Column: Direct channels & availability */}
          <div className="flex flex-col items-start max-w-lg">
            <h2 className="sr-only">Direct Contact Channels</h2>
            <p className="text-[#14121F]/85 text-base sm:text-lg leading-relaxed">
              Prefer email? Copy the address below, or find me on the platforms
              where developers usually live.
            </p>

            {/* Email Copy Button wired to SiteSettings */}
            <CopyEmailButton email={site.email} />

            {/* Real Social Links */}
            <div className="flex items-center gap-3.5 mb-10">
              {/* GitHub */}
              <a
                href={site.github || "https://github.com/kohinoorsingh0"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="w-11 h-11 rounded-full border border-[#14121F] bg-transparent flex items-center justify-center text-ink hover:bg-lime hover:border-lime hover:text-ink hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={site.linkedin || "https://www.linkedin.com/in/kohinoor-singh-5137b9413/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="w-11 h-11 rounded-full border border-[#14121F] bg-transparent flex items-center justify-center text-ink hover:bg-lime hover:border-lime hover:text-ink hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={site.whatsapp || "https://wa.me/919350666578"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp chat"
                className="w-11 h-11 rounded-full border border-[#14121F] bg-transparent flex items-center justify-center text-ink hover:bg-lime hover:border-lime hover:text-ink hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>

            {/* Availability Indicator */}
            <div className="flex items-center gap-3.5 pt-2">
              <i
                className="w-2.5 h-2.5 rounded-full bg-[#278D4F] ring-4 ring-[#278D4F]/30 shrink-0 not-italic"
                aria-hidden="true"
              />
              <span className="flex flex-col">
                <b className="font-bold text-xs sm:text-sm text-ink">
                  Currently available
                </b>
                <small className="text-[11px] sm:text-xs text-[#5B1B0D] font-mono mt-0.5">
                  {site.availability || "Internships · Junior roles · Select freelance"}
                </small>
              </span>
            </div>
          </div>

          {/* Right Column: Cream Form */}
          <div className="w-full">
            <h2 className="sr-only">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
