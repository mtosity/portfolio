"use client";
import { useEffect, useState } from "react";
import { Reveal } from "@mtosity/design-system";

const EMAIL = "mtosity@gmail.com";

export const Contact = () => {
  const [copied, setCopied] = useState(false);

  // The confirmation lingers long enough to read, then quietly resets.
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" className="home-section frame contact" aria-labelledby="contact-title">
      <Reveal>
        <h2 id="contact-title" className="contact-title display">
          LET&apos;S WORK TOGETHER.
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="contact-links">
          <span className="contact-email-row">
            <a className="contact-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <button type="button" className="contact-copy" onClick={copy} data-copied={copied || undefined}>
              <span aria-live="polite">{copied ? "Copied — talk soon" : "Copy"}</span>
            </button>
          </span>
          <span className="contact-elsewhere">
            <a className="link" href="https://www.linkedin.com/in/mtosity/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="link" href="https://github.com/mtosity" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </span>
        </div>
      </Reveal>
    </section>
  );
};
