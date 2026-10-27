"use client";
import React from "react";
import Link from "next/link";

export type ButtonVariant = "accent" | "ink" | "quiet";

type Common = {
  variant?: ButtonVariant;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  title?: string;
};

/* The one button. `accent` is the page's single primary action, `ink`
   a strong secondary, `quiet` everything else. Renders a Next Link when
   given `href`. Styles live in system.css (.ds-button). */
export const Button = ({
  variant = "accent",
  className,
  href,
  disabled,
  ...rest
}: Common &
  (
    | ({ href: string; disabled?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
    | ({ href?: undefined; disabled?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  )) => {
  const cls = [
    "ds-button",
    variant !== "accent" ? `ds-button-${variant}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    const external = /^(https?:|mailto:)/.test(href);
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return external ? (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" {...anchorProps} />
    ) : (
      <Link href={href} className={cls} {...anchorProps} />
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type="button" className={cls} disabled={disabled} {...buttonProps} />;
};
