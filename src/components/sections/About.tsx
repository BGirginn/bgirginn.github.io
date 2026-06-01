import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";

export function About() {
  return (
    <PinnedSection id="about">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>About</SectionLabel>
            <h2 className="text-[clamp(34px,4vw,56px)] font-semibold leading-tight">
              {siteContent.about.title}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-7 text-[clamp(18px,1.5vw,22px)] leading-9 text-[var(--color-muted)]">
              {siteContent.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-14 grid grid-cols-3 border border-[var(--color-border)]">
              {["Hardware", "Firmware", "Systems"].map((item) => (
                <div
                  key={item}
                  className="border-r border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-muted)] last:border-r-0"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </PinnedSection>
  );
}
