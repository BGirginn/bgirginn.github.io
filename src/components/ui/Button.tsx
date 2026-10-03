"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary" ? "hud-button-primary" : "hud-button-secondary";

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !href.startsWith("#")
    )
      return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }

  return (
    <Link
      href={href}
      className={`hud-button ${styles} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
