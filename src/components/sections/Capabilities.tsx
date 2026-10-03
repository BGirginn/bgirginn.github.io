import { CircuitBoard, Cpu, Network, ScanLine, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";

const icons = [Cpu, CircuitBoard, Network, ScanLine, Wrench];

export function Capabilities() {
  return (
    <PinnedSection id="capabilities">
      <Container>
        <div className="section-heading-row" data-reveal>
          <div>
            <SectionLabel number="04">Capabilities</SectionLabel>
            <h2 className="section-title">
              Across the board.
              <br />
              <span>Through the stack.</span>
            </h2>
          </div>
          <p className="section-intro">
            Practical tools for designing electronics, writing firmware and
            understanding system behavior.
          </p>
        </div>
        <div className="capability-matrix">
          {siteContent.capabilities.map((category, index) => {
            const Icon = icons[index];
            return (
              <div
                key={category.title}
                className="capability-domain"
                data-reveal
              >
                <div className="capability-head">
                  <Icon size={26} strokeWidth={1} aria-hidden="true" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{category.title}</h3>
                <ul>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </PinnedSection>
  );
}
