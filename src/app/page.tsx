"use client";
import dynamic from "next/dynamic";
import { SlideTabs } from "@/components/SlideTabs";
import { About } from "@/components/template/home/about/About";
import { Experience } from "@/components/template/home/experience/Experience";
import { Projects } from "@/components/template/home/projects/Projects";
import styles from "../components/template/home/home.module.scss";
import { Contact } from "@/components/template/home/contact/Contact";

// Dynamic import to prevent SSR issues with MTosity component
const MTosity = dynamic(
  () =>
    import("@/components/mtosity").then((mod) => ({ default: mod.MTosity })),
  {
    ssr: false,
    loading: () => <div className="w-screen h-screen bg-transparent" />,
  }
);

export default function Home() {
  return (
    <div className="relative">
      <div className="sticky top-4 bg-transparent z-10">
        <SlideTabs />
      </div>
      <MTosity />

      <div className="flex flex-col items-center px-4 py-40">
        <div className={styles.home}>
          <About />
          <Projects />
          <Experience />
          <Contact />
        </div>
      </div>
    </div>
  );
}
