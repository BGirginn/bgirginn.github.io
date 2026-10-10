import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { DevelopmentRoadmap } from "@/components/ui/DevelopmentRoadmap";
import {
  business,
  verifiedValue,
  publicEmail,
  statusLabels,
} from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/venture/",
  "Engineering approach",
  `${business.displayName}’s engineering focus, Quadropod development and plans for AI-assisted workflows.`,
);
export default function VenturePage() {
  const venture = business.venture;
  const details = [
    { label: "Mission", fact: venture.mission },
    { label: "Problem", fact: venture.problem },
    { label: "Proposed solution", fact: venture.solution },
    { label: "Intended customers", fact: venture.intendedCustomers },
    { label: "Legal entity", fact: business.legalEntityName },
    { label: "Registration", fact: business.legalRegistrationStatus },
    { label: "Founded", fact: business.foundingDate },
  ];
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Engineering approach`}
      title={
        verifiedValue(venture.name) ??
        "Hardware and software. Developed together."
      }
      introduction={business.venture.context}
    >
      <section className="detail-section">
        <h2>Engineering focus</h2>
        <p>
          {business.displayName} brings robotics and industrial automation
          together. Industrial LoRa Platform is a completed company project;
          Quadropod continues from CAD design towards physical validation and
          embedded control.
        </p>
        <dl className="fact-list">
          {details.map(({ label, fact }) =>
            verifiedValue(fact) ? (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{verifiedValue(fact)}</dd>
              </div>
            ) : null,
          )}
        </dl>
        <Link href="/products/">
          Explore existing prototypes and development work ↗
        </Link>
      </section>
      <section className="detail-section">
        <h2>Development roadmap</h2>
        <DevelopmentRoadmap items={business.milestones} />
      </section>
      <section className="detail-section">
        <div className="detail-section-heading">
          <h2>Claude in the engineering workflow</h2>
          <span className="status-tag">
            {statusLabels[business.claude.status]}
          </span>
        </div>
        <p>{business.claude.description}</p>
        <h3>Potential uses to evaluate</h3>
        <ul className="detail-list">
          {business.claude.useCases.map((useCase) => (
            <li key={useCase}>{useCase}</li>
          ))}
        </ul>
        <aside className="safety-note">
          <h3>Hardware safety boundary · Planned</h3>
          <p>{business.claude.safety}</p>
          <p>
            This is a design requirement for future prototypes; it is not an
            implemented control system.
          </p>
        </aside>
        {business.claude.evidence.map((href) => (
          <Link key={href} href={href}>
            Integration evidence ↗
          </Link>
        ))}
      </section>
      <section className="detail-section">
        <h2>The developer</h2>
        <p>
          {business.founder.name} ·{" "}
          {verifiedValue(business.founder.ventureFounderRole) ??
            business.founder.role}
        </p>
        {verifiedValue(business.founder.background) ? (
          <p>
            {verifiedValue(business.founder.background)} with a focus on
            embedded systems, control and robotics.
          </p>
        ) : null}
        <Link href="/about/">Background and public profiles ↗</Link>
        <p>
          <Link href={`mailto:${publicEmail}`}>{publicEmail}</Link>
        </p>
      </section>
    </DetailPage>
  );
}
