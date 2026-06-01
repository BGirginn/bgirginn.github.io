"use client";

import { track } from "@vercel/analytics";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteContent } from "@/content/site";

export function Work() {
  return (
    <PinnedSection
      id="work"
      contentClassName="work-section-shell"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="text-[clamp(34px,3.8vw,54px)] font-semibold leading-tight">
              Proof through focused engineering work.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-4">
              {siteContent.work.map((project) => (
                <Link
                  key={project.name}
                  href={project.href}
                  className="group cursor-pointer border border-[var(--color-border)] bg-[rgba(19,26,35,0.42)] p-5 transition-colors duration-200 hover:border-[var(--color-gold)] hover:bg-[var(--color-hover)] md:p-6"
                  onClick={() =>
                    track("project_view", { project: project.name })
                  }
                >
                  <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                        {project.eyebrow}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold md:text-[28px]">
                        {project.name}
                      </h3>
                      <p className="mt-3 max-w-xl text-[15px] leading-6 text-[var(--color-muted)]">
                        {project.summary}
                      </p>
                    </div>
                    <dl className="grid gap-2.5 text-sm">
                      <div>
                        <dt className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-subtle)]">
                          Role
                        </dt>
                        <dd className="mt-1 text-[var(--color-muted)]">
                          {project.role}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-subtle)]">
                          Stack
                        </dt>
                        <dd className="mt-1 text-[var(--color-muted)]">
                          {project.stack}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-subtle)]">
                          Outcome
                        </dt>
                        <dd className="mt-1 text-[var(--color-muted)]">
                          {project.outcome}
                        </dd>
                      </div>
                      <div className="inline-flex items-center gap-2 text-[var(--color-text)] transition-transform duration-200 group-hover:translate-x-1">
                        View Project <ArrowUpRight size={16} />
                      </div>
                    </dl>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </PinnedSection>
  );
}
