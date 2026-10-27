"use client";

import React, { useEffect, useState } from "react";
import {
  SiteNav,
  SiteFooter,
  Button,
  AccentButton,
  Tag,
  SectionHeader,
  ConfirmDialog,
  ThemeToggle,
  Reveal,
  Select,
  Toggle,
  AudioPlayer,
  WORLD,
} from "@mtosity/design-system";

/* ── Token catalogues ──
   Keep in sync with tokens.css / world.css / system.css (see
   packages/design-system/AGENTS.md). Values are read live from the page,
   so the hexes shown are always the ones on screen. */
const CORE: { v: string; label: string; note: string }[] = [
  { v: "--bg", label: "Ground", note: "Page background" },
  { v: "--bg-secondary", label: "Surface", note: "A step in tone: cards, rows, footer" },
  { v: "--surface-raised", label: "Raised", note: "What floats: menus, dialogs, sheets" },
  { v: "--fg", label: "Ink", note: "Running text and headings" },
  { v: "--muted", label: "Muted", note: "Secondary text (≥ 4.5:1 on ground)" },
  { v: "--faint", label: "Faint", note: "Counts, disabled text" },
  { v: "--accent", label: "Accent", note: "The one action, the one mark" },
  { v: "--accent-fg", label: "On accent", note: "Text on an accent fill" },
  { v: "--border-light", label: "Hairline", note: "Tables and reading rules only" },
  { v: "--danger", label: "Danger", note: "Destructive actions" },
  { v: "--film", label: "Film", note: "Code and dark strips, both themes" },
];

const STATUS = ["--positive", "--negative", "--warning", "--info"];
const CHART = Array.from({ length: 8 }, (_, i) => `--chart-${i + 1}`);
const STEPS = ["--step-6", "--step-5", "--step-4", "--step-3", "--step-2", "--step-1", "--step-0", "--step--1", "--step--2"];
const SPACE = ["--space-1", "--space-2", "--space-3", "--space-4", "--space-5", "--space-6", "--space-7", "--space-8", "--space-9"];
const EASES = [
  { v: "--ease-out", label: "Ease out", use: "Entering, responding to input" },
  { v: "--ease-in-out", label: "Ease in-out", use: "Moving across the screen" },
  { v: "--ease-drawer", label: "Drawer", use: "Sheets and the nav tucking away" },
];
const DURATIONS = [
  { v: "--dur-press", use: "Press feedback" },
  { v: "--dur-fast", use: "Hover, colour" },
  { v: "--dur-base", use: "Menus, panels" },
  { v: "--dur-slow", use: "Entrances" },
];

const ALL_VARS = [
  ...CORE.map((t) => t.v),
  ...STATUS,
  ...CHART,
  ...STEPS,
  ...SPACE,
  ...EASES.map((e) => e.v),
  ...DURATIONS.map((d) => d.v),
  "--radius-s",
  "--radius-m",
  "--radius-l",
];

const SECTIONS = [
  ["world", "World"],
  ["color", "Colour"],
  ["type", "Type"],
  ["space", "Space & shape"],
  ["motion", "Motion"],
  ["components", "Components"],
] as const;

export function DesignSystemShowcase({ version, name }: { version: string; name: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resolved, setResolved] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string>("world");

  // Resolve every token's computed value, again whenever the theme flips.
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const v of ALL_VARS) next[v] = cs.getPropertyValue(v).trim();
      setResolved(next);
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // Index highlights the section being read.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SiteNav />
      <main id="main" className="ds frame">
        <header className="ds-head">
          <h1 className="ds-title display">Design system</h1>
          <div className="ds-intro">
            <p>
              The living reference for <code>{name}</code>. One file,{" "}
              <code>world.css</code>, gives every role its value; every page on this site reads
              the roles. Flip the theme to watch them change.
            </p>
            <div className="ds-intro-row">
              <Tag tone="neutral">v{version}</Tag>
              <span>World: {WORLD.name}</span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="ds-layout">
          <nav className="ds-index" aria-label="On this page">
            <ol>
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="ds-body">
            {/* ── World ── */}
            <section id="world" className="ds-section">
              <SectionHeader title={WORLD.name} lede={WORLD.summary} />
              <ul className="ds-rules">
                {WORLD.rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>

            {/* ── Colour ── */}
            <section id="color" className="ds-section">
              <SectionHeader title="Colour" lede="Roles, not hues. One ground, one ink, one accent; surfaces step in tone instead of drawing lines." />
              <div className="ds-swatches">
                {CORE.map((t) => (
                  <figure key={t.v} className="ds-swatch">
                    <div className="ds-swatch-chip" style={{ background: `var(${t.v})` }} />
                    <figcaption>
                      <strong>{t.label}</strong>
                      <span>{t.note}</span>
                      <code>
                        {t.v} · {resolved[t.v]}
                      </code>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <h3 className="ds-sub">Status</h3>
              <div className="ds-row">
                {STATUS.map((v) => (
                  <div key={v} className="ds-status" style={{ color: `var(${v})`, background: `var(${v}-surface)` }}>
                    <strong>{v.slice(2)}</strong>
                    <code>{resolved[v]}</code>
                  </div>
                ))}
              </div>

              <h3 className="ds-sub">Chart</h3>
              <div className="ds-chart">
                {CHART.map((v, i) => (
                  <div key={v} style={{ background: `var(${v})`, height: `${38 + ((i * 37) % 62)}%` }} title={`${v} ${resolved[v] ?? ""}`} />
                ))}
              </div>
            </section>

            {/* ── Type ── */}
            <section id="type" className="ds-section">
              <SectionHeader title="Type" lede="Two families do all the work. Sizes come from a fluid scale; three or four of them carry any one page." />
              <div className="ds-faces">
                {WORLD.faces.map((f) => (
                  <div key={f.token} className="ds-face">
                    <p className="ds-face-meta">
                      <strong>{f.role}</strong> · {f.name} · <code>{f.token}</code>
                    </p>
                    <p
                      className={f.role === "Display" ? "display ds-face-sample-display" : "ds-face-sample"}
                      style={f.role === "Display" ? undefined : { fontFamily: `var(${f.token})` }}
                    >
                      {f.sample}
                    </p>
                  </div>
                ))}
              </div>
              <h3 className="ds-sub">Scale</h3>
              <ol className="ds-scale">
                {STEPS.map((v) => (
                  <li key={v}>
                    <code>{v}</code>
                    <span style={{ fontSize: `var(${v})` }}>Minh Tam</span>
                    <code className="ds-scale-val">{resolved[v]}</code>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── Space & shape ── */}
            <section id="space" className="ds-section">
              <SectionHeader title="Space & shape" lede="Gaps between sections are always larger than any gap inside one." />
              <ol className="ds-space">
                {SPACE.map((v) => (
                  <li key={v}>
                    <code>{v}</code>
                    <span style={{ width: `var(${v})` }} />
                    <code className="ds-scale-val">{resolved[v]}</code>
                  </li>
                ))}
              </ol>
              <div className="ds-row ds-radii">
                {["--radius-s", "--radius-m", "--radius-l"].map((v) => (
                  <div key={v} style={{ borderRadius: `var(${v})` }}>
                    <code>{v}</code>
                    <span>{resolved[v] || "0"}</span>
                  </div>
                ))}
                <div className="ds-float">
                  <code>--shadow-float</code>
                  <span>Only on what floats</span>
                </div>
              </div>
            </section>

            {/* ── Motion ── */}
            <section id="motion" className="ds-section">
              <SectionHeader title="Motion" lede="Hover a row to run its curve. Strong ease-out for anything answering the reader; nothing UI-sized runs longer than 300ms." />
              <div className="ds-eases">
                {EASES.map((e) => (
                  <div key={e.v} className="ds-ease" style={{ "--ease": `var(${e.v})` } as React.CSSProperties}>
                    <div className="ds-ease-track">
                      <span />
                    </div>
                    <p>
                      <strong>{e.label}</strong> · {e.use}
                      <code>{resolved[e.v]}</code>
                    </p>
                  </div>
                ))}
              </div>
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Duration</th>
                    <th>Value</th>
                    <th>Use</th>
                  </tr>
                </thead>
                <tbody>
                  {DURATIONS.map((d) => (
                    <tr key={d.v}>
                      <td><code>{d.v}</code></td>
                      <td>{resolved[d.v]}</td>
                      <td>{d.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* ── Components ── */}
            <section id="components" className="ds-section">
              <SectionHeader title="Components" lede="Everything exported from the package, live." />

              <Specimen name="<Button />" note="accent is the page's one primary action; ink a strong secondary; quiet everything else. Presses at 0.97.">
                <Button>Get in touch</Button>
                <Button variant="ink">Read the post</Button>
                <Button variant="quiet">View source</Button>
                <Button disabled>Disabled</Button>
              </Specimen>

              <Specimen name="<AccentButton />" note="v0 API kept for the tools and admin; renders <Button variant='accent'>.">
                <AccentButton onClick={() => setConfirmOpen(true)}>Open dialog</AccentButton>
              </Specimen>

              <Specimen name="<Tag />" note="Status on a tinted surface. Sentence case, tabular numbers.">
                <Tag tone="positive">Live</Tag>
                <Tag tone="negative">Failed</Tag>
                <Tag tone="warning">Beta</Tag>
                <Tag tone="info">New</Tag>
                <Tag tone="neutral">Draft</Tag>
                <Tag tone="positive" strong>Strong buy</Tag>
              </Specimen>

              <Specimen name="<Select />" note="Custom listbox: arrow keys, Home/End, type-ahead free, Esc closes, submits in forms.">
                <Select
                  defaultValue="medium"
                  aria-label="Demo select"
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                />
              </Specimen>

              <Specimen name="<Toggle />" note="button[role=switch]. The thumb stretches while pressed.">
                <Toggle defaultChecked aria-label="Demo toggle on" />
                <Toggle aria-label="Demo toggle off" />
                <Toggle disabled aria-label="Demo toggle disabled" />
              </Specimen>

              <Specimen name="<AudioPlayer />" note="For voice samples. Keyboard-operable seek.">
                <AudioPlayer src="/samples/demo-voice.mp3" title="Aria — sample voice" />
              </Specimen>

              <Specimen name="<ThemeToggle />" note="Stateless and hydration-safe; icons swap in CSS.">
                <ThemeToggle />
              </Specimen>

              <Specimen name=".chip" note="Small metadata: tech, tags.">
                <span className="chip">TypeScript</span>
                <span className="chip">Golang</span>
                <span className="chip">WebRTC</span>
              </Specimen>

              <Specimen name="<Reveal />" note="Rises 20px into place once, the first time it scrolls into view. Visible without script.">
                <Reveal width="fit-content">
                  <div className="ds-card">Revealed on scroll</div>
                </Reveal>
              </Specimen>

              <Specimen name=".ds-card / .ds-card-interactive" note="A step in tone. The interactive one lifts with the float shadow on hover.">
                <div className="ds-card">Card</div>
                <div className="ds-card ds-card-interactive" tabIndex={0}>Hover me</div>
              </Specimen>

              <div className="ds-specimen ds-specimen-stack">
                <div className="ds-specimen-meta">
                  <code>&lt;SectionHeader /&gt;</code>
                  <p>Every section opens with a heading that names it. Optional lede and aside.</p>
                </div>
                <SectionHeader title="Selected work" lede="Things I've shipped and the reasons they exist." aside="9 projects" />
              </div>

              <Specimen name="<SiteNav /> · <SiteFooter />" note="In use at the top and bottom of this page.">
                <span className="ds-muted">The bar tucks away while you read down and returns when you scroll up.</span>
              </Specimen>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this note?"
        message="It will be gone from the notes page and its link will stop working."
        confirmLabel="Delete note"
        cancelLabel="Keep it"
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function Specimen({ name, note, children }: { name: string; note: string; children: React.ReactNode }) {
  return (
    <div className="ds-specimen">
      <div className="ds-specimen-meta">
        <code>{name}</code>
        <p>{note}</p>
      </div>
      <div className="ds-specimen-demo">{children}</div>
    </div>
  );
}
