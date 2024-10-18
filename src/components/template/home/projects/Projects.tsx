"use client";
import { SectionHeader } from "../../utils/SectionHeader";
import { Project } from "./Project";
import styles from "./projects.module.scss";

export const Projects = () => {
  return (
    <section className="section-wrapper" id="projects">
      <SectionHeader title="Projects" dir="r" />

      <div className={styles.projects}>
        {projects.map((project) => {
          return <Project key={project.title} {...project} />;
        })}
      </div>
    </section>
  );
};

const projects = [
  {
    title: "2048 game",
    imgSrc: "/project-imgs/2048.png",
    code: "https://mtosity.github.io/2048-react-wpf-zalo/",
    projectLink: "https://github.com/mtosity/2048-react-wpf-zalo",
    tech: ["React", "Tailwind", "WPF", "C#"],
    description: "2048 game made with React and WPF for both web and desktop.",
    modalContent: (
      <>
        <p>Game 2048 is a single-player sliding block puzzle game.</p>
        <p>2.6k likes on Facebook, 800+ downloads on Zalo store</p>
      </>
    ),
  },
  {
    title: "React Native Apps",
    imgSrc: "/project-imgs/react-native.png",
    code: "https://github.com/mtosity/react_native_devc?tab=readme-ov-file",
    projectLink: "https://youtu.be/pjigOd8tE5U?si=57jjZDCezOlvRZGy",
    tech: ["React Native"],
    description:
      "A bunch of React Native apps for in devc challenge. Final project is a app to search and explore local restaurants.",
    modalContent: (
      <>
        <p>A bunch of React Native apps for in devc challenge.</p>
        <p>Includes: Weather app, Chat app, Food app, etc.</p>
        <p>Final project is a app to search and explore local restaurants.</p>
      </>
    ),
  },
];
