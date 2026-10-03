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
    const media = window.matchMedia("(min-width: 1536px)");
    const targets = items.map((item) => ({
      ...item,
      element: document.getElementById(item.id),
    }));
    let headerHeight = 82;
    function measureHeader() {
      headerHeight =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 0;
    }

    const updateActive = () => {
      const viewportMarker =
        headerHeight + (window.innerHeight - headerHeight) * 0.5;

      const currentSection = targets.reduce(
        (current, item) => {
          const target = item.element;
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
      if (!media.matches || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActive();
      });
    };

    const resize = () => {
      measureHeader();
      scheduleUpdate();
    };
    measureHeader();
    if (media.matches) updateActive();
    media.addEventListener("change", resize);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", resize);
    };
  }, []);

  function handleClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: (typeof items)[number],
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = document.getElementById(item.id);
    if (!target) return;
    event.preventDefault();
    setActive(item.id);
    window.history.pushState(null, "", item.href);
    target.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <aside className="section-rail" aria-label="Section navigation">
      <nav>
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="rail-link"
            aria-current={active === item.id ? "location" : undefined}
            aria-label={`Go to ${item.label}`}
            onClick={(event) => handleClick(event, item)}
          >
            <span className="rail-label">{item.label}</span>
            <span className="rail-number">
              {String(index).padStart(2, "0")}
            </span>
            <span className="rail-tick" aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
