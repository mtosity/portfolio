/* Home page content — every word here is the site owner's own copy and is
   shared by every visual world. Worlds change how it is set, never what it
   says. */
import type { JSX } from "react";

export interface Project {
  title: string;
  imgSrc: string;
  code: string;
  projectLink: string;
  tech: string[];
  description: string;
  year: string;
  modalContent: JSX.Element;
}

export interface Job {
  title: string;
  link?: string;
  position: string;
  time: string;
  location: string;
  description: string;
  tech: string[];
}

export const slugOf = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const projects: Project[] = [
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


export const experience: Job[] = [
  {
    title: "SAS Institute",
    link: "https://www.sas.com/",
    position: "Software Engineer II",
    time: "Apr 2026 – Present",
    location: "",
    description: "🌐 Localization l10n - i18n",
    tech: [],
  },
  {
    title: "Coalition Inc",
    link: "https://www.youtube.com/watch?v=c27e3yi2g9E&ab_channel=Coalition%2CInc",
    position: "Software Engineer II",
    time: "Jun 2022 – April 2026",
    location: "",
    description:
      "• Reduced insurance quote generation latency by 58% by architecting a new internationalized (i18n) intake form using React, React Hook Form, and TanStack Query for real-time data synchronization.\n\n" +
      "• Accelerated underwriting cycle time by 20% through the development of a data-intensive CRM workbench, utilizing D3.js for complex risk visualizations and Golang for backend data aggregation.\n\n" +
      "• Cut manual translation costs and approval times by 40% by engineering an automated LLM-powered localization pipeline using Python, GitHub Actions, OpenAI.\n\n" +
      "• Eliminated technical debt associated with stale feature flags by building an autonomous AI coding agent leveraging OpenAI Codex, automatically identifying and removing legacy code paths.\n\n" +
      "• Standardized data contracts across the organization by engineering a TypeScript types generator based on OpenAPI schemas, reducing type-related bugs and accelerating feature delivery.\n\n" +
      "• Engineered full-stack solutions for multiple high-value projects, translating design system requirements into scalable code. Key deliverables included a renewals dashboard, infrastructure for new insurance coverages, and technical support for a new country launch.",
    tech: [
      "React",
      "React Hook Form",
      "TanStack Query",
      "D3.js",
      "Golang",
      "Python",
      "GitHub Actions",
      "OpenAI",
      "TypeScript",
      "OpenAPI",
    ],
  },
  {
    title: "Pixie",
    position: "Frontend Engineer",
    time: "Mar 2021 – Jun 2022",
    location: "",
    description:
      "• Scaled frontend architecture to support user growth from 0 to 50k users for a core MVP product, delivering critical features including real-time video calling (WebRTC), chat (WebSocket), and scheduling.\n\n" +
      "• Reduced new feature development time by 30% by architecting a reusable React UI design system with Storybook, ensuring compliance with WCAG 2.1 accessibility standards.\n\n" +
      "• Improved marketing site performance and SEO rankings by migrating to Next.js for server-side rendering (SSR) and integrating Contentful CMS for dynamic content management.\n\n" +
      "• Optimized user experience and debugging velocity by integrating Sentry and FullStory, creating a feedback loop that identified and resolved top user friction points.",
    tech: [
      "React",
      "Next.js",
      "Redux",
      "TypeScript",
      "JavaScript",
      "WebSocket",
      "Webpack",
      "GraphQL",
      "Tailwind CSS",
      "Google Cloud",
      "Ant Design",
      "Figma",
    ],
  },
  {
    title: "Vinbrain",
    link: "https://www.linkedin.com/company/vinbrain/",
    position: "Software Engineer",
    time: "Nov 2020 – Feb 2021",
    location: "",
    description:
      "• Delivered a secure, HIPAA-compliant telehealth dashboard (\"Dr. Aid\"), implementing real-time video consultations using React, Redux, and WebRTC.\n\n" +
      "• Engineered a patient records management system using Node.js and MongoDB, ensuring secure data handling and high availability for medical professionals.",
    tech: ["React", "Redux", "TypeScript", "Node.js", "MongoDB", "Docker", "Git"],
  },
  {
    title: "Facebook Developer Circle",
    position: "Teaching Assistant",
    time: "May 2020 – Sep 2020",
    location: "",
    description:
      "Teaching React Native for the mobile development course, reviewing code and guiding final capstone projects to completion.",
    tech: ["React Native"],
  },
];


export const SKILLS_AT_WORK = ["JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "React", "Next.js", "Vue.js", "Redux", "Node.js", "Express", "Postgres", "MongoDB", "Firebase", "GitHub"];
export const SKILLS_FOR_FUN = ["React Native", "Gatsby", "Chakra UI", "Figma", "Planetscale", "GraphQL", "Supabase", "Vercel", "D3.js", "Python"];

export const HERO_LINE =
  "Building things for the web. Specializing in performance, design systems, and full-stack engineering.";
export const TAGLINE = "Baymax Engineer, I'll do everything that interesting and challenging.";
export const TICKER = ["Software Engineer", "Full Stack", "Web Performance", "Design Systems", "React", "Golang", "Open Source"];
