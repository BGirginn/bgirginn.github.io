"use client";

import { track } from "@vercel/analytics";
import { siteContent } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";

export function Hero() {
  return (
    <PinnedSection
      id="hero"
      contentClassName="pt-[calc(var(--header-height)+48px)] md:pt-[calc(var(--header-height)+24px)]"
    >
      <Container>
        <div className="hero-text-layout">
          <p className="engineering-eyebrow mb-7">
            <span /> Electrical / Embedded / Robotics
          </p>
          <h1 className="hero-title">
            {siteContent.hero.title.split("\n").map((line, index) => (
              <span
                key={line}
                className={index === 1 ? "hologram-type" : undefined}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-description mt-8 text-[clamp(17px,1.35vw,20px)] leading-8 text-[var(--color-muted)]">
            {siteContent.hero.description}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              href={siteContent.hero.primaryCta.href}
              className="w-full sm:w-auto"
              onClick={() =>
                track("cta_click", {
                  label: siteContent.hero.primaryCta.label,
                  location: "hero",
                })
              }
            >
              {siteContent.hero.primaryCta.label}
            </Button>
            <Button
              href={siteContent.hero.secondaryCta.href}
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() =>
                track("cta_click", {
                  label: siteContent.hero.secondaryCta.label,
                  location: "hero",
                })
              }
            >
              {siteContent.hero.secondaryCta.label}
            </Button>
          </div>
          <div className="hero-domains" aria-label="Engineering focus">
            <span>Board design</span>
            <span>Embedded code</span>
            <span>System integration</span>
          </div>
        </div>
      </Container>
    </PinnedSection>
  );
}
