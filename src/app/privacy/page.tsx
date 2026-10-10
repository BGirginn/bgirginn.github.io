import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { business, publicEmail, verifiedValue } from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/privacy/",
  "Privacy & site use",
  "How contact drafts, analytics, external links and technical material work on the BGirgin Hardware website.",
);

export default function PrivacyPage() {
  const analyticsEnabled = Boolean(process.env.VERCEL);
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Privacy & site use`}
      title="How this website handles your enquiry."
      introduction="This page describes the website’s current contact and data flow, and how to use its technical material. Updated 10 October 2026."
    >
      <section className="detail-section">
        <h2>Business contact and enquiry information</h2>
        <p>
          {business.displayName} operates as a sole proprietorship led by{" "}
          {business.founder.name}. Use {publicEmail} for questions about
          your enquiry, to request information about its handling, or to request
          correction or deletion of information you sent, subject to applicable
          legal obligations.
        </p>
        <dl className="fact-list">
          {[
            { label: "Data controller", fact: business.legal.dataController },
            { label: "Processing basis", fact: business.legal.processingBasis },
            { label: "Retention", fact: business.legal.retentionPolicy },
            { label: "Data transfers", fact: business.legal.dataTransfers },
          ].map(({ label, fact }) =>
            verifiedValue(fact) ? (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{verifiedValue(fact)}</dd>
              </div>
            ) : null,
          )}
        </dl>
        <Link href="/legal/">Business information and website terms ↗</Link>
      </section>
      <section className="detail-section">
        <h2>Contact drafts</h2>
        <p>
          The form uses your name, email address and message to prepare a draft
          in your email application. It does not submit those fields to a
          website contact API or store them in browser local storage. Values
          remain in the open form after preparing the draft; reloading the page
          clears them.
        </p>
        <p>
          You choose whether to send the draft. Once sent, the message is
          handled by your email provider and the recipient’s email service. The
          website cannot confirm sending or delivery.
        </p>
      </section>
      <section className="detail-section">
        <h2>Analytics and hosting</h2>
        <p>
          {analyticsEnabled
            ? "This build includes Vercel Analytics and Speed Insights. Interaction events identify actions such as opening a project or preparing a contact draft; the event payloads do not contain the contact form’s name, email address or message."
            : "This build does not load the optional Vercel Analytics or Speed Insights scripts. The website does not use an account system or browser storage to save your contact details."}
        </p>
        <p>
          The hosting provider handles the network requests needed to serve the
          website. Hosting and email services have their own data practices.
        </p>
      </section>
      <section className="detail-section">
        <h2>External resources and confidential information</h2>
        <p>
          Repository links open external services. Their own terms and privacy
          practices apply when you visit them. Start project discussions with a
          non-confidential summary and agree how sensitive files will be shared
          before sending them. Do not include passwords or API keys in the
          contact form.
        </p>
      </section>
      <section className="detail-section">
        <h2>Technical material and product status</h2>
        <p>
          CAD views, code and diagrams describe development work. Follow each
          source repository’s licence and documentation when using its material.
          A browser demonstration does not establish physical performance,
          product certification or suitability for a particular application.
        </p>
        <p>
          Quadropod is a development project. Purchasing, warranty, delivery and
          support terms would need to be agreed for an actual offering; this
          website has no checkout or order-processing service.
        </p>
      </section>
      <section className="detail-section">
        <h2>Questions about your enquiry</h2>
        <p>
          Contact {business.founder.name} at{" "}
          <a href={`mailto:${publicEmail}`}>{publicEmail}</a> with a question
          about a message you sent or the information on this site.
        </p>
        <Link href="/contact/">Contact {business.displayName} ↗</Link>
      </section>
    </DetailPage>
  );
}
