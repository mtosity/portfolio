// Shared ambient declarations for CSS/SCSS modules, used by packages whose
// sources are typechecked outside the Next.js app (which gets these from
// next-env.d.ts).
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.css";
declare module "*.scss";
