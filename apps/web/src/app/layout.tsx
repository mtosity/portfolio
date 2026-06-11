import { SITE_URL } from "@mtosity/lib/constants";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Crimson_Text, Lora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { safeJsonLd } from "@mtosity/lib/jsonld";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    { media: "(prefers-color-scheme: light)", color: "#f2efe8" },
    { media: "(prefers-color-scheme: dark)", color: "#14130f" },
  ],
};

/* Runs before first paint so the saved (or system) theme applies without a
   flash. Server-rendered inline script — not subject to the client-render
   script-tag limitation. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

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
    // suppressHydrationWarning: the theme script sets data-theme before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
        />
      </head>

      <body className={`${inter.variable} ${crimsonText.variable} ${lora.variable} antialiased`} id="root">
        {children}
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
