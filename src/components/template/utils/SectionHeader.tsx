"use client";
import styles from "./header.module.scss";

interface Props {
  title: string;
  num?: string;
}

export const SectionHeader = ({ title, num = "01" }: Props) => {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.num}>{num} —</span>
      <h3 className={styles.title}>{title.toUpperCase()}</h3>
      <div className={styles.line} />
    </div>
  );
};
