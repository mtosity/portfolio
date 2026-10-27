import type { Metadata } from "next";
import pkg from "@mtosity/design-system/package.json";
import { DesignSystemShowcase } from "./DesignSystemShowcase";
import "./ds.css";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Living reference for @mtosity/design-system — the world, colour roles, type, space, motion and every component, live.",
};

export default function DesignSystemPage() {
  return (
    <DesignSystemShowcase version={pkg.version} name={pkg.name} />
  );
}
