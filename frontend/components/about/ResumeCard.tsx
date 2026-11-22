interface ResumeCardProps {
  resumeUrl?: string;
}

export default function ResumeCard({ resumeUrl = "/resume/kohinoor-singh-resume.pdf" }: ResumeCardProps) {
  const downloadUrl = resumeUrl || "/resume/kohinoor-singh-resume.pdf";
  return (
    <section className="relative overflow-hidden bg-lavender dark:bg-[#181C38] py-16 sm:py-24 lg:py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Left Column: Copy & Download Action */}
          <div className="flex flex-col items-start max-w-xl">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-coral mb-3 block">
              THE ONE-PAGER
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.035em] leading-[1.04] text-ink dark:text-cream mb-5">
              Need the concise version?
            </h2>
            <p className="text-muted dark:text-[#A8A8B8] text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              My experience, education, and toolkit — distilled into a
              recruiter-friendly PDF.
            </p>

            {/* Download Button */}
            <a
              href={downloadUrl}
              download="Kohinoor_Singh_Resume.pdf"
              target={downloadUrl.startsWith("http") ? "_blank" : undefined}
              rel={downloadUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center justify-center min-h-[48px] gap-3 px-7 sm:px-8 py-4 rounded-full bg-ink text-cream hover:shadow-[0_8px_0_#FF5C38] hover:-translate-y-0.5 active:translate-y-0 font-bold text-sm sm:text-base transition-all duration-200 dark:bg-cream dark:text-ink dark:hover:shadow-[0_8px_0_#FF5C38]"
              title="Download résumé PDF"
            >
              <span>Download résumé</span>
              <span className="text-base" aria-hidden="true">
                ↓
              </span>
            </a>

            {/* Resume Meta Info */}
            <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 flex items-center gap-8 text-xs font-mono">
              <div>
                <span className="text-muted dark:text-[#A8A8B8] block text-[10px] uppercase">
                  Format
                </span>
                <strong className="font-bold text-ink dark:text-cream">
                  PDF (A4)
                </strong>
              </div>
              <div>
                <span className="text-muted dark:text-[#A8A8B8] block text-[10px] uppercase">
                  Updated
                </span>
                <strong className="font-bold text-ink dark:text-cream">
                  2026
                </strong>
              </div>
              <div>
                <span className="text-muted dark:text-[#A8A8B8] block text-[10px] uppercase">
                  Status
                </span>
                <strong className="font-bold text-royal dark:text-[#7888FF]">
                  Verified
                </strong>
              </div>
            </div>
          </div>

          {/* Right Column: Tilted Paper Document Preview */}
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] aspect-[1/1.38] bg-white text-[#14121F] rounded-xl p-5 sm:p-9 shadow-[10px_14px_30px_rgba(30,24,60,0.18)] sm:shadow-[20px_25px_50px_rgba(30,24,60,0.18)] rotate-[1.5deg] sm:rotate-[3deg] hover:rotate-0 hover:scale-[1.01] transition-transform duration-500 border border-black/5 select-none flex flex-col justify-between">
              <div>
                {/* Header: Name and Title */}
                <div className="flex items-end justify-between">
                  <strong className="font-black text-2xl sm:text-3xl tracking-tight leading-none text-[#14121F]">
                    KOHINOOR
                    <br />
                    SINGH
                  </strong>
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-royal text-right leading-tight tracking-wider">
                    FULL-STACK
                    <br />
                    DEVELOPER
                  </span>
                </div>

                <hr className="border-0 border-t-2 border-[#14121F] my-4 sm:my-5" />

                {/* Subtitle / Pitch */}
                <p className="text-[11px] sm:text-xs text-[#14121F]/80 leading-relaxed mb-5 max-w-[280px]">
                  Curious developer building expressive, dependable products for
                  the web.
                </p>

                {/* Section: Experience */}
                <div className="mb-4">
                  <h3 className="font-mono text-[10px] font-bold text-coral uppercase tracking-wider mb-1">
                    EXPERIENCE
                  </h3>
                  <p className="font-bold text-xs sm:text-sm text-[#14121F]">
                    Full-Stack Developer, FixFlow
                  </p>
                  <p className="text-[10px] text-[#14121F]/70 mt-0.5">
                    Campus complaint workflow system · React 19, Express 5,
                    MongoDB
                  </p>
                </div>

                {/* Section: Education */}
                <div>
                  <h3 className="font-mono text-[10px] font-bold text-coral uppercase tracking-wider mb-1">
                    EDUCATION
                  </h3>
                  <p className="font-bold text-xs sm:text-sm text-[#14121F]">
                    Bachelor of Computer Applications
                  </p>
                  <p className="text-[10px] text-[#14121F]/70 mt-0.5">
                    Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal
                  </p>
                </div>
              </div>

              {/* Bottom Skills Highlight Pill */}
              <div className="bg-lime text-[#14121F] font-mono text-[9px] sm:text-[10px] font-bold tracking-wider py-2 px-3 rounded text-center">
                REACT · TYPESCRIPT · NODE · MONGODB
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
