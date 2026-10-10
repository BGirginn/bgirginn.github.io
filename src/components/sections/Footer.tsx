"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { Container } from "@/components/ui/Container";
import { ventureEmail } from "@/content/business";
import { siteContent } from "@/content/site";

export function Footer({ expanded = false }: { expanded?: boolean }) {
  return (
    <footer className="site-footer">
      <Container>
        {expanded ? (
          <div className="company-footer-map">
            <div>
              <p className="engineering-eyebrow">Company</p>
              <nav aria-label="Company pages">
                {siteContent.nav
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
              </nav>
            </div>
            <div>
              <p className="engineering-eyebrow">Development</p>
              <nav aria-label="Engineering resources">
                <Link href="/products/#quadropod">Quadropod</Link>
                <Link href="/products/industrial-lora/">
                  Industrial LoRa Platform
                </Link>
                <Link href="/venture/">Approach & roadmap</Link>
                <Link href="/resources/">Resources & FAQ</Link>
              </nav>
            </div>
            <div>
              <p className="engineering-eyebrow">Get in touch</p>
              <p className="footer-enquiry-note">
                Share your system, its constraints and the next engineering
                step.
              </p>
              <Link href="/contact/">Start a project discussion ↗</Link>
              <a href={`mailto:${ventureEmail}`}>
                Venture inquiries: {ventureEmail}
              </a>
              <Link href="/privacy/">Privacy & site use</Link>
            </div>
          </div>
        ) : null}
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
