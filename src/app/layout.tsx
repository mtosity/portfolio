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
  title: "MTosity",
  description:
    "Baymax Engineer, I'll do everything that interesting and challenging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title?.toString()}</title>
        <link rel="shortcut icon" href="/favicon.co" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="description" content={metadata.description?.toString()} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={metadata.title?.toString()} />
        <meta name="description" content={metadata.description?.toString()} />

        <meta property="og:title" content={metadata.title?.toString()} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://mtosity.com/" />
        <meta
          property="og:image"
          content="https://mtosity.com/screenshot.png"
        />
        <meta
          property="og:description"
          content={metadata.description?.toString()}
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@mtosity" />
        <meta name="twitter:title" content={metadata.title?.toString()} />
        <meta
          name="twitter:description"
          content={metadata.description?.toString()}
        />
        <meta name="twitter:creator" content="@mtosity" />
        <meta
          name="twitter:image"
          content="https://deverajc.com/screenshot.png"
        />
        <script src="./gatsby.js" async={false}></script>
        <script src="./sw.js" async={false}></script>
      </head>

      {/* <meta itemprop="name" content="John Carlo Devera | Frontend Developer"/>
        <meta itemprop="description" content="Hey! I'm John Carlo Devera, and I'm a Bachelor of Science in Information Technology graduate."/>
        <meta itemprop="image" content="https://deverajc.com/screenshot.png"/> */}

      <body className={`${inter.variable} ${crimsonText.variable} ${lora.variable} antialiased bg-zinc-800`} id="root">
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
