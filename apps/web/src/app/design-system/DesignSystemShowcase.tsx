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
  AudioPlayer,
  SegmentedControl,
} from "@mtosity/design-system";

const mono = "var(--font-mono)";
const heading = "var(--font-heading)";

/* ── Token catalogues ── */
const CORE: { v: string; label: string }[] = [
  { v: "--bg", label: "Background" },
  { v: "--bg-secondary", label: "Grouped surface" },
  { v: "--bg-tertiary", label: "Raised surface" },
  { v: "--fg", label: "Label" },
  { v: "--muted", label: "Secondary label" },
  { v: "--accent", label: "Tint / blue" },
  { v: "--accent-text", label: "Tint as text" },
  { v: "--accent-soft", label: "Tinted fill" },
  { v: "--accent-fg", label: "Ink on tint" },
  { v: "--fill", label: "System fill" },
  { v: "--fill-strong", label: "System fill · strong" },
  { v: "--border", label: "Separator" },
  { v: "--border-light", label: "Separator · light" },
  { v: "--danger", label: "Destructive" },
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
  { v: "--font-heading", label: "Display · Bricolage Grotesque", sample: "Typography is the hero." },
  { v: "--font-sans", label: "System · SF Pro (Inter elsewhere)", sample: "Interface copy, body text and labels." },
  { v: "--font-serif", label: "Serif · Literata", sample: "Italic asides and long reads." },
  { v: "--font-mono", label: "Mono · SF Mono", sample: "01 — code, numerals, v0.0.0" },
];

/* Apple's text styles at the default (Large) size — Tailwind utilities
   text-large-title … text-caption-2. */
const TYPE_SCALE: { name: string; size: string; weight: number }[] = [
  { name: "Large Title", size: "2.125rem", weight: 700 },
  { name: "Title 1", size: "1.75rem", weight: 700 },
  { name: "Title 2", size: "1.375rem", weight: 700 },
  { name: "Title 3", size: "1.25rem", weight: 600 },
  { name: "Headline", size: "1.0625rem", weight: 600 },
  { name: "Body", size: "1.0625rem", weight: 400 },
  { name: "Callout", size: "1rem", weight: 400 },
  { name: "Subhead", size: "0.9375rem", weight: 400 },
  { name: "Footnote", size: "0.8125rem", weight: 400 },
  { name: "Caption 1", size: "0.75rem", weight: 400 },
  { name: "Caption 2", size: "0.6875rem", weight: 400 },
];

const RADII = ["--radius-xs", "--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-full"];

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
            — Apple&apos;s system palette, SF type and soft materials, tinted
            blue and set off by a Bricolage display face. It follows your
            device&apos;s appearance; flip the theme (top right) to see every
            token adapt.
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
        <Section num="02" title="Core palette" subtitle="Apple's semantic roles — label, secondary label, grouped surfaces, separators, fills. The blue fill is constant; its text form lightens in dark to hold 4.5:1.">
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
        <Section num="04" title="Chart palette" subtitle="Apple's system hues (chart 5 is the brand blue), with their dark-appearance steps.">
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
                <div style={{ fontFamily: mono, fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.6rem" }}>
                  {f.label} · {f.v}
                </div>
                <div style={{ fontFamily: `var(${f.v})`, fontSize: "1.6rem", lineHeight: 1.3 }}>
                  {f.sample}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Type scale ── */}
        <Section num="06" title="Type scale" subtitle="Apple's text styles in the system face. Weight and size carry hierarchy; nothing below 11px.">
          <div className="ds-group">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.name}
                className="ds-group-row"
                style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", padding: "0.7rem 1rem" }}
              >
                <span style={{ fontSize: t.size, fontWeight: t.weight, letterSpacing: "-0.01em" }}>{t.name}</span>
                <span style={{ fontFamily: mono, fontSize: "0.75rem", color: "var(--muted)" }}>
                  {Math.round(parseFloat(t.size) * 16)}px · {t.weight}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Shape & depth ── */}
        <Section num="07" title="Shape & depth" subtitle="Corner radii from controls to sheets, soft ambient shadows, and the glass material used only by the navigation layer.">
          <Grid min={130}>
            {RADII.map((r) => (
              <div key={r}>
                <div style={{ height: 72, background: "var(--accent-soft)", border: "1.5px solid var(--accent)", borderRadius: `var(${r})` }} />
                <div style={{ fontFamily: mono, fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.6rem" }}>{r}</div>
              </div>
            ))}
          </Grid>
          <div style={{ height: "2rem" }} />
          <Grid min={200}>
            {[
              { v: "--shadow-sm", label: "Shadow · sm" },
              { v: "--shadow-md", label: "Shadow · md" },
              { v: "--shadow-lg", label: "Shadow · lg" },
            ].map((s) => (
              <div key={s.v} style={{ padding: "0.5rem 0.5rem 1.5rem" }}>
                <div
                  style={{
                    height: 90,
                    background: "var(--bg)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: `var(${s.v})`,
                  }}
                />
                <div style={{ fontFamily: mono, fontSize: "0.75rem", color: "var(--muted)", marginTop: "1rem" }}>
                  {s.label} · {s.v}
                </div>
              </div>
            ))}
          </Grid>
        </Section>

        {/* ── Tags ── */}
        <Section num="08" title="Tags" subtitle="<Tag tone> capsules built on the .tag utilities.">
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
        <Section num="09" title="Cards & lists" subtitle=".ds-card is a rounded grouped surface; .ds-card-interactive lifts on hover. .ds-group + .ds-group-row make an inset-grouped list whose rows fill blue under the pointer.">
          <Grid min={240}>
            <div className="ds-card">
              <div style={{ fontFamily: heading, fontSize: "1.25rem", marginBottom: "0.35rem" }}>
                .ds-card
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                Default card — the grouped surface, 18px corners, no outline.
              </p>
            </div>
            <div className="ds-card ds-card-interactive" style={{ cursor: "pointer" }}>
              <div style={{ fontFamily: heading, fontSize: "1.25rem", marginBottom: "0.35rem" }}>
                .ds-card-interactive
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                Hover me — lifts with a soft shadow.
              </p>
            </div>
          </Grid>
          <div style={{ height: "1.5rem" }} />
          <div className="ds-group" style={{ maxWidth: 420 }}>
            {["Inset-grouped row", "Hover fills blue", "Separators hide around it"].map((t) => (
              <a key={t} href="#top" className="ds-group-row" style={{ display: "flex", justifyContent: "space-between", padding: "0.85rem 1rem" }}>
                <span>{t}</span>
                <span aria-hidden style={{ color: "var(--muted)" }}>›</span>
              </a>
            ))}
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section num="10" title="Buttons" subtitle="Capsules: AccentButton / StandardButton are the prominent (filled) style for the one likely action; OutlineButton is the tinted style for a secondary one.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <AccentButton onClick={() => {}}>Accent</AccentButton>
            <AccentButton shadow onClick={() => {}}>Accent · floating</AccentButton>
            <AccentButton disabled>Disabled</AccentButton>
            <AccentButton href="#top">As link</AccentButton>
            <StandardButton>Standard</StandardButton>
            <OutlineButton>Tinted / PDF</OutlineButton>
          </div>
        </Section>

        {/* ── Chips & table ── */}
        <Section num="11" title="Chips & table">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            <span className="chip">.chip</span>
            <span className="chip">Capsule</span>
            <span className="chip">System fill</span>
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
                  <td style={{ fontFamily: mono }}>--shadow-md</td>
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
        <Section num="12" title="Components">
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <ComponentRow label="<Select />" note="Pop-up button with a menu on the thick material — accessible listbox, blue-highlighted rows.">
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

            <ComponentRow label="<Toggle />" note="The iOS switch (button[role=switch]) — blue when on, keyboard-operable.">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Toggle defaultChecked aria-label="Demo toggle on" />
                <Toggle aria-label="Demo toggle off" />
                <Toggle disabled defaultChecked aria-label="Demo toggle disabled on" />
                <Toggle disabled aria-label="Demo toggle disabled off" />
              </div>
            </ComponentRow>

            <ComponentRow label="<AudioPlayer />" note="Now-playing capsule — round blue play/pause, thin scrubber (keyboard-operable), tabular time. For voice/audio samples.">
              <AudioPlayer
                src="/samples/demo-voice.mp3"
                title="Aria — sample voice"
              />
            </ComponentRow>

            <ComponentRow label="<SegmentedControl />" note="Capsule track with a sliding thumb — mutually exclusive choices, arrow-key operable (radiogroup).">
              <SegmentedDemo />
            </ComponentRow>

            <ComponentRow label="<ThemeToggle />" note="Stateless, hydration-safe appearance switch; the site follows the OS until it's used.">
              <ThemeToggle />
            </ComponentRow>

            {/* SectionHeader is a full-width section divider, so it gets its
                own stacked row instead of the centered label/demo split. Its
                built-in 3rem bottom margin is canceled to avoid a big gap. */}
            <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ fontFamily: mono, fontSize: "0.8rem", fontWeight: 700 }}>
                &lt;SectionHeader /&gt;
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.3rem", marginBottom: "1.5rem" }}>
                Section title — a blue index numeral over a large display title.
              </div>
              <div style={{ marginBottom: "-3rem" }}>
                <SectionHeader num="04" title="Example" />
              </div>
            </div>

            <ComponentRow label="<ConfirmDialog />" note="An alert: centered on the thick material, Cancel leading, the action trailing. Esc / Enter handled.">
              <AccentButton onClick={() => setConfirmOpen(true)}>Open dialog</AccentButton>
            </ComponentRow>

            <ComponentRow label="<Reveal />" note="Scroll-into-view entrance on a critically damped spring.">
              <Reveal>
                <div className="ds-card" style={{ minWidth: 220 }}>
                  Revealed on scroll ✦
                </div>
              </Reveal>
            </ComponentRow>

            <ComponentRow label="<SlideTabs />" note="The glass navigation bar — a capsule slides between links and rests on the current page.">
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
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.85rem" }}>
        <span style={{ fontFamily: mono, fontSize: "0.8125rem", color: "var(--accent-text)" }}>
          {num}
        </span>
        <h2 style={{ margin: 0, fontSize: "clamp(1.6rem, 3vw, 2rem)", letterSpacing: "-0.03em" }}>
          {title}
        </h2>
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
    <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ height: 64, background: `var(${v})`, boxShadow: "inset 0 -1px 0 var(--border-light)" }} />
      <div style={{ padding: "0.6rem 0.7rem" }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: mono, fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>
          {v}
        </div>
        {value && (
          <div style={{ fontFamily: mono, fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.1rem" }}>
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

function SegmentedDemo() {
  const [v, setV] = useState("Week");
  return <SegmentedControl aria-label="Range" options={["Day", "Week", "Month", "Year"]} value={v} onChange={setV} />;
}
