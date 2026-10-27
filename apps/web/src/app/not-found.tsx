import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav, SiteFooter, Button } from "@mtosity/design-system";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="frame lost">
        <div className="lost-portrait">
          <Image src="/mt.png" alt="" width={240} height={300} />
        </div>
        <div>
          <h1 className="display lost-title">Nothing lives here.</h1>
          <p className="lost-line">
            The link might be old, or I moved things around. Either way, sorry about that.
          </p>
          <div className="lost-actions">
            <Button href="/">Go home</Button>
            <Button href="/blog" variant="quiet">
              Read something instead
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
