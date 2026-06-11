"use client";
import { Reveal } from "../../utils/Reveal";
import styles from "./stats.module.scss";

export const Stats = () => {
  return (
    <div className={styles.stats}>
      <Reveal>
        <div className={styles.statColumn}>
          <h4>Use at work</h4>
          <div className={styles.statGrid}>
            <span className="chip">JavaScript</span>
            <span className="chip">TypeScript</span>
            <span className="chip">HTML</span>
            <span className="chip">CSS</span>
            <span className="chip">Tailwind</span>
            <span className="chip">React</span>
            <span className="chip">Next.js</span>
            <span className="chip">Vue.js</span>
            <span className="chip">Redux</span>
            <span className="chip">Node.js</span>
            <span className="chip">Express</span>
            <span className="chip">Postgres</span>
            <span className="chip">MongoDB</span>
            <span className="chip">Firebase</span>
            <span className="chip">GitHub</span>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className={styles.statColumn}>
          <h4>Use for fun</h4>
          <div className={styles.statGrid}>
            <span className="chip">React Native</span>
            <span className="chip">Gatsby</span>
            <span className="chip">Chakra UI</span>
            <span className="chip">Figma</span>
            <span className="chip">Planetscale</span>
            <span className="chip">GraphQL</span>
            <span className="chip">Supabase</span>
            <span className="chip">Vercel</span>
            <span className="chip">D3.js</span>
            <span className="chip">Python</span>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
