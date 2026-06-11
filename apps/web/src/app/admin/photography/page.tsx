"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface GalleryItem {
  pathname: string;
  url: string;
  size: number;
  uploadedAt: number;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminPhotography() {
  const PAGE = 24;
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<{ name: string; status: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE);
  const [confirmUrl, setConfirmUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.images ?? []);
    } catch {
      setError("Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Infinite scroll: reveal more thumbnails as the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE, items.length));
        }
      },
      { rootMargin: "800px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [items.length]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (list.length === 0) return;
      setError(null);
      setUploads(list.map((f) => ({ name: f.name, status: "uploading…" })));

      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        try {
          await upload(`gallery/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/gallery/upload",
            contentType: file.type,
          });
          setUploads((prev) =>
            prev.map((u, idx) => (idx === i ? { ...u, status: "done" } : u))
          );
        } catch {
          setUploads((prev) =>
            prev.map((u, idx) => (idx === i ? { ...u, status: "failed" } : u))
          );
        }
      }
      await load();
      setTimeout(() => setUploads([]), 2500);
    },
    [load]
  );

  async function confirmDelete() {
    if (!confirmUrl) return;
    const url = confirmUrl;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((it) => it.url !== url));
    } catch {
      setError("Delete failed — refreshing.");
      load();
    } finally {
      setDeleting(false);
      setConfirmUrl(null);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontSize: "2rem",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Photography
        </h1>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
          {items.length} photo{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--fg)" : "var(--border-light)"}`,
          background: dragOver ? "var(--bg-secondary)" : "transparent",
          borderRadius: 4,
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--muted)",
          marginBottom: "1.5rem",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        Drag photos here, or click to choose. (JPG / PNG / WEBP, up to 25 MB each)
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploads.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem" }}>
          {uploads.map((u, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: u.status === "failed" ? "#b00020" : "var(--muted)",
                padding: "0.2rem 0",
              }}
            >
              {u.status === "done" ? "✓" : u.status === "failed" ? "✕" : "…"} {u.name} — {u.status}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#b00020" }}>{error}</p>
      )}

      {loading ? (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>Loading…</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {items.slice(0, visibleCount).map((it) => (
            <div
              key={it.url}
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                border: "1px solid var(--border-light)",
                borderRadius: 3,
                overflow: "hidden",
                background: "var(--bg-secondary)",
              }}
            >
              <Image
                src={it.url}
                alt={it.pathname}
                fill
                sizes="(max-width: 600px) 33vw, 150px"
                quality={50}
                loading="lazy"
                style={{ objectFit: "cover" }}
              />
              <button
                onClick={() => setConfirmUrl(it.url)}
                title="Delete"
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 24,
                  height: 24,
                  borderRadius: 2,
                  border: "none",
                  background: "rgba(13,13,13,0.7)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "2px 6px",
                  background: "rgba(13,13,13,0.6)",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.58rem",
                }}
              >
                {formatSize(it.size)}
              </span>
            </div>
          ))}
        </div>
      )}

      {!loading && visibleCount < items.length && (
        <div
          ref={sentinelRef}
          style={{
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--muted)",
            marginTop: "1rem",
          }}
        >
          Loading more… ({visibleCount}/{items.length})
        </div>
      )}

      <ConfirmDialog
        open={confirmUrl !== null}
        title="Delete photo"
        message="Delete this photo? This cannot be undone."
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmUrl(null)}
      />
    </div>
  );
}
