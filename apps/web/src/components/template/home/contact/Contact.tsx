"use client";
import styles from "./contact.module.scss";
import Link from "next/link";
import { Reveal, SectionHeader } from "@mtosity/design-system";

export const Contact = () => {
  return (
    <section className="section-wrapper" id="contact">
      <SectionHeader title="Contact" num="04" />
      <div className={styles.contactWrapper}>
        <Reveal width="100%">
          <h2 className={styles.contactTitle}>
            Let&apos;s work
            <br />
            <em>together.</em>
          </h2>
        </Reveal>
        <Reveal width="100%">
          <div className={styles.contactLinks}>
            <Link
              href="mailto:mtosity@gmail.com"
              className={styles.contactLink}
            >
              <span>mtosity@gmail.com</span>
              <span aria-hidden className={styles.arrow}>↗</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/mtosity/"
              target="_blank"
              rel="nofollow"
              className={styles.contactLink}
            >
              <span>LinkedIn</span>
              <span aria-hidden className={styles.arrow}>↗</span>
            </Link>
            <Link
              href="https://github.com/mtosity"
              target="_blank"
              rel="nofollow"
              className={styles.contactLink}
            >
              <span>GitHub</span>
              <span aria-hidden className={styles.arrow}>↗</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
