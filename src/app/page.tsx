import { MTosity } from "@/components/mtosity";
import { SlideTabs } from "@/components/SlideTabs";
import { About } from "@/components/template/home/about/About";
// import { Contact } from "@/components/template/home/contact/Contact";
import { Experience } from "@/components/template/home/experience/Experience";
// import { Hero } from "@/components/template/home/hero/Hero";
import { Projects } from "@/components/template/home/projects/Projects";
// import { Heading } from "@/components/template/nav/Heading";
import styles from "../components/template/home/home.module.scss";
import { Contact } from "@/components/template/home/contact/Contact";

export default function Home() {
  return (
    <div className="relative">
      <div className="sticky top-4 bg-transparent z-10">
        <SlideTabs />
      </div>
      <MTosity />

      <div className="flex flex-col items-center px-4 py-40 ">
        <div className={styles.home}>
          {/* <Heading />
      <Hero /> */}
          <About />
          <Projects />
          <Experience />
          <Contact />
        </div>
      </div>
    </div>
  );
}
