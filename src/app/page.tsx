import { MTosity } from "@/components/mtosity";
import { SlideTabs } from "@/components/SlideTabs";

export default function Home() {
  return (
    <>
      <MTosity />
      <div className="pb-20">
        <SlideTabs />
      </div>
    </>
  );
}
