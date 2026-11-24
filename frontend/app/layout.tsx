import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { constructMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import CtaBanner from "@/components/layout/CtaBanner";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...constructMetadata(),
  verification: {
    google: "lszdmCYvDGLN20lsi6f11pqN0Dfm0rkOOgoNDbMAtcI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Anti-FOUC Theme Script: Auto Day/Night with local time + manual override */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('theme');var isDark=false;if(stored==='dark'){isDark=true;}else if(stored==='light'){isDark=false;}else{var h=new Date().getHours();if(!isNaN(h)){isDark=(h<6||h>=18);}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){isDark=true;}}if(isDark){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        {/* JSON-LD Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
        {/* JSON-LD WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {/* Skip to Content link for accessibility & keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-royal focus:text-white focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white font-mono text-xs font-bold"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 pt-24 sm:pt-28">{children}</main>
        <CtaBanner />
        <Footer />
      </body>
    </html>
  );
}
