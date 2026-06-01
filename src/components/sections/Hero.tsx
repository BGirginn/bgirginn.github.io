"use client";

import dynamic from "next/dynamic";
import { track } from "@vercel/analytics";
import { siteContent } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="soft-panel aspect-[4/3] min-h-[260px] animate-pulse md:min-h-[360px]" />
    ),
  },
);

export function Hero() {
  return (
    <PinnedSection
      id="hero"
      contentClassName="pt-[calc(var(--header-height)+48px)] md:pt-[calc(var(--header-height)+24px)]"
    >
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-6">
            <h1 className="font-semibold tracking-normal">
              <span className="hidden whitespace-pre-line text-[clamp(64px,7.6vw,112px)] leading-[0.92] md:block">
                {siteContent.hero.title}
              </span>
              <span className="block whitespace-pre-line text-[42px] leading-[0.98] md:hidden">
                Embedded{"\n"}Systems{"\n"}& PCB{"\n"}Design
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-[clamp(17px,1.35vw,20px)] leading-8 text-[var(--color-muted)]">
              {siteContent.hero.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
          </div>
          <div className="min-w-0 lg:col-span-6">
            <HeroScene />
          </div>
        </div>
      </Container>
    </PinnedSection>
  );
}
