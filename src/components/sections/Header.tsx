"use client";

import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { siteContent } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const targets = siteContent.nav
      .map((item) => document.querySelector(item.href))
      .filter((target): target is Element => target !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  function scrollToHash(href: string) {
    const target = document.querySelector(href);
    if (!target) return;
    window.history.pushState(null, "", href);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[rgba(201,169,110,0.22)] bg-[#080C11]/95 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
      <div className="container-grid flex h-[var(--header-height)] items-center justify-between gap-5">
        <Link
          href="#hero"
          className="flex min-w-0 items-center gap-4"
          aria-label="bgirgin.dev home"
        >
          <span className="grid h-11 w-11 place-items-center border border-[var(--color-gold)] bg-[rgba(201,169,110,0.08)] text-lg font-semibold tracking-tight">
            BG
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-semibold leading-none">
              {siteContent.brand.name}
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
              {siteContent.brand.tagline}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 border border-[var(--color-border)] bg-[rgba(255,255,255,0.025)] p-1 lg:flex">
          {siteContent.nav.map((item) => {
            const id = item.href.replace("#", "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-200 hover:text-[var(--color-gold)] ${
                  active === id
                    ? "bg-[rgba(201,169,110,0.1)] text-[var(--color-gold)]"
                    : "text-[var(--color-muted)]"
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHash(item.href);
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/cv.pdf"
            className="hidden h-11 items-center gap-2 border border-[var(--color-border)] px-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)] transition-colors duration-200 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] sm:inline-flex"
            onClick={() => track("cv_download", { location: "top_bar" })}
          >
            <Download size={15} />
            CV
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center border border-[var(--color-border)] text-[var(--color-text)] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 top-[var(--header-height)] z-40 bg-[var(--color-bg)] lg:hidden">
          <nav className="container-grid flex h-full flex-col justify-center gap-8">
            {siteContent.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[clamp(38px,12vw,64px)] font-semibold leading-none"
                onClick={() => {
                  track("cta_click", { label: item.label, location: "mobile_nav" });
                  scrollToHash(item.href);
                  setOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
