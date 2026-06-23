import type { Metadata } from "next";
import pkg from "@mtosity/design-system/package.json";
import { DesignSystemShowcase } from "./DesignSystemShowcase";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Living reference for @mtosity/design-system — tokens, colors, typography, shadows, and components in the neo-brutalist warm-cream + lime aesthetic.",
};

export default function DesignSystemPage() {
  return (
    <DesignSystemShowcase version={pkg.version} name={pkg.name} />
  );
}
