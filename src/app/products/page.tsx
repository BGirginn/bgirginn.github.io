import Link from "next/link";
import { ProductArchitecture } from "@/components/company/ProductArchitecture";
import { ProductDrawing } from "@/components/company/ProductDrawing";
import { DetailPage } from "@/components/ui/DetailPage";
import { PlatformArchitecture } from "@/components/company/PlatformArchitecture";
import { DevelopmentRoadmap } from "@/components/ui/DevelopmentRoadmap";
import { business, verifiedValue, statusLabels } from "@/content/business";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "/products/",
  "Products & prototypes",
  "Existing engineering projects and CAD prototypes, with architecture, evidence and development status.",
);
export default function ProductsPage() {
  return (
    <DetailPage
      eyebrow={`${business.displayName} / Products`}
      title="Robotics & industrial automation."
      introduction="Meet our main products: Quadropod for robotics development and Industrial LoRa Platform, a completed factory monitoring and automation project. Device software supports the broader engineering work."
    >
      {business.products.map((product) => (
        <article
          key={product.id}
          id={product.id}
          className="detail-section product-entry"
        >
          <p className="engineering-eyebrow">{product.designation}</p>
          <div className="detail-section-heading">
            <h2>{product.name}</h2>
            <span className="status-tag">{statusLabels[product.status]}</span>
          </div>
          <p>{product.description}</p>
          {product.preview ? (
            <ProductDrawing preview={product.preview} />
          ) : null}
          {product.architectureStages ? (
            <ProductArchitecture
              name={product.name}
              stages={product.architectureStages}
            />
          ) : null}
          {product.id === "pi-control" ? <PlatformArchitecture /> : null}
          <dl className="fact-list">
            {verifiedValue(product.targetUser) ? (
              <div>
                <dt>Target user</dt>
                <dd>{verifiedValue(product.targetUser)}</dd>
              </div>
            ) : null}
            <div>
              <dt>Architecture</dt>
              <dd>{product.architecture}</dd>
            </div>
            <div>
              <dt>Components</dt>
              <dd>{product.components.join(" · ")}</dd>
            </div>
          </dl>
          <nav
            className="evidence-links"
            aria-label={`${product.name} evidence`}
          >
            {product.repository ? (
              <Link href={product.repository}>Repository ↗</Link>
            ) : null}
            {product.demo ? (
              <Link href={product.demo}>Interactive demonstration ↗</Link>
            ) : null}
            {product.evidence.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label} ↗
              </Link>
            ))}
          </nav>
          {product.roadmap.length ? (
            <>
              <h3>Next validation steps</h3>
              <DevelopmentRoadmap items={product.roadmap} />
            </>
          ) : null}
        </article>
      ))}
      <section className="detail-section">
        <h2>
          AI-assisted engineering · {statusLabels[business.claude.status]}
        </h2>
        <p>
          Potential Claude use cases and the proposed deterministic hardware
          safety boundary are documented in the venture roadmap.
        </p>
        <Link href="/venture/">Read the integration plan ↗</Link>
      </section>
    </DetailPage>
  );
}
