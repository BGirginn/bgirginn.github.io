import Link from "next/link";
import { DetailPage } from "@/components/ui/DetailPage";
import { ProductArchitecture } from "@/components/company/ProductArchitecture";
import { business, verifiedValue } from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

function loadIndustrialPlatform() {
  const configured = business.products.find(
    (item) => item.id === "industrial-lora",
  );
  if (!configured?.caseStudy || !configured.architectureStages) {
    throw new Error(
      "Industrial LoRa Platform requires case study and architecture content.",
    );
  }
  return {
    ...configured,
    caseStudy: configured.caseStudy,
    architectureStages: configured.architectureStages,
  };
}
const product = loadIndustrialPlatform();
const caseStudy = product.caseStudy;

export const metadata = pageMetadata(
  "/products/industrial-lora/",
  product.name,
  product.description,
);

export default function IndustrialLoRaPage() {
  const productionContext = product.productionContext
    ? verifiedValue(product.productionContext)
    : undefined;
  return (
    <DetailPage
      eyebrow={`${business.displayName} / ${product.name}`}
      title={caseStudy.headline}
      introduction={product.description}
    >
      <section className="detail-section">
        <div className="detail-section-heading">
          <h2>{product.name}</h2>
          <span className="status-tag">
            {(product.productionStatus &&
              verifiedValue(product.productionStatus)) ?? "Completed"} · Main product
          </span>
        </div>
        <p>{product.verificationNote}</p>
        <dl className="fact-list">
          <div>
            <dt>Product area</dt>
            <dd>Industrial monitoring & automation</dd>
          </div>
          <div>
            <dt>Intended users</dt>
            <dd>{verifiedValue(product.targetUser)}</dd>
          </div>
          <div>
            <dt>Technology</dt>
            <dd>{product.components.join(" · ")}</dd>
          </div>
        </dl>
        <nav
          className="evidence-links"
          aria-label="Industrial platform next steps"
        >
          <Link href="/contact/?service=integration">
            Discuss your factory system ↗
          </Link>
          <Link href="/products/">All products ↗</Link>
        </nav>
      </section>
      {productionContext ? (
        <section className="detail-section">
          <h2>Production & industrial collaboration</h2>
          <p>{productionContext}</p>
        </section>
      ) : null}
      <section className="detail-section">
        <h2>The engineering problem</h2>
        <p>{caseStudy.problem}</p>
        <h3>The system</h3>
        <p>{caseStudy.solution}</p>
        <ProductArchitecture
          name={product.name}
          stages={product.architectureStages}
        />
      </section>
      <section className="detail-section">
        <h2>Product capabilities</h2>
        <div className="industrial-capabilities">
          {caseStudy.capabilities.map((capability) => (
            <article key={capability.title}>
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="detail-section">
        <h2>From machine signal to operational record</h2>
        <ol className="industrial-workflow">
          {caseStudy.workflow.map((step, index) => (
            <li key={step.name}>
              <span className="company-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.name}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
        <p>{caseStudy.example}</p>
      </section>
      <section className="detail-section">
        <h2>Project outcome</h2>
        <p>{caseStudy.outcome}</p>
        <Link href="/contact/?service=integration">
          Discuss integration requirements ↗
        </Link>
      </section>
    </DetailPage>
  );
}
