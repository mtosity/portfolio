import type { Metadata } from "next";
import { Inter, Crimson_Text, Lora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
  metadataBase: new URL("https://mtosity.com"),
  title: {
    default: "MTosity | Baymax Engineer",
    template: "%s | MTosity",
  },
  description:
    "Baymax Engineer, I'll do everything that interesting and challenging. Portfolio and personal website of MTosity.",
  openGraph: {
    title: "MTosity | Baymax Engineer",
    description: "Baymax Engineer, I'll do everything that interesting and challenging.",
    url: "https://mtosity.com/",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="./gatsby.js" async={false}></script>
        <script src="./sw.js" async={false}></script>
      </head>

      <body className={`${inter.variable} ${crimsonText.variable} ${lora.variable} antialiased`} id="root">
        {children}
        <Analytics />
      </body>

      <script
        src="https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js"
        async
      ></script>
    </html>
  );
}
