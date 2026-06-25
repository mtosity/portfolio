"use client";
import React, { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/* Brutalist select with a fully styled dropdown (the native <select> popup
   can't be themed, so this is a custom listbox). Accessible:
   button[role="combobox"] + ul[role="listbox"], arrow-key navigation,
   Home/End, Enter/Space to choose, Esc to close, click-outside, and a hidden
   input so it still submits in a form. Controlled or uncontrolled. */
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
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value : internal;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();

  const selectedIdx = options.findIndex((o) => o.value === current);
  const selectedLabel = selectedIdx >= 0 ? options[selectedIdx]!.label : null;

  const firstEnabled = () => options.findIndex((o) => !o.disabled);
  const lastEnabled = () => {
    for (let i = options.length - 1; i >= 0; i--) if (!options[i]!.disabled) return i;
    return -1;
  };
  const step = (from: number, dir: 1 | -1) => {
    const n = options.length;
    if (!n) return -1;
    let i = from < 0 ? (dir === 1 ? -1 : 0) : from;
    for (let s = 0; s < n; s++) {
      i = (i + dir + n) % n;
      if (!options[i]!.disabled) return i;
    }
    return from;
  };

  const openMenu = () => {
    if (disabled) return;
    setActive(selectedIdx >= 0 ? selectedIdx : firstEnabled());
    setOpen(true);
  };

  const commit = (idx: number) => {
    const o = options[idx];
    if (!o || o.disabled) return;
    if (!isControlled) setInternal(o.value);
    onChange?.(o.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => step(a, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => step(a, -1));
        break;
      case "Home":
        e.preventDefault();
        setActive(firstEnabled());
        break;
      case "End":
        e.preventDefault();
        setActive(lastEnabled());
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(active);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the active option in view.
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  return (
    <div
      ref={rootRef}
      className={["ds-select", className].filter(Boolean).join(" ")}
    >
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        aria-label={ariaLabel}
        disabled={disabled}
        className="ds-select-trigger"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className={selectedLabel ? undefined : "ds-select-placeholder"}>
          {selectedLabel ?? placeholder ?? "Select…"}
        </span>
        <svg className="ds-select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {name && <input type="hidden" name={name} value={current} />}

      {open && (
        <ul
          ref={listRef}
          id={`${uid}-list`}
          role="listbox"
          tabIndex={-1}
          className="ds-select-menu"
          aria-activedescendant={active >= 0 ? `${uid}-opt-${active}` : undefined}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${uid}-opt-${i}`}
              data-idx={i}
              role="option"
              aria-selected={o.value === current}
              aria-disabled={o.disabled || undefined}
              className={[
                "ds-select-option",
                i === active ? "is-active" : "",
                o.value === current ? "is-selected" : "",
                o.disabled ? "is-disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => !o.disabled && setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(i)}
            >
              <span>{o.label}</span>
              {o.value === current && <span className="ds-select-check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
