/**
 * HTML → React renderer for editor-authored (DB) blog bodies.
 *
 * WHY A PARSER INSTEAD OF dangerouslySetInnerHTML
 * -----------------------------------------------
 * The interactive anchors defined by the integration contract
 *
 *     <span data-anchor="definition" data-anchor-key="K">T</span>
 *     <span data-anchor="code"       data-anchor-key="K">T</span>
 *
 * have to become the REAL <InteractiveAnchor /> / <CodeAnchor /> client
 * components (they talk to BlogContext), so the body cannot be injected as one
 * opaque HTML string. Splitting the string around the anchors is not an option
 * either: an anchor lives inside a <p>, so any split would tear open/close tags
 * apart. So we parse into a small node tree and build React elements from it.
 *
 * A very useful side effect: nothing is ever handed to
 * `dangerouslySetInnerHTML`. Every text node goes through React, which escapes
 * it. Sanitisation here is therefore about *structure* (no <script>, no
 * javascript: URLs, no event handlers) rather than about defeating a raw HTML
 * sink — the sink does not exist. That is strictly stronger than the
 * `cleanNoteHtml()` pattern in app/notes/page.tsx, which it otherwise mirrors
 * (allowlist walk over the parsed document, rewrite/drop, never regex-scrub).
 *
 * IMPORTANT: `data-anchor` / `data-anchor-key` survive sanitisation by
 * construction — `readAnchor()` runs *before* the attribute allowlist, and the
 * <span> is replaced by a component rather than by a sanitised <span>. There is
 * therefore no code path in which the allowlist can strip an anchor: changing
 * GLOBAL_ATTRS / TAG_ATTRS cannot break anchors, only plain markup.
 */

import React from "react";
import NextImage from "next/image";
import CodeAnchor from "./CodeAnchor";
import InteractiveAnchor from "./InteractiveAnchor";

// ─── Node model ────────────────────────────────────────────────────────────

interface TextNode {
  type: "text";
  text: string;
}

interface ElementNode {
  type: "element";
  tag: string;
  attrs: Record<string, string>;
  children: HtmlNode[];
}

type HtmlNode = TextNode | ElementNode;

// ─── Tag policy ────────────────────────────────────────────────────────────

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/** Elements whose *content* is CDATA-ish — skipped wholesale by the tokenizer. */
const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title"]);

/** Dropped along with their subtree: never renderable, always a vector. */
const DROP_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "applet",
  "noscript",
  "template",
  "form",
  "input",
  "button",
  "select",
  "option",
  "textarea",
  "link",
  "meta",
  "base",
  "head",
  "title",
  "svg",
  "math",
  "audio",
  "video",
  "source",
  "track",
  "canvas",
  "portal",
  "slot",
]);

/** Rendered as themselves. Anything else that is not dropped is *unwrapped*
 * (children kept, tag discarded) so unknown markup degrades to its text. */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "hr",
  "div",
  "span",
  "section",
  "article",
  "aside",
  "main",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "del",
  "ins",
  "mark",
  "small",
  "sub",
  "sup",
  "abbr",
  "time",
  "code",
  "pre",
  "kbd",
  "samp",
  "var",
  "blockquote",
  "q",
  "cite",
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "img",
  "figure",
  "figcaption",
  "picture",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "colgroup",
  "col",
]);

/** Legacy tags the editor may still emit, normalised to modern equivalents. */
const TAG_ALIASES: Record<string, string> = { strike: "s" };

/** Opening one of these implicitly closes an open <p>, per HTML5. Tiptap emits
 * well-formed markup, so this only guards against hand-edited HTML. */
const CLOSES_OPEN_P = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "ul",
]);

/** React warns (loudly) about whitespace text nodes in these containers. */
const NO_TEXT_CHILDREN = new Set([
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "colgroup",
]);

// ─── Attribute policy ──────────────────────────────────────────────────────

const GLOBAL_ATTRS = new Set(["id", "title", "lang", "dir", "class", "style"]);

const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel", "name"]),
  img: new Set(["src", "alt", "width", "height", "loading", "decoding"]),
  th: new Set(["colspan", "rowspan", "scope", "headers", "abbr"]),
  td: new Set(["colspan", "rowspan", "headers"]),
  ol: new Set(["start", "reversed", "type"]),
  li: new Set(["value"]),
  col: new Set(["span"]),
  colgroup: new Set(["span"]),
  time: new Set(["datetime"]),
  blockquote: new Set(["cite"]),
  q: new Set(["cite"]),
  del: new Set(["cite", "datetime"]),
  ins: new Set(["cite", "datetime"]),
};

/** HTML attribute name → React prop name (only for the allowlisted set). */
const REACT_PROP_NAMES: Record<string, string> = {
  class: "className",
  colspan: "colSpan",
  rowspan: "rowSpan",
  datetime: "dateTime",
  maxlength: "maxLength",
  tabindex: "tabIndex",
  usemap: "useMap",
  srcset: "srcSet",
};

const NUMERIC_PROPS = new Set(["colSpan", "rowSpan", "start", "value", "span"]);
const BOOLEAN_PROPS = new Set(["reversed"]);

const SAFE_URL_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

/** data: is allowed for <img> only, and only for raster types. SVG is excluded
 * deliberately: it is a scriptable document format. */
const SAFE_IMAGE_DATA_URI =
  /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i;

/** The only style declaration we let through — Tiptap's text alignment. */
const TEXT_ALIGN_STYLE = /^\s*text-align\s*:\s*(left|right|center|justify)\s*;?\s*$/i;

function isSafeUrl(raw: string): boolean {
  // Strip the control characters and whitespace browsers ignore, so that
  // "java\nscript:alert(1)" cannot smuggle a scheme past the check.
  const compact = raw.replace(/[\u0000-\u0020\u00a0]/g, "");
  if (compact === "") return false;
  const scheme = /^([a-zA-Z][a-zA-Z0-9+.\-]*):/.exec(compact);
  // No scheme at all → relative, #hash or //host. All safe.
  if (!scheme) return true;
  return SAFE_URL_SCHEMES.has(scheme[1]!.toLowerCase() + ":");
}

// ─── Entity decoding ───────────────────────────────────────────────────────

/**
 * The HTML named entities for U+00A0-U+00FF, in code-point order. Generated
 * from a list rather than hand-mapped because this block is what makes
 * `caf&eacute;` and the accented-Latin entities a WYSIWYG editor emits render
 * as letters instead of as literal text.
 */
const LATIN1_ENTITY_NAMES =
  ("nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy " +
    "reg macr deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm " +
    "raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml Aring " +
    "AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH " +
    "Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc " +
    "Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig " +
    "ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde " +
    "ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml " +
    "yacute thorn yuml").split(" ");

const NAMED_ENTITIES: Record<string, string> = {
  // U+00A0 onwards, generated. Explicit entries below override where they overlap.
  ...Object.fromEntries(
    LATIN1_ENTITY_NAMES.map((name, i) => [name, String.fromCharCode(0xa0 + i)])
  ),
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  shy: "\u00ad",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  minus: "−",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  laquo: "«",
  raquo: "»",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  deg: "°",
  plusmn: "±",
  times: "×",
  divide: "÷",
  frac12: "½",
  frac14: "¼",
  frac34: "¾",
  sup2: "²",
  sup3: "³",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
  sect: "§",
  para: "¶",
  dagger: "†",
  Dagger: "‡",
  permil: "‰",
  prime: "′",
  Prime: "″",
  larr: "←",
  uarr: "↑",
  rarr: "→",
  darr: "↓",
  harr: "↔",
  hArr: "⇔",
  rArr: "⇒",
  infin: "∞",
  ne: "≠",
  le: "≤",
  ge: "≥",
  asymp: "≈",
  radic: "√",
  sum: "∑",
  prod: "∏",
  int: "∫",
  micro: "µ",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  pi: "π",
  sigma: "σ",
  omega: "ω",
  lambda: "λ",
  mu: "μ",
  check: "✓",
  cross: "✗",
  star: "★",
  hearts: "♥",
};

const ENTITY_RE = /&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]{1,31});/g;

export function decodeEntities(input: string): string {
  if (!input.includes("&")) return input;
  return input.replace(ENTITY_RE, (match, body: string) => {
    if (body.charCodeAt(0) === 35 /* # */) {
      const codePoint =
        body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      if (!Number.isFinite(codePoint) || codePoint <= 0 || codePoint > 0x10ffff) {
        return match;
      }
      // Surrogate halves are not valid standalone scalar values.
      if (codePoint >= 0xd800 && codePoint <= 0xdfff) return match;
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return match;
      }
    }
    const named = NAMED_ENTITIES[body];
    return named === undefined ? match : named;
  });
}

// ─── Tokenizer / tree builder ──────────────────────────────────────────────

const OPEN_TAG_RE =
  /^<([a-zA-Z][a-zA-Z0-9:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/;
const CLOSE_TAG_RE = /^<\/([a-zA-Z][a-zA-Z0-9:-]*)\s*>/;
const ATTR_RE = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!source.trim()) return attrs;
  ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(source)) !== null) {
    const name = m[1]!.toLowerCase();
    const raw = m[2] ?? m[3] ?? m[4] ?? "";
    // First occurrence wins, matching the HTML spec.
    if (!(name in attrs)) attrs[name] = decodeEntities(raw);
  }
  return attrs;
}

/** Parses an HTML fragment into a small element/text tree. Never throws. */
export function parseHtmlFragment(html: string): HtmlNode[] {
  const root: ElementNode = {
    type: "element",
    tag: "#root",
    attrs: {},
    children: [],
  };
  const stack: ElementNode[] = [root];
  const top = () => stack[stack.length - 1]!;

  const pushText = (text: string) => {
    if (text === "") return;
    top().children.push({ type: "text", text: decodeEntities(text) });
  };

  const closeTag = (tag: string) => {
    for (let depth = stack.length - 1; depth >= 1; depth--) {
      if (stack[depth]!.tag === tag) {
        stack.length = depth;
        return;
      }
    }
    // Stray close tag with no matching open — ignore it, like a browser does.
  };

  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      pushText(html.slice(i));
      break;
    }
    if (lt > i) pushText(html.slice(i, lt));

    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    // <!doctype …>, <![CDATA[…]]>, <?xml …?> — all uninteresting here.
    if (html.startsWith("<!", lt) || html.startsWith("<?", lt)) {
      const end = html.indexOf(">", lt);
      i = end === -1 ? html.length : end + 1;
      continue;
    }

    const rest = html.slice(lt);

    const close = CLOSE_TAG_RE.exec(rest);
    if (close) {
      closeTag(close[1]!.toLowerCase());
      i = lt + close[0].length;
      continue;
    }

    const open = OPEN_TAG_RE.exec(rest);
    if (!open) {
      // A bare "<" in prose. Emit it as text and move on.
      pushText("<");
      i = lt + 1;
      continue;
    }

    const rawTag = open[1]!.toLowerCase();
    const tag = TAG_ALIASES[rawTag] ?? rawTag;
    const selfClosed = open[3] === "/";
    i = lt + open[0].length;

    if (RAW_TEXT_TAGS.has(rawTag)) {
      // Skip the entire element, content included. Nothing in there renders.
      if (!selfClosed) {
        const endRe = new RegExp(`</${rawTag}\\s*>`, "i");
        const tail = html.slice(i);
        const end = endRe.exec(tail);
        i = end ? i + end.index + end[0].length : html.length;
      }
      continue;
    }

    if (tag === "li" && top().tag === "li") closeTag("li");
    if (CLOSES_OPEN_P.has(tag) && top().tag === "p") closeTag("p");

    const node: ElementNode = {
      type: "element",
      tag,
      attrs: parseAttrs(open[2] ?? ""),
      children: [],
    };
    top().children.push(node);
    if (!selfClosed && !VOID_TAGS.has(tag)) stack.push(node);
  }

  return root.children;
}

// ─── Anchors (contract §1) ─────────────────────────────────────────────────

const ANCHOR_KEY_RE = /^[a-zA-Z0-9_-]+$/;

function textContentOf(node: HtmlNode): string {
  if (node.type === "text") return node.text;
  return node.children.map(textContentOf).join("");
}

interface AnchorSpec {
  kind: "definition" | "code";
  key: string;
  text: string;
}

/**
 * Reads the contract §1 anchor *before* any attribute filtering happens, which
 * is exactly why `data-anchor` / `data-anchor-key` cannot be stripped by the
 * sanitiser: the sanitiser never sees this element.
 */
function readAnchor(node: ElementNode): AnchorSpec | null {
  if (node.tag !== "span") return null;
  const kind = node.attrs["data-anchor"];
  if (kind !== "definition" && kind !== "code") return null;
  const key = node.attrs["data-anchor-key"];
  if (!key || !ANCHOR_KEY_RE.test(key)) return null;
  const text = textContentOf(node).trim();
  if (text === "") return null;
  return { kind, key, text };
}

// ─── Node → React ──────────────────────────────────────────────────────────

type ReactProps = Record<string, unknown> & { key: string };

function buildProps(node: ElementNode, key: string): ReactProps {
  const props: ReactProps = { key };
  const allowed = TAG_ATTRS[node.tag];

  for (const [name, value] of Object.entries(node.attrs)) {
    // Belt and braces: `on*` handlers are rejected before the allowlist even
    // gets a look-in, so a future allowlist edit cannot let one through.
    if (name.startsWith("on")) continue;
    if (!GLOBAL_ATTRS.has(name) && !allowed?.has(name)) continue;

    if (name === "style") {
      const match = TEXT_ALIGN_STYLE.exec(value);
      if (match) props.style = { textAlign: match[1]!.toLowerCase() };
      continue;
    }
    if (name === "href" || name === "src" || name === "cite") {
      const isImageSrc = node.tag === "img" && name === "src";
      if (isImageSrc && SAFE_IMAGE_DATA_URI.test(value.trim())) {
        props.src = value.trim();
        continue;
      }
      if (!isSafeUrl(value)) continue;
    }

    const prop = REACT_PROP_NAMES[name] ?? name;
    if (BOOLEAN_PROPS.has(prop)) {
      props[prop] = true;
    } else if (NUMERIC_PROPS.has(prop)) {
      const n = parseInt(value, 10);
      if (Number.isFinite(n)) props[prop] = n;
    } else {
      props[prop] = value;
    }
  }

  if (node.tag === "a") {
    // Anything pointing off-site opens in a new tab; force the rel that stops
    // the target page from reaching back through window.opener.
    if (props.target === "_blank") props.rel = "noopener noreferrer";
  }
  if (node.tag === "img" && props.loading === undefined) {
    props.loading = "lazy";
  }

  return props;
}

function renderNodes(nodes: HtmlNode[], parentTag: string, path: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const dropWhitespace = NO_TEXT_CHILDREN.has(parentTag);

  nodes.forEach((node, index) => {
    const key = `${path}.${index}`;

    if (node.type === "text") {
      if (dropWhitespace && node.text.trim() === "") return;
      out.push(node.text);
      return;
    }

    const anchor = readAnchor(node);
    if (anchor) {
      out.push(
        anchor.kind === "definition" ? (
          <InteractiveAnchor key={key} text={anchor.text} definitionKey={anchor.key} />
        ) : (
          <CodeAnchor key={key} text={anchor.text} codeKey={anchor.key} />
        )
      );
      return;
    }

    if (DROP_TAGS.has(node.tag)) return;

    if (!ALLOWED_TAGS.has(node.tag)) {
      // Unknown tag: keep the content, discard the wrapper.
      out.push(...renderNodes(node.children, parentTag, key));
      return;
    }

    const props = buildProps(node, key);
    if (VOID_TAGS.has(node.tag)) {
      // Route local images through next/image so stored posts keep the
      // optimisation the hand-written ones had. The 2026-08-07 migration
      // turned <Image> into plain <img>, which silently dropped the
      // /_next/image pipeline — responsive srcset, AVIF/WebP negotiation and
      // the LCP benefit that comes with them.
      //
      // Only same-origin paths: a remote host would need next.config
      // remotePatterns, and failing that next/image throws at render time, so
      // an author pasting an external URL must degrade to a plain <img>
      // rather than break the whole post. Width and height are required
      // because these are not `fill` images.
      const src = typeof props.src === "string" ? props.src : "";
      const w = Number(props.width);
      const h = Number(props.height);
      if (
        node.tag === "img" &&
        src.startsWith("/") &&
        !src.startsWith("//") &&
        Number.isFinite(w) &&
        Number.isFinite(h) &&
        w > 0 &&
        h > 0
      ) {
        out.push(
          React.createElement(NextImage, {
            ...props,
            key: props.key,
            src,
            width: w,
            height: h,
            alt: typeof props.alt === "string" ? props.alt : "",
          })
        );
        return;
      }
      out.push(React.createElement(node.tag, props));
      return;
    }
    out.push(
      React.createElement(node.tag, props, renderNodes(node.children, node.tag, key))
    );
  });

  return out;
}

/**
 * Sanitises `html` and returns it as a React tree, with contract §1 anchor
 * spans replaced by the live <InteractiveAnchor /> / <CodeAnchor /> components.
 *
 * Safe to call on the server: unlike `cleanNoteHtml()` it does not touch
 * DOMParser, so DB post bodies render during SSR/SSG rather than after hydration.
 */
export function renderBlogHtml(html: string): React.ReactNode {
  if (!html) return null;
  return renderNodes(parseHtmlFragment(html), "#root", "b");
}

export default renderBlogHtml;
