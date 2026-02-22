"use client";
import styles from "./contact.module.scss";
import Link from "next/link";
import { Reveal } from "../../utils/Reveal";
import { SectionHeader } from "../../utils/SectionHeader";

export const Contact = () => {
  return (
    <section className="section-wrapper" id="contact">
      <SectionHeader title="Contact" num="04" />
      <div className={styles.contactWrapper}>
        <Reveal width="100%">
          <h2 className={styles.contactTitle}>
            LET&apos;S WORK
            <br />
            TOGETHER.
          </h2>
        </Reveal>
        <Reveal width="100%">
          <div className={styles.contactLinks}>
            <Link
              href="mailto:mtosity@gmail.com"
              className={styles.contactLink}
            >
              mtosity@gmail.com ↗
            </Link>
            <Link
              href="https://www.linkedin.com/in/mtosity/"
              target="_blank"
              rel="nofollow"
              className={styles.contactLink}
            >
              LinkedIn ↗
            </Link>
            <Link
              href="https://github.com/mtosity"
              target="_blank"
              rel="nofollow"
              className={styles.contactLink}
            >
              GitHub ↗
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
