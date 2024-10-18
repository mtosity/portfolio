import { MTosity } from "@/components/mtosity";
import { SlideTabs } from "@/components/SlideTabs";
import { About } from "@/components/template/home/about/About";
// import { Contact } from "@/components/template/home/contact/Contact";
import { Experience } from "@/components/template/home/experience/Experience";
// import { Hero } from "@/components/template/home/hero/Hero";
import { Projects } from "@/components/template/home/projects/Projects";
// import { Heading } from "@/components/template/nav/Heading";
import styles from "../components/template/home/home.module.scss";

export default function Home() {
  return (
    <div className="relative">
      <div className="sticky top-4 bg-transparent z-10">
        <SlideTabs />
      </div>
      <MTosity />

      <div className="flex flex-col items-center px-4 ">
        <div className={styles.home}>
          {/* <Heading />
      <Hero /> */}
          <About />
          <Projects />
          <Experience />
          {/* <Contact /> */}
          {/* <div
            style={{
              height: "200px",
              background:
                "linear-gradient(180deg, var(--background), var(--background-dark))",
            }}
          /> */}
        </div>
      </div>
    </div>
  );
}
