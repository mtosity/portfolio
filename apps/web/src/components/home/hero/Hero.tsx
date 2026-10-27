"use client";
import { Button } from "@mtosity/design-system";
import { HERO_LINE } from "../data";

export interface HeroPhoto {
  id: string;
  src: string;
}

/* Neutral first screen: the name, what I do, how to reach me. Each visual
   world replaces this with its own scene. */
export const Hero = (_props: { photos: HeroPhoto[] }) => (
  <section className="hero hero-plain" aria-labelledby="hero-title">
    <div className="hero-copy frame">
      <h1 id="hero-title" className="hero-title display">
        Minh Tam
        <br />
        Nguyen
      </h1>
      <p className="hero-line">{HERO_LINE}</p>
      <div className="hero-actions">
        <Button href="mailto:mtosity@gmail.com">Get in touch</Button>
        <Button href="#work" variant="quiet">
          See the work
        </Button>
      </div>
    </div>
    <p className="hero-caption">Software Engineer · United States</p>
  </section>
);
