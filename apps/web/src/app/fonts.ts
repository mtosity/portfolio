import { Bricolage_Grotesque, Literata } from "next/font/google";

/* The world's faces. world.css reads these two variables; swapping the
   visual world means swapping this file and world.css together.

   Desk Diorama: Bricolage Grotesque — a grotesk with soft, inky corners
   and width/optical axes, friendly at display size and plain at UI size —
   and Literata, a book face drawn for screens, for long reading. */
export const displayFont = Bricolage_Grotesque({
  variable: "--font-world-display",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

export const textFont = Literata({
  variable: "--font-world-text",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${textFont.variable}`;

/* Browser chrome colour per theme (address bar on phones). */
export const themeColor = { light: "#f4eee5", dark: "#1c1b22" };
