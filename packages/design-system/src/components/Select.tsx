"use client";
import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/* Brutalist native select — appearance stripped, strong border, hard offset
   shadow on focus, custom chevron. Renders a real <select>, so it stays fully
   keyboard- and screen-reader-accessible. Style via `.ds-select` (system.css). */
export const Select = ({
  value,
  defaultValue,
  onChange,
  options,
  placeholder,
  disabled = false,
  id,
  name,
  className,
  "aria-label": ariaLabel,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
}) => {
  return (
    <div className={["ds-select", className].filter(Boolean).join(" ")}>
      <select
        id={id}
        name={name}
        value={value}
        defaultValue={value === undefined ? (defaultValue ?? "") : undefined}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="ds-select-chevron"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
