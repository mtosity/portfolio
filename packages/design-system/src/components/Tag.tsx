import React from "react";

export type TagTone =
  | "positive"
  | "negative"
  | "warning"
  | "info"
  | "neutral";

/* Status pill built on the design-system `.tag` utilities (see system.css).
   <Tag tone="positive">Buy</Tag> · <Tag tone="negative" strong>Strong Sell</Tag>
   `strong` applies the denser surface (positive/negative only). */
export const Tag = ({
  tone = "neutral",
  strong = false,
  className,
  children,
  ...props
}: {
  tone?: TagTone;
  strong?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const toneClass =
    strong && (tone === "positive" || tone === "negative")
      ? `tag-strong-${tone}`
      : `tag-${tone}`;

  return (
    <span
      className={["tag", toneClass, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </span>
  );
};
