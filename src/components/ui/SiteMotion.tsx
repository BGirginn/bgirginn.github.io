"use client";

import { useEffect } from "react";

export function SiteMotion() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    let observer: IntersectionObserver | undefined;

    function configure() {
      observer?.disconnect();
      targets.forEach((target) => target.classList.remove("reveal-pending"));
      if (media.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.remove("reveal-pending");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08 },
      );
      targets.forEach((target) => {
        // Already visible content stays visible during hydration and hash navigation.
        if (target.getBoundingClientRect().top >= window.innerHeight) {
          target.classList.add("reveal-pending");
          observer?.observe(target);
        }
      });
    }

    configure();
    media.addEventListener("change", configure);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", configure);
      targets.forEach((target) => target.classList.remove("reveal-pending"));
    };
  }, []);

  return null;
}
