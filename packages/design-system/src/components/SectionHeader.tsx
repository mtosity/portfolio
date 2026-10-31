"use client";
import styles from "./header.module.scss";

interface Props {
  title: string;
  num?: string;
}

/* Section title: the index numeral in purple SF Mono, then a large
   display title in the brand face. The numbers mark the order of the
   home page's sections, so they stay. */
export const SectionHeader = ({ title, num = "01" }: Props) => {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.num}>{num}</span>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};
