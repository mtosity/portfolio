"use client";
import { SectionHeader } from "../../utils/SectionHeader";
import { Project } from "./Project";
import styles from "./projects.module.scss";

export const Projects = () => {
  return (
    <section className="section-wrapper" id="projects">
      <SectionHeader title="Projects" num="03" />
      <div className={styles.projects}>
        {projects.map((project, idx) => {
          return (
            <Project
              key={project.title}
              index={idx + 1}
              {...project}
            />
          );
        })}
      </div>
    </section>
  );
};

const projects = [
  {
    title: "Real-time Wildfires Tracker",
    imgSrc:
      "https://github.com/user-attachments/assets/c61d82c8-3aa3-4ef6-b8ef-06120dc08635",
    code: "https://github.com/mtosity/wildfires-tracker",
    projectLink: "https://wildfires.mtosity.com/",
    tech: ["Next.js", "Tailwind CSS", "NASA FIRMS", "OpenstreetMap"],
    description: "Tracking current active wildfires across the world",
    year: "2024",
    modalContent: (
      <>
        <p>Used to check the wildfires in my state communities</p>
        <img src="https://github.com/user-attachments/assets/5f58270d-2c69-46e4-9979-58814479e37b" />
        <img src="https://github.com/user-attachments/assets/c61d82c8-3aa3-4ef6-b8ef-06120dc08635" />
        <img src="https://github.com/user-attachments/assets/4645dc22-c6bf-4f4f-9be4-5258bb4a63a3" />
      </>
    ),
  },
  {
    title: "thestockie.com",
    imgSrc: "/project-imgs/thestockie-1.png",
    code: "https://github.com/mtosity/thestockie",
    projectLink: "https://www.thestockie.com",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion", "Recharts"],
    description:
      "All-in-one for analyzing stock fundamentals, with LLM recommendations.",
    year: "2023",
    modalContent: (
      <>
        <p>
          Need a place for analyzing stocks, so I built one. Using data from
          openbb, fmp, and OpenAI LLM.
        </p>
        <img src="/project-imgs/thestockie-1.png" />
        <img src="/project-imgs/thestockie-2.png" />
        <img src="/project-imgs/thestockie-3.png" />
      </>
    ),
  },
  {
    title: "mtosity.com",
    imgSrc: "/screenshot.png",
    code: "https://github.com/mtosity/portfolio",
    projectLink: "https://www.mtosity.com",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    description:
      "My personal portfolio to showcase my projects and experiences.",
    year: "2024",
    modalContent: (
      <>
        <p>My personal portfolio to showcase my projects and experiences.</p>
        <p>A lot of Framer Motion sauces.</p>
      </>
    ),
  },
  {
    title: "Coalition Cyber Experience",
    imgSrc: "/project-imgs/coalition.jpeg",
    code: "https://github.com/crucible-risk",
    projectLink: "https://www.coalitioninc.com/brokers",
    tech: ["Go", "React", "Next.js"],
    description:
      "Coalition's Active Cyber Insurance platform — broker tools, quoting, underwriting.",
    year: "2022",
    modalContent: (
      <>
        <p>Broker Platform / Internal tools / Email templates</p>
        <p>Quoting forms, underwriting pricing flow, internal tools for managing policies.</p>
        <img src="/project-imgs/coalition2.avif" alt="" />
        <img src="/project-imgs/coalition3.png" alt="" />
      </>
    ),
  },
  {
    title: "Pixie",
    imgSrc: "/project-imgs/gotpixie.png",
    code: "https://github.com/pixiespirit/web-uikit",
    projectLink: "https://www.linkedin.com/company/pixiegroup/about/",
    tech: ["Go", "React", "Next.js"],
    description:
      "Mentorship platform with real-time video calls, chat, and scheduling.",
    year: "2021",
    modalContent: (
      <>
        <p>
          Pixie: meaningful connections & easy to learn from each other in real time.
        </p>
        <img src="/project-imgs/live.png" />
        <p>I built: Landing page / Login / Scheduling / Video Calls</p>
        <img src="/project-imgs/gotpixie2.png" />
      </>
    ),
  },
  {
    title: "Vinbrain Dr Aid",
    imgSrc: "/project-imgs/draid.webp",
    code: "https://youtu.be/5CVWWFhLpNQ?si=mEjHj1dgKOccwhbr",
    projectLink: "https://draid.ai/",
    tech: ["Express.js", "React", "Node.js", "MongoDB"],
    description:
      "Medical AI platform — telehealth dashboard with video consultations.",
    year: "2020",
    modalContent: (
      <>
        <p>Dr Aid: medical AI platform that helps doctors diagnose diseases.</p>
        <p>
          I contributed admin panel features, patient visit history, and video
          calls between doctors and patients using Twilio.
        </p>
      </>
    ),
  },
  {
    title: "Swell & Switchboard",
    imgSrc: "/project-imgs/wave.png",
    code: "https://www.designveloper.com/blog/project/wave/",
    projectLink: "https://compass.swellenergy.com/",
    tech: ["Meteor.js", "React", "Node.js", "MongoDB"],
    description:
      "Residential energy storage and grid services dashboard.",
    year: "2020",
    modalContent: (
      <>
        <p>Swell Energy: leading provider of residential energy storage and grid services.</p>
        <img src="/project-imgs/wave1.png" />
        <img src="/project-imgs/wave2.png" />
      </>
    ),
  },
  {
    title: "Full-featured E-commerce",
    imgSrc: "/project-imgs/ecom.png",
    code: "https://github.com/mtosity/mern-ecom",
    projectLink:
      "https://github.com/mtosity/mern-ecom/blob/master/READMEs/images/home.png",
    tech: ["MERN", "Express.js", "React", "Node.js", "MongoDB"],
    description:
      "Full-featured e-commerce site with admin panel, payment gateway.",
    year: "2020",
    modalContent: (
      <>
        <p>Full stack MERN project, responsive design, JWT authentication.</p>
        <img src="https://github.com/mtosity/mern-ecom/blob/master/READMEs/images/home-mobile.png?raw=true" />
        <img src="https://github.com/mtosity/mern-ecom/blob/master/READMEs/images/admin-home.png?raw=true" />
      </>
    ),
  },
  {
    title: "Animal Categorization ML/AI",
    imgSrc: "/project-imgs/cam.png",
    code: "https://gitlab.com/mtosity/CameraTrapThesis",
    projectLink: "https://youtu.be/OLcSiW0PHqc?si=Au-KZmbQxvDLI0Zr",
    tech: ["YoloV5", "FasterCNN"],
    description:
      "HCMUS thesis project. Detect and categorize animals using ML/AI.",
    year: "2020",
    modalContent: (
      <>
        <p>Detect and categorize animals, vehicles using YoloV5, FasterCNN.</p>
        <img src="/project-imgs/cam_result.png" />
        <strong>3.9/4 thesis score.</strong>
      </>
    ),
  },
  {
    title: "2048 Game",
    imgSrc: "/project-imgs/2048.png",
    code: "https://mtosity.github.io/2048-react-wpf-zalo/",
    projectLink: "https://github.com/mtosity/2048-react-wpf-zalo",
    tech: ["React", "Tailwind", "WPF", "C#"],
    description: "2048 game for both web and desktop. 2.6k likes on Facebook.",
    year: "2020",
    modalContent: (
      <>
        <p>Game 2048 is a single-player sliding block puzzle game.</p>
        <p>2.6k likes on Facebook, 800+ downloads on Zalo store.</p>
      </>
    ),
  },
];
