import { Node, mergeAttributes, type Editor } from "@tiptap/react";

/**
 * Tiptap inline nodes for the two blog anchor types.
 *
 * THE SERIALISED SHAPE IS AN INTEGRATION CONTRACT — the public renderer maps
 * these spans onto <InteractiveAnchor /> and <CodeAnchor />:
 *
 *   <span data-anchor="definition" data-anchor-key="thamHutNganSach">thâm hụt ngân sách</span>
 *   <span data-anchor="code" data-anchor-key="useMemoExample">useMemo</span>
 *
 * Nothing else is emitted on the span — no class, no extra attributes — so the
 * stored HTML stays exactly as specified. Editor styling hangs off the
 * [data-anchor] attribute selector instead (see RichTextEditor.tsx).
 */

export type AnchorType = "definition" | "code";

/** data-anchor-key must match this, both here and in the DB. */
export { ANCHOR_KEY_PATTERN } from "./blogTypes";
import { ANCHOR_KEY_PATTERN } from "./blogTypes";

export const DEFINITION_ANCHOR_NAME = "definitionAnchor";
export const CODE_ANCHOR_NAME = "codeAnchor";

export function anchorNodeName(type: AnchorType): string {
  return type === "definition" ? DEFINITION_ANCHOR_NAME : CODE_ANCHOR_NAME;
}

interface AnchorNodeConfig {
  name: string;
  anchorType: AnchorType;
}

function createAnchorNode({ name, anchorType }: AnchorNodeConfig) {
  return Node.create({
    name,
    group: "inline",
    inline: true,
    // The visible label lives in the document as real text, so it stays
    // editable, searchable and serialises as the span's text content.
    content: "text*",
    marks: "",
    selectable: true,
    draggable: false,

    addAttributes() {
      return {
        anchorKey: {
          default: "",
          parseHTML: (element: HTMLElement) =>
            element.getAttribute("data-anchor-key") ?? "",
          renderHTML: (attributes: Record<string, unknown>) => ({
            "data-anchor-key": String(attributes.anchorKey ?? ""),
          }),
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: `span[data-anchor="${anchorType}"]`,
          // Beat the default text handling for spans.
          priority: 60,
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      // Attribute order is deliberate: data-anchor first, then data-anchor-key.
      return [
        "span",
        mergeAttributes({ "data-anchor": anchorType }, HTMLAttributes),
        0,
      ];
    },
  });
}

export const DefinitionAnchorNode = createAnchorNode({
  name: DEFINITION_ANCHOR_NAME,
  anchorType: "definition",
});

export const CodeAnchorNode = createAnchorNode({
  name: CODE_ANCHOR_NAME,
  anchorType: "code",
});

export const anchorExtensions = [DefinitionAnchorNode, CodeAnchorNode];

/* ------------------------------------------------------------------ */
/* Editor helpers (kept as plain functions so no command typing        */
/* augmentation of @tiptap/core is needed)                             */
/* ------------------------------------------------------------------ */

/** The text the anchor picker should pre-fill: the current selection, if any. */
export function selectedText(editor: Editor): string {
  const { from, to, empty } = editor.state.selection;
  if (empty) return "";
  return editor.state.doc.textBetween(from, to, " ").trim();
}

/** The anchor node the caret currently sits in, if any. */
export function activeAnchor(
  editor: Editor
): { type: AnchorType; key: string; text: string; from: number; to: number } | null {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const node = $from.node(depth);
    const type =
      node.type.name === DEFINITION_ANCHOR_NAME
        ? "definition"
        : node.type.name === CODE_ANCHOR_NAME
          ? "code"
          : null;
    if (type) {
      return {
        type,
        key: String(node.attrs.anchorKey ?? ""),
        text: node.textContent,
        from: $from.before(depth),
        to: $from.after(depth),
      };
    }
  }
  return null;
}

/**
 * Wrap the current selection (or replace the active anchor) in an anchor node.
 * `text` wins when given — the picker lets the author edit the label — and
 * otherwise the selected text (or the existing anchor's text) is used.
 * Returns false when there is nothing to label.
 */
export function insertAnchor(
  editor: Editor,
  type: AnchorType,
  anchorKey: string,
  text?: string
): boolean {
  if (!ANCHOR_KEY_PATTERN.test(anchorKey)) return false;

  const existing = activeAnchor(editor);
  const range = existing
    ? { from: existing.from, to: existing.to }
    : { from: editor.state.selection.from, to: editor.state.selection.to };

  const derived = (
    existing
      ? existing.text
      : editor.state.doc.textBetween(range.from, range.to, " ")
  ).trim();
  const label = (text ?? "").trim() || derived;
  if (!label) return false;

  return editor
    .chain()
    .focus()
    .insertContentAt(range, {
      type: anchorNodeName(type),
      attrs: { anchorKey },
      content: [{ type: "text", text: label }],
    })
    .run();
}

/** Unwrap the anchor under the caret, leaving its plain text behind. */
export function removeAnchor(editor: Editor): boolean {
  const existing = activeAnchor(editor);
  if (!existing) return false;
  return editor
    .chain()
    .focus()
    .insertContentAt({ from: existing.from, to: existing.to }, existing.text)
    .run();
}

export interface AnchorIssue {
  type: AnchorType;
  key: string;
  text: string;
  reason: "missing-key" | "invalid-key" | "empty-text";
}

/**
 * Anchors that would serialise to something the renderer can't resolve.
 * Surfaced in the editor before saving.
 */
export function findAnchorIssues(editor: Editor): AnchorIssue[] {
  const issues: AnchorIssue[] = [];
  editor.state.doc.descendants((node) => {
    const type =
      node.type.name === DEFINITION_ANCHOR_NAME
        ? "definition"
        : node.type.name === CODE_ANCHOR_NAME
          ? "code"
          : null;
    if (!type) return;
    const key = String(node.attrs.anchorKey ?? "");
    const text = node.textContent;
    if (!key) issues.push({ type, key, text, reason: "missing-key" });
    else if (!ANCHOR_KEY_PATTERN.test(key))
      issues.push({ type, key, text, reason: "invalid-key" });
    else if (!text.trim()) issues.push({ type, key, text, reason: "empty-text" });
  });
  return issues;
}
