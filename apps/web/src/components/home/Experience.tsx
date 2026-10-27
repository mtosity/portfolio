"use client";
import { Reveal, SectionHeader } from "@mtosity/design-system";
import { experience } from "./data";

/* The job descriptions are stored as "•"-led paragraphs; set them as a list. */
const points = (text: string) =>
  text
    .split(/\n\n/)
    .map((s) => s.replace(/^•\s*/, "").trim())
    .filter(Boolean);

export const Experience = () => (
  <section id="experience" className="home-section frame experience">
    <SectionHeader title="Experience" />
    <ol className="exp-list">
      {experience.map((job) => {
        const lines = points(job.description);
        return (
          <li key={job.title} className="exp-item">
            <Reveal>
              <div className="exp-who">
                <h3 className="exp-company display">
                  {job.link ? (
                    <a href={job.link} target="_blank" rel="noreferrer">
                      {job.title}
                    </a>
                  ) : (
                    job.title
                  )}
                </h3>
                <p className="exp-role">{job.position}</p>
                <p className="exp-time">{job.time}</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="exp-what">
                {lines.length > 1 ? (
                  <ul>
                    {lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{lines[0]}</p>
                )}
                {job.tech.length > 0 && <p className="exp-tech">{job.tech.join(", ")}</p>}
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  </section>
);
