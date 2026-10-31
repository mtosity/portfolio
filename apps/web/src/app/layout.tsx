import { SITE_URL } from "@mtosity/lib/constants";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Inter, Literata } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { safeJsonLd } from "@mtosity/lib/jsonld";
import { MotionProvider } from "@/components/MotionProvider";

/* UI and body text use the system face — SF Pro on Apple devices. Inter
   stands in elsewhere; preload is off so Apple devices never fetch it.
   Bricolage Grotesque (width + optical axes) is the brand face for display
   text; Literata is the italic aside inside a headline. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MTosity | Baymax Engineer",
    template: "%s | MTosity",
  },
  description:
    "Baymax Engineer, I'll do everything that interesting and challenging. Portfolio and personal website of MTosity.",
  openGraph: {
    title: "MTosity | Baymax Engineer",
    description: "Baymax Engineer, I'll do everything that interesting and challenging.",
    url: `${SITE_URL}/`,
    siteName: "MTosity",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "MTosity Portfolio Thumbnail",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MTosity | Baymax Engineer",
    description: "Baymax Engineer, I'll do everything that interesting and challenging.",
    creator: "@mtosity",
    images: ["/thumbnail.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/* Runs before first paint so the theme applies without a flash. Follows
   the OS appearance (and keeps following it live) until someone picks a
   theme with the toggle, which is then remembered.
   Server-rendered inline script — not subject to the client-render
   script-tag limitation. */
const themeInitScript = `(function(){var d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function s(){var t;try{t=localStorage.getItem("theme")}catch(e){}d.dataset.theme=t==="dark"||t==="light"?t:m.matches?"dark":"light"}s();try{m.addEventListener("change",s)}catch(e){}})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Minh Tam Nguyen",
  alternateName: "MTosity",
  url: SITE_URL,
  sameAs: [
    "https://github.com/mtosity",
    "https://linkedin.com/in/mtosity",
    "https://twitter.com/mtosity",
  ],
  jobTitle: "Software Engineer",
  description:
    "Software Engineer building interesting and challenging things. Portfolio and personal website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the theme script sets data-theme before React hydrates.
    // Font variables live on <html> so :root token aliases (--font-heading)
    // can resolve them — var() substitution happens where the alias is declared.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} ${literata.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
        />
      </head>

      <body className="antialiased" id="root">
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
        {/* Legacy Gatsby-era cleanup: unregister old service workers + caches. */}
        <Script src="/sw.js" strategy="afterInteractive" />
        <Script src="/gatsby.js" strategy="afterInteractive" />
        {/* window.confetti — used by the nav logo easter egg in SlideTabs. */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
