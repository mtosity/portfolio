// Minimal styled-jsx augmentation so `<style jsx global>` typechecks without
// depending on styled-jsx directly (Next.js applies the transform at build).
import "react";

declare module "react" {
  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
