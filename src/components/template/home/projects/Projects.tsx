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
    title: "[Solo] This portfolio",
    imgSrc: "/screenshot.png",
    code: "https://github.com/mtosity/portfolio",
    projectLink: "https://www.mtosity.com",
    tech: ["Next JS", "Tailwind CSS", "Framer Motion"],
    description:
      "My personal portfolio to showcase my projects and experiences.",
    modalContent: (
      <>
        <p>My personal portfolio to showcase my projects and experiences.</p>
        <p>A lot of Framer motion sauces</p>
      </>
    ),
  },
  {
    title: "[Frontend Engineer] Coalition Cyber Experience",
    imgSrc: "/project-imgs/coalition.jpeg",
    code: "https://github.com/crucible-risk",
    projectLink: "https://www.coalitioninc.com/brokers",
    tech: ["Go", "React JS", "Next JS"],
    description:
      "Coalition’s Active Cyber Insurance is designed to help you do the most for your clients without the complexity.",
    modalContent: (
      <>
        <p>Broker Platform / Internal tools / Email templates</p>
        <p>
          Quoting forms, underwriting pricing flow, internal tools for managing
          policies.
        </p>
        <img src="/project-imgs/coalition2.avif" alt="" />
        <p>Implemented and actively monitoring platform health</p>
        <img src="/project-imgs/coalition3.png" alt="" />
      </>
    ),
  },
  {
    title: "[Lead Frontend Engineer] Pixie",
    imgSrc: "/project-imgs/gotpixie.png",
    code: "https://github.com/pixiespirit/web-uikit",
    projectLink: "https://gotpixie.com/en/about",
    tech: ["Go", "React JS", "Next JS"],
    description:
      "Pixie strive to help people reach their fullest potential through meaningful connections & easy to learn from each other in real time.",
    modalContent: (
      <>
        <p>
          Pixie strive to help people reach their fullest potential through
          meaningful connections & easy to learn from each other in real time.
        </p>
        <img src="/project-imgs/live.png" />
        <p>I built: Landing page / Login / Scheduling / Video Calls</p>
        <p>Mentor admin panel</p>
        <p>Blog CMS, AI GPT matching guide</p>
        <img src="/project-imgs/gotpixie2.png" />
        <strong>{`Yes I did EVERYTHING in the front-end! :))`}</strong>
      </>
    ),
  },
  {
    title: "[Frontend Engineer] Vinbrain Dr Aid",
    imgSrc: "/project-imgs/draid.webp",
    code: "https://youtu.be/5CVWWFhLpNQ?si=mEjHj1dgKOccwhbr",
    projectLink: "https://draid.ai/",
    tech: ["Express JS", "React", "Node JS", "MongoDB"],
    description:
      "Dr Aid is a medical AI platform that helps doctors diagnose diseases.",
    modalContent: (
      <>
        <p>
          Dr Aid is a medical AI platform that helps doctors diagnose diseases.
        </p>
        <p>
          I contributed to the project by developing the Admin Panel feature
          that allows doctors to manage the patient&apos;s visit history,
          diagnosis.
        </p>
        <p>
          Video Call between doctor and patient using Twilio, save
          patient&apos;s records, video calls.
        </p>
      </>
    ),
  },
  {
    title: "[Frontend Engineer] Swell & Switchboard",
    imgSrc: "/project-imgs/wave.png",
    code: "https://www.designveloper.com/blog/project/wave/",
    projectLink: "https://compass.swellenergy.com/",
    tech: ["Meteor JS", "Express JS", "React", "Node JS", "MongoDB"],
    description:
      "Swell Energy is a leading provider of residential energy storage and grid services.",
    modalContent: (
      <>
        <p>
          * Collaborated with backend engineers to build scalable REST APIs,
          ensuring optimal front-end integration and performance. To guarantee
          the accuracy of every single detail and deal with the database growing
          extremely fast and the continuously changing requirements.
        </p>
        <strong>
          Well what did I do exactly? Add more inputs fields, add more map
          control, add more charts, render more docs, tech dept, a lot of tech
          dept.
        </strong>
        <img src="/project-imgs/wave1.png" />
        <img src="/project-imgs/wave2.png" />
      </>
    ),
  },
  {
    title: "[Solo] Full featured e-commerce website",
    imgSrc: "/project-imgs/ecom.png",
    code: "https://github.com/mtosity/mern-ecom",
    projectLink:
      "https://github.com/mtosity/mern-ecom/blob/master/READMEs/images/home.png",
    tech: ["MERN", "Express JS", "React", "Node JS", "MongoDB"],
    description:
      "Full featured e-commerce website with admin panel, payment gateway, etc.",
    modalContent: (
      <>
        <p>
          Full featured e-commerce website with admin panel, payment gateway,
          etc.
        </p>
        <p>Full stack MERN project, responsive design, JWT authentication</p>
        <img src="https://github.com/mtosity/mern-ecom/blob/master/READMEs/images/home-mobile.png?raw=true" />
        <img src="https://github.com/mtosity/mern-ecom/blob/master/READMEs/images/admin-home.png?raw=true" />
        <img src="https://github.com/mtosity/mern-ecom/blob/master/READMEs/images/admin-orders.png?raw=true" />
        <strong>
          Nope, I didn&apos;t copy anything, learn a lot of CSS and database
          design
        </strong>
      </>
    ),
  },
  {
    title: "[Solo] Categorize animals in the wild using ML/AI",
    imgSrc: "/project-imgs/cam.png",
    code: "https://gitlab.com/mtosity/CameraTrapThesis",
    projectLink: "https://youtu.be/OLcSiW0PHqc?si=Au-KZmbQxvDLI0Zr",
    tech: ["YoloV5", "FasterCNN"],
    description:
      "HCMUS thesis project. Detect and categorize animals, vehicles using ML/AI.",
    modalContent: (
      <>
        <p>
          HCMUS thesis project. Detect and categorize animals, vehicles using
          YoloV5, FasterCNN.
        </p>
        <img src="/project-imgs/cam_result.png" />
        <strong>3.9 BS thesis btw</strong>
      </>
    ),
  },
  {
    title: "[Solo] 2048 game",
    imgSrc: "/project-imgs/2048.png",
    code: "https://mtosity.github.io/2048-react-wpf-zalo/",
    projectLink: "https://github.com/mtosity/2048-react-wpf-zalo",
    tech: ["React", "Tailwind", "WPF", "C#"],
    description: "2048 game made with React and WPF for both web and desktop.",
    modalContent: (
      <>
        <p>Game 2048 is a single-player sliding block puzzle game.</p>
        <p>2.6k likes on Facebook, 800+ downloads on Zalo store</p>
        <strong>
          I&apos;m not a game developer, but I can make a game. I&apos;m not a
          designer, but I can make it look good.
        </strong>
      </>
    ),
  },
  {
    title: "[Solo] React Native Apps",
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
        <strong>Yub, I still can make mobile apps.</strong>
      </>
    ),
  },
];
