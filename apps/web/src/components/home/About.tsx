"use client";
import Image from "next/image";
import { Reveal, SectionHeader } from "@mtosity/design-system";
import { SKILLS_AT_WORK, SKILLS_FOR_FUN } from "./data";

export const About = () => (
  <section id="about" className="home-section frame about">
    <div className="about-portrait">
      <Reveal>
        <figure>
          <div className="about-portrait-frame">
            <Image src="/mt.png" alt="Drawn portrait of Minh Tam Nguyen with Baymax sitting on his head" width={400} height={500} sizes="(max-width: 860px) 70vw, 30vw" />
          </div>
          <figcaption>Minh Tam Nguyen</figcaption>
        </figure>
      </Reveal>
    </div>

    <div className="about-copy">
      <SectionHeader title="About" />
      <Reveal>
        <p className="about-lead">
          Howdy! I&apos;m Minh Tam Nguyen, a software engineer based in the United States.
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <p>
          Fullstack developer, proficient in building responsive web apps using HTML, CSS,
          JavaScript (ES6), TypeScript, Vue.js, React.js and utilizing Node.js, Golang, Python to
          create RESTful API or GraphQL backends.
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <p>
          Data visualization using JavaScript (D3.js, ECharts) and Python (Matplotlib), cloud
          service experience (AWS, Azure), SQL and NoSQL database operation (MySQL, MongoDB).
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <p>Testing and monitoring web apps using Jest, React Testing Library, Cypress, Datadog, Sentry.</p>
      </Reveal>
      <Reveal delay={0.24}>
        <p className="about-strong">
          I can wear many hats in a startup environment, or work collaboratively with stakeholders in a
          corporate setting.
        </p>
      </Reveal>

      <div className="about-skills">
        <Reveal>
          <div>
            <h3>Use at work</h3>
            <p>{SKILLS_AT_WORK.join(", ")}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <h3>Use for fun</h3>
            <p>{SKILLS_FOR_FUN.join(", ")}</p>
          </div>
        </Reveal>
      </div>

      <p className="about-links">
        <a className="link" href="https://www.linkedin.com/in/mtosity/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="link" href="https://github.com/mtosity" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </div>
  </section>
);
