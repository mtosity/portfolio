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
    position: "Software Engineer (Front end Web)",
    time: "Jun 2022 - Present",
    location: "Remote - US",
    description:
      "Build international quoting platform for brokers and internal users. Engineered an AI LLM powered translation pipeline leveraging GitHub Actions, Python, and API integrations, React and D3.js powered actuarial pricing calculator",
    tech: ["Next JS", "React", "Postgres", "Python", "Datadog"],
  },
  {
    title: "Pixie",
    position: "Lead Front end Engineer",
    time: "Feb 2021 - Jun 2022",
    location: "",
    description:
      "Lead the front end efforts for gotpixie.com; I was responsible for the front end architecture, code quality, and performance, with other 3 engineers built the front end from scratch. Built core product features including authentication, video calling, real-time chat, scheduling calendar, and ratings using React, Go, WebRTC, and WebSocket; ensured seamless integration and scalability.",
    tech: ["Next JS", "React", "Google Cloud APIs"],
  },
  {
    title: "Vinbrain",
    position: "Frontend Engineer",
    time: "Sept 2020 - Feb 2021",
    location: "",
    description:
      "Developed a solar industry dashboard for project and order management. Upgraded React versions across multiple projects, refactoring codebases to use newer patterns such as hooks, context API, and Redux for state management.",
    tech: ["React", "Nodejs", "MongoDB", "Meteor JS"],
  },
  {
    title: "Designveloper",
    position: "Fullstack Engineer",
    time: "Jul 2020 - Sept 2020",
    location: "",
    description:
      "Built video call functionality and patient record management features for Dr. Aid, a secure telehealth dashboard, leveraging React, WebRTC, and Node.js to support HIPAA-compliant video consultations.",
    tech: ["React", "Nodejs", "MongoDB", "Meteor JS"],
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
