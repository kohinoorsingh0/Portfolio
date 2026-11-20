import Link from "next/link";
import Marquee from "./Marquee";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-cream dark:bg-navy border-t border-black/10 dark:border-white/10 transition-colors duration-200">
      {/* Repeating Marquee */}
      <Marquee />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Brand & Philosophy */}
          <div>
            <div className="text-xl font-black tracking-tight text-ink dark:text-cream mb-1">
              KS.
            </div>
            <p className="text-sm text-muted dark:text-cream/70 font-medium">
              Designed with intention. Built with curiosity.
            </p>
          </div>

          {/* Real Social Links */}
          <div className="flex items-center gap-5 text-sm font-semibold text-ink/80 dark:text-cream/80">
            <a
              href="https://github.com/kohinoorsingh0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-royal dark:hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kohinoor-singh-5137b9413/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-royal dark:hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
            >
              LinkedIn
            </a>
            <a
              href="https://wa.me/919350666578"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-royal dark:hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
            >
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="hover:text-royal dark:hover:text-lime transition-colors focus-visible:outline-2 focus-visible:outline-royal rounded-sm"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom Bar: Copyright only — NO admin link, NO builder badge */}
        <div className="mt-10 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted dark:text-cream/60">
          <p>© 2026 Kohinoor Singh. All rights reserved.</p>
          <p className="mono-label tracking-wider text-[11px]">
            Karnal, India
          </p>
        </div>
      </div>
    </footer>
  );
}
