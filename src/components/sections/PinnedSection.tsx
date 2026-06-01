import type { ReactNode } from "react";

type PinnedSectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function PinnedSection({
  id,
  children,
  className = "",
  contentClassName = "",
}: PinnedSectionProps) {
  return (
    <section
      id={id}
      data-scroll-lock
      className={`relative min-h-screen ${className}`}
    >
      <div
        className={`section-shell md:flex md:min-h-screen md:items-center md:py-[calc(var(--header-height)+32px)] ${contentClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
