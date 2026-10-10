import Link from "next/link";
import { ProductArchitecture } from "@/components/company/ProductArchitecture";
import { ProductDrawing } from "@/components/company/ProductDrawing";
import { ArrowUpRight, Cpu, Layers, Radio } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { business, statusLabels } from "@/content/business";

export function ProductShowcase() {
  return (
    <section
      className="company-products"
      aria-labelledby="company-products-heading"
    >
      <Container>
        <div className="company-section-heading">
          <div>
            <p className="engineering-eyebrow">Products & development</p>
            <h2 id="company-products-heading">
              Robotics and industrial systems.
            </h2>
          </div>
          <Link href="/products/" className="company-text-link">
            Explore products <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="company-product-grid">
          {business.products.map((product) => (
            <article
              key={product.id}
              data-product={product.id}
              className={`company-product-card ${business.featuredProductIds.includes(product.id) ? "company-primary-product" : "company-secondary-product"}`}
            >
              <div className="company-product-topline">
                {product.id === "pi-control" ? (
                  <Cpu size={28} aria-hidden="true" />
                ) : product.id === "industrial-lora" ? (
                  <Radio size={28} aria-hidden="true" />
                ) : (
                  <Layers size={28} aria-hidden="true" />
                )}
                <span className="status-tag">
                  {statusLabels[product.status]}
                </span>
              </div>
              <p className="product-designation">{product.designation}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              {product.preview ? (
                <ProductDrawing preview={product.preview} />
              ) : null}
              {product.architectureStages ? (
                <ProductArchitecture
                  name={product.name}
                  stages={product.architectureStages}
                  compact
                />
              ) : null}
              <ul
                className="company-component-list"
                aria-label={`${product.name} components`}
              >
                {product.components.map((component) => (
                  <li key={component}>{component}</li>
                ))}
              </ul>
              <Link
                href={product.detailHref ?? `/products/#${product.id}`}
                className="company-text-link"
              >
                Product details <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
