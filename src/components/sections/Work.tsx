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
    <PinnedSection id="work">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="text-[clamp(34px,4.2vw,58px)] font-semibold leading-tight">
              Proof through focused engineering work.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-5">
              {siteContent.work.map((project) => (
                <Link
                  key={project.name}
                  href={project.href}
                  className="group cursor-pointer border border-[var(--color-border)] bg-[rgba(19,26,35,0.42)] p-6 transition-colors duration-200 hover:border-[var(--color-gold)] hover:bg-[var(--color-hover)] md:p-8"
                  onClick={() =>
                    track("project_view", { project: project.name })
                  }
                >
                  <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                        {project.eyebrow}
                      </p>
                      <h3 className="mt-5 text-2xl font-semibold md:text-3xl">
                        {project.name}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-muted)]">
                        {project.summary}
                      </p>
                    </div>
                    <dl className="grid gap-4 text-sm">
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
