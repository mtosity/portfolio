"use client";
import { Reveal } from "../../utils/Reveal";
import styles from "./experience.module.scss";

interface Props {
  title: string;
  link?: string;
  position: string;
  time: string;
  location: string;
  description: string;
  tech: string[];
}

export const ExperienceItem = ({
  title,
  link,
  position,
  time,
  location,
  description,
  tech,
}: Props) => {
  const titleContent = link ? (
    <a className={styles.title} href={link} rel="noreferrer" target="_blank">
      {title}
    </a>
  ) : (
    <span className={styles.title}>{title}</span>
  );

  return (
    <div className={styles.experience}>
      <div className={styles.heading}>
        <Reveal>
          {titleContent}
        </Reveal>
        <Reveal>
          <span>{time}</span>
        </Reveal>
      </div>

      <div className={styles.heading}>
        <Reveal>
          <span className={styles.position}>{position}</span>
        </Reveal>
        <Reveal>
          <span>{location}</span>
        </Reveal>
      </div>
      <Reveal>
        <p className={styles.description} style={{ whiteSpace: "pre-line" }}>
          {description}
        </p>
      </Reveal>
      <Reveal>
        <div className={styles.tech}>
          {tech.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
};
