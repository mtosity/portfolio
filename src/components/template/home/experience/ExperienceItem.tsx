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
  description,
  tech,
}: Props) => {
  const titleContent = link ? (
    <a className={styles.title} href={link} rel="noreferrer" target="_blank">
      {title.toUpperCase()}
    </a>
  ) : (
    <span className={styles.title}>{title.toUpperCase()}</span>
  );

  return (
    <div className={styles.experience}>
      <Reveal width="100%">
        <div className={styles.heading}>
          {titleContent}
          <span className={styles.time}>{time}</span>
        </div>
      </Reveal>
      <Reveal>
        <span className={styles.position}>{position}</span>
      </Reveal>
      <div className={styles.divider} />
      <Reveal width="100%">
        <p className={styles.description} style={{ whiteSpace: "pre-line" }}>
          {description}
        </p>
      </Reveal>
      <Reveal width="100%">
        <div className={styles.tech}>
          {tech.map((item) => (
            <span key={item} className={styles.chip}>
              {item}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
};
