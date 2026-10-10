import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { business } from "@/content/business";

export function ServiceOverview() {
  return (
    <section
      className="company-overview"
      aria-labelledby="company-overview-heading"
    >
      <Container>
        <div className="company-overview-intro">
          <div>
            <p className="engineering-eyebrow">
              {business.displayName} / Engineering
            </p>
            <h2 id="company-overview-heading">{business.company.headline}</h2>
          </div>
          <div>
            <p>{business.company.description}</p>
            <Link href="/about/" className="company-text-link">
              Meet the company <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="service-overview-list">
          {business.services.map((service, index) => (
            <Link key={service.id} href={`/services/#${service.id}`}>
              <span className="company-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{service.name}</h3>
              <p>{service.summary}</p>
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
