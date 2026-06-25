"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SlideTabs,
  Tag,
  AccentButton,
  StandardButton,
  OutlineButton,
  SectionHeader,
  ConfirmDialog,
  ThemeToggle,
  Reveal,
  Select,
  Toggle,
} from "@mtosity/design-system";

const mono = "var(--font-mono)";
const heading = "var(--font-heading)";

/* ── Token catalogues ── */
const CORE: { v: string; label: string }[] = [
  { v: "--bg", label: "Background" },
  { v: "--bg-secondary", label: "Surface" },
  { v: "--fg", label: "Foreground" },
  { v: "--accent", label: "Accent / lime" },
  { v: "--accent-fg", label: "Ink on accent" },
  { v: "--border", label: "Border" },
  { v: "--border-light", label: "Border · light" },
  { v: "--muted", label: "Muted" },
  { v: "--danger", label: "Danger" },
];

const STATUS: { v: string; label: string }[] = [
  { v: "--positive", label: "Positive" },
  { v: "--negative", label: "Negative" },
  { v: "--warning", label: "Warning" },
  { v: "--info", label: "Info" },
];

const SURFACES: { v: string; label: string }[] = [
  { v: "--positive-surface", label: "Positive · surface" },
  { v: "--negative-surface", label: "Negative · surface" },
  { v: "--warning-surface", label: "Warning · surface" },
  { v: "--info-surface", label: "Info · surface" },
];

const CHART = Array.from({ length: 8 }, (_, i) => `--chart-${i + 1}`);

const FONTS: { v: string; label: string; sample: string }[] = [
  { v: "--font-heading", label: "Heading · serif", sample: "Typography is the hero." },
  { v: "--font-serif", label: "Serif · body", sample: "Editorial, readable long-form." },
  { v: "--font-sans", label: "Sans · UI", sample: "Clean interface copy and labels." },
  { v: "--font-mono", label: "Mono · labels", sample: "01 — TOKENS / v0.0.0" },
];

const ALL_VARS = [...CORE, ...STATUS, ...SURFACES].map((t) => t.v).concat(CHART);

export function DesignSystemShowcase({
  version,
  name,
}: {
  version: string;
  name: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resolved, setResolved] = useState<Record<string, string>>({});

  // Resolve every token's computed value, and re-resolve whenever the theme
  // attribute flips so the displayed hexes always match what's on screen.
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const v of ALL_VARS) next[v] = cs.getPropertyValue(v).trim();
      setResolved(next);
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <SlideTabs />

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "calc(56px + 4rem) clamp(1.5rem, 5vw, 4rem) 6rem",
        }}
      >
        {/* ── Hero ── */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="tag tag-positive"
            title="Latest published version"
            style={{ display: "inline-block", marginBottom: "1.5rem" }}
          >
            v{version}
          </span>

          <h1
            style={{
              fontFamily: heading,
              fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              margin: 0,
              maxWidth: "16ch",
            }}
          >
            mtosity&apos;s design system.
          </h1>
          <p style={{ marginTop: "1.5rem", fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "56ch" }}>
            A living reference for{" "}
            <code style={{ fontFamily: mono, fontSize: "0.9em", color: "var(--fg)" }}>{name}</code>{" "}
            — the warm-cream + black + lime, neo-brutalist system shared across
            my projects. Flip the theme (top right) to see every token adapt.
          </p>
        </motion.header>

        {/* ── Installation ── */}
        <Section num="01" title="Installation">
          <div className="ds-card" style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <span className="tag tag-info">Coming soon</span>
            <span style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
              Private package only for now.
            </span>
          </div>
        </Section>

        {/* ── Colors ── */}
        <Section num="02" title="Core palette" subtitle="Swap bg/fg + borders per theme; the lime accent is constant.">
          <Grid min={150}>
            {CORE.map((t) => (
              <Swatch key={t.v} {...t} value={resolved[t.v]} />
            ))}
          </Grid>
        </Section>

        {/* ── Status ── */}
        <Section num="03" title="Status colors" subtitle="Semantic tones for positive / negative / warning / info, plus translucent surfaces.">
          <Grid min={150}>
            {STATUS.map((t) => (
              <Swatch key={t.v} {...t} value={resolved[t.v]} />
            ))}
          </Grid>
          <div style={{ height: "1.5rem" }} />
          <Grid min={150}>
            {SURFACES.map((t) => (
              <Swatch key={t.v} {...t} value={resolved[t.v]} />
            ))}
          </Grid>
        </Section>

        {/* ── Chart palette ── */}
        <Section num="04" title="Chart palette" subtitle="Eight distinct hues, brightened on dark.">
          <Grid min={110}>
            {CHART.map((v, i) => (
              <Swatch key={v} v={v} label={`Chart ${i + 1}`} value={resolved[v]} />
            ))}
          </Grid>
        </Section>

        {/* ── Typography ── */}
        <Section num="05" title="Typography">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {FONTS.map((f) => (
              <div key={f.v} className="ds-card">
                <div style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>
                  {f.label} · {f.v}
                </div>
                <div style={{ fontFamily: `var(${f.v})`, fontSize: "1.6rem", lineHeight: 1.3 }}>
                  {f.sample}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Shadows ── */}
        <Section num="06" title="Shadows" subtitle="Hard offset shadows that follow --border, so they adapt per theme.">
          <Grid min={200}>
            {[
              { v: "--shadow-brutal", label: "Brutal" },
              { v: "--shadow-brutal-lg", label: "Brutal · lg" },
            ].map((s) => (
              <div key={s.v} style={{ padding: "0.5rem 0.5rem 1.5rem" }}>
                <div
                  style={{
                    height: 90,
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    boxShadow: `var(${s.v})`,
                  }}
                />
                <div style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.08em", color: "var(--muted)", marginTop: "1rem" }}>
                  {s.label} · {s.v}
                </div>
              </div>
            ))}
          </Grid>
        </Section>

        {/* ── Tags ── */}
        <Section num="07" title="Tags" subtitle="<Tag tone> pills built on the .tag utilities.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center" }}>
            <Tag tone="positive">Positive</Tag>
            <Tag tone="negative">Negative</Tag>
            <Tag tone="warning">Warning</Tag>
            <Tag tone="info">Info</Tag>
            <Tag tone="neutral">Neutral</Tag>
            <Tag tone="positive" strong>Strong buy</Tag>
            <Tag tone="negative" strong>Strong sell</Tag>
          </div>
        </Section>

        {/* ── Cards ── */}
        <Section num="08" title="Cards" subtitle=".ds-card is brutalist by default (border + offset shadow). Add .ds-card-interactive for a hover lift.">
          <Grid min={240}>
            <div className="ds-card">
              <div style={{ fontFamily: heading, fontSize: "1.25rem", marginBottom: "0.35rem" }}>
                .ds-card
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                Default card — strong border + 4px offset shadow, shown directly.
              </p>
            </div>
            <div className="ds-card ds-card-interactive" style={{ cursor: "pointer" }}>
              <div style={{ fontFamily: heading, fontSize: "1.25rem", marginBottom: "0.35rem" }}>
                .ds-card-interactive
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                Hover me — lifts with a larger offset shadow.
              </p>
            </div>
          </Grid>
        </Section>

        {/* ── Buttons ── */}
        <Section num="09" title="Buttons">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <AccentButton onClick={() => {}}>Accent</AccentButton>
            <AccentButton shadow onClick={() => {}}>Accent · shadow</AccentButton>
            <AccentButton disabled>Disabled</AccentButton>
            <AccentButton href="#top">As link</AccentButton>
            <StandardButton>Standard</StandardButton>
            <OutlineButton>Outline / PDF</OutlineButton>
          </div>
        </Section>

        {/* ── Chips & table ── */}
        <Section num="10" title="Chips & table">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            <span className="chip">.chip</span>
            <span className="chip">Mono label</span>
            <span className="chip">Tag-like</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: mono }}>--accent</td>
                  <td>Primary actions</td>
                  <td><Tag tone="positive">Stable</Tag></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: mono }}>--shadow-brutal</td>
                  <td>Card / button lift</td>
                  <td><Tag tone="info">New</Tag></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: mono }}>--danger</td>
                  <td>Destructive</td>
                  <td><Tag tone="warning">Use sparingly</Tag></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Components ── */}
        <Section num="11" title="Components">
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <ComponentRow label="<Select />" note="Brutalist native select — accessible, custom chevron, offset-shadow focus.">
              <Select
                defaultValue="medium"
                aria-label="Demo select"
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
            </ComponentRow>

            <ComponentRow label="<Toggle />" note="Switch (button[role=switch]) — lime on-state, keyboard-operable.">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Toggle defaultChecked aria-label="Demo toggle on" />
                <Toggle aria-label="Demo toggle off" />
                <Toggle disabled defaultChecked aria-label="Demo toggle disabled" />
              </div>
            </ComponentRow>

            <ComponentRow label="<ThemeToggle />" note="Stateless, hydration-safe theme switch.">
              <ThemeToggle />
            </ComponentRow>

            <ComponentRow label="<SectionHeader />" note="Numbered editorial section title.">
              <div style={{ width: "100%", maxWidth: 420 }}>
                <SectionHeader num="04" title="Example" />
              </div>
            </ComponentRow>

            <ComponentRow label="<ConfirmDialog />" note="Accessible modal — Esc / Enter handled.">
              <AccentButton onClick={() => setConfirmOpen(true)}>Open dialog</AccentButton>
            </ComponentRow>

            <ComponentRow label="<Reveal />" note="Scroll-into-view entrance animation.">
              <Reveal>
                <div className="ds-card" style={{ minWidth: 220 }}>
                  Revealed on scroll ✦
                </div>
              </Reveal>
            </ComponentRow>

            <ComponentRow label="<SlideTabs />" note="The fixed top navigation — shown at the top of this page.">
              <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>↑ in use above</span>
            </ComponentRow>
          </div>
        </Section>
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm action"
        message="This is the shared ConfirmDialog from the design system."
        confirmLabel="Got it"
        cancelLabel="Close"
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

/* ── Local helpers ── */

function Section({
  num,
  title,
  subtitle,
  children,
}: {
  num: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: "4.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: mono, fontSize: "0.72rem", letterSpacing: "0.2em", color: "var(--muted)" }}>
          {num} —
        </span>
        <span style={{ fontFamily: mono, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border-light)" }} />
      </div>
      {subtitle && (
        <p style={{ marginTop: "1rem", color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "64ch" }}>
          {subtitle}
        </p>
      )}
      <div style={{ marginTop: "2rem" }}>{children}</div>
    </section>
  );
}

function Grid({ min, children }: { min: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap: "1rem",
      }}
    >
      {children}
    </div>
  );
}

function Swatch({ v, label, value }: { v: string; label: string; value?: string }) {
  return (
    <div style={{ border: "1px solid var(--border-light)", background: "var(--bg-secondary)" }}>
      <div style={{ height: 64, background: `var(${v})`, borderBottom: "1px solid var(--border-light)" }} />
      <div style={{ padding: "0.6rem 0.7rem" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: mono, fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.15rem" }}>
          {v}
        </div>
        {value && (
          <div style={{ fontFamily: mono, fontSize: "0.66rem", color: "var(--muted)", marginTop: "0.1rem" }}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentRow({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1.25rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <div style={{ minWidth: 220, flex: "1 1 220px" }}>
        <div style={{ fontFamily: mono, fontSize: "0.8rem", fontWeight: 700 }}>{label}</div>
        <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.3rem" }}>{note}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>{children}</div>
    </div>
  );
}
