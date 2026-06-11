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

export default function ConfirmDialog({
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
        .confirm-backdrop {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(13,13,13,0.55);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: confirm-fade 0.15s ease;
        }
        @keyframes confirm-fade { from { opacity: 0; } to { opacity: 1; } }
        .confirm-card {
          width: 100%; max-width: 400px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          box-shadow: 8px 12px 40px rgba(0,0,0,0.3);
          padding: 1.5rem 1.5rem 1.25rem;
          animation: confirm-pop 0.18s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }
        @keyframes confirm-pop {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .confirm-title {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 1.3rem; font-weight: 600;
          margin: 0 0 0.5rem; color: var(--fg);
        }
        .confirm-message {
          font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.6;
          color: var(--muted); margin: 0 0 1.4rem;
        }
        .confirm-actions {
          display: flex; justify-content: flex-end; gap: 0.6rem;
        }
        .confirm-cancel, .confirm-ok {
          font-family: var(--font-mono); font-size: 0.74rem;
          border-radius: 2px; padding: 0.5rem 1rem; cursor: pointer;
        }
        .confirm-cancel {
          background: transparent; color: var(--fg);
          border: 1px solid var(--border-light);
        }
        .confirm-ok {
          background: #b00020; color: #fff; border: 1px solid #b00020;
          font-weight: 700;
        }
        .confirm-cancel:disabled, .confirm-ok:disabled { opacity: 0.6; cursor: default; }
      `}</style>
    </div>
  );
}
