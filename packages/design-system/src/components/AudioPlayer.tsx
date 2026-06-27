"use client";
import React, { useEffect, useId, useRef, useState } from "react";

function fmtTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* Brutalist MP3 / audio player. A compact horizontal control: lime play/pause,
   optional title, an accent-colored seek bar (keyboard-operable native range),
   and a current/duration time read-out. Wraps a single hidden <audio>.
   Controlled-free: pass `src`; optionally `title`, `autoLoad`, and `onPlay`. */
export const AudioPlayer = ({
  src,
  title,
  preload = "metadata",
  className,
  onPlay,
}: {
  src: string;
  title?: string;
  preload?: "none" | "metadata" | "auto";
  className?: string;
  onPlay?: () => void;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const uid = useId();

  // Keep React state in sync with the media element's own events (covers
  // ended, external pause, seeking, metadata load).
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onPlayEvt = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("play", onPlayEvt);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("play", onPlayEvt);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play();
      onPlay?.();
    } else {
      a.pause();
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    const t = Number(e.target.value);
    a.currentTime = t;
    setCurrent(t);
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={`ds-audio${className ? ` ${className}` : ""}`}>
      <button
        type="button"
        className="ds-audio-btn"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        aria-pressed={playing}
      >
        {playing ? (
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="4" y="3" width="3" height="10" rx="0.5" />
            <rect x="9" y="3" width="3" height="10" rx="0.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 3.5v9a.5.5 0 0 0 .76.43l7.5-4.5a.5.5 0 0 0 0-.86l-7.5-4.5A.5.5 0 0 0 5 3.5Z" />
          </svg>
        )}
      </button>

      <div className="ds-audio-body">
        {title ? <span className="ds-audio-title">{title}</span> : null}
        <input
          id={`${uid}-seek`}
          type="range"
          className="ds-audio-seek"
          min={0}
          max={duration || 0}
          step={0.01}
          value={current}
          onChange={seek}
          aria-label={title ? `Seek ${title}` : "Seek"}
          style={{ "--ds-audio-pct": `${pct}%` } as React.CSSProperties}
        />
      </div>

      <span className="ds-audio-time" aria-hidden="true">
        {fmtTime(current)} / {fmtTime(duration)}
      </span>

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload={preload} />
    </div>
  );
};
