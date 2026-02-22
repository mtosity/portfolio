"use client";
import { MyLinks } from "../../nav/components/MyLinks";
import { Reveal } from "../../utils/Reveal";
import { SectionHeader } from "../../utils/SectionHeader";
import styles from "./about.module.scss";
import { Stats } from "./Stats";

export const About = () => {
  return (
    <section id="about" className="section-wrapper">
      <SectionHeader title="About" num="01" />
      <div className={styles.about}>
        <div>
          <Reveal>
            <p className={styles.aboutText}>
              Howdy! I&apos;m Minh Tam Nguyen, a software engineer based in the
              United States.
              <br />
              <br />
              Fullstack developer, proficient in building responsive web apps
              using HTML, CSS, JavaScript (ES6), TypeScript, Vue.js, React.js
              and utilizing Node.js, Golang, Python to create RESTful API or
              GraphQL backends.
            </p>
          </Reveal>
          <Reveal>
            <p className={styles.aboutText}>
              Data visualization using JavaScript (D3.js, ECharts) and Python
              (Matplotlib), cloud service experience (AWS, Azure), SQL and NoSQL
              database operation (MySQL, MongoDB).
            </p>
          </Reveal>
          <Reveal>
            <p className={styles.aboutText}>
              Testing and monitoring web apps using Jest, React Testing Library,
              Cypress, Datadog, Sentry.
            </p>
          </Reveal>
          <Reveal>
            <strong className={styles.aboutText}>
              I can wear many hats in a startup environment, or work
              collaboratively with stakeholders in a corporate setting.
            </strong>
          </Reveal>
          <Reveal>
            <div className={styles.links}>
              <span className={styles.linksLabel}>Links</span>
              <MyLinks />
            </div>
          </Reveal>
        </div>
        <Stats />
      </div>
    </section>
  );
};
