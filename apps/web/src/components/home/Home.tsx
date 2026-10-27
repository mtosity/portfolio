"use client";
import { SiteNav, SiteFooter } from "@mtosity/design-system";
import { Hero, type HeroPhoto } from "./hero/Hero";
import { About } from "./About";
import { Work } from "./Work";
import { Experience } from "./Experience";
import { Contact } from "./Contact";

export const Home = ({ photos }: { photos: HeroPhoto[] }) => (
  <>
    <SiteNav overlay />
    <main id="main" className="home">
      <Hero photos={photos} />
      <About />
      <Work />
      <Experience />
      <Contact />
    </main>
    <SiteFooter />
  </>
);
