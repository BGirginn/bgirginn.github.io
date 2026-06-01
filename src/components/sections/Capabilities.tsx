import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";

export function Capabilities() {
  return (
    <PinnedSection id="capabilities">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>Capabilities</SectionLabel>
            <h2 className="text-[clamp(34px,4vw,56px)] font-semibold leading-tight">
              Practical tools for hardware and firmware work.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
              {siteContent.capabilities.map((category) => (
                <div
                  key={category.title}
                  className="border-t border-[var(--color-border)] pt-6"
                >
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <ul className="mt-5 grid gap-3">
                    {category.items.map((item) => (
                      <li
                        key={item}
                        className="group flex items-center justify-between text-[var(--color-muted)]"
                      >
                        <span>{item}</span>
                        <span className="h-px w-8 bg-[var(--color-border)] transition-colors duration-200 group-hover:bg-[var(--color-gold)]" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </PinnedSection>
  );
}
