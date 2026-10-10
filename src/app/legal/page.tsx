import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { business, publicEmail, verifiedValue } from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/legal/",
  "Business information & website terms",
  `${business.displayName} business identity, website use, product enquiries and technical material.`,
);

export default function LegalPage() {
  const details = [
    { label: "Registered name", fact: business.legalEntityName },
    { label: "Legal status", fact: business.legalRegistrationStatus },
    { label: "Business type", fact: business.legal.entityType },
    { label: "Jurisdiction", fact: business.legal.jurisdiction },
    { label: "Registration number", fact: business.legal.registrationNumber },
    { label: "Business registration date", fact: business.legal.registrationDate },
    { label: "Registered address", fact: business.company.registeredAddress },
    { label: "Phone", fact: business.company.phone },
  ];
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Business information`}
      title="Business information & website terms."
      introduction="This website presents our products, ongoing research and engineering work, and provides a way to start a business enquiry."
    >
      <section className="detail-section">
        <h2>Business identity and contact</h2>
        <dl className="fact-list">
          <div>
            <dt>Business brand</dt>
            <dd>{business.displayName}</dd>
          </div>
          <div>
            <dt>Business owner</dt>
            <dd>{business.founder.name}</dd>
          </div>
          {details.map(({ label, fact }) =>
            verifiedValue(fact) ? (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{verifiedValue(fact)}</dd>
              </div>
            ) : null,
          )}
          <div>
            <dt>Business enquiries</dt>
            <dd>
              <a href={`mailto:${publicEmail}`}>{publicEmail}</a>
            </dd>
          </div>
        </dl>
        <p>
          Last updated:{" "}
          <time dateTime={business.legal.updatedOn}>{business.legal.updatedOn}</time>.
        </p>
      </section>
      <section className="detail-section">
        <h2>Enquiries and commercial agreements</h2>
        <p>
          The website has no checkout, payment collection or online order
          acceptance. The contact form prepares an email draft; preparing or
          sending an enquiry does not place an order or confirm availability.
          Product supply and engineering work require agreement on scope,
          specifications, price, delivery, installation, warranty and support
          as applicable. This page does not replace those agreements.
        </p>
      </section>
      <section className="detail-section">
        <h2>Produced products and ongoing R&D</h2>
        <p>
          Industrial LoRa Platform is our produced main product. Quadropod is
          an ongoing R&D product; its public CAD viewer demonstrates geometry
          and website interactions. Planned vision, edge/server decisions and
          Claude integration are not currently offered as tested robot features.
          Product descriptions do not imply certification or suitability for
          a particular installation.
        </p>
        <Link href="/products/">Product status and technical scope ↗</Link>
      </section>
      <section className="detail-section">
        <h2>Technical material and responsible use</h2>
        <p>
          Follow each source repository’s licence when using published code,
          CAD or documentation. Access to this website does not grant rights
          beyond the applicable licence. Do not interfere with the website or
          submit credentials, confidential designs or third-party personal data
          through a general enquiry.
        </p>
      </section>
      <section className="detail-section">
        <h2>Privacy and external services</h2>
        <p>
          Email drafts, hosting and optional analytics are described in the
          privacy page. External services apply their own terms when you visit
          a linked repository or profile. Questions about website information
          or an enquiry can be directed to the business contact above.
        </p>
        <Link href="/privacy/">Privacy and contact data flow ↗</Link>
      </section>
    </DetailPage>
  );
}
