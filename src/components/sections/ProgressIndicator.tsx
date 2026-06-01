"use client";

import Link from "next/link";
import { type MouseEvent, useEffect, useState } from "react";

const items = [
  { id: "hero", href: "#hero", title: "Hero" },
  { id: "signature", href: "#signature", title: "Signature" },
  { id: "work", href: "#work", title: "Work" },
  { id: "process", href: "#process", title: "Process" },
  { id: "capabilities", href: "#capabilities", title: "Capabilities" },
  { id: "about", href: "#about", title: "About" },
  { id: "contact", href: "#contact", title: "Contact" },
];

const SECTION_ACTIVATION_OFFSET = 96;

export function ProgressIndicator() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    let frame = 0;

    const updateActive = () => {
      const currentSection = items.reduce(
        (current, item) => {
          const target = document.getElementById(item.id);
          if (!target) return current;

          const score =
            target.offsetTop <= window.scrollY + SECTION_ACTIVATION_OFFSET
              ? target.offsetTop
              : Number.NEGATIVE_INFINITY;

          return score > current.score ? { id: item.id, score } : current;
        },
        { id: "hero", score: -1 },
      );

      setActive((current) =>
        current === currentSection.id ? current : currentSection.id,
      );
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActive();
      });
    };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  function handleClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: (typeof items)[number],
  ) {
    const target = document.getElementById(item.id);
    if (!target) return;

    event.preventDefault();
    setActive(item.id);
    window.history.pushState(null, "", item.href);
    window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  }

  return (
    <aside
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-label="Section progress"
    >
      <nav className="grid gap-2 rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[#080C11]/88 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md">
        {items.map((item, index) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`grid h-10 w-12 place-items-center rounded-[6px] border text-[12px] font-semibold tabular-nums leading-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C11] ${
                isActive
                  ? "border-[rgba(201,169,110,0.82)] bg-[rgba(201,169,110,0.16)] text-[var(--color-gold-light)]"
                  : "border-transparent text-[var(--color-muted)] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text)]"
              }`}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Go to ${item.title}`}
              onClick={(event) => handleClick(event, item)}
            >
              {String(index + 1).padStart(2, "0")}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
