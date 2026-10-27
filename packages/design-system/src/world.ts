/* Describes the active visual world for the /design-system page.
   Lives beside world.css; the two are swapped together. */
export const WORLD = {
  name: "Base",
  summary:
    "The shared foundation every world starts from: a cool off-white ground, near-black ink and a single red accent. Condensed display type, a serif for long reading.",
  faces: [
    { role: "Display", token: "--font-display", name: "Archivo, condensed 72%, 800", sample: "Shoot the adjective" },
    { role: "Text", token: "--font-text", name: "Source Serif 4, optical sizes", sample: "Leave some notes for the world. Long reading is set in a serif at twenty pixels, about sixty-five characters to the line." },
    { role: "Interface", token: "--font-ui", name: "Archivo, normal width", sample: "Labels, buttons, captions and navigation." },
    { role: "Code", token: "--font-code", name: "System monospace", sample: "const post = await getPost(slug);" },
  ],
  rules: [
    "One ground, one ink, one accent; the accent marks the action.",
    "Surfaces step in tone; lines are for tables and reading rules only.",
    "Nothing at rest casts a shadow; only what floats (menus, dialogs, sheets) does.",
    "Every picture is real work or a real photograph.",
  ],
} as const;
