"use client";
import { Reveal } from "@mtosity/design-system";

export const Contact = () => (
  <section id="contact" className="home-section frame contact" aria-labelledby="contact-title">
    <Reveal>
      <h2 id="contact-title" className="contact-title display">
        LET&apos;S WORK TOGETHER.
      </h2>
    </Reveal>
    <Reveal delay={0.08}>
      <div className="contact-links">
        <a className="contact-email" href="mailto:mtosity@gmail.com">
          mtosity@gmail.com
        </a>
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
