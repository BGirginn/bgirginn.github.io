"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap";

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;
      gsap.fromTo(
        ".process-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 60%",
            end: "bottom 65%",
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <section
      id="process"
      ref={ref}
      data-scroll-lock
      className="relative min-h-screen"
    >
      <div className="section-shell md:flex md:min-h-screen md:items-center md:py-[calc(var(--header-height)+32px)]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel>Engineering Process</SectionLabel>
              <h2 className="text-[clamp(34px,4vw,56px)] font-semibold leading-tight">
                A predictable path from requirement to validated prototype.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--color-muted)]">
                The work moves from constraints to architecture, then through
                layout, firmware, bring-up and iteration.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="relative pl-10">
                <div className="absolute left-[11px] top-2 h-[calc(100%-24px)] w-px bg-[var(--color-border)]" />
                <div className="process-line absolute left-[11px] top-2 h-[calc(100%-24px)] w-px origin-top bg-[var(--color-blue)]" />
                <ol className="grid gap-7">
                  {siteContent.process.map((step, index) => (
                    <li key={step} className="relative">
                      <span className="absolute -left-10 top-1 flex h-6 w-6 items-center justify-center border border-[var(--color-gold)] bg-[var(--color-bg)] text-[10px] text-[var(--color-gold)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-2xl font-semibold">{step}</h3>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
