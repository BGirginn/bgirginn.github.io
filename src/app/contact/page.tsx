import { business } from "@/content/business";
import { DetailPage } from "@/components/ui/DetailPage";
import { Contact } from "@/components/sections/Contact";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/contact/",
  "Contact",
  `Contact ${business.founder.name} about embedded systems, robotics or technical project development.`,
);
export default function ContactPage() {
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Contact`}
      title="Let’s discuss your next system."
      introduction="Start a conversation about embedded firmware, device software, robotics or an engineering review. Share the requirements and the system you are building."
    >
      <Contact />
      <section className="detail-section">
        <h2>What to include in your brief</h2>
        <ul className="detail-list">
          {business.inquiryChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          Start with a non-confidential summary. Scope, availability, pricing
          and confidentiality arrangements are discussed before work begins.
        </p>
      </section>
    </DetailPage>
  );
}
