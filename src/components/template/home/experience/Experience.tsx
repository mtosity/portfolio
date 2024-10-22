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
      "Build stuff for brokers and customers. Collaborated with many stakeholders and teams to deliver high-quality software, and ensuring business logics are in place.",
    tech: ["Next JS", "React", "Postgres", "Python", "Datadog"],
  },
  {
    title: "Pixie",
    position: "Lead Front end Engineer",
    time: "Feb 2021 - Jun 2022",
    location: "",
    description:
      "Lead the front end efforts for gotpixie.com; I was responsible for the front end architecture, code quality, and performance, with other 3 engineers built the front end from scratch.",
    tech: ["Next JS", "React", "Google Cloud APIs"],
  },
  {
    title: "Designveloper",
    position: "Fullstack Engineer",
    time: "Jul 2020 - Feb 2021",
    location: "",
    description:
      "Designed and developed dynamic web applications with React and Node.js, focusing on delivering high-performance UIs for enterprise clients.",
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
