"use client";
import { SectionHeader } from "../../utils/SectionHeader";
import { ExperienceItem } from "./ExperienceItem";

export const Experience = () => {
  return (
    <section className="section-wrapper" id="experience">
      <SectionHeader title="Experience" dir="l" />
      {experience.map((item) => (
        <ExperienceItem key={item.title} {...item} />
      ))}
    </section>
  );
};

const experience = [
  {
    title: "Coalition Inc",
    link: "https://www.youtube.com/watch?v=c27e3yi2g9E&ab_channel=Coalition%2CInc",
    position: "Software Engineer II",
    time: "Jun 2022 - Present",
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
    time: "Mar 2021 - Jun 2022",
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
    time: "Nov 2020 - Feb 2021",
    location: "",
    description:
      "• Delivered a secure, HIPAA-compliant telehealth dashboard (\"Dr. Aid\"), implementing real-time video consultations using React, Redux, and WebRTC.\n\n" +
      "• Engineered a patient records management system using Node.js and MongoDB, ensuring secure data handling and high availability for medical professionals.",
    tech: ["React", "Redux", "TypeScript", "Node.js", "MongoDB", "Docker", "Git"],
  },
  {
    title: "Facebook Developer Circle",
    position: "Teaching Assistant",
    time: "May 2020 - Sep 2020",
    location: "",
    description:
      "Teaching React Native for the mobile development course, reviewing code and guiding final capstone projects to completion.",
    tech: ["React Native"],
  },
];
