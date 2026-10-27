import { Archivo, Source_Serif_4 } from "next/font/google";

/* The world's faces. world.css reads these two variables; swapping the
   visual world means swapping this file and world.css together.

   Base: Archivo (its width axis gives a condensed display voice and
   stays plain for UI) and Source Serif 4 for long reading, with optical
   sizes so 20px body and 14px captions both read. */
export const displayFont = Archivo({
  variable: "--font-world-display",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["wdth"],
  display: "swap",
});

export const textFont = Source_Serif_4({
  variable: "--font-world-text",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${textFont.variable}`;

/* Browser chrome colour per theme (address bar on phones). */
export const themeColor = { light: "#f3f4f0", dark: "#110d0c" };
