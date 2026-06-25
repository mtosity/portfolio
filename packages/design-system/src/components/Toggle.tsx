"use client";
import React, { useState } from "react";

/* Brutalist switch. Controlled (`checked`) or uncontrolled (`defaultChecked`).
   Renders a button[role="switch"] so it's keyboard-operable (Space/Enter) and
   announced correctly. Style via `.ds-toggle` (system.css); the lime "on" state
   is keyed off `aria-checked`. */
export const Toggle = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}) => {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={toggle}
      id={id}
      className={["ds-toggle", className].filter(Boolean).join(" ")}
    >
      <span className="ds-toggle-thumb" />
    </button>
  );
};
