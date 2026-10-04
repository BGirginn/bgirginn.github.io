"use client";

import { track } from "@vercel/analytics";
import { Container } from "@/components/ui/Container";
import { siteContent } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-name">
              <span>BG.</span> {siteContent.brand.name}
            </p>
            <p className="footer-tagline">{siteContent.brand.tagline}</p>
          </div>
          <p className="footer-copyright technical-caption">
            {siteContent.brand.copyright}
          </p>
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
