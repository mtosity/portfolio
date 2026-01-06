/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    confetti: any;
  }
}

export const SlideTabs = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });
  const router = useRouter();

  const openNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      style={{ fontFamily: 'var(--font-heading)' }}
      className="relative mx-auto flex flex-wrap justify-center gap-1 w-full max-w-3xl rounded-lg border-2 border-white bg-zinc-800 p-1 sm:gap-0"
    >
      <Tab setPosition={setPosition} onClick={() => navigateToPage("/")}>
        Who am I?
      </Tab>
      <Tab
        setPosition={setPosition}
        onClick={() => navigateToPage("/photography")}
      >
        See My Photos
      </Tab>
      <Tab
        setPosition={setPosition}
        onClick={() => openNewTab("https://www.linkedin.com/in/mtosity/")}
      >
        Say Hi ~! ↗
      </Tab>
      <Tab setPosition={setPosition} onClick={() => navigateToPage("/blog")}>
        See My Writings
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

        const { width, height } = ref.current.getBoundingClientRect();
        const parent = ref.current.offsetParent;

        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const elementRect = ref.current.getBoundingClientRect();

          setPosition({
            left: elementRect.left - parentRect.left,
            top: elementRect.top - parentRect.top,
            width,
            height,
            opacity: 1,
          });
        }
      }}
      className="relative z-10 block cursor-pointer px-2 py-1.5 text-xs text-white mix-blend-difference sm:px-3 md:px-5 md:py-3 md:text-base"
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
      style={{
        height: position.height,
      }}
      className="absolute z-0 rounded-lg bg-black"
    />
  );
};

type Position = {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
};
