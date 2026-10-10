"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { siteContent } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = Array.from(
      menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
    );
    links[0]?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = [toggle.current, ...links].filter(
        (element): element is HTMLButtonElement | HTMLAnchorElement =>
          element !== null,
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    setOpen(false);
    if (!href.startsWith("#")) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    window.history.pushState(null, "", href);
    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
      // Move keyboard focus into the selected section after closing the overlay.
      const heading = target.querySelector<HTMLElement>("h1, h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
  }

  return (
    <header className="site-header">
      <div className="container-grid header-inner">
        <Link
          href="/"
          className="site-brand"
          aria-label={`${siteContent.brand.name} home`}
          onClick={(event) => navigate(event, "/")}
        >
          <span className="brand-mark">
            BG<span>.</span>
          </span>
          <span className="brand-copy">
            <strong>{siteContent.brand.name}</strong>
            <span>Hardware & embedded systems</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {siteContent.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => navigate(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/contact/"
            className="header-contact"
            onClick={(event) => navigate(event, "/contact/")}
          >
            Contact <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          ref={menu}
          id="mobile-navigation"
          className="site-menu"
          aria-label="Mobile navigation"
        >
          <div className="container-grid">
            <p className="engineering-eyebrow">
              Navigation / Engineering studies
            </p>
            {siteContent.nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  track("cta_click", {
                    label: item.label,
                    location: "mobile_nav",
                  });
                  navigate(event, item.href);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
