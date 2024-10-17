/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    confetti: any;
  }
}

export const SlideTabs = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const openNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-lg border-2 border-white bg-zinc-800 p-1"
    >
      <Tab
        setPosition={setPosition}
        onClick={() => openNewTab("https://www.linkedin.com/in/mtosity/")}
      >
        Hire Me!
      </Tab>
      <Tab
        setPosition={setPosition}
        onClick={() => openNewTab("https://blog.mtosity.com/")}
      >
        My Blog
      </Tab>
      <Tab setPosition={setPosition}>Confetti! ٩(◕‿◕)۶</Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
  onClick,
}: {
  children: string;
  setPosition: Dispatch<SetStateAction<Position>>;
  onClick?: () => void;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer-s px-3 py-1.5 text-xs text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
      onClick={() => {
        onClick?.();
        if (window.confetti) {
          window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-lg bg-black md:h-12"
    />
  );
};

type Position = {
  left: number;
  width: number;
  opacity: number;
};
