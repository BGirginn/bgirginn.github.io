import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SystemDrawing } from "@/components/ui/EngineeringDrawing";
import { siteContent } from "@/content/site";

export function About() {
  return (
    <PinnedSection id="about">
      <Container>
        <div className="about-layout">
          <div data-reveal>
            <SectionLabel number="05">About / Bora Girgin</SectionLabel>
            <h2 className="section-title">
              System thinking.
              <br />
              <span>At every layer.</span>
            </h2>
            <SystemDrawing />
          </div>
          <div className="about-copy" data-reveal>
            <p className="engineering-eyebrow">
              Hardware × Firmware × Integration
            </p>
            {siteContent.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="about-signature">
              <span>BG.</span>
              <div>
                <strong>{siteContent.brand.name}</strong>
                <p>{siteContent.brand.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PinnedSection>
  );
}
