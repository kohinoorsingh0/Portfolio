import Link from "next/link";
import Marquee from "./Marquee";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-[#14121f] text-[#FAF8F4] overflow-hidden border-0 m-0">
      {/* Repeating Huge Display Marquee */}
      <Marquee />

      {/* Footer Bottom with Figma border: border-top: 1px solid #3a3744 */}
      <div className="border-t border-[#3a3744]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            {/* Brand & Philosophy */}
            <div>
              <div className="text-xl font-black tracking-tight text-[#FAF8F4] mb-1">
                KS.
              </div>
              <p className="text-xs sm:text-[13px] text-[#AAA7B5] font-medium leading-relaxed">
                Designed with intention. Built with curiosity.
              </p>
            </div>

            {/* Real Social Links */}
            <div className="flex items-center gap-6 sm:gap-7 text-xs sm:text-[13px] font-semibold text-[#FAF8F4]">
              <a
                href="https://github.com/kohinoorsingh0"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/kohinoor-singh-5137b9413/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
              >
                LinkedIn
              </a>
              <a
                href="https://wa.me/919350666578"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
              >
                WhatsApp
              </a>
              <Link
                href="/contact"
                className="hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Bottom Bar: Copyright only — NO admin link, NO builder badge */}
          <div className="mt-8 pt-6 border-t border-[#3a3744]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-[#AAA7B5]">
            <p>© 2026 Kohinoor Singh. All rights reserved.</p>
            <p className="font-mono uppercase tracking-wider text-[11px] text-[#AAA7B5]/80">
              Karnal, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
