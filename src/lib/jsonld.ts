// JSON.stringify does not escape "</script>", which would let a string field
// break out of the surrounding <script> tag. Escape "<" so the payload stays
// inside the JSON-LD block no matter what.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
