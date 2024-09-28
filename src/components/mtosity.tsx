"use client";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import mtImg from "./mt.png";
import WaveJson from "./wave.json";
import { Player } from "@lottiefiles/react-lottie-player";
import Image from "next/image";
import { Tektur } from "next/font/google";

const tektur = Tektur({ subsets: ["latin"] });

const DURATION = 0.6;
const STAGGER = 0.05;
const DELAY_DEFAULT = 0.6;

enum Stage {
  INITIAL,
  EXPAND,
}

export const MTosity = () => {
  const targetRef = useRef(null);
  const letterRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(0);

  const [stage, setStage] = useState<Stage>();
  useLayoutEffect(() => {
    const updateSize = () => {
      if (!letterRef.current) return;
      const size = window
        .getComputedStyle(letterRef.current, null)
        .getPropertyValue("font-size");
      setFontSize(parseFloat(size));
    };

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [letterRef]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.05) {
      setStage(Stage.EXPAND);
    } else {
      setStage(Stage.INITIAL);
    }
  });

  const config = useMemo(() => {
    return [
      {
        letter: "M",
        children: {
          letter: "inh",
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: stage === Stage.EXPAND ? 1 : 0,
          },
        },
        initial: {
          y: fontSize * 4,
          x: fontSize * 4,
          opacity: 0,
        },
        animate: {
          y: stage === Stage.EXPAND ? -(fontSize * 2) : 0,
          x: stage === Stage.EXPAND ? fontSize * 3 : fontSize * 3.7,
          opacity: 1,
        },
        transition: {
          duration: stage === Stage.EXPAND ? DURATION / 1 : DURATION,
          delay: stage === undefined ? STAGGER * 0 + DELAY_DEFAULT : 0,
        },
      },
      {
        letter: "T",
        children: {
          letter: "âm",
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: stage === Stage.EXPAND ? 1 : 0,
          },
        },
        initial: {
          y: 100,
          opacity: 0,
        },
        animate: {
          y: stage === Stage.EXPAND ? -(fontSize * 1) : 0,
          x: stage === Stage.EXPAND ? fontSize * 1 : fontSize * 1.8,
          opacity: 1,
          scale: 1,
        },
        transition: {
          duration: stage === Stage.EXPAND ? DURATION / 1 : DURATION,
          delay: stage === undefined ? STAGGER * 1 + DELAY_DEFAULT : 0,
        },
      },
      {
        letter: "O",
        initial: {
          y: 100,
          opacity: 0,
        },
        animate: {
          y: 0,
          opacity: 1,
          x: stage === Stage.EXPAND ? 0 : 0,
        },
        transition: {
          duration: stage === Stage.EXPAND ? DURATION / 1 : DURATION,
          delay: stage === undefined ? STAGGER * 2 + DELAY_DEFAULT : 0,
        },
      },
      {
        letter: "S",
        initial: {
          y: 100,
          opacity: 0,
        },
        animate: {
          y: 0,
          x: stage === Stage.EXPAND ? 0 : 0,
          opacity: 1,
        },
        transition: {
          duration: stage === Stage.EXPAND ? DURATION / 1 : DURATION,
          delay: stage === undefined ? STAGGER * 3 + DELAY_DEFAULT : 0,
        },
        children: {
          letter: "-",
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: stage === Stage.EXPAND ? 1 : 0,
          },
        },
      },
      {
        letter: "I",
        initial: {
          y: 100,
          opacity: 0,
        },
        animate: {
          y: 0,
          x: stage === Stage.EXPAND ? -(fontSize * 0.1) : -(fontSize * 0.5),
          opacity: 1,
        },
        transition: {
          duration: stage === Stage.EXPAND ? DURATION / 1 : DURATION,
          delay: stage === undefined ? STAGGER * 4 + DELAY_DEFAULT : 0,
        },
      },
      {
        letter: "T",
        initial: {
          y: 100,
          opacity: 0,
        },
        animate: {
          y: 0,
          x: stage === Stage.EXPAND ? -(fontSize * 0.2) : -(fontSize * 0.5),
          opacity: 1,
        },
        transition: {
          duration: stage === Stage.EXPAND ? DURATION / 1 : DURATION,
          delay: stage === undefined ? STAGGER * 5 + DELAY_DEFAULT : 0,
        },
      },
      {
        letter: "Y",
        leftChildren: {
          letter: "NGU",
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: stage === Stage.EXPAND ? 1 : 0,
          },
        },
        children: {
          letter: "ỄN",
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: stage === Stage.EXPAND ? 1 : 0,
          },
        },
        initial: {
          y: 100,
          opacity: 0,
        },
        animate: {
          y: stage === Stage.EXPAND ? -fontSize * 1.2 : 0,
          x: stage === Stage.EXPAND ? -(fontSize * 2.2) : -(fontSize * 2.8),
          opacity: 1,
          scale: stage === Stage.EXPAND ? 0.8 : 1,
        },
        transition: {
          duration: stage === Stage.EXPAND ? DURATION / 1 : DURATION,
          delay: stage === undefined ? STAGGER * 6 + DELAY_DEFAULT : 0,
        },
      },
    ];
  }, [stage, fontSize]);

  return (
    <section
      ref={targetRef}
      className={`block gap-2 bg-zinc-950 text-white
    text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl
      ${tektur.className}
    `}
      style={{
        height: "300vh",
      }}
    >
      <div className="sticky top-1/3 tracking-widest text-center text-nowrap overflow-x-clip h-screen">
        <motion.p className="z-0">
          {config.map((item, idx) => (
            <motion.span
              key={`mtosity-${item.letter}-${idx}`}
              initial={item.initial}
              animate={item.animate}
              transition={item.transition}
              className="inline-block"
              layout="position"
            >
              {item.leftChildren ? (
                <motion.span
                  initial={item.leftChildren.initial}
                  animate={item.leftChildren.animate}
                  transition={item.transition}
                  className="inline-block"
                >
                  {item.leftChildren.letter}
                </motion.span>
              ) : null}
              <span
                className="text-lime-300"
                ref={item.letter === "S" ? letterRef : null}
              >
                {item.letter}
              </span>
              {item.children ? (
                <motion.span
                  initial={item.children.initial}
                  animate={item.children.animate}
                  transition={item.transition}
                  className="inline-block"
                >
                  {item.children.letter}
                </motion.span>
              ) : null}
            </motion.span>
          ))}
        </motion.p>
        <div className="flex justify-center">
          <motion.div
            className="-z-10"
            initial={{
              scale: 0,
              opacity: 0,
              // x: fontSize * 6,
            }}
            animate={
              stage === Stage.EXPAND
                ? {
                    // x: -fontSize * 1,
                    // y: -128 * 5 + fontSize * 1,
                    scale: 0.6,
                    opacity: 0.8,
                  }
                : undefined
            }
            transition={{
              delay: stage === Stage.EXPAND ? DELAY_DEFAULT : undefined,
            }}
          >
            <Image src={mtImg} alt="mt" />
            <Player
              autoplay
              loop
              src={WaveJson}
              style={{ height: "300px", width: "300px" }}
              className="absolute top-0 left-80"
            />
          </motion.div>
        </div>
        <div
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
          className="fixed inset-0 opacity-20"
        />
      </div>
    </section>
  );
};
