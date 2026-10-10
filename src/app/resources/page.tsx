import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { business, publicEmail } from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/resources/",
  "Resources & FAQ",
  "Technical documentation, the CAD explorer, project sources and answers about Quadropod and engineering enquiries.",
);

export default function ResourcesPage() {
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Resources`}
      title="Explore the work. Understand the next step."
      introduction="Inspect the engineering artefacts, follow the development roadmap and find practical answers before starting a conversation."
    >
      <section className="detail-section">
        <h2>Technical resources</h2>
        <div className="resource-list">
          {business.resources.map((resource) => (
            <article key={resource.href}>
              <p className="engineering-eyebrow">{resource.kind}</p>
              <h3>
                <Link href={resource.href}>{resource.title} ↗</Link>
              </h3>
              <p>{resource.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="detail-section" id="faq">
        <h2>Frequently asked questions</h2>
        <div className="company-faq">
          {business.faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="detail-section">
        <h2>Technical enquiries</h2>
        <p>
          For a question about the model, documentation or your own system,
          include the relevant project, version and the behaviour you are trying
          to understand.
        </p>
        <nav className="evidence-links" aria-label="Technical enquiry contacts">
          <Link href="/contact/">Prepare an enquiry ↗</Link>
          <a href={`mailto:${publicEmail}`}>{publicEmail} ↗</a>
        </nav>
      </section>
    </DetailPage>
  );
}
