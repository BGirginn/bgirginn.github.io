"use client";

import { track } from "@vercel/analytics";
import { Container } from "@/components/ui/Container";
import { siteContent } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="footer-name">
              <span>BG.</span> {siteContent.brand.name}
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {siteContent.brand.tagline}
            </p>
            <p className="mt-6 technical-caption">
              {siteContent.brand.copyright}
            </p>
          </div>
          <nav className="footer-links" aria-label="Social and document links">
            {siteContent.footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors duration-200 hover:text-[var(--color-gold)]"
                onClick={() => {
                  if (link.label === "CV") track("cv_download");
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
