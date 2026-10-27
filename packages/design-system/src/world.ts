/* Describes the active visual world for the /design-system page.
   Lives beside world.css; the two are swapped together. */
export const WORLD = {
  name: "Desk Diorama",
  summary:
    "A small clay model of the desk this site is built at: Baymax beside the laptop, a camera, a notebook, a mug, a lamp. Every object on it is a door into the site, and the lamp really does switch the lights off.",
  faces: [
    { role: "Display", token: "--font-display", name: "Bricolage Grotesque, 88% width, 700", sample: "Built at this desk" },
    { role: "Text", token: "--font-text", name: "Literata, optical sizes", sample: "Leave some notes for the world. Long reading is set in a serif at twenty pixels, about sixty-five characters to the line." },
    { role: "Interface", token: "--font-ui", name: "Bricolage Grotesque, normal width", sample: "Labels, buttons, captions and navigation." },
    { role: "Code", token: "--font-code", name: "System monospace", sample: "baymax.scan({ pain: 0 });" },
  ],
  rules: [
    "Clay, not chrome: soft corners, matte surfaces, buttons are pills.",
    "Coral is the notebook cover: the one action. Mint is the model's base: a field, never a highlight.",
    "Every object on the desk goes somewhere real; nothing is set dressing.",
    "Day is window light, night is the lamp. The theme switch is the lamp.",
  ],
} as const;
