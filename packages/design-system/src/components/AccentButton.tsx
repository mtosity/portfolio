"use client";
import React from "react";
import { Button } from "./Button";

/* v0 API, kept for the tools and admin: the page's primary action.
   Now a thin wrapper over <Button variant="accent">. `shadow` is accepted
   and ignored — things at rest no longer cast shadows. */
export const AccentButton = ({
  children,
  href,
  onClick,
  disabled = false,
  style,
  type,
  title,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  shadow?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit";
  title?: string;
}) =>
  href && !disabled ? (
    <Button href={href} style={style} title={title}>
      {children}
    </Button>
  ) : (
    <Button onClick={onClick} disabled={disabled} type={type} style={style} title={title}>
      {children}
    </Button>
  );
