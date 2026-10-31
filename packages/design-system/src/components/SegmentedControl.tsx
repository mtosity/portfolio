"use client";
import React, { useId } from "react";
import { motion } from "framer-motion";

/* A segmented control in the HIG sense: a capsule track of mutually
   exclusive choices, with a raised thumb that slides to the selection.
   Renders a radiogroup, so arrow keys move between segments. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: {
  options: readonly T[] | { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
}) {
  const id = useId();
  const items = (options as readonly (T | { value: T; label: React.ReactNode })[]).map((o) =>
    typeof o === "string" ? { value: o as T, label: o as React.ReactNode } : o,
  );
  const idx = items.findIndex((o) => o.value === value);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = items[(idx + dir + items.length) % items.length];
    if (next) onChange(next.value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={["ds-segmented", className].filter(Boolean).join(" ")}
      onKeyDown={onKeyDown}
    >
      {items.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className="ds-segmented-item"
            onClick={() => onChange(o.value)}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-thumb`}
                className="ds-segmented-thumb"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                aria-hidden
              />
            )}
            <span style={{ position: "relative" }}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
