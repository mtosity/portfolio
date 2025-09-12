"use client";
import { MyLinks } from "../../nav/components/MyLinks";
import { Reveal } from "../../utils/Reveal";
import { SectionHeader } from "../../utils/SectionHeader";
import styles from "./about.module.scss";
import { Stats } from "./Stats";
import { AiOutlineArrowRight } from "react-icons/ai";

export const About = () => {
  return (
    <section id="about" className="section-wrapper">
      <SectionHeader title="About" dir="l" />
      <div className={styles.about}>
        <div>
          <Reveal>
            <p className={`${styles.aboutText} ${styles.highlightFirstLetter}`}>
              Howdy! I&apos;m Minh Tam Nguyen, a software engineer live in the
              United States.
              <br />
              <br />
              Fullstack developer, proficient in build responsive web app using
              HTML, CSS, JavaScript (ES6), Typescript, Vue.js, React.js and
              utilize Java Spring Boot, Node.js Express.js to create RESTful API
              or GraphQL backend.
            </p>
          </Reveal>
          <Reveal>
            <p className={styles.aboutText}>
              Data visualization using JavaScript (AntV G2, ECharts) and Python
              (Matplotlib), multithreading concurrent web spider using Python,
              website deploy using Apache server on Linux, cloud service
              experience (AWS, Azure), SQL and NoSQL database operation (MySQL,
              MongoDB).
            </p>
          </Reveal>
          <Reveal>
            <p className={styles.aboutText}>
              Data analytics with Machine Learning algorithms (SVM, CNN etc.)
              using Scikit-learn, TensorFlow, Keras, PyTorch and more.
            </p>
          </Reveal>
          <Reveal>
            <p className={styles.aboutText}>
              Testing and monitoring web app using Jest, React Testing Library,
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
              <div className={styles.linksText}>
                <span>My links</span>
                <AiOutlineArrowRight />
              </div>
              <MyLinks />
            </div>
          </Reveal>
        </div>
        <Stats />
      </div>
    </section>
  );
};
