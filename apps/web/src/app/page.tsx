"use client";
import { SlideTabs } from "@/components/SlideTabs";
import { Hero } from "@/components/Hero";
import { About } from "@/components/template/home/about/About";
import { Experience } from "@/components/template/home/experience/Experience";
import { Projects } from "@/components/template/home/projects/Projects";
import styles from "../components/template/home/home.module.scss";
import { Contact } from "@/components/template/home/contact/Contact";

export default function Home() {
  return (
    <div className="relative">
      <SlideTabs />
      <Hero />
      <div className="flex flex-col items-center px-0">
        <div className={styles.home}>
          <About />
          <Experience />
          <Projects />
          <Contact />
        </div>
      </div>
    </div>
  );
}
