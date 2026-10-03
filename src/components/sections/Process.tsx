"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap";

const descriptions = [
  "Define constraints, interfaces and expected behavior.",
  "Connect power, control and communication decisions.",
  "Translate the architecture into a circuit.",
  "Resolve placement, routing and power paths.",
  "Build drivers, control logic and device interfaces.",
  "Bring up the board and integrate the system.",
  "Check signals, behavior and failure conditions.",
  "Use measurements to guide the next revision.",
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  useGSAP(
    () => {
      if (!ref.current || reduced) return;
      gsap.fromTo(
        ".process-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            end: "center 45%",
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section
      id="process"
      ref={ref}
      className="site-section relative min-h-screen"
    >
      <div className="section-shell md:flex md:min-h-screen md:items-center md:py-[calc(var(--header-height)+32px)]">
        <Container>
          <div className="section-heading-row" data-reveal>
            <div>
              <SectionLabel number="03">Engineering Process</SectionLabel>
              <h2 className="section-title">
                Define. Build. Measure.
                <br />
                <span>Then refine.</span>
              </h2>
            </div>
            <p className="section-intro">
              A predictable path from requirements to a validated prototype.
              Each stage informs the next decision.
            </p>
          </div>
          <div className="process-board">
            <div className="process-tracks" aria-hidden="true">
              <span className="process-line" />
              <span className="process-line" />
            </div>
            <ol className="process-steps">
              {siteContent.process.map((step, index) => (
                <li key={step} data-reveal>
                  <span className="process-node">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{step}</h3>
                  <p>{descriptions[index]}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="process-note technical-caption">
            <span aria-hidden="true">↳</span> Validation feeds the next
            iteration.
          </p>
        </Container>
      </div>
    </section>
  );
}
