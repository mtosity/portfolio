"use client";

/* The inline term a reader taps to open its definition or code example
   in the side rail. The whole word is the target (not a 16px icon); a
   dotted underline says "there's more here", the marker highlight says
   "this is what the rail is showing". */
export default function AnchorTerm({
  kind,
  text,
  active,
  onOpen,
  onClose,
}: {
  kind: "definition" | "code";
  text: string;
  active: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      className={`anchor-term anchor-term-${kind}`}
      data-active={active || undefined}
      aria-expanded={active}
      aria-label={
        active
          ? `Close ${text}`
          : kind === "code"
            ? `Show code example: ${text}`
            : `Define ${text}`
      }
      onClick={active ? onClose : onOpen}
    >
      {text}
      <svg aria-hidden="true" viewBox="0 0 12 12" className="anchor-term-mark">
        {kind === "code" ? (
          <path d="M4.5 3 1.5 6l3 3M7.5 3l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 1.5v9M1.5 6h9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
