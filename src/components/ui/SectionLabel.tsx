type SectionLabelProps = {
  children: string;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
      {children}
    </p>
  );
}
