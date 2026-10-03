"use client";

import { track } from "@vercel/analytics";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PinnedSection } from "@/components/sections/PinnedSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectDrawing } from "@/components/ui/EngineeringDrawing";
import { siteContent } from "@/content/site";

const drawingKinds = ["system", "interface", "lighting"] as const;

export function Work() {
  return (
    <PinnedSection id="work" contentClassName="work-section-shell">
      <Container>
        <div className="section-heading-row" data-reveal>
          <div>
            <SectionLabel number="02">Selected Work</SectionLabel>
            <h2 className="section-title">
              From low-level logic.
              <br />
              <span>To working systems.</span>
            </h2>
          </div>
          <p className="section-intro">
            A selection of software and embedded projects. Open a repository to
            explore the implementation.
          </p>
        </div>
        <div className="project-list">
          {siteContent.work.map((project, index) => (
            <a
              key={project.name}
              href={project.href}
              className="project-record"
              data-reveal
              onClick={() => track("project_view", { project: project.name })}
            >
              <div className="project-illustration">
                <ProjectDrawing kind={drawingKinds[index]} />
                <span className="technical-caption">
                  Concept diagram / {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="project-summary">
                <p className="project-eyebrow">{project.eyebrow}</p>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
              <dl className="project-details">
                <div>
                  <dt>Focus</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{project.stack}</dd>
                </div>
                <div>
                  <dt>Outcome</dt>
                  <dd>{project.outcome}</dd>
                </div>
              </dl>
              <span className="project-open">
                <ArrowUpRight size={22} />
                <span className="sr-only">View Project</span>
              </span>
            </a>
          ))}
        </div>
      </Container>
    </PinnedSection>
  );
}
