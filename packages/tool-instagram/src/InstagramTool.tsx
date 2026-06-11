"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SlideTabs } from "@mtosity/design-system";

type Info = {
  title: string;
  thumbnail: string | null;
  duration: number | null;
  uploader: string | null;
  width: number | null;
  height: number | null;
};

type Chunk = { text: string; timestamp: [number, number | null] };
type TranscribeResult = { text: string; chunks?: Chunk[] };

const STAGES = [
  "Downloading audio",
  "Decoding audio",
  "Loading Whisper model",
  "Transcribing",
] as const;
type Stage = "" | (typeof STAGES)[number];

export default function InstagramToolPage() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<Info | null>(null);
  const [fetching, setFetching] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [stage, setStage] = useState<Stage>("");
  const [modelProgress, setModelProgress] = useState(0);
  const [transcript, setTranscript] = useState<TranscribeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const workerReadyRef = useRef<Promise<void> | null>(null);
  const workerReadyResolveRef = useRef<(() => void) | null>(null);
  const workerReadyRejectRef = useRef<((err: Error) => void) | null>(null);
  const transcribeResolveRef = useRef<
    ((r: TranscribeResult) => void) | null
  >(null);
  const transcribeRejectRef = useRef<((err: Error) => void) | null>(null);

  // Lazily spin up the worker on first transcribe.
  function ensureWorker() {
    if (workerRef.current) return workerReadyRef.current!;

    const worker = new Worker(
      new URL("./whisper-worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    workerReadyRef.current = new Promise<void>((resolve, reject) => {
      workerReadyResolveRef.current = resolve;
      workerReadyRejectRef.current = reject;
    });

    worker.addEventListener(
      "message",
      (e: MessageEvent<
        | { type: "progress"; payload: { status: string; loaded?: number; total?: number; progress?: number } }
        | { type: "ready" }
        | { type: "result"; payload: TranscribeResult }
        | { type: "error"; message: string }
      >) => {
        const m = e.data;
        if (m.type === "progress") {
          const p = m.payload;
          if (p.status === "progress") {
            const pct =
              typeof p.progress === "number"
                ? Math.round(p.progress)
                : p.total
                  ? Math.round(((p.loaded ?? 0) / p.total) * 100)
                  : 0;
            if (pct > 0) setModelProgress(pct);
          }
        } else if (m.type === "ready") {
          workerReadyResolveRef.current?.();
          workerReadyResolveRef.current = null;
          workerReadyRejectRef.current = null;
        } else if (m.type === "result") {
          transcribeResolveRef.current?.(m.payload);
          transcribeResolveRef.current = null;
          transcribeRejectRef.current = null;
        } else if (m.type === "error") {
          const err = new Error(m.message);
          if (transcribeRejectRef.current) {
            transcribeRejectRef.current(err);
            transcribeResolveRef.current = null;
            transcribeRejectRef.current = null;
          } else if (workerReadyRejectRef.current) {
            workerReadyRejectRef.current(err);
            workerReadyResolveRef.current = null;
            workerReadyRejectRef.current = null;
          }
        }
      },
    );

    worker.postMessage({
      type: "init",
      model: "onnx-community/whisper-base.en",
      dtype: { encoder_model: "fp32", decoder_model_merged: "q4" },
      device: "wasm",
    });

    return workerReadyRef.current;
  }

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  async function handleFetch(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setInfo(null);
    setTranscript(null);
    setFetching(true);
    try {
      const res = await fetch("/api/instagram/info", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load reel");
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setFetching(false);
    }
  }

  function handleDownload() {
    window.location.href = `/api/instagram/download?url=${encodeURIComponent(url)}`;
  }

  async function handleTranscribe() {
    setTranscribing(true);
    setError("");
    setTranscript(null);
    setModelProgress(0);
    abortRef.current = new AbortController();
    try {
      setStage("Downloading audio");
      const audioRes = await fetch(
        `/api/instagram/audio?url=${encodeURIComponent(url)}`,
        { signal: abortRef.current.signal },
      );
      if (!audioRes.ok) {
        const body = await audioRes.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to fetch audio");
      }
      const audioBuf = await audioRes.arrayBuffer();

      setStage("Decoding audio");
      const audio = await decodeTo16kMono(audioBuf);

      setStage("Loading Whisper model");
      await ensureWorker();

      setStage("Transcribing");
      const output = await new Promise<TranscribeResult>((resolve, reject) => {
        transcribeResolveRef.current = resolve;
        transcribeRejectRef.current = reject;
        workerRef.current!.postMessage(
          {
            type: "transcribe",
            audio,
            options: {
              chunk_length_s: 30,
              stride_length_s: 5,
              return_timestamps: true,
            },
          },
          [audio.buffer],
        );
      });

      setTranscript(output);
      setStage("");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setTranscribing(false);
    }
  }

  async function handleCopy() {
    if (!transcript) return;
    await navigator.clipboard.writeText(transcript.text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function downloadBlob(filename: string, contents: string, mime: string) {
    const blob = new Blob([contents], { type: mime });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(href);
  }

  const stageIdx = STAGES.indexOf(stage as (typeof STAGES)[number]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <SlideTabs />

      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "calc(56px + 3rem) clamp(1.5rem, 5vw, 4rem) 6rem",
        }}
      >
        {/* Crumbs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/tools"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--muted)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "1px",
            }}
          >
            ← All tools
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              07.02 — TOOL
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              YT-DLP · WHISPER · WASM
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            margin: "2.5rem 0 1rem",
          }}
        >
          Instagram reels,{" "}
          <span style={{ fontStyle: "italic", color: "var(--muted)" }}>
            extracted.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.7,
            color: "var(--muted)",
            maxWidth: "58ch",
            margin: 0,
          }}
        >
          Paste a public reel URL to grab the MP4 or run a full transcript.
          Audio is fetched server-side via yt-dlp; the transcription itself runs
          locally in your browser via WebAssembly Whisper. No accounts, no
          storage.
        </motion.p>

        {/* URL form */}
        <motion.form
          onSubmit={handleFetch}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "3rem" }}
        >
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              display: "block",
              marginBottom: "0.6rem",
            }}
          >
            Reel URL
          </label>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              padding: "0.5rem",
              boxShadow: "4px 4px 0 var(--border)",
            }}
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              required
              style={{
                flex: 1,
                minWidth: "260px",
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "0.85rem 1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.9rem",
                color: "var(--fg)",
              }}
            />
            <motion.button
              type="submit"
              disabled={fetching || !url}
              whileHover={!fetching && url ? { scale: 1.02 } : {}}
              whileTap={!fetching && url ? { scale: 0.98 } : {}}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: fetching || !url ? "var(--fg)" : "var(--accent-fg)",
                background: fetching || !url ? "var(--border-light)" : "var(--accent)",
                border: "1px solid var(--border)",
                padding: "0.85rem 1.5rem",
                cursor: fetching || !url ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {fetching ? <Spinner /> : <span>→</span>}
              Fetch
            </motion.button>
          </div>
          <p
            style={{
              marginTop: "0.65rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Supports /reel/, /reels/, /p/ and /tv/ links · public posts only
          </p>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{
                marginTop: "1.25rem",
                border: "1px solid #a83232",
                borderLeft: "3px solid #a83232",
                background: "var(--bg-secondary)",
                color: "#a83232",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                lineHeight: 1.6,
                padding: "0.85rem 1rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info card */}
        <AnimatePresence>
          {info && (
            <motion.section
              key="info"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: "2rem",
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                padding: "clamp(1.25rem, 3vw, 1.75rem)",
                boxShadow: "6px 6px 0 var(--border)",
                display: "grid",
                gridTemplateColumns: "minmax(0, 160px) 1fr",
                gap: "clamp(1rem, 3vw, 1.75rem)",
                alignItems: "start",
              }}
              className="ig-info-card"
            >
              {info.thumbnail ? (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "9/16",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/instagram/thumb?url=${encodeURIComponent(info.thumbnail)}`}
                    alt=""
                    referrerPolicy="no-referrer"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "9/16",
                    border: "1px solid var(--border-light)",
                    background: "var(--bg)",
                  }}
                />
              )}

              <div style={{ minWidth: 0 }}>
                {info.uploader && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    @{info.uploader}
                  </div>
                )}
                <h2
                  style={{
                    fontFamily: "var(--font-crimson-text), Georgia, serif",
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {info.title}
                </h2>
                <div
                  style={{
                    marginTop: "0.55rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  {info.duration != null && (
                    <span
                      style={{
                        border: "1px solid var(--border-light)",
                        padding: "0.18rem 0.55rem",
                      }}
                    >
                      {formatDuration(info.duration)}
                    </span>
                  )}
                  {info.width && info.height && (
                    <span
                      style={{
                        border: "1px solid var(--border-light)",
                        padding: "0.18rem 0.55rem",
                      }}
                    >
                      {info.width}×{info.height}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "1.25rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.6rem",
                  }}
                >
                  <PrimaryAction onClick={handleDownload}>
                    <ArrowDownIcon />
                    Download MP4
                  </PrimaryAction>
                  <AccentAction
                    onClick={handleTranscribe}
                    disabled={transcribing}
                    busy={transcribing}
                  >
                    {transcribing ? <Spinner /> : <FileIcon />}
                    Get transcript
                  </AccentAction>
                </div>

                {transcribing && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: "1.1rem" }}
                  >
                    <ol
                      style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      {STAGES.map((s, i) => {
                        const state =
                          i < stageIdx
                            ? "done"
                            : i === stageIdx
                              ? "active"
                              : "pending";
                        return (
                          <li
                            key={s}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.7rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color:
                                state === "pending"
                                  ? "var(--border-light)"
                                  : state === "active"
                                    ? "var(--fg)"
                                    : "var(--muted)",
                            }}
                          >
                            <StageDot state={state} />
                            <span>
                              {s}
                              {s === "Loading Whisper model" &&
                              modelProgress > 0
                                ? ` — ${modelProgress}%`
                                : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </motion.div>
                )}
              </div>

              <style jsx>{`
                @media (max-width: 600px) {
                  :global(.ig-info-card) {
                    grid-template-columns: 1fr !important;
                  }
                  :global(.ig-info-card) > div:first-child {
                    max-width: 220px;
                    margin: 0 auto;
                  }
                }
              `}</style>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.section
              key="transcript"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginTop: "2.25rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  TRANSCRIPT
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--border-light)",
                    minWidth: "40px",
                  }}
                />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <SmallBtn onClick={handleCopy}>
                    {copied ? "Copied" : "Copy"}
                  </SmallBtn>
                  <SmallBtn
                    onClick={() =>
                      downloadBlob(
                        "transcript.txt",
                        transcript.text.trim(),
                        "text/plain",
                      )
                    }
                  >
                    .txt
                  </SmallBtn>
                  {transcript.chunks && (
                    <SmallBtn
                      onClick={() =>
                        downloadBlob(
                          "transcript.srt",
                          toSrt(transcript.chunks!),
                          "application/x-subrip",
                        )
                      }
                    >
                      .srt
                    </SmallBtn>
                  )}
                </div>
              </div>

              <div
                style={{
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-secondary)",
                  padding: "1.5rem 1.75rem",
                  fontSize: "1.0625rem",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "var(--font-crimson-text), Georgia, serif",
                  color: "var(--fg)",
                }}
              >
                {transcript.text.trim()}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footnote row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-light)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <Footnote label="DOWNLOADER" value="yt-dlp · server-side" />
          <Footnote label="TRANSCRIPTION" value="whisper-base.en · WASM" />
          <Footnote label="STORAGE" value="None — nothing persisted" />
        </motion.div>
      </main>
    </div>
  );
}

/* ── UI primitives ─────────────────────────────────────────────────── */

function PrimaryAction({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 700,
        color: "var(--fg)",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        padding: "0.7rem 1rem",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {children}
    </motion.button>
  );
}

function AccentAction({
  children,
  onClick,
  disabled,
  busy,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 700,
        color: busy ? "var(--fg)" : "var(--accent-fg)",
        background: busy ? "var(--border-light)" : "var(--accent)",
        border: "1px solid var(--border)",
        padding: "0.7rem 1rem",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        opacity: disabled && !busy ? 0.55 : 1,
      }}
    >
      {children}
    </motion.button>
  );
}

function SmallBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--fg)",
        background: "transparent",
        border: "1px solid var(--border-light)",
        padding: "0.35rem 0.7rem",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--fg)";
        (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function Footnote({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--fg)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StageDot({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") {
    return (
      <span
        style={{
          width: 12,
          height: 12,
          border: "1px solid var(--muted)",
          background: "var(--muted)",
          display: "inline-block",
        }}
      />
    );
  }
  if (state === "active") {
    return (
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{
          width: 12,
          height: 12,
          border: "1px solid var(--fg)",
          background: "var(--accent)",
          display: "inline-block",
        }}
      />
    );
  }
  return (
    <span
      style={{
        width: 12,
        height: 12,
        border: "1px solid var(--border-light)",
        background: "transparent",
        display: "inline-block",
      }}
    />
  );
}

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        width: 12,
        height: 12,
        border: "2px solid var(--fg)",
        borderTopColor: "transparent",
        borderRadius: "50%",
        display: "inline-block",
      }}
      aria-hidden
    />
  );
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2v10m0 0l-4-4m4 4l4-4M2 14h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 2h7l3 3v9H3V2z M10 2v3h3 M5 8h6 M5 11h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

async function decodeTo16kMono(buffer: ArrayBuffer): Promise<Float32Array> {
  const Ctx =
    (window.AudioContext as typeof AudioContext | undefined) ??
    ((window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext as typeof AudioContext);
  const ctx = new Ctx({ sampleRate: 16000 });
  try {
    const decoded = await ctx.decodeAudioData(buffer.slice(0));
    // Always return a freshly-allocated Float32Array — its buffer is transferable
    // to the worker, where AudioBuffer-internal channel views are not.
    if (decoded.numberOfChannels === 1) {
      return new Float32Array(decoded.getChannelData(0));
    }
    const left = decoded.getChannelData(0);
    const right = decoded.getChannelData(1);
    const merged = new Float32Array(left.length);
    for (let i = 0; i < left.length; i++) merged[i] = (left[i] + right[i]) / 2;
    return merged;
  } finally {
    ctx.close();
  }
}

function formatDuration(seconds: number) {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${String(rest).padStart(2, "0")}`;
}

function toSrt(chunks: Chunk[]) {
  return chunks
    .map((c, i) => {
      const [start, endRaw] = c.timestamp;
      const end = endRaw ?? start + 2;
      return `${i + 1}\n${srtTime(start)} --> ${srtTime(end)}\n${c.text.trim()}\n`;
    })
    .join("\n");
}

function srtTime(t: number) {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const ms = Math.floor((t - Math.floor(t)) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}
