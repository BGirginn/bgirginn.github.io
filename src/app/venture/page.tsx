import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { DevelopmentRoadmap } from "@/components/ui/DevelopmentRoadmap";
import {
  business,
  verifiedValue,
  publicEmail,
  ventureEmail,
  verifiedProfiles,
  statusLabels,
} from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/venture/",
  "Products & robotics R&D",
  business.venture.context,
);
export default function VenturePage() {
  const venture = business.venture;
  const product = business.products.find(
    (item) => item.id === "quadropod",
  );
  if (!product?.developmentStages) {
    throw new Error("Quadropod requires development-stage evidence.");
  }
  const details = [
    { label: "Mission", fact: venture.mission },
    { label: "Problem", fact: venture.problem },
    { label: "Proposed solution", fact: venture.solution },
    { label: "Intended customers", fact: venture.intendedCustomers },
    { label: "Legal entity", fact: business.legalEntityName },
    { label: "Business type", fact: business.legalRegistrationStatus },
    { label: "Founded", fact: business.foundingDate },
  ];
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Venture`}
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
          together under the engineering direction of {business.founder.name}.
          Industrial LoRa Platform is our main, already-produced product.
          Quadropod remains in active R&D, with image processing and a
          Claude-assisted edge/server decision system planned.
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
      <section
        className="detail-section"
        aria-labelledby="product-development-heading"
      >
        <h2 id="product-development-heading">Quadropod V0 robotics R&D</h2>
        <p>{product.description}</p>
        <DevelopmentRoadmap items={product.developmentStages} />
        <nav className="evidence-links" aria-label="Quadropod project evidence">
          {product.evidence.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label} ↗
            </Link>
          ))}
          <Link href={product.repository}>Project source ↗</Link>
        </nav>
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
        <h3>Claude API research and integration roadmap</h3>
        <DevelopmentRoadmap items={business.claude.roadmap} />
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
        <nav className="evidence-links" aria-label="Claude API research sources">
          {business.claude.references.map((reference) => (
            <a key={reference.href} href={reference.href}>
              {reference.label} ↗
            </a>
          ))}
        </nav>
        {business.claude.evidence.map((href) => (
          <Link key={href} href={href}>
            Integration evidence ↗
          </Link>
        ))}
      </section>
      <section className="detail-section">
        <h2>The founder</h2>
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
        <nav className="evidence-links" aria-label="Founder identity and profiles">
          <Link href="/about/">Background and project history ↗</Link>
          {verifiedProfiles.map((profile) => (
            <a key={profile.label} href={profile.value}>
              {profile.label} ↗
            </a>
          ))}
        </nav>
        <p>
          Venture inquiries: <a href={`mailto:${ventureEmail}`}>{ventureEmail}</a>
        </p>
        <p>
          General contact: <Link href={`mailto:${publicEmail}`}>{publicEmail}</Link>
        </p>
      </section>
    </DetailPage>
  );
}
