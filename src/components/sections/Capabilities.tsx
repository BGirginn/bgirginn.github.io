import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";

export function Capabilities() {
  return (
    <PinnedSection id="capabilities">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <SectionLabel>Capabilities</SectionLabel>
            <h2 className="text-[clamp(34px,3.6vw,52px)] font-semibold leading-tight">
              Practical tools for hardware and firmware work.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {siteContent.capabilities.map((category, index) => (
                <div
                  key={category.title}
                  className="group border border-[var(--color-border)] bg-[rgba(19,26,35,0.34)] p-5 transition-colors duration-200 hover:border-[rgba(201,169,110,0.46)] hover:bg-[rgba(201,169,110,0.055)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold leading-tight">
                      {category.title}
                    </h3>
                    <span className="text-[10px] font-semibold tabular-nums text-[var(--color-gold)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="mt-5 grid gap-2.5">
                    {category.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm leading-5 text-[var(--color-muted)]"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(201,169,110,0.62)] transition-transform duration-200 group-hover:scale-125"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
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
