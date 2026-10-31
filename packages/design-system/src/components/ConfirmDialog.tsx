"use client";

import { useEffect } from "react";

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
    <div
      className="confirm-backdrop"
      onClick={() => !busy && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            className="confirm-ok"
            onClick={onConfirm}
            disabled={busy}
            autoFocus
          >
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        /* An alert in the HIG sense: centered, on the thick material, a
           short title and message, and full-width buttons separated by
           hairlines — Cancel leading, the action trailing. */
        .confirm-backdrop {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0, 0, 0, 0.35);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: confirm-fade 0.2s var(--ease-out, ease);
        }
        @keyframes confirm-fade { from { opacity: 0; } to { opacity: 1; } }
        .confirm-card {
          width: 100%; max-width: 320px;
          background: var(--material-thick, var(--bg-secondary));
          -webkit-backdrop-filter: var(--material-blur, none);
          backdrop-filter: var(--material-blur, none);
          border-radius: var(--radius-lg, 18px);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          text-align: center;
          animation: confirm-pop 0.32s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes confirm-pop {
          from { opacity: 0; transform: scale(1.08); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .confirm-backdrop, .confirm-card { animation: none; }
        }
        .confirm-title {
          font-family: var(--font-sans);
          font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.01em;
          margin: 1.25rem 1.25rem 0.35rem; color: var(--fg);
        }
        .confirm-message {
          font-family: var(--font-sans); font-size: 0.8125rem; line-height: 1.4;
          color: var(--fg); margin: 0 1.25rem 1.25rem;
        }
        .confirm-actions {
          display: grid; grid-template-columns: 1fr 1fr;
          border-top: 1px solid var(--border);
        }
        .confirm-cancel, .confirm-ok {
          font-family: var(--font-sans); font-size: 1.0625rem;
          min-height: 44px; padding: 0 1rem; cursor: pointer;
          background: transparent; border: none;
        }
        .confirm-cancel:hover, .confirm-ok:hover { background: var(--fill); }
        .confirm-cancel { color: var(--accent-text); border-right: 1px solid var(--border) !important; }
        .confirm-ok { color: var(--danger); font-weight: 600; }
        .confirm-cancel:disabled, .confirm-ok:disabled { opacity: 0.5; cursor: default; }
      `}</style>
    </div>
  );
}
