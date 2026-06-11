"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SlideTabs } from "@mtosity/design-system";

type Phase = "loading" | "ready" | "recording" | "transcribing" | "error";

export default function SpeechToTextPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [statusMsg, setStatusMsg] = useState("Loading model — first run pulls ~150MB.");
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(28).fill(0.05));
  const [elapsed, setElapsed] = useState(0);

  const workerRef = useRef<Worker | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  const transcribeResolveRef = useRef<
    ((text: string) => void) | null
  >(null);
  const transcribeRejectRef = useRef<((err: Error) => void) | null>(null);

  // Spin up the worker and load the model once.
  useEffect(() => {
    const worker = new Worker(
      new URL("../../../workers/whisper-worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    worker.addEventListener(
      "message",
      (e: MessageEvent<
        | { type: "progress"; payload: { status: string; loaded?: number; total?: number; progress?: number } }
        | { type: "ready" }
        | { type: "result"; payload: { text: string } }
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
            if (pct > 0) {
              setProgress(pct);
              setStatusMsg(`Loading model — ${pct}%`);
            }
          }
        } else if (m.type === "ready") {
          setPhase("ready");
          setProgress(100);
          setStatusMsg("Ready. Tap the mic to begin.");
        } else if (m.type === "result") {
          const text = (m.payload.text ?? "").trim();
          transcribeResolveRef.current?.(text);
          transcribeResolveRef.current = null;
          transcribeRejectRef.current = null;
        } else if (m.type === "error") {
          if (transcribeRejectRef.current) {
            transcribeRejectRef.current(new Error(m.message));
            transcribeResolveRef.current = null;
            transcribeRejectRef.current = null;
          } else {
            setErrorMsg(m.message);
            setPhase("error");
            setStatusMsg(`Failed to load model — ${m.message}`);
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

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const transcribeViaWorker = useCallback(
    (audio: Float32Array): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        const worker = workerRef.current;
        if (!worker) {
          reject(new Error("Worker not ready"));
          return;
        }
        transcribeResolveRef.current = resolve;
        transcribeRejectRef.current = reject;
        worker.postMessage({ type: "transcribe", audio }, [audio.buffer]);
      }),
    [],
  );

  // Tick recording timer.
  useEffect(() => {
    if (phase !== "recording") return;
    const id = window.setInterval(() => {
      setElapsed(Math.floor((performance.now() - startedAtRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const sampleLevels = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(buf);
      const bins = 28;
      const step = Math.floor(buf.length / bins);
      const next: number[] = [];
      for (let i = 0; i < bins; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += buf[i * step + j];
        next.push(Math.min(1, sum / step / 200));
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mr = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = mr;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        await ctx.close().catch(() => {});
        analyserRef.current = null;
        audioCtxRef.current = null;
        setLevels(Array(28).fill(0.05));

        setPhase("transcribing");
        setStatusMsg("Transcribing…");

        try {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const arrayBuf = await blob.arrayBuffer();
          const decodeCtx = new AudioContext({ sampleRate: 16000 });
          const decoded = await decodeCtx.decodeAudioData(arrayBuf);
          // Copy the channel data so we own the buffer (we transfer it to the
          // worker, which would detach the AudioBuffer's internal storage).
          const float32 = new Float32Array(decoded.getChannelData(0));
          await decodeCtx.close();

          const text = await transcribeViaWorker(float32);
          setTranscript((prev) => (prev ? prev + "\n" + text : text));
          setPhase("ready");
          setStatusMsg("Done. Tap the mic for another pass.");
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setErrorMsg(msg);
          setStatusMsg(`Transcription error — ${msg}`);
          setPhase("ready");
        }
      };

      mr.start();
      startedAtRef.current = performance.now();
      setElapsed(0);
      setPhase("recording");
      setStatusMsg("Listening…");
      sampleLevels();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setStatusMsg(`Mic permission denied — ${msg}`);
      setPhase("ready");
    }
  }, [sampleLevels, transcribeViaWorker]);

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
  }, []);

  const handleMicClick = () => {
    if (phase === "recording") stopRecording();
    else if (phase === "ready") startRecording();
  };

  const handleCopy = () => {
    if (!transcript.trim()) return;
    navigator.clipboard.writeText(transcript.trim()).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  };

  const handleClear = () => {
    if (phase === "recording") stopRecording();
    setTranscript("");
    setStatusMsg("Ready. Tap the mic to begin.");
  };

  const isBusy = phase === "loading" || phase === "transcribing";
  const isRecording = phase === "recording";

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
        {/* Crumbs + section header */}
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
              07.01 — TOOL
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
              ON-DEVICE · WHISPER-BASE.EN
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
          Speech <span style={{ fontStyle: "italic", color: "var(--muted)" }}>to</span> text.
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
          Records audio in your browser and runs an ONNX build of Whisper
          (whisper-base.en) through WebAssembly via transformers.js. No API
          calls, no uploads. The first visit downloads the model weights
          (~150MB) and caches them locally.
        </motion.p>

        {/* Recorder card */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "3rem",
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            position: "relative",
            boxShadow: "6px 6px 0 var(--border)",
          }}
        >
          {/* Top meta */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "1.75rem",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <StatusDot phase={phase} />
              {phase}
            </span>
            <span>{formatTime(elapsed)}</span>
          </div>

          {/* Mic */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div style={{ position: "relative", width: 150, height: 150 }}>
              {[0, 0.45, 0.9].map((delay) => (
                <motion.span
                  key={delay}
                  initial={false}
                  animate={
                    isRecording
                      ? { opacity: [0.35, 0], scale: [1, 2.3] }
                      : { opacity: 0, scale: 1 }
                  }
                  transition={
                    isRecording
                      ? {
                          duration: 1.6,
                          delay,
                          repeat: Infinity,
                          ease: "easeOut",
                        }
                      : { duration: 0.15 }
                  }
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "1px solid var(--fg)",
                    background: "var(--accent)",
                    pointerEvents: "none",
                  }}
                />
              ))}
              <motion.button
                onClick={handleMicClick}
                disabled={isBusy}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                whileHover={!isBusy ? { scale: 1.04 } : {}}
                whileTap={!isBusy ? { scale: 0.96 } : {}}
                animate={isRecording ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={
                  isRecording
                    ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: isRecording ? "var(--fg)" : "var(--accent)",
                  cursor: isBusy ? "not-allowed" : "pointer",
                  opacity: isBusy ? 0.55 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isRecording
                    ? "0 0 0 4px var(--bg-secondary), 6px 6px 0 var(--border)"
                    : "6px 6px 0 var(--border)",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              >
                {isRecording ? (
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      background: "var(--accent)",
                      borderRadius: 2,
                    }}
                  />
                ) : (
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--fg)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Waveform */}
            <Waveform levels={levels} active={isRecording} />

            {/* Status */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: phase === "error" ? "#a83232" : "var(--muted)",
                textAlign: "center",
                margin: 0,
                minHeight: "1em",
              }}
            >
              {statusMsg}
            </p>

            {/* Loading bar */}
            {phase === "loading" && (
              <div
                style={{
                  width: "min(420px, 90%)",
                  height: 3,
                  background: "var(--border-light)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ height: "100%", background: "var(--fg)" }}
                />
              </div>
            )}
          </div>
        </motion.section>

        {/* Transcript */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "3rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
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
            <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <ActionBtn onClick={handleCopy} disabled={!transcript.trim()}>
                {copied ? "Copied" : "Copy"}
              </ActionBtn>
              <ActionBtn
                onClick={handleClear}
                disabled={!transcript.trim() && phase !== "recording"}
              >
                Clear
              </ActionBtn>
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--border-light)",
              background: "var(--bg)",
              minHeight: "180px",
              padding: "1.5rem 1.75rem",
              fontSize: "1.0625rem",
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "var(--font-crimson-text), Georgia, serif",
            }}
          >
            <AnimatePresence mode="wait">
              {transcript ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {transcript}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: "var(--muted)",
                    fontStyle: "italic",
                    fontFamily: "var(--font-crimson-text), Georgia, serif",
                  }}
                >
                  Your words will land here.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-light)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <Footnote label="MODEL" value="whisper-base.en · q8" />
          <Footnote label="RUNTIME" value="WebAssembly · transformers.js" />
          <Footnote label="PRIVACY" value="No audio leaves your device" />
        </motion.div>
      </main>
    </div>
  );
}

function StatusDot({ phase }: { phase: Phase }) {
  const color =
    phase === "recording"
      ? "#dc2626"
      : phase === "ready"
        ? "var(--fg)"
        : phase === "error"
          ? "#a83232"
          : "var(--muted)";
  return (
    <motion.span
      animate={
        phase === "recording" || phase === "loading" || phase === "transcribing"
          ? { opacity: [1, 0.3, 1] }
          : { opacity: 1 }
      }
      transition={{ duration: 1.2, repeat: Infinity }}
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
      }}
    />
  );
}

function Waveform({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        height: 56,
        width: "min(420px, 90%)",
        justifyContent: "center",
      }}
      aria-hidden
    >
      {levels.map((lvl, i) => {
        const h = active ? Math.max(4, lvl * 56) : 4 + Math.sin(i * 0.6) * 1.5;
        return (
          <motion.span
            key={i}
            animate={{ height: h }}
            transition={{ duration: 0.08, ease: "linear" }}
            style={{
              width: 3,
              borderRadius: 1,
              background: active ? "var(--fg)" : "var(--border-light)",
              display: "block",
            }}
          />
        );
      })}
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--fg)",
        background: "transparent",
        border: "1px solid var(--border-light)",
        padding: "0.4rem 0.85rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
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

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
