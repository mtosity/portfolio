import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography",
  description: "Photography gallery and visual diary by MTosity.",
};

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
