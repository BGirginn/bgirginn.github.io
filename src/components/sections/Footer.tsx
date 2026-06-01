"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteContent } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xl font-semibold">{siteContent.brand.name}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {siteContent.brand.tagline}
            </p>
            <p className="mt-6 text-sm text-[var(--color-subtle)]">
              {siteContent.brand.copyright}
            </p>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm text-[var(--color-muted)]">
            {siteContent.footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors duration-200 hover:text-[var(--color-gold)]"
                onClick={() => {
                  if (link.label === "CV") track("cv_download");
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
