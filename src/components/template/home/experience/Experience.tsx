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
    position: "Software Engineer II",
    time: "Jun 2022 - Present",
    location: "Remote - US",
    description:
      "• Spearheaded reusable, internationalized insurance form with real-time data synchronization using React, react-hook-form, tanstack, and i18n libraries, enabled customers to generate quotes faster by 60%.\n\n" +
      "• Engineered an LLM powered translation pipeline leveraging GitHub Actions, Python, and API integrations; automated approval checkpoints to streamline localization, cutting manual effort and improving content accuracy and turnaround speed.\n\n" +
      "• Engineered a React and D3.js powered actuarial pricing calculator UI, integrating with backend APIs to deliver pricing calculations, data visualizations, and quote comparisons for improved decision-making for underwriters.\n\n" +
      "• Built data intensive CRM underwriting workbench using D3.js, Material UI, Golang, help centralize data and drive efficiency gains by reducing underwriting cycle time by 20%.\n\n" +
      "• Engineered a TypeScript type generator leveraging OpenAPI YAML schemas, streamlining API integration, standardizing data contracts, and accelerating front-end feature development.\n\n" +
      "• Implemented Datadog RUM in the frontend codebase (React/TypeScript), providing engineers with real-time session insights and end-to-end request tracing, which reduced debugging time and improved incident resolution speed.",
    tech: [
      "React",
      "TypeScript",
      "JavaScript",
      "Next.js",
      "Redux",
      "GraphQL",
      "AWS",
      "Cypress",
      "Datadog",
      "CI/CD",
      "Material UI",
      "BluePrintJS",
      "React Testing Library",
      "Recoil",
    ],
  },
  {
    title: "Pixie",
    position: "Lead Front end Engineer",
    time: "Mar 2021 - Jun 2022",
    location: "",
    description:
      "• Delivered a reusable React UI design system with TypeScript and Storybook, implementing WCAG accessibility standards to ensure consistent, maintainable, and inclusive user interfaces.\n\n" +
      "• Built core product features including authentication, video calling, real-time chat, scheduling calendar, and ratings using React, Go, WebRTC, and WebSocket; ensured seamless integration and scalability, 0-50k users.\n\n" +
      "• Developed company marketing websites using Next.js server-side rendering, and integrated Contentful CMS, enabling dynamic content management and reducing developer dependencies.\n\n" +
      "• Integrated Google Analytics, Sentry, and FullStory into the React frontend, enabling comprehensive user behavior tracking, error monitoring, and session replay to streamline debugging and product analysis.",
    tech: ["React", "Next.js", "Redux", "TypeScript", "JavaScript", "WebSocket", "Webpack", "GraphQL", "Tailwind CSS", "Google Cloud", "Ant Design", "Figma"],
  },
  {
    title: "Vinbrain",
    position: "Frontend Engineer",
    time: "Nov 2020 - Feb 2021",
    location: "",
    description:
      "Built video call functionality and patient record management features for Dr. Aid, a secure telehealth dashboard, leveraging React, WebRTC, and Node.js to support HIPAA-compliant video consultations.",
    tech: ["React", "Redux", "TypeScript", "Node.js", "Git"],
  },
  {
    title: "Designveloper",
    position: "Full Stack Software Engineer",
    time: "Jun 2020 - Nov 2020",
    location: "",
    description:
      "• Developed a solar industry dashboard for project and order management using React, Redux for state management, Node.js and MongoDB.\n\n" +
      "• Upgraded React versions across multiple projects, refactoring codebases to use newer patterns such as hooks, context API, and server side rendering.",
    tech: ["React", "Node.js", "Redux", "TypeScript", "Jest", "Webpack", "Docker", "MongoDB"],
  },
  {
    title: "Developer Circles from Facebook",
    position: "Mobile Development Teaching Assistant",
    time: "May 2020 - Sep 2020",
    location: "",
    description:
      "Teach React Native and Node.js to students, help them with their projects, and review their code.",
    tech: ["React Native", "Nodejs", "MongoDB"],
  },
];
