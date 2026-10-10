import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { business, statusLabels } from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/projects/",
  "Engineering projects",
  `Technical objectives, implementation, tools and repository evidence for ${business.founder.name}’s engineering projects.`,
);
export default function ProjectsPage() {
  return (
    <DetailPage
      eyebrow="Engineering work / Public source"
      title="Inspect the work behind the interface."
      introduction="Explore the software, electronics and mechanical design work behind BGirgin Hardware. Each project connects its engineering goals with implementation details and source material."
    >
      <section className="detail-section">
        <div className="detail-section-heading">
          <h2>Industrial LoRa Platform</h2>
          <span className="status-tag">Completed · Founder-reported</span>
        </div>
        <p>
          Factory monitoring and automation through equipment interfaces, ESP32
          nodes, LoRa transport and central SBC management.
        </p>
        <Link href="/products/industrial-lora/">
          Explore the engineering project ↗
        </Link>
      </section>
      {business.projects.map((project) => {
        return (
          <article key={project.name} className="detail-section">
            <div className="detail-section-heading">
              <h2>{project.name}</h2>
              <span className="status-tag">{statusLabels[project.status]}</span>
            </div>
            <p>{project.summary}</p>
            <dl className="fact-list">
              <div>
                <dt>Objective</dt>
                <dd>{project.objective}</dd>
              </div>
              <div>
                <dt>Implementation</dt>
                <dd>{project.implementation}</dd>
              </div>
              <div>
                <dt>Tools & focus</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Validation scope</dt>
                <dd>{project.limitations}</dd>
              </div>
            </dl>
            <Link href={project.evidence}>Inspect the repository ↗</Link>
          </article>
        );
      })}
      <section className="detail-section">
        <h2>Mechanical and PCB studies</h2>
        <p>
          The home hardware explorer includes Quadropod V0, Covered spider and
          the KiCad PCB assembly. CAD inspection is separate from physical
          hardware validation.
        </p>
        <Link href="/#signature">Open the hardware explorer ↗</Link>
      </section>
    </DetailPage>
  );
}
