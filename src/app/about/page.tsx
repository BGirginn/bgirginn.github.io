import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import {
  business,
  ventureEmail,
  ventureFoundedLabel,
  verifiedProfiles,
  verifiedValue,
} from "@/content/business";
import { siteContent } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/about/",
  `About ${business.displayName}`,
  business.company.description,
);
export default function AboutPage() {
  const background = verifiedValue(business.founder.background);
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Company`}
      title={business.company.headline}
      introduction={business.company.description}
    >
      <section className="detail-section">
        <h2>What guides the work</h2>
        <div className="company-principles">
          {business.company.principles.map((principle) => (
            <article key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="detail-section">
        <h2>Business information</h2>
        <dl className="fact-list">
          <div>
            <dt>Brand</dt>
            <dd>{business.displayName}</dd>
          </div>
          <div>
            <dt>Engineering lead</dt>
            <dd>{business.founder.name}</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>{verifiedValue(business.venture.mission)}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>
              <a href={business.websiteUrl}>{business.websiteUrl}</a>
            </dd>
          </div>
          {[
            { label: "Legal entity", fact: business.legalEntityName },
            { label: "Legal status", fact: business.legalRegistrationStatus },
            { label: "Business structure", fact: business.legal.entityType },
            { label: "Country", fact: business.legal.jurisdiction },
            { label: "Funding model", fact: business.fundingModel },
            {
              label: "Business registration date",
              fact: business.legal.registrationDate,
            },
            {
              label: "Registered address",
              fact: business.company.registeredAddress,
            },
            { label: "Phone", fact: business.company.phone },
          ].map(({ label, fact }) =>
            verifiedValue(fact) ? (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{verifiedValue(fact)}</dd>
              </div>
            ) : null,
          )}
          {ventureFoundedLabel ? (
            <div>
              <dt>Venture founding</dt>
              <dd>
                <time dateTime={business.foundingDate.value}>
                  Founded {ventureFoundedLabel}
                </time>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>Founder contact</dt>
            <dd>
              <a href={`mailto:${ventureEmail}`}>{ventureEmail}</a>
            </dd>
          </div>
        </dl>
        <p>
          The venture founding date describes the start of the engineering
          venture; it is separate from the official business registration date.
        </p>
      </section>
      <section className="detail-section">
        <h2>{business.founder.name}</h2>
        <p>
          {business.founder.role}
          {background ? ` · ${background}` : ""}
        </p>
        <h3>{siteContent.about.title}</h3>
        {siteContent.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {verifiedValue(business.founder.education) ? (
          <p>{verifiedValue(business.founder.education)}</p>
        ) : null}
        {verifiedValue(business.founder.experience) ? (
          <p>{verifiedValue(business.founder.experience)}</p>
        ) : null}
        <nav
          className="evidence-links"
          aria-label="Public profiles and background"
        >
          {verifiedProfiles.map((profile) => (
            <Link key={profile.label} href={profile.value}>
              {profile.label} ↗
            </Link>
          ))}
          <a href="/cv.pdf">Read the CV ↗</a>
        </nav>
      </section>
      <section className="detail-section">
        <h2>Engineering direction</h2>
        <p>
          Embedded firmware, device operation and mechanical design connect the
          projects in {business.displayName}’s development work.
        </p>
        <nav className="evidence-links" aria-label="Company next steps">
          <Link href="/services/">Engineering services ↗</Link>
          <Link href="/resources/#faq">Frequently asked questions ↗</Link>
        </nav>
        <Link href="/legal/">Business information and website terms ↗</Link>
        <Link href="/venture/">
          Engineering approach and development roadmap ↗
        </Link>
      </section>
    </DetailPage>
  );
}
