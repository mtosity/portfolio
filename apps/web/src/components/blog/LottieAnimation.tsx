"use client";

import Lottie from "lottie-react";
import catReading from "../../../public/blog-images/cat-reading.json";

export default function LottieAnimation() {
  return (
    <div className="flex justify-start w-full">
      <Lottie
        animationData={catReading}
        loop
        className="w-[300px] h-[300px] rounded-2xl"
      />
    </div>
  );
}
