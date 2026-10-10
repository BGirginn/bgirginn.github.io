import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { EngagementProcess } from "@/components/company/EngagementProcess";
import { business } from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/services/",
  "Engineering services",
  "Electronics, embedded firmware, robotics and device integration: project scope, deliverables and engagement process.",
);

export default function ServicesPage() {
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Services`}
      title="From a system brief to an engineering plan."
      introduction="Discuss a new hardware design, an embedded interface or a robotics prototype. Each engagement starts with a clear scope and agreed deliverables, using the engineering disciplines below."
    >
      {business.services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className="detail-section service-entry"
        >
          <p className="engineering-eyebrow">
            {String(index + 1).padStart(2, "0")} / Engineering discipline
          </p>
          <h2>{service.name}</h2>
          <p>{service.summary}</p>
          <div className="service-scope-grid">
            <div>
              <h3>Typical scope</h3>
              <ul className="detail-list">
                {service.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Deliverables to agree</h3>
              <ul className="detail-list">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <nav
            className="evidence-links"
            aria-label={`${service.name} next steps`}
          >
            <Link href={service.evidence.href}>{service.evidence.label} ↗</Link>
            <Link href={`/contact/?service=${service.id}`}>
              Discuss {service.name.toLowerCase()} ↗
            </Link>
          </nav>
        </section>
      ))}
      <section className="detail-section">
        <h2>How an engagement works</h2>
        <p>
          Scope, availability and commercial terms are agreed before work
          begins. Validation depends on the actual hardware and the acceptance
          criteria set for the project.
        </p>
        <EngagementProcess />
      </section>
      <section className="detail-section">
        <h2>Start with your system</h2>
        <ul className="detail-list">
          {business.inquiryChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href="/contact/">Start a project discussion ↗</Link>
      </section>
    </DetailPage>
  );
}
