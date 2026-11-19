"use client";

import { LottieSvg } from "lottie-react";
import catReading from "../../../public/blog-images/cat-reading.json";

export default function LottieAnimation() {
  return (
    <div className="flex justify-start w-full">
      <LottieSvg
        src={catReading}
        autoplay
        loop
        className="w-[300px] h-[300px] rounded-2xl"
      />
    </div>
  );
}
