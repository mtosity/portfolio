/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./dotgrid.module.scss";
import { animate, stagger } from "animejs";

export const DotGrid = () => {
  const GRID_WIDTH = 25;
  const GRID_HEIGHT = 20;

  const dots = [];

  const handleDotClick = (e: any) => {
    animate(".dot-point", {
      scale: [
        { value: 1.35, ease: "outSine", duration: 250 },
        { value: 1, ease: "inOutQuad", duration: 500 },
      ],
      translateY: [
        { value: -15, ease: "outSine", duration: 250 },
        { value: 1, ease: "inOutQuad", duration: 500 },
      ],
      opacity: [
        { value: 0.7, ease: "outSine", duration: 250 },
        { value: 0.35, ease: "inOutQuad", duration: 500 },
      ],
      delay: stagger(100, {
        grid: [GRID_WIDTH, GRID_HEIGHT],
        from: e.target.dataset.index,
      }),
    });
  };

  let index = 0;

  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      dots.push(
        <div
          onClick={handleDotClick}
          className={styles.dotWrapper}
          data-index={index}
          key={`${i}-${j}`}
        >
          <div className={`${styles.dot} dot-point`} data-index={index} />
        </div>
      );
      index++;
    }
  }

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}
      className={styles.dotGrid}
    >
      {dots.map((dot) => dot)}
    </div>
  );
};
