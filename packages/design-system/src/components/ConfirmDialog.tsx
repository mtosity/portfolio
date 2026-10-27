"use client";

import { useEffect, useId } from "react";

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/* Confirmation for a destructive action: Esc cancels, Enter confirms,
   the backdrop cancels unless the action is in flight. */
export function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const uid = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
      if (e.key === "Enter" && !busy) onConfirm();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, busy, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div className="ds-dialog-backdrop" onClick={() => !busy && onCancel()}>
      <div
        className="ds-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${uid}-t`}
        aria-describedby={`${uid}-m`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id={`${uid}-t`} className="ds-dialog-title">
          {title}
        </h3>
        <p id={`${uid}-m`} className="ds-dialog-message">
          {message}
        </p>
        <div className="ds-dialog-actions">
          <button className="ds-button ds-button-quiet" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button className="ds-button ds-button-danger" onClick={onConfirm} disabled={busy} autoFocus>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
