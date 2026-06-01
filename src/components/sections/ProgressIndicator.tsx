"use client";

import Link from "next/link";
import { type MouseEvent, useEffect, useState } from "react";
import { siteContent } from "@/content/site";

const items = [{ label: "Home", href: "#hero" }, ...siteContent.nav].map(
  (item) => ({
    ...item,
    id: item.href.replace("#", ""),
  }),
);

export function ProgressIndicator() {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    let frame = 0;

    const updateActive = () => {
      const headerHeight =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 0;
      const viewportMarker =
        headerHeight + (window.innerHeight - headerHeight) * 0.5;

      const currentSection = items.reduce(
        (current, item) => {
          const target = document.getElementById(item.id);
          if (!target) return current;

          const rect = target.getBoundingClientRect();
          const markerInside =
            rect.top <= viewportMarker && rect.bottom > viewportMarker;
          const distance = markerInside
            ? 0
            : Math.min(
                Math.abs(rect.top - viewportMarker),
                Math.abs(rect.bottom - viewportMarker),
              );

          return distance < current.distance
            ? { id: item.id, distance }
            : current;
        },
        { id: items[0]?.id ?? null, distance: Number.POSITIVE_INFINITY },
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
      className="fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 2xl:block"
      aria-label="Primary navigation"
    >
      <nav className="flex w-[196px] flex-col items-end gap-3">
        {items.map((item, index) => {
          const isActive = active === item.id;
          const sectionNumber = String(index + 1).padStart(2, "0");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex h-10 w-[58px] items-center justify-end gap-3 overflow-hidden rounded-full px-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.12em] transition-[width,background-color,color,box-shadow] duration-300 ease-out hover:w-[196px] hover:bg-[#080C11]/82 hover:shadow-[0_16px_48px_rgba(0,0,0,0.24)] focus-visible:w-[196px] focus-visible:bg-[#080C11]/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#080C11] ${
                isActive
                  ? "text-[var(--color-gold-light)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Go to ${item.label}`}
              onClick={(event) => handleClick(event, item)}
            >
              <span className="min-w-0 flex-1 translate-x-3 truncate text-right opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                {item.label}
              </span>
              <span className="w-6 shrink-0 text-right tabular-nums">
                {sectionNumber}
              </span>
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full transition-[background-color,box-shadow,transform] duration-300 group-hover:scale-125 group-focus-visible:scale-125 ${
                  isActive
                    ? "bg-[var(--color-gold)] shadow-[0_0_18px_rgba(201,169,110,0.7)]"
                    : "bg-[rgba(255,255,255,0.28)] group-hover:bg-[var(--color-gold)] group-focus-visible:bg-[var(--color-gold)]"
                }`}
                aria-hidden="true"
              />
              <span className="sr-only">Section {sectionNumber}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
