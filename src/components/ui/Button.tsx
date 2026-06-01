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
    variant === "primary"
      ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[#0A0F14] hover:bg-[var(--color-gold-light)]"
      : "border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:border-[var(--color-gold)] hover:bg-[var(--color-hover)]";

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 cursor-pointer items-center justify-center border px-6 text-sm font-semibold transition-colors duration-200 ${styles} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
