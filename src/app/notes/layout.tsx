import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "Personal notes, thoughts, and ideas on a virtual sticky board.",
};

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
